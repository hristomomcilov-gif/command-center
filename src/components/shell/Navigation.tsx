"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Icon } from "@/components/icons";
import { isCurrent, navGroups } from "@/components/shell/nav";

function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="wordmark" onClick={onNavigate}>
      <Image src="/brand/command-center.png" alt="Command Center" width={1480} height={524} priority />
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
  const dialogRef = useRef<HTMLDialogElement>(null);

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
