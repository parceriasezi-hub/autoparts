import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ifzbvpioigzajtjwzsvc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmemJ2cGlvaWd6YWp0and6c3ZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTg3MzUwMSwiZXhwIjoyMTAxNDQ5NTAxfQ.YabVEy_bS8euO_VgrKSHj047qpWHwOrEU6qW_XoMeZE';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PRODUCTS = [
  {
    id: 'brembo-p85126',
    name: 'Jogo de Pastilhas de Travão Dianteiro',
    category: 'travoes',
    category_label: 'Travões',
    brand: 'Brembo',
    price: 42.90,
    original_price: 59.90,
    rating: 4.9,
    reviews_count: 128,
    sku: 'P 85 126',
    oe_number: '5Q0 698 151',
    in_stock: true,
    stock_count: 18,
    image: 'https://images.unsplash.com/photo-1600706432522-67756f743c3d?q=80&w=600&auto=format&fit=crop',
    description: 'Jogo de 4 pastilhas de travão de disco para eixo dianteiro. Com contacto de aviso de desgaste integrado. Alta eficiência de travagem.',
    specs: { Largura: '160.2 mm', Altura: '64.5 mm', Espessura: '20.4 mm' },
    compatible_vehicles: [{ brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' }, { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' }]
  },
  {
    id: 'mann-filter-hu7008z',
    name: 'Filtro de Óleo Mann-Filter',
    category: 'filtros',
    category_label: 'Filtros',
    brand: 'Mann-Filter',
    price: 11.40,
    original_price: 15.90,
    rating: 5.0,
    reviews_count: 215,
    sku: 'HU 7008 z',
    oe_number: '03N 115 562 B',
    in_stock: true,
    stock_count: 45,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600&auto=format&fit=crop',
    description: 'Filtro de óleo cartucho com vedantes. Filtração superior e máxima proteção para o motor contra impurezas.',
    specs: { 'Diâmetro Exterior': '65 mm', Altura: '101 mm' },
    compatible_vehicles: [{ brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' }, { brandId: 'vw', modelId: 'passat', engine: '2.0 TDI (150 CV)' }]
  },
  {
    id: 'castrol-edge-5w30-ll',
    name: 'Óleo de Motor Castrol EDGE 5W-30 LL (5 Litros)',
    category: 'oleos',
    category_label: 'Óleos e Fluidos',
    brand: 'Castrol',
    price: 46.90,
    original_price: 65.00,
    rating: 4.9,
    reviews_count: 430,
    sku: '15669E',
    oe_number: 'VW 504 00 / 507 00',
    in_stock: true,
    stock_count: 50,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
    description: 'Castrol EDGE 5W-30 LL com Fluid TITANIUM transforma-se para ser mais forte sob pressão e reduz o atrito.',
    specs: { Viscosidade: 'SAE 5W-30', Capacidade: '5 Litros' },
    compatible_vehicles: [{ brandId: 'audi', modelId: 'a4', engine: '2.0 TDI (190 CV)' }, { brandId: 'bmw', modelId: 'serie3', engine: '320d (190 CV)' }]
  }
];

async function seed() {
  console.log('Seeding products to Supabase...');
  const { error } = await supabase.from('products').upsert(PRODUCTS);
  if (error) {
    console.error('Error seeding products:', error.message);
    console.log('\nTIP: Make sure to execute the SQL schema in Supabase SQL Editor first!');
  } else {
    console.log('Products successfully seeded to Supabase!');
  }
}

seed();
