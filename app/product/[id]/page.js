import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductById } from '../../../lib/mockDatabase';
import { calculateScore } from '../../../lib/scoringEngine';
import ScoreDisplay from '../../../components/ScoreDisplay';
import ReasonList from '../../../components/ReasonList';
import ProductCard from '../../../components/ProductCard';
import MockAd from '../../../components/MockAd';
import styles from './page.module.css';

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Link href="/" className={styles.backLink}>Go back home</Link>
      </div>
    );
  }

  const scoreData = calculateScore(product);
  
  // Get alternative products based on IDs
  const alternatives = product.alternatives
    .map(altId => getProductById(altId))
    .filter(Boolean);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={24} />
        </Link>
        <span className={styles.headerTitle}>Product Details</span>
      </header>

      <div className={styles.productHero}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} className={styles.image} />
        </div>
        <div className={styles.productInfo}>
          <span className={styles.brand}>{product.brand}</span>
          <h1 className={styles.name}>{product.name}</h1>
        </div>
      </div>

      <ScoreDisplay scoreData={scoreData} />
      
      <ReasonList reasons={scoreData.reasons} />

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ingredients</h3>
        <p className={styles.ingredients}>
          {product.ingredients.join(', ')}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Nutrition (per {product.nutrition.servingSize})</h3>
        <div className={styles.nutritionGrid}>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Calories</span>
            <span className={styles.nutritionValue}>{product.nutrition.calories}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Protein</span>
            <span className={styles.nutritionValue}>{product.nutrition.protein}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Carbs</span>
            <span className={styles.nutritionValue}>{product.nutrition.carbs}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Fat</span>
            <span className={styles.nutritionValue}>{product.nutrition.fat}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Sugar</span>
            <span className={styles.nutritionValue}>{product.nutrition.sugar}</span>
          </div>
          <div className={styles.nutritionItem}>
            <span className={styles.nutritionLabel}>Sodium</span>
            <span className={styles.nutritionValue}>{product.nutrition.sodium}</span>
          </div>
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Healthier Alternatives</h3>
          <div className={styles.alternativesList}>
            {alternatives.map(alt => (
              <ProductCard key={alt.id} product={alt} />
            ))}
          </div>
        </div>
      )}

      <MockAd />
    </main>
  );
}
