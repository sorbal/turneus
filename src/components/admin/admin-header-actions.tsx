import { Bell, Search, ShieldCheck } from "lucide-react"

const actions = [
  {
    label: "Cautare rapida",
    icon: Search,
  },
  {
    label: "Notificari",
    icon: Bell,
  },
  {
    label: "Securitate",
    icon: ShieldCheck,
  },
]

export function AdminHeaderActions() {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className="flex size-9 items-center justify-center rounded-lg border border-border/70 bg-card/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={action.label}
          title={action.label}
        >
          <action.icon className="size-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
