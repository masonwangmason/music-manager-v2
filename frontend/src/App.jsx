import { Routes, Route } from "react-router-dom";
import ProjectOverview from "./ProjectOverview";
import ProjectView from "./ProjectView";
import Instructions from "./Instructions"; // Import the Instructions component

function App({ onPlaySong }) {
  return (
    <Routes>
      <Route path="/" element={<ProjectOverview />} />
      <Route
        path="/project/:id"
        element={<ProjectView onPlaySong={onPlaySong} />}
      />
      <Route path="/instructions" element={<Instructions />} /> {/* Add route for Instructions */}
    </Routes>
  );
}

export default App;
