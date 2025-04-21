import { useState } from "react";

function SongEditor({ song, onClose, onSave, onDelete }) {
  const [songName, setSongName] = useState(song.song_name || "");
  const [songCollaborators, setSongCollaborators] = useState(
    song.song_collaborators || ""
  );
  const [songInstrumental, setSongInstrumental] = useState(
    song.song_instrumental || ""
  );
  const [songLyrics, setSongLyrics] = useState(song.song_lyrics || "");
  const [songDuration, setSongDuration] = useState(song.song_duration || "");

  // Function to handle file upload
  const handleFileUpload = async (file) => {
    const cloudName = "df11www4b"; // Your Cloudinary cloud name
    const uploadPreset = "music-manager"; // Your upload preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload instrumental");
      }

      const data = await response.json();
      setSongInstrumental(data.secure_url); // Update the state with the new URL

      // Convert duration from seconds to "minutes:seconds" format
      const minutes = Math.floor(data.duration / 60);
      const seconds = Math.floor(data.duration % 60)
        .toString()
        .padStart(2, "0");
      const formattedDuration = `${minutes}:${seconds}`;
      setSongDuration(formattedDuration); // Set the formatted duration
      console.log("Song duration:", formattedDuration);
    } catch (error) {
      console.error("Error uploading instrumental:", error);
    }
  };

  const handleSave = async () => {
    const updatedSong = {
      song_name: songName,
      song_collaborators: songCollaborators,
      song_instrumental: songInstrumental || song.song_instrumental, // Preserve existing instrumental if not updated
      song_lyrics: songLyrics,
      song_duration: songDuration,
      song_id: song.song_id, // Preserve the song_id
      project_id: song.project_id, // Preserve the project_id
    };

    // Debug log to verify the updated song data
    console.log("Updated song data:", updatedSong);

    try {
      const response = await fetch(
        `/api/projects/${song.project_id}/songs/${song.song_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSong),
        }
      );

      if (response.ok) {
        const savedSong = await response.json();
        onSave(savedSong); // Update the UI with the saved song
        onClose();
      } else {
        console.error("Failed to update song");
      }
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center my-5 font-mono">
        <div className="w-full max-w-5xl bg-black p-6 rounded-lg">
          <form
            className="flex gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Left Column: Inputs */}
            <div className="flex flex-col gap-4 w-1/2">
              <div>
                <label className="block font-semibold mb-1 text-left text-slate-50">
                  SONG NAME
                </label>
                <input
                  type="text"
                  className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  placeholder="ENTER SONG NAME"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-left text-slate-50">
                  COLLABORATORS
                </label>
                <input
                  type="text"
                  className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400"
                  value={songCollaborators}
                  onChange={(e) => setSongCollaborators(e.target.value)}
                  placeholder="ENTER COLLABORATORS"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-left text-slate-50">
                  INSTRUMENTAL
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                />
              </div>
            </div>
            {/* Right Column: Lyrics Textarea */}
            <div className="w-1/2">
              <label className="block font-semibold mb-1 text-left text-slate-50">
                LYRICS
              </label>
              <textarea
                className="border p-2 rounded w-full h-48 bg-black text-slate-50 border-slate-50 placeholder-gray-400"
                value={songLyrics}
                onChange={(e) => setSongLyrics(e.target.value)}
                placeholder="TYPE LYRICS HERE..."
              ></textarea>
            </div>
          </form>
          <div className="flex justify-end mt-4 gap-3">
            <button
              type="button"
              className="bg-black text-slate-50 py-2 px-4 rounded-md border-2 border-slate-50 hover:bg-slate-50 hover:text-slate-950 font-mono"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded-md border-2 border-red-600 hover:bg-red-600 hover:text-slate-950 font-mono"
              onClick={() => onDelete(song.song_id)}
            >
              DELETE SONG
            </button>
            <button
              type="button"
              className="bg-black text-slate-50 py-2 px-4 rounded-md border-2 border-slate-50 hover:bg-slate-50 hover:text-slate-950 font-mono"
              onClick={handleSave}
            >
              SAVE SONG
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default SongEditor;
