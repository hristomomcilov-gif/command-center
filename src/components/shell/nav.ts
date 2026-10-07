import type { IconName } from "@/components/icons";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  exact?: boolean;
};

export const navGroups: NavItem[][] = [
  [{ href: "/", label: "Home", icon: "home", exact: true }],
  [
    { href: "/teamulate", label: "Teamulate", icon: "people" },
    { href: "/singularity-drive", label: "Singularity Drive", icon: "spark" },
    { href: "/job-board", label: "Job Board", icon: "board" },
    { href: "/freelance", label: "Freelance", icon: "user" },
  ],
  [
    { href: "/calendar", label: "Calendar", icon: "calendar" },
    { href: "/inbox", label: "Inbox", icon: "mail" },
    { href: "/projects", label: "Projects", icon: "folder" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ],
];

export function isCurrent(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  if (item.href === "/projects") {
    return pathname.startsWith("/projects") || pathname.startsWith("/priorities");
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
