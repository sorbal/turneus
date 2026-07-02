type AdminDashboardLayoutProps = {
  header: React.ReactNode
  stats: React.ReactNode
  main: React.ReactNode
  secondary: React.ReactNode
}

export function AdminDashboardLayout({
  header,
  stats,
  main,
  secondary,
}: AdminDashboardLayoutProps) {
  return (
    <div className="space-y-8">
      {header}
      {stats}
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        {main}
      </section>
      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        {secondary}
      </section>
    </div>
  )
}
