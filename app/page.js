"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2 } from 'lucide-react';
import styles from './page.module.css';
import CameraCapture from '../components/CameraCapture';

export default function Home() {
  const router = useRouter();
  
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const handleCameraCapture = async (base64Data) => {
    setShowCamera(false);
    setIsAnalyzing(true);
    setError('');

    try {
      const res = await fetch('/api/analyze-label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: base64Data }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze image');
      }

      const productData = await res.json();
      
      // Store the result in sessionStorage to pass it to the results page
      sessionStorage.setItem('scannedProduct', JSON.stringify(productData));
      router.push('/scan-results');
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error analyzing label. Please try again.');
      setIsAnalyzing(false);
    }
  };



  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Eat <span className={styles.highlight}>Better</span>
        </h1>
        <p className={styles.subtitle}>
          Scan any packaged food to reveal its true health score.
        </p>
      </div>

      <div className={styles.searchContainer} style={{ justifyContent: 'center' }}>
        <div className={styles.actionButtons} style={{ width: '100%', maxWidth: '400px' }}>
          <button 
            className={`${styles.scanButton} ${styles.aiButton}`}
            style={{ width: '100%', padding: '20px', fontSize: '1.2rem' }}
            onClick={() => setShowCamera(true)}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 size={24} className={styles.spinner} />
            ) : (
              <Camera size={24} />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'Snap Food'}</span>
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture} 
          onClose={() => setShowCamera(false)} 
        />
      )}
    </main>
  );
}
