export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

// Static sample products (frontend-only phase).
export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Lamination A4 Sheet (Pack of 100)",
    price: 350,
    quantity: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "p2",
    name: "Passport Size Photo Print (8 copies)",
    price: 60,
    quantity: 100,
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "p3",
    name: "Xerox / Photocopy (per page)",
    price: 2,
    quantity: 999,
    imageUrl:
      "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "p4",
    name: "Spiral Binding Service",
    price: 80,
    quantity: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "p5",
    name: "Colour Printout A4 (per page)",
    price: 10,
    quantity: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "p6",
    name: "Aadhar PVC Card (Original Print)",
    price: 150,
    quantity: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?w=800&q=80&auto=format&fit=crop",
  },
];
