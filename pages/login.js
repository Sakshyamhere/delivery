import { MyContext } from "@/context/MyContext";
import Spinner from "@/miscellaneous/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

function login() {
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const router = useRouter();
  const [phonenumber, setPhonenumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { loggedIn, setLoggedIn } = useContext(MyContext);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/adduser?phonenumber=${phonenumber}`
      );
      setLoading(true);
      if (response.data.success == true) {
        setLoading(false);
        setShowOtpModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLoginOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/user/loginuser?phonenumber=${phonenumber}&otp=${otp}`
      );
      setLoading(true);
      if (response.data.success == true && response.data.user !== null) {
        setLoading(false);
        setLoggedIn(true);
        localStorage.setItem("authStatus",true)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        router.push("/");
      }
      if (response.data.success == true && response.data.user == null) {
        setError("Wrong Otp");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="fixed z-40 md:flex md:justify-center w-full h-full  md:mt-[10%] md:bg-transparent bg-blue-50 md:h-auto">
        <div className="flex flex-col shadow-2xl drop-shadow-2xl border-1 bg-[#fffcfc] rounded-xl  w-full md:w-[40%] h-full">
          <div className="rounded-md  m-2 p-2">
            <div className="flex justify-center mx-auto flex-col">
              <p className="text-xl font-bold text-center">Hasty</p>
              <p className="text-2xl font-bold text-center">
                Nepal's last minutes app
              </p>
              <p className="text-lg font-normal text-center">
                Log In or Sign Up
              </p>
            </div>
          </div>
          {showOtpModal ? (
            <div className="rounded-md  m-2">
              <form className="max-w-sm mx-auto">
                <input
                  type="number"
                  id="inputOtp"
                  aria-describedby="inputOtp"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none-input"
                  placeholder="Enter Otp"
                  onChange={(e) => {
                    e.preventDefault();
                    setError('')
                    setLoading(false)
                    setOtp(e.target.value);
                  }}
                  required
                />
                {error =='Wrong Otp' ? (
                  <div>
                    <p className="text-2xl text-white text-center p-1 bg-red-500 rounded-lg mt-2">{error}</p>
                  </div>
                ) : (
                  <div>
                    {loading ? (
                      <div className="flex justify-center">
                        <Spinner />
                      </div>
                    ) : otp.length === 5 ? (
                      <button
                        type="submit"
                        className="border bg-green-500 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 my-2"
                        onClick={handleLoginOtp}
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="border bg-gray-500 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 my-2"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="rounded-md  m-2">
              <form className="max-w-sm mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-2.5 pointer-events-none">
                    <p className="text-[12px] font-bold">+977 </p>
                  </div>
                  <input
                    type="number"
                    id="inputPhoneNum"
                    aria-describedby="inputPhoneNum"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 appearance-none-input"
                    placeholder="9876543210"
                    onChange={(e) => {
                      e.preventDefault();
                      setPhonenumber(e.target.value);
                    }}
                    required
                  />
                </div>
                {loading ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : phonenumber.length === 10 ? (
                  <button
                    type="submit"
                    className="border bg-green-500 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 my-2"
                    onClick={handleLogin}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="border bg-gray-500 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 my-2"
                  >
                    Continue
                  </button>
                )}
              </form>
            </div>
          )}

          <p className="text-center font-light my-2">
            By continuing, you agree to our Terms of service & Privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default login;
