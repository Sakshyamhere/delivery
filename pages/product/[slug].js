import { MyContext } from "@/context/MyContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

function slug() {
  const { addItemToCart, cart, incQuantity, decQuantity } =
    useContext(MyContext);
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/products/getproductwithid?query=${router.query.slug}`
      );
      const resData = await response.data.products;
      setProduct([resData]);
      if (resData) {
        fetchSimilarProducts(resData.category, resData.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSimilarProducts = (category, id) => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/products/getsimilarproductswithcategory?category=${category}&id=${id}`
      )
      .then((res) => {
        setSimilarProducts(res.data.products);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchProduct();
  }, [router.query.slug]);
  useEffect(() => {
    const cartMap = cart.reduce((map, item) => {
      map[item.product.id] = item;
      return map;
    }, {});
    if (product) {
      const updatedProduct = product.map((product) => {
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

      if (JSON.stringify(product) !== JSON.stringify(updatedProduct)) {
        setProduct(updatedProduct);
      }
    }
  }, [cart, product[0]])
  useEffect(() => {
    const cartMap = cart.reduce((map, item) => {
      map[item.product.id] = item;
      return map;
    }, {});
    if (similarProducts) {
      const updatedProducts = similarProducts.map((similarProduct) => {
        const cartItem = cartMap[similarProduct.id];
        if (cartItem) {
          return {
            ...similarProduct,
            cartInfo: {
              cartStatus: true,
              quantity: cartItem.quantity,
              index: cart.indexOf(cartItem),
            },
          };
        } else {
          return {
            ...similarProduct,
            cartInfo: {
              cartStatus: false,
              quantity: 0,
              index: null,
            },
          };
        }
      });

      if (JSON.stringify(similarProducts) !== JSON.stringify(updatedProducts)) {
        setSimilarProducts(updatedProducts);
      }
    }
  }, [cart, similarProducts]);

  return (
    <div className="absolute mt-[10rem] lg:mt-[7rem] lg:ml-[7rem] lg:mr-[7rem] xl:ml-[10rem] xl:mr-[10rem] w-full md:w-auto">
      {product[0] && (
        <div>
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center flex-col md:flex-row h-[40%] mx-2 w-full md:w-auto">
              <div className="md:border shadow-sm rounded-lg flex justify-center w-full md:w-auto">
                <img
                  src={product[0].image}
                  alt={product[0].id}
                  className="p-1 h-[300px] w-[300px] md:h-[400px] md:w-[400px]"
                />
              </div>
              <div className="flex flex-col md:ml-5 lg:ml-10">
                <div className="flex my-2">
                  <span className="mx-2 text-xl inline-flex">
                    <Link href="/" className="text-sm">
                      Home
                    </Link>
                    <p className="text-sm">&#8592;</p>
                    <Link
                      href={`/category/${product[0].category}`}
                      className="text-sm"
                    >
                      {product.category}
                    </Link>
                    <p className="text-sm">&#8592;</p>
                    <p className="text-gray-500 text-sm">{product[0].name}</p>
                  </span>
                </div>
                <div className="flex flex-col">
                  <p className="mx-2 font-bold text-2xl my-2">{product[0].name}</p>
                  <p className="mx-2 font-light my-1">{product[0].remark}</p>
                  <p className="my-2 mx-2 font-semibold text-3xl">
                    रु {product[0].price}
                  </p>
                </div>
                <div>
                  {product[0].cartInfo && product[0].cartInfo.cartStatus === true ? (
                    <div className="flex flex-row justify-center rounded-md items-center bg-red-400 w-[5rem]">
                      <button
                        className="text-2xl"
                        onClick={() => {
                          incQuantity(product[0].cartInfo.index);
                        }}
                      >
                        +
                      </button>
                      <p className="text-xl mx-2">
                        {product[0].cartInfo.quantity}
                      </p>
                      <button
                        className="text-2xl"
                        onClick={() => {
                          decQuantity(product[0].cartInfo.index);
                        }}
                      >
                        -
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-blue-600 p-1 w-full border border-blue-400 rounded-md"
                      onClick={() => {
                        addItemToCart(product[0]);
                      }}
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="mx-2 my-4 font-bold text-2xl">Similar Products</p>
            <div className="flex justify-center">
              <div className="grid gap-1 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {similarProducts.map((item) => (
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
      )}
    </div>
  );
}

export default slug;
