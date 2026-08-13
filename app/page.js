"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Camera, Loader2, Sparkles } from 'lucide-react';
import styles from './page.module.css';
import CameraCapture from '../components/CameraCapture';

export default function Home() {
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

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

  const handleAiSearch = async () => {
    if (!query.trim()) {
      setError('Please type a product name to search.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setIsAiSearching(true);
    setError('');

    try {
      const res = await fetch('/api/analyze-product-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName: query }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze product name');
      }

      const productData = await res.json();
      
      sessionStorage.setItem('scannedProduct', JSON.stringify(productData));
      router.push('/scan-results');
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error searching product. Please try again.');
      setIsAiSearching(false);
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

      <div className={styles.searchContainer}>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchBar}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for Maggi, Bournvita..."
              value={query}
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAiSearch();
              }}
            />
          </div>
          <button 
            className={styles.aiSearchButton}
            onClick={handleAiSearch}
            disabled={isAiSearching || !query.trim()}
            title="Generate nutrition info"
          >
            {isAiSearching ? <Loader2 size={20} className={styles.spinner} /> : <Sparkles size={20} />}
          </button>
        </div>
        
        <div className={styles.actionButtons}>
          <button 
            className={`${styles.scanButton} ${styles.aiButton}`}
            onClick={() => setShowCamera(true)}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 size={20} className={styles.spinner} />
            ) : (
              <Camera size={20} />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'Snap Food'}</span>
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.resultsContainer}>
        {!query && !isAnalyzing && (
          <div className={styles.demoSuggestions}>
            <p>Try searching for: <strong>Maggi</strong> or snap food!</p>
          </div>
        )}
      </div>

      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture} 
          onClose={() => setShowCamera(false)} 
        />
      )}
    </main>
  );
}
