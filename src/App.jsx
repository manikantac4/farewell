import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./globalbackground";
import Intro from "./intro";
import Quiz from "./quiz";
import ResultsDashboard from "./resultsdashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/background" element={<Background />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<ResultsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;