import headphoneIcon from "./assets/headphone.png";

// Updated to use MongoDB field names and receive onEdit
function BeatCard({ beat, onPlay, onEdit }) { // Added onEdit prop
  // Default values for safety
  const beatName = beat.beat_name || "Untitled Beat";
  const beatAuthor = beat.beat_author || "Unknown Author";
  const beatBpm = beat.beat_bpm || "N/A";
  const beatLength = beat.beat_length || "0:00";
  const beatInstrumental = beat.beat_instrumental || "";

  return (
    <div className="flex flex-row items-center w-full p-3 mb-1.5 justify-between border-1 border-slate-50 rounded-2xl bg-black text-slate-50">
      {/* Play Button */}
      <button
        className="mr-3"
        onClick={() => onPlay(beatInstrumental, beatName, beatAuthor)}
      >
        <img
          className="bg-slate-50 p-1 size-8 rounded-2xl transition duration-400 hover:border-2"
          // Use beat.cover if you add it to MongoDB, otherwise default icon
          src={beat.cover || headphoneIcon}
          alt="beat-cover-icon"
        />
      </button>

      {/* Beat Info */}
      <div className="flex-1 flex flex-row items-center gap-4 overflow-hidden ml-10">
        <p className="flex-1 truncate">{beatName}</p> {/* Beat Name - Added font-semibold */}
        <p className="flex-1 truncate">{beatAuthor}</p> {/* Beat Author */}
        <p className="flex-1">{beatBpm} BPM</p> {/* BPM */}
        <p className="flex-1">{beatLength}</p> {/* Beat Length */}
      </div>

      {/* Action Buttons / Extra Info - Added Edit Button */}
      <div className="flex flex-row gap-3 items-center"> {/* Increased gap */}
         {/* Edit Button */}
         <button
           className="font-mono text-xs font-light border border-slate-400 text-slate-300 py-1 px-2.5 rounded-md transition duration-200 hover:bg-slate-700 hover:text-slate-50"
           onClick={() => onEdit(beat)} // Call onEdit with the beat data
         >
           Edit
         </button>
         {/* BPM display removed previously */}
      </div>
    </div>
  );
}

export default BeatCard;