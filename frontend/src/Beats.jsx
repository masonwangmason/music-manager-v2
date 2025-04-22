import React, { useState, useEffect } from "react";
import BeatCard from "./BeatCard";
import BeatCreator from "./BeatCreator";
import BeatEditor from "./BeatEditor";

// Receive onPlayBeat prop
function Beats({ onPlayBeat }) {
  const [beats, setBeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBeatCreator, setShowBeatCreator] = useState(false);
  const [editingBeat, setEditingBeat] = useState(null);

  useEffect(() => {
    // Fetch beats data from the API endpoint
    const fetchBeats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/beats"); // Fetch from the new endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBeats(data); // Set the fetched beats data into state
      } catch (error) {
        console.error("Error fetching beats:", error);
        setBeats([]); // Clear beats or set to empty on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeats();
  }, []);

  // Updated function to use the passed-in handler
  const handlePlayBeat = (url, name, author) => {
    console.log(`Playing beat: ${name} by ${author}`);
    onPlayBeat(url, name, author, null);
  };

  // Handler for when a new beat is successfully added
  const handleBeatAdded = (newBeat) => {
    // Add the new beat to the beginning of the list for immediate visibility
    setBeats((prevBeats) => [newBeat, ...prevBeats]);
    console.log("New beat added:", newBeat);
  };

  // Handler for when a beat is updated
  const handleBeatUpdated = (updatedBeat) => {
    setBeats((prevBeats) =>
      prevBeats.map((beat) =>
        (beat.id && updatedBeat.id && beat.id === updatedBeat.id) ||
        (beat._id && updatedBeat._id && beat._id === updatedBeat._id)
          ? { ...beat, ...updatedBeat }
          : beat
      )
    );
  };

  // Handler for when a beat is deleted
  const handleBeatDeleted = (deletedBeatId) => {
    setBeats((prevBeats) =>
      prevBeats.filter((beat) => beat.id !== deletedBeatId)
    );
  };

  // Updated edit handler to open the BeatEditor modal
  const handleEditBeat = (beat) => {
    setEditingBeat(beat);
  };

  return (
    <>
      {" "}
      {/* Use Fragment to wrap multiple top-level elements */}
      <section className="flex flex-col items-center mt-5 pb-24 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between w-full mb-4">
          <h1 className="font-mono text-slate-50 font-bold text-5xl tracking-tight">
            BEATS LIBRARY
          </h1>
          {/* Button to open the BeatCreator modal */}
          <button
            className="font-mono bg-violet-600 text-white border-violet-600 font-extralight text-2xl py-1 px-3 rounded-md flex items-center transition duration-300 hover:bg-violet-900"
            onClick={() => setShowBeatCreator(true)}
            aria-label="Create New Beat"
          >
            +
          </button>
        </div>

        {/* Loading Message */}
        {isLoading ? (
          <div className="flex justify-center items-center h-60 w-full">
            <p className="font-mono text-slate-50 text-xl">
              ⚠ Loading beats...
            </p>
          </div>
        ) : (
          <>
            {/* Beats List/Grid */}
            {!isLoading && (
              <div className="w-full flex flex-col gap-2">
                {beats.length > 0 ? (
                  [...beats]
                    .sort((a, b) => (b.id || 0) - (a.id || 0))
                    .map((beat) => (
                      <BeatCard
                        key={beat.id || beat._id}
                        beat={beat}
                        onPlay={handlePlayBeat}
                        onEdit={handleEditBeat}
                      />
                    ))
                ) : (
                  <p className="font-mono font-bold text-slate-50 text-left">
                    No beats available yet. Click '+' to create one.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </section>
      {/* Conditionally render the BeatCreator modal */}
      {showBeatCreator && (
        <BeatCreator
          onClose={() => setShowBeatCreator(false)}
          onBeatAdded={handleBeatAdded}
        />
      )}
      {/* Conditionally render the BeatEditor modal */}
      {editingBeat && (
        <BeatEditor
          beat={editingBeat}
          onClose={() => setEditingBeat(null)}
          onBeatUpdated={handleBeatUpdated}
          onBeatDeleted={handleBeatDeleted}
        />
      )}
    </>
  );
}

export default Beats;
