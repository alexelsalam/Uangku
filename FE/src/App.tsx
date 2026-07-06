import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Middleware from "./utils/Middleware.js";
import AuthMiddleware from "./utils/AuthMiddleware.js";
import { HomePage } from "./pages/HomePage.js";
import { DetailPage } from "./pages/DetailPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { CategoriesPage } from "./pages/CategoriesPage.js";
import { AddPage } from "./pages/AddPage.js";
import { ReportPage } from "./pages/RaportPage.js";
import { AppProvider } from "./hooks/useAppContext.js";
import { LoginPage } from "./pages/LoginPage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
function App() {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen max-w-sm mx-auto bg-bg relative overflow-hidden shadow-2xl">
        <Router>
          <Routes>
            <Route element={<Middleware />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/Home" element={<HomePage />} />
              <Route path="/transaksi/:id" element={<DetailPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/add" element={<AddPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route element={<AuthMiddleware />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
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
