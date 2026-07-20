-- Read-only audit for the discarded streak-flow experiment.
-- Run this first in the Supabase SQL editor.

SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'player_streaks' AND column_name = 'pending_intent_id')
    OR
    (table_name = 'player_streak_reward_claims'
      AND column_name IN ('submission_complete', 'delivery_result'))
  )
ORDER BY table_name, column_name;

SELECT
  routine_schema,
  routine_name,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'enqueue_daily_streak_intent';

SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname = 'idx_player_streaks_pending_intent';

SELECT
  p.pubname,
  n.nspname AS schemaname,
  c.relname AS tablename
FROM pg_catalog.pg_publication AS p
JOIN pg_catalog.pg_publication_rel AS pr
  ON pr.prpubid = p.oid
JOIN pg_catalog.pg_class AS c
  ON c.oid = pr.prrelid
JOIN pg_catalog.pg_namespace AS n
  ON n.oid = c.relnamespace
WHERE p.pubname = 'supabase_realtime'
  AND n.nspname = 'public'
  AND c.relname = 'player_streaks';

SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'player_streaks',
    'player_streak_events',
    'player_streak_presentations',
    'player_streak_reward_claims',
    'torii_worker_intent_queue',
    'torii_worker_transaction_queue',
    'torii_worker_transaction_batches'
  )
ORDER BY tablename, policyname;

SELECT
  grantee,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated', 'service_role')
  AND table_name IN (
    'player_streaks',
    'player_streak_events',
    'player_streak_presentations',
    'player_streak_reward_claims',
    'torii_worker_intent_queue',
    'torii_worker_transaction_queue',
    'torii_worker_transaction_batches'
  )
ORDER BY table_name, grantee, privilege_type;

SELECT version
FROM supabase_migrations.schema_migrations
WHERE version IN ('20260719120000', '20260720160000', '20260720173000')
ORDER BY version;

-- This result is informational. The rollback intentionally does not rewrite
-- reward statuses because the previous migration did not leave enough data to
-- distinguish every pre-existing `claiming` row from a reconciled one.
SELECT status, COUNT(*) AS claim_count
FROM public.player_streak_reward_claims
GROUP BY status
ORDER BY status;
