import express from "express";
import connectDB from "../db/mongodb.js"; 

const router = express.Router();

// Connect to MongoDB
let db;
connectDB()
  .then((database) => {
    db = database;
    console.log("Database connection established");
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });

// Use MongoDB for GET API data
router.get("/api/projects", async (req, res) => {
  try {
    const projectsCollection = db.collection("projects");
    const projects = await projectsCollection.find().toArray(); // Fetch projects from MongoDB
    console.log("Fetched projects:", projects); // Log the fetched projects
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use MongoDB for POST endpoint to add a new project
router.post("/api/projects", async (req, res) => {
  const newProject = req.body;

  // Initialize project_songs as an empty array if not already present
  if (!newProject.project_songs) {
    newProject.project_songs = [];
  }

  try {
    const projectsCollection = db.collection("projects");

    // Generate a custom id if not provided
    if (!newProject.id) {
      const lastProject = await projectsCollection
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();
      newProject.id = lastProject.length > 0 ? lastProject[0].id + 1 : 1;
    }

    const result = await projectsCollection.insertOne(newProject); // Insert new project into MongoDB
    res.status(201).json({ id: newProject.id, ...newProject }); // Return the custom id and project data
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use MongoDB for PUT endpoint to update an existing project
router.put("/api/projects/:id", async (req, res) => {
  const projectId = parseInt(req.params.id, 10); // Convert to number using parseInt
  const updatedProject = req.body;

  // Remove _id from the updatedProject to prevent modification of the immutable field
  delete updatedProject._id;

  console.log(`Updating project with custom ID: ${projectId}`); // Log the project ID
  console.log("Updated project data:", updatedProject); // Log the updated project data

  try {
    const projectsCollection = db.collection("projects");

    // Check if the project exists first
    const existingProject = await projectsCollection.findOne({ id: projectId });
    console.log("Existing project:", existingProject); // Log the existing project

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update the project using updateOne instead of findOneAndUpdate
    const updateResult = await projectsCollection.updateOne(
      { id: projectId },
      { $set: updatedProject }
    );

    console.log("MongoDB update result:", updateResult);

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ error: "Failed to update project" });
    }

    // Fetch the updated document
    const updatedDoc = await projectsCollection.findOne({ id: projectId });
    console.log("MongoDB update result:", updatedDoc);

    res.json(updatedDoc);
  } catch (error) {
    console.error("Error updating project:", error); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use MongoDB for DELETE endpoint to remove a project
router.delete("/api/projects/:id", async (req, res) => {
  const projectId = Number(req.params.id); // Convert to number if stored as a number
  try {
    const projectsCollection = db.collection("projects");
    const result = await projectsCollection.deleteOne({ id: projectId }); // Use custom id field
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(204).send(); // Send a 204 No Content response
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use MongoDB for POST endpoint to add a new song to a project
router.post("/api/projects/:projectId/songs", async (req, res) => {
  const projectId = Number(req.params.projectId); // Convert to number if stored as a number
  const newSong = req.body;
  try {
    const projectsCollection = db.collection("projects");
    const project = await projectsCollection.findOne({ id: projectId }); // Use custom id field
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    newSong.song_id =
      project.project_songs.length > 0
        ? Math.max(...project.project_songs.map((song) => song.song_id)) + 1
        : 1;
    project.project_songs.push(newSong);
    await projectsCollection.updateOne(
      { id: projectId },
      { $set: { project_songs: project.project_songs } }
    ); // Use custom id field
    res.status(201).json(newSong);
  } catch (error) {
    console.error("Error adding song:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use MongoDB for PUT endpoint to update a song in a project
router.put("/api/projects/:projectId/songs/:songId", async (req, res) => {
  const projectId = Number(req.params.projectId); // Convert to number if stored as a number
  const songId = Number(req.params.songId);
  const updatedSong = req.body;
  try {
    const projectsCollection = db.collection("projects");
    const project = await projectsCollection.findOne({ id: projectId }); // Use custom id field
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const songIndex = project.project_songs.findIndex(
      (song) => song.song_id === songId
    );
    if (songIndex === -1) {
      return res.status(404).json({ error: "Song not found" });
    }
    project.project_songs[songIndex] = {
      ...project.project_songs[songIndex],
      ...updatedSong,
    };
    await projectsCollection.updateOne(
      { id: projectId },
      { $set: { project_songs: project.project_songs } }
    ); // Use custom id field
    res.json(project.project_songs[songIndex]);
  } catch (error) {
    console.error("Error updating song:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Use MongoDB for DELETE endpoint to remove a song from a project
router.delete("/api/projects/:projectId/songs/:songId", async (req, res) => {
  const projectId = Number(req.params.projectId); // Convert to number if stored as a number
  const songId = Number(req.params.songId);
  try {
    const projectsCollection = db.collection("projects");
    const project = await projectsCollection.findOne({ id: projectId }); // Use custom id field
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const songIndex = project.project_songs.findIndex(
      (song) => song.song_id === songId
    );
    if (songIndex === -1) {
      return res.status(404).json({ error: "Song not found" });
    }
    project.project_songs.splice(songIndex, 1);
    await projectsCollection.updateOne(
      { id: projectId },
      { $set: { project_songs: project.project_songs } }
    ); // Use custom id field
    res.status(204).send(); // Send a 204 No Content response
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
