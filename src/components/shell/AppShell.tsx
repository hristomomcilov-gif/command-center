import type { ReactNode } from "react";
import { Navigation } from "@/components/shell/Navigation";
import { Atmosphere } from "@/components/shell/scenes";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Atmosphere />
      <div className="shell">
        <Navigation />
        <main id="content" className="workspace-main">
          {children}
        </main>
      </div>
    </>
  );
}
