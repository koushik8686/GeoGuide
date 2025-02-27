import { useEffect, useState } from "react";
import axios from "axios";

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const lat = "37.7749"; // Example (San Francisco)
  const lng = "-122.4194";
  const type = "restaurant"; // Can be "hotel", "museum", etc.

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/places?lat=${lat}&lng=${lng}&type=${type}`);
        console.log(response);
        setPlaces(response.data.results);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaces();
  }, []);

  return (
    <div>
      <h2>Nearby {type}s</h2>
      {loading ? <p>Loading...</p> : (
        <ul>
          {places.map((place) => (
            <li key={place.place_id}>
              <strong>{place.name}</strong> - ⭐ {place.rating || "N/A"}
              <br />
              {place.vicinity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Places;
