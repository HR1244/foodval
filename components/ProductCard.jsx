import Link from 'next/link';
import { calculateScore } from '../lib/scoringEngine';
import styles from './ProductCard.module.css';
import { ChevronRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const { grade, colorHex } = calculateScore(product);

  return (
    <Link href={`/product/${product.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </div>
      
      <div className={styles.details}>
        <div className={styles.header}>
          <span className={styles.brand}>{product.brand}</span>
          <div 
            className={styles.gradeBadge} 
            style={{ backgroundColor: colorHex }}
          >
            {grade}
          </div>
        </div>
        <h3 className={styles.name}>{product.name}</h3>
      </div>
      
      <div className={styles.action}>
        <ChevronRight size={20} color="#9ca3af" />
      </div>
    </Link>
  );
}
