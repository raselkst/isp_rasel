import { ReactNode } from "react";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Branding / motif panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-foreground text-background p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-signal flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3C7 3 3 6.5 3 11c0 3 2 5.5 4.5 6.8L12 21l4.5-3.2C19 16.5 21 14 21 11c0-4.5-4-8-9-8z"
                stroke="currentColor"
                strokeWidth="1.6"
                className="text-signal-foreground"
              />
              <circle cx="12" cy="10" r="2.2" fill="currentColor" className="text-signal-foreground" />
            </svg>
          </div>
          <div>
            <div className="font-heading font-bold text-lg leading-tight">ISP Cloud</div>
            <div className="text-[10px] tracking-[0.14em] uppercase text-background/50">
              Network OS
            </div>
          </div>
        </div>

        {/* Network pulse motif — concentric rings + connection nodes */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg width="520" height="520" viewBox="0 0 520 520" fill="none">
            <circle cx="260" cy="260" r="80" stroke="currentColor" className="text-signal/25" strokeWidth="1" />
            <circle cx="260" cy="260" r="140" stroke="currentColor" className="text-signal/18" strokeWidth="1" />
            <circle cx="260" cy="260" r="200" stroke="currentColor" className="text-signal/10" strokeWidth="1" />
            <circle cx="260" cy="260" r="6" fill="currentColor" className="text-signal" />
            <circle cx="150" cy="180" r="4" fill="currentColor" className="text-signal/70" />
            <circle cx="380" cy="150" r="4" fill="currentColor" className="text-signal/50" />
            <circle cx="400" cy="340" r="4" fill="currentColor" className="text-signal/60" />
            <circle cx="130" cy="360" r="4" fill="currentColor" className="text-signal/40" />
            <line x1="260" y1="260" x2="150" y2="180" stroke="currentColor" className="text-signal/25" strokeWidth="1" />
            <line x1="260" y1="260" x2="380" y2="150" stroke="currentColor" className="text-signal/20" strokeWidth="1" />
            <line x1="260" y1="260" x2="400" y2="340" stroke="currentColor" className="text-signal/20" strokeWidth="1" />
            <line x1="260" y1="260" x2="130" y2="360" stroke="currentColor" className="text-signal/15" strokeWidth="1" />
            <circle cx="260" cy="260" r="24" fill="none" stroke="currentColor" className="text-signal/60 ring-pulse" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative">
          <p className="font-heading text-2xl font-semibold leading-snug max-w-sm">
            Run your network like it never sleeps.
          </p>
          <p className="text-sm text-background/60 mt-3 max-w-sm">
            Clients, billing, bandwidth and infrastructure — one control room for your entire ISP.
          </p>
        </div>

        <style>{`
          .ring-pulse {
            animation: ring-grow 2.8s ease-out infinite;
            transform-origin: center;
          }
          @keyframes ring-grow {
            0% { r: 24; opacity: 0.6; }
            100% { r: 90; opacity: 0; }
          }
        `}</style>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-[11.5px] tracking-[0.14em] uppercase text-signal font-semibold mb-2">
            {eyebrow}
          </div>
          <h1 className="font-heading text-[26px] font-bold tracking-tight mb-1.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mb-8">{subtitle}</p>
          )}
          {!subtitle && <div className="mb-8" />}

          {children}

          {footer && <div className="mt-6 text-sm text-center">{footer}</div>}

          <p className="mt-10 text-center text-xs font-semibold text-muted-foreground">
            Powered by NSP
          </p>
        </div>
      </div>
    </div>
  );
}