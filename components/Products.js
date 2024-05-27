import { MyContext } from "@/context/MyContext";
import Spinner from "@/miscellaneous/Spinner";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function Products() {
  const { addItemToCart, cart, incQuantity, decQuantity } =
    useContext(MyContext);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(10);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    fetchData();
  }, []);
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

  const fetchData = async () => {
    axios
      .get(`${BACKEND_URL}/api/v1/products/getproducts?offset=0`)
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((err) => console.log(err));
  };
  const fetchMoreData = () => {
    setTimeout(() => {
      axios
        .get(`${BACKEND_URL}/api/v1/products/getproducts?offset=${offset}`)
        .then((res) => {
          setProducts((prevState) => [...prevState, ...res.data.products]);
          res.data.products.length > 0 ? setHasMore(true) : setHasMore(false);
        })
        .catch((err) => console.log(err));
      setOffset((prevState) => prevState + 10);
    }, 1200);
  };

  return (
    <div className="flex justify-center">
      <InfiniteScroll
        dataLength={products.length} //This is important field to render the next data
        next={fetchMoreData}
        hasMore={hasMore}
        scrollThreshold={0.8}
        loader={
          <div className="flex justify-center">
            <Spinner />
          </div>
        }
      >
        <div className="grid gap-1 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 m-4">
          {products.map((item) => (
            <div
              className="shadow-inner shadow-gray-100 p-2 rounded-md mx-2 my-2"
              key={item.id}
            >
              <Link href={`/product/${item.id}`}>
                <img alt="dairy-bread-eggs" src={item.image} />
                <p className="my-1 font-semibold text-ellipsis text-nowrap">
                  {item.name}
                </p>
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
      </InfiniteScroll>
    </div>
  );
}

export default Products;
