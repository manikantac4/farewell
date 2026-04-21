import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./globalbackground";
import Intro from "./intro";
import Quiz from "./quiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/background" element={<Background />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;