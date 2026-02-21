import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api";
import { Flash } from "../components/Flash";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState(null);
  const [activeTab, setActiveTab] = useState("personal"); // personal, password
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: ""
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch profile data on mount
  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setFormData({
          username: response.data.user.username || "",
          email: response.data.user.email || "",
          firstName: response.data.user.firstName || "",
          lastName: response.data.user.lastName || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || "",
          city: response.data.user.city || "",
          country: response.data.user.country || ""
        });
      }
    } catch (error) {
      setFlash({ type: "error", message: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitPersonal = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country
      };

      const response = await authAPI.updateProfile(updateData);
      if (response.data.success) {
        setFlash({ type: "success", message: "Profile updated successfully!" });
        setTimeout(() => {
          setFlash(null);
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update profile";
      setFlash({ type: "error", message: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setFlash({ type: "error", message: "New passwords do not match" });
        setSaving(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setFlash({ type: "error", message: "Password must be at least 6 characters long" });
        setSaving(false);
        return;
      }

      const response = await authAPI.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      if (response.data.success) {
        setFlash({ type: "success", message: "Password changed successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setFlash(null);
        }, 3000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password";
      setFlash({ type: "error", message: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const getInputClasses = () =>
    "w-full px-4 py-3 border border-gray-100 bg-gray-50 focus:border-red-500 focus:bg-white text-gray-900 rounded-xl transition-all outline-none";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12">
      {flash && <Flash flash={flash} onDismiss={() => setFlash(null)} />}
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-500">Manage your account settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-6 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "personal"
                ? "text-red-500 border-red-500"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 font-semibold transition-all border-b-2 ${
              activeTab === "password"
                ? "text-red-500 border-red-500"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <form
            onSubmit={handleSubmitPersonal}
            className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6"
          >
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className={getInputClasses()}
                required
              />
            </div>

            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={getInputClasses()}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={getInputClasses()}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={getInputClasses()}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={getInputClasses()}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter street address"
                className={getInputClasses()}
              />
            </div>

            {/* City and Country Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={getInputClasses()}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter country"
                  className={getInputClasses()}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold bg-white transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form
            onSubmit={handleSubmitPassword}
            className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6"
          >
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">🔒 Security:</span> To change your password, you'll need to verify with your current password.
              </p>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                className={getInputClasses()}
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 6 characters)"
                className={getInputClasses()}
                required
              />
              <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters long</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                className={getInputClasses()}
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })}
                className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold bg-white transition-all hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
