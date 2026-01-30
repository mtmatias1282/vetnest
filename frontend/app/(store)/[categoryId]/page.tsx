type Params = Promise<{ categoryId: string }>; //en las url siempre son strings

async function getProducts(categoryId: string) {
  const url = `${process.env.API_URL}/categories/${categoryId}?products=true`;
  const req = await fetch(url);
  const json = await req.json();
  console.log(json);
}

export default async function StorePage({ params }: { params: Params }) {
  const { categoryId } = await params;
  const products = await getProducts(categoryId);


  return (
    <div>
      <h1 className=" text-3xl font-bold">Store Page</h1>
    </div>
  );
}
