import React, { useEffect, useState,useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoicGtrdW1hcjk4OTciLCJhIjoiY20wM2JhOHdjMGN3MTJvcXFqZmIwN3BsNyJ9.BKedYeNDHBA-MDT4HAW7ig"; // Replace with your token

const MapWithGifMarker = ({ defaultCoordinates }) => {
  const [coordinates, setCoordinates] = useState(defaultCoordinates);

  useEffect(() => {
    if (
      !Array.isArray(defaultCoordinates) ||
      defaultCoordinates.length !== 2 ||
      isNaN(defaultCoordinates[0]) ||
      isNaN(defaultCoordinates[1])
    ) {
      setCoordinates([-74.5, 40]); // Default coordinates
    } else {
      setCoordinates(defaultCoordinates);
    }
  }, [defaultCoordinates]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  useEffect(() => {
    if (!mapRef.current) {
      // Initialize Mapbox map
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 11.6,
      });

      // Create a custom GIF marker
      const gifMarker = document.createElement("div");
      gifMarker.style.width = "130px";
      gifMarker.style.height = "130px";
      gifMarker.style.background = "rgba(235, 76, 96, 0.5)"; // Replace with your GIF path
      gifMarker.style.backgroundSize = "cover";
      gifMarker.style.borderRadius = "50%"; // Optional: make it circular
      gifMarker.style.overflow = "hidden";
      gifMarker.style.display = "flex";
      gifMarker.style.justifyContent = "center";
      gifMarker.style.alignItems = "center";
      const gif = document.createElement("img");
      gif.style.width = "35%";
      gif.style.height = "35%";
      gif.style.borderRadius = "50%";
      gif.src = "/house.gif"; // Ensure the GIF has a transparent background
      gif.alt = "GIF Marker";
      gifMarker.appendChild(gif);
      // Add marker to the map
      new mapboxgl.Marker(gifMarker)
        .setLngLat(coordinates)
        .addTo(mapRef.current);
    }

    return () => mapRef.current?.remove(); // Cleanup on unmount
  }, []);

  return (
    <>
      <h1 className="mt-3 mb-2 text-lg font-semibold">Where you’ll be</h1>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "400px" }}
        className=" rounded-xl mb-3"
      />
    </>
  );
};

export default MapWithGifMarker;


