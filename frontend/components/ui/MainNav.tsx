import { CategoriesResponseSchema } from "@/src/schemas";
import Logo from "./Logo";
import Link from "next/link";

async function getCategories() {
  //debe ser async ya que es un compoonente que hace consultas a la api
  const url = `${process.env.API_URL}/categories`;
  const req = await fetch(url);
  const json = await req.json();
  const categories = CategoriesResponseSchema.parse(json);
  return categories;
}

export default async function MainNav() {
  const categories = await getCategories();
  return (
    <header className="px-10 py-5 bg-gray-700 flex flex-col md:flex-row justify-between ">
      <div className="flex justify-center">
        <Logo />
      </div>

      <nav className="flex flex-col md:flex-row gap-2 items-center mt-5 md:mt-0">
        {categories.map((category) => (
          <Link
            key={category.id} //para iterar en lista siempre es necesario un key unico
            href={`/${category.id}`} //enlace a la categoria
            className="text-white hover:text-green-300 font-bold p-2"
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
