-- Recommended rollback for the discarded streak-flow experiment.
--
-- Required order:
--   1. Stop or redeploy API and worker from fix/streak-flow-rebuild.
--   2. Back up player_streak_reward_claims if delivery_result is needed later.
--   3. Run this file once in the Supabase SQL editor.
--
-- This script preserves all streak, presentation, event, queue, and reward rows.
-- It does not restore reward status values changed by the reconciliation
-- migration because that transformation is not exactly reversible without a
-- pre-migration backup.
--
-- The stricter server-only RLS policies are intentionally preserved. They are
-- compatible with the clean API/worker, which use service_role, and reverting
-- them would reopen anonymous writes.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.player_streaks') IS NULL THEN
    RAISE EXCEPTION 'Missing required table public.player_streaks';
  END IF;

  IF to_regclass('public.player_streak_reward_claims') IS NULL THEN
    RAISE EXCEPTION 'Missing required table public.player_streak_reward_claims';
  END IF;
END;
$$;

-- Added by worker migration 20260719120000 and replaced by 20260720160000.
DROP FUNCTION IF EXISTS public.enqueue_daily_streak_intent(JSONB, JSONB, JSONB);

DROP INDEX IF EXISTS public.idx_player_streaks_pending_intent;

ALTER TABLE public.player_streaks
  DROP COLUMN IF EXISTS pending_intent_id;

-- Added by API migration 20260720173000.
ALTER TABLE public.player_streak_reward_claims
  DROP COLUMN IF EXISTS submission_complete,
  DROP COLUMN IF EXISTS delivery_result;

-- Added only so the discarded API could long-poll streak cache transitions.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_catalog.pg_publication AS publication
    JOIN pg_catalog.pg_publication_rel AS publication_relation
      ON publication_relation.prpubid = publication.oid
    JOIN pg_catalog.pg_class AS relation
      ON relation.oid = publication_relation.prrelid
    JOIN pg_catalog.pg_namespace AS namespace
      ON namespace.oid = relation.relnamespace
    WHERE publication.pubname = 'supabase_realtime'
      AND namespace.nspname = 'public'
      AND relation.relname = 'player_streaks'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.player_streaks';
  END IF;
END;
$$;

-- Remove remote migration history entries that no longer exist on the clean
-- branches. If a migration was applied manually, its DELETE simply affects zero
-- rows.
DELETE FROM supabase_migrations.schema_migrations
WHERE version IN ('20260719120000', '20260720160000', '20260720173000');

NOTIFY pgrst, 'reload schema';

COMMIT;

-- Expected result: no rows.
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'player_streaks' AND column_name = 'pending_intent_id')
    OR
    (table_name = 'player_streak_reward_claims'
      AND column_name IN ('submission_complete', 'delivery_result'))
  );

-- Expected result: false.
SELECT to_regprocedure(
  'public.enqueue_daily_streak_intent(jsonb,jsonb,jsonb)'
) IS NOT NULL AS atomic_streak_rpc_still_exists;

-- Expected result: no rows.
SELECT version
FROM supabase_migrations.schema_migrations
WHERE version IN ('20260719120000', '20260720160000', '20260720173000');
