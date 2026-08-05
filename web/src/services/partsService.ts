import { supabase } from '@/lib/supabaseClient';
import {
  PRODUCTS,
  PartProduct,
  CategoryItem,
  CouponItem,
  CustomerItem,
  RoleDefinition,
  AdminUser,
  StoreSettings,
  PermissionKey,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_ROLES,
  INITIAL_ADMIN_USERS,
  INITIAL_STORE_SETTINGS
} from '@/data/partsData';

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

/* ==========================================================================
   Category Services
   ========================================================================== */
export async function fetchCategories(): Promise<CategoryItem[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_categories');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // pass
      }
    }
  }
  return INITIAL_CATEGORIES;
}

export async function saveCategory(category: CategoryItem): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchCategories();
    const idx = current.findIndex((c) => c.id === category.id || c.slug === category.slug);
    if (idx >= 0) {
      current[idx] = category;
    } else {
      current.push(category);
    }
    localStorage.setItem('autoparts_admin_categories', JSON.stringify(current));
  }
  return { success: true };
}

export async function deleteCategory(id: string): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchCategories();
    const filtered = current.filter((c) => c.id !== id);
    localStorage.setItem('autoparts_admin_categories', JSON.stringify(filtered));
  }
  return { success: true };
}

/* ==========================================================================
   Coupon & Promotion Services
   ========================================================================== */
export async function fetchCoupons(): Promise<CouponItem[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_coupons');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // pass
      }
    }
  }
  return INITIAL_COUPONS;
}

export async function saveCoupon(coupon: CouponItem): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchCoupons();
    const idx = current.findIndex((c) => c.id === coupon.id || c.code.toUpperCase() === coupon.code.toUpperCase());
    if (idx >= 0) {
      current[idx] = coupon;
    } else {
      current.unshift(coupon);
    }
    localStorage.setItem('autoparts_admin_coupons', JSON.stringify(current));
  }
  return { success: true };
}

export async function deleteCoupon(id: string): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchCoupons();
    const filtered = current.filter((c) => c.id !== id);
    localStorage.setItem('autoparts_admin_coupons', JSON.stringify(filtered));
  }
  return { success: true };
}

export async function validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discountAmount: number; message: string }> {
  const coupons = await fetchCoupons();
  const found = coupons.find((c) => c.code.trim().toUpperCase() === code.trim().toUpperCase() && c.active);

  if (!found) {
    return { valid: false, discountAmount: 0, message: 'Cupão inválido ou expirado.' };
  }

  if (subtotal < found.minSubtotal) {
    return { valid: false, discountAmount: 0, message: `Este cupão exige um subtotal mínimo de ${found.minSubtotal.toFixed(2)} €.` };
  }

  let discount = 0;
  if (found.discountType === 'percent') {
    discount = (subtotal * found.discountValue) / 100;
  } else {
    discount = found.discountValue;
  }

  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    discountAmount: Number(discount.toFixed(2)),
    message: `Cupão "${found.code}" aplicado com sucesso!`
  };
}

/* ==========================================================================
   Customer Services
   ========================================================================== */
export async function fetchCustomers(): Promise<CustomerItem[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_customers');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // pass
      }
    }
  }
  return INITIAL_CUSTOMERS;
}

export async function saveCustomer(customer: CustomerItem): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchCustomers();
    const idx = current.findIndex((c) => c.id === customer.id || c.email === customer.email);
    if (idx >= 0) {
      current[idx] = customer;
    } else {
      current.unshift(customer);
    }
    localStorage.setItem('autoparts_admin_customers', JSON.stringify(current));
  }
  return { success: true };
}

export async function toggleCustomerStatus(id: string): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchCustomers();
    const updated = current.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? ('suspended' as const) : ('active' as const) } : c));
    localStorage.setItem('autoparts_admin_customers', JSON.stringify(updated));
  }
  return { success: true };
}

/* ==========================================================================
   RBAC Roles & Admin Users Services
   ========================================================================== */
export async function fetchRoles(): Promise<RoleDefinition[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_roles');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // pass
      }
    }
  }
  return INITIAL_ROLES;
}

export async function saveRole(role: RoleDefinition): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchRoles();
    const idx = current.findIndex((r) => r.id === role.id);
    if (idx >= 0) {
      current[idx] = role;
    } else {
      current.push(role);
    }
    localStorage.setItem('autoparts_admin_roles', JSON.stringify(current));
  }
  return { success: true };
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // pass
      }
    }
  }
  return INITIAL_ADMIN_USERS;
}

export async function saveAdminUser(user: AdminUser): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchAdminUsers();
    const idx = current.findIndex((u) => u.id === user.id || u.email === user.email);
    if (idx >= 0) {
      current[idx] = user;
    } else {
      current.push(user);
    }
    localStorage.setItem('autoparts_admin_users', JSON.stringify(current));
  }
  return { success: true };
}

export async function deleteAdminUser(id: string): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    const current = await fetchAdminUsers();
    const filtered = current.filter((u) => u.id !== id);
    localStorage.setItem('autoparts_admin_users', JSON.stringify(filtered));
  }
  return { success: true };
}

export function hasPermission(role: RoleDefinition | null, permission: PermissionKey): boolean {
  if (!role) return false;
  if (role.id === 'super_admin' || role.permissions.includes('products:read') && role.permissions.length >= 10) {
    return true;
  }
  return role.permissions.includes(permission);
}

/* ==========================================================================
   Store Settings Services
   ========================================================================== */
export async function fetchStoreSettings(): Promise<StoreSettings> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('autoparts_admin_settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // pass
      }
    }
  }
  return INITIAL_STORE_SETTINGS;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<{ success: boolean }> {
  if (typeof window !== 'undefined') {
    localStorage.setItem('autoparts_admin_settings', JSON.stringify(settings));
  }
  return { success: true };
}

