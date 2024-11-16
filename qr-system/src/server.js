const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from frontend

// MongoDB connection URI
const uri = "mongodb+srv://admin:strathmoreqrcode@cluster0.60o6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Connect to the MongoDB database with error handling
async function connectToDb() {
  try {
    await client.connect();
    const db = client.db("qrcodeAttendance");
    console.log('Connected to MongoDB');
    return db.collection("users");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to the database');
  }
}

// POST route for login
app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: "Both ID and password are required." });
  }

  try {
    const collection = await connectToDb();

    // Find the user by id
    const user = await collection.findOne({ id });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the password is hashed
    if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
      // Hash the plain-text password and update the database
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await collection.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );

      console.log(`Password for user ${id} has been hashed.`);
      // Re-fetch the user with updated password
      user.password = hashedPassword;
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Successful login
    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
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

// Handle server shutdown and MongoDB cleanup
process.on('SIGINT', () => {
  client.close();
  console.log('MongoDB connection closed');
  process.exit();
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
