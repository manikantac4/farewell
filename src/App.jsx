import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./globalbackground";
import Intro from "./intro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/background" element={<Background />} />
        
      </Routes>
    </Router>
  );
}

export default App;