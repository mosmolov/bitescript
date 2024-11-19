import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage'
import CreateAccountPage from './components/CreateAccountPage'
import Home from './components/Home';
import RestaurantLookUpPage from "./components/RestaurantLookup";
import ProfilePage from './components/ProfilePage';
import Feed from './components/Feed';
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user}/>} />
        <Route path="/login" element={<LoginPage setUser={setUser}/>} />
        <Route path="/create-account" element={<CreateAccountPage/>} />
        <Route path="/users/:id" element={<ProfilePage user={user}/>} />
        <Route path="/search" element={<RestaurantLookUpPage />} />
        <Route path="/feed" element={<Feed/>} />
      </Routes>
    </Router>
  );
}
export default App;