# Global execution monitoring in no-code / low-code automation platforms (iPaaS)

Research date: 2026-10-24. Scope: n8n, Zapier, Make, Microsoft Power Automate, Workato (deep); Tray.ai, Retool Workflows, Pipedream, Activepieces, Windmill, Twenty CRM (lighter). Every claim has its URL. "Not documented" means the official page was read and did not mention it; it does not prove the product lacks it.

Context for the reader: ENSPACE Spaceflow today has only a per-workflow executions list (reference, status, version, started at; working/completed/error) and an execution detail. Users ask for (1) aggregate numbers and (2) a global screen to follow a whole operation of chained flows (e.g. 38 interlinked flows triggered by record create/edit events) and to search "which flows is contract X running through?".

## Q1. Is there a global executions list across all workflows? Columns, filters, statuses, time ranges, bulk actions?

### Takeaway
Most platforms now have a global list (n8n, Zapier, Pipedream, Windmill, Twenty, Activepieces, Power Automate Automation center). Make is the exception: history stays per scenario, and the cross-scenario entry point is the org-wide search (Ctrl+K, Runs tab). Workato also has no cross-recipe job list; its global view is an aggregate dashboard that drills down into each recipe's Jobs tab.

### Cited Findings

**n8n**
- Path: **Overview** page > **Executions** tab, listing "executions from all workflows you can access"; inside a project, the project's **Executions** tab shows only that project's workflows — [n8n docs, View all executions](https://docs.n8n.io/build/understand-workflows/understand-executions/view-all-executions.md) (older URL: [docs.n8n.io/workflows/executions/all-executions](https://docs.n8n.io/workflows/executions/all-executions/)).
- **Filters** button with: **Workflows** (all or one), **Status** (**Failed**, **Running**, **Success**, **Waiting**), **Execution start** (time range), **Saved custom data** (key + value) — same source.
- Retry: options menu on a failed execution > **Retry execution** > **Retry with currently saved workflow** or **Retry with original workflow**. Completed nodes keep results; the failed node reprocesses all its input items; if the failed node is **Execute Sub-workflow**, the whole sub-workflow reruns. Each retry creates a new execution. Successful executions cannot be retried; use **Copy to editor** — same source.
- Deleting a workflow deletes its execution history. Failed production executions are not stored if "Save failed production executions" = **Do not save** — same source.
- The docs page does not describe columns, bulk stop/delete or how parent/sub-workflow runs appear in the list — same source.
- History of the global list: a Feb 27, 2023 community thread "Workflow Execution List - Compilation of Feature Requests" asked for date/time range filters, search by execution ID, sort/filter by duration, a custom reference per execution (customer/transaction ID) and (Mar 2, 2023) retry from the All Executions page. Staff (Mar 2, 2023) said date filtering (all editions) and custom-data filtering (paid) were planned for mid-March 2023 — [n8n community](https://community.n8n.io/t/workflow-execution-list-compilation-of-feature-requests/23503).
- Public API lists executions with filters for status, workflow, project, cursor pagination; `includeData` controls detail — [n8n API, execution](https://docs.n8n.io/connect/n8n-api/execution).

**Zapier**
- Path: **Zap history** at zapier.com/app/history, tabs **Zap runs** and **Task usage** — [Zapier help, View and manage your Zap history](https://help.zapier.com/hc/en-us/articles/8496291148685-View-and-manage-your-Zap-history).
- Zap runs: 10 runs per page; filters **Date**, **Zap name**, **apps used**, **folder**, **Zap owner**, **Zap status**; active filters shown as removable buttons; search box finds Zaps and accepts a version number ("v3") or version name to list runs of that version — same source.
- Actions: **replay** unsuccessful runs; checkbox selection > "Delete X" (for playing/waiting runs, deleting also stops them). No bulk "stop" listed — same source.
- Statuses named: filtered, held, stopped, success, playing, waiting (full list in a separate "Review Zap run statuses" article) — same source. "Held" runs (task limit, flood protection of 100+ events at once, polling limits) can be replayed later — [Zapier help, held runs](https://help.zapier.com/hc/en-us/articles/8496181445261).
- Retention: run data guaranteed for up to 60 days; page displays up to 10,000 runs — [Zapier help, Zap history](https://help.zapier.com/hc/en-us/articles/8496291148685-View-and-manage-your-Zap-history).

**Make**
- Per-scenario only: open a scenario > **History** tab. Columns: run date/time, **Run name** (customizable), trigger or activity type, **Status**, run duration, operations, credits, size of transferred data, **Source run**, **Scenario run replay**, **Details**. Statuses: **Success**, **Warning**, **Error**. Options: **Hide check runs**, **Hide change log**; column chooser; **Export to CSV** — [Make help, Scenario history](https://help.make.com/scenario-history.md).
- Error help on a run: **Explain error** (AI), **Resolve error with Maia** (consumes credits), **Get help** — same source.
- Community thread "Is there a way to see timeline of scenario runs across all my scenarios?" was redirected to the Idea Exchange, no official answer — [Make community](https://community.make.com/t/is-there-a-way-to-see-timeline-of-scenario-runs-across-all-my-scenarios/28260).
- White-label (Make's on-prem/partner product) has an instance-wide **Recent executions** page with start-date and status filters (All, Success, Warning, Error) — [Make developers, Access recent executions](https://developers.make.com/white-label-documentation/audit-activity/access-recent-executions).
- Cross-scenario entry point in the SaaS product: global search (see Q3).

**Power Automate**
- **Automation center** > Monitor > **Runs** page: "consolidated view of cloud and desktop flow run data displayed in a hierarchical list view", organized by top-level flow, with tabs **Overview**, **Run history**, **Current desktop flow runs** (with **Auto refresh**). Filters persist across tabs; **Clear filters**; **Show/hide columns** — [Microsoft Learn, Automation center](https://learn.microsoft.com/en-us/power-automate/automation-center-overview) (ms.date 2026-03-06).
- Limits: only solution-aware cloud flows; requires ownership (co-ownership not enough) or environment-wide access; cloud flow run history can take up to 1 hour to appear; retention follows Dataverse TTL for the `flowrun` table — same source.
- Classic per-flow run history: default columns Start, Duration, Status; columns configurable in the per-flow view and in the **All runs** view; run history kept 28 days — [Microsoft Learn, fix flow failures](https://learn.microsoft.com/power-automate/fix-flow-failures); [Missing runs or triggers history](https://learn.microsoft.com/en-AU/troubleshoot/power-platform/power-automate/flow-run-issues/missing-runs-or-triggers-history-for-a-flow).

**Workato**
- Job list is per recipe: open recipe > **Jobs** tab. Statuses: **Completed**, **Failed**, **Processing**, **Paused**, **Aborted**. Filters above the table (options not documented). **Export** to CSV (latest 1,000 rows matching filters). Rerun any job (completed or failed) with the latest recipe version; bulk rerun not documented. No cross-recipe job list documented — [Workato docs, Recipe jobs](https://docs.workato.com/recipes/jobs.html).
- **Cancel Job** exists; cancelling a parent job generally does not cancel child recipe jobs — [Workato docs, Cancel Job](https://docs.workato.com/en/recipes/cancel-job).

**Pipedream**
- Dashboard > **Event History**: filters **Status**, time of initiation (preset or custom range), workflow name (search bar or "Filter By Workflow" in an event's menu). Statuses **Success**, **Error**, **Paused** ($.flow.delay / $.flow.suspend), **Executing**. Bulk **Replay** (in original order) and **Delete**. Workspace admins see all workflows; members must pick a workflow first. Available on all plans; plan limits define how much history is kept — [Pipedream docs, Event History](https://pipedream.com/docs/workflows/event-history.md).

**Windmill**
- Workspace **Runs** menu with all past and future runs; time-series chart (green success, red failure) switchable **Duration** / **Concurrency**; toggles **CRON schedules** and **Planned later**. Filters: datetime; Path, User, Folder, Worker, Concurrency key, Labels; Kind (All, Runs, Previews, Dependencies); Trigger kind (negatable); Status (All, Success, Failure); Skipped flows; **Arguments and Results search**; wildcard toggle. Batch: **cancel** or **re-run** selected jobs or all jobs matching filters (admins), with inputs same/static/JS expression, on original or latest version — [Windmill docs, Jobs runs](https://www.windmill.dev/docs/core_concepts/monitor_past_and_future_runs.md). Concurrency graph and concurrency-key filter added in v1.331.0 (May 2024) — [Windmill changelog](https://windmill.dev/changelog/concurrency-limit-observability).

**Activepieces**
- Dashboard > **Runs**; click a run to open the builder in view-only mode with a **Run Details** panel per step — [Activepieces docs, debugging runs](https://www.activepieces.com/docs/flows/debugging-runs).
- Retry options on failed runs: retry on latest version, or retry from the failed step — [Activepieces community, Retrying failed flows just landed](https://community.activepieces.com/t/retrying-failed-flows-just-landed/2282). Bulk actions: select multiple runs and retry — [Activepieces community, Bulk actions on dashboard](https://community.activepieces.com/t/bulk-actions-on-dashboard-are-here/6740). A user reported retrying 50 failed runs at a time and was pointed to "Select All" — [Activepieces community](https://community.activepieces.com/t/outbound-dns-failing-on-activepieces-cloud-for-over-60-mins/11880).
- Run statuses RUNNING, SUCCEEDED, FAILED, PAUSED; filters by status, flow and date range (third-party mirror of docs, not official) — [mintlify mirror](https://www.mintlify.com/activepieces/activepieces/workflows/debugging).

**Retool Workflows**
- Per workflow **Run history** panel (status bar); log filters by start/end time, block name, level (error, success, info); JSON download. Retention default 30 days, max 90 (Cloud) / 365 (self-hosted), set in Settings > Advanced > Workflows — [Retool docs, Workflow run logs](https://docs.retool.com/workflows/concepts/logs). No global run list across workflows found; cross-workflow monitoring goes through Sentry/Datadog (Enterprise) — same search; [Retool changelog, run panel improvements](https://docs.retool.com/changelog/workflow-run-panel-improvements).

**Twenty CRM (open source)**
- Two places: **Runs** panel in the workflow editor, and a global **Workflow Runs** view in the sidebar "across all workflows", filterable by status, workflow, date. Documented statuses Running, Completed, Failed, Waiting (Delay or Form). Run detail: status, start time, duration, trigger data, step inputs/outputs, errors. No automatic retry documented — [Twenty docs, Workflow runs](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-runs.md).
- `workflowRun` is a standard object with fields name, enqueuedAt, startedAt, endedAt, status, createdBy, updatedBy, state (flow, stepInfos, workflowRunError), stepLogs, position, searchVector, workflowId, workflowVersionId; relations workflow, workflowVersion, timelineActivities. Status enum in code: NOT_STARTED, RUNNING, COMPLETED, FAILED, ENQUEUED, STOPPING, STOPPED — [twentyhq/twenty source](https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-server/src/modules/workflow/common/standard-objects/workflow-run.workspace-entity.ts).

**Tray.ai**
- Execution events streamed via **Log Streaming** with eventType created, started, retrying, failed, created_failed, manually_retried, successful, terminated, plus error fields (message, failing step, errorType internal/input/connector/external). Log streaming is enabled by support ticket; dashboards are built in the external tool — [Tray docs, Log Streaming](https://tray.ai/documentation/platform/enterprise-core/logs-debugging/log-streaming).

### Inferences
- The common baseline in 2026 is: one global list + filters by workflow, status and time range + retry from the list. Spaceflow lacks all three at the global level.
- Twenty's design (runs as a regular record object with a global table view) is the closest analogue to ENSPACE, where executions could be exposed like items in a table view with the standard filters, sort and saved views.
- Windmill and Pipedream show bulk replay/cancel over "all jobs matching current filters"; Zapier and n8n stop at per-run replay/retry plus bulk delete.

### Gaps
- Exact default columns of n8n, Zapier and Activepieces global lists are not in official docs (would need UI screenshots).
- Activepieces official docs do not confirm whether **Runs** is global or per flow; the mirror and community suggest global with a flow filter.
- Whether n8n's global list now has bulk stop/delete and execution-ID search in the UI was not confirmed in official docs (a "Search or filter executions by Execution ID [got created]" topic sits in the "Feature Requests (done)" category, title only).

## Q2. What aggregate metrics / dashboards exist? Which plan tier?

### Takeaway
All 5 main products have an aggregate dashboard, but mostly gated: n8n **Insights** (Pro/Enterprise for the dashboard; summary banner on all plans), Zapier **Analytics dashboard** (Enterprise), Make **Analytics dashboard** (Enterprise), Power Automate **Automation center** Overview (included; Work queues and Process map are Premium), Workato **Operations hub dashboard**. Standard set: total runs, failed runs, failure/error rate, per-workflow table sortable by failures, trend chart, time saved.

### Cited Findings

**n8n Insights**
- Summary banner at the top of the Overview space on all Cloud plans and self-hosted editions; full **Insights** dashboard from the side navigation for instance owners and admins — [n8n docs, Insights](https://docs.n8n.io/insights/).
- Metrics: total production executions (excludes sub-workflow and manual executions), failed production executions, production failure rate, **Time saved** (if configured on at least 1 active workflow), average run time (includes Wait time). Each metric opens its chart. Per-workflow table: production executions, failed, failure rate, time saved, average run time — same source.
- Time ranges: default rolling 7 days compared to previous period. Cloud Pro: 7 and 14 days; self-hosted Business: 24h, 7d, 14d, 30d; Enterprise: up to 90d, 6 months, 1 year. Dashboard plans: Cloud Pro and Enterprise, self-hosted Business and Enterprise. Data collection starts at n8n 1.89.0 — same source.

**Zapier**
- **Analytics dashboard** (Enterprise only; admins, super admins, owners): KPIs **Active Zap workflows**, **Active members**, **Plan usage**, **Successful run rate**, **Alerts**; date filters Past 7 days, Current usage cycle, This month, Custom range; **ROI calculator** (default 2 minutes saved per task, adjustable); **Task usage chart** with projected usage; reports **Top usage by Zap, app, and member** and **Zap workflows with the highest error rates**; CSV export up to 5,000 rows — [Zapier help, Analytics dashboard](https://help.zapier.com/hc/en-us/articles/25444544607373/).
- **Admin Center** dashboard **Insights** section: task usage, Zap run success rate, number of errored and held Zap runs in the period — [Zapier help, Admin center](https://help.zapier.com/hc/en-us/articles/38925392216973/).
- **Task usage** tab (all plans) in Zap history: "Zaps that ran", "Billable Zap tasks", daily bar chart, table of up to 100 Zaps by tasks — [Zapier help, Zap history](https://help.zapier.com/hc/en-us/articles/8496291148685-View-and-manage-your-Zap-history).

**Make**
- **Analytics dashboard** (Enterprise): org-wide operations by team, total operations, total errors, error rate, scenario executions, each with trend indicator; time frames 24h, 7d, 30d; filters Status, Team, Folder; per-scenario table with executions, errors, error rate (selectable columns); deleted scenarios not shown — [Make help, Analytics dashboard](https://help.make.com/analytics-dashboard.md).
- **Make Grid** has a dashboard mode and layers **Credits**, **Data Transfer**, **Operations** with 30-day aggregates per scenario, folder and team — [Make help, Explore Make Grid](https://help.make.com/explore-make-grid.md).

**Power Automate Automation center**
- Runs > **Overview** tab visuals: **Top-level flows** (count with runs), **Total runs**, **Flow runs error rate**, **Flow runs error trends**, **Average desktop flow runs duration**, **Flow runs by status** (donut: succeeded, failed, canceled), **Top flow runs**, **Flow run failures**, plus **Recommendations** (Managed Environment required). Visualizations count top-level runs by default; filters can include child flows — [Microsoft Learn, Automation center](https://learn.microsoft.com/en-us/power-automate/automation-center-overview).
- **Errors** page: **Top errors**, **Error trends** (per error, flow or machine), **Top failed cloud flows**, **Top failed desktop flows**, **Top cloud flows with failed desktop flows**, machine failures; default last 7 days — same source.
- **Work queues** (Premium): SLA status **In / At risk / Out / Not Set**, throughput, requeue rate, average handling time; **Items** tab filterable by queue, status, priority, SLA status, user — same source.
- Value section: **Savings** (ROI/time saved), **Capacity utilization**; **Copilot** answers questions such as "how many flows ran yesterday" — same source.
- Process map **Insights (preview)**: Runs, Failed runs, Failure rate, Average run duration, **MTBF**; panels **Flow runs error trend**, **Top flow error codes**; advanced insights via Process Mining (routes/variants, bottlenecks). Runs under 48 hours old are not counted — [Microsoft Learn, Process map](https://learn.microsoft.com/en-us/power-automate/automation-center-process-map).

**Workato Operations hub dashboard**
- **Jobs graph** (successful jobs, failed jobs, tasks on hover); ranges Last hour, Last 24 hours, Last 7 days (default), Last 30 days, custom. Filters: projects/folders, recipes (with errors, actively running, specific), Service/App (API, scheduled, real-time, connector), Tags. Clicking a bar filters the table — [Workato docs, Operations hub dashboard](https://docs.workato.com/features/admin-dashboard.html).
- **Recipe details table**: successful jobs, failed jobs, tasks used, most recent job; sort by status, successful, failed (default), recent job, tasks. Clicking a count opens that recipe's **Jobs** tab with date filters carried over. **Connections** block: active connections, on-prem agents, accounts connected/disconnected — same source.

**Others**
- Tray **Insights Hub**: tasks over time, error rates, terminations (blog, ~2023) — [Tray blog](https://tray.ai/blog/introducing-tray-insights-hub/).
- Windmill: time-series chart on the Runs page (duration/concurrency), no KPI cards documented — [Windmill docs](https://www.windmill.dev/docs/core_concepts/monitor_past_and_future_runs.md).
- Pipedream, Retool, Twenty, Activepieces: no aggregate dashboard found in the pages read.

### Inferences
- Default comparison window (7 days vs previous 7) and "per-workflow table sorted by failures with click-through to the filtered list" appear in n8n, Workato and Make: a reusable pattern.
- "Running now" as a live counter is rare: only Power Automate's **Current desktop flow runs** (Currently running, Currently queued, Auto refresh) shows it explicitly; others expose it through a Running/Executing status filter.
- Gating aggregate dashboards behind Enterprise (Zapier, Make) is a market norm, so a basic count banner on all plans (n8n model) is a differentiator.

### Gaps
- Workato dashboard access roles and plan are not stated in the page read.
- No official screenshot-level column lists for Zapier Analytics reports.

## Q3. How do users search executions by a business entity or ID?

### Takeaway
3 patterns: (a) builder-declared keys stored on the run (n8n **custom executions data**, Workato **job report custom columns**, Windmill **labels**); (b) full-text search over run data (Make **full-text search** and org-wide **Runs** search, Windmill **Arguments and Results search**); (c) none (Zapier, Pipedream, Retool, Twenty search only by workflow/version). Make is the only one found that searches run data across all scenarios of the organization from one search bar.

### Cited Findings
- **n8n custom executions data**: set with the **Code node** (`$execution.customData.set("key","value")`, `setAll({...})`; Python `_execution.customData`) or the **Execution Data** node (set only). Limits: strings only; key up to 50 chars; value up to 255 chars; up to 10 items per execution. Filter in the executions list with **Saved custom data** (key + value). Plans: Cloud Pro and Enterprise; self-hosted Registered Community and Enterprise — [n8n docs, Custom executions data](https://docs.n8n.io/workflows/executions/custom-executions-data/); [Execution Data node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executiondata).
- n8n API has endpoints to get/update **annotation tags** of an execution by ID — [n8n API, execution](https://docs.n8n.io/connect/n8n-api/execution). Official UI docs for annotations were not found (old URL returns 404).
- **Make full-text search** (History tab > **Fulltext search**): searches terms in module outputs within one scenario's history; opens the matching module and bundle; Pro and higher; after upgrade only new runs are indexed — [Make help, Scenario history](https://help.make.com/scenario-history.md).
- **Make org-wide search**: search bar on every page or Ctrl+K / ⌘+K; tabs **All**, **Scenarios**, **Runs**; runs found by run name or "values within run data, such as an email address or order ID"; scope: scenarios and runs across teams of the organization; click a run to open it in **Scenario history**. Run search Pro and higher; Free/Core return only scenarios. Article created 2026-08-10 — [Make help, Search for scenarios and scenario runs](https://help.make.com/search-for-scenarios-and-scenario-runs.md).
- Make **Run name** column is customizable, which lets builders name a run after a business key — [Make help, Scenario history](https://help.make.com/scenario-history.md).
- **Workato job report**: up to 10 custom columns from recipe datapills; value up to 256 chars; report max 5 KB; recipe must be stopped to edit; not retroactive — [Workato docs, Recipe jobs](https://docs.workato.com/recipes/jobs.html). A community post says table values cannot be filtered and asks for a search field — [Workato community](https://systematic.workato.com/t5/workato-pros-discussion-board/customizing-job-reports-empty/m-p/5564).
- **Windmill**: **Arguments and Results search** filter, **Labels** set by returning `wm_labels` from a script/flow, "filter by argument" from a deployed script page — [Windmill docs](https://www.windmill.dev/docs/core_concepts/monitor_past_and_future_runs.md).
- **Zapier**: Zap runs search matches Zap names and versions only; the Zap runs API filters by date and Zap ID; no data-value search found — [Zapier help, Zap history](https://help.zapier.com/hc/en-us/articles/8496291148685-View-and-manage-your-Zap-history); [Zapier API, get Zap runs](https://docs.zapier.com/powered-by-zapier/api-reference/zaps/get-zap-runs.md). Community workaround: build a run log with Sub-Zaps and Zapier Tables — [Zapier community](https://community.zapier.com/featured-articles-65/how-to-create-a-zap-run-log-with-sub-zaps-and-zapier-tables-51929).
- **Pipedream**: search bar searches workflow name only — [Pipedream docs](https://pipedream.com/docs/workflows/event-history.md).
- **Power Automate**: the Runs page has no data-value search documented; **Work queues > Items** can be filtered by queue, status, priority, SLA, user — [Microsoft Learn, Automation center](https://learn.microsoft.com/en-us/power-automate/automation-center-overview).
- **Twenty**: `workflowRun` has a `searchVector` field, but no field links the run to the record that triggered it; trigger data lives inside `state` — [twentyhq/twenty source](https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-server/src/modules/workflow/common/standard-objects/workflow-run.workspace-entity.ts).

### Inferences
- Builder-declared keys (n8n, Workato) need technical setup in every workflow and are not retroactive; non-technical users cannot rely on them. Make's search over run data needs no setup and answers "where is order X?" directly, at the cost of indexing every run's payload.
- ENSPACE has an advantage none of these have natively: the trigger is a record (item) of the platform itself, so the run can store the item reference as a first-class field. That turns "contract X runs through which flows?" into a filter, not a full-text search. No competitor found shows runs on the triggering record's own page.

### Gaps
- Limits of Make's org-wide run search (result count, retention window, which filters on the Runs tab) are not documented.
- No evidence found that Zapier added data search to Zap runs in 2025–2026.

## Q4. How do they show that one workflow triggered another? Can a user see a business event's full chain?

### Takeaway
Explicit calls (sub-workflow / child flow / Call a scenario) are linked run-to-run in n8n, Zapier, Make and Power Automate. Implicit chains (flow A writes a record, flow B triggers on that record event) are not traced at run level by any product found. Two products draw a map of the whole landscape: **Make Grid** (auto-generated dependency map, static plus 30-day aggregates) and **Power Automate Process map** (parent + child flows, with a Runs view highlighting one run's path). **Zapier Canvas** is a manually drawn diagram.

### Cited Findings

**Run-to-run links (explicit calls)**
- n8n: **View sub-execution** link in the **Execute Sub-workflow** node; the sub-workflow execution links back to the parent execution — [n8n docs, Sub-workflows](https://docs.n8n.io/flow-logic/subworkflows/). Insights excludes sub-workflow executions from totals — [n8n Insights](https://docs.n8n.io/insights/).
- Zapier: **Call a Sub-Zap** action, **Start a Sub-Zap** trigger, **Return From a Sub-Zap**; Zapier added links between the parent Zap run and the Sub-Zap run in the run view; a parent run stays Delayed if no Sub-Zap path returns — [Zapier help, Understanding the Sub-Zap app](https://help.zapier.com/hc/en-us/articles/32283713627533); [Zapier blog, Sub-Zaps guide](https://zapier.com/blog/sub-zaps-guide/).
- Make: **Scenarios > Call a scenario** (sync "Wait for the scenario to finish" = Yes, with **Start scenario** / **Return outputs**; async = No). The module shows the linked scenario status, ID, folder and **Preview** link; output bundles include a link to the triggered run; each run's history links to the scenario that triggered it; scenarios in a chain get a **Relation tree** tab; the scenario list shows chain relations. Page created 2026-03-04 — [Make help, Subscenarios](https://help.make.com/subscenarios.md). History has a **Source run** column — [Make help, Scenario history](https://help.make.com/scenario-history.md).
- Power Automate: Runs page is hierarchical, child cloud/desktop flow runs nested under the top-level run "to monitor the entire automation from start to end" — [Microsoft Learn, Automation center](https://learn.microsoft.com/en-us/power-automate/automation-center-overview).
- Workato: no clickable parent-child job link documented; callable recipe jobs show parent recipe ID and job ID as text in the description; support said a "job-within-a-job" UI was not on the roadmap; workaround: put the child job URL in a job report custom column — [Workato community thread](https://support.workato.com/support/discussions/topics/1000089462); [Workato docs, Call recipe function asynchronously](https://docs.workato.com/en/connectors/recipe-functions/actions/call-recipe-function-asynchronously).
- Twenty: no parent run field in `workflowRun` — [twentyhq/twenty source](https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-server/src/modules/workflow/common/standard-objects/workflow-run.workspace-entity.ts).

**Maps of the landscape**
- **Power Automate Process map** (Premium; flows in a map count as premium): shows the main orchestrating flow and all child flows; detects conditional (dotted line) and missed/skipped flows; side panel per flow box with run, connection and design-time properties. **Runs view** = path of one specific run with status per step; **Overview view** = all possible paths. Legend icons: start/end states, cloud flow, desktop flow, loop (parent calls child n times), stack (child run by several parent runs). Created from Runs (hover a top-level run > process map icon > name > **Create**) or **Process map** tab > **Create a new process map**; generation up to 10 minutes ("Analyzing flow dependencies"). Limits: first 100 child runs per run; 50 levels; dynamic child selection by formula ignored; parallelism not drawn; co-owned/shared flows not supported — [Microsoft Learn, Process map](https://learn.microsoft.com/en-us/power-automate/automation-center-process-map) (ms.date 2025-08-29).
- **Make Grid**: auto-generated, "nothing to configure"; each folder is an island; legend Scenario, Webhook, Asset (data store, Sheets, Airtable, DB), Generic object, Agent, Shared asset; purple arrowed lines = trigger links, violet lines = data links; 2D/3D, dashboard mode, layers Explore/Credits/Data Transfer/Operations; search over blueprint contents (field values, URLs, notes, agent prompts) showing matching scenarios and their dependencies; filters status, folder, apps, creator; **Need your attention** widget (data store capacity exceeded, queued webhook items, deactivations, incomplete executions) that locates the issue on the grid; live cursors. Shows static structure plus 30-day aggregates, not which run triggered which. Help page created 2025-09-16, screenshots Dec 2025–Mar 2026 — [Make help, Explore Make Grid](https://help.make.com/explore-make-grid.md); [Introduction to Make Grid](https://help.make.com/introduction-to-make-grid.md); [Make blog, Introducing Make Grid](https://www.make.com/blog/introducing-make-grid).
- Make Grid supports impact analysis ("identify inter-scenario dependencies and impacts before making changes") — [Make help, Explore Make Grid](https://help.make.com/explore-make-grid?hl=en).
- **Zapier Canvas**: free diagramming tool; place Zaps, Tables, Interfaces, Chatbots and manual steps; existing Zaps added with the Zap icon, **Show steps** toggle; connections drawn by hand with the Connector tool; shows activity metadata (runs, submissions, records); Copilot generates diagrams from text. No auto-detected dependencies or error status described. Article March 2024, updated September 2025 — [Zapier blog, Canvas guide](https://zapier.com/blog/zapier-canvas-guide/).

**Full chain of one business event**
- Power Automate Process map **Runs view** is the closest: one top-level run with all child flow runs and status per step — [Microsoft Learn, Process map](https://learn.microsoft.com/en-us/power-automate/automation-center-process-map). It covers only flows called through child-flow actions (it lists "the main orchestrating flow and all its child flows invoked during a process run").
- Make: following **Source run** / run links hop by hop, plus org-wide run search by a data value (e.g. order ID) that returns runs from any scenario — [Make help, Subscenarios](https://help.make.com/subscenarios.md); [Make help, Search](https://help.make.com/search-for-scenarios-and-scenario-runs.md).
- No product found links runs chained implicitly through a data event (record created/updated by flow A triggering flow B). Zapier help and community results did not show a per-record view of Zaps — search result summary, [Zapier community](https://community.zapier.com/product-updates/new-feature-see-who-triggered-a-zap-via-the-zapier-chrome-extension-7915).

### Inferences
- ENSPACE's case (38 flows chained through item create/edit events) is exactly the implicit chain that competitors do not trace. Because Spaceflow both writes the item and fires the trigger inside the same platform, it can record "this run was caused by the write of run R" (a causation ID) and draw the chain per business event. That would exceed every product here.
- Two complementary views emerge from the market: a static map of which flow feeds which (Make Grid, Process map Overview view) and a run-level path for one event (Process map Runs view). A non-technical operator needs the second, filtered by the item.
- Make Grid's "purple = trigger link, violet = data link" distinction maps to ENSPACE's "flow B triggered by item created" vs "flow writes into category X".

### Gaps
- Whether Make Grid draws a trigger link when scenario A writes to a data store/app record that triggers scenario B (implicit chain) is not stated; the docs show webhooks and assets as nodes, which suggests partial inference via shared assets.
- Plan and GA status of Make Grid in 2026 not stated in the help page; marketing page still showed 2025 open-beta wording.

## Q5. Alerts and notifications on failure, loops, thresholds; error workflows

### Takeaway
Two layers everywhere: built-in email on failure (Zapier, Power Automate, Make) and an "error workflow" hook for custom alerts (n8n **Error Trigger**, Zapier **Zapier Manager**, Workato **RecipeOps**, Tray **Alerting Trigger**). Threshold/priority alerting is Enterprise (Zapier **Alerts** page). Make and Workato auto-disable after repeated errors. Loop detection was not found as a named feature in any product.

### Cited Findings
- n8n: workflow whose first node is **Error Trigger**, selected in each workflow's **Options > Settings > Error workflow**; payload includes execution id, url, retryOf, error message/stack, lastNodeExecuted, mode, workflow id/name; **Stop and Error** node forces failure. No built-in email/Slack alert; alerts are nodes inside the error workflow — [n8n docs, Error handling](https://docs.n8n.io/flow-logic/error-handling/).
- Zapier: email on Zap error by default; frequency Immediately (default), immediately + hourly summary, hourly summary, Never; per-Zap rules from Zap history > **Error notification settings** (Pro, Team, Company); **Zapier Manager** trigger "New Zap Error" for custom alerts; autoreplay delays the trigger until retries end — [Zapier help, notifications](https://help.zapier.com/hc/en-us/articles/8496277613325); [Customize trigger error notifications](https://help.zapier.com/hc/en-us/articles/15666606859661-Customize-your-trigger-error-notifications); [Troubleshoot Zapier Manager](https://help.zapier.com/hc/en-us/articles/8496200014477-Troubleshoot-Zapier-Manager).
- Zapier **Alerts** page (Enterprise, open beta): "a single location to monitor all errors in your Zap workflows", priority per workflow, alert rules to prioritize business-critical workflows — [Zapier help, Track all your Zap errors in one place](https://help.zapier.com/hc/en-us/articles/25444267052557-Track-all-your-Zap-errors-in-one-place-beta). Per search summary: last 7 days extendable to 30, disconnected apps flagged Critical, each alert shows Zap, issue type, frequency, link to the run — [Zapier help, Analytics dashboard (Beta)](https://help.zapier.com/hc/en-us/articles/25444514945037) (not fully verified).
- Zapier flood protection holds 100+ trigger events arriving at once until confirmed by email — [Zapier help, held runs](https://help.zapier.com/hc/en-us/articles/8496181445261).
- Make: on module error the run stops and rolls back; consecutive errors automatically disable the scenario's schedule; warnings do not count — [Make help, Introduction to errors and warnings](https://help.make.com/Introduction-to-errors-and-warnings.md). **Incomplete executions** (off by default, enable in scenario settings) store failed runs for automatic retry, **Retry** handler, manual resolve or delete; org-wide quota — [Make help, Incomplete executions](https://help.make.com/incomplete-executions.md). Filter incomplete executions by resolved/scheduled/in progress/unresolved — [Make community spotlight](https://community.make.com/t/feature-spotlight-filter-incomplete-scenario-execution/112363).
- Power Automate: per-run failure alert for known fixable issues (28-day cooldown per flow) and a **weekly failure digest** of all failures across environments — [Microsoft Learn, Understand flow failure notifications](https://learn.microsoft.com/en-us/power-automate/understand-flow-failure-notifications). Automation center **Recommendations** flag sudden failures and work queues at SLA risk — [Microsoft Learn, Automation center](https://learn.microsoft.com/en-us/power-automate/automation-center-overview).
- Workato **RecipeOps** connector: **Job failed** trigger for all recipes, selected recipe IDs or tagged recipes; a trigger for when Workato stops a recipe (e.g. repeated auth failures) — [Workato docs, Job failed trigger](https://docs.workato.com/connectors/recipeops/triggers/new-failed-job); [Monitor errors with RecipeOps](https://docs.workato.com/recipes/monitor-errors-recipeops).
- Tray: error-handling workflows receive enhanced payloads through the **Alerting Trigger**; May 2025 change: manual error handling follows failure paths without automatic retries — [Tray docs, Log Streaming / error handling](https://tray.ai/documentation/platform/enterprise-core/logs-debugging/log-streaming).

### Inferences
- An "error workflow" pattern fits Spaceflow naturally (a flow triggered by "execution failed"), but non-technical users also need a zero-setup channel (email/in-app bell) and a central list of open problems (Zapier Alerts, Make Grid **Need your attention**).
- Auto-disabling after consecutive errors (Make) is a protection worth noting for chained operations, where one failing flow can stall 37 others.

### Gaps
- No product documented a named loop/recursion detector for flows that re-trigger each other; Zapier flood protection (100+ events) is the closest.

## Q6. Views for non-technical/business users vs technical builders

### Takeaway
Only Power Automate explicitly targets personas (maker, operator, CoE, business analyst) in one hub; Make Grid and Zapier Canvas target "see the whole system" visually; ROI/time-saved views (n8n, Zapier, Power Automate Savings) target managers. Most execution lists remain builder tools (node-level data, JSON).

### Cited Findings
- Automation center "serves as a centralized hub" for "a maker, an operator, a Center of Excellence (CoE) team member, or a business analyst"; **Copilot** answers natural-language questions about activity ("number of flows that ran yesterday", "which queue items are put on hold") — [Microsoft Learn, Automation center](https://learn.microsoft.com/en-us/power-automate/automation-center-overview).
- Process map Insights aims to "share a consistent view across makers, operators, and Center of Excellence (CoE) teams" — [Microsoft Learn, Process map](https://learn.microsoft.com/en-us/power-automate/automation-center-process-map).
- Work queues with SLA status (In / At risk / Out) express progress in business terms rather than run terms — [Microsoft Learn, Automation center](https://learn.microsoft.com/en-us/power-automate/automation-center-overview).
- Make Grid: dashboard mode, 2D/3D, live cursors for collaboration, "What needs attention" — [Make help, Explore Make Grid](https://help.make.com/explore-make-grid.md).
- Zapier Canvas mixes automated steps with manual steps done by people, and Copilot builds diagrams from text — [Zapier blog, Canvas guide](https://zapier.com/blog/zapier-canvas-guide/).
- Time saved: n8n **Time saved** per workflow — [n8n Insights](https://docs.n8n.io/insights/); Zapier **ROI calculator** — [Zapier Analytics](https://help.zapier.com/hc/en-us/articles/25444544607373/); Power Automate **Savings** — [Automation center](https://learn.microsoft.com/en-us/power-automate/automation-center-overview).
- Windmill **Copy public link** shares a run (status, inputs, results, logs, live flow graph) with anyone — [Windmill docs](https://www.windmill.dev/docs/core_concepts/monitor_past_and_future_runs.md).
- Make: **Explain error** with AI on a failed run — [Make help, Scenario history](https://help.make.com/scenario-history.md).

### Inferences
- Business users follow "the process" (contract onboarding) rather than "flow runs". Power Automate's process-as-object (a named process map grouping a top-level flow and its children) is the model closest to "follow a whole operation"; ENSPACE could let users name a group of flows as an operation.
- AI explanations of errors (Make, Power Automate Copilot) are becoming standard for non-technical readers.

### Gaps
- No usability research found comparing business vs builder use of these screens.

## Q7. Known user complaints / feature requests about missing global visibility

### Takeaway
Requests cluster around: global list with date filter and search by ID (n8n 2023, later partly built), timeline across all scenarios (Make, unanswered), parent-child job links (Workato, not on roadmap at the time), search inside job report columns (Workato), and run history by record (Zapier, only workarounds).

### Cited Findings
- n8n "Workflow Execution List - Compilation of Feature Requests" (Feb 27, 2023): date/time filters, search by execution ID, filter by duration, custom reference per execution, retry from All Executions — [n8n community](https://community.n8n.io/t/workflow-execution-list-compilation-of-feature-requests/23503).
- n8n users built external dashboards (e.g. in Coda) with filters by run time, mode, status, date, workflow — [n8n community, dashboard in Coda](https://community.n8n.io/t/theres-finally-a-nice-dashboard-for-your-n8n-instance-built-in-coda/16449).
- Make: "Is there a way to see timeline of scenario runs across all my scenarios?" redirected to the Idea Exchange — [Make community](https://community.make.com/t/is-there-a-way-to-see-timeline-of-scenario-runs-across-all-my-scenarios/28260). Rerun a past execution idea had over 550 votes (per search summary) — [Make community](https://community.make.com/t/is-there-a-way-to-rerun-a-previous-execution/4895).
- Workato: parent recipe/job IDs appear as text, users copy them into the URL; request for hyperlink; support: job-within-a-job UI not on the roadmap — [Workato community](https://support.workato.com/support/discussions/topics/1000089462). Job report values cannot be filtered; request for search — [Workato community](https://systematic.workato.com/t5/workato-pros-discussion-board/customizing-job-reports-empty/m-p/5564).
- Zapier: community-built Zap run log with Sub-Zaps and Zapier Tables to track runs centrally — [Zapier community](https://community.zapier.com/featured-articles-65/how-to-create-a-zap-run-log-with-sub-zaps-and-zapier-tables-51929).
- Power Automate: users receive "1 of your flows failed" emails with no visible failed run (history aged out, wrong environment) — [Power Platform community](https://community.powerapps.com/t5/Using-Flows/Receiving-quot-1-of-your-flows-failed-quot-email-with-no-failed/m-p/456654).
- Retool: community advice to include workflow run ID and end time in a global error handler to find failed runs later — [Retool community](https://community.retool.com/t/announcing-support-for-workflow-event-monitoring-and-run-panel-improvements/58240).

### Inferences
- The same 3 complaints ENSPACE users raise (no totals, no cross-flow view, no search by business record) were raised in n8n, Make and Workato communities; vendors answered first with global list + date filter, then custom keys, then aggregate dashboards, and only recently (Make 2026, Power Automate 2025) with chain/map views.

### Gaps
- Vote counts and current status of most threads were not visible in fetched pages.
- No Zapier Community thread found specifically asking for "all Zaps a record went through".
