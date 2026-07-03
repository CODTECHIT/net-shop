import { createFileRoute } from "@tanstack/react-router";
import Products from "@/components/Products";
import SEO from "@/components/SEO";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="pt-20">
      <SEO
        title="F Mart | Premium Online Shopping & Delivery | Vayus Enterprises"
        description="Shop premium products at F Mart by Vayus Enterprises. Quality products with lowest cost doorstep delivery in Kurnool and exciting offers on every order."
        keywords="F Mart Kurnool, online shopping Kurnool, grocery delivery AP, premium products Kurnool, Vayus Enterprises store"
      />
      <Products />
    </div>
  );
}
