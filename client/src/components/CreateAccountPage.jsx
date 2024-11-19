import React, { useState } from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
export const CreateAccountPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, firstName, lastName, username, password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    fetch("http://localhost:5050/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password, firstName, lastName }),
    })
      .then((res) => {
        if (res.ok) {
          alert("Account created successfully. Please log in.");
          window.location = "/login";
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred. Please try again later.");
      });
  };
  return (
    <div className="min-h-screen w-full bg-[#FAF6EF] flex flex-col items-center p-4">
      <div className="w-full max-w-md absolute top-4 left-4">
        <Link to="/">
        <button className="text-2xl">&#x2190;</button>
        </Link>
      </div>
      <div className="flex flex-col items-center">
        <Link to="/"><img src={logo} alt="Bitescript Logo" className="h-24 mb-4"></img></Link>
        <h1
          className="font-handwritten text-4xl mb-6"
          style={{ fontFamily: '"Just Me Again Down Here", cursive' }}
        >
          sign up
        </h1>
      </div>

      <form
        className="w-full max-w-md flex flex-col space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="flex space-x-4">
          <input
            type="text"
            name="firstName"
            placeholder="first name"
            value={formData.firstName}
            onChange={handleChange}
            className="flex-1 bg-white border border-black rounded-full px-4 py-3 placeholder-gray-400 text-center"
          />
          <input
            type="text"
            name="lastName"
            placeholder="last name"
            value={formData.lastName}
            onChange={handleChange}
            className="flex-1 bg-white border border-black rounded-full px-4 py-3 placeholder-gray-400 text-center"
          />
        </div>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full bg-white border border-black rounded-full px-4 py-3 placeholder-gray-400 text-center"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-white border border-black rounded-full px-4 py-3 placeholder-gray-400 text-center"
        />
        <input
          type="password"
          name="password"
          placeholder="new password"
          value={formData.password}
          onChange={handleChange}
          className="w-full bg-white border border-black rounded-full px-4 py-3 placeholder-gray-400 text-center"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full bg-white border border-black rounded-full px-4 py-3 placeholder-gray-400 text-center"
        />
        <button
          type="submit"
          className="bg-[#DFB839] text-black px-8 py-4 rounded-full font-semibold text-lg mt-6"
        >
          enter
        </button>
      </form>
    </div>
  );
};

export default CreateAccountPage;
