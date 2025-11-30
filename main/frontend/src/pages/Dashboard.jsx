import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterPanel from "../components/FilterPanel.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import BarChart from "../components/BarChart.jsx";
import { placesAPI } from "../services/placesApi";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [statsField, setStatsField] = useState("Rating");
  const [chartField, setChartField] = useState("Visitors");
  
  // Top 10 places for bar chart
  const [topPlaces, setTopPlaces] = useState([]);
  // Stats from API endpoint
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    categories: []
  });

  // Read city and category from URL parameters when component mounts
  useEffect(() => {
    const cityParam = searchParams.get('city');
    const categoryParam = searchParams.get('category');
    
    if (cityParam) {
      setCountry(cityParam);
    }
    
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch filter options on mount
  useEffect(() => {
    async function loadFilters() {
      try {
        console.log("Fetching filter options...");
        const result = await placesAPI.getFilters();
        console.log("Filter options received:", result);
        
        setFilterOptions({
          countries: result.filters.countries || [],
          categories: result.filters.categories || []
        });
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    }
    loadFilters();
  }, []);

  // Fetch top 10 places AND stats whenever filters change
  useEffect(() => {
    // Add a small delay to prevent rapid API calls
    const timeoutId = setTimeout(() => {
      async function fetchData() {
        setLoading(true);
        setError(null);
        
        try {
          console.log("Fetching data with filters:", { country, category });

          // Fetch top 10 places for bar chart
          const placesData = await placesAPI.getTopPlaces({
            country: country || undefined,
            category: category || undefined
          });

          console.log("Top places received:", placesData);

          // Fetch stats from API (all places matching filters)
          const statsData = await placesAPI.getStats({
            country: country || undefined,
            category: category || undefined
          });

          console.log("Stats received:", statsData);

          // Transform top 10 for bar chart
          const transformed = placesData.map(p => ({
            Location: p.location,
            Country: p.country,
            Category: p.category,
            Visitors: p.visitors,
            Rating: p.rating,
            Revenue: p.revenue,
            Accommodation_Available: p.accommodation_available
          }));

          setTopPlaces(transformed);
          setStats(statsData.stats);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError(err.message);
          setLoading(false);
          setTopPlaces([]);
          setStats(null);
        }
      }

      fetchData();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [country, category]);

  const clearFilters = () => {
    setCountry("");
    setCategory("");
  };

  // Convert stats API data to format StatsPanel expects
  const statsForPanel = stats ? [{
    Rating: parseFloat(stats.avgRating),
    Visitors: parseInt(stats.avgVisitors),
    _totalPlaces: parseInt(stats.totalPlaces),
    _minRating: parseFloat(stats.minRating),
    _maxRating: parseFloat(stats.maxRating)
  }] : [];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Hero Header */}
        <div className="dashboard-hero">
          <div className="dashboard-hero-content">
            <div className="dashboard-title-wrapper">
              <span className="dashboard-icon">🌍</span>
              <h1 className="dashboard-title">Lebanon Tourism Dashboard</h1>
              <img
                src="https://img.icons8.com/color/48/lebanon.png"
                alt="Lebanon"
                style={{ width: 48, height: 48, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
              />
            </div>
            <p className="dashboard-subtitle">
              Explore insights, ratings, and tourism trends across Lebanon 🌴
              {stats && ` - ${stats.totalPlaces} places`}
            </p>
          </div>
        </div>

        {loading && (
          <div style={{ 
            padding: "20px", 
            textAlign: "center",
            background: "white",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <strong>⏳ Loading data...</strong>
          </div>
        )}

        {error && (
          <div style={{ 
            padding: "20px", 
            textAlign: "center",
            background: "#fee",
            color: "#c00",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <strong>❌ Error:</strong> {error}
            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              Check console (F12) for more details
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Filter Panel */}
          <FilterPanel
            data={filterOptions}
            country={country}
            setCountry={setCountry}
            category={category}
            setCategory={setCategory}
            onClearFilters={clearFilters}
          />

          {/* Main Content */}
          <div>
            {/* Stats Panel - shows ALL places matching filters */}
            <StatsPanel rows={statsForPanel} field={statsField} />
            
            {/* Bar Chart - shows TOP 10 places matching filters */}
            <BarChart rows={topPlaces} field={chartField} />
          </div>
        </div>
      </div>
    </div>
  );
}