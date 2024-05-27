import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCartArrowDown, FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { MyContext } from "@/context/MyContext";
import axios from "axios";
import Map from "./Map";
import Cart from "./Cart";
import { useRouter } from "next/router";

function Navbar() {
  const modalRef = useRef();
  const router = useRouter();
  const { loggedIn, setLoggedIn, checkUser, cart } = useContext(MyContext);
  const [location, setLocation] = useState(false);
  const [askForLocation, setAskForLocation] = useState(false);
  const [searchForLocation, setSearchForLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [predLocation, setPredLocation] = useState([]);
  const [sendMap, setSendMap] = useState([]);
  const [searchOutput, setSearchOutput] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState("");
  const [address, setAddress] = useState("");
  const [srhInput, setSrhInput] = useState("");
  const [cartLen, setCartLen] = useState(0);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  useEffect(() => {
    setCartLen(cart.length);
    const getUserFromLs = localStorage.getItem("user");
    if (getUserFromLs) {
      checkUser();
    } else {
      setLoggedIn(false);
    }
    const storedAddress = JSON.parse(localStorage.getItem("Address"));
    if (storedAddress) {
      setAskForLocation(false);
      setLocation(true);
      fetchLocation(storedAddress.latitude, storedAddress.longitude);
    } else {
      setAskForLocation(true);
      setLocation(false);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    document.addEventListener("mousedown", isClickedOutside);
    return () => {
      document.removeEventListener("mousedown", isClickedOutside);
    };
  }, [
    searchForLocation,
    predLocation.length,
    showMap,
    askForLocation,
    openCart,
    srhInput.length,
    cart,
  ]);
  const isClickedOutside = (e) => {
    if (
      searchForLocation &&
      modalRef.current &&
      !showMap &&
      !modalRef.current.contains(e.target)
    ) {
      setSearchForLocation(false);
    }
  };
  const fetchLocation = async (latitude, longitude) => {
    try {
      // const res = await axios.get(
      //   `/api/getlocationfromlatlng?latitude=${latitude}&longitude=${longitude}`
      // );
      // const location = res.data.plus_code.compound_code;
      const location = "hetauda";
      setAddress(location);
    } catch (err) {
      console.log(err);
    }
  };

  const showPosition = (position) => {
    const address = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    localStorage.setItem("Address", JSON.stringify(address));
    fetchLocation(address.latitude, address.longitude);
    setLocation(true);
    setAskForLocation(false);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Please Enable Location Access.");
      console.error("Please Enable Location Access.");
    }
  };
  const handleInputChange = async (e) => {
    const inputLocation = e.target.value;
    setSearchedLocation(inputLocation);
    try {
      // const res = await axios.get(
      //   `/api/getlocationfromsearch?query=${inputLocation}`
      // );
      // if (res.data.predictions.length > 0) {
      //   setPredLocation(res.data.predictions);
      // }
      setPredLocation("Hetauda");
    } catch (err) {
      setPredLocation([]);
    }
  };
  const handleAddressClick = (lat, lng) => {
    const address = {
      latitude: lat,
      longitude: lng,
    };
    localStorage.setItem("Address", JSON.stringify(address));
    fetchLocation(address.latitude, address.longitude);
    setLocation(true);
    setAskForLocation(false);
    setShowMap(false);
    setAskForLocation(false);
    setSearchForLocation(false);
  };
  const handleCart = () => {
    if (openCart) {
      setOpenCart(false);
    } else if (!openCart) {
      setOpenCart(true);
    }
  };
  const handleSrchChange = async (e) => {
    try {
      setSrhInput(e.target.value);
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/products/getproductswithquery?query=${srhInput}`
      );
      setSearchOutput(response.data.product);
    } catch (error) {
      setSearchOutput([]);
    }
  };
  return (
    <main>
      {openCart && (
        <div>
          <Cart handleCart={handleCart} cartStat={openCart} />
        </div>
      )}
      <header className="text-gray-600 body-font fixed w-full z-30 bg-slate-50 mx-auto bg-gradient-to-b from-indigo-200">
        <div className="flex flex-wrap lg:flex-nowrap flex-row p-3 items-center w-full my-2">
          <div className="flex flex-wrap lg:flex-nowrap flex-row items-center lg:mx-0 mx-auto">
            <Link href="/" className="font-medium border-r-2 border-gray-100">
              <span className="mx-6 text-3xl hidden lg:block">HASTY</span>
            </Link>
            {location ? (
              <div>
                <button
                  className="flex items-center mt-2 lg:max-w-[15rem] lg:text-2xl max-w-[90%] mx-3"
                  onClick={() => setSearchForLocation(true)}
                >
                  <p className="text-nowrap lg:text-2xl lg:mx-1 font-extrabold text-2xl">
                    Under 30 minutes
                  </p>
                  <FaLocationDot className="text-xl" />
                </button>
                {address && (
                  <p className="flex text-center items-center lg:max-w-[20rem] lg:text-sm text-sm max-w-[90%] ml-5 text-nowrap">
                    {address}
                  </p>
                )}
              </div>
            ) : (
              <button
                className="flex items-center my-2 lg:max-w-[15rem] lg:text-2xl max-w-[90%] mx-3"
                onClick={() => setAskForLocation(true)}
              >
                <p className="text-nowrap lg:text-2xl lg:mx-1 font-extrabold mx-2 text-2xl">
                  Select location
                </p>
                <FaLocationDot className="text-xl" />
              </button>
            )}
          </div>

          <div className="w-full lg:w-[70%] lg:mx-5 mx-auto">
            <input
              type="search"
              value={srhInput}
              placeholder="Search for items...."
              className="bg-gray-50 border border-gray-300 text-lg rounded-lg p-2 w-full"
              onChange={handleSrchChange}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  router.push(`/search/${srhInput}`);
                  setSearchOutput([]);
                }
              }}
            />
            {searchOutput && srhInput.length > 0 && (
              <div className="bg-white rounded-lg absolute w-[40%] shadow-lg my-4">
                {searchOutput.map((item) => (
                  <div>
                    <p className="p-2 hover:bg-gray-100">
                      <button
                        className="w-full text-left"
                        onClick={() => {
                          router.push(`/search/${item.name}`);
                          setSrhInput(`${item.name}`);
                          setSearchOutput([]);
                        }}
                      >
                        {item.name}
                      </button>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {!loggedIn ? (
            <FaUserCircle
              className="text-4xl absolute mb-20 mr-full lg:mr-0 lg:mx-5 lg:mb-0 lg:relative cursor-pointer"
              onClick={() => router.push("/user")}
            />
          ) : (
            <FaUserCircle
              className="text-4xl absolute mb-20 mr-full lg:mr-0 lg:mx-5 lg:mb-0 lg:relative cursor-pointer"
              onClick={() => router.push("/login")}
            />
          )}
          <FaCartArrowDown
            className="text-4xl hidden lg:block lg:ml-5 lg:mb-0 cursor-pointer"
            onClick={handleCart}
          />
          {cartLen != 0 && (
            <div className="hidden lg:block lg:mb-6 cursor-pointer ">
                 <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
              {cartLen}
            </p>
            </div>
         
          )}
        </div>
      </header>
      {askForLocation && (
        <div className="fixed z-30 flex justify-center w-full pt-[40vh]">
          <div className="bg-gray-300 shadow-sm rounded-md p-10">
            <div className="flex items-center">
              <FaLocationDot className="mx-2" />
              Please provide your location
            </div>
            <div className="flex items-center mt-3">
              <button
                className="mx-2 border rounded-md bg-white border-gray-200 p-3 my-2 hover:bg-slate-200"
                onClick={() => {
                  setAskForLocation(false);
                  setSearchForLocation(true);
                }}
              >
                Enter Location
              </button>
              <button
                className="bg-green-500 rounded-md border p-3 my-2 border-gray-200 hover:bg-green-600"
                onClick={getLocation}
              >
                Detect Location
              </button>
            </div>
          </div>
        </div>
      )}
      {searchForLocation && (
        <div className="fixed z-30 md:flex md:justify-center w-full md:pt-[10%] h-full md:pb-[10%] ">
          <div
            className="bg-blue-50 rounded-md p-4 h-full md:h-auto md:w-[50%]"
            ref={modalRef}
          >
            <div className="bg-white p-2 rounded-sm">
              <div className="flex items-center justify-between p-1">
                <div className="flex">
                  <FaLocationDot className="m-1" />
                  <p className="text-xl">Please provide your location</p>
                </div>
              </div>
              <div className="flex justify-center items-center mt-3 p-2">
                <div className="w-full">
                  <input
                    type="search"
                    placeholder="Search for location...."
                    className="bg-gray-50 border border-gray-300 text-lg rounded-lg p-2 w-full"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {predLocation.length > 0 && searchedLocation.length > 0 && (
              <div className="overflow-scroll bg-white">
                <div className="h-full overflow-y-auto">
                  {predLocation.map((item) => (
                    <div key={item.place_id}>
                      <div>
                        <button
                          className="w-full my-2 border-[2px] p-3 bg-slate-50 rounded-md"
                          onClick={() => {
                            setShowMap(true);
                            setSendMap(item);
                          }}
                        >
                          <div className="flex flex-row items-center">
                            <FaLocationDot className="m-1" />
                            <p>{item.description}</p>
                          </div>
                        </button>
                        <br />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {showMap && (
        <div>
          <div className="fixed z-30 md:flex md:justify-center w-full h-full md:my-[10%] md:h-auto">
            <div className="rounded-md">
              <Map handleAddressClick={handleAddressClick} position={sendMap} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Navbar;
