import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import "dotenv/config";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};
const Map = (props) => {
  const [center, setCenter] = useState();
  const [address, setAddress] = useState("");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_API_KEY,
    libraries,
  });

  useEffect(() => {
    getCoords(props.position.place_id);
  }, []);
  const getCoords = async (placeId) => {
    try {
      const res = await axios.get(
        `/api/getplacedetailwithplaceid?query=${placeId}`
      );
      const location = await res.data.result.geometry.location;
      setCenter({
        lat: await location.lat,
        lng: await location.lng,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const [mapRef, setMapRef] = useState(null);
  console.log(center)
  const handleOnLoad = (map) => {
    setMapRef(map);
  };

  const handleIdle = async () => {
    if (mapRef) {
      const center = mapRef.getCenter();
      try {
        const res = await axios.get(
          `/api/getlocationfromlatlng?latitude=${center.lat()}&longitude=${center.lng()}`
        );
        const location = res.data.plus_code.compound_code;
        console.log(location)
        setAddress({ address: location, lat: center.lat(), lng: center.lng() });
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="p-4 flex flex-col rounded-lg md:shadow-lg bg-gray-100 md:h-[500px] w-auto">
      <div className="md:w-[50vw] md:h-[400px] h-[80vh] w-[90vw] mx-auto">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={90}
          center={center}
          onLoad={handleOnLoad}
          onIdle={handleIdle}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
      <div className="flex flex-col p-4">
        <p className="text-center font-semibold text-xl my-2">
          {address.address}
        </p>
        <button
          className="bg-green-300 p-3 w-full mx-auto text-3xl rounded-md"
          onClick={() => props.handleAddressClick(address.lat, address.lng)}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default Map;
