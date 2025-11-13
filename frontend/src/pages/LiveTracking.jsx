import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiSearch, FiX, FiZoomIn, FiZoomOut, FiMapPin } from "react-icons/fi";
import moment from "moment";
import "moment/locale/bn";

moment.locale("bn");

// Custom marker icons
const caregiverIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const seniorIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const mockTracking = [
  {
    id: 1,
    type: "caregiver",
    name: "রহিম খান",
    name_en: "Rahim Khan",
    lat: 23.8103,
    lng: 90.4125,
    status: "Active",
    check_in: "09:30 AM",
    check_out: null,
    senior_name: "মা",
  },
  {
    id: 2,
    type: "caregiver",
    name: "ফাতেমা বেগম",
    name_en: "Fatema Begum",
    lat: 23.815,
    lng: 90.418,
    status: "On the way",
    check_in: null,
    check_out: null,
    senior_name: "বাবা",
  },
  {
    id: 3,
    type: "senior",
    name: "মা",
    name_en: "Mother",
    lat: 23.81,
    lng: 90.42,
    status: "Home",
    age: 78,
  },
  {
    id: 4,
    type: "senior",
    name: "বাবা",
    name_en: "Father",
    lat: 23.805,
    lng: 90.415,
    status: "Out",
    age: 82,
  },
];

export default function LiveTracking() {
  const { user } = useAuth();
  const [tracking, setTracking] = useState(mockTracking);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [mapCenter, setMapCenter] = useState([23.8103, 90.4125]);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    // Mock real-time subscription simulation
    const interval = setInterval(() => {
      setTracking((prev) =>
        prev.map((marker) => {
          if (marker.type === "caregiver" && Math.random() > 0.7) {
            return {
              ...marker,
              lat: marker.lat + (Math.random() - 0.5) * 0.002,
              lng: marker.lng + (Math.random() - 0.5) * 0.002,
            };
          }
          return marker;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredTracking = tracking.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const activeCaregiver = tracking.find(
    (item) => item.type === "caregiver" && item.status === "Active"
  );

  return (
    <div className="fixed inset-0 top-16 bg-gray-100 flex">
      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 relative"
      >
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          className="w-full h-full"
          style={{ background: "#e5e7eb" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Markers */}
          {filteredTracking.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng]}
              icon={marker.type === "caregiver" ? caregiverIcon : seniorIcon}
              eventHandlers={{ click: () => setSelectedMarker(marker) }}
            >
              <Popup className="custom-popup">
                <div className="text-sm">
                  <p className="font-bold">{marker.name}</p>
                  <p className="text-gray-600 text-xs">{marker.name_en}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2">
          <button
            onClick={() => setZoom(Math.min(zoom + 1, 19))}
            className="p-3 bg-white shadow-lg rounded-lg hover:bg-gray-100 transition"
          >
            <FiZoomIn size={20} className="text-primary" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 1, 1))}
            className="p-3 bg-white shadow-lg rounded-lg hover:bg-gray-100 transition"
          >
            <FiZoomOut size={20} className="text-primary" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="absolute top-6 left-6 right-6 md:right-auto md:max-w-xs z-[400]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg shadow-lg border-0 focus:ring-2 ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Live Indicator */}
        {activeCaregiver && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-24 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="font-semibold text-success text-sm">
                LIVE TRACKING
              </span>
            </div>
            <p className="font-bold text-text mb-1">{activeCaregiver.name}</p>
            <p className="text-sm text-gray-600 mb-3">
              {activeCaregiver.senior_name} কে সেবা প্রদান করছে
            </p>
            <p className="text-xs text-gray-500">
              Check-in: {activeCaregiver.check_in}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-96 bg-white shadow-lg overflow-y-auto flex flex-col max-h-[calc(100vh-64px)]"
      >
        <div className="p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-text mb-4">Active Tracking</h2>

          {/* Filter */}
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "caregiver", label: "Caregivers" },
              { value: "senior", label: "Seniors" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                  filterType === filter.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTracking.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No active tracking</p>
              <p className="text-gray-500 text-sm mt-2">
                কোনো সক্রিয় ট্র্যাকিং নেই
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredTracking.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedMarker(item)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedMarker?.id === item.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/30 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-text">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.name_en}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.type === "caregiver"
                          ? "bg-success/20 text-success"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      {item.type === "caregiver" ? "কেয়ারগিভার" : "বয়স্ক"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <FiMapPin size={14} />
                    {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                  </p>

                  {item.type === "caregiver" ? (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Status:</span>{" "}
                        {item.status}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">With:</span>{" "}
                        {item.senior_name}
                      </p>
                      {item.check_in && (
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">Check-in:</span>{" "}
                          {item.check_in}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-full bg-success rounded-full"
                          />
                        </div>
                        <span className="text-xs text-success font-semibold">
                          Live
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Status:</span>{" "}
                        {item.status}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold">Age:</span> {item.age}{" "}
                        years
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-6 border-t bg-gray-50">
          <p className="text-xs font-semibold text-gray-600 mb-3">LEGEND</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Caregiver (কেয়ারগিভার)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Senior (বয়স্ক)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Selected Marker Details Modal (Mobile) */}
      <AnimatePresence>
        {selectedMarker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setSelectedMarker(null)}
          >
            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-96 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text">
                    {selectedMarker.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedMarker.name_en}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMarker(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm flex items-center gap-2">
                  <FiMapPin size={16} className="text-primary" />
                  <span className="text-gray-600">
                    {selectedMarker.lat.toFixed(4)},{" "}
                    {selectedMarker.lng.toFixed(4)}
                  </span>
                </p>

                {selectedMarker.type === "caregiver" ? (
                  <>
                    <p className="text-sm">
                      <span className="font-semibold text-text">Status:</span>{" "}
                      <span className="text-gray-600">
                        {selectedMarker.status}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-text">
                        Assigned Senior:
                      </span>{" "}
                      <span className="text-gray-600">
                        {selectedMarker.senior_name}
                      </span>
                    </p>
                    {selectedMarker.check_in && (
                      <p className="text-sm">
                        <span className="font-semibold text-text">
                          Check-in Time:
                        </span>{" "}
                        <span className="text-gray-600">
                          {selectedMarker.check_in}
                        </span>
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm">
                      <span className="font-semibold text-text">Age:</span>{" "}
                      <span className="text-gray-600">
                        {selectedMarker.age} years
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-text">Status:</span>{" "}
                      <span className="text-gray-600">
                        {selectedMarker.status}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
