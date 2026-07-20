-- OPTIONAL: literal RLS restoration to the permissive policies present in the
-- clean develop migrations.
--
-- DO NOT run this for the recommended rollback. It grants anonymous mutation
-- access to streak state and worker queues. It is provided only to document the
-- exact schema-policy delta against develop.

BEGIN;

DROP POLICY IF EXISTS "Server manages player streaks"
  ON public.player_streaks;
DROP POLICY IF EXISTS "Allow all operations on player streaks"
  ON public.player_streaks;
CREATE POLICY "Allow all operations on player streaks"
  ON public.player_streaks
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Server manages player streak events"
  ON public.player_streak_events;
DROP POLICY IF EXISTS "Allow all operations on player streak events"
  ON public.player_streak_events;
CREATE POLICY "Allow all operations on player streak events"
  ON public.player_streak_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Server manages streak presentations"
  ON public.player_streak_presentations;
DROP POLICY IF EXISTS "Allow all operations on player streak presentations"
  ON public.player_streak_presentations;
CREATE POLICY "Allow all operations on player streak presentations"
  ON public.player_streak_presentations
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Server manages worker intents"
  ON public.torii_worker_intent_queue;
DROP POLICY IF EXISTS "Allow all operations on intent queue"
  ON public.torii_worker_intent_queue;
CREATE POLICY "Allow all operations on intent queue"
  ON public.torii_worker_intent_queue
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Server manages legacy worker queue"
  ON public.torii_worker_transaction_queue;
DROP POLICY IF EXISTS "Allow all operations on transaction queue"
  ON public.torii_worker_transaction_queue;
CREATE POLICY "Allow all operations on transaction queue"
  ON public.torii_worker_transaction_queue
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Server manages worker batches"
  ON public.torii_worker_transaction_batches;
DROP POLICY IF EXISTS "Allow all operations on worker transaction batches"
  ON public.torii_worker_transaction_batches;
CREATE POLICY "Allow all operations on worker transaction batches"
  ON public.torii_worker_transaction_batches
  FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Server manages streak reward claims"
  ON public.player_streak_reward_claims;
DROP POLICY IF EXISTS "Anon can upsert player streak reward claims"
  ON public.player_streak_reward_claims;
CREATE POLICY "Anon can upsert player streak reward claims"
  ON public.player_streak_reward_claims
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.player_streaks,
     public.player_streak_events,
     public.player_streak_presentations,
     public.torii_worker_intent_queue,
     public.torii_worker_transaction_queue,
     public.torii_worker_transaction_batches
  TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE
  ON public.player_streak_reward_claims
  TO anon, authenticated;

NOTIFY pgrst, 'reload schema';

COMMIT;
