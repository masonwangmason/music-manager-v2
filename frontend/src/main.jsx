import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import PlayerBar from "./PlayerBar";
import NavBar from "./NavBar"; // Import NavBar
import defaultBeatCover from "./assets/headphone.png"; // Import a default image for beats

function Main() {
  const [currentSongUrl, setCurrentSongUrl] = useState("");
  const [currentSongName, setCurrentSongName] = useState("");
  const [currentCollaboratorName, setCurrentCollaboratorName] = useState("");
  const [currentProjectCover, setCurrentProjectCover] = useState("");

  // This function now handles both songs and beats
  const handlePlay = (
    url,
    name,
    authorOrCollaborator, // Can be song collaborator or beat author
    cover // Can be project cover or null/default for beats
  ) => {
    setCurrentSongUrl(url);
    setCurrentSongName(name);
    setCurrentCollaboratorName(authorOrCollaborator);
    // Use the provided cover, or the default beat cover if none is provided
    setCurrentProjectCover(cover || defaultBeatCover);
  };

  return (
    <BrowserRouter>
      <div className="app-container flex flex-col min-h-screen">
        {" "}
        {/* Ensure container takes full height */}
        <NavBar /> {/* Add NavBar at the top */}
        {/* Main Content Area */}
        <div className="main-content flex-grow pt-16">
          {/* Pass the unified handlePlay function */}
          <App onPlayItem={handlePlay} />
        </div>
        {/* Player Bar - Remains at the bottom */}
        <PlayerBar
          songUrl={currentSongUrl}
          songName={currentSongName}
          // Pass the author/collaborator name to the PlayerBar
          collaboratorName={currentCollaboratorName}
          projectCover={currentProjectCover} // Pass the potentially default cover
        />
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
