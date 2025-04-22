import { Routes, Route } from "react-router-dom";
import ProjectOverview from "./ProjectOverview";
import ProjectView from "./ProjectView";
import Instructions from "./Instructions";
import Beats from "./Beats";

function App({ onPlayItem }) {
  return (
    <Routes>
      <Route path="/" element={<ProjectOverview />} />
      <Route
        path="/project/:id"
        element={<ProjectView onPlaySong={onPlayItem} />}
      />
      <Route path="/instructions" element={<Instructions />} />
      <Route path="/beats" element={<Beats onPlayBeat={onPlayItem} />} />
    </Routes>
  );
}

export default App;
