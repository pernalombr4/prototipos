# Global execution monitoring and cross-workflow traceability in developer workflow engines (state as of 2026-10)

Scope: Temporal, Camunda 8 (Operate, Optimize), Apache Airflow 3.x, Prefect 3, Dagster, AWS Step Functions (+ X-Ray, EventBridge), Inngest, Trigger.dev, Hatchet, Conductor OSS / Orkes. Research date: 2026-10-24. Doc versions seen: Camunda 8.10 (8.11 unreleased), Airflow 3.3.2, Dagster 1.12.8. Where only older docs were found, the version is stated.

## 1. Global runs view across all workflows (columns, filters, saved views, status taxonomy)

### Takeaway
Most engines put one runs list across every workflow at the top level of the namespace/environment (Temporal Workflows, Inngest Runs, Trigger.dev Runs, Dagster Runs, Conductor Executions > Workflow, Hatchet Runs). The common filter set is status + workflow/type + time range + business key, plus a query language for power users. AWS Step Functions is the exception: executions are listed only per state machine (or per Map Run).

### Cited Findings

**Temporal Web UI**
- The Workflows page is a table of all Workflow Executions in the namespace within the retention period, filterable by Status, Workflow ID, Workflow Type, start time, end time and any Default or Custom Search Attribute; times shown in UTC, Local or Relative — [Temporal Web UI](https://docs.temporal.io/web-ui)
- Saved Views: kept in the browser, private per user, up to 20, names up to 255 chars; built with the filter UI or the raw query editor, then "Save as New"; default views cannot be deleted; "Share" copies the view URL (relative times become absolute) — [Temporal Web UI](https://docs.temporal.io/web-ui)
- Workflow Status Counts: per-status counts of workflows with live updates and a refresh button, also on Schedules with a link to all runs of that Schedule (ui-server v2.20.0, 2023-10-30) — [Temporal changelog](https://temporal.io/change-log/ui-server-v2-20-0)
- ExecutionStatus values: Running, Completed, Failed, Canceled, Terminated, ContinuedAsNew, TimedOut (Standalone Activities add Paused) — [Temporal Search Attributes](https://docs.temporal.io/search-attribute)
- List Filter example: `WorkflowType = 'main.YourWorkflowDefinition' and YourCustomSA = 'YourCustomSAValue' and (StartTime > '...' or CloseTime < '...')` — [Temporal Search Attributes](https://docs.temporal.io/search-attribute)
- Workflow detail header: start, close, duration, Run Id, Workflow Type, Task Queue, Parent and Parent ID, SDK, State Transitions, Billable Actions Count (Cloud). History tab has 4 views: Timeline, All, Compact (Activities, Signals, Timers grouped), JSON; history downloadable as JSON. Actions: Request Cancellation, Signal, Update, Reset, Terminate, "Start Workflow Like This One" — [Temporal Web UI](https://docs.temporal.io/web-ui)
- Metadata tab shows User Metadata: static Summary and Details and dynamic Current Details (human-readable text set by the developer) — [Temporal Web UI](https://docs.temporal.io/web-ui)

**Camunda 8 Operate (8.10)**
- Process Instances table with an Operations column (cancel per instance); selection of rows enables Batch retry (incidents) and Batch cancellation from the table header — [Operate navigation](https://docs.camunda.io/docs/components/operate/userguide/basic-operate-navigation/); [Operate batch operations](https://docs.camunda.io/docs/components/operate/userguide/selections-operations/)
- Filters: Finished Instances (completed or canceled), Process Name, Process Version, Parent Process Instance Key, Batch Process Instance Key, Process Instance Key, Business ID, Variable Filters (new in 8.10) — [Filter process instances](https://docs.camunda.io/docs/next/components/operate/userguide/filter-process-instances/)
- Process instance page: header (key, version, state), live process diagram, Instance History panel with search and status filter, bottom tabs Variables, Listeners, Operations Log, Incidents (only if any), Details/Input/Output Mappings — [Operate navigation](https://docs.camunda.io/docs/components/operate/userguide/basic-operate-navigation/)

**Apache Airflow 3.3**
- Dags list: Dag ID, schedule and next run, latest run status, recent-run bar chart, tags, pause toggle; filters Dag status, schedule state, tags; advanced search (Cmd+K); sort by e.g. "Latest Run Start Date" — [Airflow UI](https://airflow.apache.org/docs/apache-airflow/stable/ui.html)
- Grid view: rows = tasks, columns = Dag runs, cell color = state; run range such as last 25 runs. Dag Run view tabs: Task Instances (state, try number, duration, Gantt-style timeline), Events, Code, Details, Graph — [Airflow UI](https://airflow.apache.org/docs/apache-airflow/stable/ui.html)

**Inngest**
- Runs page shows runs across all apps in the environment; filters status, queued or started time, app; "Show search" opens a CEL search bar — [Inngest inspecting runs](https://www.inngest.com/docs/platform/monitor/inspecting-function-runs)
- Run statuses (Insights schema): Queued, Running, Failed, Cancelled, Completed — [Inngest Insights](https://www.inngest.com/docs/platform/monitor/insights.md)
- Run detail: Trigger details (run and trigger IDs), Event payload, status, error and a step timeline; expanding a failed step shows each retry with error and timing; Rerun, including from a selected step — [Inngest inspecting runs](https://www.inngest.com/docs/platform/monitor/inspecting-function-runs)

**Trigger.dev**
- Runs table filters: Status, Environment, Tasks, Tags, Created period, Bulk action; added 2024-11-28: Show child runs, Custom date range, Run ID, Batch ID, Schedule ID. Runs table shows only root runs by default — [Trigger.dev changelog](https://trigger.dev/changelog/new-run-filters)
- Status taxonomy (13): initial Pending version, Delayed, Queued, Dequeued; execution Executing, Waiting (paused by triggerAndWait/batchTriggerAndWait/wait, does not count against concurrency); final Completed, Canceled, Failed, Timed out (maxDuration), Crashed (e.g. OOM), System failure, Expired (TTL passed before start). Helpers isQueued, isExecuting, isWaiting, isCompleted, isFailed, isSuccess — [Trigger.dev runs](https://trigger.dev/docs/runs)

**Dagster (1.12.8)**
- Runs page lists job runs filterable by job name, run ID, execution status or tag; run detail has a Gantt chart, filterable structured event logs and raw stdout/stderr. Overview ("factory floor") tabs: runs, jobs, schedules, sensors, resources, backfills across all code locations — [Dagster webserver](https://dagster.io/docs/guides/operate/webserver)

**Conductor OSS / Orkes**
- Executions > Workflow: filters Workflow name, Workflow id, Correlation id (multi-value), Idempotency key (multi-value), Status, Start/End range, Free text search over indexed input/output; "SQL format" toggle (e.g. `workflowType = 'order_processing' AND status = 'FAILED'`); "Show as code" shows the equivalent API call. Statuses: RUNNING, COMPLETED, FAILED, TIMED_OUT, TERMINATED, PAUSED. API flag `topLevelOnly` hides sub-workflows — [Conductor searching workflows](https://docs.conductor-oss.org/devguide/how-tos/Workflows/searching-workflows.html)
- Orkes execution detail: Tasks > Diagram tab with failed task in red; task tabs Summary ("Reason for Incompletion"), Input, Output, Logs, Retried Task; Actions menu: Restart with Current/Latest Definitions, Rerun from a specific task, Retry - From failed task — [Orkes debugging workflows](https://www.orkes.io/content/developer-guides/debugging-workflows)

**AWS Step Functions**
- ListExecutions requires a stateMachineArn (or alias/version ARN) or a mapRunArn; statusFilter values RUNNING, SUCCEEDED, FAILED, TIMED_OUT, ABORTED, PENDING_REDRIVE; redriveFilter REDRIVEN / NOT_REDRIVEN. No account-wide parameter exists — [ListExecutions API](https://docs.aws.amazon.com/step-functions/latest/apireference/API_ListExecutions.html)
- Execution Details page: Execution summary (status, ARN, State transitions count, link to X-Ray trace map, link to parent state machine if started by another), error banner with "Cause" / "View step details" and a "Recover" dropdown (Redrive or new execution), View mode Graph view / Table view (with optional Timeline column, color-coded retries), Step details, Events table (25 per page, max 25,000 events). Redrive covers Standard executions failed, aborted or timed out in the last 14 days — [Step Functions execution details](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-view-execution-details.html)

**Hatchet**
- Runs page and Event list allow filtering by additional metadata key-value pairs (see question 3) — [Hatchet additional metadata](https://docs.hatchet.run/home/additional-metadata)

### Inferences
- A cross-workflow list is standard; the "per workflow only" model that Spaceflow has today matches Step Functions, the weakest case in this set.
- Status taxonomies converge on 5 groups: waiting to start (queued, delayed, scheduled), running, waiting (paused on something external), success, failure (failed, timed out, crashed, cancelled/terminated). Trigger.dev's grouping helpers (isQueued, isExecuting, isWaiting, isFailed) are a ready model for a simplified non-technical taxonomy.
- Hiding child runs by default (Trigger.dev root-only, Conductor topLevelOnly) is the proven answer to list noise when one business event fans out into many runs.
- Saved Views with shareable URL (Temporal) give "my operation" views without building a new object model.

### Gaps
- Exact column set of the Temporal Workflows table, Camunda Process Instances table and Inngest Runs table is not documented in the pages read.
- Hatchet official dashboard docs (runs list columns, statuses, waterfall view) were not reachable (404); only an unofficial mirror existed and was not used.
- Prefect 3 Runs page filters and saved filters: only Prefect 2.10 docs found (filters date interval, flow run state, flow name, deployment name, tags) — [Prefect 2.10 flow runs](https://docs.prefect.io/2.10.0/ui/flow-runs/). Current 3.x screens not confirmed.
- Airflow 3 global "Dag Runs" list under Browse: not confirmed in the official UI page read (it lists Home, Dags, Assets, Admin).

## 2. Health dashboards on the landing page

### Takeaway
Landing pages show 3 kinds of signal: counts by status over a time window, failure ranking ("which workflows fail most"), and infrastructure health (workers, backlog). Few engines show duration percentiles on the landing page; those live in analytics tools (Optimize, Dagster Insights, Inngest Insights).

### Cited Findings
- Airflow 3 Home page: health indicators for MetaDatabase, Scheduler, Triggerer, Dag Processor; quick links to Failed Dags, Running Dags, Active Dags; Dag and task instance history with counts and success/failure rates over a selectable time range; Recent asset events — [Airflow UI](https://airflow.apache.org/docs/apache-airflow/stable/ui.html)
- Inngest metrics: Function Status (runs by succeeded, failed, cancelled), Failed Functions (top 6 failing, "View all"), Total runs throughput, Total steps throughput, Backlog (runs waiting per time bucket, per app); Functions list columns Triggers, Failure rate, Volume; filters time range, app, function — [Inngest observability metrics](https://www.inngest.com/docs/platform/monitor/observability-metrics)
- Temporal: per-status counts with live refresh on the Workflows list (2023-10-30) — [Temporal changelog](https://temporal.io/change-log/ui-server-v2-20-0); Workers tab on a workflow shows pollers and errors when none are polling — [Temporal Web UI](https://docs.temporal.io/web-ui)
- Camunda Operate Dashboard: "Process Instances by Name" panel lists deployed processes with running or incident instances; processes without active instances are hidden — [Operate navigation](https://docs.camunda.io/docs/components/operate/userguide/basic-operate-navigation/)
- Camunda API offers statistics of active instances with incidents grouped by error (hash) — [Camunda REST: statistics by error](https://docs.camunda.io/docs/next/apis-tools/orchestration-cluster-api-rest/specifications/get-process-instance-statistics-by-error/)
- Dagster Overview is a "high-level look at the activity" across code locations; Insights (Dagster+) shows historical failures and credit usage — [Dagster webserver](https://dagster.io/docs/guides/operate/webserver)
- Inngest Insights: SQL over tables events, runs, steps, step_attempts, extended_trace_spans, metadata; example "count runs by status in the last 24 hours"; saved queries private by default, shareable to the org; 1,000 rows per page; few-minute lag, not for live monitoring. Launched 2025-09-23 for events, later extended to runs/steps/traces — [Inngest Insights](https://www.inngest.com/docs/platform/monitor/insights.md); [Inngest changelog 2025-09-23](https://inngest.com/changelog/2025-09-23-insights); [Inngest blog](https://www.inngest.com/blog/insights-query-runs-steps-traces)
- Prefect (2.x docs) dashboard aims to answer "what's the health of my system?", filterable by time, flow state, tags, with warnings for late or failed runs — [Prefect 2.10 UI](https://docs.prefect.io/2.10.0/ui/)

### Inferences
- A minimal landing for Spaceflow, backed by these patterns: counts by status for a period (Temporal, Airflow), a "flows that fail most" ranking (Inngest Failed Functions), a backlog / waiting count (Inngest Backlog), and a "Failure rate + Volume" column on the flows list (Inngest Functions list).
- Live counters and analytical history are separate products in Inngest (Metrics vs Insights) and Camunda (Operate vs Optimize); a single screen for both is not the norm.

### Gaps
- No engine read documents duration percentiles (p50/p95) on its landing page.
- Camunda 8.10 Operate dashboard: only the "Process Instances by Name" panel is described; an incidents-by-error panel is not confirmed in 8.7 or 8.10 docs.
- Prefect 3 / Prefect Cloud dashboard widgets not confirmed in current docs.

## 3. Business-key search (attach and search by a business identifier)

### Takeaway
Every engine has one: Temporal Search Attributes, Camunda Business ID and variable filters (both new in 8.10), Conductor correlationId, Trigger.dev tags, Hatchet additional metadata, Inngest CEL over event data. They differ in who sets the key (developer at start vs any field searchable) and in limits.

### Cited Findings
- Temporal Custom Search Attributes: types Bool, Datetime, Double, Int, Keyword, KeywordList, Text; Keyword for exact IDs, KeywordList for tags. Per namespace on Cloud: 20 each of Bool/Datetime/Double/Int, 40 Keyword, 5 each KeywordList/Text; self-hosted SQL: 3/10/3. Value up to 2 KB, total 40 KB per workflow, 255 chars per value. Set at start or upserted from workflow code. Operators for Keyword: =, !=, IN, STARTS_WITH, BETWEEN, ORDER BY. Lists in single-value types deprecated, deadline 2026-09-30 on Cloud. Removing attributes not supported on Cloud (rename only) — [Temporal Search Attributes](https://docs.temporal.io/search-attribute)
- Camunda 8.10: Business ID filter in Operate, "domain-specific identifier (order number, case reference, etc.)", operators Equals, Contains (wildcards * and ?), Is one of; Variable Filters operators equals, not equal, contains, is one of, exists, does not exist — [Filter process instances](https://docs.camunda.io/docs/next/components/operate/userguide/filter-process-instances/)
- Camunda 8.10 REST "Assign business id to process instance": one-time assignment to a running instance without one; only artifacts created after assignment carry it; returns 409 when uniqueness enforcement is on — [Camunda REST assign business id](https://docs.camunda.io/docs/next/apis-tools/orchestration-cluster-api-rest/specifications/assign-process-instance-business-id/)
- Before 8.10, the community workaround was a `businessKey` variable filtered in Operate — [Camunda forum](https://forum.camunda.io/t/business-key-feature-in-camunda-8/40055)
- Conductor/Orkes: Correlation id and Idempotency key as multi-value UI filters; free text over indexed input/output — [Conductor searching workflows](https://docs.conductor-oss.org/devguide/how-tos/Workflows/searching-workflows.html); API `GET /api/workflow/{name}/correlated/{correlationId}` — [Conductor workflow API](https://docs.conductor-oss.org/devguide/api/workflow.html)
- Trigger.dev tags: up to 10 per run, 1–128 chars; recommended prefixes like `user_123456` or `video:123`; set at trigger or via `tags.add()`; Runs page filter "Tags"; `runs.subscribeToRunsWithTag()` for realtime; tags are not inherited by child runs (copy `ctx.run.tags` manually) — [Trigger.dev tags](https://trigger.dev/docs/tags)
- Trigger.dev idempotencyKey: same key while in progress is ignored; completed/canceled returns the existing run; failed/expired releases the key — [Trigger.dev runs](https://trigger.dev/docs/runs)
- Hatchet additional metadata: key-value strings on events and runs (and scheduled/cron runs); "propagated from parents to children or from events to runs"; filter on Runs uses OR across pairs, on Events uses AND (JSONB containment) — [Hatchet additional metadata](https://docs.hatchet.run/home/additional-metadata)
- Inngest CEL run search: variables event.id, event.name, event.ts, event.v, event.data, output; operators ==, != and comparisons on ts/data; `&&`, `||`, newline = AND; failed runs searchable by output.name / message / stack — [Inngest inspecting runs](https://www.inngest.com/docs/platform/monitor/inspecting-function-runs)

### Inferences
- Two models: declared key (Temporal, Camunda Business ID, Conductor correlationId, Trigger.dev tags) versus search inside the trigger payload (Inngest CEL, Camunda variable filters, Conductor free text). For "contract X is in which flows?", ENSPACE has an advantage: the item reference already exists on every item-triggered execution, so it can be the implicit business key with no developer setup.
- Hatchet's propagation from event to run to child is the behavior needed for chained flows; Trigger.dev shows the failure mode when tags are not inherited.
- Camunda adding Business ID only in 8.10 (with uniqueness option) signals that variable search alone was not enough for users.

### Gaps
- Hatchet limits on metadata (pairs, length) not documented in the page read.
- Inngest CEL search limits (time window, cost) not documented in the page read.

## 4. Cross-workflow lineage ("A caused B") and system map

### Takeaway
3 mechanisms exist: explicit parent/child calls (Temporal child workflows and Nexus links, Camunda call activities, Trigger.dev triggerAndWait, Step Functions nested executions, Conductor sub-workflows), event causation (Inngest event page lists triggered functions; Prefect `follows` and related resources; Hatchet event-to-run metadata), and static data lineage graphs (Airflow Assets, Dagster global asset lineage). Only the data-lineage engines draw a map of the whole system; run-level chains are navigated one hop at a time.

### Cited Findings
- Temporal: Relationships tab shows a tree of the full parent and child hierarchy; header shows Parent and Parent ID — [Temporal Web UI](https://docs.temporal.io/web-ui)
- Temporal Nexus: bi-directional links in the Web UI from a caller's Nexus Operation event to the handler workflow's event and back, across namespaces and multi-level chains; auto-wired by SDK builders; a custom client inside a handler breaks the link; NexusOperationScheduled/Started/Completed events in history — [Temporal Nexus execution debugging](https://docs.temporal.io/nexus/execution-debugging); Temporal Operation Handler marked pre-release — [Temporal operation handler](https://docs.temporal.io/nexus/temporal-operation-handler)
- Camunda Operate: double-click a call activity to open the called instance (only when exactly one was called); reliable path is Details > "Called Process Instance" link; with many, "View all" filters the Processes page by the parent instance; filter "Parent Process Instance Key" — [Operate navigation](https://docs.camunda.io/docs/components/operate/userguide/basic-operate-navigation/); [Filter process instances](https://docs.camunda.io/docs/next/components/operate/userguide/filter-process-instances/)
- Trigger.dev: "Jump to root or parent run" links at the top of the trace view, shortcuts P (parent) and T (root), also in Details tab (2025-09-16); canceling a run cancels in-progress children — [Trigger.dev changelog](https://trigger.dev/changelog/jump-to-root-or-parent-run); [Trigger.dev runs](https://trigger.dev/docs/runs)
- Inngest: Events page lists events filterable by time and type; opening an event shows its payload and the functions it triggered; per event type: Throughput, Functions, Source — [Inngest inspecting runs](https://www.inngest.com/docs/platform/monitor/inspecting-function-runs); [Inngest observability metrics](https://www.inngest.com/docs/platform/monitor/observability-metrics)
- Prefect events: fields occurred, event, resource, related (other resources with roles), payload, id, follows (ID of an earlier event in the same causal chain; set automatically by emit_event within 5 minutes) — [Prefect events](https://docs.prefect.io/v3/concepts/events); related resource labels include flow-run, flow, deployment, work-pool IDs — [Prefect worker events](https://docs.prefect.io/v3/api-ref/events/worker-runner-events)
- Airflow 3 Assets: Asset List shows consuming Dags and producing tasks; Asset Graph View shows upstream producers and downstream consumers and recent events with the Dag runs they triggered; Dag Graph overlay modes "All Dag Dependencies" and "External Conditions" — [Airflow UI](https://airflow.apache.org/docs/apache-airflow/stable/ui.html)
- Airflow 2.x: Browse > DAG Dependencies graph (since 2.1) covering dataset scheduling, TriggerDagRunOperator and ExternalTaskSensor — [Astronomer cross-DAG dependencies](https://www.astronomer.io/docs/learn/2.x/cross-dag-dependencies); [Astronomer forum](https://forum.astronomer.io/t/any-visualization-tool-to-see-all-cross-dags-dependencies/2792). No separate cross-Dag page found in the Airflow 3 UI doc — [Airflow UI](https://airflow.apache.org/docs/apache-airflow/stable/ui.html)
- Dagster Global asset lineage: dependencies across all assets and code locations, filter by group or asset selection syntax, materialize, view latest materialization run — [Dagster webserver](https://dagster.io/docs/guides/operate/webserver)
- Step Functions: Execution summary links to the parent state machine when started by another; X-Ray turns traces into a service map; callers join upstream traces via traceHeader `Root=...;Sampled=...` on StartExecution; no X-Ray for Distributed Map child executions; minimum trace size 100 KiB — [Step Functions execution details](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-view-execution-details.html); [Step Functions X-Ray](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-xray-tracing.html)
- EventBridge PutEvents carries X-Ray trace context (not visible in the delivered event), so Lambda, Step Functions and API Gateway targets continue the trace — [AWS Compute Blog](https://aws.amazon.com/blogs/compute/using-aws-x-ray-tracing-with-amazon-eventbridge/)
- Conductor: `topLevelOnly` search parameter separates top-level from sub-workflow executions — [Conductor searching workflows](https://docs.conductor-oss.org/devguide/how-tos/Workflows/searching-workflows.html)

### Inferences
- For Spaceflow's event chains (flow A creates record, flow B triggers on "created", C on "edited"), the closest analogs are Inngest (event -> triggered functions) and Prefect (`follows` + related resources). Both store causation per event; neither documents a UI that draws the whole multi-hop chain.
- Two complementary displays are worth borrowing: a static map of which flow listens to which event on which category (Airflow Asset Graph, Dagster global lineage), and a per-operation timeline that follows a root ID (Trigger.dev root run, Temporal Relationships tree, X-Ray trace).
- Propagating a root/correlation ID automatically, as Temporal Nexus SDK builders and Hatchet metadata do, is what makes a chain traceable; manual propagation (Trigger.dev tags, custom Nexus client) breaks it.

### Gaps
- No source read describes UI handling of loops or cascades (A edits -> B edits -> A again), such as cycle detection or depth limits, in any of these engines.
- Prefect Event Feed UI and run graph screens: not described in the current pages read.
- Whether the X-Ray trace map shows nested state machines started by a plain task integration in one map: not confirmed.

## 5. Incident / attention views ("what needs my action now") and alerting

### Takeaway
Attention views are built as predefined filters (Temporal Task Failures, Camunda incidents, Airflow Required Actions) and recovery as bulk actions on a filtered set (Camunda batch retry, Inngest Replay and bulk cancel, Step Functions Redrive). Alerting lives in rules engines (Prefect Automations, Dagster health alerts, Optimize alerts).

### Cited Findings
- Temporal Task Failures view: predefined Saved View of running workflows with a Workflow Task failure or timeout, flagged after 5 consecutive failures (configurable; 0 disables), sets `TemporalReportedProblems`; entries link to the workflow page with failed and pending tasks and Request Cancellation — [Temporal Web UI](https://docs.temporal.io/web-ui)
- Camunda Operate: Incidents tab per instance; Batch retry on a selection marks an item completed once the retry is triggered, not when the problem is fixed — [Operate batch operations](https://docs.camunda.io/docs/components/operate/userguide/selections-operations/)
- Airflow 3.1+: Browse > Required Actions lists pending and resolved human-in-the-loop actions across all Dags; reply from the task instance's Required Actions tab; reply from the list itself in 3.3+ — [Astronomer HITL](https://www.astronomer.io/docs/learn/airflow-3/airflow-human-in-the-loop)
- Inngest Replay: choose function, time range and statuses (e.g. Failed; Skipped for runs skipped while paused), name it after the incident, review, start, watch progress; warns about repeated side effects — [Inngest Replay](https://www.inngest.com/docs/platform/replay)
- Inngest Bulk cancellation: time range plus function states, modal previews how many runs are affected — [Inngest bulk cancellation](https://www.inngest.com/docs/platform/manage/bulk-cancellation); [Inngest blog](https://inngest.com/blog/bulk-cancellation)
- Step Functions Redrive for Standard executions failed/aborted/timed out in the last 14 days, with Redrive count shown — [Step Functions execution details](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-view-execution-details.html)
- Prefect Automations triggers: flow run state change, work pool/queue status, deployment status, metric thresholds (average duration, lateness, completion %), custom events; proactive triggers on absence of an expected event (e.g. stuck in Running > 30 min); actions notifications (Slack, Teams, email), declare-incident (Cloud), cancel/suspend/run deployment, pause schedules, webhooks — [Prefect automations](https://docs.prefect.io/v3/automate/events/automations-triggers)
- Dagster+ asset health: single status Healthy / Warning / Degraded / Unknown combining latest materialization, freshness and checks; alerts fire once on status change — [Dagster asset health status](https://docs.dagster.io/guides/observe/asset-health-status); [Dagster alerts](https://docs.dagster.io/guides/labs/observability-update/alerts)
- Optimize alerts: set on number reports inside a collection; email when an outlier occurs, e.g. backlog at a bottleneck too high — [Improve processes with Optimize](https://docs.camunda.io/docs/guides/improve-processes-with-optimize/)

### Inferences
- Dagster's 4-level rollup and Prefect's "absence of expected event" trigger fit the non-technical "is my operation OK?" question better than raw run statuses.
- Alerting once on status change (Dagster) avoids flooding when a cascade fails many runs at once.

### Gaps
- Camunda Operate global incidents list (across processes) not described in the 8.10 pages read beyond the per-instance tab and dashboard panel.

## 6. Features aimed at business (non-developer) users

### Takeaway
Camunda Optimize is the only product here explicitly written for business users and process owners; the rest target developers. Some developer features are still readable for laypeople: Temporal's human-readable Summary/Details, Dagster's health rollup, Airflow's Required Actions.

### Cited Findings
- Optimize guide for "new business users" (8.10): Collections (up to 10 processes, Users roles viewer/editor/manager, Data Sources), reports (Heatmap of where instances spend longer than average, Duration, Count, By flow node, table/number), Dashboards with templates such as "Process performance overview", shareable by link to people without Optimize access, Alerts by email — [Improve processes with Optimize](https://docs.camunda.io/docs/guides/improve-processes-with-optimize/)
- Optimize Process Dashboards: all processes and status on one page, process owner, time and quality KPIs with targets, Adoption Dashboard on top, hover shows target vs current, process digest email (alpha), KPI refresh every 10 minutes — [Optimize process dashboards](https://docs.camunda.io/docs/components/optimize/userguide/process-dashboards/)
- Optimize auto-creates an instant dashboard per deployed process covering all versions, respecting user permissions — [Optimize 3.15 instant dashboards](https://docs.camunda.org/optimize/3.15/user-guide/dashboard/instant-process-dashboards/) (older version)
- Temporal User Metadata (Summary, Details, Current Details) shown in the UI — [Temporal Web UI](https://docs.temporal.io/web-ui)

### Inferences
- Optimize's "process owner + KPI target + red/green" pattern maps to an ENSPACE operation owner (e.g. "contract onboarding" with 38 flows) seeing one status, not 38.
- Letting the flow author write a readable summary per run (Temporal Current Details) is a cheap way to make execution lists legible.

### Gaps
- No engine documents a business-facing view of a whole chain of event-driven workflows as one operation; this is the open space for the ENSPACE proposal.
- Camunda Tasklist was not researched in detail.
