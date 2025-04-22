import { Routes, Route } from "react-router-dom";
import ProjectOverview from "./ProjectOverview";
import ProjectView from "./ProjectView";
import Instructions from "./Instructions"; // Import the Instructions component
import Beats from "./Beats"; // Import the Beats component

// Receive the unified handler as onPlayItem
function App({ onPlayItem }) {
  return (
    <Routes>
      <Route path="/" element={<ProjectOverview />} />
      <Route
        path="/project/:id"
        // Pass it down as onPlaySong for ProjectView
        element={<ProjectView onPlaySong={onPlayItem} />}
      />
      <Route path="/instructions" element={<Instructions />} />
      {/* Pass it down as onPlayBeat for Beats */}
      <Route path="/beats" element={<Beats onPlayBeat={onPlayItem} />} />
    </Routes>
  );
}

export default App;
