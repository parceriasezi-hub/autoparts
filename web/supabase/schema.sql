-- ==========================================================
-- AutoParts - Supabase PostgreSQL Database Schema & Seed Data
-- ==========================================================

-- 1. Table: products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  rating NUMERIC(3, 1) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  sku TEXT UNIQUE NOT NULL,
  oe_number TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  stock_count INT DEFAULT 10,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  specs JSONB DEFAULT '{}'::jsonb,
  compatible_vehicles JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: vehicles (A Minha Garagem)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  brand_id TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  model_id TEXT NOT NULL,
  model_name TEXT NOT NULL,
  engine TEXT NOT NULL,
  plate TEXT,
  nickname TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  nif TEXT,
  address TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  city TEXT NOT NULL,
  shipping_method TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'Expedida' NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  final_total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table: order_items
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INT DEFAULT 1 NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

-- Seed Initial Products
INSERT INTO public.products (id, name, category, category_label, brand, price, original_price, rating, reviews_count, sku, oe_number, in_stock, stock_count, image, description, specs, compatible_vehicles)
VALUES 
(
  'brembo-p85126',
  'Jogo de Pastilhas de Travão Dianteiro',
  'travoes',
  'Travões',
  'Brembo',
  42.90,
  59.90,
  4.9,
  128,
  'P 85 126',
  '5Q0 698 151',
  true,
  18,
  'https://images.unsplash.com/photo-1600706432522-67756f743c3d?q=80&w=600&auto=format&fit=crop',
  'Jogo de 4 pastilhas de travão de disco para eixo dianteiro. Com contacto de aviso de desgaste integrado. Alta eficiência de travagem.',
  '{"Largura": "160.2 mm", "Altura": "64.5 mm", "Espessura": "20.4 mm"}'::jsonb,
  '[{"brandId": "audi", "modelId": "a3", "engine": "2.0 TDI (150 CV)"}, {"brandId": "vw", "modelId": "golf", "engine": "2.0 TDI (150 CV)"}]'::jsonb
),
(
  'mann-filter-hu7008z',
  'Filtro de Óleo Mann-Filter',
  'filtros',
  'Filtros',
  'Mann-Filter',
  11.40,
  15.90,
  5.0,
  215,
  'HU 7008 z',
  '03N 115 562 B',
  true,
  45,
  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600&auto=format&fit=crop',
  'Filtro de óleo cartucho com vedantes. Filtração superior e máxima proteção para o motor contra impurezas.',
  '{"Diâmetro Exterior": "65 mm", "Altura": "101 mm"}'::jsonb,
  '[{"brandId": "audi", "modelId": "a3", "engine": "2.0 TDI (150 CV)"}, {"brandId": "vw", "modelId": "passat", "engine": "2.0 TDI (150 CV)"}]'::jsonb
),
(
  'castrol-edge-5w30-ll',
  'Óleo de Motor Castrol EDGE 5W-30 LL (5 Litros)',
  'oleos',
  'Óleos e Fluidos',
  'Castrol',
  46.90,
  65.00,
  4.9,
  430,
  '15669E',
  'VW 504 00 / 507 00',
  true,
  50,
  'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
  'Castrol EDGE 5W-30 LL com Fluid TITANIUM transforma-se para ser mais forte sob pressão e reduz o atrito.',
  '{"Viscosidade": "SAE 5W-30", "Capacidade": "5 Litros"}'::jsonb,
  '[{"brandId": "audi", "modelId": "a4", "engine": "2.0 TDI (190 CV)"}, {"brandId": "bmw", "modelId": "serie3", "engine": "320d (190 CV)"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
