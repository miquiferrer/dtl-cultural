export function Logo({
  className = '',
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'dark' | 'light'
}) {
  const heights = { sm: 40, md: 48, lg: 56, xl: 72 }
  const h = heights[size]

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Agenda Cultural de Terrassa"
        style={{ height: h, width: 'auto', display: 'block' }}
      />
    </div>
  )
}

