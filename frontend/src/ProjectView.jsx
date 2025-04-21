import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProjectEditor from "./ProjectEditor";
import SongCard from "./SongCard";
import SongCreator from "./SongCreator";
import SongEditor from "./SongEditor";

function ProjectView({ onPlaySong }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [showProjectEditor, setShowProjectEditor] = useState(false);
  const [showSongCreator, setShowSongCreator] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showSongEditor, setShowSongEditor] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects`);
        const data = await response.json();
        const fetchedProject = data.find((proj) => proj.id === Number(id));
        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          console.error("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleUpdateProject = (updatedProject) => {
    const updatedProjects = projects.map((proj) =>
      proj.id === updatedProject.id ? updatedProject : proj
    );
    setProjects(updatedProjects);
    setProject(updatedProject);
  };

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        navigate(-1);
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  if (!project) {
    return <p className="font-sans text-white text-center">⚠ Project not found!</p>;
  }

  const handleSongAdded = (newSong) => {
    setProject((prevProject) => ({
      ...prevProject,
      project_songs: [...prevProject.project_songs, newSong],
    }));
  };

  const handleUpdateSong = (updatedSong) => {
    const updatedSongs = project.project_songs.map((song) =>
      song.song_id === updatedSong.song_id ? updatedSong : song
    );
    setProject((prevProject) => ({
      ...prevProject,
      project_songs: updatedSongs,
    }));
  };

  const openSongEditor = (song) => {
    setCurrentSong(song);
    setShowSongEditor(true);
  };

  const handleDeleteSong = async (songId) => {
    try {
      const response = await fetch(
        `/api/projects/${project.id}/songs/${songId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setProject((prevProject) => ({
          ...prevProject,
          project_songs: prevProject.project_songs.filter(
            (song) => song.song_id !== songId
          ),
        }));
        setShowSongEditor(false);
      } else {
        console.error("Failed to delete song");
      }
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  return (
    <>
      <section className="flex flex-col items-start my-5 w-full max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          className="font-sans bg-slate-950 text-white hover:bg-slate-50 hover:text-black font-medium py-1 mb-2 rounded-md transition duration-200"
          onClick={() => navigate(-1)}
        >
          Back to Projects Overview
        </button>
        
        <div className="w-full mb-4 text-left">
          <p className="font-mono text-slate-50 font-bold text-5xl tracking-tight mb-1">
            PROJECT VIEW
          </p>
        </div>

        <div className="flex flex-row gap-10 w-full">
          {/* Left-Aligned Content Box */}
          <div className="flex flex-col items-start w-1/3">
            <h2 className="font-mono font-semibold mb-1">PROJECT COVER</h2>
            <img
              className="w-80 h-80 mb-4 mt-2"
              src={project.project_cover}
              alt="project-cover"
            />

            <h2 className="font-mono font-semibold mb-1">PROJECT NAME</h2>
            <p className="font-sans font-light text-base mb-4 text-slate-50">
              {project.project_name}
            </p>

            <h2 className="font-mono font-semibold mb-1">PROJECT TYPE</h2>
            <p className="font-sans font-normal mb-4 text-slate-50">
              {project.project_type}
            </p>

            <h2 className="font-mono font-semibold mb-1">PROJECT DESCRIPTION</h2>
            <p className="font-sans font-normal mb-4 text-slate-50 text-left">
              {project.project_description}
            </p>

            <h2 className="font-mono font-semibold mb-1">PROJECT STATUS</h2>
            <p className="font-sans font-normal mb-4 text-slate-50">
              {project.project_status ? "Complete" : "In Progress"}
            </p>

            <button
              className="font-mono text-sm bg-slate-950 text-white hover:bg-slate-50 hover:text-black font-normal py-1 px-2 border-1 border-slate-50 rounded-md transition duration-200 self-center w-full max-w-xs"
              onClick={() => setShowProjectEditor(true)}
            >
              EDIT PROJECT DETAILS
            </button>
          </div>

          {/* Right-Aligned Content Box for Songs */}
          <div className="flex flex-col items-start w-2/3">
            <button
              className="font-sans bg-slate-950 text-white border-1 hover:bg-slate-50 hover:text-black font-medium py-1 px-2 rounded-md flex items-center transition duration-300 group mb-2 self-end"
              onClick={() => setShowSongCreator(true)}
            >
              <span className="group-hover:hidden">+</span>
              <span className="font-mono text-sm hidden group-hover:inline transition duration-400">
                CREATE NEW SONG +
              </span>
            </button>
            {project.project_songs && project.project_songs.length > 0 ? (
              project.project_songs.map((song) => (
                <SongCard
                  key={song.song_id}
                  song={song}
                  onEdit={openSongEditor}
                  onPlay={() =>
                    onPlaySong(
                      song.song_instrumental,
                      song.song_name,
                      song.song_collaborators,
                      project.project_cover
                    )
                  }
                />
              ))
            ) : (
              <p className="font-sans font-bold text-slate-50 text-left">
                No songs available in this project yet.
                <br />
                Start by creating a new one by hitting the button above.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Popup Modals - Updated font classes */}
      {showProjectEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-slate-50 rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-sans text-xl font-bold text-slate-50">
                EDIT PROJECT DETAILS
              </h2>
              <button
                onClick={() => setShowProjectEditor(false)}
                className="text-slate-50 hover:text-slate-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <ProjectEditor
              project={project}
              onClose={() => setShowProjectEditor(false)}
              onSave={handleUpdateProject}
              onDelete={handleDeleteProject}
            />
          </div>
        </div>
      )}

      {/* Similar updates for SongCreator and SongEditor modals */}
      {showSongCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-slate-50 rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-mono text-xl font-semibold text-slate-50">
                CREATE NEW SONG
              </h2>
              <button
                onClick={() => setShowSongCreator(false)}
                className="text-slate-50 hover:text-slate-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <SongCreator
              onClose={() => setShowSongCreator(false)}
              projectId={id}
              onSongAdded={handleSongAdded}
            />
          </div>
        </div>
      )}

      {/* Song Editor Popup */}
      {showSongEditor && currentSong && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-slate-50 rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-mono text-xl font-semibold text-slate-50">EDIT SONG</h2>
              <button
                onClick={() => setShowSongEditor(false)}
                className="text-slate-50 hover:text-slate-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <SongEditor
              song={currentSong}
              onClose={() => setShowSongEditor(false)}
              onSave={handleUpdateSong}
              onDelete={handleDeleteSong}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectView;
