import { useEffect, useState } from "react";
import { placesAPI } from "../services/placesApi";

export default function YelpDataLoader({ onData }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all places from API
        const places = await placesAPI.getAllPlaces();
        
        // Transform to match your existing data structure (PascalCase)
        const transformed = places.map(p => ({
          Location: p.location,
          City: p.country,
          Category: p.category,
          Visitors: p.visitors,
          Rating: p.rating,
          Revenue: p.revenue,
          Accommodation_Available: p.accommodation_available,
          PlaceId: p.placeid,
          Address: p.address,
          ImageUrl: p.imageurl,
          Latitude: p.latitude,
          Longitude: p.longitude,
          PriceLevel: p.pricelevel,
          IsOpen: p.isopen,
          Types: p.types
        }));
        
        onData(transformed);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, [onData]);

  if (loading) {
    return (
      <div style={{ 
        padding: "20px", 
        textAlign: "center",
        background: "white",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <strong>⏳ Loading data from database...</strong>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: "20px", 
        textAlign: "center",
        background: "#fee",
        color: "#c00",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <strong>❌ Error loading data:</strong> {error}
        <div style={{ marginTop: "10px", fontSize: "14px" }}>
          Make sure your backend server is running on port 5000
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "12px 20px", 
      textAlign: "center",
      background: "#e8f5e9",
      color: "#2e7d32",
      borderRadius: "12px",
      marginBottom: "20px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <strong>✅ Dataset loaded from database</strong>
    </div>
  );
}