import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCartArrowDown, FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { MyContext } from "@/context/MyContext";


function Navbar() {
  const modalRef = useRef();
  const {handleLanguageChange } = useContext(MyContext);
  const [location, setLocation] = useState(false);
  const [askForLocation, setAskForLocation] = useState(false);
  const [searchForLocation, setSearchForLocation] = useState(false);
  const [address, setAddress] = useState({});
  const isClickedOutside = (e) => {
    if (
      searchForLocation &&
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      setSearchForLocation(false);
    }
  };
  useEffect(() => {
    const address = JSON.parse(localStorage.getItem("Address"));
    console.log(address);
    setAddress(address);
    if (address) {
      setAskForLocation(false);
      setLocation(true);
    }
    if (!address) {
      setAskForLocation(true);
      setLocation(false);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    document.addEventListener("mousedown", isClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", isClickedOutside);
    };
  }, [searchForLocation, askForLocation]);

  const showPosition = (position) => {
    setLocation(true);
    const address = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    localStorage.setItem("Address", JSON.stringify(address));
    setAskForLocation(false);
  };
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    if (!navigator.geolocation.hasPermission) {
      console.log("Enable");
      alert("Please Enable Location Access.");
    }
  };
  const closeSearchLocationModal = () => {
    const address = JSON.parse(localStorage.getItem("Address"));
    setSearchForLocation(false);
    if (address) {
      setAskForLocation(false);
      setLocation(true);
    }
    if (!address) {
      setAskForLocation(true);
      setLocation(false);
    }
  };

  return (
    <main>
      <header className="text-gray-600 body-font fixed w-full z-30 bg-slate-50 mx-auto bg-gradient-to-b from-indigo-200">
        <div className=" flex flex-wrap lg:flex-nowrap flex-row p-3 items-center w-full my-2">
          <div className="flex flex-wrap lg:flex-nowrap flex-row items-center lg:mx-0 mx-auto">
            <Link href="/" className="font-medium border-r-2 border-gray-100">
              <span className="mx-6 text-3xl hidden lg:block">HASTY</span>
            </Link>
            {location ? (
              <div>
                <button
                  className="flex items-center mt-2 lg:max-w-[15rem] lg:text-2xl max-w-[90%]  mx-3"
                  onClick={() => setSearchForLocation(true)}
                >
                  <p className=" text-nowrap lg:text-2xl lg:mx-1 font-extrabold text-2xl">
                    Under 30 minutes
                  </p>
                  <FaLocationDot className="text-xl" />
                </button>
                {address && (
                  <p className="flex text-center  items-center lg:max-w-[20rem] lg:text-sm text-sm max-w-[90%]  mx-3 text-nowrap">
                    long : {address.longitude},lat : {address.latitude}
                  </p>
                )}
              </div>
            ) : (
              <button
                className="flex items-center my-2 lg:max-w-[15rem] lg:text-2xl max-w-[90%]  mx-3"
                onClick={() => setAskForLocation(true)}
              >
                <p className=" text-nowrap lg:text-2xl lg:mx-1 font-extrabold mx-2 text-2xl">
                  Select location
                </p>
                <FaLocationDot className="text-xl" />
              </button>
            )}
          </div>

          <div className="w-full lg:w-[70%] lg:mx-5 mx-auto">
            <input
              type="search"
              placeholder="Search for items...."
              className="bg-gray-50 border border-gray-300 text-lg rounded-lg p-2 w-full"
            />
          </div>

          <MdLanguage className="text-4xl hidden lg:block lg:mr-5 lg:ml-5 lg:mb-0 cursor-pointer" onClick={handleLanguageChange}/>
          <FaUserCircle className="text-4xl absolute mb-20 mr-full lg:mr-0 lg:mx-5 lg:mb-0 lg:relative cursor-pointer" />
          <FaCartArrowDown className="text-4xl hidden lg:block lg:mr-5 lg:ml-5 lg:mb-0 cursor-pointer" />

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
        <div className="fixed z-30 flex justify-center w-full pt-[40vh] mx-2">
          <div className="bg-gray-300 rounded-md p-10" ref={modalRef}>
            <div className="flex items-center justify-between">
              <div className="flex pr-4">
                <FaLocationDot className="mx-2" />
                Please provide your location
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div className="w-full mx-auto">
                <input
                  type="search"
                  placeholder="Search for location...."
                  className="bg-gray-50 border border-gray-300 text-lg rounded-lg p-2 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Navbar;
