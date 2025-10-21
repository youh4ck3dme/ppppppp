import React from 'react';

export type IconId =
  | 'menu'
  | 'close'
  | 'globe'
  | 'shopping-cart'
  | 'instagram'
  | 'tiktok'
  | 'scissors'
  | 'palette'
  | 'swirl'
  | 'bar-chart'
  | 'calendar'
  | 'wand'
  | 'trash'
  | 'trash-2'
  | 'refresh'
  | 'camera'
  | 'download'
  | 'share'
  | 'sparkles'
  | 'sun'
  | 'moon'
  | 'heart'
  | 'info'
  | 'check-circle'
  | 'alert-triangle'
  | 'alert-circle'
  | 'credit-card'
  | 'gift'
  | 'calendar-check'
  | 'map-pin'
  | 'phone'
  | 'mail'
  | 'user'
  | 'log-out'
  | 'message-circle'
  | 'image'
  | 'send'
  | 'loader'
  | 'settings'
  | 'facebook'
  | 'chevron-down'
  | 'cloud'
  | 'cloud-rain'
  | 'cloud-lightning'
  | 'cloud-snow'
  | 'eye';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  id: IconId;
}

const iconPaths: Record<IconId, React.ReactNode> = {
  // --- Header & General UI ---
  menu: <path d="M3 12h18M6 6h12M6 18h12" />,
  close: <path d="M18 6L6 18M6 6l12 12" />,
  globe: <>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.5 12h19" />
    <path d="M12 2.5a15 15 0 010 19" />
    <path d="M12 2.5a15 15 0 000 19" />
  </>,
  'shopping-cart': <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18m-5 4a4 4 0 1 1-8 0" />,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></>,
  
  // --- Redesigned Realistic Icons ---
  scissors: (
    <g stroke="none" fill="currentColor">
      <path d="M15.83,8.17L23,1H17.41l-4.24,4.24,1.41,1.41,4.25-4.24V8.17z M1,23L8.17,15.83l-1.41-1.41L1,20.59V23z" fillOpacity="0.8" />
      <path d="M10,14L4,20" stroke="currentColor" strokeWidth="1" />
      <path d="M20,4L14,10" stroke="currentColor" strokeWidth="1" />
      <circle cx="6.5" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="6.5" cy="17.5" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </g>
  ),
  palette: (
    <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <path d="M13.23,3.44C15.1,2.5 17.5,2.78 18.95,4.23s1.73,3.85.78,5.72L12,17.29,4.71,10,13.23,3.44z" />
        <path d="M16,14.29l-2.3,2.3a2.43,2.43,0,0,1-3.43,0L3.44,9.77" />
        <circle cx="16" cy="7" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="13" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="9" cy="6" r="1.5" fill="currentColor" stroke="none" />
    </g>
  ),
  swirl: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 21c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6" />
        <path d="M12 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6" opacity="0.7"/>
        <path d="M12 9c-3.31 0-6-2.69-6-6" opacity="0.4"/>
    </g>
  ),
  calendar: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <rect x="7" y="14" width="2" height="2" fill="currentColor" stroke="none" />
        <rect x="11" y="14" width="2" height="2" fill="currentColor" stroke="none" />
    </g>
  ),
  wand: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M16 3L21 8 13 16 8 11 16 3z" fill="currentColor" fillOpacity="0.8" />
        <path d="M14.5 17.5L3 6" />
        <path d="M21 3l-6 6" />
        <path d="M3,12a9,9,0,0,0,9,9" />
        <path d="M17 21l2 -2" />
        <path d="M19 17l2 2" />
    </g>
  ),
  gift: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="8" width="18" height="13" rx="2"/>
      <path d="M12,3v18" strokeLinecap="round"/>
      <path d="M3.5,8L12,12l8.5-4"/>
      <path d="M3.5,13L12,17l8.5-4"/>
      <path d="M12,3a4,4,0,0,0-4,4" strokeLinecap="round"/>
      <path d="M12,3a4,4,0,0,1,4,4" strokeLinecap="round"/>
    </g>
  ),

  // --- Other existing icons ---
  'bar-chart': <path d="M3 12l2-2m0 0l4-4m-4 4v6m4-10l4-4m0 0l4 4m-4-4v12" />,
  instagram: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919-4.919 1.266.058 1.644.07 4.85.07m0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.359-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.359-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />,
  tiktok: <path d="M22.2 5.5s-1.8-3.4-5-3.4H7.9c-2.3 0-4.3 2-4.3 4.3v7.3c0 2.3 2 4.3 4.3 4.3h7.3c2.3 0 4.3-2 4.3-4.3V5.5zm-5.6 2.3c-.2.2-2.3.2-2.3.2V15c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3V7.8s-2.1 0-2.3-.2c-.3-.2-.4-.6-.2-.9.2-.3.6-.4.9-.2.2 0 2.3.2 2.3.2V4.8c0-.4.3-.7.7-.7s.7.3.7.7v3.5s2.1 0 2.3-.2c.3-.2.7 0 .9.2.2.3 0 .7-.2.9z"/>,
  trash: <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  'trash-2': <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  refresh: <path d="M4 4v5h5M20 20v-5h-5M20 4s-1.5 5-6 5-6-5-6-5s1.5-5 6-5 6 5 6 5z" />,
  camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></>,
  download: <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
  share: <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />,
  sparkles: <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  sun: <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
  moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>,
  heart: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  info: <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  'check-circle': <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  'alert-triangle': <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
  'alert-circle': <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  'credit-card': <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
  'calendar-check': <><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path d="M9 16l2 2 4-4" /></>,
  'map-pin': <><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>,
  phone: <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
  mail: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  'log-out': <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></>,
  'message-circle': <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></>,
  send: <><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></>,
  loader: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
  settings: <><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.44,0.17-0.48,0.41L9.2,5.77C8.61,6.01,8.08,6.33,7.58,6.71L5.2,5.75C4.98,5.68,4.73,5.75,4.61,5.95l-1.92,3.32 c-0.12,0.22-0.07,0.47,0.12,0.61l2.03,1.58C4.82,11.36,4.8,11.68,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.48-0.41l0.36-2.54c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.01,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3 s3,1.34,3,3S13.66,15,12,15z" /></>,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,

  // Weather Icons
  cloud: <><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></>,
  'cloud-rain': <><path d="M16 13v8"></path><path d="M8 13v8"></path><path d="M12 15v8"></path><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></>,
  'cloud-lightning': <><path d="M13 11l-4 6h6l-4 6"></path><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></>,
  'cloud-snow': <><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><path d="M8 15h0"></path><path d="M8 19h0"></path><path d="M12 17h0"></path><path d="M12 21h0"></path><path d="M16 15h0"></path><path d="M16 19h0"></path></>,
};

export const Icon: React.FC<IconProps> = ({ id, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill={id === 'instagram' || id === 'settings' || id === 'moon' || id === 'facebook' || id === 'info' ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={id === 'instagram' || id === 'settings' || id === 'moon' || id === 'facebook' || (iconPaths[id] as any)?.props?.stroke === 'none' ? 0 : 1.5}
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {iconPaths[id]}
    </svg>
  );
};