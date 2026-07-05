import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home.js";
import { Transaksi } from "./pages/Transaksi.js";
import { Data } from "./pages/Data.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Middleware from "./utils/Middleware.js";
import AuthMiddleware from "./utils/AuthMiddleware.js";
import { HomePage } from "./pages/HomePage.js";
import { DetailPage } from "./pages/DetailPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { CategoriesPage } from "./pages/CategoriesPage.js";
import { AddPage } from "./pages/AddPage.js";
import { ReportPage } from "./pages/RaportPage.js";
import { AppProvider } from "./hooks/useAppContext.js";
function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen max-w-sm mx-auto bg-bg relative overflow-hidden shadow-2xl">
        <Router>
          <Routes>
            <Route element={<Middleware />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              {/* <Route path="/home" element={<Home />} /> */}
              {/* <Route path="/transaksi" element={<Transaksi />} /> */}
              <Route path="/data" element={<Data />} />
              <Route path="/Home" element={<HomePage />} />
              <Route path="/transaksi/:id" element={<DetailPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route element={<AuthMiddleware />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Routes>

          {/* <Nav /> */}
        </Router>
        {/* <Analytics /> */}
      </div>
    </AppProvider>
  );
}

export default App;
