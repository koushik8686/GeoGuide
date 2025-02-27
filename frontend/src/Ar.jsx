import React, { useEffect, useRef } from "react";

const StreetViewAR = () => {
  const streetViewRef = useRef(null);

  useEffect(() => {
    const loadStreetView = (lat, lng) => {
      const google = window.google;

      const map = new google.maps.Map(streetViewRef.current, {
        center: { lat, lng },
        zoom: 18,
      });

      new google.maps.StreetViewPanorama(streetViewRef.current, {
        position: { lat, lng },
        pov: {
          heading: 34,
          pitch: 10,
        },
        zoom: 1,
      });

      map.setStreetView(streetViewRef.current);
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadStreetView(latitude, longitude);
      },
      (error) => console.error("Error getting location", error)
    );
  }, []);

  return (
    <div>
      <h2>Explore in AR Mode</h2>
      <div ref={streetViewRef} style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default StreetViewAR;
