const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from frontend

// MongoDB connection URI
const uri = "mongodb+srv://admin:strathmoreqrcode@cluster0.60o6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Connect to the MongoDB database
async function connectToDb() {
  try {
    await client.connect();
    const db = client.db("qrcodeAttendance");
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to the database');
  }
}
async function hashExistingPasswords() {
  const db = await connectToDb();
  const usersCollection = db.collection("users");
  const users = await usersCollection.find({}).toArray();

  for (const user of users) {
    // Skip users whose passwords are already hashed
    if (!user.password || user.password.startsWith('$2b$')) {
      continue;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    // Update the user's password in the database with the hashed password
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    console.log(`Password hashed for user ID: ${user._id}`);
  }
}
hashExistingPasswords()
// POST route for login
app.post('/login', async (req, res) => {
  const { _id, password } = req.body;

  if (!_id || !password) {
    return res.status(400).json({ message: "Both _id and password are required." });
  }

  try {
    const db = await connectToDb();
    const usersCollection = db.collection("users");

    // Find the user by ID
    const user = await usersCollection.findOne({ _id: _id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const storedpass=user.password;

    console.log("Stored hashed password =" + user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    

    res.status(200).json({
      message: "Login successful.",
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


// GET route for a lecturer to view their classes
app.get('/lecturer/classes/:lecturerId', async (req, res) => {
  const { lecturerId } = req.params;

  try {
    const db = await connectToDb();
    const classesCollection = db.collection("classes");

    const classes = await classesCollection.find({ lecturerId }).toArray();

    if (classes.length === 0) {
      return res.status(404).json({ message: "No classes found for this lecturer." });
    }

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error retrieving classes for lecturer:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET route for a student to view their enrolled classes
app.get('/student/classes/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const db = await connectToDb();
    const usersCollection = db.collection("users");

    const student = await usersCollection.findOne({ _id: studentId });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.status(200).json(student.courses);
  } catch (error) {
    console.error("Error retrieving student classes:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET route for a lecturer to view students and attendance in a specific class
app.get('/lecturer/attendance/:classId', async (req, res) => {
  const { classId } = req.params;

  try {
    const db = await connectToDb();
    const classesCollection = db.collection("classes");

    // Get the class details to check if the lecturer is associated with the class
    const classDetails = await classesCollection.findOne({ _id: classId });

    if (!classDetails) {
      return res.status(404).json({ message: "Class not found." });
    }

    // Check if the lecturer is associated with the class
    if (classDetails.lecturerId !== req.user._id) {
      return res.status(403).json({ message: "You are not authorized to view this class." });
    }

    // Get the list of students in the class
    const attendanceCollection = db.collection("attendance");

    const studentsAttendance = await attendanceCollection.find({ courseId: classId }).toArray();

    res.status(200).json(studentsAttendance);
  } catch (error) {
    console.error("Error retrieving students' attendance:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// MongoDB collection for classes
let classesCollection;

async function connectToClassesDb() {
  try {
    if (!classesCollection) {
      await client.connect();
      const db = client.db("qrcodeAttendance");
      classesCollection = db.collection("classes");
      console.log('Classes collection ready');
    }
  } catch (error) {
    console.error('Error connecting to classes collection:', error);
    throw new Error('Failed to connect to the classes collection');
  }
}

// POST route for adding a new class
app.post('/add-class', async (req, res) => {
  const { className, instructorId } = req.body;

  if (!className || !instructorId) {
    return res.status(400).json({ message: "Class name and instructor ID are required." });
  }

  try {
    await connectToClassesDb();

    // Insert the new class into the collection
    const result = await classesCollection.insertOne({
      className,
      instructorId,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Class added successfully.",
      classId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding class:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
