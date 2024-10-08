import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage'
import CreateAccountPage from './components/Create-Account-Page';
import LandingPage from './components/User-Auth-LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/*routes login page and create account page from the home page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
      </Routes>
    </Router>
  );
}
export default App;