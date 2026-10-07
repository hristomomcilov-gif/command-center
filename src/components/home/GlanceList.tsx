import Link from "next/link";
import { Icon } from "@/components/icons";
import type { EmailSymbol, HomeEmailItem } from "@/lib/home/types";
import type { IconName } from "@/components/icons";

const symbols: Record<EmailSymbol, IconName> = {
  person: "user",
  calendar: "calendar",
  document: "doc",
};

export function GlanceList({ emails }: { emails: HomeEmailItem[] }) {
  return (
    <ul className="glance-list">
      {emails.map((email) => (
        <li key={email.id}>
          <Link href={email.href} className="mail-row">
            <span className="mail-icon" aria-hidden="true">
              <Icon name={symbols[email.symbol]} />
            </span>
            <span className="mail-copy">
              <span className="mail-line">
                <span className="mail-sender">{email.sender}</span>
                <span className="mail-dash" aria-hidden="true">
                  —
                </span>
                <span>{email.context ?? email.subject}</span>
              </span>
              <span className="mail-time">{email.timeLabel}</span>
            </span>
            <Icon name="chevron" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
