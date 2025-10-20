
/**
 * Papi Hair Design - PWA Install Banner
 * A lightweight, dependency-free, framework-agnostic ESM module to prompt users to install the PWA.
 *
 * @license
 * Copyright 2025 Papi Hair Design
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @typedef {object} InstallBannerOptions
 * @property {'bottom-left' | 'bottom-right'} [position='bottom-left'] - The banner's position on the screen.
 * @property {string} [storageKey='papi_a2hs_dismissed_v1'] - Key for localStorage to remember dismissal.
 * @property {number} [ttlDays=7] - How many days to wait before showing the banner again after dismissal.
 * @property {number} [showDelayMs=8000] - Delay in milliseconds before the banner appears.
 * @property {object} [text] - Customizable text strings.
 * @property {string} [text.title='Nainštalovať aplikáciu']
 * @property {string} [text.ctaInstall='Nainštalovať']
 * @property {string} [text.dismiss='Zavrieť']
 * @property {string} [text.iosTip='V Safari ťukni na ikonu Zdieľať a potom "Pridať na plochu"']
 * @property {() => void} [onShow] - Callback when the banner is shown.
 * @property {(outcome: 'accepted'|'dismissed'|'already-installed') => void} [onInstall] - Callback after the user interacts with the native prompt.
 * @property {() => void} [onDismiss] - Callback when the user dismisses the banner.
 */

/**
 * Initializes and displays the PWA installation banner if conditions are met.
 * @param {InstallBannerOptions} [options={}]
 */
export function initInstallBanner(options = {}) {
  const config = {
    position: 'bottom-left',
    storageKey: 'papi_a2hs_dismissed_v1',
    ttlDays: 7,
    showDelayMs: 8000,
    text: {
      title: "Nainštalovať aplikáciu",
      ctaInstall: "Nainštalovať",
      dismiss: "Zavrieť",
      iosTip: `V Safari ťukni na ikonu Zdieľať <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin:0 4px;"><circle cx="12" cy="5" r="2"/><path d="M12 12v7"/><path d="m8.5 9.5 3.5-3.5 3.5 3.5"/></svg> a potom "Pridať na plochu"`,
    },
    ...options,
  };

  let deferredPrompt = null;

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const isDismissed = () => {
    const dismissedTimestamp = localStorage.getItem(config.storageKey);
    if (!dismissedTimestamp) return false;
    const ttlMs = config.ttlDays * 24 * 60 * 60 * 1000;
    return (Date.now() - parseInt(dismissedTimestamp, 10)) < ttlMs;
  };

  const setDismissed = () => {
    localStorage.setItem(config.storageKey, Date.now().toString());
  };

  if (isStandalone() || isDismissed()) {
    if(isStandalone() && config.onInstall) config.onInstall('already-installed');
    return;
  }
  
  const createStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --a2hs-bg: rgba(10, 10, 10, 0.75);
        --a2hs-fg: #FFFFFF;
        --a2hs-accent: #D4AF37;
        --a2hs-shadow: 0 10px 30px rgba(0,0,0,.4);
        --a2hs-border: rgba(255, 255, 255, 0.1);
      }
      .papi-install-banner {
        position: fixed;
        bottom: calc(env(safe-area-inset-bottom, 0) + 1rem);
        ${config.position === 'bottom-left' ? 'left: 1rem;' : 'right: 1rem;'}
        z-index: 1000;
        width: calc(100% - 2rem);
        max-width: 340px;
        background-color: var(--a2hs-bg);
        color: var(--a2hs-fg);
        border: 1px solid var(--a2hs-border);
        border-radius: 0.75rem;
        backdrop-filter: blur(16px);
        box-shadow: var(--a2hs-shadow);
        padding: 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        transform: translateY(2rem);
        opacity: 0;
        visibility: hidden;
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, visibility 0.4s;
      }
      @media (prefers-reduced-motion: reduce) {
        .papi-install-banner {
          transition: opacity 0.4s ease;
        }
      }
      .papi-install-banner.visible {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      .papi-install-banner__icon {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 0.5rem;
      }
      .papi-install-banner__content {
        flex-grow: 1;
      }
      .papi-install-banner__title {
        font-size: 1rem;
        font-weight: 700;
        margin: 0 0 0.25rem;
        color: var(--a2hs-fg);
      }
      .papi-install-banner__text {
        font-size: 0.875rem;
        margin: 0;
        line-height: 1.4;
        color: #e5e7eb;
      }
      .papi-install-banner__cta {
        margin-top: 0.75rem;
        padding: 0.5rem 1rem;
        background-color: var(--a2hs-accent);
        color: #000000;
        border: none;
        border-radius: 9999px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, background-color 0.2s ease;
      }
      .papi-install-banner__cta:hover {
        transform: translateY(-2px);
        background-color: #b89b31;
      }
      .papi-install-banner__dismiss {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 1.75rem;
        height: 1.75rem;
        border: none;
        background: transparent;
        color: #9ca3af;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        transition: color 0.2s ease, background-color 0.2s ease;
      }
      .papi-install-banner__dismiss:hover {
        color: white;
        background-color: rgba(255,255,255,0.1);
      }
    `;
    document.head.append(style);
  };
  
  const createBanner = (isForIOS = false) => {
    const banner = document.createElement('div');
    banner.className = `papi-install-banner`;
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-labelledby', 'papi-install-banner-title');

    banner.innerHTML = `
      <img src="/assets/logo.webp" alt="Papi Hair Design logo" class="papi-install-banner__icon" />
      <div class="papi-install-banner__content">
        <h3 id="papi-install-banner-title" class="papi-install-banner__title">${config.text.title}</h3>
        ${isForIOS ? `
          <p class="papi-install-banner__text">${config.text.iosTip}</p>
        ` : `
          <button class="papi-install-banner__cta">${config.text.ctaInstall}</button>
        `}
      </div>
      <button class="papi-install-banner__dismiss" aria-label="${config.text.dismiss}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    const hideAndDismiss = () => {
        banner.classList.remove('visible');
        setDismissed();
        if (config.onDismiss) config.onDismiss();
        setTimeout(() => banner.remove(), 500);
    };

    banner.querySelector('.papi-install-banner__dismiss').addEventListener('click', hideAndDismiss);

    if (!isForIOS) {
        banner.querySelector('.papi-install-banner__cta').addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (config.onInstall) config.onInstall(outcome);
            hideAndDismiss();
            deferredPrompt = null;
        });
    }
    
    return banner;
  };

  const showBannerAfterDelay = (banner) => {
    setTimeout(() => {
        banner.classList.add('visible');
        if (config.onShow) config.onShow();
    }, config.showDelayMs);
  };

  createStyles();

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const banner = createBanner(false);
    document.body.appendChild(banner);
    showBannerAfterDelay(banner);
  });
  
  // iOS Fallback
  if (isIOS()) {
      // Small delay to let the `beforeinstallprompt` event potentially fire on iPadOS
      setTimeout(() => {
          if (!deferredPrompt) { // if it's still null, we are on iOS
              const banner = createBanner(true);
              document.body.appendChild(banner);
              showBannerAfterDelay(banner);
          }
      }, 500);
  }
}
