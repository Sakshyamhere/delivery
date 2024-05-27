import { useState, React, useEffect } from "react";
import { MyContext } from "./MyContext";
import axios from "axios";

function ContextProvider(props) {
  const initCart = () => {
    if (typeof localStorage !== "undefined") {
      const cartLs = JSON.parse(localStorage.getItem("cart"));
      if (cartLs && cartLs.length) {
        return cartLs;
      }
    }
    return [];
  };
  const [cart, setCart] = useState(initCart());
  const [loggedIn, setLoggedIn] = useState(false);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
  const incQuantity = (index) => {
    setCart(
      (prevState) => {
        const newState = [...prevState];
        newState[index] = {
          ...newState[index],
          quantity: newState[index].quantity + 1,
        };
        return newState;
      },
    );
  };

  const decQuantity = (i) => {
    setCart(
      (prevState) => {
        if (prevState[i].quantity > 1) {
          const newState = [...prevState];
          newState[i] = { ...newState[i], quantity: newState[i].quantity - 1 };
          return newState;
        }
        if (prevState[i].quantity === 1) {
          const newState = prevState.filter((item, index) => index !== i);
          return newState;
        }
        return prevState;
      }
    );
  };

  const addItemToCart = (item) => {
    const cartLs = JSON.parse(localStorage.getItem("cart"));
    if (cartLs) {
      setCart(cartLs);
    }
    const makeCart = {
      product: item,
      quantity: 1,
    };
    setCart((prevState) => [...prevState, makeCart]);
  };
  const checkUser = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/checkuser`, {
        headers: {
          user: JSON.stringify(user),
        },
      });
      if (response.data.success == true) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <MyContext.Provider
        value={{
          loggedIn,
          cart,
          setLoggedIn,
          checkUser,
          addItemToCart,
          incQuantity,
          decQuantity,
        }}
      >
        {props.children}
      </MyContext.Provider>
    </div>
  );
}

export default ContextProvider;
