import { supabase } from '@/lib/supabaseClient';
import { PRODUCTS, PartProduct } from '@/data/partsData';

export interface DBOrderData {
  id?: string;
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
  status?: string;
  createdAt?: string;
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
      // Local storage fallback / overlay check
      if (typeof window !== 'undefined') {
        const localOverride = localStorage.getItem('autoparts_admin_products');
        if (localOverride) {
          try {
            let list: PartProduct[] = JSON.parse(localOverride);
            if (filters?.category && filters.category !== 'all') {
              list = list.filter((p) => p.category === filters.category);
            }
            if (filters?.brand && filters.brand !== 'all') {
              list = list.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
            }
            if (filters?.query) {
              const q = filters.query.toLowerCase();
              list = list.filter(
                (p) =>
                  p.name.toLowerCase().includes(q) ||
                  p.sku.toLowerCase().includes(q) ||
                  p.oeNumber.toLowerCase().includes(q)
              );
            }
            return list;
          } catch {
            // pass
          }
        }
      }
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
 * Save product (Create or Edit)
 */
export async function saveProduct(product: PartProduct): Promise<{ success: boolean; error?: string }> {
  try {
    const row = {
      id: product.id,
      name: product.name,
      category: product.category,
      category_label: product.categoryLabel,
      brand: product.brand,
      price: product.price,
      original_price: product.originalPrice || null,
      rating: product.rating || 5.0,
      reviews_count: product.reviewsCount || 1,
      sku: product.sku,
      oe_number: product.oeNumber,
      in_stock: product.inStock,
      stock_count: product.stockCount,
      image: product.image,
      description: product.description,
      specs: product.specs || {},
      compatible_vehicles: product.compatibleVehicles || [],
    };

    const { error } = await supabase.from('products').upsert([row]);
    if (error) {
      console.warn('Supabase product save warning, persisting to localStorage:', error.message);
    }
  } catch (e) {
    console.warn('Supabase product save exception, using localStorage fallback');
  }

  // Always update local storage cache for smooth admin UI
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_products');
    let currentList: PartProduct[] = stored ? JSON.parse(stored) : [...PRODUCTS];
    const index = currentList.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      currentList[index] = product;
    } else {
      currentList.unshift(product);
    }
    localStorage.setItem('autoparts_admin_products', JSON.stringify(currentList));
  }

  return { success: true };
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.warn('Supabase product delete warning:', error.message);
    }
  } catch (e) {
    console.warn('Supabase delete exception');
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_products');
    let currentList: PartProduct[] = stored ? JSON.parse(stored) : [...PRODUCTS];
    currentList = currentList.filter((p) => p.id !== productId);
    localStorage.setItem('autoparts_admin_products', JSON.stringify(currentList));
  }

  return { success: true };
}

/**
 * Fetch all orders for Admin
 */
export async function fetchOrders(): Promise<DBOrderData[]> {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        orderNumber: row.order_number,
        userEmail: row.user_email,
        customerName: row.customer_name,
        phone: row.phone,
        nif: row.nif,
        address: row.address,
        postalCode: row.postal_code,
        city: row.city,
        shippingMethod: row.shipping_method,
        paymentMethod: row.payment_method,
        status: row.status || 'Expedida',
        createdAt: row.created_at || new Date().toISOString(),
        subtotal: Number(row.subtotal),
        shippingCost: Number(row.shipping_cost),
        discountAmount: Number(row.discount_amount),
        finalTotal: Number(row.final_total),
        cartItems: [],
      }));
    }
  } catch (e) {
    console.warn('Supabase fetch orders exception');
  }

  // Local storage fallback
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_orders');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // pass
      }
    }
  }

  // Initial mock orders if none exist
  const mockOrders: DBOrderData[] = [
    {
      id: 'ord-1001',
      orderNumber: 'AP-982401',
      customerName: 'Manuel Silva',
      userEmail: 'manuel.silva@gmail.com',
      phone: '912 345 678',
      nif: '234567890',
      address: 'Rua de Camões 142, 2º Dto',
      postalCode: '4000-140',
      city: 'Porto',
      shippingMethod: 'Entrega Expressa CTT (24h/48h)',
      paymentMethod: 'MB WAY',
      status: 'Em Processamento',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      subtotal: 124.9,
      shippingCost: 0,
      discountAmount: 0,
      finalTotal: 124.9,
      cartItems: [
        { productId: 'brembo-p85126', productName: 'Jogo de Pastilhas de Travão Brembo P85126', productSku: 'P85126', price: 42.9, quantity: 1 },
        { productId: 'castrol-edge-5w30-5l', productName: 'Óleo de Motor Castrol EDGE 5W-30 LL (5L)', productSku: '15669E', price: 48.9, quantity: 1 }
      ]
    },
    {
      id: 'ord-1002',
      orderNumber: 'AP-982400',
      customerName: 'Ana Sofia Martins',
      userEmail: 'ana.martins@outlook.pt',
      phone: '965 890 123',
      nif: '198765432',
      address: 'Av. da Liberdade 85',
      postalCode: '1250-140',
      city: 'Lisboa',
      shippingMethod: 'Entrega Normal CTT (48h/72h)',
      paymentMethod: 'Multibanco',
      status: 'Entregue',
      createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      subtotal: 119.0,
      shippingCost: 0,
      discountAmount: 10,
      finalTotal: 109.0,
      cartItems: [
        { productId: 'bosch-s5-008', productName: 'Bateria Automóvel Bosch S5 008 (77Ah)', productSku: '000915105DG', price: 119.0, quantity: 1 }
      ]
    }
  ];

  return mockOrders;
}

/**
 * Update Order status
 */
export async function updateOrderStatus(orderId: string, newStatus: string): Promise<{ success: boolean }> {
  try {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  } catch (e) {
    console.warn('Supabase update order status exception');
  }

  if (typeof window !== 'undefined') {
    const orders = await fetchOrders();
    const updated = orders.map((ord) => (ord.id === orderId || ord.orderNumber === orderId ? { ...ord, status: newStatus } : ord));
    localStorage.setItem('autoparts_admin_orders', JSON.stringify(updated));
  }

  return { success: true };
}

/**
 * Create a new order in Supabase & LocalStorage
 */
export async function saveOrderToSupabase(order: DBOrderData) {
  const orderId = `ord-${Date.now()}`;
  const completeOrder: DBOrderData = {
    ...order,
    id: orderId,
    status: order.status || 'Pendente',
    createdAt: new Date().toISOString()
  };

  try {
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
          status: completeOrder.status,
          subtotal: order.subtotal,
          shipping_cost: order.shippingCost,
          discount_amount: order.discountAmount,
          final_total: order.finalTotal,
        },
      ])
      .select();

    if (!orderError) {
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
    }
  } catch (e: unknown) {
    console.error('Failed to save order to Supabase', e);
  }

  // Save to local storage for instant feedback
  if (typeof window !== 'undefined') {
    const existingOrders = await fetchOrders();
    existingOrders.unshift(completeOrder);
    localStorage.setItem('autoparts_admin_orders', JSON.stringify(existingOrders));
  }

  return { success: true, orderId };
}
