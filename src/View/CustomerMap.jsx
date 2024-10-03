import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import "./Styles/customerMap.css"; // Import custom styles

// Fix default marker icon issues with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const serverLink = import.meta.env.VITE_SERVER_LINK;

const CustomerMap = () => {
  const [customerLocations, setCustomerLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const formatLastScannedDate = (lastScanned) => {
    if (!lastScanned || lastScanned === "N/A" || lastScanned == null)
      return "N/A";

    // Split the date and time parts
    const [datePart, timePart] = lastScanned.split(" ");

    // Split the date part by slashes
    const parts = datePart.split("/"); // Expecting dd/mm/yyyy

    if (parts.length !== 3) {
      console.error(`Invalid date format: ${lastScanned}`);
      return "Invalid date";
    }

    const day = Number(parts[0].trim());
    const month = Number(parts[1].trim());
    const year = Number(parts[2].trim());

    // Check for valid date parts
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      console.error(`NaN found in date parts: ${parts}`);
      return "Invalid date";
    }

    // Create a Date object with the correct format (year, month - 1, day)
    const date = new Date(year, month - 1, day);

    // If timePart exists, parse and adjust the time
    if (timePart) {
      const [time, modifier] = timePart.split(" "); // Split time and modifier (AM/PM)
      let [hours, minutes] = time.split(":").map(Number);

      // Convert hours from 12-hour format to 24-hour format
      if (modifier === "PM" && hours < 12) {
        hours += 12;
      } else if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      // Set the hours and minutes
      date.setHours(hours);
      date.setMinutes(minutes);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid Date Object: ${date}`);
      return "Invalid date";
    }

    return date; // Return the valid date object
  };

  // Fetch customers data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${serverLink}/csm/customers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCustomerLocations(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    // Set an interval to fetch new customer data every 3 seconds
    const intervalId = setInterval(fetchCustomers, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Filter customer locations based on the last scanned day
  const filteredCustomers = customerLocations.filter((customer) => {
    const currentDate = new Date(); // Today's date as Date object
    const scannedDate = formatLastScannedDate(customer.lastScanned);

    // If scannedDate is invalid, skip this customer
    if (scannedDate === "Invalid date" || scannedDate === "N/A") return false;

    const isSameDay =
      currentDate.toLocaleDateString("en-GB") ===
      scannedDate.toLocaleDateString("en-GB");

    if (filter === "scannedToday") return isSameDay;
    if (filter === "notScannedToday") return !isSameDay;
    return true;
  });

  // Marker icons based on lastScanned status
  const getMarkerIcon = (lastScanned) => {
    const currentDate = new Date(); // Today's date
    const lastScannedDate = formatLastScannedDate(lastScanned);

    // If lastScannedDate is invalid, return a default icon
    if (lastScannedDate === "Invalid date") {
      return new L.Icon({
        iconUrl: "src/assets/locationRed.png", // Default icon
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
    }

    // Compare Date objects
    const isSameDay =
      currentDate.toLocaleDateString("en-GB") ===
      lastScannedDate.toLocaleDateString("en-GB");

    return new L.Icon({
      iconUrl: isSameDay
        ? "src/assets/locationGreen.png" // Green icon for today
        : "src/assets/locationRed.png", // red icon for not today
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  };

  // Function to adjust the map view based on customer locations
  const AdjustMapView = () => {
    const map = useMap();

    useEffect(() => {
      if (filteredCustomers.length > 0) {
        const bounds = new L.LatLngBounds(
          filteredCustomers.map((customer) => [
            customer.geolocation.coordinates[1],
            customer.geolocation.coordinates[0],
          ])
        );
        map.fitBounds(bounds); // Adjust the map view to fit all markers
      } else {
        // Fallback to a default view (e.g., Accra, Ghana) if no customers are found
        map.setView([5.6037, -0.187], 13);
      }
    }, [filteredCustomers, map]);

    return null;
  };

  if (loading) {
    return (
      <div className="loaderContainer">
        <PropagateLoader color="#db7d2f" />
        <p>Loading map and customer data...</p>
      </div>
    ); // Display loading spinner with message
  }

  return (
    <div className="customer-map-container">
      <h2 className="customer-map-title">Customer Locations</h2>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {/* <p className="filter-label">Filter by:</p> */}
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Customers
        </button>
        <button
          className={`filter-button ${
            filter === "scannedToday" ? "active" : ""
          }`}
          onClick={() => setFilter("scannedToday")}
        >
          Scanned Today
        </button>
        <button
          className={`filter-button ${
            filter === "notScannedToday" ? "active" : ""
          }`}
          onClick={() => setFilter("notScannedToday")}
        >
          Not Scanned Today
        </button>
      </div>

      <MapContainer
        center={[5.6037, -0.187]} // Default center (Accra, Ghana as fallback)
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <AdjustMapView /> {/* Component to dynamically adjust the map view */}
        {/* Map through the filteredCustomers array to place markers */}
        {filteredCustomers.map((customer, index) => (
          <Marker
            key={index}
            position={[
              customer.geolocation.coordinates[1],
              customer.geolocation.coordinates[0],
            ]}
            icon={getMarkerIcon(customer.lastScanned)} // Use the updated function for the icon
          >
            <Popup>
              <strong>{customer.name}</strong>
              <br />
              Location: {customer.shopName}
              <br />
              Last Scanned:{" "}
              {customer.lastScanned
                ? formatLastScannedDate(
                    customer.lastScanned
                  ).toLocaleDateString("en-GB")
                : "N/A"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CustomerMap;
