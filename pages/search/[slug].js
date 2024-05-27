import { MyContext } from "@/context/MyContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

function slug() {
  const router = useRouter();
  const { addItemToCart } = useContext(MyContext);
  const [products, setProducts] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    fetchProducts();
  }, [router.query.slug]);
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/products/getproductswithquery?query=${router.query.slug}`
      );
      setProducts(response.data.product);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute mt-[10rem] lg:mt-[7rem] lg:ml-[7rem] lg:mr-[7rem] xl:ml-[10rem] xl:mr-[10rem]">
      <div className="flex justify-center">
        <div className="grid gap-1 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 m-4">
          {products.map((item) => (
            <div
              className="shadow-inner shadow-gray-100 p-2 rounded-md mx-2 my-2"
              key={item.id}
            >
              <Link href={`/product/${item.id}`}>
                <img alt="dairy-bread-eggs" src={item.image} />
                <p className="my-1 font-semibold">{item.name}</p>
                <p className=" font-light text-sm">{item.remark}</p>
                <p className="my-2 font-semibold">रु{item.price}</p>
              </Link>
              <button
                className="text-blue-600 p-1 w-full border border-blue-400 rounded-md"
                onClick={() => addItemToCart(item)}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default slug;
