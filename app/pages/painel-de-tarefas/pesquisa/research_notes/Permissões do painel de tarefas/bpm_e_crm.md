# Permissions for task and process metrics in BPM and CRM SaaS: Pipefy, Kissflow, HubSpot, Salesforce

Scope: who can open dashboards and reports about cards, items and records (late cards, by assignee, by team, SLA, time in phase), and whether the numbers follow the viewer's own data scope. Research date: 2026-11-11. Page dates come from the page itself; "accessed 2026-11-11" means the page has no article date (Salesforce Help shows only the 2026 copyright footer).

Source quality legend: [official] = vendor help center or docs; [staff] = vendor employee in the vendor community; [community] = user post; [3rd] = third-party blog.

## 1. Who can view dashboards and reports, and is it a dedicated permission?

### Takeaway
Salesforce and HubSpot treat "see reports" as its own permission, separate from record access: Salesforce through folder sharing plus profile permissions, HubSpot through a "Reports access" toggle with View, Edit, Create/own and Admin levels. Pipefy and Kissflow tie report access to the process role (pipe member, process admin). Only the paid tiers add a separate per-dashboard or per-report permission: Dashboards Pro in Pipefy, Data Admin and Report Admin in Kissflow Enterprise.

### Cited Findings

**Pipefy**
- 4 pipe permission levels: Read-only (views all cards, comments), Restricted view (creates cards; views or edits only cards they created or are assigned to), Pipe member (creates, edits and moves all cards), Pipe admin (everything plus pipe settings). Permission levels are only available on Business and Enterprise. Pipe permissions are separate from company permissions. Article dated 2026-08-17. [official] — [Pipe roles and permissions](https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions)
- Dashboards come in 2 versions. Basic: free on all plans, default dashboards that cannot be customized, a cap on database rows, no roles or permissions; pipe admins and members can open it. Pro: US$2.99 per user per month on Business, Enterprise and Unlimited; adds customizable dashboards, unlimited rows, and roles and permissions. Article dated 2024-01-10. [official] — [What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)
- Dashboards Pro has 3 permission levels per dashboard, set in the dashboard's three-dot menu > "set permissions": View and Edit, Read Only, and Don't show dashboard. [official] — [What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)
- Dashboards are opened from the pipe header ("Dashboards"); pipe admins and members have access. Article dated 2022-10-13. [official] — [How to create dashboards](https://help.pipefy.com/en/articles/6047064-how-to-create-dashboards)
- "By default, only members and admins can access dashboard information" (Pipefy staff, 2022-11-09, marked best answer). [staff] — [Pipe dashboard permissions for restricted view users](https://community.pipefy.com/ask-the-community-43/pipe-dashboard-permissions-for-restricted-view-users-2071)
- A pipe admin can create several dashboards and make some visible only to pipe admins (Pipefy staff reply; seen in search snippet, page not opened). [staff] — [community.pipefy.com/questions/965](https://community.pipefy.com/questions/965)
- Pipe reports are not a separate permission: "the platform's permission structure links 'Member' access to pipe-level reporting" (Pipefy Support, 2026-03-27). A 2025-09-18 idea asks for a "Card-only" role that cannot view or export pipe reports and dashboards, because members today can export the whole pipe database to Excel. Status: open, forwarded to Product, no date. [staff] — [Restrict member-level access to reports and extract database](https://community.pipefy.com/ideas/restrict-member-level-access-to-reports-and-extract-database-4766)
- Company reports (cross-pipe): only company admins by default; an admin can open it to other roles in the Admin dashboard; saved reports are shared with other company admins; export to XLSX. Article dated 2024-01-09. [official] — [What are company reports](https://help.pipefy.com/en/articles/1698930-company-reports)
- Custom roles: created by super admins in the Admin dashboard; Business, Enterprise and Unlimited; permissions grouped as admin panel, pipes, databases and automations; the article does not list a dashboard or report permission. Article dated 2026-08-13. [official] — [Custom roles](https://help.pipefy.com/en/articles/6418478-custom-roles)
- A user reported that a newly created custom role could not see Reports in any pipe (status not shown; search snippet). [community] — [Enable reports tab by role type or person](https://community.pipefy.com/ideas/524)

**Kissflow (Process)**
- Process reports are available by default to Flow/Process Admins; other members access a report when it is shared with them or when they have permission to create reports. [official, older docs site] — [Reports overview, docs.kissflow.com](https://docs.kissflow.com/article/3rji3kru6z-reports-overview) (page returned 404 on 2026-11-11; content seen in search snippet only)
- Role matrix (community documentation page, "updated 7 months ago"): "View all reports" and "View Metrics report" for Process Admin, Data Admin and Report Admin only; Developer and Initiator/Member cannot. "Create reports": Process Admin, Data Admin, Report Admin; optional for Developer and Initiator/Member. Share and delete reports: Process Admin for all; other roles only their own. Data Admin and Report Admin are Enterprise only. [official, Kissflow Community docs] — [Managing process members and permissions](https://community.kissflow.com/t/p8h9qtp/managing-process-members-and-permissions)
- Form-level permissions: "Manage" (create and manage items, with default access to all reports of the process form) and "Initiate" (start items and work on items they created or that are assigned to them; no report access). External app roles cannot get Manage. Enterprise only; page "updated 1 yr ago". [official, Kissflow Community docs] — [Managing process roles and permissions](https://community.kissflow.com/t/83yzjcs/managing-process-roles-and-permissions)
- Sharing a process report: open the report > (+) or (...) > Share > add users; recipients "can View and Export the data" (search snippet). [official] — [Product tip: how to share a process report](https://community.kissflow.com/t/35h4avk/product-tip-how-to-share-a-process-report-to-a-user-in-kissflow)
- Kissflow Community retires in the first week of November 2026, with content moving to the Kissflow Help Center; the pages above may disappear. — [Managing process members and permissions](https://community.kissflow.com/t/p8h9qtp/managing-process-members-and-permissions)

**Kissflow (Analytics module)**
- Analytics is only available on Enterprise plans. Report roles: Report admin (full control) and Member (view and share; edit only when granted). Data source roles: Report admin (create, edit, delete) and Report creator (create, edit). Page "updated 2 yrs ago". [official, Kissflow Community docs] — [FAQs: Analytics](https://community.kissflow.com/t/y4h9qz6/faqs-analytics)
- When a board is shared with a role, its views and reports inherit those permissions (search snippet). [official] — [Overview of Kissflow Analytics](https://community.kissflow.com/t/m1h9qzd/overview-of-kissflow-analytics)

**HubSpot**
- Dedicated permission "Reports access": when off, Reports leaves the navigation. Levels under "Dashboard, reports, and analytics": View (on by default when Reports access is on), Edit (dashboards and reports the user has access to), Create/own, and Admin (create any report or dashboard, all analytics tools; "will override any settings in the Reports permission tab"). Separate toggles for Marketing reports and Multi-Account reports. Last updated 2026-10-13. [official] — [HubSpot user permissions guide](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)
- Dashboard access settings: Private to owner (owner and admins), Everyone can view, Everyone can view and edit, and Assign teams and users with No access / View only / View and edit (Enterprise only). Super Admins and users with the Dashboard, reports and analytics Admin permission can view and change every dashboard. Dashboards are on all products and plans; the number of dashboards depends on the tier. Last updated 2026-07-29. [official] — [Manage your dashboards](https://knowledge.hubspot.com/dashboards/manage-your-dashboards)
- Report access settings (reports not on a dashboard): Private to owner, Everyone (view and edit or view only), Only specific users and teams; teams only on Enterprise. A report placed on a dashboard follows the dashboard's access. Custom reports need Professional or Enterprise. Last updated 2026-08-18. [official] — [Manage reports in your reports list](https://knowledge.hubspot.com/reports/manage-reports-in-your-reports-list)
- Conflict: the assets page says "an Enterprise subscription is required to limit report access", and that access to reports inside analytics tools and custom analytics views cannot be limited. Last updated 2026-09-30. [official] — [Limit access to your HubSpot assets](https://knowledge.hubspot.com/account-security/limit-access-to-your-hubspot-assets); contradicted in part by [Manage reports in your reports list](https://knowledge.hubspot.com/reports/manage-reports-in-your-reports-list), which says only team selection is Enterprise only.

**Salesforce**
- Report and dashboard access is controlled by folder sharing: Viewer, Editor or Manager on the folder. [official] — [FolderShare metadata type](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_foldershare.htm) (accessed 2026-11-11)
- Viewer: view folder content, run reports, refresh dashboards. Editor: Viewer plus add, edit and delete content (cannot be granted on standard report folders). Manager: Editor plus rename, share and delete the folder. Folders are shared with users, groups, roles or territories; up to 25 recipients per folder in the UI, 500 through the folder sharing REST API; the highest share wins. "Manage Reports in Public Folders" and "Manage Dashboards in Public Folders" let a user manage every public folder without a share. Guest and Community Portal users cannot access these folders (search snippets of the official pages). [official] — [Access Levels for Report and Dashboard Folders](https://help.salesforce.com/s/articleView?id=analytics.analytics_folder_access.htm&language=en_US&type=5); [Viewer Access](https://help.salesforce.com/s/articleView?id=sf.analytics_folder_viewer.htm&language=en_US&type=5); [User Permissions for Sharing Reports and Dashboards](https://help.salesforce.com/s/articleView?language=en_US&id=analytics.analytics_sharing_permissions.htm&type=5) (all accessed 2026-11-11)
- Enhanced folder sharing is the default for orgs created after Summer '13. [official, older cheat sheet] — [Analytics folder sharing cheat sheet](https://resources.docs.salesforce.com/210/latest/en-us/sfdc/pdf/salesforce_analytics_folder_sharing_cheatsheet.pdf)
- Dashboard permissions: build your own dashboards in a public folder = Run Reports + Create and Customize Dashboards + Edit My Dashboards; edit others' dashboards = Manage Dashboards in Public Folders; dynamic dashboards = Manage Dynamic Dashboards; choose a running user = View My Team's Dashboards or View All Data. Lightning, in Enterprise, Performance, Unlimited and Developer Editions. Accessed 2026-11-11. [official] — [Configure Dashboard Data Visibility in Lightning Experience](https://help.salesforce.com/s/articleView?id=sf.dashboards_view_as.htm&language=en_US&type=5)

### Inferences
- 2 models: (a) CRM model, where the screen permission (see Reports, folder or dashboard shared) is separate from the data scope (record access); (b) BPM model, where the process role decides both. In Pipefy and Kissflow Basic, a member of the process sees the process reports; only paid add-ons (Pipefy Dashboards Pro, Kissflow Enterprise roles) split them.
- Pipefy has no documented way, as of 2026-03-27, to let someone work cards as a member without also seeing the pipe reports and exporting the database.

### Gaps
- Pipefy: whether Read-only users see dashboards in Basic is not documented (the docs name only "admins and members").
- Pipefy: the "Company roles and permissions" article (6027079) was not opened; it may list a report or dashboard permission for custom roles.
- Kissflow: the current Help Center page on process report access returned 404; the newest official wording is not confirmed.

## 2. Do reports count only the records the viewer can access? "Run as viewer" vs. "run as a fixed user"

### Takeaway
Salesforce is the only product of the 4 with an explicit choice: a dashboard runs as a fixed user (static; viewers can see more than their own access) or as the viewer (dynamic, capped at 3, 5 or 10 per org). Reports in Salesforce always run with the viewer's sharing. HubSpot always applies the viewer's record access, with 1 documented leak (restricted pipelines). Pipefy applies Restricted view to dashboard data per a 2022 staff answer. Kissflow does not document row-level filtering in reports.

### Cited Findings

**Salesforce**
- "View Dashboard As" has 3 options. Me: viewers see data according to the creator's access. Another person: viewers see data according to the named user's access. The dashboard viewer: each viewer sees data per their own access ("dynamic dashboard"). Accessed 2026-11-11. [official] — [Configure Dashboard Data Visibility in Lightning Experience](https://help.salesforce.com/s/articleView?id=sf.dashboards_view_as.htm&language=en_US&type=5)
- Static dashboards can show viewers more than they could normally see, such as PII when the running user is an admin or internal user. Users with Chatter, Lightning Platform, Customer Community or Partner Community licenses cannot view a static dashboard whose running user has another license type; a dynamic dashboard is blocked when the creator or initial running user has another license type. Accessed 2026-11-11. [official] — [Dashboard Data Visibility Considerations](https://help.salesforce.com/s/articleView?id=sf.dashboards_view_as_considerations.htm&language=en_US&type=5)
- "A dynamic dashboard shows each user only the data that they have access to." Limits per org: Enterprise 5, Unlimited and Performance 10, Developer 3; dashboards in the recycle bin count. Dynamic dashboards cannot be refreshed on a schedule, cannot be saved in a private folder, and cannot be subscribed to. Available in Enterprise, Performance, Unlimited and Developer (Professional Edition not listed). Accessed 2026-11-11. [official] — [Dynamic Dashboards](https://help.salesforce.com/s/articleView?id=sf.dashboards_dynamic_overview.htm&language=en_US&type=5)
- The same limits appear in the limits table; raising them is a paid request, not self-service; when the limit drops, existing dynamic dashboards keep working but new ones cannot be saved as dynamic (search snippets). [official] — [Reports and Dashboards Limits and Allocations](https://help.salesforce.com/s/articleView?id=rd_reports_dashboards_limits.htm&language=en_US&type=5); [Dynamic Dashboard Limits: How to Find, Manage, and Request an Increase](https://help.salesforce.com/s/articleView?id=000385369&language=en_US&type=1)
- Reports (not dashboards) run with the viewer's access: the same report returns different counts for different users because of "Sharing Settings configured to Private, Role Hierarchy restrictions", field-level security and time zones. Published 2026-07-14. [official] — [Salesforce Report Returns Different Record Counts for Different Users](https://help.salesforce.com/s/articleView?id=000333143&language=en_US&type=1)
- Standard report types follow the primary object's sharing; custom report types follow both primary and secondary object sharing (search snippet). [official] — [Control Standard Report Visibility](https://help.salesforce.com/s/articleView?language=en_US&id=security_sharing_owd_external_user_srt.htm&type=0) (page did not render on 2026-11-11)

**HubSpot**
- No fixed "running user" option is documented. Reports use the viewer's access: "report and dashboard asset access does not override CRM record, data source, or field permissions"; users without access to the underlying records, fields, or records limited by ownership or team may see partial data, a blank report, or an error. Last updated 2026-08-18. [official] — [Manage reports in your reports list](https://knowledge.hubspot.com/reports/manage-reports-in-your-reports-list)
- Users with "Their [Objects]" (owned only) "will only see their assigned records on index pages, in the segments tool, and in reports." Last updated 2026-10-13. [official] — [HubSpot user permissions guide](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)
- "Dashboard access does not override individual report sharing, report folder permissions." Last updated 2026-07-29. [official] — [Manage your dashboards](https://knowledge.hubspot.com/dashboards/manage-your-dashboards)
- Exception: users without access to a restricted pipeline "can view records from restricted pipelines in reports." Last updated 2026-09-30. [official] — [Limit access to your HubSpot assets](https://knowledge.hubspot.com/account-security/limit-access-to-your-hubspot-assets)
- Multi-Account reports: a user who does not exist in the other account gets view-only access to the data surfaced in the report; a user who exists there sees data per their access in that account. [official] — [HubSpot user permissions guide](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide)
- A community post says activity data stays visible in reports even when record access is limited (unverified; contradicts the official note above). [community] — [How to limit access to reportings](https://community.hubspot.com/t5/Dashboards-Reporting/how-to-limit-access-to-reportings-and-possibility-to-modify/m-p/204466)

**Pipefy**
- Restricted view users given dashboard permission "will only see the data from cards they are assigned to"; in Kanban they see only cards they created or are assigned to (Pipefy staff, 2022-11-09). The same thread reports a bug-like case: assigned cards with a value in the chart's dimension (connected field) did not appear for the restricted user; no resolution posted. [staff] + [community] — [Pipe dashboard permissions for restricted view users](https://community.pipefy.com/ask-the-community-43/pipe-dashboard-permissions-for-restricted-view-users-2071)
- The official dashboard articles do not say whether chart data follows the viewer's card access. [official] — [What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)
- Users with restricted view "cannot create / view reports" (pipe reports), per an idea post (search snippet). [community] — [Access to reports by users with restricted vision](https://community.pipefy.com/ideas/access-to-reports-by-users-with-restricted-vision-207)

**Kissflow**
- Analytics access is table-level: a user must be added to a table or system table through Share before a dataview can query it; even Super Admins must add themselves to some tables, or they get "You don't have permission to access this resource". Row-level filtering by item access is not described. [official, Kissflow Community docs] — [FAQs: Analytics](https://community.kissflow.com/t/y4h9qz6/faqs-analytics)
- A shared process report lets recipients "View and Export the data" (search snippet); whether they see only items they can access is not stated. [official] — [Product tip: how to share a process report](https://community.kissflow.com/t/35h4avk/product-tip-how-to-share-a-process-report-to-a-user-in-kissflow)

### Inferences
- Salesforce's static dashboard is the documented "run as fixed user" pattern, and it is also the documented risk: one shared view of team metrics that can expose records a viewer cannot open. Its cost control is the per-org cap on dynamic dashboards.
- In HubSpot, a team-only user who opens a shared "late deals" or "tickets by owner" dashboard sees counts only for their team's records; the same dashboard shows different totals to different people. HubSpot has no setting to make a dashboard show company totals to a restricted user.
- In Kissflow, sharing a process report appears to share its data with the recipient (View and Export), which is closer to "run as owner"; this is not stated outright.

### Gaps
- HubSpot: no documented equivalent of "run as specified user"; no documentation found on whether counts in report totals (not only lists) are filtered.
- Kissflow: row-level behavior of shared process reports and Analytics is not documented.
- Pipefy: no official 2026 statement on whether dashboards filter data per Restricted view; only the 2022 staff answer.

## 3. Team and hierarchy scopes: a manager sees the team, a member sees their own

### Takeaway
Salesforce (role hierarchy, "View My Team's Dashboards") and HubSpot ("Team only", nested teams on Enterprise) have a manager scope that reports respect. Pipefy and Kissflow have only "own or assigned" (Restricted view, Initiate) versus "all items in the process"; no team or manager scope is documented.

### Cited Findings

**Salesforce**
- A viewer with View My Team's Dashboards can view a dashboard as themselves or anyone below them in the role hierarchy; with View All Data, as anyone. Requires the creator to tick "Let dashboard viewers choose whom they view the dashboard as". Accessed 2026-11-11. [official] — [Configure Dashboard Data Visibility in Lightning Experience](https://help.salesforce.com/s/articleView?id=sf.dashboards_view_as.htm&language=en_US&type=5)
- Managers with View My Team's Dashboards or View All Data can preview a dynamic dashboard from the perspective of users below them in the role hierarchy. A dynamic dashboard with filters (example: sales rep, product) lets a manager see reps together and one by one. [official] — [Dynamic Dashboards](https://help.salesforce.com/s/articleView?id=sf.dashboards_dynamic_overview.htm&language=en_US&type=5)
- Record visibility comes from ownership, role hierarchy, territory hierarchy, sharing rules, profile permissions (View All, Modify All) and team access (search snippet). [official] — [Control Who Sees What](https://help.salesforce.com/s/articleView?language=en_US&id=sf.security_data_access.htm&type=5)
- The report "Show Me" scope "My team's" returns records owned by the user and by users in subordinate roles. [3rd] — [Salesforce Role Hierarchy Explained](https://deselect.com/blog/salesforce-role-hierarchy-explained-structuring-access-and-visibility/)

**HubSpot**
- Record access per object: All, Team only ("Their team's [object]": records owned by the user or a teammate; users on several teams see all of them), Owned only ("Their [object]"), plus Unassigned. Team only requires Professional or Enterprise. Changing permissions requires Super Admin. Last updated 2026-07-14. [official] — [Assign access to records](https://knowledge.hubspot.com/records/assign-access-to-records)
- Users with team ownership permissions access records owned by members of their teams and, with nested teams (Enterprise only), by members of the nested teams (search snippet). [official] — [Create and manage teams](https://knowledge.hubspot.com/user-management/create-and-manage-teams)
- Users with the "Limit access by teams" permission access all assets regardless of team. [official] — [HubSpot user permissions guide](https://knowledge.hubspot.com/user-management/hubspot-user-permissions-guide); [Limit access to your HubSpot assets](https://knowledge.hubspot.com/account-security/limit-access-to-your-hubspot-assets)

**Pipefy**
- Only 2 data scopes in a pipe: all cards (Read-only, Member, Admin) or only cards the user created or is assigned to (Restricted view). [official] — [Pipe roles and permissions](https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions)
- Groups of users exist to manage permissions in bulk (title only, page not opened). [official] — [Groups of users in Pipefy](https://help.pipefy.com/en/articles/8461497-groups-of-users-in-pipefy-easily-manage-permissions)

**Kissflow**
- Initiate: items the user created or is assigned to. Manage: create and manage items, with all reports. No team or manager scope listed. [official, Kissflow Community docs] — [Managing process roles and permissions](https://community.kissflow.com/t/83yzjcs/managing-process-roles-and-permissions)

### Inferences
- In the BPM tools, "manager of a team" is modeled by giving the manager Member/Manage on the whole process, which also shows every other team's cards. Team scoping in the CRMs depends on an org structure (role hierarchy, teams) that the BPM tools do not have.

### Gaps
- Pipefy: whether a group of users can be used as a dashboard filter or permission target is not documented.
- HubSpot: whether a parent team's "Team only" view includes child-team records for every object, and whether reports follow it, is not stated outright.
- Salesforce: the official page for the "Show Me" filter was not found; only third-party wording.

## 4. Pipefy: can a pipe member or viewer see the pipe's dashboard and reports? Phase-level permissions? Metrics without pipe access?

### Takeaway
Members and admins of a pipe see its dashboards (Basic) and reports; Read-only is not named for dashboards; Restricted view sees only its own cards' data if a Pro dashboard grants it. Pipefy documents no phase-level visibility permission. A person outside a private pipe sees its metrics only as company admin through company reports.

### Cited Findings
- Pipe member: sees and edits all cards; dashboard access in Basic. [official] — [Pipe roles and permissions](https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions); [What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)
- Member access is "linked" to pipe-level reporting, including export of the whole database to Excel (2026-03-27). [staff] — [Restrict member-level access to reports](https://community.pipefy.com/ideas/restrict-member-level-access-to-reports-and-extract-database-4766)
- Restricted view: dashboard data only from assigned cards, after a dashboard permission grant (2022). Cannot create or view pipe reports (idea post). [staff] — [Pipe dashboard permissions for restricted view users](https://community.pipefy.com/ask-the-community-43/pipe-dashboard-permissions-for-restricted-view-users-2071); [community] — [Access to reports by users with restricted vision](https://community.pipefy.com/ideas/access-to-reports-by-users-with-restricted-vision-207)
- Start Form Only: creates cards through the start form and cannot view or edit any card, including its own. Listed on Pipefy's marketing glossary (5 levels) but absent from the help article dated 2026-08-17 (4 levels). [official, marketing] — [Pipefy glossary: Pipe members](https://www.pipefy.com/glossary/pipe-members); contradicted by [Pipe roles and permissions](https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions)
- Phases: no official setting limits who sees or moves cards per phase. Each phase has "Move to" rules (allowed destinations), and required fields block moves; by default there are no restrictions. A community answer says all pipe members see everything, and separate pipes are the workaround. [official] + [community] — [Moving cards through the pipe](https://help.pipefy.com/en/articles/614653-moving-cards-through-the-pipe); [How to edit a phase](https://help.pipefy.com/en/articles/614634-how-to-edit-a-phase); [Can I restrict the visibility of certain cards](https://community.pipefy.com/ask-the-community-43/can-i-restrict-the-visibility-of-certain-cards-to-be-only-visible-to-certain-users-1451)
- Public pipe: anyone in the company sees it and can join (company members as pipe members, company admins as pipe admins). Private pipe: only company admins or invited users join. [official] — [Pipe roles and permissions](https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions)
- Company reports pull data from several pipes; default access only company admins. Whether they respect each user's pipe access is not stated. [official] — [What are company reports](https://help.pipefy.com/en/articles/1698930-company-reports)
- Company admins have full access to all pipes of the organization. Page dated 2025-10-21. [official] — [User roles in Pipefy and the associated costs](https://help.pipefy.com/en/articles/12634763-user-roles-in-pipefy-and-the-associated-costs)

### Inferences
- In Pipefy, the person who sees a pipe's metrics without being in the pipe is the company admin (all pipes, company reports). Any other role must join the pipe and, from Member up, sees all cards.
- "Start Form Only" is likely a legacy level kept in marketing copy; flag as possibly deprecated.

### Gaps
- Whether Read-only users see Basic dashboards: not documented.
- Whether company reports, when opened to non-admin roles, include pipes the user is not in: not documented.
- Phase-level visibility of cards or of dashboard data: not documented.

## 5. External users, guests, portal and start-form-only users

### Takeaway
None of the 4 products documents report or dashboard access for external users. Pipefy guests and start-form users see no cards. Salesforce blocks guest and Community Portal users from report folders and applies license rules to dashboards. HubSpot and Kissflow are silent.

### Cited Findings
- Pipefy guests: cannot see or join any pipe; can use forms and open cards when an admin grants access. Company guest (employees) can create pipes and becomes member of pipes they create; external guest (suppliers, clients) cannot create pipes or become a company member. Not on Starter. Dashboards and reports are not addressed. Dated 2026-08-13. [official] — [Differences between company guest and external guest](https://help.pipefy.com/en/articles/6093562-differences-between-company-guest-and-external-guest)
- Pipefy guests are free until added to a card or pipe, then billable. Dated 2025-10-21. [official] — [User roles in Pipefy and the associated costs](https://help.pipefy.com/en/articles/12634763-user-roles-in-pipefy-and-the-associated-costs)
- Pipefy interfaces (portals): 2 on Starter, 20 on Business, 100 on Enterprise; guests: none, up to 100, unlimited. Page shows no date; accessed 2026-11-11. [official] — [Pipefy pricing](https://www.pipefy.com/pricing/)
- Kissflow: external app roles cannot be given Manage, so they get no default report access. [official, Kissflow Community docs] — [Managing process roles and permissions](https://community.kissflow.com/t/83yzjcs/managing-process-roles-and-permissions)
- Salesforce: guest and Community Portal users cannot access report and dashboard folders (search snippet). [official] — [Viewer Access to Report and Dashboard Folders](https://help.salesforce.com/s/articleView?id=sf.analytics_folder_viewer.htm&language=en_US&type=5)
- Salesforce: Customer Community and Partner Community license users cannot view a static dashboard whose running user has another license type. [official] — [Dashboard Data Visibility Considerations](https://help.salesforce.com/s/articleView?id=sf.dashboards_view_as_considerations.htm&language=en_US&type=5)

### Inferences
- The common pattern: external people submit and follow their own item; metrics stay internal.

### Gaps
- HubSpot: report access for customer portal users is not documented in the pages read.
- Salesforce: the "Standard Report Visibility" setting for external users did not render; its effect is not confirmed.
- Kissflow: Analytics access for external users is not documented.

## 6. Admin controls and plan gating

### Takeaway
Dashboards exist on every tier, but the control over who sees which dashboard is paid: Pipefy Dashboards Pro (Business and up, US$2.99 per user per month), HubSpot Enterprise for team-based sharing, Salesforce Enterprise and up for dynamic dashboards (3 to 10 per org), Kissflow Enterprise for Analytics and the report roles.

### Cited Findings
- Pipefy: Dashboards Basic free on all plans; Pro US$2.99 per user per month on Business, Enterprise and Unlimited. [official] — [What are dashboards](https://help.pipefy.com/en/articles/5610976-what-are-dashboards)
- Pipefy: pipe permission levels on Business and Enterprise only. [official] — [Pipe roles and permissions](https://help.pipefy.com/en/articles/614597-pipe-roles-and-permissions)
- Pipefy: pricing page lists Starter (free; 5 processes, 10 users, no guests), Business (role-based access, private processes, up to 100 guests) and Enterprise (SSO, 2FA, unlimited guests); the "Unlimited" plan cited by help articles is not on the pricing page. Accessed 2026-11-11. [official] — [Pipefy pricing](https://www.pipefy.com/pricing/)
- Pipefy: company reports access to other roles is set in the Admin dashboard; custom roles by super admins, Business and up. [official] — [What are company reports](https://help.pipefy.com/en/articles/1698930-company-reports); [Custom roles](https://help.pipefy.com/en/articles/6418478-custom-roles)
- Kissflow: Analytics only on Enterprise; Data Admin and Report Admin Enterprise only; process roles and permissions page marks Basic as unavailable. [official, Kissflow Community docs] — [FAQs: Analytics](https://community.kissflow.com/t/y4h9qz6/faqs-analytics); [Managing process members and permissions](https://community.kissflow.com/t/p8h9qtp/managing-process-members-and-permissions); [Managing process roles and permissions](https://community.kissflow.com/t/83yzjcs/managing-process-roles-and-permissions)
- HubSpot: dashboards and report access on all plans; custom reports on Professional and Enterprise; team-based dashboard and report sharing on Enterprise; Team only record access on Professional and Enterprise; Super Admin configures permissions. [official] — [Manage your dashboards](https://knowledge.hubspot.com/dashboards/manage-your-dashboards); [Manage reports in your reports list](https://knowledge.hubspot.com/reports/manage-reports-in-your-reports-list); [Assign access to records](https://knowledge.hubspot.com/records/assign-access-to-records)
- Salesforce: dynamic dashboards on Enterprise (5), Unlimited and Performance (10), Developer (3); Manage Dynamic Dashboards permission; admins hold Manage Reports/Dashboards in Public Folders. [official] — [Dynamic Dashboards](https://help.salesforce.com/s/articleView?id=sf.dashboards_dynamic_overview.htm&language=en_US&type=5); [User Permissions for Sharing Reports and Dashboards](https://help.salesforce.com/s/articleView?language=en_US&id=analytics.analytics_sharing_permissions.htm&type=5)

### Inferences
- Every vendor gives the basic view to whoever already works the records and charges for the fine-grained control. A free tier that already separates "who sees the dashboard" from "what data it counts" is not on offer from any of the 4.

### Gaps
- Pipefy: Dashboards Pro price and plan list date from 2024-01-10; current 2026 price not confirmed on the pricing page.
- HubSpot: the conflict on whether limiting report access to specific users needs Enterprise (assets page) or only team selection does (reports list page) is unresolved.
- Deprecations: Pipefy "Start Form Only" is absent from the 2026 help article (possibly legacy); Salesforce Classic folder sharing is superseded by enhanced folder sharing (default since Summer '13); Kissflow Community docs retire in November 2026. No other deprecation found.
