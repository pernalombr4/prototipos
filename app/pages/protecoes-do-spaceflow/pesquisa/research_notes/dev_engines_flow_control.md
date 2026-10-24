# Flow-control primitives in developer workflow engines (Inngest, Trigger.dev, Temporal, AWS Step Functions/Lambda, GitHub Actions, Airflow, Hatchet, Windmill)

Research date: 2026-10-24. All facts below come from the official docs fetched that day, unless marked otherwise.
Plain-language glossary for the business-user tab is at the end of each section under "Inferences".

## 1. Concurrency limits: global vs per key, and what happens to the excess

### Takeaway
Every engine offers a "max at the same time" cap, usually with an optional key that splits the cap per customer, record or tenant. The default fate of excess work is **wait in a queue (FIFO, best effort)**; cancelling is always an explicit opt-in, and the engines that cancel name which run wins (newest or the one in progress).

### Cited Findings
**Inngest (`concurrency`)**
- Fields: `limit` (number; `0` or undefined = no limit; `concurrency: 10` is shorthand for `{ limit: 10 }`), `key` (CEL expression evaluated on the triggering event, producing a queue name), `scope` = `'fn'` (default) | `'env'` | `'account'`; `env` and `account` require a key — [Inngest concurrency](https://www.inngest.com/docs/guides/concurrency)
- "Functions can specify up to 2 concurrency constraints at once"; a step starts only when it fits every limit — [Inngest concurrency](https://www.inngest.com/docs/guides/concurrency)
- Excess: "Inngest queues steps above the concurrency limit and starts them when capacity opens." Ordering is "best-effort FIFO" within a function and key; across keys "ordering is not guaranteed" (fairness). The doc suggests a start timeout so stale queued work is dropped — [Inngest concurrency](https://www.inngest.com/docs/guides/concurrency)
- The limit counts **steps executing code**, not runs in progress: "step.sleep(), step.sleepUntil(), step.waitForEvent(), and step.invoke() do not use a slot while they wait." — [Inngest concurrency](https://www.inngest.com/docs/guides/concurrency)
- Max value is plan-dependent; numbers not stated on the page — [Inngest concurrency](https://www.inngest.com/docs/guides/concurrency)

**Inngest (`singleton`)** — run-level "only one at a time per key"
- `key` (CEL, required) and `mode`: `skip` = "Inngest skips the new run and preserves the active one"; `cancel` = "Inngest cancels the active run and starts a run for the new event." — [Inngest singleton](https://www.inngest.com/docs/guides/singleton)
- "Cancellation does not undo steps that already completed"; a running step finishes before cancel takes effect; a retrying run keeps its slot; cannot be combined with batching — [Inngest singleton](https://www.inngest.com/docs/guides/singleton)

**Trigger.dev (queues / `concurrency` / `concurrencyKey`)**
- A triggered run "waits in a queue and runs start in trigger order as capacity allows"; excess runs don't consume a slot until they start — [Trigger.dev queue & concurrency](https://trigger.dev/docs/queue-concurrency)
- Current API: named limits via `concurrencyLimit({ name, total })` or `concurrencyLimit({ name, perKey })`; `{ perKey, total }` combines both ("each key gets at most `perKey`, and all runs together never exceed `total`"); a task takes one inline shape plus up to two named limits; the older `queue: { concurrencyLimit: n }` "is deprecated in favor of `concurrency`" — [Trigger.dev queue & concurrency](https://trigger.dev/docs/queue-concurrency)
- `concurrencyKey`: "Each unique key value gets its own pool under every `perKey` bound the run holds." — [Trigger.dev queue & concurrency](https://trigger.dev/docs/queue-concurrency)
- Default: "all tasks have an unbounded concurrency limit, limited only by the overall concurrency limits of your environment"; environment has a base limit and a burst limit with "default burst factor of 2.0x" — [Trigger.dev queue & concurrency](https://trigger.dev/docs/queue-concurrency)
- Waiting releases slots only after checkpoint: "Concurrency is only released when a run reaches a waitpoint and is checkpointed"; for `wait.for()`/`wait.until()` checkpointing happens 60 s into the wait — [Trigger.dev queue & concurrency](https://trigger.dev/docs/queue-concurrency)

**GitHub Actions (`concurrency`)**
- Keys: `group` (string/expression; case-insensitive), `cancel-in-progress` (default off; can be an expression), `queue` = `single` (default) | `max` — [GitHub: control concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency); [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- "There can be at most one running job or workflow in a concurrency group at any time." With `queue: single`, a new arrival cancels the existing pending one ("any existing `pending` job or workflow in the same concurrency group will be canceled") — i.e., **newest pending wins, oldest pending is discarded** — [GitHub: control concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency)
- `cancel-in-progress: true` also cancels the running one (newest wins outright). `queue: max` allows up to 100 pending; beyond that, runs are rejected/cancelled; `queue: max` + `cancel-in-progress: true` is a validation error. Ordering FIFO but "not guaranteed" — [GitHub: control concurrency](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency); [GitHub limits](https://docs.github.com/en/actions/reference/limits)

**Hatchet (concurrency strategies)**
- `expression` (CEL, e.g. `input.group`) + `max_runs` (max concurrent per key) + strategy:
  - `GROUP_ROUND_ROBIN`: "If no slots are available, the new task or workflow is added to a queue for its key"; dequeued round-robin across keys (fairness).
  - `CANCEL_IN_PROGRESS`: "a running instance ... with the same concurrency key will be cancelled to free up a slot" (newest wins).
  - `CANCEL_NEWEST`: "the newly triggered run is cancelled immediately, allowing the in-progress runs to continue uninterrupted" (oldest wins).
  — [Hatchet concurrency](https://docs.hatchet.run/home/concurrency)
- Multiple strategies chain: "every limit in the chain applies at once" — [Hatchet concurrency](https://docs.hatchet.run/home/concurrency)

**Apache Airflow (3.3.2 config reference)**
- `[core] max_active_runs_per_dag` = `16`; `[core] max_active_tasks_per_dag` = `16`; `[core] parallelism` = `32`; `[core] default_pool_task_slot_count` = `128` (pools are shared slot buckets across DAGs) — [Airflow configuration reference](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html)
- DAG-level `max_active_runs` / `max_active_tasks` override these per DAG (parameter names known; not on the fetched DAG page) — see Gaps.

**AWS Step Functions (Map state)**
- `MaxConcurrency`: upper bound on parallel iterations; "The default value is `0`, which places no limit on concurrency"; `1` = strict sequential in input order; Inline mode "supports up to 40 concurrent iterations"; excess iterations "won't begin until previous iterations are complete" — [Step Functions Inline Map](https://docs.aws.amazon.com/step-functions/latest/dg/state-map-inline.html)

**Windmill (concurrency limit, dev side)**
- Parameters: "Max number of executions within the time window", "Time window in seconds", optional custom concurrency key (global by default; `$workspace` or `$args[name]` to scope) — [Windmill concurrency limit](https://www.windmill.dev/docs/script_editor/concurrency_limit)
- Excess: "the job is queued for execution at the next available optimal slot." Runs can be filtered by key in the Runs menu. Cloud plans / Self-Hosted EE only — [Windmill concurrency limit](https://www.windmill.dev/docs/script_editor/concurrency_limit)

### Inferences
- Three distinct concepts are worth naming separately in a UI:
  1. **Simultaneous runs limit** (queue the excess) — Inngest `concurrency`, Trigger.dev `concurrency`, Airflow `max_active_runs`, Hatchet `GROUP_ROUND_ROBIN`.
  2. **One at a time per record, keep the current** (discard the newcomer) — Inngest `singleton: skip`, Hatchet `CANCEL_NEWEST`.
  3. **One at a time per record, replace with the newest** — Inngest `singleton: cancel`, GitHub `cancel-in-progress: true`, Hatchet `CANCEL_IN_PROGRESS`.
- Sensible default for business users: queue (nothing lost), FIFO, per-key option "per item/record". Cancel modes must say clearly that already-completed steps are not undone (Inngest states this explicitly).
- Plain terms: "Concurrency = how many copies of this flow can be working at the same moment. Key = 'per what' (per item, per customer). Extra executions wait in line."
- Note the slot unit differs: Inngest counts executing steps (waits free the slot), Trigger.dev counts runs but frees on checkpoint, Airflow counts runs/tasks. For Spaceflow, counting **runs** is simpler to explain; waiting nodes ("Aguardar") could release the slot like Inngest.

### Gaps
- Airflow DAG-level `max_active_runs`, `max_active_tasks`, `dagrun_timeout`, `catchup` defaults were not on the fetched DAG page; only the `[core]` config defaults were confirmed.
- Inngest numeric plan caps for concurrency not stated in docs fetched.
- Lambda reserved concurrency and EventBridge throttling semantics were not fetched (only the "Throttle = set concurrency to zero" console action, cited in section 6).
- Temporal has no per-workflow concurrency limit primitive in the docs fetched; Temporal Cloud namespace rate limits (actions per second) not fetched.

## 2. Throttling vs rate limiting (and debounce, batching, priority)

### Takeaway
Inngest gives the cleanest vocabulary: **throttle = delay excess starts (keep every event)**, **rateLimit = skip excess events (lossy)**, **debounce = wait for quiet, run once with the last event**, **batchEvents = run once for N events**. Trigger.dev adds debounce with a leading/trailing choice; Hatchet and Windmill rate limits re-queue rather than drop.

### Cited Findings
**Inngest `throttle`**
- `limit` (runs allowed to start per `period`), `period` (min 1 s, max 7 days, 1 s granularity), `burst` ("Within a period, at most `limit + burst` runs may start"), `key` (each distinct value has its own limit) — [Inngest throttling](https://www.inngest.com/docs/guides/throttling)
- Excess: "When the throttle has no capacity, the run waits in the queue; it is not discarded." FIFO. A start timeout can expire stale delayed runs — [Inngest throttling](https://www.inngest.com/docs/guides/throttling)

**Inngest `rateLimit`**
- `limit`, `period`, optional `key` (CEL). Excess events are **skipped, not queued**; the event stays stored but "does not start this function." Use "only when you can discard excess runs." Example: one sync per company every 4 hours keyed on `event.data.company_id` — [Inngest rate limiting](https://www.inngest.com/docs/guides/rate-limiting)
- Uses GCRA, so "Do not treat the period as a calendar window that resets at a fixed clock time." — [Inngest rate limiting](https://www.inngest.com/docs/guides/rate-limiting)
- Period range conflict: guide says TS v4 allows `1s` to `24h` — [Inngest rate limiting](https://www.inngest.com/docs/guides/rate-limiting); the SDK reference says `period` 1s to 60s — [Inngest createFunction reference](https://www.inngest.com/docs/reference/typescript/functions/create). Treat the guide (24h) as current; the reference page may be stale.

**Inngest `debounce`**
- `period` (1s to 7d), `key` (CEL), `timeout` (max time incoming events can keep extending the wait). "The handler receives the **last event** in the burst." "Debounce cannot be combined with batching." — [Inngest debounce](https://www.inngest.com/docs/guides/debounce)

**Inngest `batchEvents`**
- `maxSize`, `timeout`, `key`, `if`. Plan limits: events per batch Free 5 / Pro 100 / Business 500; max timeout Free 30 s, Pro/Business 5 min; 10 MiB cap. A run starts when the batch hits `maxSize`, the timeout expires or the cap is reached. Not combinable with idempotency, rate limiting, cancellation events, priority, debounce — [Inngest batching](https://www.inngest.com/docs/guides/batching)
- Conflict: SDK reference says `maxSize` max 100 and `timeout` 1s–60s — [Inngest createFunction reference](https://www.inngest.com/docs/reference/typescript/functions/create)

**Inngest `priority`**
- `priority.run`: CEL expression returning an integer factor in seconds; "The default allowed range is **-600 to 600 seconds**"; positive pulls forward only when there is a backlog; negative is a fixed delay ("not eligible to start until 60 seconds after it was enqueued, even on an idle queue"); invalid expression = `0` — [Inngest priority](https://www.inngest.com/docs/guides/priority)

**Trigger.dev debounce**
- `debounce: { key, delay, mode }` on `trigger()`; same key "reschedule[s] the existing delayed run"; `mode` `"leading"` (default, first payload) or `"trailing"` (last payload); idempotency is checked before debounce; SDK 4.3.1+ — [Trigger.dev changelog: debounced task runs](https://trigger.dev/changelog/debounced-task-runs)
- `maxDelay` caps how long a debounced run can be pushed back (search-result summary of the changelog; not confirmed on the fetched page) — [Trigger.dev changelog](https://trigger.dev/changelog/debounced-task-runs)

**Trigger.dev TTL** (queue expiry)
- `ttl` per trigger, per task or global in `trigger.config.ts`; a run not dequeued within the TTL expires and never runs; `ttl: 0` opts a task out of the global default (search-result summaries, primary page not fetched) — [Trigger.dev v4.4.0 changelog](https://trigger.dev/changelog/v4-4-0)

**Hatchet rate limits**
- Static (`static_key`, declared at worker start with `limit` and `duration` = `SECOND`|`MINUTE`|`HOUR`) and dynamic (`dynamic_key` CEL, `units`, `limit` as int or CEL). "If a step run exceeds the rate limit, Hatchet re-queues the step run until the rate limit is no longer exceeded." Put the limit on the entry step to gate the whole workflow — [Hatchet rate limits](https://docs.hatchet.run/home/rate-limits)

**Windmill**: its "concurrency limit" is in fact a rate window (max executions per N seconds, excess queued) — [Windmill concurrency limit](https://www.windmill.dev/docs/script_editor/concurrency_limit)

### Inferences
- Naming for Spaceflow (plain terms):
  - **Throttle / "Limite de ritmo"**: "no more than X executions start per minute; the rest wait their turn." Lossless. Good default protection against floods.
  - **Rate limit / "Limite com descarte"**: "at most X per period; the extras are ignored and logged as skipped." Lossy; must show a skipped count.
  - **Debounce / "Esperar estabilizar"**: "if the item changes many times in a row, run once after Y seconds of quiet, with the latest data." Offer a max wait (`timeout`/`maxDelay`) so continuous edits never block forever.
  - **Batch / "Agrupar"**: "collect up to N events or wait T seconds, then run once for the group."
- Inngest's incompatibility rules (batch excludes debounce, priority, idempotency, rate limit, cancel) are a useful guardrail list for the UI: disable conflicting toggles.
- Trigger.dev's leading vs trailing choice maps to "use the first change" vs "use the latest change"; trailing (latest data) is the safer default for record updates, which is Inngest's only behavior.

### Gaps
- Trigger.dev has no documented throttle (lossless rate) or lossy rate limit per task in the pages fetched; only concurrency, debounce and TTL.
- Inngest rate-limit period max and batch limits conflict between guide and SDK reference (noted above).
- Airflow has no throttle/rate primitive besides pools (slot-based), per pages fetched.

## 3. Idempotency / deduplication

### Takeaway
Deduplication is expressed as a key with a time window: Inngest 24 h, Trigger.dev 30 days by default; Temporal does it through Workflow ID policies. Duplicates are not errors: Inngest stores and ignores them, Trigger.dev returns the original run.

### Cited Findings
- Inngest event-level: event `id` "acts as an idempotency key **over a 24 hour period**"; duplicate is stored and visible but triggers no functions — [Inngest idempotency](https://www.inngest.com/docs/guides/handling-idempotency)
- Inngest function-level: `idempotency` (CEL) — "Each unique expression will only trigger one function execution **per 24 hour period**"; equivalent to `rateLimit` with key, limit 1, period 24 h — [Inngest idempotency](https://www.inngest.com/docs/guides/handling-idempotency); [Inngest createFunction reference](https://www.inngest.com/docs/reference/typescript/functions/create)
- Trigger.dev: `idempotencyKey` on `trigger()`; `idempotencyKeyTTL` default "30 days"; scopes `run` (default), `attempt`, `global`; duplicate triggers "return the original task run instead of creating a new one"; after failure "the key is automatically cleared" (re-trigger creates a new run); keys can be reset in dashboard or via `idempotencyKeys.reset()` — [Trigger.dev idempotency](https://trigger.dev/docs/idempotency)
- Temporal Workflow ID Reuse Policy (closed workflows): Allow Duplicate (default), Allow Duplicate Failed Only, Reject Duplicate, Terminate if Running. Conflict Policy (open workflow): Fail (default, error `Workflow execution already started`), Use Existing, Terminate Existing — [Temporal Workflow ID](https://docs.temporal.io/workflow-execution/workflowid-runid)

### Inferences
- Plain terms: "Don't run twice for the same thing: if the same item/event arrives again within X hours, ignore it."
- Temporal's matrix is a precise model of the choice Spaceflow would face per item: when a flow is already running for this item → fail / attach to existing / replace; when it already ran → allow / allow only if the previous failed / never again. "Allow only if previous failed" is an elegant business default.

### Gaps
- None material; Inngest doesn't say what UI shows for deduplicated events beyond "visible in history".

## 4. Timeouts, retries with backoff, cancellation

### Takeaway
All engines separate **time waiting to start** from **time running**, and **whole run** from **single step**. Defaults are usually permissive (infinite) except GitHub (6 h per job) and Temporal workflow task (10 s). Retry defaults cluster around exponential backoff ×2 starting at 1 s.

### Cited Findings
**Inngest**
- `timeouts.start` (cancel if not started within X after scheduling) and `timeouts.finish` (cancel if execution exceeds X; excludes start wait). `retries` default `4`, range 0–20. `cancelOn: [{ event, match | if, timeout }]` cancels a run when a matching event arrives. `onFailure` runs after all retries are exhausted — [Inngest createFunction reference](https://www.inngest.com/docs/reference/typescript/functions/create)

**Trigger.dev**
- `maxDuration`: no maximum unless set; minimum 5 s; set in `trigger.config.ts`, per task or per trigger; `timeout.None` disables; measured as CPU time of one execution, excluding `wait.for` and `triggerAndWait`; when exceeded, `cleanup`, `onSuccess`, `onFailure` "will not be called" — [Trigger.dev max duration](https://trigger.dev/docs/runs/max-duration)
- Retry fields `maxAttempts`, `factor`, `minTimeoutInMs`, `maxTimeoutInMs`, `randomize`; doc examples 10 / 1.8 / 500 / 30 000 / false (defaults not stated); task settings override `trigger.config`; `AbortTaskRunError` disables retrying; `catchError` can skip retry or set `retryAt` — [Trigger.dev errors & retrying](https://trigger.dev/docs/errors-retrying)

**Temporal**
- Workflow Execution Timeout default "∞ (infinite)" (covers retries and Continue-As-New); Workflow Run Timeout defaults to the Execution Timeout (one run); Workflow Task Timeout default 10 s, up to 120 s. Docs discourage workflow timeouts, recommending timers — [Temporal detecting workflow failures](https://docs.temporal.io/encyclopedia/detecting-workflow-failures)
- Activity: Schedule-To-Start default ∞; Start-To-Close no default; Schedule-To-Close default ∞; one of Start-To-Close or Schedule-To-Close must be set ("If you set neither timeout, the Temporal Service rejects the Activity"); Heartbeat disabled when `0s` — [Temporal detecting activity failures](https://docs.temporal.io/encyclopedia/detecting-activity-failures)
- Retry Policy defaults: Initial Interval 1 s, Backoff Coefficient 2.0, Maximum Interval 100 × initial, Maximum Attempts unlimited, Non-Retryable Errors none. Activities retry by default; "Workflow Executions do not retry by default." — [Temporal retry policies](https://docs.temporal.io/encyclopedia/retry-policies)

**AWS Step Functions**
- Task `TimeoutSeconds` default 99,999,999 (s); `HeartbeatSeconds` default 99,999,999 and must be < `TimeoutSeconds`; HTTP Task max 60 s; error `States.Timeout` / `States.HeartbeatTimeout` — [Step Functions Task state](https://docs.aws.amazon.com/step-functions/latest/dg/state-task.html); [Step Functions error handling](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html)
- Retrier: `ErrorEquals` (required), `IntervalSeconds` default 1, `MaxAttempts` default 3 (`0` = never retry), `BackoffRate` default 2.0, `MaxDelaySeconds` (no cap if unset), `JitterStrategy` `FULL`|`NONE` (default `NONE`). Without `Retry`, an error fails the **entire** execution by default. `Catch` routes to a fallback state after retries are exhausted — [Step Functions error handling](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html)
- A whole-state-machine `TimeoutSeconds` also raises `States.Timeout` — [Step Functions error handling](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html)

**GitHub Actions**
- GitHub-hosted: "Each job in a workflow can run for up to 6 hours of execution time"; self-hosted job 5 days; self-hosted queue 24 h then auto-cancel; workflow run time 35 days (incl. waiting and approval) — [GitHub Actions limits](https://docs.github.com/en/actions/reference/limits)
- Step `timeout-minutes`: "Maximum: 360 for both GitHub-hosted and self-hosted runners"; "Fractional values are not supported"; `continue-on-error: true` lets the job pass when a step fails — [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- Job `timeout-minutes` default 360 is widely reported by secondary sources — [DEV Community](https://dev.to/suzukishunsuke/set-github-actions-timeout-minutes-1jkk); not confirmed on the official page fetched (truncated).

**Airflow**
- `[core] default_task_retries` = `0`; `[core] default_task_retry_delay` = `300` s; `[core] default_task_execution_timeout` empty = operators never time out by default — [Airflow configuration reference](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html)

### Inferences
- A business UI needs 3 time controls at most: **"Desistir se não começar em X"** (start timeout; Inngest `timeouts.start`, Temporal Schedule-To-Start, Trigger.dev TTL, GitHub 24 h queue), **"Tempo máximo da execução"** (finish timeout; Inngest `timeouts.finish`, GitHub 6 h), **"Tempo máximo por passo"** (Step Functions `TimeoutSeconds`, GitHub step `timeout-minutes`).
- Retry default for an integration node: 3 attempts, 1 s, ×2 backoff, with jitter (Step Functions defaults + Temporal shape). Inngest's 4 is close. Airflow's 0 shows business-safe defaults vary; for side-effecting nodes (send e-mail) retries can duplicate effects, so pair with idempotency.
- `cancelOn` (Inngest) is a strong business concept: "cancel this flow if event X happens for the same item" (e.g., item deleted, status changed back).

### Gaps
- Official confirmation of GitHub job `timeout-minutes` default 360 (page truncated); the 6-hour limit itself is confirmed.
- Trigger.dev retry defaults not stated on the docs page.
- Temporal Cloud-specific limits not researched.

## 5. Failure handlers, alerting, pausing, replay / bulk retry

### Takeaway
Engines combine **a failure branch** (Inngest `onFailure`, Step Functions `Catch`), **manual pause** that keeps incoming events for later replay (Inngest), **bulk replay/cancel** by filter (Inngest, Trigger.dev, Step Functions redrive), and only Airflow documents **automatic pause after N consecutive failures** (off by default).

### Cited Findings
- Inngest `onFailure`: "Called only after all retries are exhausted" — [Inngest createFunction reference](https://www.inngest.com/docs/reference/typescript/functions/create)
- Inngest pause: "Inngest still receives and stores those events, but skips the paused function"; options for in-flight runs: pause after the active step (cancelled after 7 days by default) or cancel after the active step; "Inngest does not interrupt a running step"; on resume, "Events received during the pause do not run automatically" — recover with Replay over the paused window including **Skipped** (and **Canceled**); bounded by plan history; no automatic pause described — [Inngest pause functions](https://www.inngest.com/docs/guides/pause-functions)
- Inngest bulk cancel: function page → "All actions" → date range, name, estimate of affected runs; won't start with 0 matches; REST API supports event-expression matching; docs recommend pausing over cancelling because cancel doesn't stop new enqueues — [Inngest bulk cancellation](https://www.inngest.com/docs/platform/manage/bulk-cancellation); [Inngest blog](https://inngest.com/blog/bulk-cancellation)
- Trigger.dev bulk actions: `runs.bulk.replay()` with a filter (status, task, period; defaults to last 7 days without time filter), `runs.bulk.poll()`, `runs.bulk.abort()`; also in dashboard — [Trigger.dev bulk actions](https://trigger.dev/docs/runs/bulk-actions.md); [Trigger.dev changelog: bulk actions SDK](https://trigger.dev/changelog/bulk-actions-sdk)
- Trigger.dev: pause/resume a concurrency limit in the dashboard Concurrency page or via `concurrencyLimits.pause()`/`resume()`; running runs finish — [Trigger.dev queue & concurrency](https://trigger.dev/docs/queue-concurrency)
- Step Functions redrive: retry counts reset to 0 on redrive; failed executions can be redriven — [Step Functions error handling](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html)
- Airflow: pause/unpause in UI and API; paused DAGs "are not scheduled by the Scheduler, but you can trigger them via UI for manual runs"; auto-pause via DAG `max_consecutive_failed_dag_runs` (experimental), global `[core] max_consecutive_failed_dag_runs_per_dag` default `0` = never auto-pause — [Airflow DAGs](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html); [Airflow configuration reference](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html)

### Inferences
- Plain terms: "Pausar o fluxo: novas ocorrências ficam guardadas e não rodam; ao retomar, você escolhe reprocessar as que chegaram durante a pausa."
- Auto-pause after N consecutive failures (Airflow) plus Inngest's "keep events while paused, replay later" is a coherent protection pair for Spaceflow: break the circuit without losing data.
- Bulk actions UX pattern from Inngest: filter by period/status → show estimate of affected runs → named job → progress. Directly reusable.

### Gaps
- Trigger.dev alert configuration (e-mail/Slack/webhook on failure) not fetched; only mentioned in passing.
- Inngest alerting/notifications on failure not fetched.
- Temporal UI batch operations not fetched.

## 6. Recursion / loop safety

### Takeaway
AWS Lambda is the only engine researched with built-in, default-on loop breaking: it counts invocations along one causal chain and stops at about 16, notifies, and lets the owner opt out per function.

### Cited Findings
- Detection tracks events through X-Ray headers (no need to enable X-Ray); "turned on by default for all AWS customers. There is no charge" — [Lambda recursive loop detection](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)
- "If your function is invoked approximately 16 times in the same chain of requests, then Lambda automatically stops the next function invocation in that request chain and notifies you." Invocations from other triggers are not affected — [Lambda recursive loop detection](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)
- Supported: Lambda, SQS, S3, SNS, EventBridge custom buses; loops through DynamoDB etc. are not detected — [Lambda recursive loop detection](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)
- The stopped event goes to the on-failure destination or DLQ if configured; with SQS the message keeps retrying until `maxReceiveCount` and then goes to the queue's DLQ — [Lambda recursive loop detection](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)
- Notifications: Health Dashboard and e-mail (max 1 e-mail per function per 24 h; up to 3.5 h delay); CloudWatch metric `RecursiveInvocationsDropped` — [Lambda recursive loop detection](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)
- Setting: console "Concurrency and recursion detection" → "Allow recursive loops" / "Terminate recursive loops"; API `PutFunctionRecursionConfig` with `RecursiveLoop` = `Allow` | `Terminate` (default terminate) — [Lambda recursive loop detection](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)
- Recommended response: set the function's concurrency to zero via the "Throttle" button, remove/disable the trigger, fix the code — [Lambda recursive loop detection](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)

### Inferences
- Directly transferable to Spaceflow, where a flow that updates an item can re-trigger itself: carry a chain/depth counter on the event, stop at ~16, record the stopped execution, notify the owner, offer "allow loops" as an explicit opt-out. Plain terms: "Proteção contra loop: se o fluxo dispara a si mesmo em cadeia mais de 16 vezes, o ENSPACE interrompe e avisa."

### Gaps
- No equivalent built-in loop detection found for Inngest, Trigger.dev, Temporal, GitHub Actions, Airflow, Hatchet or Windmill in pages fetched (not exhaustively searched; GitHub prevents `GITHUB_TOKEN`-triggered recursion, but this was not fetched).

## 7. UI vs code exposure; dashboards for queue depth, throttled/skipped counts

### Takeaway
Flow control is declared **in code** in all the developer engines; the UI is for **observing and operating** (pause, resume, cancel, replay, see backlog). Exceptions configured in UI: Windmill (script settings), Lambda recursion setting and Throttle button, Airflow pause toggle, Trigger.dev pause per concurrency limit.

### Cited Findings
- Inngest function dashboard shows throughput charts and marks when concurrency limits are hit; a Backlog chart shows runs waiting — [Inngest observability metrics](https://www.inngest.com/docs/platform/monitor/observability-metrics); [Inngest Function Metrics blog](https://inngest.com/blog/2023-10-27-fn-metrics-release)
- Inngest rate-limited events are stored and "skipped" status is a filter used in Replay — [Inngest pause functions](https://www.inngest.com/docs/guides/pause-functions); [Inngest rate limiting](https://www.inngest.com/docs/guides/rate-limiting)
- Trigger.dev `concurrencyLimits.retrieve()` returns `running` and `queued` counts; dashboard Concurrency page allows pause/resume — [Trigger.dev queue & concurrency](https://trigger.dev/docs/queue-concurrency)
- Windmill configures concurrency limit in the script editor settings and filters runs by concurrency key in the Runs menu — [Windmill concurrency limit](https://www.windmill.dev/docs/script_editor/concurrency_limit)
- Lambda exposes recursion setting and Throttle in console; metric `RecursiveInvocationsDropped` — [Lambda recursive loop detection](https://docs.aws.amazon.com/lambda/latest/dg/invocation-recursion.html)
- Airflow pause/unpause in UI and API — [Airflow DAGs](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/dags.html)

### Inferences
- For a business-user "Protections" tab, the useful split is: **configuration** (limits, keys, timeouts, retries, dedupe, loop guard) and **status** next to each protection ("12 waiting", "3 skipped today", "loop stopped 1×"). The developer engines show that counts of waiting/skipped/dropped are what operators look at; Spaceflow should surface them per protection.

### Gaps
- No engine found with a dedicated "throttled count" metric in the docs fetched; Inngest shows limit-hit markers and backlog, not a skipped-count chart.
- Temporal UI and Hatchet dashboard capabilities for queue depth not fetched.
