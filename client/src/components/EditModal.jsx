import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const EditModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });

  // Reset form data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: "",
        confirmPassword: "",
        picture: user.picture || "",
      });
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Remove empty fields and confirmPassword
    const updateData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value && key !== "confirmPassword") {
        acc[key] = value;
      }
      return acc;
    }, {});

    try {
      const response = await fetch(
        `http://localhost:5050/api/users/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        onUpdate(updatedUser);
        toast.success("Profile updated successfully!", {
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#333",
          },
        });
        setTimeout(onClose, 1000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-right" />
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-[#EAE8E0] rounded-3xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
          >
            ×
          </button>

          <h3
            className="font-handwritten text-3xl mb-6"
            style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
          >
            Edit Profile
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-white border border-gray-200"
                  placeholder="First Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-white border border-gray-200"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg bg-white border border-gray-200"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL
              </label>
              <input
                type="text"
                name="picture"
                value={formData.picture}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg bg-white border border-gray-200"
                placeholder="Picture URL"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-white border border-gray-200"
                  placeholder="New Password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-white border border-gray-200"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 rounded-full hover:bg-gray-800 transition-colors mt-4"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditModal;