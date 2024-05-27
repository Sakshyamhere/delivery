import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { useState, useEffect, useContext } from "react";
import ContextProvider from "@/context/ContextProvider";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const [renderNavbar, setRenderNavbar] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (router.pathname === "/login") {
      setRenderNavbar(false);
    } else {
      setRenderNavbar(true);
    }
  }, [router.pathname]);
  return (
    <ContextProvider>
      <div className="min-h-full">
        {renderNavbar && <Navbar />}
        <Component {...pageProps} />
      </div>
    </ContextProvider>
  );
}
