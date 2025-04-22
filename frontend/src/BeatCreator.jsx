import { useState } from "react";

function BeatCreator({ onClose, onBeatAdded }) {
  const [beatName, setBeatName] = useState("");
  const [beatAuthor, setBeatAuthor] = useState("");
  const [beatBpm, setBeatBpm] = useState("");
  const [beatInstrumental, setBeatInstrumental] = useState("");
  const [beatLength, setBeatLength] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Handle instrumental file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const cloudName = "df11www4b";
    const uploadPreset = "music-manager";

    if (file) {
      setUploading(true);
      setError("");
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
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || "Failed to upload instrumental"
          );
        }

        const data = await response.json();
        setBeatInstrumental(data.secure_url); // Set the uploaded file URL

        // Format duration
        const minutes = Math.floor(data.duration / 60);
        const seconds = Math.floor(data.duration % 60)
          .toString()
          .padStart(2, "0");
        const formattedDuration = `${minutes}:${seconds}`;
        setBeatLength(formattedDuration); // Set the formatted duration

        console.log("Uploaded instrumental:", data.secure_url);
        console.log("Beat duration:", formattedDuration);
      } catch (error) {
        console.error("Error uploading instrumental:", error);
        setError(`Upload failed: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle saving the new beat
  const handleSave = async () => {
    if (!beatName || !beatAuthor || !beatBpm) {
      setError("Please fill in Beat Name, Author, and BPM.");
      return;
    }
    setError(""); // Clear error

    const beatData = {
      beat_name: beatName,
      beat_author: beatAuthor,
      beat_bpm: beatBpm,
      beat_instrumental: beatInstrumental,
      beat_length: beatLength,
      // The backend will generate the 'id'
    };

    try {
      const response = await fetch("/api/beats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(beatData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const newBeat = await response.json();
      onBeatAdded(newBeat);
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving beat:", error);
      setError(`Failed to save beat: ${error.message}`);
    }
  };

  return (
    // Modal container - Adjusted background opacity and centering
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      {/* Modal content box */}
      <div className="bg-black p-6 rounded-lg shadow-xl w-full max-w-lg relative mx-4">
        {" "}
        {/* Increased max-w slightly */}
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 text-2xl font-bold leading-none" // Adjusted positioning and styling
          aria-label="Close"
        >
          &times;
        </button>
        {/* Title */}
        <h2 className="font-mono text-2xl font-bold mb-5 text-slate-50 text-left">
          CREATE NEW BEAT
        </h2>{" "}
        {/* Increased bottom margin */}
        {/* Error Message Area */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}{" "}
        {/* Adjusted bottom margin */}
        {/* Form Fields  */}
        {/* Beat Name Field */}
        <div className="mb-4 flex items-center">
          <label
            className="text-slate-300 text-sm font-bold mr-4 w-20 text-right"
            htmlFor="beatName"
          >
            Beat Name
          </label>
          <input
            id="beatName"
            type="text"
            value={beatName}
            onChange={(e) => setBeatName(e.target.value)}
            // Adjusted width to flex-grow
            className="flex-grow shadow-sm appearance-none border border-slate-600 rounded py-2 px-3 bg-slate-700 text-slate-50 leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            required
          />
        </div>
        {/* Author Field */}
        <div className="mb-4 flex items-center">
          <label
            className="text-slate-300 text-sm font-bold mr-4 w-20 text-right"
            htmlFor="beatAuthor"
          >
            Author
          </label>
          <input
            id="beatAuthor"
            type="text"
            value={beatAuthor}
            onChange={(e) => setBeatAuthor(e.target.value)}
            className="flex-grow shadow-sm appearance-none border border-slate-600 rounded py-2 px-3 bg-slate-700 text-slate-50 leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            required
          />
        </div>
        {/* BPM Field */}
        <div className="mb-4 flex items-center">
          <label
            className="block text-slate-300 text-sm font-bold mr-4 w-20 text-right"
            htmlFor="beatBpm"
          >
            BPM
          </label>
          <input
            id="beatBpm"
            type="number"
            value={beatBpm}
            onChange={(e) => setBeatBpm(e.target.value)}
            className="flex-grow shadow-sm appearance-none border border-slate-600 rounded py-2 px-3 bg-slate-700 text-slate-50 leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            required
          />
        </div>
        {/* File Input */}
        <div className="mb-6">
          <label
            className="block text-slate-300 text-sm font-bold mb-2"
            htmlFor="beatInstrumental"
          >
            Instrumental File
          </label>
          <input
            id="beatInstrumental"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-600 file:text-slate-50
              hover:file:bg-violet-700 cursor-pointer"
          />
          {/* Uploading/Success messages */}
          {uploading && (
            <p className="text-slate-400 text-sm mt-2">Uploading...</p>
          )}
          {beatInstrumental && !uploading && (
            <p className="text-green-500 text-sm mt-2">
              Upload complete. Duration: {beatLength}
            </p>
          )}
        </div>
        {/* Action Buttons - Adjusted gap and margin-top */}
        <div className="flex items-center justify-end gap-4 mt-6">
          {" "}
          {/* Added mt-6, adjusted gap */}
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-slate-50 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50"
            type="button"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Save Beat"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeatCreator;
