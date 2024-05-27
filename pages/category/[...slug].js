import { MyContext } from "@/context/MyContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

function slug() {
  const { addItemToCart, cart, incQuantity, decQuantity } =
    useContext(MyContext);
  const router = useRouter();
  const [subCategory, setSubCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    if (typeof router.query.slug == "object") {
      fetchDataWithPrerequisite();
      fetchSubCategory();
    }
  }, [router.query.slug, products.length]);

  useEffect(() => {
    const cartMap = cart.reduce((map, item) => {
      map[item.product.id] = item;
      return map;
    }, {});
    const updatedProducts = products.map((product) => {
      const cartItem = cartMap[product.id];
      if (cartItem) {
        return {
          ...product,
          cartInfo: {
            cartStatus: true,
            quantity: cartItem.quantity,
            index: cart.indexOf(cartItem),
          },
        };
      } else {
        return {
          ...product,
          cartInfo: {
            cartStatus: false,
            quantity: 0,
            index: null,
          },
        };
      }
    });

    if (JSON.stringify(products) !== JSON.stringify(updatedProducts)) {
      setProducts(updatedProducts);
    }
  }, [cart, products]); // Depend on both cart and products

  const fetchDataWithPrerequisite = () => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/products/getproductswithcategoryandsubcategory?category=${router.query.slug[0]}&subcategory=${router.query.slug[1]}`
      )
      .then((res) => {
        setProducts(res.data.products);
        console.log(products);
      })
      .catch((err) => console.log(err));
    console.log(router.query.slug[0], router.query.slug[1]);
  };
  const fetchSubCategory = () => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/category/getsubcategory?category=${router.query.slug[0]}`
      )
      .then((res) => {
        setSubCategory(res.data.category);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="absolute mt-[10rem] lg:mt-[6rem] lg:ml-[7rem] lg:mr-[7rem] xl:ml-[10rem] xl:mr-[10rem]">
      <div className="flex flex-row">
        <div className="border-r-2 w-[6rem] md:w-[11rem] shadow-sm h-screen fixed mb-10 p-2">
          <div className="overflow-y-scroll no-scrollbar h-screen">
            <div className="h-[1700px] md:h-[1100px]">
              {subCategory.map((item) => (
                <Link
                  className={`flex justify-center my-2 ${
                    router.query.slug[1] === item.subcategory
                      ? "bg-gray-200 border border-l-red-400 border-l-4"
                      : "hover:bg-gray-200 hover:border-l-red-200"
                  }`}
                  href={`${router.query.slug[0]}/${item.subcategory}`}
                  key={item.id}
                >
                  <div
                    className={`flex flex-col px-2 md:flex-row items-center justify-between mx-auto w-[6rem] `}
                  >
                    <img
                      src={item.subcategoryimage}
                      alt={item.subcategory}
                      className=" h-10 w-10 my-2"
                    ></img>

                    <p className="m-2 font-bold mr-5 text-base">
                      {item.subcategory}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="ml-[6rem] md:ml-[12rem] grid gap-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 m-4">
            {products.map((item) => (
              <div
                className="shadow-inner shadow-gray-100 p-2 rounded-md mx-2 my-2"
                key={item.id}
              >
                <Link className="p-2" href="/">
                  <img alt="dairy-bread-eggs" src={item.image} />
                  <p className="my-1 font-semibold">{item.name}</p>
                  <p className=" font-light text-sm">{item.remark}</p>
                  <p className="my-2 font-semibold">रु{item.price}</p>
                </Link>
                {item.cartInfo && item.cartInfo.cartStatus === true ? (
                  <div className="flex flex-row justify-center rounded-md items-center bg-red-400 w-[5rem]">
                    <button
                      className="text-2xl"
                      onClick={() => {
                        incQuantity(item.cartInfo.index);
                      }}
                    >
                      +
                    </button>
                    <p className="text-xl mx-2">{item.cartInfo.quantity}</p>
                    <button
                      className="text-2xl"
                      onClick={() => {
                        decQuantity(item.cartInfo.index);
                      }}
                    >
                      -
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-blue-600 p-1 w-full border border-blue-400 rounded-md"
                    onClick={() => {
                      addItemToCart(item);
                    }}
                  >
                    Add to cart
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default slug;
