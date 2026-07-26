// lib/scoringEngine.js

export function calculateScore(product) {
  let score = 100;
  const reasons = [];

  // Rules based on tags or attributes
  if (product.tags.includes('high_added_sugar')) {
    score -= 40;
    reasons.push({ type: 'negative', text: 'Very high added sugar', impact: -40 });
  } else if (product.tags.includes('added_sugar')) {
    score -= 15;
    reasons.push({ type: 'negative', text: 'Added sugar', impact: -15 });
  } else {
    reasons.push({ type: 'positive', text: 'No added sugar', impact: 0 });
  }

  if (product.tags.includes('high_sodium')) {
    score -= 20;
    reasons.push({ type: 'negative', text: 'High sodium', impact: -20 });
  }

  if (product.tags.includes('palm_oil')) {
    score -= 10;
    reasons.push({ type: 'negative', text: 'Contains palm oil', impact: -10 });
  }

  if (product.tags.includes('artificial_colors')) {
    score -= 10;
    reasons.push({ type: 'negative', text: 'Artificial colors', impact: -10 });
  } else {
    reasons.push({ type: 'positive', text: 'No artificial colors', impact: 0 });
  }

  if (product.tags.includes('artificial_flavors')) {
    score -= 10;
    reasons.push({ type: 'negative', text: 'Artificial flavors', impact: -10 });
  }

  if (product.tags.includes('refined_flour')) {
    score -= 15;
    reasons.push({ type: 'negative', text: 'Refined flour (maida)', impact: -15 });
  }

  if (product.tags.includes('preservatives')) {
    score -= 10;
    reasons.push({ type: 'negative', text: 'Preservatives', impact: -10 });
  }

  // Positive rules
  if (product.tags.includes('high_protein')) {
    score += 10;
    reasons.push({ type: 'positive', text: 'High protein', impact: 10 });
  } else if (product.tags.includes('low_protein')) {
    reasons.push({ type: 'negative', text: 'Low protein', impact: 0 });
  }

  if (product.tags.includes('high_fiber')) {
    score += 10;
    reasons.push({ type: 'positive', text: 'High fiber', impact: 10 });
  }

  if (product.tags.includes('whole_grain')) {
    score += 10;
    reasons.push({ type: 'positive', text: 'Whole grain', impact: 10 });
  }

  // Extreme penalties for completely empty calories (like Coca Cola)
  if (product.tags.includes('high_added_sugar') && product.tags.includes('low_protein') && !product.tags.includes('high_fiber')) {
    score -= 30;
    reasons.push({ type: 'negative', text: 'Empty calories (Sugar water)', impact: -30 });
  }

  // Ensure score stays within 0-100
  score = Math.max(0, Math.min(100, score));

  // Determine Grade
  let grade = 'F';
  let color = 'red';
  let colorHex = '#ef4444'; // Tailwind Red 500
  let summary = 'Avoid daily consumption';

  if (score >= 90) {
    grade = 'A';
    color = 'dark-green';
    colorHex = '#166534'; // Tailwind Green 800
    summary = 'Excellent for daily consumption';
  } else if (score >= 75) {
    grade = 'B';
    color = 'green';
    colorHex = '#22c55e'; // Tailwind Green 500
    summary = 'Good for daily consumption';
  } else if (score >= 60) {
    grade = 'C';
    color = 'yellow';
    colorHex = '#eab308'; // Tailwind Yellow 500
    summary = 'Consume in moderation';
  } else if (score >= 40) {
    grade = 'D';
    color = 'orange';
    colorHex = '#f97316'; // Tailwind Orange 500
    summary = 'Occasional treat only';
  }

  return {
    score,
    grade,
    color,
    colorHex,
    summary,
    reasons
  };
}
