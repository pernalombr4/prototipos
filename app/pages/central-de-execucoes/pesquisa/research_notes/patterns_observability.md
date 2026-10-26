# Cross-cutting UX and observability patterns for many chained event-driven workflows

Research date: 2026-10-24. Scope: patterns from distributed tracing, event and data lineage, process mining, no-code
automation guardrails and operations dashboards that apply to a global Spaceflow screen (38 flows chained by data
events, per-flow executions list today). Every claim has a URL. "Evidence" means vendor docs, spec or primary
literature describing what a product does; "opinion" means a vendor blog, consultancy or practitioner view, marked as such.

Source dating summary:
- Current vendor docs (read 2026-10-24): Datadog Service Map, AWS X-Ray trace map, Confluent Stream Lineage, Grafana
  Tempo service graphs, OpenTelemetry traces concept, Honeycomb trace waterfall, n8n executions, Camunda Operate (mentions
  release 8.10), Zapier help, HubSpot KB, dbt node selection, Microsoft Learn Process Mining (updated 2026-08-28 and
  2026-08-31).
- Older items: NN/g dashboards article (2017-06-18); Google SRE book, "Monitoring Distributed Systems" (2016 book);
  Jira Automation service limits pages (Data Center 7.x docs, roughly 2021-2022); Gartner governance abstract (2024).

## Q1. Which visual form works for (a) the system map of all flows and their links?

### Takeaway
Mature tools draw an automatically derived directed graph (node = service/job/flow, edge = observed "A caused B"
traffic) with health encoded on the node border, metrics on the edges, and a side panel for the selected node or edge.
None of them expects the user to read the whole graph at once: the graph is an entry point to filtered lists.

### Cited Findings
- Datadog Service Map breaks an application into services and draws the dependencies it observes, built from data APM
  already collects (no extra setup) — [Datadog docs](https://docs.datadoghq.com/tracing/services/services_map/)
- Datadog node borders turn red or yellow from a single "Service Health" state that combines anomalies, paging monitors
  and incidents; edges summarize aggregate calls, and per-request detail lives in the trace flame graph — [Datadog docs](https://docs.datadoghq.com/tracing/services/services_map/)
- AWS X-Ray trace map: choose a node to see its requests, or an edge to see requests that traveled that connection; a
  panel below the map shows metrics, alerts and response-time distribution, and "View traces" opens the filtered trace
  list — [AWS X-Ray docs](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html)
- X-Ray colors: green for successful calls, red for server faults (5xx), yellow for client errors (4xx), purple for
  throttling (429). Node size can be set to "None", "Health" (impacted requests) or "Traffic" (total requests) —
  [AWS X-Ray docs](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html)
- X-Ray "displays a connected view of traces across event-driven applications that use Amazon SQS and Lambda" (trace
  linking), and supports up to 10,000 nodes — [AWS X-Ray docs](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html)
- Grafana Tempo derives service-graph edges from span pairs: client/server, and producer/consumer for messaging. It emits
  per-edge request count, failed count and latency histograms. Spans without a partner become "virtual nodes" — [Grafana Tempo docs](https://grafana.com/docs/tempo/latest/metrics-from-traces/service_graphs/)
- Confluent Stream Lineage draws producers, consumers, topics and processing steps as an interactive graph; edges show
  source, destination, bytes and message count, and thicker edges carry more throughput — [Confluent docs](https://docs.confluent.io/cloud/current/stream-governance/stream-lineage.html)
- Confluent shows the last 10 minutes by default; a point-in-time view (10 min to 24 h, or a 1-hour block within the
  last 7 days) changes nodes and data with the window — [Confluent docs](https://docs.confluent.io/cloud/current/stream-governance/stream-lineage.html)
- EventCatalog: an opt-in, beta, force-directed "architecture graph" of every resource; docs warn it is unproven on very
  large catalogs. A "Domains" lens groups resources inside their domains — [EventCatalog docs](https://eventcatalog.dev/docs/development/guides/architecture-graph)
- EventCatalog 4.0 (pre-release) adds "Systems" grouped inside domains and a Context Diagram that walks a system's
  relationships outward — [release mirror](https://newreleases.io/project/github/event-catalog/eventcatalog/release/@eventcatalog%2Fvisualiser@4.0.0)
  (secondary source, pre-release)
- EventCatalog older "Domain Integration Map": domains contain services; cross-domain message flows are drawn as
  connections between domains — [EventCatalog v2 docs](https://v2.eventcatalog.dev/docs/development/guides/domains/domain-integration-map)
- EventCatalog visualizations can be exported or copied as Mermaid code — [EventCatalog tutorial](https://eventcatalog.dev/docs/tutorial/visualize-your-catalog)
- Azure Application Map offers node filters and connector (edge) filters to show "a smaller and more focused map", and
  an "Intelligent view" (preview, ML) that recommends which edges need investigation — [Microsoft Learn](https://learn.microsoft.com/azure/azure-monitor/app/app-map);
  [Azure update](https://azure.microsoft.com/updates/public-preview-aiops-powered-intelligent-view-in-application-maps/)
- Azure blog (older): filtered maps can be pinned to a dashboard — [Azure blog](https://azure.microsoft.com/fr-fr/blog/application-map-filter-and-pin-to-a-dashboard/)

### Inferences
- For Spaceflow, the edge is not a network call: it is "flow A wrote item of category X with event E, flow B listens to
  E on X". Two edge sources exist: static (derived from trigger configuration, exists before any run) and observed
  (derived from executions that actually caused other executions). Observability tools show only observed edges
  (Datadog, Tempo, X-Ray); catalogs show declared edges (EventCatalog). A no-code tool can show both, with the data
  event (category + event type) as an intermediate node, as Confluent does with topics between producer and consumer.
- The common interaction contract: click node -> side panel with health and counts -> button "see executions" that opens
  the existing executions list pre-filtered. This reuses the per-flow list ENSPACE already has.
- Health on the node border plus a size/thickness channel for volume is the dominant encoding across Datadog, X-Ray and
  Confluent.

### Gaps
- AWS EventBridge schema registry / visualizer: not researched in this pass; no URL collected.
- Jaeger "System Architecture" / deep dependency graph: no official Jaeger doc retrieved; only third-party material.
- No user-research evidence found that non-technical users can read a service map; all sources target engineers.

## Q2. Which visual form works for (b) one business entity's journey across flows ("contract X runs through which flows?")

### Takeaway
Two proven forms: the trace waterfall (one row per step, time on the x-axis, nesting for "caused by") for a single
journey, and the process-mining case view, where a business identifier (Case ID) groups all events. The enabler in both
is an identifier carried across every execution: trace ID / span link in tracing, Case ID in process mining, custom
execution data in n8n.

### Cited Findings
- OpenTelemetry: "Context Propagation is the core concept that enables Distributed Tracing"; span context is serialized
  and propagated with the data — [OpenTelemetry docs](https://opentelemetry.io/docs/concepts/signals/traces/)
- OpenTelemetry span links: "associate one span with one or more spans, implying a causal relationship", including spans
  in separate traces. Example given: an operation queues an asynchronous follow-up; "link the last span from the first
  trace to the first span in the second trace" — [OpenTelemetry docs](https://opentelemetry.io/docs/concepts/signals/traces/)
- Links do not change the trace hierarchy; their meaning is "influenced by" rather than "created by"; one batch span can
  link to many source spans (fan-in) — [SigNoz guide](https://signoz.io/docs/traces-management/guides/span-links/);
  [OneUptime, 2026](https://oneuptime.com/blog/post/2026-01-07-opentelemetry-span-links/view) (vendor tutorials)
- Backend support for rendering links varies; links can fail to appear in trace views — [OneUptime, 2026](https://oneuptime.com/blog/post/2026-02-06-debug-span-links-not-appearing-in-trace-views/markdown) (vendor tutorial)
- Honeycomb reconstructs parent-child structure into a "waterfall diagram" that "shows how the order of operations
  cascades across the total execution time"; a span with dependents shows the count; a condensed trace summary above the
  waterfall finds long and errored spans without scrolling (up to 6 levels) — [Honeycomb docs](https://docs.honeycomb.io/reference/honeycomb-ui/query/trace-waterfall)
- Honeycomb shows a "missing spans" warning for incomplete traces; trace links carry trace ID, span ID and time range in
  the URL — [Honeycomb docs](https://docs.honeycomb.io/reference/honeycomb-ui/query/trace-waterfall)
- Critical-path heuristic for Jaeger waterfalls: start at root, follow the widest child, repeat — [KodeKloud notes](https://notes.kodekloud.com/docs/Prep-Course-Certified-Cloud-Native-Platform-Engineering-CNPE/Observability-and-Operations/Trace-Visualization-and-Root-Cause-Analysis/page) (training material, not Jaeger docs)
- Power Automate Process Mining: "Case ID should represent an instance of your process and is often the object that the
  process acts on" (examples: patient ID, order ID, request ID); it "must be present for all activities in the log".
  Required fields: Case ID, Activity Name, timestamps; optional: resource, event-level and case-level attributes —
  [Microsoft Learn, updated 2026-08-31](https://learn.microsoft.com/en-us/power-automate/process-mining-processes-and-data)
- Celonis Variant Explorer groups cases by path, shows each variant's activities and frequency by case count; you can
  click an activity to select cases that flow through, skip, start or end at it — [Celonis docs, Process Components](https://docs.celonis.com/en/process-components.html)
  (via search summary; full page not fetched)
- Celonis Process Explorer "shows the most common activities and connections filtered on case frequency by default";
  metrics named for variants: Activity Frequency and Throughput Time — [Celonis blog](https://celonis.com/blog/celonis-ems-process-explorer-and-variant-explore-whats-the-difference) (undated)
- Camunda Operate instance detail: header (key, version, state), the process diagram showing current progress, an
  "Instance History" panel with search and status filters, and tabs for Variables and Incidents. A call activity links to
  the called instance; with several called instances, "View all" filters the list by the whole parent instance —
  [Camunda docs](https://docs.camunda.io/docs/components/operate/userguide/basic-operate-navigation/)
- Camunda 8.10: an optional "business ID" filter with Equals, Contains and Is one of on the Decisions list —
  [Camunda docs](https://docs.camunda.io/docs/components/operate/userguide/basic-operate-navigation/)
- n8n: a parent execution links to its sub-workflow execution ("View sub-execution"), and the child links back to the
  parent — [n8n docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow)
- n8n "custom executions data": set key/value on an execution (`$execution.customData.set`) and filter the executions
  list by "Saved custom data"; paid plans only — [n8n docs](https://docs.n8n.io/workflows/executions/custom-executions-data);
  [n8n all executions](https://docs.n8n.io/workflows/executions/all-executions)

### Inferences
- "Contract X's journey" needs 2 IDs: a correlation ID (the chain: which execution caused which) and a business key (the
  contract). In ENSPACE, flow B edits a progress record, not the contract, so the business key must be inherited along
  the chain (the root item of the chain), as Camunda's parent instance and n8n's parent link do. Searching by the
  progress record alone would miss the contract-level view.
- A waterfall fits one chain (time order, nesting by "caused by", error row highlighted). The process-mining map fits
  many contracts at once (which path most contracts take, where they wait). The first is the "case detail" page; the
  second is an analytical view and likely a later phase.
- Camunda's "View all" for a parent instance and n8n's back-link are the closest no-code analogues to "execution caused
  execution"; neither shows a full multi-level chain on one screen.

### Gaps
- Celonis object-centric process mining (several linked objects, such as contract and progress record, in one model) is
  relevant to ENSPACE but was not researched with a URL in this pass.
- No source found on how Zapier, Make or Workato show a cross-automation chain for one record; they appear to offer only
  per-automation history.
- Jaeger trace graph view: no official doc retrieved.

## Q3. Which visual form works for (c) the health overview, for non-technical users?

### Takeaway
Few, symptom-oriented numbers (volume, failures, running/stuck, time) on one screen, each linked to the filtered list
behind it; status encoded with shape plus color plus text; charts limited to bars and lines. Evidence comes from NN/g,
Google SRE and design systems; none of it was tested with no-code automation users specifically.

### Cited Findings
- NN/g (2017): dashboards are single-page, at-a-glance views on which users "can act quickly"; operational dashboards
  "impart critical information quickly to users as they are engaged in time-sensitive tasks"; analytical dashboards
  support less urgent investigation — [NN/g, Laubheimer, 2017-06-18](https://www.nngroup.com/articles/dashboards-preattentive/)
- NN/g: dashboards are for consumption "with a minimum of interaction or cognitive processing"; length and 2D position
  are the best channels for quantities; color should not encode magnitude and should "reinforce information that is
  already communicated in a different way" — [NN/g, 2017](https://www.nngroup.com/articles/dashboards-preattentive/)
- NN/g: avoid pie and donut charts ("notoriously poor"), gauges ("harder to interpret than linear graphs"; use bullet
  charts), treemaps for quick dashboards, and 3D — [NN/g, 2017](https://www.nngroup.com/articles/dashboards-preattentive/)
- Google SRE 4 golden signals: latency, traffic, errors, saturation. Track latency of failed requests separately ("a slow
  error is even worse than a fast error!"); errors include explicit, implicit (wrong content) and by policy (too slow) —
  [Google SRE book, 2016](https://sre.google/sre-book/monitoring-distributed-systems/)
- SRE: monitoring answers "what is broken" (symptom) and "why" (cause); dashboards should answer basic questions, usually
  with the golden signals; "Every page should be actionable"; signals no dashboard or alert uses are removal candidates;
  a dashboard of subcritical problems beats email alerts — [Google SRE book, 2016](https://sre.google/sre-book/monitoring-distributed-systems/)
- Carbon status indicator pattern: different shapes and colors let users assess and act on status; shape-based icons
  (red triangle for high priority); not every indicator signals urgency — [Carbon](https://www.carbondesignsystem.com/patterns/status-indicator-pattern)
- Carbon targets WCAG AA: 4.5:1 for text, 3:1 for large text and UI components — [Carbon color accessibility](https://carbondesignsystem.com/guidelines/accessibility/color)
- Dynatrace status pattern: circle for ideal or neutral, triangle for warning, diamond for critical, so states stay
  distinguishable at small sizes — [Dynatrace design](https://developer.dynatrace.com/design/patterns/status-and-health/)
- Camunda Operate dashboard lists only processes with running instances or incidents ("Process Instances by Name");
  processes without active instances do not appear — [Camunda docs](https://docs.camunda.io/docs/components/operate/userguide/basic-operate-navigation/)
- Datadog collapses dozens of signals into 1 health state per service on the map — [Datadog docs](https://docs.datadoghq.com/tracing/services/services_map/)
- X-Ray drill-down chain: map -> node -> metrics tab (select a range in a graph to drill down; filter Faults or Errors)
  -> "View filtered traces" -> trace — [AWS X-Ray docs](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html)
- Confluent: time window is a top-level control and search results are limited to it — [Confluent docs](https://docs.confluent.io/cloud/current/stream-governance/stream-lineage.html)

### Inferences
- Golden signals translated to Spaceflow: traffic = executions started in the period; errors = executions with failure;
  latency = duration (failed and successful apart); saturation = executions queued or running longer than usual
  ("stuck"). Each number opens the filtered global executions list (SRE "actionable" + X-Ray drill-down).
- "Needs attention" inbox: Camunda's dashboard shows only what has running instances or incidents; the SRE book
  recommends a dashboard of subcritical problems over email. Both support a default view that lists only flows with
  failures or stuck runs, instead of all 38 flows.
- Status chip: shape + color + word (Carbon, Dynatrace, NN/g "color reinforces"). Bars sorted by failures per flow beat
  a donut of statuses (NN/g).

### Gaps
- Stephen Few's dashboard definition and "Information Dashboard Design" guidance: no URL retrieved in this pass.
- Material Design and Atlassian Design System guidance on dashboards, lozenges and empty states: not retrieved.
- NN/g articles on empty states, error messages and status phrasing: not retrieved in this pass.
- No usability study found on operations dashboards for non-technical automation owners.

## Q4. How do mature tools keep a 30–50 node dependency graph legible?

### Takeaway
They never rely on layout alone. The repeated techniques: focus on one node with its direct neighbors, filter by
facet/time/group, group nodes into containers (team, domain, system), collapse repeated nodes into a group node above a
threshold, limit depth (hops) around a selected node, and search across the whole graph.

### Cited Findings
- Focus: clicking a Datadog service isolates it with its callers and callees; you pivot from node to node. Nodes
  collapse when two filtered services connect only through services outside the filter — [Datadog docs](https://docs.datadoghq.com/tracing/services/services_map/)
- Hover: Datadog highlights the hovered service and animates its request traffic to show call direction — [Datadog docs](https://docs.datadoghq.com/tracing/services/services_map/)
- Grouping and facets: Datadog groups by team or application and filters by facets (service type, last deploy, monitor
  status), fuzzy name and incident status; filtering matters for "hundreds or thousands of nodes" — [Datadog docs](https://docs.datadoghq.com/tracing/services/services_map/)
- Threshold collapse: Confluent collapses 24 or more similar nodes into one group node, expanded in a side panel;
  producers and consumers are grouped into one node that expands to client IDs — [Confluent docs](https://docs.confluent.io/cloud/current/stream-governance/stream-lineage.html)
- Per-flow focus: Confluent "See all Streams" shows one card per data flow; selecting a card limits the diagram to that
  stream; search spans the whole cluster; a reset icon re-centers on the original entity; internal topics can be hidden —
  [Confluent docs](https://docs.confluent.io/cloud/current/stream-governance/stream-lineage.html)
- Depth limits: dbt selection `+model+` (ancestors and descendants), `model+1` (first-degree only), `@model` —
  [dbt docs](https://docs.getdbt.com/reference/node-selection/graph-operators)
- Default depth 2 in lineage UIs: OpenMetadata upstream/downstream depth default 2 (range 1–5); OVHcloud Lakehouse
  Manager default 2 (range 1–10) — [OpenMetadata](https://docs.open-metadata.org/v1.13.x/how-to-guides/admin-guide/preferences/lineage);
  [OVHcloud](https://docs.ovhcloud.com/en/guides/public-cloud/data-platform/lakehouse-manager-lineage)
- Marquez (OpenLineage reference UI): clicking a dataset shows upstream producers and downstream consumers —
  [Galaxy glossary](https://www.getgalaxy.io/learn/glossary/visualizing-data-lineage-with-marquez) (secondary source)
- Containers: EventCatalog domains contain services/systems; cross-domain flows drawn between domains — [EventCatalog v2](https://v2.eventcatalog.dev/docs/development/guides/domains/domain-integration-map)
- Saved groups: X-Ray groups (filter expressions) restrict the map to matching traces — [AWS X-Ray docs](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html)
- Edge filters and node filters in Azure Application Map — [Microsoft Learn](https://learn.microsoft.com/azure/azure-monitor/app/app-map)
- Grouping in AWS CloudWatch Application Signals: "Related services" by default, Environment grouping, custom groups by
  tags — [AWS CloudWatch docs](https://docs.amazonaws.cn/en_us/AmazonCloudWatch/latest/monitoring/ServiceMap.html)
- Process mining equivalent: Process Explorer opens with the most frequent activities and connections only, filtered on
  case frequency — [Celonis blog](https://celonis.com/blog/celonis-ems-process-explorer-and-variant-explore-whats-the-difference)
- EventCatalog warns its full force-directed graph is "unproven on very large catalogs" and keeps it opt-in — [EventCatalog docs](https://eventcatalog.dev/docs/development/guides/architecture-graph)

### Inferences
- For 38 Spaceflow flows: group by the category the flow listens to, or by a user-defined "operation" (process) tag;
  default view = one group or one flow with depth 1–2; full graph as a secondary mode. The data event between flows
  (category + created/edited) is a natural node to collapse when several flows listen to the same event.
- Selecting a contract (business key) can act as a filter on the map: draw only the flows that ran for that contract,
  turning the system map into the journey map (Q2).
- A left-to-right layered layout (trigger on the left, consequence on the right) matches "who triggers whom" better than
  force-directed layouts; no source in this pass compared them directly (see Gaps).

### Gaps
- No controlled study found comparing force-directed vs layered (Sugiyama) layouts for 30–50 node dependency graphs in
  product UIs.
- Jaeger and Kiali grouping features not researched.

## Q5. How do no-code and SaaS automation tools detect and show loops and cascades?

### Takeaway
Guardrails exist but are coarse and mostly invisible until they fire: Jira stops a chain after 10 rule-to-rule triggers
and marks it LOOP in the audit log; Salesforce fails with a trigger-depth error; Zapier documents loops and asks users to
fix them by hand. None found shows the chain that caused the loop on a map.

### Cited Findings
- Jira Automation: "A rule (or rules) will be allowed to trigger itself or other rules and create an execution chain up
  to this limit. By default this is 10." Loop-stopped executions appear in the audit log with status LOOP — [Atlassian docs (Data Center 7.3)](https://confluence.atlassian.com/automation073/service-limits-1093013429.html)
- Jira: the count spans rules; 11 rules firing on the same event get flagged as a loop. The ticket asks for the audit log
  to show which work item caused the loop — [Atlassian AUTO-1917](https://jira.atlassian.com/browse/AUTO-1917)
- Jira users hit the limit in legitimate long chains (rules triggering each other across subtasks; "the loop breaks after
  10 iterations") — [Atlassian Community](https://community.atlassian.com/forums/Automation-questions/Rule-Triggering-another-Rule-Need-to-Exceed-Loop-Limit/qaa-p/2780103)
- Zapier lists 3 loop causes: one Zap's action triggers another that triggers the first; a Zap's action triggers itself;
  a "New or Updated" trigger fires on the record the Zap just updated. "Loops can quickly use up your plan tasks" —
  [Zapier help](https://help.zapier.com/hc/en-us/articles/8496232045453)
- Zapier fixes are manual: turn off the Zaps, check Zap history, add a marker value and a Filter, or a "Processed by Zap"
  field — [Zapier help](https://help.zapier.com/hc/en-us/articles/8496232045453)
- Zapier's auto-disable catches runs that mostly error; loops that succeed are not caught — per a third-party summary of
  Zapier docs, [RapidDevelopers](https://rapidevelopers.com/ai-build-errors/zap-stuck-in-infinite-loop) (secondary;
  not confirmed on Zapier's page)
- HubSpot: records re-enroll when they meet re-enrollment criteria, even when the workflow has "Enroll in another
  workflow"; HubSpot offers "Save and don't enroll existing contacts" to avoid mass re-enrollment on a live workflow —
  [HubSpot KB](https://knowledge.hubspot.com/workflows/add-re-enrollment-triggers-to-a-workflow)
- Salesforce: record-triggered flows run before save (step 3) and after save (step 14) of the order of execution;
  recursive saves skip some steps — [Salesforce Apex guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_triggers_order_of_execution.htm)
- "Maximum trigger depth exceeded" described as recursive automation (flow updates record, retriggers another flow) —
  [third-party mirror](https://success-craft-mirror.duckdns.org/index.html%3Fp=1591.html) (questionable source; not
  confirmed by Salesforce docs in this pass)

### Inferences
- A chain view (Q2) makes loops visible as a repeated flow name in the same chain; a depth counter per chain (Jira's 10)
  can be shown in the chain detail ("this chain stopped at step 10: loop protection").
- In the system map, a cycle (A -> B -> A, or A edits what A listens to) can be flagged from the trigger configuration
  before any run, as a warning on the edge. No researched product does this statically; it is an opportunity, not a
  documented pattern.
- Status vocabulary: Jira uses a distinct status (LOOP) instead of a generic error, which keeps loop stops separate in
  counts and filters.

### Gaps
- Official Salesforce page for the trigger-depth limit not retrieved.
- Make (Integromat) and Workato loop/recursion protections not researched.
- Whether Zapier has automatic loop detection beyond error-based auto-disable: not confirmed by Zapier's own page.

## Q6. What does the literature say about automation sprawl and governance of many interdependent automations?

### Takeaway
The governance literature is about inventory, ownership and lifecycle (who owns which flow, which are abandoned), mostly
from Gartner abstracts and vendor/consultancy blogs. It says little about runtime visibility of chains between
automations, which is ENSPACE's gap.

### Cited Findings
- Gartner (2024): ineffective governance is the No. 1 issue raised by Gartner for Technical Professionals clients about
  Power Apps and Power Automate; key risks named: misuse, solution sprawl, data leakage, orphaned solutions — [Gartner abstract](https://www.gartner.com/en/documents/5463895)
  (abstract only; full report paywalled)
- Opinion (consultancy): "dozens to hundreds of flows" across environments, created by different business units, often
  with no central overview of owners; sprawl is the flip side of Power Automate's success — [Nordflux](https://nordflux.de/en/guides/wildwuchs-bei-power-automate-flows-aufspueren)
- Microsoft's answer is inventory: the Power Platform Admin Center inventory (agents, apps, flows; active creators;
  flows whose owners left) and the CoE Starter Kit — per [Nordflux](https://nordflux.de/en/guides/wildwuchs-bei-power-automate-flows-aufspueren) (secondary)
- Opinion (vendor): most resources in mature tenants fall into an abandoned long tail; lifecycle policy by tier —
  [Rencore](https://hub.rencore.com/news/power-platform-citizen-developer-reality-check)
- Opinion: governance should enable citizen development, not block it — [Forvis, 2023-09](https://www.forvis.com/forsights/2023/09/automation-governance-microsoft-power-platform-opportunity)

### Inferences
- ENSPACE's 38-flow customer is an instance of "solution sprawl" within one workspace. The global screen can combine the
  governance view (inventory: owner, last run, failure rate, which flows nobody triggered in 30 days) with the runtime
  view (chains). Sources treat these separately.

### Gaps
- No academic paper found on observability of chained no-code automations.
- No Forrester source retrieved.
- Figures in consultancy posts (for example, numbers of environments per tenant) are unverified.

## Q7. Which terminology do tools use for business users?

### Takeaway
Process mining uses "case" (the business object) and "variant" (a path); tracing uses "trace" and "span" (engineer
terms); orchestration and automation tools use "execution", "run", "instance", "job" or "history". "Incident" names a
failure that needs action. No researched product uses "journey" for this.

### Cited Findings
- "Case ID", "Activity", "variant", "root cause" (Power Automate Process Mining) — [Microsoft Learn](https://learn.microsoft.com/en-us/power-automate/process-mining-processes-and-data);
  [Microsoft Learn overview](https://learn.microsoft.com/en-us/power-automate/process-mining-overview)
- "Variant Explorer", "Process Explorer", "happy path", "cases", "throughput time" (Celonis) — [Celonis blog](https://celonis.com/blog/celonis-ems-process-explorer-and-variant-explore-whats-the-difference);
  [Celonis docs](https://docs.celonis.com/en/process-components.html)
- "Process instance", "incident", "business ID", "called process instance" (Camunda Operate) — [Camunda docs](https://docs.camunda.io/docs/components/operate/userguide/basic-operate-navigation/)
- "Execution", "sub-execution", "parent execution", "custom executions data" (n8n) — [n8n docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow)
- "Zap history", "Zap runs", "loops", "tasks" (Zapier) — [Zapier help](https://help.zapier.com/hc/en-us/articles/8496232045453)
- "Execution chain", audit log status "LOOP" (Jira Automation) — [Atlassian docs](https://confluence.atlassian.com/automation073/service-limits-1093013429.html)
- "Enrollment", "re-enrollment" (HubSpot) — [HubSpot KB](https://knowledge.hubspot.com/workflows/add-re-enrollment-triggers-to-a-workflow)
- "Trace", "span", "span link", "trace map", "service map", "lineage", "stream" (engineering tools) — [OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/traces/);
  [AWS X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-servicemap.html);
  [Confluent](https://docs.confluent.io/cloud/current/stream-governance/stream-lineage.html)

### Inferences
- For a Portuguese-speaking non-technical audience: "execução" already exists in Spaceflow; "cadeia de execuções" or
  "encadeamento" fits the Jira term "execution chain"; "caso" maps to process mining's case but may read as support
  ticket; naming the business object directly ("o contrato X passou por 5 fluxos") avoids an abstract term.
  "Ocorrência"/"incidente" maps to Camunda's incident for failures needing action. These are proposals, not sourced
  usage.

### Gaps
- Official PT-BR UI strings of Power Automate Process Mining, Celonis or Camunda were not checked.
- No source found where a product uses "jornada" or "trilha" for an automation chain.
