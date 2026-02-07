import { Button } from "../components/foundation/Button";

const quickLinks = [
  { label: "GitHub", href: "https://github.com" },
  { label: "Gmail", href: "https://mail.google.com" },
  { label: "Calendar", href: "https://calendar.google.com" },
  { label: "Notion", href: "https://www.notion.so" },
];

export function LauncherWidget(): JSX.Element {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-ink transition hover:bg-white/20"
          >
            {link.label}
          </a>
        ))}
      </div>
      <Button tone="ghost" type="button" className="mt-auto">
        Add Link (coming soon)
      </Button>
    </div>
  );
}
