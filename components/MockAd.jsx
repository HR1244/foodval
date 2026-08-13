"use client";

import { useEffect } from 'react';
import styles from './MockAd.module.css';

export default function MockAd() {
  const adSensePubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  useEffect(() => {
    if (adSensePubId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [adSensePubId]);

  if (!adSensePubId) {
    return null;
  }

  return (
    <div className={styles.adContainer} style={{ padding: 0, textAlign: 'center' }}>
      <div className={styles.adHeader} style={{ padding: '8px 16px 0' }}>
        <span className={styles.sponsoredBadge}>Advertisement</span>
      </div>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '100px' }}
        data-ad-client={adSensePubId}
        data-ad-slot="1234567890" // This should also be an env var eventually
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
