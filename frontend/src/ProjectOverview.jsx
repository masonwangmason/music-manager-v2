import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProjectCreator from "./ProjectCreator";

function ProjectOverview() {
  const navigate = useNavigate();
  const [showProjectCreator, setShowProjectCreator] = useState(false);
  const [projects, setProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState(8);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Fetch projects from the server
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true); // Set loading to true when fetch starts
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false); // Set loading to false when fetch completes
      }
    };

    fetchProjects();
  }, []);

  // Handle saving a new project
  const handleSaveProject = (newProject) => {
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    console.log("New project saved:", newProject);
    console.log("Updated projects list:", updatedProjects);
  };

  // Load more projects
  const loadMoreProjects = () => {
    setVisibleProjects(prevVisible => prevVisible + 8); // Load 8 more projects
  };

  // Get the projects to display
  const projectsToDisplay = [...projects].reverse().slice(0, visibleProjects);
  const hasMoreProjects = projects.length > visibleProjects;

  return (
    <>
      <section className="flex flex-col items-center mt-5 pb-24"> {/* Added pb-24 for bottom padding */}
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between w-full max-w-5xl mb-4">
          <p className="font-mono text-slate-50 font-bold text-5xl tracking-tight">
            PROJECTS OVERVIEW
          </p>
          <button
            className="font-mono bg-violet-600 text-white border-violet-600 font-extralight text-2xl py-1 px-3 rounded-md flex items-center transition duration-300 hover:bg-violet-900"
            onClick={() => setShowProjectCreator(true)}
          >
            +
          </button>
        </div>

        {/* Loading Message */}
        {isLoading ? (
          <div className="flex justify-center items-center h-60 w-full">
            <p className="font-mono text-slate-50 text-xl">⚠ Loading projects...Please refresh if getting stucked</p>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="grid grid-cols-4 gap-5 max-w-5xl">
              {projectsToDisplay.map((project, index) => (
                <button
                  key={index}
                  className="project-button hover:scale-105 transition duration-200 flex flex-col items-center"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <img
                    src={project.project_cover}
                    alt={project.project_name}
                    className="mb-3 w-60 h-60 object-cover rounded-md"
                  />
                  <h3 className="font-mono font-medium text-base text-center">
                    {project.project_name}
                  </h3>
                  <p className="font-sans text-sm text-slate-400 flex items-center justify-center">
                    {project.project_type}
                  </p>
                  <span
                    className={`w-26 h-6 px-1 py-1 rounded-full text-xs font-sans flex items-center justify-center ${
                      project.project_status 
                        ? "text-violet-600" 
                        : "text-slate-500"
                    }`}
                    title={project.project_status ? "Complete" : "In progress"}
                  >
                    {project.project_status ? "COMPLETE" : "IN PROGRESS"}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMoreProjects && (
              <button
                className="font-mono bg-violet-600 text-white mt-8 mb-8 py-2 px-4 rounded-md transition duration-300 hover:bg-violet-900"
                onClick={loadMoreProjects}
              >
                LOAD MORE PROJECTS
              </button>
            )}
          </>
        )}
      </section>

      {/* Project Creator Popup */}
      {showProjectCreator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-slate-50 rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-mono text-xl font-bold text-slate-50">
                CREATE NEW PROJECT
              </h2>
              <button
                onClick={() => setShowProjectCreator(false)}
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
            <ProjectCreator
              onClose={() => setShowProjectCreator(false)}
              onSave={handleSaveProject}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectOverview;
