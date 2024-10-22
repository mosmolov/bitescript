import logo from "../logo.png";
import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const LoginPage = ({setUser}) => {
  const [formData, setFormData] = React.useState({
    username: "",
    password: ""
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    fetch("http://localhost:5050/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.message);
        } else {
          setUser(data.user);
          // TODO: instead of navigate to home, navigate to last page in hisory
          // ex: if they want to follow someone, they get navigated back to page after log in
          localStorage.setItem("token", data.token)
          navigate(`../users/${data.user._id}`, { relative: "path" });
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6EF] flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <Link to="/">
        <button className="text-2xl mb-4">&#x2190;</button>
        </Link>
      </div>
      <div className="flex flex-col items-center">
      <Link to="/"><img src={logo} alt="Bitescript Logo" className="h-24 mb-4"></img></Link>
        <h1 className="font-handwritten text-4xl mb-6">login</h1>
      </div>

      <form className="w-full max-w-md flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full bg-white border border-black rounded-full px-4 py-3 placeholder-gray-400 text-center"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
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

export default LoginPage;
