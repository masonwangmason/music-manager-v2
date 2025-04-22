function Instructions() {
  return (
    <div className="max-w-5xl mx-auto mt-20 p-4 text-left"> {/* Added mt-20 for top margin */}
      <h1 className="font-mono text-slate-50 font-bold text-4xl mb-4">Instructions</h1>
      <p className="font-sans text-slate-200">
        Welcome to the Music Manager! Here's how to use the application:
      </p>
      <ul className="list-disc list-inside mt-4 font-sans text-slate-300">
        <li>Go to the 'Projects' page to view all your music projects.</li>
        <li>Click the '+' button on the Projects Overview page to create a new project.</li>
        <li>Click on a project card to view its details and manage its songs.</li>
        <li>Inside a project, click the '+' button to add a new song.</li>
        <li>Click 'Edit Project Details' to modify project information.</li>
        <li>Click on a song card's edit icon to modify song details.</li>
        <li>Click the play icon on a song card to play the song in the player bar below.</li>
        <br />
        <li>You can also use the website only using keyboards (with tabs, arrow keys, and enter)</li>
      </ul>
    </div>
  );
}

export default Instructions;