import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import ContextProvider from "@/context/ContextProvider";
export default function App({ Component, pageProps }) {
  useEffect(() => {
    const address = JSON.parse(localStorage.getItem("Address"));
    if (!address) {
      document.body.style.overflow = "hidden";
    }
  }, []);

  return (
    <ContextProvider>
      <div className="min-h-full">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </ContextProvider>
  );
}
