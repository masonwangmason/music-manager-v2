import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import PlayerBar from "./PlayerBar";

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
      <div className="app-container">
        {/* Main Content */}
        <div className="main-content">
          <App onPlaySong={handlePlaySong} /> {/* Pass handlePlaySong to App */}
        </div>

        {/* Player Bar */}
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
