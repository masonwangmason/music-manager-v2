import { useState } from "react";

function SongCreator({ onClose, projectId, onSongAdded }) {
  // Add onSongAdded prop
  const [songName, setSongName] = useState("");
  const [songCollaborators, setSongCollaborators] = useState("");
  const [songInstrumental, setSongInstrumental] = useState("");
  const [songLyrics, setSongLyrics] = useState("");
  const [uploading, setUploading] = useState(false);
  const [songDuration, setSongDuration] = useState(""); // Add state for song duration

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const cloudName = "df11www4b";
    const uploadPreset = "music-manager";

    if (file) {
      setUploading(true);
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
        setSongInstrumental(data.secure_url); // Set the uploaded file URL
        console.log("Uploaded instrumental:", data.secure_url);

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
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    // Use snake_case for property names to match database schema
    // Include project_id in the song data
    const songData = {
      song_name: songName,
      song_collaborators: songCollaborators,
      song_instrumental: songInstrumental,
      song_lyrics: songLyrics,
      song_duration: songDuration,
      project_id: projectId, // Add the project ID from props
    };

    console.log("Sending song data with project_id:", songData);

    try {
      const response = await fetch(`/api/projects/${projectId}/songs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(songData),
      });

      if (response.ok) {
        const newSong = await response.json();
        console.log("Song saved:", newSong);
        onSongAdded(newSong); // Call the callback with the new song
        onClose(); // Close the form after saving
      } else {
        console.error("Failed to save song");
      }
    } catch (error) {
      console.error("Error saving song:", error);
    }
  };

  return (
    <div className="w-full font-mono">
      <form
        className="flex flex-col gap-4 bg-black"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Song Name Input */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            SONG NAME
          </label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="ENTER SONG NAME"
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400"
            required
          />
        </div>

        {/* Song Collaborators Input */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            SONG COLLABORATORS
          </label>
          <input
            type="text"
            value={songCollaborators}
            onChange={(e) => setSongCollaborators(e.target.value)}
            placeholder="ENTER SONG COLLABORATORS"
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400"
          />
        </div>

        {/* Song Instrumental Upload */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            UPLOAD INSTRUMENTAL
          </label>
          <input
            type="file"
            accept="audio/*"
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 cursor-pointer"
            onChange={handleFileChange}
          />
          {uploading && <p className="text-slate-50">UPLOADING...</p>}
        </div>

        {/* Song Lyrics Input */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            SONG LYRICS
          </label>
          <textarea
            value={songLyrics}
            onChange={(e) => setSongLyrics(e.target.value)}
            placeholder="ENTER SONG LYRICS"
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400 h-24"
          />
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-end mt-4 gap-3">
          <button
            type="button"
            className="bg-black text-slate-50 py-2 px-4 rounded-md border-2 border-slate-50 hover:bg-slate-50 hover:text-slate-950 font-mono"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="bg-black text-slate-50 py-2 px-4 rounded-md border-2 border-slate-50 hover:bg-slate-50 hover:text-slate-950 font-mono"
            disabled={uploading}
          >
            {uploading ? "SAVING..." : "SAVE SONG"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SongCreator;
