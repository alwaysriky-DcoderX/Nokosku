// ui/components/CatLottie.tsx - Komponen Lottie untuk Nokosku
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect } from 'react';

type Variant = 'intro' | 'loading' | 'welcome' | 'hint' | 'notFound' | 'error' | 'successLove' | 'successCheck';

const lottieUrls: Record<Variant, string> = {
  intro: 'https://lottie.host/92c71487-72d1-440e-91a7-5135d0c96737/bSEfm70ckN.lottie',
  loading: 'https://lottie.host/2cb233f0-da41-41c8-b6e6-df8f6d2cb030/1MiJmNnYIO.lottie',
  welcome: 'https://lottie.host/425037ba-b402-426e-aa3f-ccc95db5fb55/IJF6xCT4AL.lottie',
  hint: 'https://lottie.host/8ed59247-d8d4-4480-a9ee-0240be717200/m4i2U5IAGE.lottie',
  notFound: 'https://lottie.host/da22beea-5995-4666-85ff-30c1e4d1d3dc/uIWXyvkeqg.lottie',
  error: 'https://lottie.host/bd40a338-c003-4e5e-b269-d509672c9130/WuQLTAMTNn.lottie',
  successLove: 'https://lottie.host/ccb9c479-d3f2-49ff-a0b9-32eefc719e0d/VfRjOvavIa.lottie',
  successCheck: 'https://lottie.host/2b5a924f-8beb-4bd3-83ff-81eca4ad0744/BFCl0vEiRp.lottie',
};

interface CatLottieProps {
  variant: Variant;
  size?: 'sm' | 'md' | 'lg' | number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function CatLottie({
  variant,
  size = 'md',
  loop = false,
  autoplay = true,
  className = '',
}: CatLottieProps) {
  const url = lottieUrls[variant];
  const sizePx = typeof size === 'number' ? size : { sm: 50, md: 100, lg: 200 }[size];

  useEffect(() => {
    // Preload all Lottie
    const urls = Object.values(lottieUrls);
    urls.forEach((u) => {
      const img = new Image();
      img.src = u;
    });
  }, []);

  return (
    <div className={`cat-lottie ${className}`} style={{ background: 'transparent' }}>
      <DotLottieReact
        src={url}
        loop={loop}
        autoplay={autoplay}
        style={{ width: `${sizePx}px`, height: `${sizePx}px` }}
      />
    </div>
  );
}