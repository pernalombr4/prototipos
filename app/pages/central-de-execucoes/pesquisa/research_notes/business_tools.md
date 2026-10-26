# Automation activity in business, work-management, CRM and BPM platforms (global and per record), as of October 2026

Scope: how platforms used by non-technical people show automation activity, both globally and per record. Products: Notion, Twenty, ClickUp, monday.com, Pipefy, HubSpot, Salesforce, Jira Automation, Airtable, ServiceNow, Bizagi, Kissflow and Celonis. Research date: 2026-10-24. Every claim has a source. Third-party sources are flagged as such, and so is any article without a date.

## 1. Global view of all automations' activity: does it exist, and what does it show?

### Takeaway
Most mature players now have a cross-board or account-wide automation surface. The best ones go beyond a log and act as a health dashboard:
- monday.com Autopilot hub, "Health" tab: failures by importance, owner, time of last failure, board, and an AI root-cause label.
- HubSpot: a "Health" tab plus "Review automation issues", an issue inbox with the statuses Fixed, Ignored and Deferred.
- Jira: "Performance insights" plus an org-level "Audit log".
- ClickUp: a workspace "Activity" tab.
- Salesforce: the "Monitor" tab in the Automation Lightning app.

Notion and Twenty have the weakest global views. Notion has no workspace list or run log for database automations. Twenty has a "Workflow Runs" list with status, workflow and date filters, but no health metrics.

### Cited Findings

**monday.com**
- The Autopilot hub is described as a "centralized command center" for automations, integrations and workflows across the whole account. It has 4 tabs: Health, Usage, Workflows and Connections. — [monday.com: The Autopilot hub](https://support.monday.com/hc/en-us/articles/28738092924562-The-Autopilot-hub)
- Health tab:
  - shows "which automations are running, which are failing, and why";
  - lets you prioritize issues by the business importance set on each automation;
  - centralizes all failures and links to each one in context;
  - its failure drill-down table has an "AI-powered error classification" for root cause;
  - the table under the charts lists each automation or workflow with its description, the owner, the time of the last failure, the board, and an AI-generated root-cause classification;
  - filters by owner and by board.
  — [The Autopilot hub](https://support.monday.com/hc/en-us/articles/28738092924562-The-Autopilot-hub)
- Usage tab:
  - Action usage against the monthly limit;
  - counters for Active automations, Creators, Boards and Active workflows;
  - a daily action-use graph and pie charts for top boards or workflows and top creators;
  - lists of the top automations and workflows, with a CSV download.
  — [The Autopilot hub](https://support.monday.com/hc/en-us/articles/28738092924562-The-Autopilot-hub)
- Workflows tab: each workflow's status, workspace, importance and actions used. Connections tab: each app's status, which boards use it, the automations count and the last update. — [The Autopilot hub](https://support.monday.com/hc/en-us/articles/28738092924562-The-Autopilot-hub)
- No special permission is needed for the hub. Private boards and workflows stay hidden from users who cannot see them. — [The Autopilot hub](https://support.monday.com/hc/en-us/articles/28738092924562-The-Autopilot-hub)
- Board level: Automate > Manage tab > "Run history" lists every automation that ran on the board, with date and time and the status (in progress, failed or succeeded). It has filters. Retention is 10 days. — [monday.com: Automation Run history](https://support.monday.com/hc/en-us/articles/360017254600-Automation-Run-history)
- Hovering the cog icon in the log shows "the action count produced by that particular automation", which helps users understand billed actions. — [Automation Run history](https://support.monday.com/hc/en-us/articles/360017254600-Automation-Run-history)
- "Automation importance": each automation and workflow can be ranked by importance, and that ranking drives Health prioritization. — [Automation Run history](https://support.monday.com/hc/en-us/articles/360017254600-Automation-Run-history)
- Retention conflict: an older version of the article said "past 7 days or up to 500 automation runs". The current article says 10 days. — [search snapshot of the older version](https://support.monday.com/hc/en-us/articles/360017254600-Automation-Activity-Log) vs. [current version](https://support.monday.com/hc/en-us/articles/360017254600-Automation-Run-history)
- Plan allowances: Pro has 25,000 automation actions and 25,000 integration actions per month. Enterprise has 250,000 of each. — [monday.com pricing article, via search snippet](https://support.monday.com/hc/en-us/articles/360002826680-Automations-and-Integrations-Pricing)

**HubSpot**
- Automation > Workflows > "Health" tab. Updated 2026-08-03, for Professional and Enterprise plans. Reports:
  - "Workflows needing review": the count of workflows whose Issue status is "Needs review";
  - "Unused workflows": no enrollments for at least 90 days;
  - "Opportunities to review workflows with issues";
  - "Opportunities to delete unused workflows".
  — [HubSpot: Monitor your workflow health](https://knowledge.hubspot.com/workflows/monitor-your-workflow-health)
- "Review automation issues" (top right of the Workflows tool) opens an issue inbox for all automation tools, including workflows, journeys and pipeline automation:
  - the "Needs review" tab filters by Created in, Object type, Business units and Created by, and can be exported;
  - you can switch between the "[x] Automations" and "[x] issues" lists;
  - each issue can be set to Fixed, Ignored or Deferred, with an optional note. A Fixed issue that reoccurs comes back as "Needs review";
  - each issue lists the impacted records with Trigger source, Review status and Occurred on.
  — [HubSpot: Troubleshoot automation issues](https://knowledge.hubspot.com/workflows/troubleshoot-common-automation-issues)
- Per workflow, the details page has the "Action logs", "Enrollment history" and "Performance" tabs, plus a "Review workflow issues" button:
  - Action logs columns: [Record], Diagnose, Action, Event, Time. The Event filter has All events, Successes, Information and Errors;
  - Performance metrics: Total enrolled, Estimated unique enrolled, 7 day total enrollment, and enrolled, lost and completed over time.
  — [HubSpot: Understand your workflow details page](https://knowledge.hubspot.com/workflows/understand-your-workflow-details-page) (updated 2026-09-28)
- Retention and limits: action logs 90 days, enrollment history 6 months. Success logs are capped at 100,000 per day. Above the cap, error logs are still stored. — [Understand your workflow details page](https://knowledge.hubspot.com/workflows/understand-your-workflow-details-page)

**ClickUp**
- Workspace avatar > Automations > "Activity" tab covers Automations and Autopilot Agents. It is "organized into sections based on the date" of each run. — [ClickUp: View your Automations and Autopilot Agents activity](https://help.clickup.com/hc/en-us/articles/30953763592087-View-your-Automations-and-Autopilot-Agents-activity)
- Filters: Location (Space, Folder, Subfolder, List), Date run and Status. — [same article](https://help.clickup.com/hc/en-us/articles/30953763592087-View-your-Automations-and-Autopilot-Agents-activity)
- Columns: Time run, Name, Edit (pencil icon), Location, Trigger ("The task that triggered"), Run By ("The person who triggered"), Status, and Report bug. — [same article](https://help.clickup.com/hc/en-us/articles/30953763592087-View-your-Automations-and-Autopilot-Agents-activity)
- Per rule, you edit the automation and click "Activity" in the upper right to see its runs, with a status filter. — [same article](https://help.clickup.com/hc/en-us/articles/30953763592087-View-your-Automations-and-Autopilot-Agents-activity)
- The "Manage" tab shows Active and Inactive automations per location, with a status filter (All, Active, Inactive). — [ClickUp: Manage Automations](https://help.clickup.com/hc/en-us/articles/6312119071383-Manage-Automations) (from a search snippet; the page was not fetched in full)
- A release note announced "Centralized Automation Activity" with "the date, status, and actions for each Automation". — [ClickUp Release Notes 3.19](https://feedback.clickup.com/changelog/clickup-release-notes-319)
- Usage alert emails go to owners and admins at 90% and 100% of Automations usage. Limits reset on the 1st of each month. The Free plan has 5 active automations and 100 actions per month. — [ClickUp: Automations feature availability and limits](https://help.clickup.com/hc/en-us/articles/23477062949911-Automations-feature-availability-and-limits) (from a search snippet)

**Jira / Atlassian Automation**. The docs now call rules "flows".
- "Performance insights" exist at space level and at instance level. The instance view is in admin settings > automation > ••• > View performance insights and covers all spaces. It shows Execution count, Average duration and Total duration, each split by the result statuses. — [Atlassian: View performance insights](https://support.atlassian.com/cloud-automation/docs/view-performance-insights-for-automation-rules/)
- Org-level "Audit log": Organization settings > Automation > Manage automations > Audit log. Columns: Date, Flow, Status, Duration, Operations. Retention is 90 days. It requires the Enterprise plan. — [Atlassian: Manage automation rules in Atlassian Administration](https://support.atlassian.com/organization-administration/docs/manage-automation-rules-in-atlassian-administration) (undated)
- The org-level "Manage automations > Flows" list supports Labels and lets admins edit "Allow flow trigger", "Notify on error" and the owner. — [same](https://support.atlassian.com/organization-administration/docs/manage-automation-rules-in-atlassian-administration)
- Automation usage is calculated against plan limits, and billing admins get alerts at 90% and 100%. — [Atlassian: View your automation usage](https://support.atlassian.com/cloud-automation/docs/view-your-automation-usage/); [Who gets notification on automation usage?](https://support.atlassian.com/automation/kb/who-gets-notification-on-automation-usage)

**Salesforce**
- Spring '25 release note: "Monitor All Failed and Paused Flow Interviews from the Automation Lightning app". The "Monitor" tab lists failed and paused interviews and shows why each one failed. "Open" debugs a failed interview and "Resume" resumes a paused one. — [Salesforce release notes](https://help.salesforce.com/s/articleView?language=en_US&id=release-notes.rn_automate_ala_monitor_all_failed_and_paused_flow_interviews_from_the_automation_lightning_app.htm&release=254&type=5)
- It requires the "Enable the Automation Lightning App" process automation setting. — [ASAGARWAL tip (third party)](https://academy.asagarwal.com/c/release-features/salesforcespring25-use-automation-lightning-app-to-monitor-all-failed-and-paused-flow-interviews)
- The older surface is Setup > "Paused and Failed Flow Interviews". — [Apex Hours (third party)](https://www.apexhours.com/troubleshooting-a-broken-flow-in-salesforce-with-simple-example/); an earlier release note: [Find Failed Flows Faster](https://help.salesforce.com/s/articleView?id=release-notes.rn_automate_flow_debug_failed_list_view.htm&language=en_US&release=232&type=5)
- The Admin blog says the Automation App monitors individual interviews, with status and error messages, and resumes paused flows. — [Salesforce Admins blog, Spring '25](https://admin.salesforce.com/blog/2025/unlock-new-automation-possibilities-with-spring-25-flow-features-be-release-ready)

**Twenty CRM (open source)**
- The "Workflow Runs" sidebar view lists runs across all workflows, filterable by status, workflow or date. Each workflow editor also has a "Runs" panel. — [Twenty: Workflow runs](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-runs)
- Documented statuses: Running, Completed, Failed, Waiting. — [same](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-runs)
- The code enum has more statuses: NOT_STARTED, RUNNING, COMPLETED, FAILED, ENQUEUED, STOPPING, STOPPED. — [workflow-run.workspace-entity.ts](https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-server/src/modules/workflow/common/standard-objects/workflow-run.workspace-entity.ts)
- Limits: a soft limit of 100 runs per minute (extra runs wait as "Not Started") and a hard limit of 5,000 runs per hour per workspace. Runs over the hard limit fail and "may not appear in the runs list". — [Twenty: Workflows FAQ](https://docs.twenty.com/user-guide/workflows/how-tos/need-more-help/workflows-faq.md)
- No health dashboard, counters or owner column is documented. — [Workflow runs](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-runs)

**Pipefy**
- Per pipe, the "Automation Logs" sit next to "Create new automation" on the pipe's Automations page. They show the execution status of the trigger, which automations succeeded or failed, and the date and time, with filtering and segmentation. Inside a rule, a button opens that rule's logs for "the past three months". The feature is flagged "Beta" and is for super, company and pipe admins on all plans. — [Pipefy: Automation logs](https://help.pipefy.com/en/articles/9186536-automation-logs)
- The API has `automationLogs` (one automation) and `automationLogsByRepo` (all automations in a pipe), with status and search filters. — [Pipefy developers: automationLogsByRepo](https://developers.pipefy.com/reference/automation-logs-by-repo); [automationLogs](https://developers.pipefy.com/reference/automation-logs)
- Pipe "Activities" (Manage > Activities) has 2 tabs:
  - Card activity, for members and admins;
  - Configuration changes, for admins only. It logs automation events such as "Automation activated", "Automation trigger changed" and "Automation action type changed", with before and after values.
  The CSV export covers the last 30 days. — [Pipefy: Activities for pipes and cards](https://help.pipefy.com/en/articles/15062678-audit-logs-for-pipes-and-cards)
- There is no confirmed cross-pipe (company-wide) automation run dashboard in the UI. The webhook below is Pipefy's suggested route to company-wide monitoring.

**Airtable**
- Per automation: an "Automation history" section in the automation's setup window shows failed and successful runs. Clicking an entry shows its details. Test runs are excluded. Failed runs can be rerun. — [Airtable: Managing automations](https://support.airtable.com/docs/managing-airtable-automations); [Troubleshooting automations](https://support.airtable.com/docs/troubleshooting-airtable-automations)
- Base level: the "Automations list" can be sorted and grouped into sections, and shows the "Running slowly" and "Paused by Airtable" status indicators. Usage lives in the account overview > workspace > "Usage". — [Managing automations](https://support.airtable.com/docs/managing-airtable-automations)

**ServiceNow (Workflow Studio / Flow Designer)**
- Workflow Studio "Operations" tab lists flow executions, each with an execution details page. — [ServiceNow: Flow execution details](https://www.servicenow.com/docs/r/build-workflows/workflow-studio/flow-execution-details.html)
- The FDIH Dashboard has a "Flow Executions" section with creation date, runtime duration, state, calling source and application. An "Operations Dashboard" module shows the count of flows run and the average runtime. Access is role-based: flowoperator, fdreadoperations, fdreadoperationsall. — [ServiceNow FDIH Dashboard](https://www.servicenow.com/docs/r/QG7EzyJSIJf6bo5K1OVTbw/dCejqN1eRriMp~fVQiY~Wg); [Flow administration](https://www.servicenow.com/docs/r/QG7EzyJSIJf6bo5K1OVTbw/uAEFUhlb9U2DmwjxHjPFng) (from search snippets)

**Notion**
- Database automations are listed only per database (the ⚡ icon or Automations in the database menu), with Edit, Pause and Delete. The help page describes no workspace-wide list and no run log for database automations. — [Notion: Database automations](https://www.notion.com/help/database-automations)
- Custom Agents (a separate product, announced as Notion 3.3 in February 2026) have an "Activity" tab: "A log of every agent run", with the trigger, the actions taken and any errors, visible to users with Full Access. An "Insights" tab compares model use, output quality and credits across runs. — [Notion: Custom Agents](https://www.notion.com/help/custom-agent); [Custom Agent insights, 2026-05-21 (third party)](https://www.createwith.com/tool/notion/updates/notion-rolls-out-custom-agent-insights-for-full-visibility-into-agent-runs)

### Inferences
- The leaders (monday.com and HubSpot) treat the global screen as a health and triage surface, not a raw log. It shows what is failing, its importance, its owner, its last failure and a plain cause, and links to fix it in context. Action counters and usage come as a second tab.
- Business-importance ranking (monday "Automation importance") is a cheap, user-set signal that makes a global failure list sortable for non-technical admins.
- An issue lifecycle (Needs review, then Fixed, Ignored or Deferred, as in HubSpot) is a pattern for keeping a global failures list from becoming permanent noise.

### Gaps
- I could not confirm exact ClickUp retention per plan. The help article says it varies by plan but gives no numbers in the fetched text.
- I did not find official text for a Salesforce "Automation Home" dashboard with counters. The documented global surface is the Monitor tab for failed and paused interviews, and I found no documented success or total counts.
- I did not verify Pipefy dashboards or Reports showing automation metrics. The automation logs article only links "Usage Statistics".
- I did not fetch the Kissflow process-admin docs. Only Kissflow integration run history was found: 100-day retention, retry, error messages. — [Kissflow community: managing integrations](https://community.kissflow.com/t/x2h4ak8/managing-integrations)

## 2. Record-centric view: on a given record, can the user see which automations touched it, in what order, with status?

### Takeaway
A per-record view exists in several products:
- Pipefy "Timeline" (released 2026-06): chronological, phase-anchored, with attribution to user, automation or AI Agent, plus an analytics header.
- monday.com item "Activity Log > Automation activity".
- HubSpot "Enrollment details" per record, plus "Workflow memberships" on the contact record.
- Jira "Recent rule runs" in the work item's Automation pane, capped at the last 8 runs.
- ServiceNow "Open Current Record" from an execution. This is the reverse direction, from the run to the record.

Salesforce has no native record-level list of flows that ran. Twenty stores a workflow actor on records but documents no "runs of this record" panel. Notion documents nothing.

### Cited Findings

**Pipefy: card Timeline (closest to the "contract X runs through which flows?" question)**
- Steps: open any card > "Activities" tab > "View timeline" button. It is available on all plans, for admins, super admins and pipe members. — [Pipefy: How to view a card's activities on a timeline](https://help.pipefy.com/en/articles/15445139-how-to-view-a-card-s-activities-on-a-timeline)
- Analytics header:
  - "Card duration";
  - "Phases visited";
  - "Automated activities" (the % of activities completed automatically on this card);
  - "Handoffs" (assignee changes);
  - "Bottleneck" (the phase where the card spent most time).
  — [same](https://help.pipefy.com/en/articles/15445139-how-to-view-a-card-s-activities-on-a-timeline)
- Each event shows what happened (phase transitions, automation triggers, field updates, alerts, comments), when, and "Who or what triggered it — a user, a Pipefy automation, or an AI Agent". Events are "visually anchored to the phases the card went through". — [same](https://help.pipefy.com/en/articles/15445139-how-to-view-a-card-s-activities-on-a-timeline)
- Stated use cases, in plain language: "A field wasn't filled in even though an automation should have filled it", "An automation didn't fire even though the conditions seemed to be met". The pitch is that it works "without needing to open multiple screens (Activities, pipe configuration, automations, conditionals)". — [same](https://help.pipefy.com/en/articles/15445139-how-to-view-a-card-s-activities-on-a-timeline)
- Announced on 2026-06-12 as "Card Timeline: see everything that happened in a card from start to finish". — [Pipefy Community product update](https://community.pipefy.com/product-updates/card-timeline-see-everything-that-happened-in-a-card-from-start-to-finish-5278)
- The Automation Logs API returns the card ID and card title per execution, so logs can be pivoted by card. — [Pipefy developers](https://developers.pipefy.com/reference/automation-logs-by-repo) (from a search snippet)

**monday.com**
- "Run history for a single item": open the item > "Activity Log" > "Automation activity" button. — [monday.com: Automation Run history](https://support.monday.com/hc/en-us/articles/360017254600-Automation-Run-history)
- "Automation indication avatar": the board activity log shows which automation triggered a change. Clicking the avatar "links directly to the specific automation or workflow responsible", and the Run history tab opens on the right. — [same](https://support.monday.com/hc/en-us/articles/360017254600-Automation-Run-history)
- Earlier community complaints said the item activity log showed only that "an automation" made the change, without naming which one. The avatar feature appears to address that. — [monday Community: Activity Log, Automation and Integration detail on changes](https://community.monday.com/t/activity-log-automation-and-integration-detail-on-changes/115046) (now 404; content from a search snippet)

**HubSpot**
- The contact record's right panel has a "Workflow memberships" section. "Manage" opens it, and "Enroll in workflow" is available there. — [HubSpot: Manually enroll records in workflows](https://knowledge.hubspot.com/workflows/manually-enroll-objects-into-workflows) (updated 2026-10-22)
- Per record inside a workflow: Enrollment history > "Choose a trigger source" (pick the record) > hover > "Enrollment details". The right panel shows the record's workflow history. Each event has Action, Time and "Workflow revision at time of event", and clicking the timestamp shows the workflow layout at that time. — [HubSpot: Understand your workflow details page](https://knowledge.hubspot.com/workflows/understand-your-workflow-details-page)
- Action logs rows offer "Unenroll" (for active records) and "Event details". — [same](https://knowledge.hubspot.com/workflows/understand-your-workflow-details-page)
- "Automation cards" can be added to record views, with Settings > Objects > Record Customization, to enroll a record from the record page. — [HubSpot: Enroll records in workflows using CRM cards](https://knowledge.hubspot.com/workflows/enroll-records-in-workflows-using-crm-cards)

**Jira**
- In the work item view, the "Automation" pane at the bottom has a "Recent rule runs" pane with "Refresh". It shows "the last eight rule executions". — [Atlassian KB: View Recent Automations for a Jira Work Item](https://support.atlassian.com/jira/kb/how-to-display-the-recently-executed-list-of-automations-against-an-individual-jira-issue) (updated 2025-09-25)
- The list cannot be filtered to show only rules that acted on the ticket (Atlassian staff answer). — [Atlassian Community](https://community.atlassian.com/forums/Jira-Service-Management/Automation-How-to-show-only-Rules-that-worked-on-ticket/qaa-p/2643384) (from a search snippet)

**Twenty**
- Records carry `createdBy` and `updatedBy` actor fields. The source enum includes WORKFLOW, as well as AGENT, API, IMPORT, MANUAL, SYSTEM, WEBHOOK and APPLICATION. The actor also stores a name and a JSON "context". — [actor.composite-type.ts](https://github.com/twentyhq/twenty/blob/main/packages/twenty-shared/src/types/composite-types/actor.composite-type.ts)
- The TimelineActivity object has `targetWorkflowRun`, `targetWorkflow` and `targetWorkflowVersion` relations, plus `linkedRecordId` and `linkedObjectMetadataId`. — [timeline-activity.workspace-entity.ts](https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-server/src/modules/timeline/standard-objects/timeline-activity.workspace-entity.ts)
- The WorkflowRun entity has no relation to the business record that triggered it. Trigger data lives inside `state`. — [workflow-run.workspace-entity.ts](https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-server/src/modules/workflow/common/standard-objects/workflow-run.workspace-entity.ts)
- The docs and FAQ do not explain how to view runs for a specific record. — [Workflow runs](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-runs); [FAQ](https://docs.twenty.com/user-guide/workflows/how-tos/need-more-help/workflows-faq.md)
- A workflow run record has command-menu actions: Retry, Stop, See workflow and See version. — [twenty-front workflow-runs commands folder](https://github.com/twentyhq/twenty/tree/main/packages/twenty-front/src/modules/command-menu-item/engine-command/record/single-record/workflow-runs/components)
- Conflict: the FAQ says "There is no automatic retry", but the code has a manual Retry command. — [FAQ](https://docs.twenty.com/user-guide/workflows/how-tos/need-more-help/workflows-faq.md)

**Salesforce**
- Flow Trigger Explorer shows which flows are configured on an object, not which flows ran on a given record. I found no standard record-page component that lists flow executions. The nearest is the Guided Action List "History" tab, which shows the flows launched for the record, with started, paused, resumed and completed states and the last 20 state changes. — [Salesforce Guided Engagement docs (older version)](https://developer.salesforce.com/docs/atlas.en-us.216.0.salesforce_guided_engagement.meta/salesforce_guided_engagement/guided_engagement_access_history.htm)

**ServiceNow**
- From an execution's details page, the "Open Current Record" link opens the triggering record, and "Open Context Record" and "Open Flow Logs" are also available. A parent flow lists its subflows inline and lets you expand them. — [ServiceNow: Flow execution details](https://www.servicenow.com/docs/r/build-workflows/workflow-studio/flow-execution-details.html)
- Playbooks (Process Automation Designer) show a record's workflow as stages or lanes with activity cards in the agent workspace. "Playbook Activity State Mapping" customizes how activity statuses appear on cards. — [ServiceNow: Customer service case playbooks](https://docs.servicenow.com/bundle/vancouver-customer-service-management/page/product/customer-service-management/concept/customer-service-case-playbooks.html); [Process Automation Designer](https://www.servicenow.com/docs/r/build-workflows/workflow-studio/process-automation-designer.html) (from search snippets)

**Bizagi (BPM)**
- "Graphic Query": from the Inbox, click the graphic icon beside the star on a case row. It shows the process diagram with the "Current activity highlighted in green". The "Path" button highlights the path the case followed, and clicking an activity shows who handled it. — [Bizagi: Graphic Query](https://help.bizagi.com/platform/en/graphic_query.htm) (updated January 2024)
- The "State Log" gives a case's chronological history (data changes, users, flow), with a "By Activities" view. The "Case Folder" has a "Timeline". — [Bizagi: State log](https://help.bizagi.com/platform/en/state_log.htm); [Case Folder](https://help.bizagi.com/platform/en/case_folder.htm)

**Airtable and Notion**
- Neither help page says whether a record shows which automation changed it. — [Airtable: Managing automations](https://support.airtable.com/docs/managing-airtable-automations); [Notion: Database automations](https://www.notion.com/help/database-automations)

### Inferences
- Two record-centric patterns appear:
  - a chronological timeline with actor attribution (Pipefy, monday, Twenty actor), where automations are one event type among human edits;
  - a "where is this case now" process diagram (Bizagi Graphic Query, ServiceNow playbook lanes).
  For "contract X is running through which flows?", Pipefy's design is the closest match: a phase-anchored timeline, attribution per event, and a % "Automated activities" header.
- Jira's cap of 8 runs and HubSpot's per-workflow lookup show the weak versions. If a record view only shows recent runs, or requires knowing the workflow first, it does not answer the cross-flow question.
- Twenty's model (runs not linked to the triggering record; actor stored on the record) is the anti-pattern ENSPACE can avoid, because Spaceflow's "link the item to the execution" already gives the run-to-record key.

### Gaps
- I could not confirm in Twenty's UI whether record timelines render "by workflow X" entries. The data model supports it (actor source WORKFLOW and TimelineActivity), but no doc confirms the UI.
- I could not confirm whether monday's item "Automation activity" shows failed runs, or only changes.
- HubSpot's "Workflow memberships" section content (current only, or history too; status shown) is not described in the fetched text.

## 3. Interdependencies between automations: chaining, ordering on the same object, loops

### Takeaway
- Ordering: Salesforce Flow Trigger Explorer is the reference for ordering on the same object. It shows the flows per object and trigger type, grouped by execution phase, and the order is editable.
- Dependencies: HubSpot has a "Connections" tab per workflow, listing referenced assets including other workflows.
- Loops: Jira detects loops at chain length 10, adds a "Loop" status, and has a per-rule "Allow flow trigger" opt-in that is off by default. Notion blocks chaining entirely. Airtable auto-pauses runaway automations. Celonis shows end-to-end flows across objects in the multi-object Process Explorer.
- No product found shows a live runtime graph, for a single record, of "run A caused run B caused run C".

### Cited Findings
- **Salesforce Flow Trigger Explorer** (Spring '22):
  - pick an object and see every record-triggered flow that runs on create, update or delete;
  - flows are grouped into "Fast Field Updates" (before save), "Actions and Related Records" (after save) and "Run Asynchronously";
  - you can change run order and manage versions;
  - opened from the Start element ("Open Flow Trigger Explorer for <Object>") or from Setup > Flows.
  — [Trailhead: Meet Flow Trigger Explorer](https://trailhead.salesforce.com/content/learn/modules/record-triggered-flows/meet-flow-trigger-explorer); [SalesforceBen (third party)](https://www.salesforceben.com/everything-you-need-to-know-about-flow-trigger-explorer/); [ASAGARWAL, Spring '22 (third party)](https://www.asagarwal.com/salesforcespring22-one-place-to-view-all-record-triggered-flows-on-an-object/)
- **HubSpot "View workflow connections"**: in the workflow editor, the "Connections" tab lists the asset types the workflow uses (lists, properties, other workflows) and the assets that reference it. — [HubSpot: View workflow connections](https://knowledge.hubspot.com/workflows/view-workflow-connections) (updated 2026-08-03, from a search snippet). A third-party guide says it shows workflows sharing triggers or property updates. — [INSIDEA (third party, updated 2026-10-19)](https://insidea.com/blog/hubspot/kb/how-to-view-workflow-connections-in-hubspot)
- An older community thread says the property "Used in" list was the only way to trace dependencies and did not show whether each workflow was on or off. — [HubSpot Ideas: Property audit, used in active workflow](https://community.hubspot.com:443/t5/HubSpot-Ideas/Property-Audit-Used-in-Active-Workflow/m-p/634999) (undated in the snippet)
- **Jira Automation loops**:
  - Status "Loop". The message reads "Rule execution was stopped since an execution loop was detected… disable the 'Allow rule trigger' setting… We stopped execution after detecting a long chain of rules triggering other rules. Chain length: 10".
  - The open suggestion AUTO-1917 complains that the message does not say which work item caused the loop (created 2025-06-23, updated 2026-10-16, unresolved).
  — [Jira AUTO-1917](https://jira.atlassian.com/browse/AUTO-1917)
- Jira: "Allow flow trigger" (whether a flow's actions can trigger other flows) is off by default to prevent loops, and editable at org level. — [Atlassian: Manage automation rules in Atlassian Administration](https://support.atlassian.com/organization-administration/docs/manage-automation-rules-in-atlassian-administration)
- **Notion**: "Database automations can't be triggered by other automations". Button actions can trigger them. For example, an automation that creates a page in another database won't trigger that database's automations. — [Notion: Database automations](https://www.notion.com/help/database-automations)
- **Airtable**: "Paused by Airtable" happens on abnormally high run volume and stays paused until re-enabled. An email goes to the person who turned it on and to the subscribers. The docs warn that chained automations can form loops. — [Airtable: Managing automations](https://support.airtable.com/docs/managing-airtable-automations)
- **ClickUp**: if the same automation fails more than 5 times in 1 week with the same error, it is deactivated and its creator is emailed (or the Workspace owner, if the creator has left). — [ClickUp: View your Automations and Autopilot Agents activity](https://help.clickup.com/hc/en-us/articles/30953763592087-View-your-Automations-and-Autopilot-Agents-activity)
- **Twenty**: there is no documented loop protection. Throttling caps runs at 100 per minute (soft) and 5,000 per hour (hard). The Troubleshooting page warns that "Record is created" fires immediately in the UI and recommends a "createdAt equals updatedAt" filter or a checkbox to run once. — [Twenty FAQ](https://docs.twenty.com/user-guide/workflows/how-tos/need-more-help/workflows-faq.md); [Twenty troubleshooting (GitHub source)](https://github.com/twentyhq/twenty/blob/main/packages/twenty-docs/user-guide/workflows/how-tos/need-more-help/workflow-troubleshooting.mdx); [throttling service](https://github.com/twentyhq/twenty/blob/main/packages/twenty-server/src/modules/workflow/workflow-runner/workflow-run-queue/workspace-services/workflow-throttling.workspace-service.ts)
- **ServiceNow**: a parent flow execution lists its subflows inline, each expandable, and each subflow run has its own details page. — [ServiceNow: Flow execution details](https://www.servicenow.com/docs/r/build-workflows/workflow-studio/flow-execution-details.html)
- **Celonis multi-object Process Explorer**: the process is "visualized as objects and their corresponding events". Activities that touch several objects appear once, where the object flows meet. Counts are broken out by object type, and a colored square marks each object's flow. It is automatic on object-centric data models. — [Celonis: Multi-object Process Explorer](https://docs.celonis.com/en/multi-object-process-explorer.html); [Celonis: Object-centric process mining](https://docs.celonis.com/en/object-centric-process-mining.html)
- Celonis's object-centric approach uses an O2C example in which 1 sales order fans out into deliveries, invoices and payments, and analyzes the entities together rather than as 1 linear case. — [Celonis: Object-centric process mining](https://docs.celonis.com/en/object-centric-process-mining.html)
- A DEV Community post says HubSpot "does not natively surface these dependency chains in a visual or relational way" (circular dependencies). — [DEV Community (third party)](https://dev.to/entflow/detecting-and-fixing-circular-dependencies-in-hubspot-workflows-3g36)

### Inferences
- Static dependency views (Flow Trigger Explorer, HubSpot Connections) answer "what could run on this object or event". None of the business tools found answers at runtime, for one record, "which run spawned which run". Celonis comes closest conceptually, by merging object flows (contract, progress record) into one diagram.
- For the ENSPACE case (contract created, then flow A creates progress, then flow B triggers on progress created), the Celonis pattern maps to an operation view that groups linked items. Salesforce's per-category, ordered list of flows maps to a "flows that react to Contract" panel.
- Loop handling with a plain status ("Loop"), a chain-length limit and an explicit opt-in for chaining (Jira) is the clearest non-technical pattern. Jira's own bug shows that the message must name the record that looped.

### Gaps
- I found no business tool with a runtime causal chain across automations for a single record (trace or correlation id shown in the UI).
- I did not verify whether monday.com or Pipefy have loop protection or per-object ordering.
- The official text of HubSpot's "Connections" page was taken from a search snippet only, not a full fetch.

## 4. Wording and UX for non-technical users: status names, plain descriptions of runs, error explanations

### Takeaway
Status vocabularies cluster around success, failure, in progress or pending, skipped or no action, and waiting or paused. The non-technical leaders add plain-language explanations to failures:
- monday.com: a red "suggestion" under each failed run, plus an AI root-cause classification;
- Pipefy: the webhook failure reasons, such as "wrong conditional field" and "required field violation";
- ClickUp: a "Skipped" status defined with an example;
- HubSpot: the "Diagnose" column and the "Needs review" issue status.

### Cited Findings
- **ClickUp** statuses and definitions:
  - Pending: "attempting to complete its job, but hasn't finished";
  - Failed: "One or more steps were not completed. If one step fails, the entire process will fail";
  - Skipped: "The criteria required … weren't available", with an example ("If there are no tasks in Urgent status, the Agent will skip the job");
  - Success: "completed its actions".
  — [ClickUp help](https://help.clickup.com/hc/en-us/articles/30953763592087-View-your-Automations-and-Autopilot-Agents-activity)
- **monday.com**: "In progress" ("the automation is busy actioning and could take a bit of time"), "Failure", and "A suggestion will appear, highlighted in red under the failed automation, on how to fix the issue". — [monday.com Run history](https://support.monday.com/hc/en-us/articles/360017254600-Automation-Run-history). The Health tab adds an "AI-generated root cause classification that will explain what might have caused your automations to fail", with a link to the impacted location. — [Autopilot hub](https://support.monday.com/hc/en-us/articles/28738092924562-The-Autopilot-hub)
- **Jira** statuses: Successful, No actions, Some errors, Loop, Throttled. Performance insights define them: "Successful (an action was performed)", "No action (ran, but no action was performed)", "Loop (the execution looped)", "Throttled (a service limit was exceeded)". — [Atlassian: Troubleshoot automation rules](https://confluence.atlassian.com/automation/troubleshoot-automation-rules-1141480666.html); [View performance insights](https://support.atlassian.com/cloud-automation/docs/view-performance-insights-for-automation-rules/)
- Jira bug AUTO-1932: "No actions performed" can show right after a run and flip to "Success" on refresh. — [AUTO-1932](https://jira.atlassian.com/browse/AUTO-1932)
- **HubSpot**: Action logs have a "Diagnose" column, and the Event filter has "Successes, Information, Errors". Issues have the statuses "Needs review", "Fixed", "Ignored" and "Deferred". "Lost" reasons cover manual unenrollment, suppression lists, unsubscribes and bounces. — [Understand your workflow details page](https://knowledge.hubspot.com/workflows/understand-your-workflow-details-page); [Troubleshoot automation issues](https://knowledge.hubspot.com/workflows/troubleshoot-common-automation-issues)
- **Twenty**: Running, Completed, Failed, Waiting ("paused, such as at a Delay action or a Form submission"). Common causes are listed in plain terms: missing required fields, invalid data formats, external API errors, permission issues. Run tabs (code): node, input, output, logs. — [Twenty: Workflow runs](https://docs.twenty.com/user-guide/workflows/capabilities/workflow-runs); [WorkflowRunTabId.tsx](https://github.com/twentyhq/twenty/blob/main/packages/twenty-front/src/modules/workflow/workflow-steps/types/WorkflowRunTabId.tsx)
- **Airtable**: "Failed run", "Running slowly" (runs queued), "Paused by Airtable", "Pending". The first troubleshooting step is to expand the error message in the failed run. — [Airtable: Managing automations](https://support.airtable.com/docs/managing-airtable-automations); [Troubleshooting](https://support.airtable.com/docs/troubleshooting-airtable-automations)
- **ServiceNow**: Completed, Cancelled, Waiting, Paused, "Presumed Interrupted", Error. A "Go to error" action jumps to the failing step. — [ServiceNow: Flow execution details](https://www.servicenow.com/docs/r/build-workflows/workflow-studio/flow-execution-details.html)
- **Salesforce** FlowInterview status includes Error ("This flow has one or more errors. To resolve each error, check the error code for instructions"), Paused and VersionPaused. — [Salesforce FlowInterview object](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/api/sforce_api_objects_flowinterview.htm)
- **Pipefy**: the webhook payload gives a root cause on failures ("wrong conditional field, required field violation, empty field, and others"), plus the automation name, trigger, action, status (success or failed), duration and card and pipe details. — [Pipefy Community: Automation Alerts via Webhook](https://community.pipefy.com/product-updates/automation-alerts-via-webhook-real-time-notifications-for-every-automation-execution-5329)
- **Pipefy** configuration-change logs are written as sentences, for example "Changed the trigger of "Send approval email" from "Card enters a phase" to "Field value is updated"". — [Pipefy: Activities for pipes and cards](https://help.pipefy.com/en/articles/15062678-audit-logs-for-pipes-and-cards)
- **Notion**: an automation that worked before and then errors is paused, and a notification links to it for fixing. The page notes that for some failures (formulas, webhooks) "you may not be notified". — [Notion: Database automations](https://www.notion.com/help/database-automations)

### Inferences
- A "Skipped" or "No action" status is important for non-technical users. It separates "the flow ran but its conditions weren't met" from "it broke". Both ClickUp and Jira define it explicitly.
- A short "suggested fix" next to each failure (monday) and sentence-style audit entries (Pipefy) are the most accessible patterns found.
- "Waiting" needs a reason, for example a Delay or a form (Twenty), so users don't read it as stuck.

### Gaps
- I did not obtain monday.com's exact list of AI root-cause categories.
- I did not obtain HubSpot's full list of Event column values.

## 5. Alerts and notifications for failures, and who receives them

### Takeaway
Default recipients are usually the automation's creator or owner:
- Jira "Notify on error";
- ClickUp creator, falling back to the Workspace owner;
- Airtable last enabler plus up to 10 subscribers;
- Salesforce last modifier or Apex exception recipients;
- HubSpot "Needs review" notifications to chosen users and teams (Enterprise only).

Pipefy (2026) adds a per-pipe webhook for every execution. Usage-limit alerts go to admins or billing admins at 80, 90 or 100%.

### Cited Findings
- **ClickUp**: after more than 5 identical failures in 1 week, the automation is deactivated and the creator is emailed, or the Workspace owner if the creator left. Email and Custom Field errors trigger an immediate email. — [ClickUp help](https://help.clickup.com/hc/en-us/articles/30953763592087-View-your-Automations-and-Autopilot-Agents-activity)
- **ClickUp** feature request "Automation Error Notifications and Workspace Alerts" says automations "may fail silently". — [ClickUp feedback](https://feedback.clickup.com/feature-requests/p/automation-error-notifications-and-workspace-alerts) (from a search snippet)
- **Jira / Atlassian**: "Notify on error" sets how often the rule owner (by default the creator) is emailed when a run errors. Billing admins are alerted at 90% and 100% usage. — [Atlassian: What are rule details](https://support.atlassian.com/cloud-automation/docs/what-are-rule-details-in-atlassian-automation); [Who gets notification on automation usage?](https://support.atlassian.com/automation/kb/who-gets-notification-on-automation-usage)
- **Jira** Data Center offers 2 modes: every failure, or only the first failure after a success. — [Atlassian KB: notification emails are not always sent when a rule fails](https://support.atlassian.com/automation/kb/notification-emails-are-not-always-sent-when-a-rule-fails/)
- **Jira** complaint: the owner email "shares no context as to why the rule failed". — [AUTO-194](https://jira.atlassian.com/browse/AUTO-194) (from a search snippet)
- **HubSpot**: the workflow editor > Settings > Performance setting notifies users and teams each time the workflow's status changes to "Needs review", for each new or recurring issue. It requires Enterprise, and users' notifications must be on. — [HubSpot: Understanding your workflow settings](https://knowledge.hubspot.com/workflows-user-guide-v2/understanding-your-workflow-settings) (from a search snippet)
- **HubSpot** idea thread "Workflow Error Notifications" (long-running). A 2023 PM post mentioned "a series of error management improvements in 2023, including notifications", and a user complained that notifications were Enterprise-only. — [HubSpot Ideas: Workflow Error Notifications](https://community.hubspot.com/t5/HubSpot-Ideas/Workflow-Error-Notifications/idi-p/11337)
- **Airtable**: failure notifications go to the automation's subscribers. The creator is auto-subscribed, anyone who clicks Update is added, the maximum is 10, and only workspace owners and base creators qualify. Service accounts can be added for distribution lists. Workspace owners get usage emails at 80%, 90% and 100%. — [Airtable: Managing automations](https://support.airtable.com/docs/managing-airtable-automations)
- **Salesforce**: Process Automation Settings decide whether the flow's last modifier or the Apex exception email recipients get failure emails. — [TargetX help (third party)](https://help.liaisonedu.com/TargetX_Help_Center/Salesforce_Basics/Getting_Started/Working_with_Salesforce_Flows)
- **Pipefy**: "Automation Alerts via Webhook" (2026-06-22, per a search snippet) is a per-pipe webhook on `automation.execution` for every success and failure, with root cause on failures and filters by trigger and action type. It requires a Pipe Admin or Service Account. Suggested uses are Slack, Datadog and Power BI health dashboards. — [Pipefy Community](https://community.pipefy.com/product-updates/automation-alerts-via-webhook-real-time-notifications-for-every-automation-execution-5329)
- **Notion**: notifies when a database or property the automation updates is missing, or when a Gmail or Slack connection is invalid. The automation is then paused. The page does not say who receives the notification. — [Notion: Database automations](https://www.notion.com/help/database-automations)
- **Twenty**: notifications are not covered in the docs. — [Twenty FAQ](https://docs.twenty.com/user-guide/workflows/how-tos/need-more-help/workflows-faq.md)

### Inferences
- The owner-only email breaks when the owner leaves, which is why ClickUp falls back to the Workspace owner. A subscriber list (Airtable) or users and teams (HubSpot) is the more robust pattern.
- Throttling repeated identical failures (ClickUp deactivates; Jira's "only the first failure after success" mode) prevents alert fatigue.

### Gaps
- I did not confirm monday.com's failure notification recipients. The Autopilot hub page doesn't mention alerts.

## 6. User complaints and feature requests about lacking global visibility

### Takeaway
Long-running, highly voted requests exist for a single cross-workspace automation view (ClickUp, 2.4k votes since 2020, still "future" in 2026). Others ask for failure alerts (HubSpot, ClickUp), loop origin (Jira), item-level attribution (monday) and run-history filtering (Airtable). The demand is general across tools.

### Cited Findings
- **ClickUp** "Manage Automations across the entire Workspace from a single place": posted 2020-08-21, about 2.4k votes, status "future". A staff update on 2026-01-16 says the team is "redesigning the automations experience" with "no engineering update here yet". Users ask to "view and amend automations across all spaces / lists" and to audit where automations live, "as it is with the custom fields". — [ClickUp feedback](https://feedback.clickup.com/feature-requests/p/manage-automations-across-the-entire-workspace-from-a-single-place)
- **ClickUp** requests "Audit log, edit history and restore for Automations" and "Automation Audit Logs". — [ClickUp feedback 1](https://feedback.clickup.com/feature-requests/p/audit-log-edit-history-and-restore-for-automations); [ClickUp feedback 2](https://feedback.clickup.com/feature-requests/p/automation-audit-logs)
- **monday.com**: users say they had to search across "account level automations, space automations, custom item type automations, and workflow automations". A staff reply said running automations on all boards "isn't currently on our roadmap". — [monday Community: Bulk editing/activating automations](https://community.monday.com/t/bulk-editing-activating-automations/116542/1); [monday Community: Set an automation across an entire account](https://community.monday.com/t/set-an-automation-across-an-entire-account/486) (from search snippets)
- **monday.com**: community threads say run history covers automations but not changes made by workflows. A post titled "There is no record when the automation running" reports missing run-history entries. — [monday Community thread](https://community.monday.com/t/there-is-no-record-when-the-automation-running/102794) (now 404; from a search snippet)
- **Jira** AUTO-1917 (9 votes, unresolved): the loop message lacks the work item. — [AUTO-1917](https://jira.atlassian.com/browse/AUTO-1917). AUTO-930 asks for "more granular data for automation rules execution". — [AUTO-930](https://jira.atlassian.com/browse/AUTO-930)
- **HubSpot** "Workflow Error Notifications" idea, multi-page and multi-year. — [HubSpot Ideas](https://community.hubspot.com/t5/HubSpot-Ideas/Workflow-Error-Notifications/idi-p/11337)
- **Airtable** idea "Filter option for automation run history". — [Airtable Community](https://community.airtable.com/t5/product-ideas/filter-option-for-automation-run-history/m-p/166588) (from a search snippet)
- **Salesforce**: third-party vendors sell Flow error-monitoring dashboards (Gearset), and Elements.cloud has an "Automation overview dashboard". This points to a gap in native monitoring. — [Gearset blog](https://gearset.com/blog/salesforce-flow-error-monitoring/); [Elements.cloud](https://support.elements.cloud/en/articles/2093651-automation-overview-dashboard)
- **Atlassian Marketplace** "Automation Monitor for Jira" alerts "when a rule stops checking in", for silent failures. — [Atlassian Marketplace](https://marketplace.atlassian.com/apps/2976112589/automation-monitor-for-jira)

### Inferences
- Even large vendors shipped global health views only recently: monday Autopilot hub, HubSpot Health and issues in 2026, Salesforce Monitor in Spring '25, Pipefy Timeline and webhooks in June 2026. ClickUp still lists its cross-workspace management request as "future". ENSPACE would be close to the current frontier, not catching up to an old standard.

### Gaps
- I found no Notion community thread or official request about database automation run logs.
- I did not verify vote counts for the HubSpot or Airtable threads.
