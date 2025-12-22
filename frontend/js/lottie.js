// public/js/lottie.js - DotLottie Web integration for NOKOSKU
import { DotLottie } from '@lottiefiles/dotlottie-web';

const lottieCache = new Map(); // Cache preloaded animations

// Preload all Lottie URLs at app start
export async function preloadLottie(urls) {
  for (const url of urls) {
    if (!lottieCache.has(url)) {
      const dotlottie = new DotLottie({
        autoplay: false,
        loop: false,
        canvas: document.createElement('canvas'), // Invisible preload
        src: url
      });
      await dotlottie.load();
      lottieCache.set(url, dotlottie);
    }
  }
}

// Mount Lottie to element
export function mountLottie(el, url, { loop = false, autoplay = false, size = 200 } = {}) {
  const dotlottie = lottieCache.get(url);
  if (dotlottie) {
    el.innerHTML = ''; // Clear
    dotlottie.canvas.style.width = `${size}px`;
    dotlottie.canvas.style.height = `${size}px`;
    dotlottie.canvas.style.background = 'transparent';
    el.appendChild(dotlottie.canvas);
    dotlottie.setLoop(loop);
    dotlottie.setAutoplay(autoplay);
    if (autoplay) dotlottie.play();
  }
}

// Destroy Lottie from element
export function destroyLottie(el) {
  el.innerHTML = ''; // Cleanup
}

// Lottie URLs mapping (local JSON files)
export const lottieUrls = {
  intro: '/lottie/intro.json',
  loading: '/lottie/loading.json',
  welcome: '/lottie/welcome.json',
  edukasi: '/lottie/edukasi.json',
  error: '/lottie/error.json',
  success: '/lottie/success.json',
  successGreen: '/lottie/success.json', // Use success for green
  expired: '/lottie/expired.json',
  waiting: '/lottie/waiting.json'
};