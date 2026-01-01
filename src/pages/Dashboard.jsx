import React, { useState } from "react";
import { Search, Hotel, BarChart3, LogOut, Trash2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useHotels } from "../hooks/useHotels";
import ComparisonChart from "../components/ComparisonChart";
import "./Dashboard.css"; // Ensure standard CSS is imported

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

  // Mock data for chart generation
  const chartData = compare.map((h) => ({
    name: h.name.slice(0, 10),
    price: Math.floor(Math.random() * 300) + 100,
    rating: 4
  }));

  return (
    <div className="dashboard-wrapper">
      <nav className="glass-nav">
        <h1 style={{ color: "var(--primary-blue)", margin: 0 }}>Hospitality Explorer</h1>
        <button onClick={handleLogout} className="compare-toggle unselected" style={{ width: "auto" }}>
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "15px", marginBottom: "50px" }}>
        <input
          maxLength="3"
          value={city}
          onChange={(e) => setCity(e.target.value.toUpperCase())}
          placeholder="Enter City Code (NYC, LON...)"
          style={{ flex: 1, padding: "15px", borderRadius: "12px", border: "1px solid #ddd" }}
        />
        <button type="submit" className="selected compare-toggle" style={{ width: "120px" }}>
          <Search size={20} />
        </button>
      </form>

      <div className="hotel-grid-container">
        {hotels.map((hotel, index) => {
          const isSelected = compare.find((h) => h.hotelId === hotel.hotelId);
          return (
            <div 
              key={hotel.hotelId} 
              className="advanced-hotel-card"
              style={{ animationDelay: `${index * 0.1}s` }} // Staggered Animation
            >
              <div className="img-placeholder">
                <Hotel size={48} />
              </div>
              <h3 style={{ marginBottom: "5px" }}>{hotel.name}</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "5px" }}>
                <MapPin size={14} /> {hotel.iataCode || city}
              </p>
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

      {compare.length > 0 && (
        <div style={{ marginTop: "60px", padding: "40px", background: "white", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}><BarChart3 color="#2563eb" /> Comparison Insights</h2>
            <button onClick={() => setCompare([])} style={{ border: "none", background: "none", color: "#ef4444", fontWeight: 700, cursor: "pointer" }}>
              <Trash2 size={16} /> Clear All
            </button>
          </div>
          <div style={{ height: "400px" }}>
            <ComparisonChart data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}