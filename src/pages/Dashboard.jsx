import React, { useState } from "react";
import { Search, Hotel, BarChart3, LogOut, Trash2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useHotels } from "../hooks/useHotels";
import ComparisonChart from "../components/ComparisonChart";
import "./Dashboard.css"; 

export default function Dashboard() {
  const [city, setCity] = useState("");
  const [compare, setCompare] = useState([]);
  const { hotels, loading, performSearch } = useHotels();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.length !== 3) return alert("Enter 3-letter city code");
    performSearch(city.toUpperCase());
    setCompare([]);
  };

  const toggleCompare = (hotel) => {
    setCompare((prev) => {
      const exists = prev.find((h) => h.hotelId === hotel.hotelId);
      if (exists) return prev.filter((h) => h.hotelId !== hotel.hotelId);
      if (prev.length >= 4) return prev;
      return [...prev, hotel];
    });
  };

  // Chart data mapping
  const chartData = compare.map((h) => ({
    name: h.name.slice(0, 10),
    price: Math.floor(Math.random() * 300) + 100,
    rating: 4
  }));

  return (
    <div className="dashboard-wrapper">
      {/* Navigation with Logout in Top Right */}
      <nav className="glass-nav">
        <h1>Hospitality Explorer</h1>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Expanded Search Bar Row */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          maxLength="3"
          value={city}
          onChange={(e) => setCity(e.target.value.toUpperCase())}
          placeholder="Enter City Code (NYC, LON, AMD...)"
        />
        <button type="submit" className="search-btn">
          <Search size={20} />
        </button>
      </form>

      {/* Hotel List Container */}
      <div className="hotel-list-container">
        {loading && <p style={{color: "white"}}>Loading hotels...</p>}
        
        {hotels.map((hotel, index) => {
          const isSelected = compare.find((h) => h.hotelId === hotel.hotelId);
          return (
            <div 
              key={hotel.hotelId} 
              className="advanced-hotel-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="img-placeholder">
                <Hotel size={40} color="#64748b" />
              </div>
              
              <div className="card-content">
                <h3>{hotel.name}</h3>
                <p className="location-tag">
                  <MapPin size={14} /> {hotel.iataCode || city}
                </p>
              </div>

              <button 
                className={`compare-toggle ${isSelected ? "selected" : "unselected"}`}
                onClick={() => toggleCompare(hotel)}
              >
                {isSelected ? "✓ Selected" : "Add to Compare"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Section */}
      {compare.length > 0 && (
        <div className="comparison-section">
          <div className="comparison-header">
            <h2>
              <BarChart3 color="#22c55e" size={24} /> Comparison Insights
            </h2>
            <button onClick={() => setCompare([])} className="clear-button">
              <Trash2 size={16} /> Clear All
            </button>
          </div>
          <div style={{ height: "400px", marginTop: "20px" }}>
            <ComparisonChart data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}