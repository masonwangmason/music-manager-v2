import { useState, useEffect } from "react";

function BeatEditor({ beat, onClose, onBeatUpdated, onBeatDeleted }) {
  // Initialize state with the beat data passed in props
  const [beatName, setBeatName] = useState(beat.beat_name || "");
  const [beatAuthor, setBeatAuthor] = useState(beat.beat_author || "");
  const [beatBpm, setBeatBpm] = useState(beat.beat_bpm || "");
  const [beatInstrumental, setBeatInstrumental] = useState(beat.beat_instrumental || "");
  const [beatLength, setBeatLength] = useState(beat.beat_length || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false); // State for delete confirmation

  // Effect to update state if the beat prop changes (though typically modal opens with one beat)
  useEffect(() => {
    setBeatName(beat.beat_name || "");
    setBeatAuthor(beat.beat_author || "");
    setBeatBpm(beat.beat_bpm || "");
    setBeatInstrumental(beat.beat_instrumental || "");
    setBeatLength(beat.beat_length || "");
    setError(""); // Clear errors when beat changes
    setIsDeleting(false); // Reset delete confirmation
  }, [beat]);

  // Handle instrumental file upload (same as BeatCreator)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const cloudName = "df11www4b"; // Replace with your Cloudinary cloud name
    const uploadPreset = "music-manager"; // Replace with your upload preset

    if (file) {
      setUploading(true);
      setError("");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
          { method: "POST", body: formData }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Failed to upload");
        }
        const data = await response.json();
        setBeatInstrumental(data.secure_url);
        const minutes = Math.floor(data.duration / 60);
        const seconds = Math.floor(data.duration % 60).toString().padStart(2, "0");
        setBeatLength(`${minutes}:${seconds}`);
        console.log("Uploaded new instrumental:", data.secure_url);
      } catch (error) {
        console.error("Error uploading instrumental:", error);
        setError(`Upload failed: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle updating the beat
  const handleUpdate = async () => {
    if (!beatName || !beatAuthor || !beatBpm) {
      setError("Please fill in Beat Name, Author, and BPM.");
      return;
    }
    setError("");

    const updatedBeatData = {
      beat_name: beatName,
      beat_author: beatAuthor,
      beat_bpm: beatBpm,
      beat_instrumental: beatInstrumental,
      beat_length: beatLength,
    };

    try {
      const response = await fetch(`/api/beats/${beat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBeatData),
      });

      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
        throw new Error(errorMsg);
        }
      }

      // Only parse JSON once
      const updatedBeat = await response.json();
      if (!updatedBeat.id && beat.id) updatedBeat.id = beat.id;

      if (typeof onBeatUpdated === "function") {
        onBeatUpdated(updatedBeat);
      }
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      console.error("Error updating beat:", error);
      setError(`Failed to update beat: ${error.message}`);
    }
  };

  // Handle deleting the beat
  const handleDelete = async () => {
    setError(""); // Clear previous errors
    try {
      const response = await fetch(`/api/beats/${beat.id}`, { // Use DELETE and beat's ID
        method: "DELETE",
      });

      if (!response.ok) {
        // Handle 404 specifically if needed
        if (response.status === 404) {
           throw new Error("Beat not found on server.");
        }
        const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty obj
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Check for 204 No Content success status
      if (response.status === 204) {
        onBeatDeleted(beat.id); // Pass the ID of the deleted beat back
        onClose(); // Close modal
      } else {
         // Should not happen with 204, but handle unexpected success response
         const unexpectedData = await response.text();
         console.warn("Unexpected response after delete:", unexpectedData);
         onBeatDeleted(beat.id); // Assume success if status was ok but not 204
         onClose();
      }

    } catch (error) {
      console.error("Error deleting beat:", error);
      setError(`Failed to delete beat: ${error.message}`);
      setIsDeleting(false); // Hide confirmation buttons on error
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-black p-6 rounded-lg shadow-xl w-full max-w-lg relative mx-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 text-2xl font-bold leading-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="font-mono text-2xl font-bold mb-5 text-slate-50 text-left">EDIT BEAT</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Form Fields (same structure as BeatCreator) */}
        <div className="mb-4 flex items-center">
          <label className="text-slate-300 text-sm font-bold mr-4 w-20 text-right" htmlFor="editBeatName">
            Beat Name
          </label>
          <input
            id="editBeatName" // Use unique ID for editor
            type="text"
            value={beatName}
            onChange={(e) => setBeatName(e.target.value)}
            className="flex-grow shadow-sm appearance-none border border-slate-600 rounded py-2 px-3 bg-slate-700 text-slate-50 leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="text-slate-300 text-sm font-bold mr-4 w-20 text-right" htmlFor="editBeatAuthor">
            Author
          </label>
          <input
            id="editBeatAuthor"
            type="text"
            value={beatAuthor}
            onChange={(e) => setBeatAuthor(e.target.value)}
            className="flex-grow shadow-sm appearance-none border border-slate-600 rounded py-2 px-3 bg-slate-700 text-slate-50 leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <label className="block text-slate-300 text-sm font-bold mr-4 w-20 text-right" htmlFor="editBeatBpm">
            BPM
          </label>
          <input
            id="editBeatBpm"
            type="number"
            value={beatBpm}
            onChange={(e) => setBeatBpm(e.target.value)}
            className="flex-grow shadow-sm appearance-none border border-slate-600 rounded py-2 px-3 bg-slate-700 text-slate-50 leading-tight focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="editBeatInstrumentalFile">
            Instrumental File (Upload new to replace)
          </label>
          {/* Display current instrumental URL if available */}
          {beatInstrumental && !uploading && (
             <p className="text-xs text-slate-400 mb-2 truncate">Current: {beatInstrumental}</p>
          )}
          <input
            id="editBeatInstrumentalFile"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-600 file:text-slate-50 hover:file:bg-violet-700 cursor-pointer"
          />
          {uploading && <p className="text-slate-400 text-sm mt-2">Uploading...</p>}
          {beatInstrumental && !uploading && beatLength && (
             <p className="text-green-500 text-sm mt-2">Current duration: {beatLength}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 mt-6"> {/* Use justify-between */}
          {/* Delete Button Area */}
          <div>
            {!isDeleting ? (
              <button
                onClick={() => setIsDeleting(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                type="button"
                disabled={uploading}
              >
                Delete
              </button>
            ) : (
              <div className="flex gap-2 items-center">
                 <span className="text-red-400 text-sm">Are you sure?</span>
                 <button
                    onClick={handleDelete}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold py-1 px-3 rounded text-sm"
                    type="button"
                 >
                    Yes, Delete
                 </button>
                 <button
                    onClick={() => setIsDeleting(false)}
                    className="bg-slate-600 hover:bg-slate-700 text-slate-50 font-bold py-1 px-3 rounded text-sm"
                    type="button"
                 >
                    No
                 </button>
              </div>
            )}
          </div>

          {/* Update/Cancel Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-700 text-slate-50 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50"
              type="button"
              disabled={uploading || isDeleting} // Disable update during upload or delete confirmation
            >
              {uploading ? "Uploading..." : "Update Beat"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeatEditor;