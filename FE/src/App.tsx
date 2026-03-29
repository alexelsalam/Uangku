import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.js";
import { Transaksi } from "./pages/Transaksi.js";
import { Data } from "./pages/Data.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Middleware from "./utils/Middleware.js";
import AuthMiddleware from "./utils/AuthMiddleware.js";
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

        {/* <Nav /> */}
      </Router>
    </>
  );
}

export default App;
