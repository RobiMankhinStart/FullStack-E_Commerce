// app/lib/mockData.js

export const MOCK_CATEGORIES = [
  { _id: "cat_1", name: "Apparel", slug: "apparel", count: 12 },
  { _id: "cat_2", name: "Footwear", slug: "footwear", count: 8 },
  { _id: "cat_3", name: "Accessories", slug: "accessories", count: 15 },
  { _id: "cat_4", name: "Tech & Audio", slug: "tech", count: 6 },
];

export const MOCK_PRODUCTS = [
  {
    _id: "prod_1",
    title: "Minimalist Oversized Hoodie",
    slug: "minimalist-oversized-hoodie",
    category: "apparel",
    price: 120,
    originalPrice: 150,
    rating: 4.9,
    tag: "Bestseller",
    thumbnail:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    description:
      "Heavyweight French terry cotton with relaxed drop shoulders and refined ribbing.",
    colors: ["#18181b", "#71717a", "#e4e4e7"],
    variants: [{ color: "Black", size: "M", sku: "HOOD-BLK-M" }],
  },
  {
    _id: "prod_2",
    title: "Aero Runner Sneakers",
    slug: "aero-runner-sneakers",
    category: "footwear",
    price: 210,
    originalPrice: null,
    rating: 4.8,
    tag: "New Arrival",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    description:
      "Ultra-lightweight mesh knit paired with responsive nitrogen-infused foam cushioning.",
    colors: ["#ef4444", "#ffffff", "#09090b"],
    variants: [{ color: "Red", size: "42", sku: "RUN-RED-42" }],
  },
  {
    _id: "prod_3",
    title: "Sculptural Ceramic Vase",
    slug: "sculptural-ceramic-vase",
    category: "accessories",
    price: 85,
    originalPrice: 110,
    rating: 4.7,
    tag: "Limited",
    thumbnail:
      "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=800&auto=format&fit=crop",
    description:
      "Hand-thrown matte ceramic piece featuring organic silhouettes and tactile texture.",
    colors: ["#f5f5f4", "#d6d3d1"],
    variants: [{ color: "Sand", size: "One Size", sku: "VASE-SND" }],
  },
  {
    _id: "prod_4",
    title: "Wireless ANC Headphones",
    slug: "wireless-anc-headphones",
    category: "tech",
    price: 340,
    originalPrice: 390,
    rating: 5.0,
    tag: "Hot Item",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    description:
      "Studio-grade acoustics with active noise cancellation and 40-hour battery life.",
    colors: ["#18181b", "#e2e8f0"],
    variants: [{ color: "Matte Black", size: "Standard", sku: "ANC-BLK" }],
  },
  {
    _id: "prod_5",
    title: "Structured Leather Tote",
    slug: "structured-leather-tote",
    category: "accessories",
    price: 280,
    originalPrice: null,
    rating: 4.9,
    tag: null,
    thumbnail:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    description:
      "Full-grain Italian calfskin with dedicated laptop sleeve and magnetic top closure.",
    colors: ["#78350f", "#09090b"],
    variants: [{ color: "Tan", size: "Large", sku: "TOTE-TAN" }],
  },
  {
    _id: "prod_6",
    title: "Tailored Wool Blend Coat",
    slug: "tailored-wool-blend-coat",
    category: "apparel",
    price: 450,
    originalPrice: 520,
    rating: 4.8,
    tag: "Editorial",
    thumbnail:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop",
    description:
      "Double-breasted coat crafted from premium wool blend with structured shoulder pads.",
    colors: ["#3f3f46", "#18181b"],
    variants: [{ color: "Charcoal", size: "L", sku: "COAT-CHR-L" }],
  },
];

export const MOCK_DASHBOARD_METRICS = [
  { label: "Revenue", value: "$84.2k", change: "+12.4%" },
  { label: "Orders", value: "1,248", change: "+8.1%" },
  { label: "Customers", value: "8,940", change: "+5.6%" },
  { label: "Stock items", value: "320", change: "Low risk" },
];

export const MOCK_REVENUE_DATA = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 48000 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 56000 },
  { month: "May", revenue: 64000 },
  { month: "Jun", revenue: 74200 },
];

export const MOCK_SALES_CHANNELS = [
  { name: "Online", value: 58 },
  { name: "Retail", value: 27 },
  { name: "Social", value: 15 },
];

export const MOCK_ORDERS = [
  {
    id: "#1042",
    customer: "Alicia Brooks",
    items: 3,
    total: 186,
    status: "Packed",
  },
  {
    id: "#1043",
    customer: "Marcus Lee",
    items: 2,
    total: 98,
    status: "Processing",
  },
  {
    id: "#1044",
    customer: "Jasmin Reed",
    items: 4,
    total: 250,
    status: "Shipped",
  },
  {
    id: "#1045",
    customer: "Daniel Gomez",
    items: 1,
    total: 74,
    status: "Delivered",
  },
  {
    id: "#1046",
    customer: "Priya Shah",
    items: 5,
    total: 340,
    status: "Packed",
  },
];

export const MOCK_USERS = [
  {
    id: 1,
    name: "Maya Chen",
    role: "Admin",
    email: "maya@shop.com",
    active: true,
  },
  {
    id: 2,
    name: "Tom Wilson",
    role: "Manager",
    email: "tom@shop.com",
    active: true,
  },
  {
    id: 3,
    name: "Rina Patel",
    role: "Support",
    email: "rina@shop.com",
    active: false,
  },
];

export const MOCK_INVENTORY = [
  {
    sku: "HOOD-BLK-M",
    product: "Oversized Hoodie",
    stock: 28,
    status: "Healthy",
  },
  { sku: "RUN-RED-42", product: "Aero Runner", stock: 7, status: "Low" },
  { sku: "VASE-SND", product: "Ceramic Vase", stock: 12, status: "Healthy" },
  { sku: "ANC-BLK", product: "ANC Headphones", stock: 3, status: "Critical" },
];

export const MOCK_ADMIN_PROFILE = {
  name: "Alicia Brooks",
  email: "alicia@commercehub.com",
  phone: "+880 1712 345678",
  location: "Dhaka, Bangladesh",
  role: "Super Admin",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
};
