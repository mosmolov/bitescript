import { BrowserRouter as Router, Routes ,Route } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage'
import CreateAccountPage from './components/CreateAccountPage'
import Home from './components/Home';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/*routes login page and create account page from the home page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
      </Routes>
    </Router>
  );
}
export default App;