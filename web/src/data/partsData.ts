export interface VehicleBrand {
  id: string;
  name: string;
  models: {
    id: string;
    name: string;
    engines: string[];
  }[];
}

export interface PartProduct {
  id: string;
  name: string;
  category: 'travoes' | 'filtros' | 'oleos' | 'eletricidade';
  categoryLabel: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  sku: string;
  oeNumber: string;
  inStock: boolean;
  stockCount: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  compatibleVehicles: {
    brandId: string;
    modelId: string;
    engine: string;
  }[];
}

export const VEHICLE_BRANDS: VehicleBrand[] = [
  {
    id: 'audi',
    name: 'Audi',
    models: [
      { id: 'a3', name: 'A3 (8V / 8Y)', engines: ['1.6 TDI (116 CV)', '2.0 TDI (150 CV)', '1.5 TFSI (150 CV)'] },
      { id: 'a4', name: 'A4 Avant (B8 / B9)', engines: ['2.0 TDI (190 CV)', '2.0 TFSI (252 CV)', '3.0 TDI (272 CV)'] },
      { id: 'a6', name: 'A6 (C7 / C8)', engines: ['2.0 TDI (204 CV)', '3.0 TDI (286 CV)'] },
      { id: 'q5', name: 'Q5 (FY)', engines: ['2.0 TDI (190 CV)', '2.0 TFSI (252 CV)'] },
    ]
  },
  {
    id: 'bmw',
    name: 'BMW',
    models: [
      { id: 'serie3', name: 'Série 3 (F30 / G20)', engines: ['320d (190 CV)', '330i (258 CV)', '318d (150 CV)'] },
      { id: 'serie1', name: 'Série 1 (F20 / F40)', engines: ['116d (116 CV)', '118d (150 CV)', '120d (190 CV)'] },
      { id: 'serie5', name: 'Série 5 (F10 / G30)', engines: ['520d (190 CV)', '530d (265 CV)'] },
      { id: 'x3', name: 'X3 (F25 / G01)', engines: ['xDrive20d (190 CV)', 'xDrive30d (265 CV)'] },
    ]
  },
  {
    id: 'mercedes',
    name: 'Mercedes-Benz',
    models: [
      { id: 'classe-a', name: 'Classe A (W176 / W177)', engines: ['A 180 d (116 CV)', 'A 200 (163 CV)', 'A 220 d (190 CV)'] },
      { id: 'classe-c', name: 'Classe C (W205 / W206)', engines: ['C 200 d (160 CV)', 'C 220 d (200 CV)', 'C 300 e (313 CV)'] },
      { id: 'classe-e', name: 'Classe E (W213)', engines: ['E 220 d (194 CV)', 'E 300 d (245 CV)'] },
      { id: 'glc', name: 'GLC SUV (X253)', engines: ['220 d 4MATIC (194 CV)', '300 d 4MATIC (245 CV)'] },
    ]
  },
  {
    id: 'vw',
    name: 'Volkswagen',
    models: [
      { id: 'golf', name: 'Golf (VII / VIII)', engines: ['1.6 TDI (115 CV)', '2.0 TDI (150 CV)', '1.5 TSI (150 CV)'] },
      { id: 'passat', name: 'Passat Variant (B8)', engines: ['2.0 TDI (150 CV)', '2.0 TDI (190 CV)', '1.4 TSI GTE (218 CV)'] },
      { id: 'polo', name: 'Polo (AW1)', engines: ['1.0 TSI (95 CV)', '1.6 TDI (95 CV)'] },
      { id: 'tiguan', name: 'Tiguan (AD1)', engines: ['2.0 TDI (150 CV)', '2.0 TDI (190 CV)'] },
    ]
  }
];

export const PRODUCTS: PartProduct[] = [
  {
    id: 'brembo-p85126',
    name: 'Jogo de Pastilhas de Travão Dianteiro',
    category: 'travoes',
    categoryLabel: 'Travões',
    brand: 'Brembo',
    price: 42.90,
    originalPrice: 59.90,
    rating: 4.9,
    reviewsCount: 128,
    sku: 'P 85 126',
    oeNumber: '5Q0 698 151',
    inStock: true,
    stockCount: 18,
    image: 'https://images.unsplash.com/photo-1600706432522-67756f743c3d?q=80&w=600&auto=format&fit=crop',
    description: 'Jogo de 4 pastilhas de travão de disco para eixo dianteiro. Com contacto de aviso de desgaste integrado. Alta eficiência de travagem e reduzida emissão de poeiras.',
    specs: {
      'Largura': '160.2 mm',
      'Altura': '64.5 mm',
      'Espessura': '20.4 mm',
      'Sistema de Travagem': 'Teves / ATE',
      'Contacto de Aviso': 'Com aviso de desgaste elétrico'
    },
    compatibleVehicles: [
      { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' },
      { brandId: 'audi', modelId: 'a3', engine: '1.6 TDI (116 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '1.6 TDI (115 CV)' },
      { brandId: 'vw', modelId: 'passat', engine: '2.0 TDI (150 CV)' },
    ]
  },
  {
    id: 'brembo-disco-09977211',
    name: 'Disco de Travão Dianteiro Ventilado (Par)',
    category: 'travoes',
    categoryLabel: 'Travões',
    brand: 'Brembo',
    price: 78.50,
    originalPrice: 99.00,
    rating: 4.8,
    reviewsCount: 94,
    sku: '09.9772.11',
    oeNumber: '1K0 615 301 AA',
    inStock: true,
    stockCount: 12,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
    description: 'Discos de travão de alta performance com revestimento anti-corrosão UV. Arrefecimento otimizado para máxima durabilidade.',
    specs: {
      'Diâmetro Exterior': '312 mm',
      'Espessura': '25 mm',
      'Espessura Mínima': '22 mm',
      'Número de Furos': '5',
      'Tipo de Disco': 'Ventilado'
    },
    compatibleVehicles: [
      { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' },
      { brandId: 'audi', modelId: 'a4', engine: '2.0 TDI (190 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'tiguan', engine: '2.0 TDI (150 CV)' },
    ]
  },
  {
    id: 'mann-filter-hu7008z',
    name: 'Filtro de Óleo Mann-Filter',
    category: 'filtros',
    categoryLabel: 'Filtros',
    brand: 'Mann-Filter',
    price: 11.40,
    originalPrice: 15.90,
    rating: 5.0,
    reviewsCount: 215,
    sku: 'HU 7008 z',
    oeNumber: '03N 115 562 B',
    inStock: true,
    stockCount: 45,
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=600&auto=format&fit=crop',
    description: 'Filtro de óleo cartucho com vedantes. Filtração superior e máxima proteção para o motor contra impurezas e partículas.',
    specs: {
      'Diâmetro Exterior': '65 mm',
      'Diâmetro Interior': '26 mm',
      'Altura': '101 mm',
      'Artigo Complementar': 'Com junta de vedação'
    },
    compatibleVehicles: [
      { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' },
      { brandId: 'audi', modelId: 'a4', engine: '2.0 TDI (190 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'passat', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'polo', engine: '1.6 TDI (95 CV)' },
    ]
  },
  {
    id: 'bosch-filtro-ar-s0283',
    name: 'Filtro de Ar Bosch',
    category: 'filtros',
    categoryLabel: 'Filtros',
    brand: 'Bosch',
    price: 14.80,
    originalPrice: 21.00,
    rating: 4.7,
    reviewsCount: 86,
    sku: 'F 026 400 283',
    oeNumber: '5Q0 129 620 D',
    inStock: true,
    stockCount: 30,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop',
    description: 'Filtro de ar do motor de elevada capacidade de retenção de poeiras e humidade. Garante uma mistura ar-combustível perfeita.',
    specs: {
      'Comprimento': '292 mm',
      'Largura': '177 mm',
      'Altura': '70 mm'
    },
    compatibleVehicles: [
      { brandId: 'audi', modelId: 'a3', engine: '1.5 TFSI (150 CV)' },
      { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '1.5 TSI (150 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' },
    ]
  },
  {
    id: 'castrol-edge-5w30-ll',
    name: 'Óleo de Motor Castrol EDGE 5W-30 LL (5 Litros)',
    category: 'oleos',
    categoryLabel: 'Óleos e Fluidos',
    brand: 'Castrol',
    price: 46.90,
    originalPrice: 65.00,
    rating: 4.9,
    reviewsCount: 430,
    sku: '15669E',
    oeNumber: 'VW 504 00 / 507 00',
    inStock: true,
    stockCount: 50,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
    description: 'Castrol EDGE 5W-30 LL com Fluid TITANIUM transforma-se para ser mais forte sob pressão e reduz o atrito. Aprovado para motores VW, Audi, BMW e Mercedes.',
    specs: {
      'Viscosidade': 'SAE 5W-30',
      'Capacidade': '5 Litros',
      'Especificação ACEA': 'C3',
      'Aprovações OEM': 'VW 504 00 / 507 00, MB 229.31/229.51, Porsche C30'
    },
    compatibleVehicles: [
      { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' },
      { brandId: 'audi', modelId: 'a4', engine: '2.0 TDI (190 CV)' },
      { brandId: 'bmw', modelId: 'serie3', engine: '320d (190 CV)' },
      { brandId: 'mercedes', modelId: 'classe-c', engine: 'C 220 d (200 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' },
    ]
  },
  {
    id: 'bosch-bateria-s5-008',
    name: 'Bateria Automóvel Bosch S5 008 (77Ah 780A)',
    category: 'eletricidade',
    categoryLabel: 'Eletricidade',
    brand: 'Bosch',
    price: 119.00,
    originalPrice: 149.00,
    rating: 4.9,
    reviewsCount: 77,
    sku: '0 092 S50 080',
    oeNumber: '000 915 105 DG',
    inStock: true,
    stockCount: 8,
    image: 'https://images.unsplash.com/photo-1558441719-67455705d671?q=80&w=600&auto=format&fit=crop',
    description: 'Bateria de arranque selada e isenta de manutenção. Tecnologia PowerFrame para arranque fiável mesmo a temperaturas extremas.',
    specs: {
      'Capacidade': '77 Ah',
      'Corrente de Arranque (EN)': '780 A',
      'Tensão': '12 V',
      'Comprimento': '278 mm',
      'Largura': '175 mm',
      'Altura': '190 mm'
    },
    compatibleVehicles: [
      { brandId: 'audi', modelId: 'a4', engine: '2.0 TDI (190 CV)' },
      { brandId: 'bmw', modelId: 'serie3', engine: '320d (190 CV)' },
      { brandId: 'mercedes', modelId: 'classe-c', engine: 'C 220 d (200 CV)' },
      { brandId: 'vw', modelId: 'passat', engine: '2.0 TDI (190 CV)' },
    ]
  },
  {
    id: 'ngk-vela-incandescencia-5961',
    name: 'Vela de Incandescência NGK D-Power',
    category: 'eletricidade',
    categoryLabel: 'Eletricidade',
    brand: 'NGK',
    price: 16.20,
    originalPrice: 22.50,
    rating: 4.8,
    reviewsCount: 52,
    sku: 'DP61 / 5961',
    oeNumber: '03L 905 061 F',
    inStock: true,
    stockCount: 40,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop',
    description: 'Vela de incandescência rápida para motores diesel. Reduz as emissões e melhora o arranque a frio.',
    specs: {
      'Tensão': '4.4 V',
      'Tamanho da Rosca': 'M10 x 1,0',
      'Comprimento Total': '130 mm'
    },
    compatibleVehicles: [
      { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'passat', engine: '2.0 TDI (150 CV)' },
    ]
  },
  {
    id: 'valeo-escova-silencio',
    name: 'Jogo de Escovas Limpa-Para-Brisas Valeo Silencio',
    category: 'eletricidade',
    categoryLabel: 'Eletricidade',
    brand: 'Valeo',
    price: 24.90,
    originalPrice: 34.00,
    rating: 4.8,
    reviewsCount: 64,
    sku: 'VF370 / 574470',
    oeNumber: '5G1 998 002',
    inStock: true,
    stockCount: 25,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
    description: 'Escovas planairas de alta eficiência com borracha de tecnologia VisioRubber para limpeza silenciosa e sem estrias.',
    specs: {
      'Comprimento 1': '650 mm',
      'Comprimento 2': '450 mm',
      'Lado de Montagem': 'Dianteiro (Par)'
    },
    compatibleVehicles: [
      { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' },
      { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'passat', engine: '2.0 TDI (150 CV)' }
    ]
  },
  {
    id: 'mahle-filtro-habitaculo',
    name: 'Filtro de Habitáculo Mahle CareMetix (Carvão Ativo)',
    category: 'filtros',
    categoryLabel: 'Filtros',
    brand: 'Mahle',
    price: 18.50,
    originalPrice: 26.00,
    rating: 4.9,
    reviewsCount: 110,
    sku: 'LAO 888',
    oeNumber: '5Q0 819 653',
    inStock: true,
    stockCount: 35,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600&auto=format&fit=crop',
    description: 'Filtro de ar do habitáculo de 5 camadas com tecnologia antialérgica e carvão ativo para neutralizar maus odores e poeiras finas.',
    specs: {
      'Comprimento': '254 mm',
      'Largura': '224 mm',
      'Altura': '30 mm',
      'Tipo de Filtro': 'Com carvão ativo e ação antialérgica'
    },
    compatibleVehicles: [
      { brandId: 'audi', modelId: 'a3', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'golf', engine: '2.0 TDI (150 CV)' },
      { brandId: 'vw', modelId: 'tiguan', engine: '2.0 TDI (150 CV)' }
    ]
  }
];
