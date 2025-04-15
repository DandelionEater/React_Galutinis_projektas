import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyList from './pages/MyList';
import Browse from './pages/Browse';
import Account from './pages/Account';
import WelcomeScreen from './pages/WelcomeScreen';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SelectedMedia from './pages/SelectedMedia';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  console.log("App mato user:", user);

  return (
    <Router>
      {!user ? (
        <WelcomeScreen />
      ) : (
        <>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-list" element={<MyList />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/account" element={<Account />} />
              <Route path="/welcome" element={<WelcomeScreen />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/media/:id" element={<SelectedMedia />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}

export default App;
