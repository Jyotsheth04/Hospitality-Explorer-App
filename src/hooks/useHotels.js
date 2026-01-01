import { useState } from 'react';
import { searchHotels } from '../api/hotelApi';

export const useHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (city, filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchHotels(city, filters);
      setHotels(data);
    } catch (err) {
      setError("Failed to fetch hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { hotels, loading, error, performSearch };
};