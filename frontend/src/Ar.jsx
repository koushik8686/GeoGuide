import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './constants/urls';

const API_KEY = '28412fb167c07b40f03f1e004d82ef15';
const GOOGLE_API_KEY = 'AIzaSyBvB2LJE5tjlh4scJ3flCjWfBNzfAVSre0';

const Weather = ({ lat, lon }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">Weather in {weather.name}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg">Temperature: {weather.main.temp}°C</p>
          <p className="capitalize">Condition: {weather.weather[0].description}</p>
        </div>
        <div>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
};

const PlaceCard = ({ place, onSelect, selected }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 ${
        selected ? 'ring-2 ring-emerald-500' : ''
      }`}
      onClick={() => onSelect(place)}
    >
      {place.photos && place.photos[0] && (
        <img
          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`}
          alt={place.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{place.name}</h3>
        <div className="flex items-center mb-2">
          <span className="text-yellow-400">{'★'.repeat(Math.round(place.rating))}</span>
          <span className="text-gray-600 ml-2">({place.user_ratings_total} reviews)</span>
        </div>
        <p className="text-gray-600 text-sm">{place.vicinity}</p>
        {place.opening_hours && (
          <p className={`text-sm mt-2 ${place.opening_hours.open_now ? 'text-green-600' : 'text-red-600'}`}>
            {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
          </p>
        )}
      </div>
    </div>
  );
};

const PlaceARView = ({ place }) => {
  const streetViewRef = useRef(null);
  const [hasStreetView, setHasStreetView] = useState(true);

  useEffect(() => {
    if (place && window.google) {
      const { lat, lng } = place.geometry.location;
      const streetViewService = new window.google.maps.StreetViewService();

      // Check if street view is available
      streetViewService.getPanorama(
        { location: { lat, lng }, radius: 50 },
        (data, status) => {
          if (status === 'OK') {
            const panorama = new window.google.maps.StreetViewPanorama(
              streetViewRef.current,
              {
                position: { lat, lng },
                pov: { heading: 34, pitch: 10 },
                zoom: 1,
                addressControl: true,
                fullscreenControl: true,
              }
            );
            setHasStreetView(true);
          } else {
            setHasStreetView(false);
          }
        }
      );
    }
  }, [place]);

  if (!hasStreetView) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <p>Street View is not available for this location</p>
        {place.photos && place.photos[0] && (
          <img
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`}
            alt={place.name}
            className="mt-4 rounded-lg max-w-full h-auto"
          />
        )}
      </div>
    );
  }

  return <div ref={streetViewRef} className="w-full h-[600px] rounded-lg overflow-hidden" />;
};

const StreetViewAR = () => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);
        fetchNearbyPlaces(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location', error);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/places/nearby?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setPlaces(data.results || []);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Explore in AR Mode</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : (
        <>
          <Weather lat={lat} lon={lng} />

          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Nearby Places</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard
                  key={place.place_id}
                  place={place}
                  onSelect={setSelectedPlace}
                  selected={selectedPlace?.place_id === place.place_id}
                />
              ))}
            </div>
          </div>

          {selectedPlace && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Street View</h3>
              <PlaceARView place={selectedPlace} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StreetViewAR;
