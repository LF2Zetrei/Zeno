import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerifyComplete from "./pages/VerifyComplete"; // ou le bon chemin

function App() {
  return (
    <Router>
      <Routes>
        {/* tes autres routes */}
        <Route path="/verify-complete" element={<VerifyComplete />} />
      </Routes>
    </Router>
  );
}

export default App;
