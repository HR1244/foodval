import styles from './ScoreDisplay.module.css';

export default function ScoreDisplay({ scoreData }) {
  const { grade, colorHex, score, summary } = scoreData;

  // Calculate the circumference and offset for the circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.container}>
      <div className={styles.scoreWrapper}>
        <svg
          className={styles.svgRing}
          width="120"
          height="120"
          viewBox="0 0 100 100"
        >
          {/* Background Ring */}
          <circle
            className={styles.bgRing}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="8"
          />
          {/* Progress Ring */}
          <circle
            className={styles.progressRing}
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            stroke={colorHex}
            style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
          />
        </svg>
        <div className={styles.gradeContainer}>
          <span className={styles.grade} style={{ color: colorHex }}>
            {grade}
          </span>
          <span className={styles.scoreValue}>{score}/100</span>
        </div>
      </div>
      <div className={styles.summaryContainer}>
        <h2 className={styles.summaryText} style={{ color: colorHex }}>
          {summary}
        </h2>
      </div>
    </div>
  );
}
