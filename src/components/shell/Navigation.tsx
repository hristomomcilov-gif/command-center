"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { Icon, Mark } from "@/components/icons";
import { isCurrent, navGroups } from "@/components/shell/nav";

function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="wordmark" onClick={onNavigate}>
      <Mark />
      <span>
        <strong>Teamulate</strong>
        <span>Command Center</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="nav" aria-label="Command Center">
      {navGroups.map((group) => (
        <div className="nav-group" key={group[0]?.href}>
          {group.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={isCurrent(pathname, item) ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (pathname.startsWith("/teamulate")) root.dataset.surface = "ops";
    else delete root.dataset.surface;
  }, [pathname]);

  return (
    <div className="nav-root">
      <aside className="sidebar panel">
        <Wordmark />
        <NavLinks />
        <p className="tagline">A calmer way to build what&apos;s next.</p>
      </aside>

      <header className="topbar panel">
        <Wordmark />
        <button
          type="button"
          className="menu-button"
          aria-haspopup="dialog"
          aria-label="Open navigation"
          onClick={() => dialogRef.current?.showModal()}
        >
          <Icon name="menu" size={20} />
        </button>
      </header>

      <dialog ref={dialogRef} className="nav-dialog" aria-label="Command Center">
        <div className="dialog-head">
          <Wordmark onNavigate={() => dialogRef.current?.close()} />
          <button
            type="button"
            className="menu-button"
            aria-label="Close navigation"
            onClick={() => dialogRef.current?.close()}
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <NavLinks onNavigate={() => dialogRef.current?.close()} />
        <p className="tagline">A calmer way to build what&apos;s next.</p>
      </dialog>
    </div>
  );
}
