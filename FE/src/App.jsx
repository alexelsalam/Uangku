import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Transaksi } from "./pages/Transaksi.jsx";
import { Data } from "./pages/Data.jsx";
import { Nav } from "./components/Nav.jsx";
function App() {

  return (
    <>
    <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/transaksi" element={<Transaksi />} />
            <Route path="/data" element={<Data />} />
          </Routes>
          <Nav />
        </Router>
    
    </>
  )
}

export default App
