import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProjectCreator from "./ProjectCreator";

function ProjectOverview() {
  const navigate = useNavigate(); // Hook for navigation
  const [showProjectCreator, setShowProjectCreator] = useState(false);
  const [projects, setProjects] = useState([]);

  // Fetch projects from the server
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
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

  return (
    <>
      <section className="flex flex-col items-center my-5">
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between w-full max-w-5xl mb-4">
          <p className="font-mono text-slate-50 font-bold text-5xl tracking-tight">
            PROJECTS OVERVIEW
          </p>
          <button
            className="bg-slate-950 text-white border-1 hover:bg-slate-50 hover:text-black font-medium py-1 px-2 rounded-md flex items-center transition duration-300 group"
            onClick={() => setShowProjectCreator(true)}
          >
            <span className="group-hover:hidden">+</span>
            <span className="font-mono text-base hidden group-hover:inline transition duration-400">
              Create New Project +
            </span>
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-4 gap-5 max-w-5xl">
          {projects.map((project, index) => (
            <button
              key={index}
              className="project-button hover:scale-105 transition duration-200 flex flex-col items-center" // Add flexbox classes
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <img
                src={project.project_cover}
                alt={project.project_name}
                className="mb-3 w-60 h-60 object-cover" // Tailwind classes for square dimensions
              />
              <h3 className="font-mono font-medium text-base text-center">
                {project.project_name}
              </h3>
              <p className="font-sans text-sm text-gray-400 flex items-center justify-center">
                {project.project_type}
                <span
                  className={`w-1.5 h-1.5 rounded-full ml-1.5 ${project.project_status ? "bg-green-500" : "bg-red-500"}`}
                  title={project.project_status ? "Complete" : "In progress"}
                ></span>
              </p>
            </button>
          ))}
        </div>
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
