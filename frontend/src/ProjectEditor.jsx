import { useState } from "react";

function ProjectEditor({ project, onClose, onSave, onDelete }) {
  const [projectName, setProjectName] = useState(project.project_name || "");
  const [projectType, setProjectType] = useState(project.project_type || "");
  const [projectDescription, setProjectDescription] = useState(
    project.project_description || ""
  );
  const [projectStatus, setProjectStatus] = useState(
    project.project_status ? "Complete" : "In Progress"
  );
  const [imagePreview, setImagePreview] = useState(project.project_cover || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const cloudName = "df11www4b";
    const uploadPreset = "music-manager";

    if (file) {
      // Set uploading state to true
      setIsUploading(true);
      setUploadError("");
      console.log("Uploading image to Cloudinary...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        console.log("Image uploaded successfully:", data);
        setImagePreview(data.secure_url); // Update the image preview with the new URL
        setIsUploading(false); // Set uploading state to false
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadError("Failed to upload image. Please try again.");
        setIsUploading(false); // Set uploading state to false even if there's an error
      }
    }
  };

  const handleSave = async () => {
    // Check if an image is currently being uploaded
    if (isUploading) {
      alert("Please wait for the image to finish uploading before saving.");
      return;
    }

    // Make sure we're using the latest imagePreview value
    const updatedProject = {
      ...project,
      project_name: projectName,
      project_type: projectType,
      project_description: projectDescription,
      project_status: projectStatus === "Complete", // Convert string to boolean
      project_cover: imagePreview, // This should contain the Cloudinary URL
    };

    if (!project.id) {
      console.error("Project ID is undefined");
      return;
    }

    console.log("Sending update request for project:", updatedProject);
    console.log("Image URL being sent:", imagePreview);

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      console.log("Received response:", response);

      if (response.ok) {
        const savedProject = await response.json();
        // Make sure we're passing the complete updated project back to the parent
        onSave(savedProject); // Update client-side state with the new project data
        console.log("Project updated on server:", savedProject);

        // Don't close the form immediately to allow the user to see the changes
        // Only close after a short delay
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        const errorData = await response.json();
        console.error("Failed to update project on server:", errorData);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="w-full font-mono">
      <form
        className="flex flex-col gap-4 bg-black"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Upload Project Cover */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            PROJECT COVER
          </label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 cursor-pointer"
            onChange={handleImageChange}
            disabled={isUploading}
          />
          {/* Image Preview */}
          <div className="border-2 border-slate-50 border-dotted mt-2 w-full h-32 flex items-center justify-center rounded">
            {isUploading ? (
              <div className="text-slate-50">
                <span className="animate-pulse">UPLOADING IMAGE...</span>
              </div>
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Project cover preview"
                className="h-full object-contain"
              />
            ) : (
              <span className="font-semibold text-slate-50">IMAGE PREVIEW</span>
            )}
          </div>
          {uploadError && (
            <p className="text-red-500 mt-1 text-sm">{uploadError}</p>
          )}
        </div>

        {/* Project Name Input */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            PROJECT NAME
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="ENTER PROJECT NAME"
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400"
            required
          />
        </div>

        {/* Project Description Input */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            PROJECT DESCRIPTION
          </label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="ENTER PROJECT DESCRIPTION"
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400 h-24"
          />
        </div>

        {/* Project Type Select */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            PROJECT TYPE
          </label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50"
            required
          >
            <option value="">SELECT PROJECT TYPE</option>
            <option value="Album/EP">ALBUM/EP</option>
            <option value="Single">SINGLE</option>
          </select>
        </div>

        {/* Project Status Select */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            PROJECT STATUS
          </label>
          <select
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50"
            required
          >
            <option value="In Progress">IN PROGRESS</option>
            <option value="Complete">COMPLETE</option>
          </select>
        </div>

        {/* Submit, Cancel & Delete Buttons */}
        <div className="flex justify-end mt-4 gap-3">
          <button
            type="button"
            className="bg-black text-slate-50 py-2 px-4 rounded-md border-2 border-slate-50 hover:bg-slate-50 hover:text-slate-950 font-mono transition duration-300"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 font-mono transition duration-300"
            onClick={onDelete}
          >
            DELETE
          </button>
          <button
            type="submit"
            className="bg-violet-600 text-slate-50 py-2 px-4 rounded-md hover:bg-violet-900 font-mono transition duration-300"
            disabled={isUploading}
          >
            {isUploading ? "UPLOADING..." : "SAVE CHANGES"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectEditor;
