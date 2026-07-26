// lib/mockDatabase.js

export const products = [
  {
    id: 'maggi-noodles',
    barcode: '8901058812604', // Generic mock barcode
    name: 'Maggi 2-Minute Noodles',
    brand: 'Nestle',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=300&auto=format&fit=crop', // Placeholder noodle image
    ingredients: [
      'Refined Wheat Flour (Maida)',
      'Palm Oil',
      'Salt',
      'Wheat Gluten',
      'Mineral (Calcium Carbonate)',
      'Thickeners (508 & 412)',
      'Acidity Regulators (501(i) & 500(i))',
      'Humectant (451(i))',
    ],
    nutrition: {
      servingSize: '70g',
      calories: 318,
      protein: '5.6g',
      fat: '11.8g',
      carbs: '44.8g',
      sodium: '831.6mg',
      sugar: '1.2g'
    },
    tags: ['refined_flour', 'palm_oil', 'high_sodium', 'preservatives', 'low_protein'],
    alternatives: ['whole-wheat-noodles', 'millet-noodles']
  },
  {
    id: 'whole-wheat-noodles',
    barcode: '8901234567890',
    name: 'Slurrp Farm Millet Noodles',
    brand: 'Slurrp Farm',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=300&auto=format&fit=crop', 
    ingredients: [
      'Supergrain Blend (Foxtail Millet, Little Millet, Kodo Millet, Barnyard Millet)',
      'Whole Wheat Flour',
      'Salt'
    ],
    nutrition: {
      servingSize: '70g',
      calories: 250,
      protein: '8.5g',
      fat: '2.1g',
      carbs: '48g',
      sodium: '200mg',
      sugar: '0g'
    },
    tags: ['whole_grain', 'high_fiber', 'high_protein'],
    alternatives: []
  },
  {
    id: 'bournvita',
    barcode: '8901058812605',
    name: 'Bournvita Health Drink',
    brand: 'Cadbury',
    image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=300&auto=format&fit=crop',
    ingredients: [
      'Cereal Extract',
      'Sugar',
      'Cocoa Solids',
      'Milk Solids',
      'Liquid Glucose',
      'Emulsifiers',
      'Artificial Flavors'
    ],
    nutrition: {
      servingSize: '20g',
      calories: 78,
      protein: '1.4g',
      fat: '0.4g',
      carbs: '17g',
      sodium: '35mg',
      sugar: '14g' // High sugar per serving
    },
    tags: ['high_added_sugar', 'artificial_flavors', 'low_protein'],
    alternatives: ['pure-cocoa-powder']
  }
];

export function getProductById(id) {
  return products.find(p => p.id === id);
}

export function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || 
    p.brand.toLowerCase().includes(lowerQuery)
  );
}

export function getProductByBarcode(barcode) {
  return products.find(p => p.barcode === barcode);
}
