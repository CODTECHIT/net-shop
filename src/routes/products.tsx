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
        title="F Mart — Official Online Store | Vayu's Networks Kurnool"
        description="Shop premium quality products at the lowest cost from F Mart by Vayu's Networks. Get door delivery across Kurnool with special offers on subsequent orders."
        keywords="F Mart Kurnool, online shopping Kurnool, doorstep delivery Kurnool, Vayu's Networks store, e-store Kurnool, low price products Kurnool"
      />
      <Products />
    </div>
  );
}
