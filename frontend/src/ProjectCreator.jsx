import React, { useState } from "react";

function ProjectCreator({ onClose, onSave }) {
  // State for form inputs
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const cloudName = "df11www4b"; 
    const uploadPreset = "music-manager"; 

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    setIsUploading(true);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setIsUploading(false);

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Failed to get image URL");
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading to Cloudinary:", error);
      alert("Failed to upload image. Please try again.");
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let coverUrl =
      "https://res.cloudinary.com/df11www4b/image/upload/v1742240942/music-manager/default-cover.png"; // Default cover

    if (coverImage) {
      // Upload image to Cloudinary
      const uploadedUrl = await uploadToCloudinary(coverImage);
      if (uploadedUrl) {
        coverUrl = uploadedUrl;
      } else {
        if (!confirm("Image upload failed. Continue without image?")) {
          return; // Stop form submission if user cancels
        }
      }
    }

    // Create new project with Cloudinary URL
    const newProject = {
      project_name: projectName,
      project_type: projectType,
      project_description: projectDescription,
      project_cover: coverUrl,
      project_status: false, 
    };

    console.log("New project data:", newProject);

    // Send POST request to the server
    try {
      const response = await fetch(`/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const savedProject = await response.json();
        // Call the onSave callback if provided
        if (onSave) {
          onSave(savedProject);
        }
        console.log("Project saved to server:", savedProject);
      } else {
        console.error("Failed to save project to server");
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }

    // Close the form after submission
    onClose();
  };

  return (
    <div className="w-full font-mono">
      <form className="flex flex-col gap-4 bg-black" onSubmit={handleSubmit}>
        {/* Upload Album Cover */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            ALBUM COVER
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
              <span className="font-semibold text-slate-50">UPLOADING...</span>
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Album cover preview"
                className="h-full object-contain"
              />
            ) : (
              <span className="font-semibold text-slate-50">IMAGE PREVIEW SECTION - Please Upload Above </span>
            )}
          </div>
        </div>

        {/* Project Name Input */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            PROJECT NAME
          </label>
          <input
            type="text"
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            disabled={isUploading}
          />
        </div>

        {/* Project Description Input */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            PROJECT DESCRIPTION
          </label>
          <textarea
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 placeholder-gray-400 h-24"
            placeholder="Enter project description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {/* Project Type Select */}
        <div>
          <label className="block font-semibold mb-1 text-left text-slate-50">
            PROJECT TYPE
          </label>
          <select
            className="border p-2 rounded w-full bg-black text-slate-50 border-slate-50 font-mono"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            required
            disabled={isUploading}
          >
            <option value="">SELECT PROJECT TYPE</option>
            <option value="Album/EP">ALBUM/EP</option>
            <option value="Single">SINGLE</option>
          </select>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex justify-end mt-4 gap-3">
          <button
            type="button"
            className="bg-black text-slate-50 py-2 px-4 rounded-md border-2 border-slate-50 hover:bg-slate-50 hover:text-slate-950 font-mono"
            onClick={onClose}
            disabled={isUploading}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="bg-black text-slate-50 py-2 px-4 rounded-md border-2 border-slate-50 hover:bg-slate-50 hover:text-slate-950 font-mono"
            disabled={isUploading}
          >
            {isUploading ? "CREATING..." : "CREATE PROJECT"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProjectCreator;
