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

// --- Add the new endpoint for fetching beats below ---

// GET endpoint to fetch all beats
router.get("/api/beats", async (req, res) => {
  try {
    // Ensure the database connection is established
    if (!db) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const beatsCollection = db.collection("beats");
    const beats = await beatsCollection.find().toArray(); // Fetch all documents from the "beats" collection
    console.log("Fetched beats:", beats); // Log the fetched beats
    res.json(beats); // Send the beats data as JSON response
  } catch (error) {
    console.error("Error fetching beats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint to add a new beat
router.post("/api/beats", async (req, res) => {
  const newBeat = req.body;

  // Basic validation (optional but recommended)
  if (!newBeat.beat_name || !newBeat.beat_author || !newBeat.beat_bpm) {
    return res.status(400).json({ error: "Missing required beat fields (name, author, bpm)" });
  }

  try {
    // Ensure the database connection is established
    if (!db) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const beatsCollection = db.collection("beats");

    // Generate a custom sequential id (similar to projects)
    const lastBeat = await beatsCollection
      .find()
      .sort({ id: -1 }) // Sort by 'id' field descending
      .limit(1)
      .toArray();
    // Assign the next sequential ID
    newBeat.id = lastBeat.length > 0 ? lastBeat[0].id + 1 : 1;

    // Insert the new beat document into the collection
    const result = await beatsCollection.insertOne(newBeat);

    // Check if insert was successful (optional, insertOne throws on error)
    // MongoDB Node.js driver v4+ insertOne result doesn't directly have 'ops'
    // We can return the document we intended to insert, now including the generated 'id'
    // MongoDB automatically adds the '_id' field.

    console.log("Added new beat:", { id: newBeat.id, ...newBeat }); // Log the added beat

    // Respond with the newly created beat data (including the generated id)
    res.status(201).json({ id: newBeat.id, ...newBeat });

  } catch (error) {
    console.error("Error adding beat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT endpoint to update an existing beat
router.put("/api/beats/:id", async (req, res) => {
  const beatId = parseInt(req.params.id, 10); // Ensure ID is a number
  const updatedBeat = req.body;

  try {
    const beatsCollection = db.collection("beats");
    const result = await beatsCollection.updateOne(
      { id: beatId },
      { $set: updatedBeat }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Beat not found" });
    }

    const updatedBeatDoc = await beatsCollection.findOne({ id: beatId });
    res.json(updatedBeatDoc);
  } catch (error) {
    console.error("Error updating beat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE endpoint to remove a beat
router.delete("/api/beats/:id", async (req, res) => {
  const beatId = Number(req.params.id);

  try {
    if (!db) {
      return res.status(503).json({ error: "Database not connected" });
    }
    const beatsCollection = db.collection("beats");

    const result = await beatsCollection.deleteOne({ id: beatId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Beat not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting beat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
