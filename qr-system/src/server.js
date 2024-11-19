const express = require('express');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require("crypto");
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
    if (!user.password || user.password.startsWith('$2a$')) {
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
  const lecturerId = req.params.lecturerId;
  console.log("Lecturer ID from URL:", lecturerId);  // Log the lecturerId

  try {
    const db = await connectToDb();
    const courses = await db.collection("courses").find({ lecturerId }).toArray();
    console.log("Courses Retrieved:", courses);  // Log the courses retrieved

    if (courses.length === 0) {
      return res.status(404).json({ message: "No classes found for this lecturer." });
    }
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error retrieving courses:", error);  // Log any errors
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// GET route for a student to view their enrolled classes
app.get('/student/classes/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const db = await connectToDb();

    // Query to find courses where the studentId exists in the students array
    const courses = await db
      .collection("courses")
      .find({ studentIds: studentId })
      .toArray();

    if (courses.length === 0) {
      return res.status(404).json({ message: "No classes found for this student." });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error("Error retrieving student's classes:", error);
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




// POST route for adding a new class
app.post("/add-class", async (req, res) => {
  const { courseName, lecturerId } = req.body; // Match the key from the frontend

  // Validate the request body
  if (!courseName || !lecturerId) {
    return res.status(400).json({ message: "Course name and lecturer ID are required." });
  }

  try {
    const db = await connectToDb(); // Connect to the database
    if (!db) {
      return res.status(500).json({ message: "Database connection failed." });
    }

    const coursesCollection = db.collection("courses");

    // Generate a unique 7-character alphanumeric ID for the class
    let uniqueId;
    do {
      uniqueId = crypto.randomBytes(4).toString("hex").substring(0, 7); // Generate 7-character key
    } while (await coursesCollection.findOne({ _id: uniqueId })); // Ensure uniqueness

    // Create a new class object
    const newClass = {
      _id: uniqueId, // Generated unique ID
      courseName, // Set course name
      lecturerId, // Assign the lecturer ID
      numOfStudents: 0, // Default student count
      studentIds: [], // Initialize with an empty array for student IDs
      createdAt: new Date(), // Timestamp
    };

    // Insert the new class into the collection
    await coursesCollection.insertOne(newClass);

    res.status(201).json({
      message: "Class added successfully.",
      class: newClass, // Return the newly created class
    });
  } catch (error) {
    console.error("Error adding class:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.post("/join-class", async (req, res) => {
  const { courseId, studentId } = req.body;

  // Validate the request body
  if (!courseId || !studentId) {
    return res
      .status(400)
      .json({ message: "Course ID and student ID are required." });
  }

  try {
    const db = await connectToDb();
    const coursesCollection = db.collection("courses");

    // Find the course
    const course = await coursesCollection.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if the student is already enrolled
    if (course.studentIds.includes(studentId)) {
      return res.status(400).json({ message: "You are already in this class." });
    }

    // Add the student to the course
    await coursesCollection.updateOne(
      { _id: courseId },
      { $push: { studentIds: studentId }, $inc: { numOfStudents: 1 } }
    );

    res.status(200).json({ message: "Successfully joined the class." });
  } catch (error) {
    console.error("Error joining class:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
// GET route to fetch class details with students and attendance information
app.get('/class/details/lecturer/:courseId', async (req, res) => {
  console.log("Route hit for courseId:", req.params.courseId);
  const { courseId } = req.params; // courseId is a string

  try {
    const db = await connectToDb();

    // Fetch course details by matching courseId (as a string)
    const course = await db.collection('courses').findOne({ _id: courseId });

    if (!course) {
      return res.status(404).json({ message: "Class not found." });
    }

    console.log('Course:', course); // Debug log course details

    // If the class has no students, return an empty array for students
    if (!course.studentIds || course.studentIds.length === 0) {
      return res.status(200).json({
        courseName: course.courseName,
        courseId: course._id,
        lecturerId: course.lecturerId,
        numOfStudents: course.numOfStudents || 0,
        students: [], // No students in the class
      });
    }

    // Fetch the students enrolled in the course using studentIds (strings)
    const students = await db.collection('users').find({
      _id: { $in: course.studentIds } // studentIds is an array of strings
    }).toArray();

    console.log('Students:', students); // Debug log students

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for this course." });
    }

    // Fetch the attendance records for the class
    console.log('Fetching attendance for courseId:', courseId);
    const attendanceRecords = await db.collection('attendance').aggregate([
      { $match: { courseId } }, // Match documents by courseId
      { $unwind: { path: "$attendanceRecords", preserveNullAndEmptyArrays: true } } // Allow empty attendanceRecords
    ]).toArray();

    console.log('Attendance Records:', attendanceRecords); // Debug log attendance records

    // Map attendance records by student ID
    const attendanceByStudentId = {};
    if (attendanceRecords.length > 0) {
      attendanceRecords.forEach(record => {
        const studentId = record.studentId;
        if (!attendanceByStudentId[studentId]) {
          attendanceByStudentId[studentId] = [];
        }
        attendanceByStudentId[studentId].push(record.attendanceRecords);
      });
    }

    // Format the attendance records for each student
    const studentsWithAttendance = students.map(student => {
      console.log("Checking student:", student.fname, student.lname, "ID:", student._id); // Log student details

      const formattedAttendance = attendanceByStudentId[student._id] || []; // Use empty array if no attendance

      return {
        studentId: student._id,
        fname: student.fname,
        lname: student.lname,
        attendance: formattedAttendance.map(record => ({
          attendanceDate: record?.attendanceDate || null,
          classStartTime: record?.classStartTime || null,
          status: record?.status || "no records",
          hoursPresent: record?.hoursPresent || 0,
          hoursAbsent: record?.hoursAbsent || 0,
        })),
      };
    });

    // Combine course, student, and attendance data into a single object
    const classDetails = {
      courseName: course.courseName,
      lecturerId: course.lecturerId,
      courseId:course._id,
      numOfStudents: course.numOfStudents, // Assuming numOfStudents is a number
      students: studentsWithAttendance,
    };
    console.log(classDetails);

    res.status(200).json(classDetails);
  } catch (error) {
    console.error("Error fetching class details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
app.get('/class/details/student/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.query.studentId; // Accept studentId as a query parameter

  try {
    const db = await connectToDb();

    // Fetch course details
    const course = await db.collection('courses').findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Fetch student details
    const student = await db.collection('users').findOne({ _id: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Fetch attendance records
    const attendanceRecords = await db.collection('attendance').aggregate([
      { $match: { courseId, studentId } },
      { $unwind: { path: "$attendanceRecords", preserveNullAndEmptyArrays: true } },
    ]).toArray();

    // Format attendance
    const formattedAttendance = attendanceRecords.map(record => ({
      attendanceDate: record?.attendanceRecords?.attendanceDate || "No Date",
      classStartTime: record?.attendanceRecords?.classStartTime || "No Start Time",
      status: record?.attendanceRecords?.status || "No Status",
      hoursPresent: record?.attendanceRecords?.hoursPresent || 0,
      hoursAbsent: record?.attendanceRecords?.hoursAbsent || 0,
    }));

    // Response
    res.status(200).json({
      courseName: course.courseName,
      courseId: course._id,
      studentId: student._id,
      studentName: `${student.fname} ${student.lname}`,
      attendance: formattedAttendance,
    });
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

app.post('/signup', async (req, res) => {
  const { fname, lname, _id, email, password, role } = req.body;

  // Validate input fields
  if (!fname || !lname || !_id || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validate email format (basic check)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  try {
    const db = await connectToDb();
    const usersCollection = db.collection('users');

    // Check if user already exists by ID or email
    const existingUser = await usersCollection.findOne({ $or: [{ _id }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this ID or email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      _id,
      fname,
      lname,
      email, // Include email
      password: hashedPassword,
      role,
    };

    // Insert the new user into the database
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});
app.post('/attendance/update', async (req, res) => {
  const { studentId, courseId, attendanceDate, classStartTime } = req.body;

  try {
    const db = await connectToDb();

    // Check if an attendance record already exists
    const existingRecord = await db.collection('attendance').findOne({
      studentId,
      courseId,
      'attendanceRecords.attendanceDate': attendanceDate,
    });

    if (existingRecord) {
      // Update existing record (add attendance for this classStartTime)
      await db.collection('attendance').updateOne(
        { studentId, courseId, 'attendanceRecords.attendanceDate': attendanceDate },
        {
          $set: {
            'attendanceRecords.$.status': 'present', // Mark as present
            'attendanceRecords.$.classStartTime': classStartTime,
            'attendanceRecords.$.hoursPresent': parseInt(req.body.duration || 0), // Use duration if provided
            'attendanceRecords.$.hoursAbsent': 0,
          },
        }
      );
    } else {
      // Insert a new attendance record
      await db.collection('attendance').updateOne(
        { studentId, courseId }, // Match student & course
        {
          $push: {
            attendanceRecords: {
              attendanceDate,
              classStartTime,
              status: 'present',
              hoursPresent: parseInt(req.body.duration || 0), // Use duration if provided
              hoursAbsent: 0,
            },
          },
        },
        { upsert: true } // Insert student & course doc if it doesn't exist
      );
    }

    res.status(200).json({ message: 'Attendance updated successfully.' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Server error. Failed to update attendance.' });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});