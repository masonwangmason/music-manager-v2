import headphoneIcon from "./assets/headphone.png";

function SongCard({ song, onEdit, onPlay }) {
  return (
    <div className="flex flex-row items-center w-full p-3 mb-1.5 justify-between border-1 border-slate-50 rounded-2xl bg-black text-slate-50">
      <button
        className="mr-3"
        onClick={() =>
          onPlay(
            song.song_instrumental,
            song.song_name,
            song.song_collaborators
          )
        }
      >
        <img
          className="bg-slate-50 p-1 size-8 rounded-2xl transition duration-400 hover:border-2"
          src={song.cover || headphoneIcon} // Use song cover or default icon
          alt="cover-icon"
        />
      </button>
      <div className="flex-1 flex flex-row items-center gap-4 overflow-hidden">
        <p className="flex-1 truncate">{song.song_name}</p>{" "}
        {/* Display song name */}
        <p className="flex-none">{song.song_duration}</p>{" "}
        {/* Display song duration */}
        <p className="flex-1 truncate">
          {song.song_collaborators ? `feat.${song.song_collaborators}` : "No Feature"}
        </p>{" "}
        {/* Display artist name or placeholder */}
      </div>
      <div className="flex flex-row gap-1.5">
        <button
          className="font-light border-1 border-slate-50 text-slate-50 py-1 px-2.5 rounded-md transition duration-200 hover:bg-slate-50 hover:text-slate-950"
          onClick={() => onEdit(song)}
        >
          Edit
        </button>
        <button className="font-light border-1 border-slate-50 text-slate-50 py-1 px-2.5 rounded-md transition duration-200 hover:bg-slate-50 hover:text-slate-950">
          Writing Mode
        </button>
      </div>
    </div>
  );
}

export default SongCard;
