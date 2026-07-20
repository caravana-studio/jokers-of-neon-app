# Streak presentation rebuild

Date: 2026-07-20

## Scope and clean baselines

This rebuild starts from clean upstream branches and deliberately excludes the
previous streak-flow experiments.

| Repository | Branch | Upstream base |
| --- | --- | --- |
| App | `fix/streak-flow-rebuild` | `origin/main` at `f2673c10` |
| API | `fix/streak-flow-rebuild` | `origin/develop` at `f4dbb56` |
| Torii worker | `fix/streak-flow-rebuild` | `origin/develop` at `aca5fa0` |

The old `fix/streak-flow-hardening` branches and commits remain available for
reference. They are not part of this rebuild.

The immediate priority is the presentation flow. The existing on-chain streak,
protector, and milestone reward rules remain unchanged in the first iteration.

## Expected product behavior

1. Completing a daily mission starts or increments the daily streak.
2. Missing a day consumes available protection; without enough protection, the
   streak resets according to the profile contract.
3. Reaching configured streak milestones makes rewards available.
4. The streak-increased presentation is shown at most once per player and daily
   period.
5. Waiting for the worker, API, or Starknet must never block completing a round,
   leaving rewards, entering the map, or returning home.
6. For this iteration, losing an in-memory presentation attempt when the app is
   closed is acceptable. While the app stays open, delayed confirmation must
   still be handled.

## Baseline flow

### Core and profile

The core mission completion event is the authoritative signal that a mission was
completed. The profile contract remains the source of truth for the resulting
streak, protection consumption, and unlocked streak milestones.

### Worker

The worker observes `MissionCompletedV2Event`, writes an optimistic `pending`
streak cache row, and queues `xp.mission_completed` for the profile contract.
When the transaction batch succeeds, it marks the locally projected cache row as
`confirmed`.

The current `confirmed` value means that the transaction batch completed; it
does not prove that the cache was re-read from the profile contract. This cache
accuracy issue should be handled separately from the presentation rebuild.

### API

The API reads `player_streaks`, falling back to the profile contract only when
there is no cached row or a refresh is explicitly requested.

`POST /api/profile/streak/:player/presentation/claim` currently inserts the
once-per-player/period presentation receipt immediately. Reading the result and
consuming it are therefore the same operation.

### App

The app calls `claimStreakPresentation` from home, rewards, store, and summary.
Some of those calls are awaited inside navigation handlers, and summary renders
a full-screen loading state while checking. Home only checks once per account
mount. A negative result received before the worker updates its cache is not
automatically reconsidered.

The app's raw `MissionCompletedV2Event` parser also needs a receipt-layout test.
The captured receipt contains two leading metadata felts; the previous parser
read the daily period from the wrong offset (`1` instead of `20654`).

## What the failed experiments proved

### One bounded wait was too short

In a captured successful mission, the profile transaction settled roughly 16
seconds after the mission event. A single eight-second wait returned before the
presentation became eligible, so the app continued without showing it.

### Retrying an awaited wait blocked the game

Replacing the bounded wait with an unbounded retry loop made the transition stay
on its loading state. For game `15059`, the worker logs contained `create_game`
but no `mission_completed` event. The API correctly kept returning a timeout,
while the app retried forever. A missing mission signal is a normal terminal
case, not a reason to block navigation.

### Claiming before mounting can lose the presentation

The baseline API records the receipt before the app navigates to the presentation
route. If navigation, rendering, or app lifecycle interrupts that gap, the next
claim returns `already_claimed` even though the screen was never mounted.

### UI receipt state does not belong in core

Core already provides the economic and progression source of truth: daily
mission completion and the resulting profile streak. Whether a client mounted a
presentation is UI delivery state. Putting it on-chain would add another
transaction and another confirmation dependency without making navigation more
reliable. A server-side idempotency receipt is sufficient.

## Rebuild invariants

- No streak network request may be awaited by normal game navigation.
- No page may render a blocking loader only because presentation eligibility is
  unknown.
- Retries must run in one deduplicated, cancellable background task.
- Every individual network request must have a deadline. Timing out only
  schedules a later background attempt; it never changes the current route or
  loading state.
- A mission event is a hint to start checking, not a promise that the worker has
  already updated the cache.
- Presentation discovery must not consume the once-per-day receipt.
- The receipt is consumed only after the presentation route has mounted.
- A pending presentation may interrupt only at an explicitly safe boundary:
  rewards, store, summary, map, or home. It must not appear in the middle of a
  hand.
- Duplicate React effects, responses, or route renders must still produce one
  presentation.
- Streak rewards remain idempotent and tied to server-created claim IDs.

## Proposed first implementation

### API: split discovery from consumption

Add a non-consuming presentation eligibility endpoint. It returns the current
eligibility, streak, and period without inserting the daily presentation
receipt. Keep the existing claim endpoint as the atomic once-per-day consumer;
that response also prepares the existing idempotent reward claim IDs.

The presentation page calls `claim` on mount. An app close after that call may
lose the visible presentation, which is explicitly acceptable for this phase.
Calling claim before navigation is not acceptable.

No long-polling endpoint is required. Each request should be short and bounded.

### App: background discovery plus safe delivery

Introduce one in-memory presentation coordinator:

1. A parsed daily mission event requests a background eligibility check.
2. The coordinator polls the short API endpoint with bounded requests and capped
   backoff. Polling is detached from the round/navigation promise and can continue
   until the app closes, the account changes, or eligibility is found.
3. Once eligible, it stores one pending presentation in memory.
4. A safe route boundary consumes that in-memory pending navigation and opens
   `/streak-increased` with the correct continuation.
5. `StreakIncreasedPage` atomically claims the server receipt after mounting. If
   another client already claimed it, the page resumes its continuation.
6. Safe-route entry performs a non-blocking discovery check so a receipt that
   became eligible between polling attempts can still be found.

All current direct, awaited presentation claims in rewards, store, summary, and
home should be removed.

### Worker: no presentation change in phase one

The worker's core-event observation and pending cache write are already enough
to make presentation eligibility discoverable. The first presentation fix should
not add another worker wait or transaction.

Separately, the worker cache should eventually distinguish transaction success
from a contract-verified cache refresh. That work is useful for the displayed
streak status but is not a prerequisite for proving the non-blocking presentation
flow.

## Required validation

1. No mission completed: leaving a round is immediate, no presentation polling
   loop starts, and no streak loader is shown.
2. Mission completed with a 20-second worker delay: the user can continue
   immediately; the presentation appears later at the next safe boundary.
3. API timeout or network failure: navigation remains immediate and the bounded
   attempt eventually stops.
4. Duplicate mission events and React effects: only one polling task and one
   presentation occur.
5. Presentation route mounts, then claim succeeds: the screen renders once and
   returns to its expected continuation.
6. The same player and period cannot be presented twice.
7. Raw receipt parsing yields player, period type, period `20654`, mission, XP,
   and game ID from the captured event layout.
8. Existing streak reward claims remain idempotent.
9. App, API, and worker unit/build checks pass independently.

## Deployment boundary

The proposed first implementation requires an API and app deployment. The worker
only needs redeployment if phase-one validation reveals that its existing mission
event/cache update is missing or malformed. Core/profile contracts are out of
scope for the presentation rebuild.
