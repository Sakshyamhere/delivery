import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCartArrowDown, FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { MyContext } from "@/context/MyContext";
import axios from "axios";

function Navbar() {
  const modalRef = useRef();
  const { handleLanguageChange } = useContext(MyContext);
  const [searchedLocation, setSearchedLocation] = useState("");
  const [location, setLocation] = useState(false);
  const [predLocation, setPredLocation] = useState([]);
  const [askForLocation, setAskForLocation] = useState(false);
  const [searchForLocation, setSearchForLocation] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
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
    if (searchForLocation == true || askForLocation==true) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener("mousedown", isClickedOutside);
      document.body.style.overflow = 'visible'
    };
   
  }, [searchForLocation, predLocation.length]);
  const isClickedOutside = (e) => {
    if (
      searchForLocation &&
      modalRef.current &&
      !modalRef.current.contains(e.target)
    ) {
      setSearchForLocation(false);
    }
  };
  const fetchLocation = async (latitude, longitude) => {
    try {
      const res = await axios.get(
        `/api/getlocationfromlatlng?latitude=${latitude}&longitude=${longitude}`
      );
      const location = res.data.plus_code.compound_code;
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
      const res = await axios.get(
        `/api/getlocationfromsearch?query=${inputLocation}`
      );
      if (res.data.predictions.length > 0) {
        setPredLocation(res.data.predictions);
      }
    } catch (err) {
      setPredLocation([]);
    }
  };
  return (
    <main>
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
              placeholder="Search for items...."
              className="bg-gray-50 border border-gray-300 text-lg rounded-lg p-2 w-full"
            />
          </div>

          <MdLanguage
            className="text-4xl hidden lg:block lg:mr-5 lg:ml-5 lg:mb-0 cursor-pointer"
            onClick={handleLanguageChange}
          />
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
        <div className="fixed z-30 md:flex md:justify-center w-full md:pt-[30vh] h-full md:pb-[30vh] md:h-auto">
          <div className="bg-gray-300 rounded-md p-4 h-full md:h-[50vh] md:w-[50%]" ref={modalRef}>
            <div className="flex items-center justify-between">
              <div className="flex">
                <FaLocationDot className="mx-2" />
                Please provide your location
              </div>
            </div>
            <div className="flex justify-center items-center mt-3">
              <div className="w-full">
                <input
                  type="search"
                  placeholder="Search for location...."
                  className="bg-gray-50 border border-gray-300 text-lg rounded-lg p-2 w-full"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {predLocation.length > 0 && searchedLocation.length > 0 && (
              <div className="">
                {predLocation.map((item) => (
                  <p className=" overflow-ellipsis md:text-nowrap" key={item.place_id}>{item.description}</p>
                ))}
              </div>
            )}
            {searchedLocation.length == 0 && <div>Enter to know location</div>}
          </div>
        </div>
      )}
    </main>
  );
}

export default Navbar;
