import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-black p-4 w-full fixed top-0 left-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-slate-50 font-bold text-xl hover:text-violet-600">
          Music Manager
        </Link>
        <div>
          <Link to="/" className="text-gray-300 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium font-mono">
            PROJECTS
          </Link>
          {/* Add the link to the Beats page */}
          <Link to="/beats" className="text-gray-300 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium font-mono">
            BEATS
          </Link>
          <Link to="/instructions" className="text-gray-300 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium font-mono">
            INSTRUCTIONS 
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;