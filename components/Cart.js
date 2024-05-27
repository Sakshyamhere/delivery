import { MyContext } from "@/context/MyContext";
import React, { useContext, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
function Cart(props) {
  const { handleCart} = props;
  const { cart, incQuantity, decQuantity } = useContext(MyContext);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    console.log(cart);
    setCartItems(cart.map((item) => item));
  }, [cart]);
  return (
    <div>
      <div className="z-40 h-full w-full md:ml-[50%] md:w-[50%] lg:ml-[70%] lg:w-[30%] bg-blue-50 fixed rounded-lg shadow-lg">
        <div className="flex flex-col">
          <div className="shadow-sm rounded-md bg-white m-2 ">
            <div>
              <span className="flex justify-between">
                <p className="text-center text-2xl font-bold my-2 mx-5">
                  My cart
                </p>
                <IoClose
                  className="cursor-pointer text-4xl my-2 mr-4"
                  onClick={handleCart}
                />
              </span>
            </div>
          </div>
          <div className="shadow-sm rounded-md bg-white m-2 h-[85vh] overflow-scroll overflow-x-hidden no-scrollbar">
            <div className={`h-max overflow-auto no-scrollbar`}>
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div className="flex flex-row mt-3 items-center" key={index}>
                    <div className="border m-2 rounded-md p-1">
                      <img
                        src={item.product.image}
                        className="h-20 w-20 m-2 rounded-md"
                        alt={item.product.image}
                      />
                    </div>
                    <div className="mx-2">
                      <p className="text-md text-wrap">{item.product.name}</p>
                      <p className=" font-light text-sm">
                        {item.product.remark}
                      </p>
                      <p className="my-2 font-semibold">
                        रु{item.product.price}
                      </p>

                      <div className="flex flex-row justify-center rounded-md items-center bg-red-400 w-[5rem]">
                        <button
                          className="text-2xl"
                          onClick={() => {
                            incQuantity(index);
                          }}
                        >
                          +
                        </button>
                        <p className="text-xl mx-2">{item.quantity}</p>
                        <button
                          className="text-2xl"
                          onClick={() => {
                            decQuantity(index);
                          }}
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <img src="https://cdn.grofers.com/assets/ui/empty_states/emp_empty_cart.png" alt="noItemsinCart" />
                  <p className="text-center font-semibold text-2xl">
                    No items in cart
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="shadow-sm rounded-md bg-green-500 p-2 text-xl text-right m-1">
            <button className="">Proceed purchase</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
