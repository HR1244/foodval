import { CheckCircle2, XCircle } from 'lucide-react';
import styles from './ReasonList.module.css';

export default function ReasonList({ reasons }) {
  if (!reasons || reasons.length === 0) return null;

  // Sort reasons: negative first (highest impact), then positive
  const sortedReasons = [...reasons].sort((a, b) => a.impact - b.impact);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Why this score?</h3>
      <ul className={styles.list}>
        {sortedReasons.map((reason, index) => {
          const isPositive = reason.type === 'positive';
          return (
            <li key={index} className={`${styles.listItem} ${isPositive ? styles.positiveItem : styles.negativeItem}`}>
              <div className={styles.iconContainer}>
                {isPositive ? (
                  <CheckCircle2 size={20} color="#16a34a" /> // Green 600
                ) : (
                  <XCircle size={20} color="#dc2626" /> // Red 600
                )}
              </div>
              <span className={styles.text}>{reason.text}</span>
              {reason.impact !== 0 && (
                <span className={styles.impact}>
                  {reason.impact > 0 ? `+${reason.impact}` : reason.impact}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
