import React, { useContext } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Category from "./Category";
import Products from "./Products";
import { MyContext } from "@/context/MyContext";
function Landing() {
  const { language, setLanguage} = useContext(MyContext);
  return (
    <div className="absolute mt-[10rem] lg:mt-[7rem] lg:ml-[7rem] lg:mr-[7rem] xl:ml-[10rem] xl:mr-[10rem]">
      <div>
        <Splide
          options={{
            rewind: true,
            type: "loop",
            perPage: 3,
            breakpoints: {
              1440: {
                perPage: 3,
              },
              1024: {
                perPage: 3,
              },
              768: {
                perPage: 2,
              },
              640: {
                perPage: 1,
              },
            },
            pagination: false,
          }}
          aria-label="React Splide"
        >
          <SplideSlide>
            <img
              src="https://cdn.zeptonow.com/production///tr:w-972,ar-972-558,pr-true,f-auto,q-80/inventory/banner/0b837d94-6241-4628-a51c-7dda7ca1afab.png"
              className="p-3"
              alt="Image 1"
            />
          </SplideSlide>
          <SplideSlide>
            <img
              src="https://cdn.zeptonow.com/production///tr:w-969,ar-969-558,pr-true,f-auto,q-80/inventory/banner/7e8a4fd1-5d54-4c23-846c-183ee34a0f68.png"
              className="p-3"
              alt="Image 2"
            />
          </SplideSlide>
          <SplideSlide>
            <img
              src="https://cdn.zeptonow.com/production///tr:w-969,ar-969-558,pr-true,f-auto,q-80/inventory/banner/9f47c139-9a85-47a2-9840-a86abfe2defc.png"
              className="p-3"
              alt="Image 3"
            />
          </SplideSlide>
          <SplideSlide>
            <img
              src="https://cdn.zeptonow.com/production///tr:w-969,ar-969-557,pr-true,f-auto,q-80/inventory/banner/e70547b6-0b33-4ab9-ab5d-0fc4e2c16264.png"
              className="p-3"
              alt="Image 4"
            />
          </SplideSlide>
          <SplideSlide>
            <img
              src="https://cdn.zeptonow.com/production///tr:w-969,ar-969-558,pr-true,f-auto,q-80/inventory/banner/dc79b7e3-13d5-4911-a2a9-401b9a2faa5f.png"
              className="p-3"
              alt="Image 5"
            />
          </SplideSlide>
        </Splide>
      </div>
      <p className="text-center my-4 mt-10 font-semibold text-2xl">
        Shop by category
      </p>
      <div className="mx-auto">
        <Category />
      </div>
      <p className="text-center my-4 mt-10 font-semibold text-2xl">
        Suggested for you
      </p>
      <div className="mx-auto">
            <Products/>
      </div>
    </div>
  );
}

export default Landing;
