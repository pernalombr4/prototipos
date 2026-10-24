# Per-workflow protections in no-code / low-code iPaaS (n8n, Make, Zapier, Power Automate, Retool Workflows, Windmill)

Research date: 2026-10-24. Sources are official docs unless marked. Labels in **bold** are the UI labels as the source states them.

## 1. Is there a per-workflow settings screen, what is it called, how is it reached, which fields?

### Takeaway
All 6 products have a per-workflow settings surface, but its content differs: n8n and Make concentrate execution/error/data-retention rules in one modal; Zapier splits them between an "advanced settings" sidebar in the editor (flood protection, autoreplay, error setting) and Zap history (notifications); Power Automate puts protections on the trigger's Settings pane (concurrency, split on, trigger conditions) and per action; Retool and Windmill put most protections per block/step, with a few flow-level tabs.

### Cited Findings

**n8n**
- Reached via the Workflow menu (three dots, upper-right) > **Settings**; opens the **Workflow settings** modal — [n8n docs: Workflow settings](https://docs.n8n.io/workflows/settings/)
- Fields: **Execution order** (**v1 (recommended)** / **v0 (legacy)**); **Error Workflow (to notify when this one errors)**; **This workflow can be called by**; **Timezone** (if neither workflow nor instance sets one, n8n uses EDT New York); **Save failed production executions**; **Save successful production executions**; **Save manual executions**; **Save execution progress** (with **Save**, an errored workflow can resume from where it stopped, may add latency); **Timeout Workflow** (when on, a **Timeout After** field appears in hours/minutes/seconds; "n8n Cloud enforces a maximum timeout per plan"); **Redact production execution data**; **Redact manual execution data** (locked to **Redact** if an admin enforces it); **Estimated time saved**; **Custom span attributes** — [n8n docs: Workflow settings](https://docs.n8n.io/workflows/settings/)
- The current docs speak of "published workflows" (production) — [n8n docs: Workflow settings](https://docs.n8n.io/workflows/settings/)
- Per-node protections live in each node's **Settings** tab: **Always Output Data**, **Execute Once**, **Retry On Fail**, **On Error** (**Stop Workflow** / **Continue** / **Continue (using error output)**), **Notes**, **Display note in flow** — [n8n docs: Nodes](https://docs.n8n.io/workflows/components/nodes/)

**Make**
- Reached via the gear icon (scenario settings) in the Scenario Builder — [Make Help: Scenario settings](https://help.make.com/scenario-settings)
- Current labels (several renamed from older names; mapping given by the fetched page): **Process data in order** (formerly "Sequential processing"); **Keep data confidential** (formerly "Data is confidential"); **Store incomplete executions** (formerly "Allow storing of incomplete executions"); **Discard data if storage is full** (formerly "Enable data loss"); **Use updated variable values**; **Errors before deactivation** (formerly "Number of consecutive errors"); **Commit after each module** (formerly "Auto commit"); **Commit trigger last**; **Cycles per run** (formerly "Max number of cycles") — [Make Help: Scenario settings](https://help.make.com/scenario-settings)
- Scheduling (interval + **Advanced scheduling** with time-from/time-to window and days) is set on the trigger's schedule, separate from the settings panel; source is community forum, not official docs — [Make Community: run only daytime](https://community.make.com/t/can-i-make-a-scenario-run-only-in-the-day-time/100444); [Make Community: interval vs Advanced scheduling](https://community.make.com/t/tool-logic-run-scenario-at-regular-intervals-is-not-synched-to-advanced-scheduling-time-to/100243)

**Zapier**
- Per-Zap: open the Zap in the editor > gear-shaped **advanced settings** icon in the left sidebar. Contains **Flood protection** dropdown (polling Zaps only); on Enterprise also **Autoreplay override**, **Error ratio override**, **Polling interval** — [Zapier Help: Adjust flood protection limits](https://help.zapier.com/hc/en-us/articles/32466537676685)
- Per-Zap **Autoreplay** options: "Your default account settings" / "Always Replay" / "Never Replay"; per-Zap **Error setting**: "Turn off if errors occur (recommended)" (account default) / "Keep running if errors occur" — [Zapier Help: Decide how your Zap handles errors](https://help.zapier.com/hc/en-us/articles/14167175792909-Decide-how-your-Zap-handles-errors-with-advanced-settings)
- Per-Zap error notifications are reached from Zap history > **Error notification settings** — [Zapier Help: Manage notifications when errors occur](https://help.zapier.com/hc/en-us/articles/8496289225229)

**Power Automate**
- Protections sit on the trigger's settings: turn on **Concurrency control** in the trigger settings and set the **degree of parallelism** — [Microsoft Learn: Optimize triggers](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)
- Third-party walkthrough of the path: trigger's three-dot menu > **Settings** > **Concurrency Control** toggle > **Degree of Parallelism** slider > Done (unverified against current UI) — [WPS guide](https://www.wps.com/office-quick-solution/others/how-to-stop-power-automate-from-creating-duplicate-approval-requests/)
- Trigger conditions are set on the trigger to avoid runs that a later Condition would discard — [Microsoft Learn: Optimize triggers](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)
- "Split on" is a trigger property that debatches arrays into multiple runs — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)

**Retool Workflows**
- Timeout, retries and "Finally" behavior are block-level settings (each block's **Settings**); the limits page lists only block-level timeouts as configurable — [Retool: Workflow limits](https://docs.retool.com/workflows/concepts/limits); [Retool: Loop block reference](https://docs.retool.com/workflows/reference/objects/block/loop)

**Windmill**
- Flow-level **Flow Settings** menu with a **Concurrency** tab; steps have an **Advanced** menu with **Concurrency**, **Retries**, **Early stop/Break** — [Windmill: Concurrency limit (flows)](https://www.windmill.dev/docs/flows/concurrency_limit); [Windmill: Retries](https://www.windmill.dev/docs/flows/retries); [Windmill: Early stop](https://www.windmill.dev/docs/flows/early_stop)
- Script/flow runtime settings: **Concurrency limits**, **Debouncing**, **Worker group tag**, **Cache**, **Timeout**, **Perpetual script**, **Dedicated workers** (Enterprise), **Delete after use**, **High priority script** (1 to 100), **Runs visibility** — [Windmill: Script settings](https://www.windmill.dev/docs/script_editor/settings)

### Inferences
- Make's renaming (e.g. "Sequential processing" -> "Process data in order", "Number of consecutive errors" -> "Errors before deactivation") moves labels from technical to plain-language, which is the register relevant to ENSPACE business users.
- n8n and Make are the closest analogues to a single "Protections" tab; Zapier shows the same set can be split by plan tier.

### Gaps
- n8n: the option list of **This workflow can be called by** and defaults for the save/timeout toggles are not on the fetched page.
- Make: official scheduling article was not reachable; exact labels of the Advanced scheduling dialog unconfirmed.
- Retool: no workflow-level settings screen with protections was found in the docs fetched.
- Windmill: the full list of Flow Settings tabs was not documented on the fetched pages.

## 2. Rate limiting / throttling and concurrency (max runs, parallel executions, sequential processing)

### Takeaway
Only Windmill offers a true per-flow rate limit (N runs per time window, with a key). Power Automate and Make offer concurrency/sequential controls per flow. n8n's concurrency limit is instance-wide (env var / Cloud plan), not per workflow. Zapier's per-Zap control is flood protection (a burst threshold on polling triggers). Retool has fixed platform limits per workflow.

### Cited Findings

**n8n**
- Self-hosted concurrency: env var `N8N_CONCURRENCY_PRODUCTION_LIMIT`; disabled by default; applies to the instance's production executions (webhook/trigger started); manual, sub-workflow, error and CLI executions are not limited; no per-workflow limit described — [n8n docs: Concurrency control](https://docs.n8n.io/hosting/scaling/concurrency-control/)
- In queue mode the same variable sets the worker limit and overrides `--concurrency` when not `-1`; evaluation runs use `N8N_CONCURRENCY_EVALUATION_LIMIT` (Community/Pro 1, Business 3, Enterprise 5) — [n8n docs: Concurrency control](https://docs.n8n.io/hosting/scaling/concurrency-control/)
- Cloud concurrency by plan: Starter/Trial 5; Pro (10k executions) 20; Pro (50k) 50; Enterprise 200 (from a mirror of n8n docs; main page points to pricing) — [n8n docs mirror: Cloud concurrency](https://n8n-docs.teamlab.info/manage-cloud/concurrency/); [n8n docs: Cloud concurrency](https://docs.n8n.io/manage-cloud/concurrency)

**Make**
- **Process data in order** on: each run finishes before the next starts; new runs wait until incomplete executions are resolved. Webhooks run in parallel by default; with it on, each waits for the previous execution — [Make Help: Scenario settings](https://help.make.com/scenario-settings)
- **Cycles per run**: max cycles in one execution; **Run once** ignores it and performs 1 cycle — [Make Help: Scenario settings](https://help.make.com/scenario-settings)

**Zapier**
- Flood protection: polling-trigger Zaps are held when 100 or more events trigger at once; counted before Filter/Path steps; instant triggers not affected, except Google Sheets and Google Calendar "New Event"/"Updated Event" — [Zapier Help: Flood protection](https://help.zapier.com/hc/en-us/articles/8496181445261-Flood-protection-limits-in-Zaps)
- Per-Zap override maximum: 1,500 events at once; app's per-poll caps and rate limits still apply; plans: Professional, Team, Enterprise (not Free); Enterprise can change the account default — [Zapier Help: Adjust flood protection limits](https://help.zapier.com/hc/en-us/articles/32466537676685)
- Older community post said support could raise limits to 1,000 or 2,000 (superseded by the 1,500 cap) — [Zapier Community](https://community.zapier.com/how-do-i-3/removing-flood-protection-from-a-specific-zap-96)

**Power Automate**
- Concurrent runs: unlimited with Concurrency Control off; 1 to 100 when on, "defaults to 25"; off by default; "can't be undone without deleting and re-adding the trigger" — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Conflict: the guidance page says "By default, the degree of parallelism is set to 1" once turned on, and "To remove concurrency control, you need to create a new flow" — [Microsoft Learn: Optimize triggers](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers); contradicts "defaults to 25" in [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Apply to each concurrency: default 1, configurable 1 to 50 — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Split on items: 5,000 (Low) / 100,000 (others) without trigger concurrency; 100 with trigger concurrency — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Platform request limits: 100,000 Power Platform requests per 5 minutes; per 24 h 10,000 (Low), 200,000 (Medium), 500,000 (High), 10,000,000 (Unlimited Extended) — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)

**Retool Workflows**
- Concurrency: 100 runs of the same workflow in a 15-minute window on Cloud; burst limit 200 triggers in a 10-second window on Cloud; self-hosted unlimited by default, configurable via env vars; outbound 50 in-flight requests per workflow (`WORKFLOW_REQUEST_CONCURRENCY_LIMIT`) — [Retool: Workflow limits](https://docs.retool.com/workflows/concepts/limits)
- Schedule triggers: minimum interval 1 minute; a run must finish before the next starts; jitter `random(0, min(6 minutes, 10% of the interval))` — [Retool: Workflow limits](https://docs.retool.com/workflows/concepts/limits)

**Windmill**
- Concurrency limit fields: time window (seconds), max executions in the window, optional custom concurrency key; flow-level in Flow Settings > **Concurrency**; step-level **Maximum number of runs** + **Per time window (seconds)**; limit is global across runs — [Windmill: Concurrency limit (flows)](https://www.windmill.dev/docs/flows/concurrency_limit)
- Key can be scoped with `$workspace` or `$args[name_of_arg]`; Cloud plans and Self-Hosted Enterprise only — [Windmill: Concurrency limits](https://windmill.dev/docs/core_concepts/concurrency_limits)
- Debouncing cancels pending jobs with identical characteristics submitted within a time window — [Windmill: Script settings](https://www.windmill.dev/docs/script_editor/settings); a debounce node per step with delay, custom key, argument accumulation, max debouncing time and max debounce count — [Windmill changelog: Debounce node](https://www.windmill.dev/changelog/debounce-node)

### Inferences
- Windmill's "N runs per window, keyed by an argument" is the only model found that maps directly to a "max runs per minute/hour per flow" protection; keyed limits (e.g. per item or per customer) would let Spaceflow throttle per record.
- Power Automate's irreversible concurrency toggle is a known usability trap; a Spaceflow design can avoid irreversibility.

### Gaps
- No product found with a user-facing "max runs per hour/day" field per workflow other than Windmill's window-based limit.
- n8n official Cloud concurrency numbers come from a mirror; main page defers to pricing.

## 3. What happens to the excess (queued, dropped, delayed, error, held for approval)?

### Takeaway
Queueing is the norm (n8n FIFO, Windmill next slot, Power Automate waiting runs, Make waits in order). Zapier is the only one that holds the excess and asks the user by email to confirm (manual approval). Power Automate caps the waiting queue and may lose triggers beyond it.

### Cited Findings
- n8n: executions over the limit are queued and processed FIFO; queued executions can't be retried; cancelling/deleting removes from the queue; on restart, queued executions resume up to the limit — [n8n docs: Concurrency control](https://docs.n8n.io/hosting/scaling/concurrency-control/)
- Make: with **Process data in order**, new runs wait until the previous one and incomplete executions are resolved — [Make Help: Scenario settings](https://help.make.com/scenario-settings)
- Zapier: held events trigger an email asking the user to confirm; after confirming, use Replay; replayed runs process at 1 per second (1,000 runs take a little over 15 minutes); held runs can be deleted; Zapier "may also spread out groups of tasks" — [Zapier Help: Flood protection](https://help.zapier.com/hc/en-us/articles/8496181445261-Flood-protection-limits-in-Zaps)
- Power Automate: waiting runs = 10 plus the degree of parallelism; triggers arriving when the waiting limit is met "might be re-tried by the connector" but may not succeed; Microsoft recommends leaving Concurrency Control off "to ensure all triggers result in flow runs" — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Power Automate throttling: exceeding limits slows flow activity, which resumes when the sliding window drops; flows consistently above limits for 14 days are turned off — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Power Automate turn-off: polling triggers resume from the last poll when turned back on (all missed events processed); webhook triggers drop events that occurred while off — [Microsoft Learn: Optimize triggers](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)
- Retool: at the concurrency limit, "one of the runs must complete ... before another can start"; rejection vs queue not described — [Retool: Workflow limits](https://docs.retool.com/workflows/concepts/limits)
- Windmill: jobs over the limit are queued for the next available slot — [Windmill: Concurrency limit (flows)](https://www.windmill.dev/docs/flows/concurrency_limit)
- Windmill debouncing cancels (drops) older pending duplicate jobs — [Windmill: Script settings](https://www.windmill.dev/docs/script_editor/settings)

### Inferences
- Zapier's hold-and-confirm is the precedent for a "pause and ask the owner" option, aimed at protecting task quota from bursts (e.g. bulk imports).
- A proposal can offer 3 outcomes for excess: queue (default), drop duplicates (debounce), hold for approval.

### Gaps
- Retool's behavior when burst limit is exceeded (429, drop, queue) is not documented on the limits page.
- Windmill queue capacity limits not documented.

## 4. Execution timeout, retries (count, interval, backoff), per-step vs per-workflow

### Takeaway
Workflow-level timeout is user-configurable in n8n (Timeout Workflow); platform-fixed in Power Automate (30 days) and Retool (30 h async). Retries are per step/node/action everywhere except Make and Zapier, where retries are about re-running incomplete/errored runs (Break handler, Autoreplay).

### Cited Findings
- n8n: **Timeout Workflow** + **Timeout After** (h/m/s); Cloud enforces a plan maximum — [n8n docs: Workflow settings](https://docs.n8n.io/workflows/settings/); node-level **Retry On Fail** — [n8n docs: Nodes](https://docs.n8n.io/workflows/components/nodes/)
- Make: Break handler auto-retry with "Automatically complete execution", **Number of attempts** (1 to 100), **Interval between attempts** (minutes); retries use original input; one Make doc says interval grows exponentially every other attempt; ConnectionError and RateLimitError auto-retried by default when incomplete executions are enabled (summary of search results incl. Make help) — [Make Help: Break error handler (legacy URL)](https://make.com/en/help/errors/retry); [Adobe Workfront Fusion (Make-based)](https://experienceleague.adobe.com/en/docs/workfront-fusion/using/create-scenarios/configure-error-handling/resolve-error-from-break-directive)
- Make current error handlers: **Skip**, **Retry**, **Resume**, **Commit**, **Rollback** ("Ignore"/"Break" appear renamed to Skip/Retry) — [Make Help: Error handlers](https://help.make.com/error-handlers)
- Zapier Autoreplay: replays any run with errored status; account-wide toggle in Zap History > Zap Runs tab (Professional, Team, Enterprise; owners/super admins on Team/Enterprise); per-Zap override **Use account setting / Always replay / Never replay** — [Zapier Help: Replay failed Zap runs](https://help.zapier.com/hc/en-us/articles/8496241726989-Replay-failed-Zap-runs)
- Zapier Autoreplay schedule "up to 5 times, 5 min, 30 min, 1 h, 3 h, 6 h" and no error emails while it runs: reported in search summary, not confirmed on fetched pages — [Zapier Help (search result)](https://help.zapier.com/hc/en-us/articles/8496241726989-Replay-failed-Zap-runs)
- Power Automate: run duration 30 days (pending steps time out after); outbound sync request 120 s; outbound async configurable up to 30 days; inbound request 120 s; Until default 60 iterations, max 5,000 — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Power Automate default retry: Low plan up to 2 retries, exponential, scaling by 5 min up to ~10 min; Medium/High up to 12 retries, exponential, scaling by 7 s up to ~1 hour; custom policy max 90 attempts, max delay 1 day, min delay 5 s — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Retool: async run 30 hours (unlimited with User Task/Wait blocks); Wait block max 60 days; sync 15 min to first Response block; block defaults 10 s; Code blocks up to 10 min Cloud / 24 days self-hosted; Workflow blocks up to 3 min — [Retool: Workflow limits](https://docs.retool.com/workflows/concepts/limits)
- Retool block retries: retry count, minimum interval, optional exponential backoff with coefficient and max interval; "Finally" controls whether failure stops the workflow or goes to an error handler — [Retool: Loop block reference](https://docs.retool.com/workflows/reference/objects/block/loop)
- Windmill retries per step (**Advanced > Retries**): **Constant retry enabled** (attempts + delay) and **Exponential backoff enabled** (attempts, base, multiplier; delay = multiplier * base ^ attempt; e.g. 6 s, 18 s, 54 s, 162 s, 486 s); both can combine; default step behavior "Stop on error and propagate error up" — [Windmill: Retries](https://www.windmill.dev/docs/flows/retries)
- Windmill **Timeout** setting stops execution after a set duration — [Windmill: Script settings](https://www.windmill.dev/docs/script_editor/settings)

### Inferences
- For business users, Power Automate's preset policies (Default / exponential with fixed caps) and Zapier's on/off Autoreplay are simpler than per-step numeric retries; a Spaceflow tab could expose "Retry automatically: yes/no" with a fixed schedule.

### Gaps
- n8n **Max Tries** / **Wait Between Tries** defaults not on fetched page (commonly 3 and 1000 ms, unverified).
- n8n Cloud max timeout per plan: numbers not found.
- Make Break defaults for attempts/interval not found.

## 5. Auto-deactivation after N errors, incomplete executions, error handler/workflow, notifications

### Takeaway
Circuit breakers exist in Make (Errors before deactivation; instant triggers deactivate on first error), Zapier (pause at 95% errored runs in 7 days, per-Zap opt-out) and Power Automate (turned off after 14 days of continuous failures or throttling; 90 days without triggers). n8n and Windmill rely on error workflows/handlers instead.

### Cited Findings
- Make **Errors before deactivation**: number of consecutive errors before the scenario deactivates; ignored for instant triggers, which deactivate immediately after the first error — [Make Help: Scenario settings](https://help.make.com/scenario-settings)
- Make **Store incomplete executions** on: scenario pauses, failed run goes to incomplete executions folder to fix and continue; off: run stops and rolls back; counts toward storage; **Discard data if storage is full** discards failed data irrecoverably — [Make Help: Scenario settings](https://help.make.com/scenario-settings)
- Make incomplete executions disabled by default (Boost.space doc, Make-based) — [Boost.space: Incomplete executions](https://legacy-api.boost.space/scenarios/incomplete-executions)
- Zapier: Zap paused automatically when 95% or more of runs in last 7 days error; per-Zap "Keep running if errors occur" on Company plans — [Zapier Help: Decide how your Zap handles errors](https://help.zapier.com/hc/en-us/articles/14167175792909-Decide-how-your-Zap-handles-errors-with-advanced-settings); same 95%/7 days rule for "Stopped / Errored" status — [Zapier Platform: API outage](https://docs.zapier.com/platform/manage/api-outage)
- Zapier notifications: to account email; **Immediately** (default) / **Immediately, then hourly summary** / **Hourly summary** / **Never** (not recommended); priority label High/Medium/Low; no email when an error handler runs — [Zapier Help: Manage notifications](https://help.zapier.com/hc/en-us/articles/8496289225229)
- Zapier per-Zap action-error customization on Pro, Team, Company; Free/Starter only a default rule; trigger errors: Never / Repeated / Always — [Zapier Help: Customize action error notifications](https://help.zapier.com/hc/en-us/articles/14095911742861-Customize-your-action-error-notifications); [Zapier Help: Customize trigger error notifications](https://help.zapier.com/hc/en-us/articles/15666606859661-Customize-your-trigger-error-notifications)
- Power Automate: flows with trigger/actions failing continuously turned off after 14 days; consistently throttled flows turned off after 14 days; flows not triggered in 90 days might be turned off (premium/process licenses exempt), owners notified 30 days before; turning off lets in-progress runs finish, deleting cancels them — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- n8n: **Error Workflow** starts with Error Trigger node; receives execution ID, URL, last node, error message, stack, mode, `retryOf`, workflow ID/name; trigger failures send a `trigger` object instead; **Stop and Error** node forces a failure — [n8n docs: Error handling](https://docs.n8n.io/flow-logic/error-handling/)
- Windmill flow error handler: special step; runs after a step exhausts retries; flow still ends failed unless handler returns `recover: true` — [Windmill: Flow error handler](https://www.windmill.dev/docs/flows/flow_error_handler)
- Retool: failed run's error details via `workflowContext.currentRun.error` in error handlers — [Retool: Error handlers](https://docs.retool.com/3.334/workflows/guides/error-handlers)

### Inferences
- Make's "deactivate on first error for instant triggers" and Zapier's error-ratio pause are two distinct circuit-breaker models: count of consecutive errors vs ratio over a window.

### Gaps
- Make default value of **Errors before deactivation** not on fetched page (widely cited as 3, unverified).
- n8n: no automatic deactivation after errors found in docs.
- Who receives Power Automate turn-off emails beyond owners/co-owners: not detailed.

## 6. Daily/monthly quotas per workflow, schedule windows / business hours

### Takeaway
No product found offers a per-workflow daily/monthly run cap set by the builder; quotas are account/plan level (Zapier tasks, Make operations, Power Platform requests). Schedule windows exist in Make (Advanced scheduling) and via schedule/cron elsewhere; Windmill's flow-level early stop can skip runs by input condition.

### Cited Findings
- Power Platform daily request allocations by license (see section 2) are per flow/license, not user-set caps — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Make Advanced scheduling restricts a window (e.g. every 15 min between 8 and 16 on weekdays); time zone from account settings (community) — [Make Community](https://community.make.com/t/can-i-make-a-scenario-run-only-in-the-day-time/100444); [Make Community: date range](https://community.make.com/t/scenario-interval-scheduling-with-date-range/84539)
- n8n **Timezone** setting affects the Schedule Trigger — [n8n docs: Workflow settings](https://docs.n8n.io/workflows/settings/)
- Windmill flow-level early stop: if flow inputs meet a condition the flow does not run; optional "Label flow as 'skipped' if stopped" — [Windmill: Early stop](https://www.windmill.dev/docs/flows/early_stop)
- Power Automate trigger conditions prevent runs unless a condition is met — [Microsoft Learn: Optimize triggers](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)

### Inferences
- A per-workflow daily cap would be a differentiator for Spaceflow; Zapier's flood protection is the nearest analogue (burst cap, not daily).

### Gaps
- No official source found for per-workflow daily/monthly caps in any of the 6 products.

## 7. Deduplication / idempotency of triggers

### Takeaway
Zapier deduplicates polling triggers by primary key (`id` by default); Windmill offers debouncing; Power Automate and n8n leave it to trigger conditions or flow logic.

### Cited Findings
- Zapier: primary key defaults to `id`; each poll compares keys with all seen keys; on Zap turn-on an initial call caches existing ids; list cleared when Zap is turned off; ID format change re-fires old records — [Zapier Platform: Deduplication](https://platform.zapier.com/build/deduplication)
- Windmill debouncing with custom key and accumulation — [Windmill: Script settings](https://www.windmill.dev/docs/script_editor/settings); [Windmill changelog: Debounce node](https://www.windmill.dev/changelog/debounce-node)
- Power Automate concurrency control used to prevent "dirty reads" — [Microsoft Learn: Optimize triggers](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)

### Inferences
- Debounce keyed by record (e.g. same item updated 5 times in 10 s runs once) is a fit for ENSPACE item-change triggers.

### Gaps
- Make, n8n and Retool: no documented built-in trigger dedup setting found.

## 8. Defaults and plan-dependent limits (summary)

### Takeaway
Protections are often plan-gated: Zapier (flood protection paid; per-Zap autoreplay/error setting Company/Enterprise), Windmill (concurrency Cloud/EE), n8n Cloud (concurrency and timeout by plan), Power Automate (retry policy and request limits by license tier).

### Cited Findings
- Zapier flood protection: Professional, Team, Enterprise — [Zapier Help](https://help.zapier.com/hc/en-us/articles/32466537676685); per-Zap overrides Company — [Zapier Help](https://help.zapier.com/hc/en-us/articles/14167175792909-Decide-how-your-Zap-handles-errors-with-advanced-settings)
- Windmill concurrency limit: Cloud plans and Self-Hosted EE — [Windmill](https://www.windmill.dev/docs/flows/concurrency_limit)
- n8n Cloud concurrency 5/20/50/200 by plan — [n8n docs mirror](https://n8n-docs.teamlab.info/manage-cloud/concurrency/)
- Power Automate retry defaults differ Low vs Medium/High — [Microsoft Learn: Limits](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- Make **Commit after each module** default Off; **Commit trigger last** default On — [Make Help: Scenario settings](https://help.make.com/scenario-settings)

### Inferences
- Defaults favor "keep running" and "queue everything" except Zapier (turn off on errors by default) and Make instant triggers (deactivate on first error).

### Gaps
- Most toggle defaults in n8n and Make are not stated in the fetched docs.
