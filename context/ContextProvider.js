import { useState, React } from "react";
import { MyContext } from "./MyContext";

function ContextProvider(props) {
  const [language, setLanguage] = useState("English");
  const [cart, setCart] = useState([]);
  const handleLanguageChange = () => {
    if (language === "English") {
      setLanguage("Nepali");
    } else {
      setLanguage("English");
    }
  };
  const addItemToCart = (item) => {
    setCart((prevState) => [...prevState, { ...item }]);
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(JSON.parse(localStorage.getItem("cart")));
  };
  return (
    <div>
      <MyContext.Provider
        value={{
          language,
          setLanguage,
          handleLanguageChange,
          cart,
          addItemToCart,
          setCart,
        }}
      >
        {props.children}
      </MyContext.Provider>
    </div>
  );
}

export default ContextProvider;
