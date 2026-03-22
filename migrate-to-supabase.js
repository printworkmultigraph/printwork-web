import { products } from './src/data/products.js';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// To run this: 
// 1. Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
// 2. node migrate-to-supabase.js

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function migrate() {
  console.log('--- MIGRATING TO SUPABASE ---');

  // 1. Create table if not exists (You should do this in Supabase SQL Editor if this fails)
  // Actually, client SDK can't easily create tables. 
  // I'll assume the user has a table 'products'.

  for (const product of products) {
    const { error } = await supabase
      .from('products')
      .upsert({
        ...product,
        // Ensure price is number
        price: Number(product.price)
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`Error migrating ${product.name}:`, error.message);
    } else {
      console.log(`Migrated: ${product.name}`);
    }
  }

  console.log('--- COMPLETED ---');
}

migrate();
