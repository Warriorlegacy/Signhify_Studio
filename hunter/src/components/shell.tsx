import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Radio, Send, Inbox as InboxIcon, Settings, Crosshair,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/sources", label: "Sources", icon: Radio },
  { to: "/campaigns", label: "Campaigns", icon: Send },
  { to: "/inbox", label: "Inbox", icon: InboxIcon },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-white/8 bg-obsidian-2/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember glow-ember">
            <Crosshair className="h-5 w-5 text-obsidian" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display text-base font-700 leading-tight text-white">Hunter</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-soft">Signhify OS</div>
          </div>
        </div>
        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-ember/15 text-ember-soft"
                    : "text-slate-soft hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {active && <span className="pulse-dot ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/8 px-5 py-4">
          <div className="text-xs text-slate-soft">Signhify AI Engineering Studio</div>
          <div className="text-[10px] text-slate-soft/60">Find. Qualify. Sign.</div>
        </div>
      </aside>
      <main className="ml-56 flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
