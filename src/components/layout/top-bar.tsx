import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { pageTitles } from "./nav-items";
import { notificationsQuery, profileQuery } from "@/lib/api/queries";
import { useMarkNotificationsRead, useSignOut } from "@/lib/api/mutations";
import { initials } from "@/lib/utils";

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { data: profileData } = useQuery(profileQuery);
  const { data: items = [] } = useQuery(notificationsQuery);
  const markRead = useMarkNotificationsRead();
  const signOut = useSignOut();
  const user = profileData?.profile ?? { name: "", email: "" };
  const path = useRouterState({ select: (s) => s.location.pathname });
  const unread = items.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur md:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold tracking-tight">{pageTitles[path] ?? "CareerPilot AI"}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Notifications</span>
              <Button variant="ghost" size="sm" disabled={!unread}
                onClick={() => markRead.mutate("all")}>Mark all read</Button>
            </div>
            <ul className="max-h-80 overflow-auto">
              {items.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet.</li>}
              {items.map((n) => (
                <li key={n.id}>
                  <Button variant="ghost" onClick={() => { if (!n.read) markRead.mutate(n.id); }}
                    className="h-auto w-full justify-start gap-3 whitespace-normal rounded-none px-4 py-3 text-left">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-border" : "bg-primary"}`} />
                    <span><span className="block text-sm">{n.title}</span><span className="text-xs text-muted-foreground">{n.time}</span></span>
                  </Button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Account menu" className="rounded-full">
              <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary-soft text-sm font-semibold text-primary">{initials(user.name || user.email)}</AvatarFallback></Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel><div className="text-sm">{user.name || "Your account"}</div><div className="text-xs font-normal text-muted-foreground">{user.email}</div></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void signOut()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
