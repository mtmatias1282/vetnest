import { CategoryWithProductsResponseSchema } from "@/src/schemas";
import ProductCard from "@/components/products/ProductCard";
import { redirect } from "next/navigation";

type Params = Promise<{ categoryId: string }>; //en las url siempre son strings

async function getProducts(categoryId: string) {
  const url = `${process.env.API_URL}/categories/${categoryId}?products=true`; //consultar productos de una categoria
  const req = await fetch(url);
  if (!req.ok) {
    redirect('/1'); //si la categoria no existe redirigir al home
  }
  const json = await req.json();
  const products = CategoryWithProductsResponseSchema.parse(json);
  return products;
}

export default async function StorePage({ params }: { params: Params }) {
  const { categoryId } = await params;
  const category = await getProducts(categoryId);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {category.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}


