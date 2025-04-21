function ProjectCard({ project_name, project_cover, project_type }) {
  return (
    <div className="size-60 p-4 rounded-md flex flex-col items-center hover:bg-slate-600">
      <img
        className="size-40 rounded-md p-2"
        src={project_cover}
        alt={project_name}
      />
      <p className="font-semibold">{project_name}</p>
      <p>{project_type}</p>
    </div>
  );
}

export default ProjectCard;
