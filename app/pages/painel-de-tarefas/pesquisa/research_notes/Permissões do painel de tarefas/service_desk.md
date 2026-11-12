# Service desk tools: who sees team metrics and SLA reports (Jira, Jira Service Management, Zendesk, Freshdesk, ServiceNow)

Scope: the permission model for viewing team ticket metrics (SLA breaches, overdue, by assignee, by group, time in status). The focus is the split between 2 layers:
- **screen layer:** who can open the report or dashboard;
- **row layer:** which tickets the report counts for that viewer.

All pages accessed 2026-11-11. The page date appears when the page shows one. "Search excerpt" means the fact came from a search-engine excerpt of an official page that returned 404 or was cut when fetched; treat it as lower confidence.

## 1. Which roles can view reports and dashboards, and is it a separate permission from viewing tickets?

### Takeaway
In all 5 products, opening a report is a separate grant from working tickets:
- Zendesk uses an Explore role (Admin, Editor, Viewer, No access);
- Freshdesk uses an Analytics permission in the role, plus per-report sharing;
- Jira uses dashboard and filter sharing;
- Jira Service Management uses the Service Desk Team role (agent licence);
- ServiceNow uses report and dashboard sharing, `report_view` ACLs and indicator roles.

### Cited Findings

**Jira Software / Jira Cloud (dashboards and gadgets)**
- A user needs 3 layers to see gadget data on a shared dashboard: (1) the dashboard shared with them, at least as Viewer; (2) each gadget's filter shared with them, at least as Viewer; (3) access to the projects the filter queries. With any layer missing, some or all gadgets show no results. Gadget error: "The filter configured for this gadget could not be retrieved." Cloud only; last updated 2025-09-26 — [Atlassian KB: Gadget on shared Dashboard returns "could not be retrieved" error](https://support.atlassian.com/jira/kb/gadget-on-shared-dashboard-returns-could-not-be-retrieved-error/)
- Users need Browse Projects on every project the filter's JQL touches. A missing permission on 1 project can make the gadget fail. Community answer — [Atlassian Community](https://community.atlassian.com/forums/Jira-questions/User-cannot-see-filters-in-a-dashboard-despite-being-part-of-the/qaq-p/2855835)

**Jira Service Management (queues, SLA reports)**
- Service Desk Team (agents): the Browse spaces (formerly Browse projects) permission gives "read-only access to the Reports, People, and SLA tabs". It also gives the Queues tab and the right to work items from queues. Administer spaces lets admins set up the service desk, including reports. No page date; footer "2026 Atlassian" — [Customize Jira Service Management permissions](https://support.atlassian.com/jira-service-management-cloud/docs/customize-jira-service-management-permissions)
- Space roles. Administrators "configure portals, request types, queues, reports and SLAs for each space". Service Desk Team (User (agent) app role) can "view the portal, queues, reports, and SLA metrics". Collaborators (licensed Jira users without the agent role) can view work items, comments and attachments, add internal comments, watch, vote and log work. They have "no other permissions", and admins can't extend them. Reports and queues are not in their list. No page date — [What are space roles in Jira Service Management?](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-user-types-and-roles/)
- Community answers: anyone who needs reports in a JSM project needs an agent licence. Users with Browse Projects but no agent status got a permission error on SLA reports. Community, older threads — [Atlassian Community: SLA success rate report permission](https://community.atlassian.com/forums/Jira-Service-Management/What-permission-does-user-need-to-view-SLA-success-rate-report/qaq-p/2068331); [Atlassian Community: Permission to see Reports](https://community.atlassian.com/forums/Jira-Service-Management/Permission-to-see-Reports/qaq-p/1669499)
- No way exists to block specific JSM reports per person or group. Community — [Atlassian Community: Permission to see Reports](https://community.atlassian.com/forums/Jira-Service-Management/Permission-to-see-Reports/qaq-p/1669499)

**Zendesk (Explore)**
- Explore roles. Admin: all Editor rights plus dataset permissions, Excel export settings, delivery schedules for all users and editing all dashboards. Editor: create and edit reports, dashboards and datasets; share dashboards with users or groups; schedule email delivery. Viewer: view dashboards shared with them; can't create reports or dashboards. No access: can't open Explore. No page date — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Professional: the user's Roles and access tab has an Analytics **Access** checkbox, then a role. "Without that checkbox, the user can't access Explore regardless of other settings." Enterprise: the "Reporting and analytics" section of a custom or light agent role (Admin Center > People > Team > Roles) sets Explore access for every user with that role — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Light agents: the Light agent system role defaults to Viewer. It is the only customizable system role. The Explore Admin option is not available to light agents — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Zendesk has a separate announcement titled "Announcing expanded Explore permissions for light agents". Fetching it returned 404, so the content is unknown — [Zendesk announcement (404 on fetch)](https://support.zendesk.com/hc/en-us/articles/10167720528282-Announcing-expanded-Explore-permissions-for-light-agents)

**Freshdesk (Analytics)**
- "By default, agents can view analytics reports." To edit or export a shared report, the agent needs a custom role with "Edit" or "Edit and Export". Per-report levels: View (view only); Edit (view, edit, share, change permissions except the manager's); Manage (same, except the owner's); Owner (full control, including delete). Reports can be shared with agent groups. Access updates when an agent joins or leaves a group. Page modified 2024-06-07 — [Report sharing in Freshdesk Analytics](https://support.freshdesk.com/en/support/solutions/articles/50000004707-report-sharing-in-freshdesk-analytics)
- The role's Analytics access has 3 levels. View: see curated and custom reports and the underlying data, without adding filters. Edit: create custom reports, add or edit filters, delete custom reports. Manage: Analytics settings, schedules and exports. Search excerpt of Freshdesk pages — [Freshdesk: Roles](https://support.freshdesk.com/en/support/solutions/articles/97077); [Freshdesk: View and edit mode in Analytics](https://support.freshdesk.com/support/solutions/articles/50000001675-how-to-view-and-edit-mode-in-analytics-)
- Roles (what a user can do) and ticket scope (which tickets they see) are separate settings. Setting the scope is a required step when assigning a role — [Advanced ticket scope (Freshworks)](https://crmsupport.freshworks.com/support/solutions/articles/50000002804-advanced-ticket-scope); see also the third-party [Macha blog](https://www.getmacha.com/blog/freshdesk-agent-roles-and-scopes-explained)

**ServiceNow (reports, dashboards, Performance Analytics)**
- By default, a new Core UI report is accessible only to its creator and users with the admin role. A report can be shared with a user, 1 or more groups, or 1 or more roles. Sharing "Everyone" (without publishing) makes it available to all logged-in users. Release Brazil; last updated 2026-09-10 — [Report permission issues](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)
- The `report_view` operation "is a record type ACL that restricts access to data visualizations and Core UI reports". Only users with a required role can view visualizations that contain the restricted resource — [Report permission issues](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)
- A `report_view` ACL can't stop users from viewing lists they have read access to. Record-level restriction needs a read ACL. Search excerpt — [Report view access control](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-view-access-control.html)
- Performance Analytics indicator access: clear "Visible by all roles" in the indicator's Access control section, then select the roles that grant access. Search excerpt; Xanadu — [Control access to an indicator](https://docs.servicenow.com/bundle/xanadu-now-intelligence/page/use/performance-analytics/task/t_ControlAccessToAnIndicator.html)
- `pa_viewer`: the roles page reportedly lists it as no longer required since Quebec. Upgraded instances may still require it. Search excerpt; the page returned 404 — [Performance Analytics roles](https://www.servicenow.com/docs/r/now-intelligence/r_PARoles.html)
- Adding PA widgets to a dashboard requires `pa_power_user`, `pa_admin` or `admin`. Any user who can view the dashboard can view its PA widgets. Search excerpt of the "Dashboard permissions" page; the page returned 404 — [Dashboard permissions](https://www.servicenow.com/docs/r/now-intelligence/c_DashboardRoles.html)

### Inferences
- In every product, "can open the report screen" is granted apart from "can work the ticket". In Zendesk (Explore role No access) and ServiceNow (report not shared), an agent can work tickets with no report access. Freshdesk opens reports to agents by default and controls editing per role and per report. Jira Service Management is the exception: report access comes bundled with the agent role (Browse spaces + Service Desk Team) and can't be split per report.
- Jira has no "report permission". The dashboard and filter are shareable objects, and the data comes from the viewer's project permissions.

### Gaps
- Zendesk: what the light agents expansion changed (page 404).
- Freshdesk: no current official page fetched that lists the role's Analytics permission levels verbatim (View, Edit, Manage comes from search excerpts). An older 2017 article said only Supervisor and above saw the Reports tab; that predates the current model — [Freshdesk: Who would have access to reports](https://support.freshdesk.com/support/solutions/articles/228986-who-would-have-access-to-reports-in-freshdesk-)
- ServiceNow: the current PA roles page and the Dashboard permissions page returned 404, so each role's exact list was not confirmed.

## 2. Do reports respect the viewer's ticket access, or do they bypass it?

### Takeaway
The 5 products split into 3 models:
- **Report runs as the viewer:** Jira gadgets and filters, and ServiceNow list reports. Rows the viewer can't read are dropped.
- **Separate analytics data scope:** Zendesk Explore (group, brand), set in the Explore role and not inherited from the Support ticket-access setting. Freshdesk Analytics is unclear.
- **Pre-aggregated scores that bypass record ACLs unless secured separately:** ServiceNow Performance Analytics collected scores.

### Cited Findings

**Jira**
- With issue security blocking some issues, the gadget shows only the issues the user can see, so the user may get partial results without an error. Community — [Atlassian Community: Dashboard gadgets not shown correctly](https://community.atlassian.com/forums/Jira-questions/Dashboard-Gadgets-are-not-shown-correctly-to-All-Logged-In-User/qaq-p/1977694); [Atlassian Community: Issue with sharing project dashboard](https://community.atlassian.com/forums/Jira-questions/Issue-with-Sharing-Project-Dashboard/qaq-p/2373397)
- Known bug JRACLOUD-20916: a shared filter whose JQL spans several projects can break a Filter Results gadget for a user with browse permission on only some of them. The expected result is that the user still sees issues from the projects they can browse. Listed as unresolved (search excerpt) — [JRACLOUD-20916](https://jira.atlassian.com/browse/JRACLOUD-20916)
- Without dashboard, filter or project access, "some or all gadgets show no results" — [Atlassian KB](https://support.atlassian.com/jira/kb/gadget-on-shared-dashboard-returns-could-not-be-retrieved-error/)

**Jira Service Management**
- SLA and Reports tabs are read-only for anyone with Browse spaces in the Service Desk Team role — [Customize JSM permissions](https://support.atlassian.com/jira-service-management-cloud/docs/customize-jira-service-management-permissions). The docs fetched don't say whether issue-level security inside a service project filters the built-in reports.

**Zendesk Explore**
- Enterprise data access levels. Limited viewer and limited editor: the groups they belong to, or selected groups. Full viewer and full editor: all data. Scope options: brands and groups the user belongs to, selected brands and groups, or all data — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Limited users see historical data only for permitted Support groups. They can't see live data from legacy live dashboards but can see real-time monitoring dashboards. Full users see historical data for all groups and live data — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- "Explore doesn't distinguish between private and public ticket groups." Users with All data access see both. Zendesk tells admins to use limited editor permissions to restrict ticket group visibility — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Group permissions covered first only the "Support: Tickets" and "Support: Updates history" datasets. The 2025-04-10 announcement (rollout 2025-04-10 to 2025-04-21) extended them to all historical datasets (not live). Existing dashboards and reports follow the new data access level. Search excerpt; the page returned 404 — [Announcing Explore group permissions for all historical datasets](https://support.zendesk.com/hc/en-us/articles/8935789740186-Announcing-Explore-group-permissions-for-all-historical-datasets)
- Users can check their own scope in Explore under the profile icon > Data access — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)

**Freshdesk**
- Ticket scope options: All tickets; Tickets in a group (the user's groups plus tickets assigned directly); Assigned tickets (assigned, tagged, or secondary ownership). Advanced scope sets edit groups and view-only groups. Example: a user with edit access to Vacations and view-only access to Customer Service sees "Dashboard metrics are shown only for the Vacations group." The article says nothing about Analytics reports. Modified 2026-05-15 — [Advanced ticket scope](https://crmsupport.freshworks.com/support/solutions/articles/50000002804-advanced-ticket-scope)
- Conflicting community reports. A 2021 idea post says anyone with Analytics access sees data for all groups, reportedly confirmed by Freshdesk staff. A reply says users see only the reports they have access to (a report-sharing point, not a row-scope point) — [Freshworks Community idea: Restricted access in Analytics](https://community.freshworks.com/ideas/restricted-access-in-analytics-22753)
- A community example describes an agent in an "Escalations" group who sees report data only for tickets in their scope — [Freshworks Community: Report agent visibility](https://community.freshworks.com/analytics-reports-dashboards-11351/report-agent-visibility-20801)

**ServiceNow**
- "Each row of a list report is first compared against any read access control lists (ACLs) defined on the report's source tables." Users with different permissions see different row counts from the same report. "A message indicates the number [of] rows removed due to security constraints." Brazil; 2026-09-10 — [Report permission issues](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)
- A system property sets read-ACL enforcement for reports. Default "enforce": with no `report_view` ACL on the table or field, ServiceNow checks the read ACL, and the user sees the report only on a pass. Other values: ignore, log. Search excerpt — [Report execution security](https://www.servicenow.com/docs/r/pt-BR/now-intelligence/reporting/read-access-control.html)
- Aggregate reports (pie charts, single score) can show counts to users without read access to the records; drill-down to records is blocked. Community-reported, not official — [ServiceNow Community: Read ACLs working on list reports but not on single score reports](https://www.servicenow.com/community/platform-analytics-forum/read-acls-working-on-list-reports-but-not-on-single-score/m-p/2504759); [ServiceNow Community: Is it possible to show data in report if there are ACL](https://www.servicenow.com/community/developer-forum/is-it-possible-to-show-data-in-report-if-there-are-acl/m-p/1769649)
- Performance Analytics: an indicator's access control gates the indicator in PA surfaces only. It doesn't filter the stored score rows in `pa_scores_l1`; a separate table read ACL does that. Community — [ServiceNow Community: Restricting access to PA indicator scores](https://www.servicenow.com/community/platform-analytics-forum/restricting-access-to-pa-indicator-scores/m-p/3595379)
- Real-time PA scores: "the score each logged-in user sees depends on their roles and the ACLs of the facts table". Search excerpt of the Dashboard permissions docs (404 on fetch) — [Dashboard permissions](https://www.servicenow.com/docs/r/now-intelligence/c_DashboardRoles.html)
- Breakdowns "have no visibility options". Breakdown access comes from ACLs on breakdown sources. Element security (allow list or deny list by role) limits which breakdown elements, such as a specific group or assignee, a role can see scores for. It applies to widgets, workspaces and the Analytics Hub. Users with `admin` see all elements. Yokohama; updated 2025-01-30 — [Control ability to view breakdown elements](https://www.servicenow.com/docs/r/3dUp4IlSpaXzwDcoDj_v6g/vLQlhIzawn9qsDHlSfSEqA)

### Inferences
- Jira and ServiceNow list reports follow "run as viewer". The same dashboard shows different counts to different viewers. Community reports on Jira describe partial results with no error; ServiceNow list reports show a "rows removed" message.
- Zendesk Explore keeps a separate data scope. The docs fetched never tie it to the Support setting "agent can access tickets in their groups". An admin must set both and keep them consistent.
- ServiceNow PA collected scores are computed by a scheduled job, not per viewer. Score visibility comes from indicator roles and breakdown element lists, not from incident ACLs. Real-time scores are the exception.
- Freshdesk documents ticket scope limiting the agent's home dashboard metrics. No official page found says the Analytics module applies ticket scope; community reports conflict.

### Gaps
- Freshdesk: no official statement on whether group-scope or assigned-only agents see filtered Analytics data. Test with a restricted agent.
- Zendesk Professional (no limited data access options): not documented whether Explore follows the agent's Support ticket restriction. The fetched page implies it doesn't, but doesn't say so.
- JSM: not documented whether issue security levels filter SLA reports and the Reports tab.
- ServiceNow: official text on aggregate (non-list) report behaviour under read ACLs not found; only community reports.

## 3. Is there a team- or group-scoped manager view (group lead sees their group)?

### Takeaway
Zendesk has 2 documented mechanisms: limited data access per role (Enterprise) and per-dashboard restrictions "based on viewer". ServiceNow uses breakdown element security by role. Jira and Freshdesk reach it only indirectly (the filter's JQL or project roles; group-scoped tickets or groups shared on a report). No product defines "group lead" as a permission object.

### Cited Findings
- Zendesk Enterprise default: Team lead (custom role) maps to Explore Editor — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Zendesk limited editor (groups they belong to or selected groups) can't share dashboards externally, schedule or receive deliveries, or create dashboard restrictions — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Zendesk dashboard restrictions:
  - define the data a viewer can see by dataset, attribute and value;
  - "Based on viewer" filters by the signed-in user: with the Assignee name filter, a viewer sees only tickets they are assigned;
  - "Ticket group" appears among the dynamic attributes for several datasets, but the article doesn't show a group-lead example;
  - a viewer with only 1 restriction can't change it; users with several restrictions (admins) can switch;
  - limits: Professional 10 restrictions, Enterprise 500; up to 5 filters per restriction and 20 values per filter;
  - not for live data; "Based on viewer" can't be shared externally; only dashboards built with the new (beta) builder;
  - plans: Suite Professional, Enterprise or Enterprise Plus, or Explore Professional or Enterprise;
  - no page date — [Dynamically adapting dashboard data based on viewer](https://support.zendesk.com/hc/en-us/articles/5282695803290-Dynamically-adapting-dashboard-data-based-on-viewer)
- A third-party guide gives the example of a single "Team Performance" dashboard where each team lead sees only their own group. Not official — [eesel.ai blog](https://eesel.ai/blog/zendesk-explore-dashboard-permissions)
- Freshdesk: reports can be shared with agent groups, and access follows group membership — [Report sharing in Freshdesk Analytics](https://support.freshdesk.com/en/support/solutions/articles/50000004707-report-sharing-in-freshdesk-analytics). Group-scoped agents see dashboard metrics only for their edit groups — [Advanced ticket scope](https://crmsupport.freshworks.com/support/solutions/articles/50000002804-advanced-ticket-scope)
- ServiceNow: element security restricts score visibility for specific breakdown elements (for example, a breakdown by assignment group) to listed roles (allow list), or hides them from listed roles (deny list) — [Control ability to view breakdown elements](https://www.servicenow.com/docs/r/3dUp4IlSpaXzwDcoDj_v6g/vLQlhIzawn9qsDHlSfSEqA)

### Inferences
- Zendesk is the only product here with a built-in "same dashboard, each viewer sees their own slice" feature (Based on viewer). The documented dynamic case is the assignee (my tickets), not "my group".
- In Jira the manager view is a filter with JQL on the team's project or component, shared with the lead. Security still comes from Browse Projects and issue security, not the dashboard.
- ServiceNow scopes by role, not by group membership. A lead needs a role mapped to that group's breakdown elements, or a read ACL.

### Gaps
- Zendesk: whether "Based on viewer" supports Ticket group (the lead's own groups) was not confirmed in the fetched text.
- Jira Software and JSM: no documented group-lead reporting role.
- A Zendesk announcement dated 2026-01-22 on group-based permissions and dashboard restrictions (raising the Enterprise restriction limit from 100 to 500) appeared only in a search summary; URL and content not verified.

## 4. Customers, external and portal users: what metrics can they see?

### Takeaway
None of the 5 products documents team or SLA metrics for portal customers in the pages fetched. Zendesk is the only one that documents external dashboard sharing (full editors only). JSM customer permissions don't include Reports or SLA tabs.

### Cited Findings
- JSM Service Desk Customers: raise and track requests in help centers, read the knowledge base, approve requests, share requests. Reports, queues and SLA tabs are absent from their permission list. The page doesn't say whether customers see SLAs — [What are space roles in JSM?](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-user-types-and-roles/); [Customize JSM permissions](https://support.atlassian.com/jira-service-management-cloud/docs/customize-jira-service-management-permissions)
- JSM Stakeholders have Customer permissions plus incident updates. The Stakeholder app role exists on Premium and Enterprise; on Free and Standard only agents can be stakeholders — [What are space roles in JSM?](https://support.atlassian.com/jira-service-management-cloud/docs/what-are-user-types-and-roles/)
- Zendesk: full editors can share dashboards externally and schedule deliveries; limited editors can't. "Based on viewer" restricted dashboards can't be shared externally — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore); [Dynamically adapting dashboard data based on viewer](https://support.zendesk.com/hc/en-us/articles/5282695803290-Dynamically-adapting-dashboard-data-based-on-viewer)
- ServiceNow: "Everyone" report sharing means all logged-in users — [Report permission issues](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)

### Inferences
- The common pattern: metrics are an internal (agent, lead, admin) surface. Customers see their own request status, not team metrics.

### Gaps
- Freshdesk: customer or portal access to Analytics not documented.
- ServiceNow: portal (Service Portal or Employee Center) metrics for requesters not researched.
- Jira Software: public (anonymous) dashboard sharing exists (Atlassian has a migration KB on "Public Dashboard and Filter Warnings"), but current Cloud rules were not fetched — [Public Dashboard and Filter Warnings in Jira Pre-Flight Checks](https://support.atlassian.com/migration/kb/public-dashboard-and-filter-warnings-in-jira-pre-flight-checks/)
- JSM: whether customers see SLA timers in the portal is not stated on the fetched pages (a community thread on it exists but was not read).

## 5. Admin controls: enable or disable analytics per role, and plan gating

### Takeaway
- **Zendesk:** the most explicit controls. Explore on or off per user (Professional) or per role (Enterprise); data scope per role on Enterprise only.
- **Freshdesk:** Analytics level per custom role, plus per-report sharing.
- **ServiceNow:** per-object (report, dashboard, indicator) roles, ACLs and element lists.
- **Jira:** dashboard and filter sharing, plus project permission schemes.

### Cited Findings
- Zendesk plans: Explore needs a Suite plan (Team, Growth, Professional, Enterprise, Enterprise Plus) with Explore Lite, Professional or Enterprise. Explore Lite gives prebuilt dashboards view-only. Limited (group or brand) data access is described under Enterprise — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Zendesk dashboard restrictions: Professional and above; 10 (Professional) or 500 (Enterprise) restrictions — [Dynamically adapting dashboard data based on viewer](https://support.zendesk.com/hc/en-us/articles/5282695803290-Dynamically-adapting-dashboard-data-based-on-viewer)
- Freshdesk report sharing: the article's plan grid (partly labelled) shows Freshdesk Pro and Enterprise, Freshdesk Omni Pro and Enterprise, and Freshservice Estate and Forest — [Report sharing in Freshdesk Analytics](https://support.freshdesk.com/en/support/solutions/articles/50000004707-report-sharing-in-freshdesk-analytics)
- Freshdesk ticket scope: set by administrators under Admin > Agents; the page lists Free, Growth, Pro and Enterprise without saying which include advanced scope — [Advanced ticket scope](https://crmsupport.freshworks.com/support/solutions/articles/50000002804-advanced-ticket-scope)
- Freshservice (not Freshdesk) roles migration: View access in legacy Reports became Edit in Analytics; Export became Manage. Relevant only as a pattern — [Freshservice: Roles migration to Analytics](https://support.freshservice.com/en/support/solutions/articles/50000004236-roles-migration-from-legacy-reports-modules-to-analytics-module)
- ServiceNow: element security configuration needs `pa_admin` or `admin` — [Control ability to view breakdown elements](https://www.servicenow.com/docs/r/3dUp4IlSpaXzwDcoDj_v6g/vLQlhIzawn9qsDHlSfSEqA). The "ACL Assessment for Reports" dashboard finds reports blocked by `report_view` ACLs and by read ACLs (search excerpt, Washington DC release) — [ACL Assessment for Reports](https://docs.servicenow.com/bundle/washingtondc-now-intelligence/page/use/reporting/concept/report-view-acl-dashboard.html)
- ServiceNow: after the upgrade to Brazil, `glide.report.published_reports.enabled` is set to false for all Core UI reports. To make a report available to all logged-in users, the page says to set Sharing to Everyone and not publish it — [Report permission issues](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)
- JSM: Administer spaces includes generating reports; Browse spaces gives agents the read-only Reports and SLA tabs — [Customize JSM permissions](https://support.atlassian.com/jira-service-management-cloud/docs/customize-jira-service-management-permissions)

### Inferences
- Plan gating of row-level analytics scope is typical. Zendesk limits group-scoped data access to Enterprise. Freshdesk shows report sharing on Pro and Enterprise.

### Gaps
- Atlassian Analytics (cross-product BI on Premium and Enterprise) permissions and plan gating: not researched within the call budget.
- JSM: plan differences for built-in reports not found.
- ServiceNow: Performance Analytics licensing (which ITSM package tier includes PA) not found on official pages.
- Freshdesk: plan tier for advanced ticket scope and for granular Analytics role levels not confirmed.

## 6. Defaults out of the box

### Takeaway
- **Zendesk:** admins get Explore Admin. On Professional, light agents get Viewer and other agents get no access. On Enterprise, Team lead gets Editor and other system roles get Viewer.
- **Freshdesk:** agents can view analytics reports by default.
- **ServiceNow:** a new report is visible only to its creator and admins.
- **Jira:** a new dashboard or filter is private until shared (not confirmed in fetched docs). JSM agents get Reports and SLA tabs read-only through the Service Desk Team role.

### Cited Findings
- Zendesk Explore Lite: all Support users get view-only access to prebuilt dashboards. Explore Professional: Light agents get Viewer; Staff and Contributors get no access until granted; Administrators get Admin. Explore Enterprise: Admin (system) maps to Admin; Team lead (custom) maps to Editor; Staff, Contributor, Advisor, Light agent and new custom roles map to Viewer — [Adding users to Explore](https://support.zendesk.com/hc/en-us/articles/4408836002970-Adding-users-to-Explore)
- Freshdesk: "By default, agents can view analytics reports." Edit and export need a role with "Edit" or "Edit and Export" — [Report sharing in Freshdesk Analytics](https://support.freshdesk.com/en/support/solutions/articles/50000004707-report-sharing-in-freshdesk-analytics)
- ServiceNow: "By default, a new report is accessible only to its creator and users with the admin role" — [Report permission issues](https://www.servicenow.com/docs/r/now-intelligence/reporting/report-permission-issues.html)
- JSM: the Service Desk Team role (agents) gets read-only Reports, People, SLA and Queues — [Customize JSM permissions](https://support.atlassian.com/jira-service-management-cloud/docs/customize-jira-service-management-permissions)

### Inferences
- Defaults diverge. Zendesk Professional and ServiceNow default to closed (grant needed). Freshdesk and JSM default to open for agents. Zendesk Enterprise defaults to Viewer for most roles, with row scope still "all data" unless the admin picks limited access (not stated as a default; inferred from the option list).

### Gaps
- Zendesk Enterprise: default data access level (All data or groups the user belongs to) for new roles not stated in the fetched text.
- Jira Cloud: default sharing of a new dashboard and filter (private) not confirmed in the docs fetched.
- Freshdesk: whether the default agent view respects ticket scope not documented.
