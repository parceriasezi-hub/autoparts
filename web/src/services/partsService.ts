import { supabase } from '@/lib/supabaseClient';
import { PRODUCTS, PartProduct } from '@/data/partsData';

export interface DBOrderData {
  orderNumber: string;
  userEmail: string;
  customerName: string;
  phone: string;
  nif?: string;
  address: string;
  postalCode: string;
  city: string;
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  finalTotal: number;
  cartItems: {
    productId: string;
    productName: string;
    productSku: string;
    price: number;
    quantity: number;
  }[];
}

export interface SupabaseProductRow {
  id: string;
  name: string;
  category: 'travoes' | 'filtros' | 'oleos' | 'eletricidade';
  category_label: string;
  brand: string;
  price: number | string;
  original_price?: number | string | null;
  rating: number | string;
  reviews_count: number;
  sku: string;
  oe_number: string;
  in_stock: boolean;
  stock_count: number;
  image: string;
  description: string;
  specs?: Record<string, string>;
  compatible_vehicles?: { brandId: string; modelId: string; engine: string }[];
}

/**
 * Fetch all products or filter by query, category, brand
 */
export async function fetchProducts(filters?: {
  category?: string;
  brand?: string;
  query?: string;
}): Promise<PartProduct[]> {
  try {
    let query = supabase.from('products').select('*');

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.brand && filters.brand !== 'all') {
      query = query.eq('brand', filters.brand);
    }
    if (filters?.query) {
      query = query.or(`name.ilike.%${filters.query}%,sku.ilike.%${filters.query}%,oe_number.ilike.%${filters.query}%`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      console.warn('Supabase fetch query notice (using local fallback data):', error?.message || 'No DB items');
      return PRODUCTS;
    }

    return (data as SupabaseProductRow[]).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      categoryLabel: item.category_label,
      brand: item.brand,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      rating: Number(item.rating),
      reviewsCount: item.reviews_count,
      sku: item.sku,
      oeNumber: item.oe_number,
      inStock: item.in_stock,
      stockCount: item.stock_count,
      image: item.image,
      description: item.description,
      specs: item.specs || {},
      compatibleVehicles: item.compatible_vehicles || [],
    }));
  } catch (e) {
    console.error('Failed to query Supabase products', e);
    return PRODUCTS;
  }
}

/**
 * Create a new order in Supabase
 */
export async function saveOrderToSupabase(order: DBOrderData) {
  try {
    const orderId = `ord-${Date.now()}`;
    const { data: orderRow, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          id: orderId,
          order_number: order.orderNumber,
          user_email: order.userEmail,
          customer_name: order.customerName,
          phone: order.phone,
          nif: order.nif,
          address: order.address,
          postal_code: order.postalCode,
          city: order.city,
          shipping_method: order.shippingMethod,
          payment_method: order.paymentMethod,
          status: 'Expedida',
          subtotal: order.subtotal,
          shipping_cost: order.shippingCost,
          discount_amount: order.discountAmount,
          final_total: order.finalTotal,
        },
      ])
      .select();

    if (orderError) {
      console.warn('Supabase save order notice:', orderError.message);
      return { success: false, error: orderError.message };
    }

    // Insert order items
    const itemsRows = order.cartItems.map((item) => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order_id: orderId,
      product_id: item.productId,
      product_name: item.productName,
      product_sku: item.productSku,
      price: item.price,
      quantity: item.quantity,
    }));

    await supabase.from('order_items').insert(itemsRows);

    return { success: true, orderId, orderRow };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('Failed to save order to Supabase', e);
    return { success: false, error: message };
  }
}
