"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { calculateScore } from '../../lib/scoringEngine';
import ScoreDisplay from '../../components/ScoreDisplay';
import ReasonList from '../../components/ReasonList';
import MockAd from '../../components/MockAd';
import styles from '../product/[id]/page.module.css'; // Reusing product page styles

export default function ScanResultsPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read from session storage
    const stored = sessionStorage.getItem('scannedProduct');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProduct(parsed);
      } catch (e) {
        console.error("Failed to parse scanned product");
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={styles.notFound}>
        <Loader2 className={styles.spinner} size={40} />
        <p>Loading results...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>No AI scan results found</h2>
        <p>It looks like you haven't scanned anything recently.</p>
        <Link href="/" className={styles.backLink}>Go back home</Link>
      </div>
    );
  }

  const scoreData = calculateScore(product);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          <ArrowLeft size={24} />
        </button>
        <span className={styles.headerTitle}>AI Scan Results</span>
      </header>

      <div className={styles.productHero}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} className={styles.image} />
        </div>
        <div className={styles.productInfo}>
          <span className={styles.brand}>{product.brand || "Unknown Brand"}</span>
          <h1 className={styles.name}>{product.name || "Unknown Product"}</h1>
        </div>
      </div>

      <ScoreDisplay scoreData={scoreData} />
      
      <ReasonList reasons={scoreData.reasons} />

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ingredients Detected</h3>
        <p className={styles.ingredients}>
          {product.ingredients?.length > 0 ? product.ingredients.join(', ') : "None detected"}
        </p>
      </div>

      {product.nutrition && Object.keys(product.nutrition).length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Nutrition Detected (per {product.nutrition.servingSize || "serving"})</h3>
          <div className={styles.nutritionGrid}>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Calories</span>
              <span className={styles.nutritionValue}>{product.nutrition.calories || "-"}</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Protein</span>
              <span className={styles.nutritionValue}>{product.nutrition.protein || "-"}</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Carbs</span>
              <span className={styles.nutritionValue}>{product.nutrition.carbs || "-"}</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Fat</span>
              <span className={styles.nutritionValue}>{product.nutrition.fat || "-"}</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Sugar</span>
              <span className={styles.nutritionValue}>{product.nutrition.sugar || "-"}</span>
            </div>
            <div className={styles.nutritionItem}>
              <span className={styles.nutritionLabel}>Sodium</span>
              <span className={styles.nutritionValue}>{product.nutrition.sodium || "-"}</span>
            </div>
          </div>
        </div>
      )}

      <MockAd />
    </main>
  );
}
