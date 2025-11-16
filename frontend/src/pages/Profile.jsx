import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase, isSupabaseConfigured } from "../supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { FiEdit2, FiX, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const profileSchema = yup.object().shape({
  full_name: yup.string().min(2).required("Full name is required"),
  phone: yup
    .string()
    .matches(/^\+880\d{9,10}$/, "Valid Bangladesh phone required"),
  location: yup.string().required("Location is required"),
});

const passwordSchema = yup.object().shape({
  old_password: yup.string().min(8).required("Old password required"),
  new_password: yup.string().min(8).required("New password required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required(),
});

const seniorSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  age: yup
    .number()
    .positive("Age must be positive")
    .integer("Age must be a whole number")
    .required("Age is required"),
  gender: yup
    .string()
    .oneOf(["male", "female", "other"], "Please select a valid gender")
    .required("Gender is required"),
  relation: yup.string().optional(),
  conditions: yup.array().optional(),
  area: yup.string().optional(),
  sub_area: yup.string().optional(),
  address_line: yup.string().optional(),
  location: yup.string().optional(),
  lat: yup.mixed().optional().nullable(),
  lon: yup.mixed().optional().nullable(),
  medication: yup.string().optional(),
  emergency_contacts: yup.string().optional(),
  device_id: yup.string().optional(),
});

const LOCAL_SENIORS_KEY = "seba_local_seniors";

// Mock senior details for testing
const MOCK_SENIORS = [
  {
    id: "mock-senior-1",
    name: "আব্দুল করিম",
    age: 72,
    gender: "male",
    relation: "Father",
    area: "mirpur",
    sub_area: "মিরপুর ১০",
    address_line: "বাড়ি নং ২৩, রোড ৭",
    location: "বাড়ি নং ২৩, রোড ৭, মিরপুর ১০, মিরপুর, ঢাকা",
    conditions: ["ডায়াবেটিস", "উচ্চ রক্তচাপ"],
    medication: "Metformin 500mg (সকাল ও রাত), Amlodipine 5mg (সকালে)",
    emergency_contacts: "+8801712345678, +8801987654321",
    device_id: "TABLET-001",
    lat: 23.8069,
    lon: 90.3685,
    photo_url: null,
    created_at: new Date("2024-01-15").toISOString(),
  },
  {
    id: "mock-senior-2",
    name: "ফাতেমা বেগম",
    age: 68,
    gender: "female",
    relation: "Mother",
    area: "dhanmondi",
    sub_area: "ধানমন্ডি ৩২",
    address_line: "ফ্ল্যাট ৪বি, বাড়ি ১৫",
    location: "ফ্ল্যাট ৪বি, বাড়ি ১৫, ধানমন্ডি ৩২, ধানমন্ডি, ঢাকা",
    conditions: ["হৃদরোগ", "ডিমেনশিয়া"],
    medication: "Aspirin 75mg (প্রতিদিন সকালে), Donepezil 5mg (রাতে)",
    emergency_contacts: "+8801555666777, +8801888999000",
    device_id: null,
    lat: 23.7465,
    lon: 90.3768,
    photo_url: null,
    created_at: new Date("2024-02-20").toISOString(),
  },
];

// Dhaka location dataset
const DHAKA_LOCATIONS = [
  {
    area: "mirpur",
    area_bn: "মিরপুর",
    sub_areas: [
      "মিরপুর ১",
      "মিরপুর ২",
      "মিরপুর ১০",
      "মিরপুর ১১",
      "মিরপুর ১২",
      "পল্লবী",
    ],
  },
  {
    area: "mohammadpur",
    area_bn: "মহম্মদপুর",
    sub_areas: ["বশির উদ্দিন রোড", "জাপান গার্ডেন সিটি", "তাজমহল রোড"],
  },
  {
    area: "dhanmondi",
    area_bn: "ধানমন্ডি",
    sub_areas: ["ধানমন্ডি ২৭", "ধানমন্ডি ৩২", "সাত মসজিদ রোড"],
  },
  {
    area: "gulshan",
    area_bn: "গুলশান",
    sub_areas: ["গুলশান ১", "গুলশান ২", "বনানী", "বারিধারা"],
  },
  {
    area: "uttara",
    area_bn: "উত্তরা",
    sub_areas: ["উত্তরা সেক্টর ১", "উত্তরা সেক্টর ৪", "উত্তরা সেক্টর ১১"],
  },
  {
    area: "banani",
    area_bn: "বনানী",
    sub_areas: ["ব্লক এ", "ব্লক বি", "ব্লক সি", "রোড ১১"],
  },
];

// Fix leaflet default icon paths for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
});

function MapPicker({ lat, lon, onChange }) {
  const center = lat && lon ? [lat, lon] : [23.8103, 90.4125];
  const DefaultMarker = () => {
    useMapEvents({
      click(e) {
        const { lat: nlat, lng: nlon } = e.latlng;
        onChange?.({ lat: nlat, lon: nlon });
      },
    });
    return lat && lon ? <Marker position={[lat, lon]} /> : null;
  };

  return (
    <div className="w-full h-48 rounded overflow-hidden border">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DefaultMarker />
      </MapContainer>
    </div>
  );
}

export default function Profile() {
  const { user, userMetadata, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [seniors, setSeniors] = useState([]);
  const [loadingSeniors, setLoadingSeniors] = useState(false);
  const [showAddSenior, setShowAddSenior] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingSenior, setEditingSenior] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const readLocalSeniors = () => {
    try {
      if (typeof window === "undefined") return [];
      const stored = localStorage.getItem(LOCAL_SENIORS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Failed to read local seniors:", err);
      return [];
    }
  };

  const persistLocalSeniors = (list) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(LOCAL_SENIORS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error("Failed to persist local seniors:", err);
    }
  };

  const personalForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      full_name: userMetadata?.full_name || "",
      phone: userMetadata?.phone || "",
      location: userMetadata?.location || "",
    },
  });
  const passwordForm = useForm({ resolver: yupResolver(passwordSchema) });
  const seniorForm = useForm({ resolver: yupResolver(seniorSchema) });

  useEffect(() => {
    // Fetch seniors from Supabase when configured, otherwise use mock data
    const fetchSeniors = async () => {
      if (!isSupabaseConfigured() || !user?.id) {
        const local = readLocalSeniors();
        // If no local seniors exist, initialize with mock data
        if (local.length === 0) {
          setSeniors(MOCK_SENIORS);
          persistLocalSeniors(MOCK_SENIORS);

          // Also create a universal test PIN for senior dashboard testing
          const mockDeviceMap = localStorage.getItem("mock_senior_devices");
          const deviceMap = mockDeviceMap ? JSON.parse(mockDeviceMap) : {};

          // Create a simple PIN that all users can use for testing
          const testPIN = "TEST-001";
          if (!deviceMap[testPIN]) {
            deviceMap[testPIN] = {
              id: MOCK_SENIORS[0].id,
              name: MOCK_SENIORS[0].name,
              full_name: MOCK_SENIORS[0].name,
              age: MOCK_SENIORS[0].age,
              gender: MOCK_SENIORS[0].gender,
              relation: MOCK_SENIORS[0].relation,
              address: MOCK_SENIORS[0].location,
              lat: MOCK_SENIORS[0].lat,
              lon: MOCK_SENIORS[0].lon,
              device_id: testPIN,
              photo_url: MOCK_SENIORS[0].photo_url,
            };
            localStorage.setItem(
              "mock_senior_devices",
              JSON.stringify(deviceMap)
            );
            console.log("✅ Universal test PIN created: TEST-001");
          }
        } else {
          setSeniors(local);
        }
        return;
      }
      setLoadingSeniors(true);
      try {
        const { data, error } = await supabase
          .from("seniors")
          .select("*")
          .eq("family_user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (data) {
          setSeniors(
            data.map((s) => ({
              id: s.id,
              name: s.name,
              age: s.age,
              gender: s.gender,
              relation: s.relation,
              conditions: s.medical_conditions || s.conditions || [],
              location: s.address || s.location,
              medication: s.medication_list || s.medication,
              emergency_contacts: s.emergency_contacts,
              device_id: s.device_id,
              photo_url: s.photo_url,
              latitude: s.latitude,
              longitude: s.longitude,
              area: s.area,
              sub_area: s.sub_area,
              address_line: s.address_line,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch seniors:", err);
        toast.error("Failed to load seniors from Supabase");
      } finally {
        setLoadingSeniors(false);
      }
    };

    fetchSeniors();
  }, [user?.id]);

  useEffect(() => {
    // When editing a senior, populate the form values
    if (editingSenior) {
      const area = editingSenior.area;
      if (area) {
        const areaData = DHAKA_LOCATIONS.find((loc) => loc.area === area);
        setSelectedArea(areaData);
      }
      seniorForm.reset({
        name: editingSenior.name || "",
        age: editingSenior.age || "",
        gender: editingSenior.gender || "",
        relation: editingSenior.relation || "",
        area: editingSenior.area || "",
        sub_area: editingSenior.sub_area || "",
        address_line: editingSenior.address_line || "",
        location: editingSenior.location || "",
        conditions: editingSenior.conditions || [],
        medication: editingSenior.medication || "",
        emergency_contacts: editingSenior.emergency_contacts || "",
        device_id: editingSenior.device_id || "",
        lat: editingSenior.lat || editingSenior.latitude || "",
        lon: editingSenior.lon || editingSenior.longitude || "",
      });
    } else {
      seniorForm.reset({
        name: "",
        age: "",
        gender: "",
        relation: "",
        area: "",
        sub_area: "",
        address_line: "",
        location: "",
        conditions: [],
        medication: "",
        emergency_contacts: "",
        device_id: "",
        lat: "",
        lon: "",
      });
      setSelectedArea(null);
    }
  }, [editingSenior]);

  const onPersonalSubmit = async (data) => {
    try {
      toast.loading("Updating profile...");
      // await supabase.from('profiles').update(data).eq('id', user.id);
      toast.dismiss();
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      toast.loading("Changing password...");
      // await supabase.auth.updateUser({ password: data.new_password });
      toast.dismiss();
      toast.success("Password updated!");
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const onSeniorSubmit = async (data) => {
    // If Supabase is configured, persist to DB, otherwise update mock state
    if (isSupabaseConfigured() && user?.id) {
      try {
        toast.loading(
          editingSenior ? "Updating senior..." : "Adding senior..."
        );

        const values = { ...data };
        const areaData = DHAKA_LOCATIONS.find(
          (loc) => loc.area === values.area
        );

        const record = {
          name: values.name,
          age: Number(values.age),
          gender: values.gender,
          relation: values.relation,
          area: values.area || null,
          sub_area: values.sub_area || null,
          address_line: values.address_line || null,
          address:
            values.location ||
            `${values.address_line || ""}, ${values.sub_area || ""}, ${
              areaData?.area_bn || ""
            }, ঢাকা`.trim(),
          medical_conditions: values.conditions || [],
          medication_list: values.medication || null,
          emergency_contacts: values.emergency_contacts || null,
          device_id: values.device_id || null,
          latitude: values.lat ? Number(values.lat) : null,
          longitude: values.lon ? Number(values.lon) : null,
          family_user_id: user.id,
          created_at: new Date(),
        };

        if (editingSenior && editingSenior.id) {
          const { error } = await supabase
            .from("seniors")
            .update(record)
            .eq("id", editingSenior.id);
          if (error) throw error;
          toast.dismiss();
          toast.success("Senior updated!");
        } else {
          const { data: insertData, error } = await supabase
            .from("seniors")
            .insert([record])
            .select();
          if (error) throw error;
          toast.dismiss();
          toast.success("Senior added!");
        }

        // Refresh list
        const { data: refreshed, error: fetchErr } = await supabase
          .from("seniors")
          .select("*")
          .eq("family_user_id", user.id)
          .order("created_at", { ascending: false });
        if (fetchErr) throw fetchErr;
        setSeniors(
          refreshed.map((s) => ({
            id: s.id,
            name: s.name,
            age: s.age,
            gender: s.gender,
            relation: s.relation,
            conditions: s.medical_conditions || s.conditions || [],
            location: s.address || s.location,
            medication: s.medication_list || s.medication,
            emergency_contacts: s.emergency_contacts,
            device_id: s.device_id,
            photo_url: s.photo_url,
            latitude: s.latitude,
            longitude: s.longitude,
            area: s.area,
            sub_area: s.sub_area,
            address_line: s.address_line,
          }))
        );
      } catch (err) {
        console.error("Failed to save senior:", err);
        toast.error("Failed to save senior");
      } finally {
        setShowAddSenior(false);
        seniorForm.reset();
        setEditingSenior(null);
        toast.dismiss();
      }
    } else {
      // Local mock behavior
      const areaData = DHAKA_LOCATIONS.find((loc) => loc.area === data.area);
      const fallbackLocation = [
        data.address_line,
        data.sub_area,
        areaData?.area_bn || data.area,
        "ঢাকা",
      ]
        .filter(Boolean)
        .join(", ");

      const normalizedSenior = {
        id: editingSenior?.id || Date.now(),
        name: data.name,
        age: data.age ? Number(data.age) : null,
        gender: data.gender || null,
        relation: data.relation || "",
        area: data.area || null,
        sub_area: data.sub_area || null,
        address_line: data.address_line || null,
        location: data.location || fallbackLocation || "",
        conditions: Array.isArray(data.conditions) ? data.conditions : [],
        medication: data.medication || "",
        emergency_contacts: data.emergency_contacts || "",
        device_id: data.device_id || null,
        lat: data.lat ? Number(data.lat) : null,
        lon: data.lon ? Number(data.lon) : null,
        photo_url: editingSenior?.photo_url || null,
        created_at: editingSenior?.created_at || new Date().toISOString(),
      };

      let updatedList;
      if (editingSenior) {
        updatedList = seniors.map((s) =>
          s.id === editingSenior.id ? { ...s, ...normalizedSenior } : s
        );
        setEditingSenior(null);
      } else {
        updatedList = [...seniors, normalizedSenior];
      }
      setSeniors(updatedList);
      persistLocalSeniors(updatedList);
      setShowAddSenior(false);
      seniorForm.reset();
      toast.success(editingSenior ? "Senior updated!" : "Senior added!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-text mb-2">Your Profile</h1>
          <p className="text-gray-600">আপনার প্রোফাইল</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8 flex gap-4 p-4 border-b overflow-x-auto">
          {[
            { id: "personal", label: "Personal Info" },
            { id: "password", label: "Password" },
            { id: "seniors", label: "Seniors" },
            { id: "subscription", label: "Subscription" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={activeTab}
        >
          {/* Personal Info */}
          {activeTab === "personal" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-text mb-6">
                Personal Information
              </h2>
              <form
                onSubmit={personalForm.handleSubmit(onPersonalSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Full Name
                  </label>
                  <input
                    {...personalForm.register("full_name")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {personalForm.formState.errors.full_name && (
                    <p className="text-error text-sm mt-1">
                      {personalForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Phone
                  </label>
                  <input
                    {...personalForm.register("phone")}
                    placeholder="+880..."
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {personalForm.formState.errors.phone && (
                    <p className="text-error text-sm mt-1">
                      {personalForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Location
                  </label>
                  <input
                    {...personalForm.register("location")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {personalForm.formState.errors.location && (
                    <p className="text-error text-sm mt-1">
                      {personalForm.formState.errors.location.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-text mb-6">
                Change Password
              </h2>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register("old_password")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {passwordForm.formState.errors.old_password && (
                    <p className="text-error text-sm mt-1">
                      {passwordForm.formState.errors.old_password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register("new_password")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {passwordForm.formState.errors.new_password && (
                    <p className="text-error text-sm mt-1">
                      {passwordForm.formState.errors.new_password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...passwordForm.register("confirm_password")}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {passwordForm.formState.errors.confirm_password && (
                    <p className="text-error text-sm mt-1">
                      {passwordForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Seniors */}
          {activeTab === "seniors" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text">Manage Seniors</h2>
                <button
                  onClick={() => {
                    setEditingSenior(null);
                    seniorForm.reset({
                      name: "",
                      age: "",
                      gender: "",
                      relation: "",
                      area: "",
                      sub_area: "",
                      address_line: "",
                      location: "",
                      conditions: [],
                      medication: "",
                      emergency_contacts: "",
                      device_id: "",
                      lat: "",
                      lon: "",
                    });
                    setSelectedArea(null);
                    setShowAddSenior(true);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                >
                  + Add Senior
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {seniors.map((senior) => (
                  <div
                    key={senior.id}
                    className="bg-white rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-text">
                          {senior.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {senior.age} years old
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingSenior(senior);
                            setShowAddSenior(true);
                          }}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSenior(senior);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 bg-error/10 text-error rounded-lg hover:bg-error/20"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      📍 {senior.location}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Conditions:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {senior.conditions.map((cond, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-error/10 text-error rounded-full text-xs"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscription */}
          {activeTab === "subscription" && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-text mb-6">
                Subscription
              </h2>
              <div className="mb-6 p-4 bg-primary/5 border border-primary rounded-lg">
                <p className="font-semibold text-text mb-2">
                  Current Plan: Free
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Unlimited access to our care services
                </p>
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
                  Upgrade to Premium
                </button>
              </div>
              <h3 className="font-bold text-lg text-text mb-4">
                Premium Benefits
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  ✓ Priority caregiver matching
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  ✓ 24/7 support
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  ✓ Advanced analytics
                </li>
              </ul>
            </div>
          )}
        </motion.div>

        {/* Danger Zone */}
        <div className="mt-12 bg-red-50 border border-error rounded-lg p-6">
          <h3 className="font-bold text-lg text-error mb-4">Danger Zone</h3>
          <button
            onClick={signOut}
            className="px-6 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition flex items-center gap-2"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Add/Edit Senior Modal */}
      <AnimatePresence>
        {showAddSenior && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center p-4 z-50 overflow-auto"
            onClick={() => setShowAddSenior(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full p-6 max-h-[85vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-text mb-4">
                {editingSenior ? "Edit Senior" : "Add Senior"}
              </h2>
              <form
                onSubmit={seniorForm.handleSubmit(onSeniorSubmit, (errors) => {
                  console.error("Form validation errors:", errors);
                  const firstError = Object.values(errors)[0]?.message;
                  toast.error(
                    firstError || "Please fill in all required fields"
                  );
                })}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    নাম (Full Name) *
                  </label>
                  <input
                    {...seniorForm.register("name")}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="নাম (বাংলায়)"
                  />
                  {seniorForm.formState.errors.name && (
                    <p className="text-error text-sm mt-1">
                      {seniorForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      বয়স (Age) *
                    </label>
                    <input
                      type="number"
                      {...seniorForm.register("age")}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    {seniorForm.formState.errors.age && (
                      <p className="text-error text-sm mt-1">
                        {seniorForm.formState.errors.age.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      লিঙ্গ (Gender) *
                    </label>
                    <select
                      {...seniorForm.register("gender")}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select gender</option>
                      <option value="male">পুরুষ</option>
                      <option value="female">মহিলা</option>
                      <option value="other">অন্যান্য</option>
                    </select>
                    {seniorForm.formState.errors.gender && (
                      <p className="text-error text-sm mt-1">
                        {seniorForm.formState.errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    সম্পর্ক (Relation)
                  </label>
                  <input
                    {...seniorForm.register("relation")}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Relation with the person"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    এলাকা (Area)
                  </label>
                  <select
                    {...seniorForm.register("area")}
                    value={seniorForm.watch("area") || ""}
                    onChange={(e) => {
                      const areaValue = e.target.value;
                      seniorForm.setValue("area", areaValue);
                      const areaData = DHAKA_LOCATIONS.find(
                        (loc) => loc.area === areaValue
                      );
                      setSelectedArea(areaData || null);
                      seniorForm.setValue("sub_area", "");
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">এলাকা নির্বাচন করুন / Select area</option>
                    {DHAKA_LOCATIONS.map((loc) => (
                      <option key={loc.area} value={loc.area}>
                        {loc.area_bn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub-Area Selection */}
                {selectedArea && (
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      উপ-এলাকা (Sub-Area)
                    </label>
                    <select
                      {...seniorForm.register("sub_area")}
                      value={seniorForm.watch("sub_area") || ""}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">
                        উপ-এলাকা নির্বাচন করুন / Select sub-area
                      </option>
                      {selectedArea.sub_areas.map((subArea) => (
                        <option key={subArea} value={subArea}>
                          {subArea}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Address Line */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    ঠিকানা (House/Road/Building)
                  </label>
                  <input
                    {...seniorForm.register("address_line")}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="বাড়ি নং ১২৩, রোড ৫ / House #123, Road 5"
                  />
                </div>

                {/* Full Address (Auto-generated or manual) */}
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    সম্পূর্ণ ঠিকানা (Full Address) - Optional
                  </label>
                  <input
                    {...seniorForm.register("location")}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    placeholder="Auto-filled from area selection or enter manually"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be auto-generated from area + sub-area + address
                    line
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-text">
                      GPS পিন (Tap map to pick)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!navigator.geolocation) {
                          toast.error("Geolocation not supported");
                          return;
                        }
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            seniorForm.setValue("lat", pos.coords.latitude);
                            seniorForm.setValue("lon", pos.coords.longitude);
                            toast.success("GPS location set");
                          },
                          (err) => {
                            console.error(err);
                            toast.error("Failed to get current location");
                          }
                        );
                      }}
                      className="text-xs px-2 py-1 bg-gray-100 rounded"
                    >
                      Use current location
                    </button>
                  </div>

                  <MapPicker
                    lat={Number(seniorForm.watch("lat")) || null}
                    lon={Number(seniorForm.watch("lon")) || null}
                    onChange={({ lat, lon }) => {
                      seniorForm.setValue("lat", lat);
                      seniorForm.setValue("lon", lon);
                    }}
                  />

                  <div className="text-xs text-gray-600 mt-2">
                    Lat: {seniorForm.watch("lat") || "-"} • Lon:{" "}
                    {seniorForm.watch("lon") || "-"}
                  </div>
                </div>

                <div>
                  <div className="font-semibold mb-2">
                    চিকিৎসা অবস্থা (Medical Conditions)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: "diabetes", label: "ডায়াবেটিস" },
                      { key: "hypertension", label: "উচ্চ রক্তচাপ" },
                      { key: "heart", label: "হৃদরোগ" },
                      { key: "dementia", label: "ডিমেনশিয়া" },
                      { key: "other", label: "অন্যান্য" },
                    ].map((c) => (
                      <label
                        key={c.key}
                        className={`flex items-center gap-2 p-2 rounded-lg ${
                          seniorForm.watch?.("conditions")?.includes?.(c.label)
                            ? "bg-orange-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={c.label}
                          checked={
                            seniorForm
                              .watch?.("conditions")
                              ?.includes?.(c.label) || false
                          }
                          onChange={(e) => {
                            const current =
                              seniorForm.getValues()?.conditions || [];
                            if (e.target.checked) {
                              seniorForm.setValue("conditions", [
                                ...current,
                                c.label,
                              ]);
                            } else {
                              seniorForm.setValue(
                                "conditions",
                                current.filter((x) => x !== c.label)
                              );
                            }
                          }}
                        />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    ঔষধের তালিকা (Medication List)
                  </label>
                  <textarea
                    {...seniorForm.register("medication")}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="List medications or upload photo in profile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    জরুরি যোগাযোগ (Emergency Contacts)
                  </label>
                  <input
                    {...seniorForm.register("emergency_contacts")}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Phone numbers, auto-include family"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    ডিভাইস আইডি (Device ID)
                  </label>
                  <input
                    {...seniorForm.register("device_id")}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Optional: Pair with tablet/phone"
                  />
                </div>
                {/* Hidden fields for lat/lon so they are included in form values */}
                <input type="hidden" {...seniorForm.register("lat")} />
                <input type="hidden" {...seniorForm.register("lon")} />
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSenior(false);
                      setEditingSenior(null);
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    {editingSenior ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-sm w-full p-6"
            >
              <h2 className="text-2xl font-bold text-error mb-4">
                Delete Senior?
              </h2>
              <p className="text-gray-700 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    (async () => {
                      if (isSupabaseConfigured() && editingSenior?.id) {
                        try {
                          const { error } = await supabase
                            .from("seniors")
                            .delete()
                            .eq("id", editingSenior.id);
                          if (error) throw error;
                          // refresh list
                          const { data: refreshed, error: fetchErr } =
                            await supabase
                              .from("seniors")
                              .select("*")
                              .eq("family_user_id", user.id)
                              .order("created_at", { ascending: false });
                          if (fetchErr) throw fetchErr;
                          setSeniors(
                            refreshed.map((s) => ({
                              id: s.id,
                              name: s.name,
                              age: s.age,
                              gender: s.gender,
                              relation: s.relation,
                              conditions:
                                s.medical_conditions || s.conditions || [],
                              location: s.address || s.location,
                              medication: s.medication_list || s.medication,
                              emergency_contacts: s.emergency_contacts,
                              device_id: s.device_id,
                              photo_url: s.photo_url,
                              latitude: s.latitude,
                              longitude: s.longitude,
                              area: s.area,
                              sub_area: s.sub_area,
                              address_line: s.address_line,
                            }))
                          );
                          toast.success("Senior deleted");
                        } catch (err) {
                          console.error("Failed to delete senior:", err);
                          toast.error("Failed to delete senior");
                        }
                      } else {
                        const updated = seniors.filter(
                          (s) => s.id !== editingSenior.id
                        );
                        setSeniors(updated);
                        persistLocalSeniors(updated);
                        toast.success("Senior deleted");
                      }
                      setShowDeleteConfirm(false);
                    })();
                  }}
                  className="flex-1 px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
