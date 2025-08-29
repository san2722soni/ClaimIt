"use client"
import { Button } from "@/components/ui/button"

type Props = {
  phone?: string
  message?: string
  className?: string
}

function normalizePhone(phone?: string) {
  if (!phone) return ""
  // Keep digits only (international format preferred)
  return phone.replace(/\D/g, "")
}

export function WhatsAppButton({
  phone,
  message = "Hi! I'm contacting you about the lost/found item.",
  className,
}: Props) {
  const number = normalizePhone(phone)
  const href = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : undefined

  return (
    <Button asChild size="sm" className={className} variant="secondary" aria-label="Contact on WhatsApp">
      <a
        href={href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!href}
        onClick={(e) => {
          if (!href) e.preventDefault()
        }}
        className="flex items-center gap-2"
      >
        {/* Simple brand icon (inline SVG) */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-emerald-600" role="img">
          <path d="M20.52 3.48A11.9 11.9 0 0 0 12.06 0C5.45.04.1 5.4.1 12.02c0 2.12.55 4.19 1.6 6.02L0 24l6.12-1.6a12.01 12.01 0 0 0 5.94 1.56h.01c6.62 0 12-5.36 12.04-11.98.02-3.2-1.22-6.22-3.59-8.5ZM12.07 22.1h-.01a9.96 9.96 0 0 1-5.07-1.4l-.36-.21-3.63.95.97-3.54-.23-.36a9.93 9.93 0 0 1-1.54-5.51C2.2 6.53 6.64 2.1 12.06 2.1c2.66 0 5.16 1.04 7.04 2.92a9.86 9.86 0 0 1 2.95 7.06c-.03 5.43-4.48 9.98-9.98 10.02Zm5.68-7.44c-.31-.16-1.85-.91-2.14-1.02-.29-.11-.5-.16-.71.16-.2.31-.81 1.02-.99 1.23-.18.2-.36.23-.67.08-.31-.16-1.3-.48-2.47-1.52-.92-.81-1.54-1.81-1.72-2.12-.18-.31-.02-.48.14-.64.14-.14.31-.36.45-.54.15-.18.2-.31.31-.52.1-.2.05-.4-.03-.56-.08-.16-.71-1.72-.97-2.36-.26-.64-.52-.55-.71-.55-.18 0-.4-.03-.62-.03-.2 0-.56.08-.85.4-.29.31-1.12 1.1-1.12 2.68 0 1.57 1.15 3.1 1.31 3.31.16.2 2.27 3.45 5.49 4.7.77.33 1.37.53 1.84.67.77.24 1.47.2 2.02.12.62-.09 1.85-.75 2.12-1.47.26-.72.26-1.34.18-1.47-.07-.13-.28-.2-.59-.36Z" />
        </svg>
        <span className="sr-only">WhatsApp</span>
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </Button>
  )
}
