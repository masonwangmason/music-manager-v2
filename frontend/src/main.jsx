import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import PlayerBar from "./PlayerBar";
import NavBar from "./NavBar"; // Import NavBar

function Main() {
  const [currentSongUrl, setCurrentSongUrl] = useState("");
  const [currentSongName, setCurrentSongName] = useState("");
  const [currentCollaboratorName, setCurrentCollaboratorName] = useState("");
  const [currentProjectCover, setCurrentProjectCover] = useState("");

  const handlePlaySong = (
    songUrl,
    songName,
    collaboratorName,
    projectCover
  ) => {
    setCurrentSongUrl(songUrl);
    setCurrentSongName(songName);
    setCurrentCollaboratorName(collaboratorName);
    setCurrentProjectCover(projectCover);
  };

  return (
    <BrowserRouter>
      <div className="app-container flex flex-col min-h-screen"> {/* Ensure container takes full height */}
        <NavBar /> {/* Add NavBar at the top */}

        {/* Main Content Area with padding top to avoid overlap with fixed NavBar */}
        <div className="main-content flex-grow pt-16"> {/* Added pt-16 and flex-grow */}
          <App onPlaySong={handlePlaySong} /> {/* Pass handlePlaySong to App */}
        </div>

        {/* Player Bar - Remains at the bottom */}
        <PlayerBar
          songUrl={currentSongUrl}
          songName={currentSongName}
          collaboratorName={currentCollaboratorName}
          projectCover={currentProjectCover}
        />
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
