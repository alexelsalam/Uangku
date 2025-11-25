import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Transaksi } from "./pages/Transaksi.jsx";
import { Data } from "./pages/Data.jsx";
import { Nav } from "./components/Nav.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Middleware from "./utils/Middleware.jsx";
import AuthMiddleware from "./utils/AuthMiddleware.jsx";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Middleware />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/data" element={<Data />} />
          </Route>
          <Route element={<AuthMiddleware />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
        <Nav />
      </Router>
    </>
  );
}

export default App;
