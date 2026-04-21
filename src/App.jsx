import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./globalbackground";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Background />} />
        
      </Routes>
    </Router>
  );
}

export default App;