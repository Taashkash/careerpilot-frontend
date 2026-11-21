<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Domain types live in src/lib/types.ts and demo data in src/lib/demo-data.ts; pages import only from there so a backend can replace the data source in one place.
- The dashboard shell (src/components/layout) wraps every route from __root except PUBLIC_PATHS in app-shell.tsx; nav items are defined once in nav-items.ts so all navigation stays consistent.
- Frontend demos share React-only state in DemoProvider; refresh and demo logout reset it, with no backend calls or browser persistence, so simulated accounts and progress never imply real authentication or storage.
- Reuse CareerFields, ResumeUpload and LearningPreferences across pages; resume Files remain in memory and are never parsed or transmitted during the frontend phase.
- Demo role profiles, projects and weekly plans live in src/lib/demo-data.ts; pure validation and filtering live in src/lib/demo-rules.ts so future integrations can replace data without changing page layout.
