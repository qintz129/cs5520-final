import { Timestamp } from "firebase/firestore";

// Function to convert the timestamp to a date
export const convertTimestamp = (timestampString) => {
  const date = new Date(timestampString);
  return date.toLocaleDateString();
};

// Function to calculate the distance between two locations using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance.toFixed(1);
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};