import { useState, React } from "react";
import { MyContext } from "./MyContext";

function ContextProvider(props) {
  const [language, setLanguage] = useState("English");
  const handleLanguageChange = () => {
    if (language === "English") {
      setLanguage("Nepali");
    } else {
      setLanguage("English");
    }
  };

  return (
    <div>
      <MyContext.Provider
        value={{ language, setLanguage, handleLanguageChange }}
      >
        {props.children}
      </MyContext.Provider>
    </div>
  );
}

export default ContextProvider;
