# Permission model for team task dashboards and reports in work management SaaS (ClickUp, monday.com, Asana, Wrike, Smartsheet, Notion)

Research done on 2026-11-11. Dates in parentheses: "updated" is the Zendesk `updated_at` of the help article (ClickUp, monday.com, Wrike); "no date" means the page shows only a 2026 copyright (Asana, Smartsheet, Notion), so the date is "accessed 2026-11-11". The Asana help center does not render for WebFetch, so its pages were read in a browser on 2026-11-11.

## 1. Who can create a dashboard or report, and who can view it? Is viewing tied to a role or to sharing?

### Takeaway
In all 6 products, viewing depends on sharing (private, specific people or teams, whole workspace) on top of the user's role. The role then sets a ceiling: guests and limited seats in ClickUp, Wrike and Asana cannot create, and in Wrike they cannot open dashboards at all. Asana and ClickUp make new dashboards private to the creator. monday.com asks for Main or Private at creation. Wrike places dashboards in a space, and the space type decides who sees them.

### Cited Findings

**ClickUp**
- Members and Admins can access Dashboards and Dashboard views, create Dashboards, add cards, drill down and save as PDF. Guests can access a Dashboard only when it is shared with them, cannot create Dashboards or add cards, and can drill down and save as PDF (updated 2026-10-29). [ClickUp: Dashboards feature availability and limits](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits)
- Sharing is per person, per Team or workspace-wide ("Make Public" or the Workspace toggle). "Dashboards cannot be shared with people outside your Workspace." A dropdown beside each person or Team changes their permission (updated 2026-10-14). [ClickUp: Share Dashboards](https://help.clickup.com/hc/en-us/articles/6312198211863-Share-Dashboards)
- "Dashboards can only be shared with Teams on the Business Plus Plan and above." [ClickUp: Share Dashboards](https://help.clickup.com/hc/en-us/articles/6312198211863-Share-Dashboards)
- The Dashboards Hub has 4 pages: All Dashboards ("View all the Dashboards you have access to in your Workspace"), Created by me, Shared with me ("Private Dashboards other people have shared with you") and Private ("Dashboards you've created that are private") (updated 2026-10-27). [ClickUp: Dashboards Hub](https://help.clickup.com/hc/en-us/articles/14236332445335-Dashboards-Hub)
- A Dashboard view (a dashboard placed in a location) is visible to guests only when its location is shared with them, and Dashboard views "cannot be publicly shared". [ClickUp: Dashboards feature availability and limits](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits); [ClickUp: Create and share a Dashboard view](https://help.clickup.com/hc/en-us/articles/21501348696727-Create-and-share-a-Dashboard-view) (the second point comes from the help center search text, not a full read of the article)

**monday.com**
- 2 dashboard types: "If your Dashboard is set to "Main", it will be visible to everyone in your account." Private is visible only to the creator and invited team members (updated 2026-04-03). [monday.com: Dashboard permissions](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)
- Dashboard roles: the creator is Owner by default. "Only Dashboard Owners can edit the Dashboard itself, as well as the apps and widgets within it." Members view and interact. On a Main dashboard anyone in the account can become a member. "On a "Private" Dashboard, members must be invited by a Dashboard owner." [monday.com: Dashboard permissions](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)
- The creator chooses public or private when creating the dashboard (updated 2026-10-28). [monday.com: The Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards)

**Asana**
- In Reporting, users click "+ Create" > Dashboard. The Reporting page lists "recent dashboards you've created and shared with you (view-only)" (accessed 2026-11-11). [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- Sharing: invite individuals or teams, set access to private or visible to the org, and choose whether members are dashboard admins or viewers. "If you set another user as admin, you'll then lose edit access, as there can only be one admin." [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- "When collaborators view a shared dashboard, they have Read Only access." [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- Project dashboards are a Dashboard tab inside each project, with auto-populated charts (accessed 2026-11-11). [Asana: Project dashboards](https://help.asana.com/s/article/project-dashboards)
- The product page says dashboards can be shared "with specific teammates who are eligible under your plan" and "Shared users need appropriate access to view them" (accessed 2026-11-11). [Asana: Reporting product page](https://asana.com/product/reporting)

**Wrike**
- Creation: "Users with Space Admin rights in paid accounts" create dashboards in the spaces they manage (updated 2026-11-10). [Wrike: Creating a Dashboard](https://help.wrike.com/hc/en-us/articles/22009878498455-Creating-a-Dashboard)
- Viewing depends on the space type. Public space: "Any user can access the dashboard via its link or tools of the space." Private space: "Only space members get access as soon as the dashboard is created", with the access level inherited from space permissions. Locked space: only space members, and the dashboard "can't be shared with users outside the space." [Wrike: Creating a Dashboard](https://help.wrike.com/hc/en-us/articles/22009878498455-Creating-a-Dashboard)
- "If you're not a space admin, you'll be able to view dashboards created in spaces that you have access to." (updated 2026-11-03). [Wrike: Dashboards](https://help.wrike.com/hc/en-us/articles/22009910120471-Dashboards)
- Sharing roles: Full (default: "By default, users you share a dashboard with get the Full access role"), Editor (edit, delete and rearrange widgets) and Read Only ("can view the dashboard but can't make changes or share the dashboard with other users"). "All users except Collaborators, Contributors, External users and Viewers can share dashboards between Wrike users." (updated 2026-05-27). [Wrike: Sharing Dashboards Internally](https://help.wrike.com/hc/en-us/articles/35904094612882-Sharing-Dashboards-Internally)
- Reports: "You can share reports with all other members of your Wrike account." "Reports can't be shared with people outside of your Wrike account." Roles: Full ("including the right to delete the report") and Read Only ("Users can only view the report") (updated 2026-09-24). [Wrike: Sharing Reports](https://help.wrike.com/hc/en-us/articles/212729565-Sharing-Reports)
- "External Users, Collaborators, Contributors, and Viewers can only view reports shared with them." (updated 2026-11-03). [Wrike: Reports in Wrike](https://help.wrike.com/hc/en-us/articles/209604449-Reports-in-Wrike)

**Smartsheet**
- "Dashboards only allow you to set Admin or Viewer permissions." Owner or Admin shares. Admin edits; Viewer sees. Recipients without a Member seat may be limited to view-only (no date, accessed 2026-11-11). [Smartsheet: Share a dashboard](https://help.smartsheet.com/articles/2289957-sharing-a-smartsheet-dashboard)
- A dashboard in a workspace: anyone with edit permission on the workspace can view it, but editing needs Admin permission on the dashboard. A dashboard can be shared through the whole workspace or alone. [Smartsheet: Share a dashboard](https://help.smartsheet.com/articles/2289957-sharing-a-smartsheet-dashboard)
- Adding widgets needs a permission on the source: Metric, "at least Editor permissions on the source sheet"; Chart, "at least Editor permissions on the source sheet or report"; Report, "at least Admin access to the source report" (no date, accessed 2026-11-11). [Smartsheet: Dashboard widgets](https://help.smartsheet.com/articles/518558-dashboard-widgets)
- Conflict: a search snippet of the metric widget article lists Viewer as the permission needed, not Editor; not verified on the page. [Smartsheet: Use metric widgets](https://help.smartsheet.com/articles/2482273-use-metric-widgets)
- No Editor level exists for a single dashboard, per a Smartsheet staff answer in the community (search snippet, date not verified). [Smartsheet Community: Permission Level Capabilities for Dashboards and Workspaces](https://community.smartsheet.com/discussion/105314/permission-level-capabilities-for-dashboards-and-workspaces)

**Notion**
- "Dashboards follow the same permissions as the underlying database." Edit access on the database lets a user create dashboard views, edit the layout and configure widget views. View-only access opens the dashboard in View mode, with interaction "based on your permissions, such as opening pages or updating a status or date" (no date, accessed 2026-11-11). [Notion: Dashboards view](https://www.notion.com/help/dashboards)
- In View mode, filters and sorts stay on the user's device "unless someone with edit permissions selects "Save for everybody."" [Notion: Dashboards view](https://www.notion.com/help/dashboards)
- Page permission levels: Full access, Can edit, Can edit content (database pages only), Can create (database pages only, Business and Enterprise), Can comment, Can view (no date, accessed 2026-11-11). [Notion: Sharing & permissions settings](https://www.notion.com/help/sharing-and-permissions)

### Inferences
- In Asana and Smartsheet, viewers of a shared dashboard are read-only by design (Asana: Read Only for all collaborators; Smartsheet: Viewer). ClickUp, monday.com and Wrike give finer edit roles.
- Wrike is the only one where dashboard creation is limited to an admin role (Space Admin). In the other 5, any full member can create.

### Gaps
- ClickUp: the permission levels in the per-person dropdown on a Dashboard (view, comment, edit, full) are not listed in the articles read.
- Smartsheet: no official page read says whether Editor-shared users of a sheet can create dashboards; only the widget source permissions are documented.

## 2. Does the dashboard show only the data the viewer can access (row-level filtering), or everything to whoever opens it? Are there "view as owner" exceptions?

### Takeaway
3 behaviors exist. Viewer-filtered: ClickUp, monday.com, Wrike widgets and, by inheritance, Notion. Creator-filtered ("view as owner"): Asana charts and Smartsheet report widgets in "Last widget Editor" mode. Wrike reports sit in between: shared users open only items shared with them. Asana's help center states the creator rule, while an Asana forum answer from 2026-05 states the opposite.

### Cited Findings

**ClickUp (viewer-filtered)**
- "the Dashboard has the same permissions set in the location the data is in." Someone with access to a List sees all its tasks. To restrict, change the privacy of the Space, Folder or List (updated 2026-10-14). [ClickUp: Share Dashboards](https://help.clickup.com/hc/en-us/articles/6312198211863-Share-Dashboards)
- "Guests will only see cards on a Dashboard if they have access to the tasks, Lists, Subfolders, or Folders included in the card." (updated 2026-10-29). [ClickUp: Dashboards feature availability and limits](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits)
- A feature request reports that a viewer shared on the dashboard but not on the underlying Space, Folder or List sees every card at 0 or "No Results", and asks for a setting to show the owner's data. Per the search snippet, no such setting exists (date not verified). [ClickUp Feedback: Dashboard view-only access without access to the underlying data](https://feedback.clickup.com/feature-requests/p/dashboard-view-only-access-without-access-to-the-underlying-data)
- Public links are view only, and private tasks inside them stay hidden (help center search text). [ClickUp: Share locations and items with a public link](https://help.clickup.com/hc/en-us/articles/6309298874775-Share-locations-and-items-with-a-public-link)

**monday.com (viewer-filtered)**
- "Widgets always respect the permissions on the connected boards." 2 users can see different data on the same dashboard (updated 2026-04-03). [monday.com: Dashboard permissions](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)
- Cases listed: connected board in a private workspace the user can't access, or a private board the user isn't subscribed to, so the dashboard flags the missing access and offers a request. A hidden column shows as missing data. A user who sees only some items gets values calculated from those items only. [monday.com: Dashboard permissions](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)
- "Widget data is shown only where the person already has access to the source board and permitted columns" (summary of the permissions overview, updated 2026-10-09). [monday.com: Permissions on monday.com](https://support.monday.com/hc/en-us/articles/360019222479-Permissions-on-monday-com)
- Unverified conflict: a 2025 community thread titled "Dashboard making otherwise invisible data visible to all users" reports aggregate totals visible on a dashboard but not on the boards. The thread returned 404 on fetch, so only the search snippet was seen. [monday Community thread 109130](https://community.monday.com/t/dashboard-making-otherwise-invisible-data-visible-to-all-users-is-this-a-feature-change/109130)

**Asana (creator-filtered charts, viewer-filtered drill-down)**
- "Charts will appear the same to anyone who views the dashboards and reflect the permissions of the dashboard creator." (accessed 2026-11-11). [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- "When clicking into a chart segment, collaborators will only see the underlying data that they have access to." [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- Contradiction: on 2026-05-09, forum user Larry_Berger_lpb (role not shown) answered an admin whose "Overdue tasks by Assignee" chart missed tasks that lived only in My Tasks: "These dashboard charts only show data for what the logged in user has access to", and "if you colleague ran the same report, they'd see those overdue tasks, whereas you wouldn't if you didn't have access." [Asana Forum: How Do Reports Work](https://forum.asana.com/t/how-do-reports-work/1140345)
- Portfolios: a shared portfolio with private projects shows "This portfolio contains projects you don't have access to" (accessed 2026-11-11). [Asana: Portfolio privacy and sharing](https://help.asana.com/s/article/portfolio-privacy-and-sharing)

**Wrike (viewer-filtered widgets; reports: open only what is shared)**
- "teammates can only view the tasks that are shared with them." Widget sources need "direct access to these locations or these folders, projects, and spaces need to be shared with you." (updated 2026-11-03). [Wrike: Dashboards](https://help.wrike.com/hc/en-us/articles/22009910120471-Dashboards)
- "If you build a widget that draws tasks from the entire account, users will only see the tasks that are shared with them." A widget on an inaccessible folder shows "an empty widget, even if you have access to some of the subitems." (updated 2026-09-24; probably the older dashboards experience, since a newer "Dashboards" article exists). [Wrike: Dashboards in Wrike](https://help.wrike.com/hc/en-us/articles/209604469-Dashboards-in-Wrike)
- "To see a task, folder, or project in Wrike, they must be shared with you." "what you see in your workspace may be different from what your teammates see in their workspaces." (updated 2026-09-24). [Wrike: Sharing Tasks](https://help.wrike.com/hc/en-us/articles/209603849-Sharing-Tasks)
- Reports shared with others: "However, they are only able to open tasks, folders, and projects shared with them." (updated 2026-09-24). [Wrike: Sharing Reports](https://help.wrike.com/hc/en-us/articles/212729565-Sharing-Reports)

**Smartsheet (selectable per report widget)**
- Report widget "Viewer Mode" has 2 options. "Last widget Editor": data follows the editor's permissions and is the same for all viewers; "people can access the information you display in the report widget, even if it's not shared in the underlying sheets." With a Current User filter, the person who added the widget counts as the current user for every viewer (no date, accessed 2026-11-11). [Smartsheet: Control widget content when source is a report](https://help.smartsheet.com/articles/2480331-control-what-people-see-report-chart-widget)
- "Their own perspective": "The person viewing the data must be shared to the sheets from which the report was created." With a Current User filter, viewers see only rows with their name in the contact column. [Smartsheet: Control widget content when source is a report](https://help.smartsheet.com/articles/2480331-control-what-people-see-report-chart-widget)
- "The report widget doesn't show any data if you publish your dashboard with Their own perspective Viewer mode on." [Smartsheet: Control widget content when source is a report](https://help.smartsheet.com/articles/2480331-control-what-people-see-report-chart-widget)
- "Users shared to the dashboard don't always need access to the underlying sheets to see the report content." [Smartsheet: Dashboard widgets](https://help.smartsheet.com/articles/518558-dashboard-widgets)
- Reports outside dashboards: a community moderator says a user sees report rows only with direct access to the source sheet; publishing the report avoids sheet sharing (community, search snippet). [Smartsheet Community: Shared report not showing all sheets](https://community.smartsheet.com/discussion/79527/shared-report-not-showing-all-sheets)
- If a collaborator loses access to the report, chart widget or source data, the widget stops showing data and shows an error (search snippet of the report widget article). [Smartsheet: Use report widgets](https://help.smartsheet.com/articles/2482269-use-report-widgets)

**Notion (inherits database and page-level permissions)**
- Dashboards follow the underlying database permissions (no date, accessed 2026-11-11). [Notion: Dashboards view](https://www.notion.com/help/dashboards)
- Page-level access: rules by a person or created-by property. "Permissions you assign through a person property will apply across all views of your database." A user without database-wide access who opens the database "she'll get an error message", and reaches assigned pages through a notification or a linked view. [Notion: Sharing & permissions settings](https://www.notion.com/help/sharing-and-permissions)
- Charts: "For any chart you have permission to view, you can click into a specific part of that chart." (no date, accessed 2026-11-11). [Notion: Chart view](https://www.notion.com/help/charts)
- Property access: a column rule never gives access to a database page the person can't already open (search snippet). [Notion: Manage database property access](https://www.notion.com/help/database-property-access)
- "Broadest access wins": a workspace-wide grant can override a narrower page-level rule. [Notion: Sharing & permissions settings](https://www.notion.com/help/sharing-and-permissions)

### Inferences
- Asana and Smartsheet ("Last widget Editor") are the only ones documented to let a viewer see aggregated numbers from projects or sheets they cannot open. In Asana the drill-down still filters to the viewer's access, so a viewer can see a count without opening the tasks behind it.
- The Wrike phrase "only able to open tasks ... shared with them" on shared reports suggests the report may list items the viewer can't open. The article does not say so explicitly.
- Notion: since page-level rules "apply across all views", a dashboard widget or chart probably counts only pages the viewer can open. No Notion page states this for charts.

### Gaps
- Notion: no page states whether a chart or dashboard widget aggregates pages the viewer cannot open.
- Smartsheet: no official page read says whether chart and metric widgets (not report widgets) show data to a viewer not shared to the source sheet.
- Asana: the help center (creator permissions) and the 2026 forum answer (viewer permissions) conflict. No Asana staff answer was found.
- ClickUp: no official page states an owner-data exception; the "no exception" status relies on the feature request snippet.

## 3. Is there a native, fixed (non-editable) team or workload view, and who can see it? Can a regular member see colleagues' workload?

### Takeaway
None of the 6 offers a fixed, non-editable team dashboard. ClickUp, monday.com, Asana and Wrike have a configurable workload view on paid tiers. ClickUp and Wrike document that regular members can open it while guests and limited seats cannot. Asana project dashboards come pre-filled but stay editable. Smartsheet and Notion document no native workload view in the pages read.

### Cited Findings

**ClickUp**
- Workload view by role: Guest cannot view; Member can view, set own capacity, and set others' capacity "Only when they are set as the person's manager"; Admin can do all (updated 2026-10-28). [ClickUp: Workload view feature availability and limits](https://help.clickup.com/hc/en-us/articles/30657456679703-Workload-view-feature-availability-and-limits)
- Plans: Free Forever 60 uses, Unlimited 100 uses, Core trial, Business unlimited. Business Plus, Enterprise and Max add per-day capacity, no-capacity days and effort totals. [ClickUp: Workload view feature availability and limits](https://help.clickup.com/hc/en-us/articles/30657456679703-Workload-view-feature-availability-and-limits)
- "Show empty groups" "displays everyone with access to the location of the Workload view" (help center search text, updated 2026-10-29). [ClickUp: Customize your Workload view](https://help.clickup.com/hc/en-us/articles/30799933602327-Customize-your-Workload-view)
- Workspace admins set the default work schedule. Personal time off is counted in team capacity. [ClickUp: Measure availability or capacity in Workload view](https://help.clickup.com/hc/en-us/articles/30799838221335-Measure-availability-or-capacity-in-Workload-view); [ClickUp: Personal Time Off in Workload view](https://help.clickup.com/hc/en-us/articles/37330202777623-Personal-Time-Off-in-Workload-view) (help center search text)

**monday.com**
- "This feature is available for our Pro and Enterprise plans only." The Workload Widget works as a board view (1 board) or as a dashboard widget (several boards) (updated 2026-11-05; edited 2025-02-04). [monday.com: The Workload Widget](https://support.monday.com/hc/en-us/articles/360010699760-The-Workload-Widget)
- "You can only add and adjusted Work Schedules if you are an admin of the account." A work schedule is assigned to a team. [monday.com: The Workload Widget](https://support.monday.com/hc/en-us/articles/360010699760-The-Workload-Widget)
- Conflict: another article says admins or members with edit access assign and update work and holiday schedules. Team members log their own PTO by default on Pro; on Enterprise an admin must grant it. Resource Planner and Capacity Manager are Enterprise only (help center search text, updated 2026-09-07). [monday.com: Managing resource schedules and time off](https://support.monday.com/hc/en-us/articles/36305176145682-Managing-resource-schedules-and-time-off)

**Asana**
- Workload: Advanced, Enterprise, Enterprise+, legacy Business and Legacy Enterprise. Portfolio workload is a tab in a portfolio; "Team members who have tasks assigned to them in projects within the portfolio will show in the workload view." Universal workload lives under Resourcing > Workload views and pulls tasks and subtasks across all projects (accessed 2026-11-11). [Asana: Reporting with workload](https://help.asana.com/s/article/reporting-with-workload)
- Workload offers "a visual representation of tasks, allowing team leads and members to make informed decisions about resource allocation." [Asana: Reporting with workload](https://help.asana.com/s/article/reporting-with-workload)
- Project dashboards: "The charts in dashboards will auto-populate when you first land on the tab. You can also add customized charts". Starter and above (accessed 2026-11-11). [Asana: Project dashboards](https://help.asana.com/s/article/project-dashboards)

**Wrike**
- Workload charts: Business, Pinnacle, Apex; not Free or Team. "By default, a new Workload chart created from the home page is private and only available to its owner." Charts created from spaces "are shared with all space members by default". Roles: Full and Read Only, and the role "controls only the user's right to make changes to the Workload chart itself". Collaborators "won't have access to Workload charts due to their limited license." (updated 2026-09-24). [Wrike: Sharing Workload Charts](https://help.wrike.com/hc/en-us/articles/9781066282007-Sharing-Workload-Charts)
- "All regular users can export Workload charts that they have access to." [Wrike: Exporting Workload Charts](https://help.wrike.com/hc/en-us/articles/4404399235223-Exporting-Workload-Charts)

**Smartsheet and Notion**
- Not documented in the pages read. Smartsheet sells resource management separately; not researched here.

### Inferences
- In ClickUp and Wrike, a regular member who can open the workload view sees the people with access to that location or chart. No source says the view hides colleagues' rows from members.
- ClickUp's "manager" relation governs editing capacity only, not visibility.

### Gaps
- No product documents whether a member sees colleagues' tasks in a workload view when those tasks sit in locations the member can't access.
- monday.com: who can see colleagues in the Workload widget is not documented beyond "Widgets always respect the permissions on the connected boards".
- Asana: viewing permissions for portfolio and universal workload are not documented in the article read.

## 4. Is there permission by team or group (for example, a manager sees only their team)?

### Takeaway
No product documents a "manager sees only their team" rule for dashboards. Team scoping comes from 2 levers: sharing the dashboard with a team or group, and the permissions on the underlying data (spaces, boards, projects, pages). The closest to row-level by person is Notion page-level access by a person property (Business and Enterprise).

### Cited Findings
- ClickUp: dashboards share with Teams on Business Plus and above (updated 2026-10-14). [ClickUp: Share Dashboards](https://help.clickup.com/hc/en-us/articles/6312198211863-Share-Dashboards)
- ClickUp: a member edits another person's Workload capacity "Only when they are set as the person's manager." [ClickUp: Workload view feature availability and limits](https://help.clickup.com/hc/en-us/articles/30657456679703-Workload-view-feature-availability-and-limits)
- monday.com: a Work Schedule is assigned to a team and applies to every user on it. [monday.com: The Workload Widget](https://support.monday.com/hc/en-us/articles/360010699760-The-Workload-Widget)
- monday.com: board roles (Owner, Editor, Contributor, Assigned contributor, Viewer), column permissions and workspace permissions are Enterprise features (updated 2026-10-09). [monday.com: Permissions on monday.com](https://support.monday.com/hc/en-us/articles/360019222479-Permissions-on-monday-com)
- Asana: dashboards share with individuals or teams. Task charts include tasks from an organization, teams, portfolios, projects owned by specific people or specific projects, and can exclude teams or projects (accessed 2026-11-11). [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- Wrike: in a private space, "Only space members get access as soon as the dashboard is created." (updated 2026-11-10). [Wrike: Creating a Dashboard](https://help.wrike.com/hc/en-us/articles/22009878498455-Creating-a-Dashboard)
- Notion: page-level access rules grant an access level to the people in a person or created-by property, on Business and Enterprise. [Notion: Sharing & permissions settings](https://www.notion.com/help/sharing-and-permissions)

### Inferences
- In ClickUp, monday.com and Wrike, a manager sees only their team's metrics only when the data itself is split by team (one space or board per team) and the manager lacks access to the rest. In Asana, the creator-permission rule means a team filter set by the creator decides what everyone sees.

### Gaps
- Smartsheet group sharing for dashboards was not researched.
- No product documents a hierarchy (manager to direct reports) that filters dashboard data.

## 5. What do guests, external users and viewer seats see? Can they see dashboards?

### Takeaway
Guests see dashboards only when invited, and in ClickUp, monday.com and Wrike they get read-only access. Wrike blocks Collaborators, Contributors and Viewers from dashboards and workload charts by license, but lets them view shared reports. Smartsheet gives external collaborators read-only access and allows unlimited viewers. Asana guests see only what is shared with them; dashboards for guests are not documented.

### Cited Findings
- ClickUp: guests access a Dashboard only when shared with them, can be invited with view-only permissions, cannot create or add cards, and see a card only with access to its tasks, Lists, Subfolders or Folders. Comment and View-only guests cannot change date and time-range controls on Timesheet and Time Reporting cards (updated 2026-10-29). [ClickUp: Dashboards feature availability and limits](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits)
- ClickUp: guests cannot view the Workload view. [ClickUp: Workload view feature availability and limits](https://help.clickup.com/hc/en-us/articles/30657456679703-Workload-view-feature-availability-and-limits)
- monday.com: "Guests who are invited to your Dashboard but are not members of your account will be invited as free, read-only viewers." (updated 2026-04-03). [monday.com: Dashboard permissions](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)
- monday.com: community answers say viewers, like members, need access to all connected boards to see dashboard data (community, date not verified). [monday Community: Dashboard viewer](https://community.monday.com/t/dashboard-viewer/77399)
- Asana: "Guests have limited access to the organization and only see what is explicitly shared with them." In a portfolio, guests "will only see projects within the portfolio that they have been specifically invited to." Guests can have view-only licenses (accessed 2026-11-11). [Asana: Guests FAQ](https://help.asana.com/s/article/guests-faq)
- Asana: a forum tip says guests cannot view Goals (community, unofficial, date not verified). [Asana Forum: guest restrictions tip](https://forum.asana.com/t/what-if-a-friend-invited-you-to-an-asana-themed-amusement-park-as-a-guest-this-tip-highlights-the-rides-you-aren-t-tall-enough-to-ride-guest-restrictions/103027.md)
- Wrike: Collaborators, Contributors and Viewers "can not access Dashboards due to their license restrictions regardless of the space type." Owners can still share with them and with external users through Public links, except from locked spaces (updated 2026-11-10). [Wrike: Creating a Dashboard](https://help.wrike.com/hc/en-us/articles/22009878498455-Creating-a-Dashboard)
- Wrike: "Dashboards are available to all users on paid accounts except for Collaborators and Viewers." (updated 2026-11-03). [Wrike: Dashboards](https://help.wrike.com/hc/en-us/articles/22009910120471-Dashboards)
- Wrike: "External Users, Collaborators, Contributors, and Viewers can only view reports shared with them." [Wrike: Reports in Wrike](https://help.wrike.com/hc/en-us/articles/209604449-Reports-in-Wrike)
- Smartsheet: "Unlimited viewers are allowed for all Smartsheet items." External collaborators get read-only access "regardless of their permission settings, since they're not on your plan." (no date, accessed 2026-11-11). [Smartsheet: Sharing and widgets in the Pro plan](https://help.smartsheet.com/articles/2482496-sharing-and-widgets-in-the-pro-plan)
- Smartsheet: a published dashboard "automatically refreshes once every 10 minutes", and a report widget in "Their own perspective" mode shows no data when published. [Smartsheet: Share a dashboard](https://help.smartsheet.com/articles/2289957-sharing-a-smartsheet-dashboard); [Smartsheet: Control widget content when source is a report](https://help.smartsheet.com/articles/2480331-control-what-people-see-report-chart-widget)
- Notion: guests are people outside the workspace and need their own Notion account. On Enterprise, owners control whether members can invite guests. [Notion: Sharing & permissions settings](https://www.notion.com/help/sharing-and-permissions)

### Inferences
- Wrike's own pages differ on Contributors and External users: the dashboards article names only Collaborators and Viewers, while the creation and sharing articles add Contributors and External users.

### Gaps
- Asana: whether a guest can open a dashboard shared with them is not documented.
- Notion: guest access to dashboard views is covered only by the general rule (dashboards follow database permissions).
- monday.com: the official article does not say whether viewer seats (as opposed to guests) can open dashboards.

## 6. Can admins turn reporting or dashboards on or off, or restrict them by plan tier?

### Takeaway
Only Asana documents an admin switch that turns reporting off for the whole domain. The others gate by plan: ClickUp by usage counts, monday.com by boards per dashboard and Pro for workload, Wrike by paid plans with reports on Business, Smartsheet by Pro, and Notion with dashboard views on Business and 1 chart on Free.

### Cited Findings

**Admin controls**
- Asana: "Admins can turn off universal reporting at the domain level in the admin console. If universal reporting is turned off, users will not see the Reporting tab." (accessed 2026-11-11). [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- Asana: admins set the default privacy of new portfolios (Public to organization or Private to members). Restricting portfolio customization and sharing to admins is available on Enterprise, Enterprise+ and Legacy Enterprise (accessed 2026-11-11). [Asana: Portfolio privacy and sharing](https://help.asana.com/s/article/portfolio-privacy-and-sharing)
- Asana: on Enterprise, Enterprise+ and Legacy Enterprise, division super admins set who can invite external guests. [Asana: Guests FAQ](https://help.asana.com/s/article/guests-faq)
- monday.com: Enterprise admins see a private dashboard's name, subscribers and creation date in the content directory, but not its contents (updated 2026-04-03). [monday.com: Dashboard permissions](https://support.monday.com/hc/en-us/articles/360015914079-Dashboard-permissions)
- monday.com: Enterprise account permissions cover actions such as creating boards and docs, inviting guests and exporting to Excel. Dashboard creation is not listed (updated 2026-10-09). [monday.com: Permissions on monday.com](https://support.monday.com/hc/en-us/articles/360019222479-Permissions-on-monday-com)
- ClickUp: 1 custom role on Business Plus; unlimited custom roles on Enterprise and Max. A role permission covers exporting "Dashboard cards" (updated 2026-11-11). [ClickUp: Manage Custom Role permissions](https://help.clickup.com/hc/en-us/articles/6309195687959-Manage-Custom-Role-permissions); [ClickUp: Default user role permissions](https://help.clickup.com/hc/en-us/articles/26603207201431-Default-user-role-permissions)
- ClickUp: "owners and admins can turn Artifacts off for a role or a person" (Artifacts are AI-built apps and dashboards, a separate feature from Dashboards) (updated 2026-11-11). [ClickUp: Create custom apps, dashboards, prototypes, and other Artifacts](https://help.clickup.com/hc/en-us/articles/40440126306199-Create-custom-apps-dashboards-prototypes-and-other-Artifacts)
- Notion: Enterprise owners can disable public links; admins can disable export. [Notion: Sharing & permissions settings](https://www.notion.com/help/sharing-and-permissions)

**Plan gating**
- ClickUp Dashboards: Free Forever 60 uses, Unlimited 100, Core trial, Business and above unlimited; viewing a Dashboard counts as a use, and uses don't reset. Scheduled reports: 40 uses up to Business, unlimited on Business Plus and above. 100 cards per Dashboard (updated 2026-10-29). [ClickUp: Dashboards feature availability and limits](https://help.clickup.com/hc/en-us/articles/21257864098071-Dashboards-feature-availability-and-limits)
- monday.com: "Enterprise supports up to 50 connected boards, Pro up to 20, Standard up to 5, and Free up to 1." 30 widgets and 20,000 items per dashboard (updated 2026-10-28). [monday.com: The Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards)
- monday.com: Workload widget on Pro and Enterprise only. [monday.com: The Workload Widget](https://support.monday.com/hc/en-us/articles/360010699760-The-Workload-Widget)
- Asana: universal reporting on Starter, Advanced, Enterprise, Enterprise+ and legacy Premium, Business, Legacy Enterprise. Charts on portfolios, goals and project metadata need Advanced or above. Grouping by "time to complete" needs Enterprise or Enterprise+ (accessed 2026-11-11). [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- Asana conflict: "Project dashboards are Starter+, portfolio dashboards are Advanced+, and universal reporting is Advanced+." [Asana: Reporting product page](https://asana.com/product/reporting)
- Asana, deprecated plan names: the launch post said "Universal Reporting is available to Asana Premium, Business, and Enterprise customers." (undated; those are the legacy tiers). [Asana: Introducing Universal Reporting](https://asana.com/it/inside-asana/universal-reporting.md)
- Asana: Workload on Advanced, Enterprise, Enterprise+, legacy Business and Legacy Enterprise; portfolios on the same tiers. [Asana: Reporting with workload](https://help.asana.com/s/article/reporting-with-workload); [Asana: Portfolio privacy and sharing](https://help.asana.com/s/article/portfolio-privacy-and-sharing)
- Wrike conflict on dashboards: Business, Pinnacle and Apex (Free and Team unavailable), with dashboard limits of 1 on Team, up to 50 on Business and up to 200 on Pinnacle, Apex and Legacy Enterprise (updated 2026-11-10). [Wrike: Creating a Dashboard](https://help.wrike.com/hc/en-us/articles/22009878498455-Creating-a-Dashboard). The sharing article lists Team, Business, Pinnacle and Apex (updated 2026-05-27). [Wrike: Sharing Dashboards Internally](https://help.wrike.com/hc/en-us/articles/35904094612882-Sharing-Dashboards-Internally). "Team plan users can access only one dashboard in a shared space." [Wrike: Dashboards](https://help.wrike.com/hc/en-us/articles/22009910120471-Dashboards)
- Wrike: "Dashboards are available on all paid accounts, while Reports are available on Business and higher plans." (updated 2026-11-05). [Wrike: Step 6: Monitor Work and Build Up Success](https://help.wrike.com/hc/en-us/articles/360045369314-Step-6-Monitor-Work-and-Build-Up-Success)
- Wrike: Workload charts on Business, Pinnacle and Apex. [Wrike: Sharing Workload Charts](https://help.wrike.com/hc/en-us/articles/9781066282007-Sharing-Workload-Charts)
- Smartsheet: dashboard widgets on Pro, Business and Enterprise. [Smartsheet: Dashboard widgets](https://help.smartsheet.com/articles/518558-dashboard-widgets). Dashboard sharing on Smartsheet, Pro, Business and Enterprise plans. [Smartsheet: Share a dashboard](https://help.smartsheet.com/articles/2289957-sharing-a-smartsheet-dashboard). Pro: 10 widgets per dashboard and write access limited to 10 collaborators per item. [Smartsheet: Sharing and widgets in the Pro plan](https://help.smartsheet.com/articles/2482496-sharing-and-widgets-in-the-pro-plan)
- Notion: "Dashboard views are available on Business and Enterprise plans." Limits: 4 widgets per row and 12 per dashboard. [Notion: Dashboards view](https://www.notion.com/help/dashboards). "Charts are included on every paid plan." Free plan: 1 chart. [Notion: Chart view](https://www.notion.com/help/charts). Page-level access and property access: Business and Enterprise. [Notion: Sharing & permissions settings](https://www.notion.com/help/sharing-and-permissions)

### Inferences
- Asana is the only product among the 6 where an admin can remove reporting from every user with 1 switch. In the others, the admin lever is the data permission model and the plan.

### Gaps
- ClickUp, monday.com, Wrike, Smartsheet and Notion: no admin toggle to disable dashboards was found in the pages read.
- Asana: the help center (Starter and above) and the product page (Advanced and above) conflict on universal reporting tiers. The help center describes the feature in more detail; the product page may describe cross-project reporting only.

## 7. Defaults: private by default or workspace-visible by default?

### Takeaway
Asana dashboards are private to the owner by default. Wrike workload charts created from Home are private by default, and those created in a space are shared with its members. Wrike dashboards follow the space type. monday.com asks at creation with no documented default. ClickUp has a "Private" category for dashboards; one help search text says private by default, not confirmed on the article. Smartsheet and Notion follow item and database sharing.

### Cited Findings
- Asana: "By default, all dashboards are private to the owner of the dashboard." (accessed 2026-11-11). [Asana: Universal reporting](https://help.asana.com/s/article/universal-reporting)
- Asana: admins choose whether new portfolios start Public to organization or Private to members. [Asana: Portfolio privacy and sharing](https://help.asana.com/s/article/portfolio-privacy-and-sharing)
- Wrike: "By default, a new Workload chart created from the home page is private and only available to its owner." Charts created from spaces "are shared with all space members by default". [Wrike: Sharing Workload Charts](https://help.wrike.com/hc/en-us/articles/9781066282007-Sharing-Workload-Charts)
- Wrike: a dashboard in a public space is reachable by any user through its link or the space tools; in a private space, space members get access on creation. [Wrike: Creating a Dashboard](https://help.wrike.com/hc/en-us/articles/22009878498455-Creating-a-Dashboard)
- Wrike: users shared on a dashboard get the Full role by default. [Wrike: Sharing Dashboards Internally](https://help.wrike.com/hc/en-us/articles/35904094612882-Sharing-Dashboards-Internally)
- monday.com: the creator chooses public or private when creating; the article gives no default. [monday.com: The Dashboards](https://support.monday.com/hc/en-us/articles/360002187819-The-Dashboards)
- ClickUp: the Hub "Private" page lists "Dashboards you've created that are private". [ClickUp: Dashboards Hub](https://help.clickup.com/hc/en-us/articles/14236332445335-Dashboards-Hub)
- ClickUp: help center search text states "Dashboards are private by default" while "Spaces, Folders, Subfolders, Lists, tasks, and Goals are public by default"; not confirmed by reading the article itself. [ClickUp: Make Spaces, Folders, Subfolders, Lists, and tasks private](https://help.clickup.com/hc/en-us/articles/7255448709655-Make-Spaces-Folders-Subfolders-Lists-and-tasks-private)
- Notion: teamspace owners set default permissions for new pages. Pages in a default teamspace are open to everyone in the workspace except restricted members. [Notion: Sharing & permissions settings](https://www.notion.com/help/sharing-and-permissions)

### Inferences
- In Notion, a dashboard view lives inside a database page, so its default visibility is the default of the teamspace or page that holds it.

### Gaps
- Smartsheet: no default visibility for a new dashboard is documented in the pages read beyond workspace inheritance.
- ClickUp: the private-by-default statement needs a full read of the source article.
