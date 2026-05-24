import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <svg
        viewBox="0 0 44 44"
        aria-hidden="true"
        className="h-9 w-9 shrink-0 drop-shadow-sm"
      >
        <rect x="2" y="2" width="40" height="40" rx="13" fill="#0B1020" />
        <rect
          x="2.75"
          y="2.75"
          width="38.5"
          height="38.5"
          rx="12.25"
          fill="none"
          stroke="#D4AF37"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <path d="M13 12v20" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M21 13h8.2c5 0 8.3 3.4 8.3 8.4s-3.3 8.4-8.3 8.4H21V13Z"
          fill="#F8FAFC"
        />
        <path d="M22.5 33h12" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {!iconOnly && (
        <div className="font-display text-[1.45rem] leading-none tracking-tight flex items-baseline">
          <span className="font-extrabold text-foreground">Patrono</span>
          <span className="ml-0.5 text-[#C69C6D] font-semibold">Clear</span>
        </div>
      )}
    </div>
  )
}
