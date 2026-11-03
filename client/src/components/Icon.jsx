const shapes = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  tasks: <><path d="m3 6 2 2 4-4M3 16l2 2 4-4M13 7h8M13 17h8" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12 4 4L19 6" />,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
  reopen: <><path d="M3 10a9 9 0 1 1 2 8M3 3v7h7" /></>,
  bolt: <path d="m13 2-9 12h7l-1 8 10-12h-7l1-8" />,
  flag: <><path d="M5 22V3m0 0c5-4 9 4 14 0v11c-5 4-9-4-14 0" /></>,
  folder: <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  play: <path d="m8 4 12 8-12 8V4Z" />,
}

function Icon({ name, size = 20, className = '' }) {
  return <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{shapes[name]}</svg>
}

export function BrandMark() {
  return (
    <svg className="brand-mark" width="32" height="32" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" focusable="false">
      <rect x="2" y="2" width="12" height="12" rx="3" /><rect x="18" y="2" width="12" height="12" rx="3" />
      <rect x="2" y="18" width="12" height="12" rx="3" /><path d="M18 18h12v5a7 7 0 0 1-7 7h-5V18Z" />
    </svg>
  )
}

export default Icon
