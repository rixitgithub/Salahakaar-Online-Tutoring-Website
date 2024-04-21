// index.js
const express = require("express");
const bodyParser = require("body-parser");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8531;
const SECRET = "salahkaarsecretkey";
const MONGODB_URI =
  "mongodb+srv://salahkarradmin:salahkarradminofficial123@cluster0.pfdz2nw.mongodb.net/";

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  bio: { type: String },
});

// Define tutor schema
const tutorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  dob: { type: Date, required: true },
  profilePicture: { type: String },
  bio: { type: String },
  subjectsTaught: [{ type: String }],
  qualifications: { type: String },
  hourlyRate: { type: Number },
  languages: [{ type: String }],
  linkedinId: { type: String },
  githubAccount: { type: String },
  phoneNumber: { type: String },
  availability: { type: Boolean, default: true },
  rating: { type: Number },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

// Define student schema
const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  preferredSubjects: [{ type: String }],
  gradeLevel: { type: String },
  learningGoals: { type: String },
  preferredTutorCharacteristics: { type: String },
});

// Define lesson schema
const lessonSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tutor",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subject: { type: String, required: true },
  dateTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  location: { type: String },
  virtualPlatform: { type: String },
});

// Define booking schema
const bookingSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  subject: { type: String, required: true },

  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Define review schema
const reviewSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewText: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  timestamp: { type: Date, default: Date.now },
});
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const offerSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: { type: String, required: true },
  type: { type: String, enum: ["single", "multiple"], required: true },
  numberOfSessions: {
    type: Number,
    required: function () {
      return this.type === "multiple";
    },
  },
  price: {
    type: Number,
    required: function () {
      return this.type === "single";
    },
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  duration: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  uniqueCode: { type: String, required: true, unique: true }, // Ensure unique code is unique
  date: { type: Date }, // Add date field
  time: { type: String }, // Add time field
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const User = mongoose.model("User", userSchema);
const Tutor = mongoose.model("Tutor", tutorSchema);
const Student = mongoose.model("Student", studentSchema);
const Lesson = mongoose.model("Lesson", lessonSchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Review = mongoose.model("Review", reviewSchema);
const Message = mongoose.model("Message", messageSchema);
const Offer = mongoose.model("Offer", offerSchema);

// Middleware to authenticate requests
// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      // Extract every piece of information from the decoded token
      req.user = decoded;
      next();
    });
  } else {
    // If token is not found, return a 401 status along with a message
    return res
      .status(401)
      .json({ message: "Token not found. Please sign up first." });
  }
};

// User Authentication Routes

// Register a new user
app.post("/tutors", authenticateToken, async (req, res) => {
  try {
    // Extract userId from the token
    const userId = req.user.id;
    console.log(userId);
    // Check if the user is already registered as a tutor
    const existingTutor = await Tutor.findOne({ user: userId });
    if (existingTutor) {
      return res
        .status(400)
        .send({ message: "User is already registered as a tutor" });
    }

    // Create a new tutor with userId
    const tutor = new Tutor({ user: userId, ...req.body });
    await tutor.save();
    res.status(201).send({ message: "Tutor created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/tutors/cards", async (req, res) => {
  try {
    // Fetch all tutors from the database
    const tutors = await Tutor.find();

    // Structure the data in card format
    const tutorCards = tutors.map((tutor) => ({
      id: tutor._id,
      name: tutor.name, // Assuming 'name' is a field in the Tutor schema
      subjectsTaught: tutor.subjectsTaught,
      qualifications: tutor.qualifications,
      hourlyRate: tutor.hourlyRate,
      // Add other fields as needed
    }));

    // Send the structured data as response
    res.status(200).json(tutorCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/tutors/filter", async (req, res) => {
  try {
    // Destructure filter criteria from request body
    const { name, subjectsTaught, qualifications, hourlyRate } = req.body;

    // Prepare filter object based on provided criteria
    const filter = {};
    if (name) filter.name = { $regex: new RegExp(name, "i") };
    if (subjectsTaught) filter.subjectsTaught = { $in: subjectsTaught };
    if (qualifications)
      filter.qualifications = { $regex: new RegExp(qualifications, "i") };
    if (hourlyRate) filter.hourlyRate = hourlyRate;

    // Find tutors matching the filter criteria
    const tutors = await Tutor.find(filter);

    // Structure the data
    const filteredTutors = tutors.map((tutor) => ({
      id: tutor._id,
      name: tutor.name,
      subjectsTaught: tutor.subjectsTaught,
      qualifications: tutor.qualifications,
      hourlyRate: tutor.hourlyRate,
      // Add other fields as needed
    }));

    // Return the filtered tutors
    res.status(200).json(filteredTutors);
  } catch (error) {
    // Handle errors
    console.error("Error filtering tutors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/tutor-details/:id", async (req, res) => {
  try {
    const tutorId = req.params.id;
    const tutor = await Tutor.findById(tutorId);
    if (tutor) {
      res.json(tutor);
    } else {
      res.status(404).json({ message: "Tutor not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Define the GET route
app.get("/check-user", async (req, res) => {
  // Extract the token from the request headers
  const token = req.headers.authorization.split(" ")[1];

  try {
    // Verify the token
    const decodedToken = jwt.verify(token, SECRET); // You need to have a JWT_SECRET defined in your environment variables

    // Extract the user ID from the decoded token
    const userId = decodedToken.id;

    // Query the tutor database to check if the user exists
    const tutor = await Tutor.findOne({ user: userId });

    // Send response indicating whether the user is a tutor or not
    console.log(!!tutor);
    return res.status(200).json({ isTutor: !!tutor }); // !! converts truthy or falsy value to true or false
  } catch (error) {
    // If there's an error (e.g., invalid token), send an error response
    console.error("Error checking user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/auth/register", async (req, res) => {
  const { username, email, password, profilePicture, bio } = req.body;

  try {
    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      bio,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, SECRET, {
      expiresIn: "1h",
    });

    // Respond with success message and token
    res.json({ message: "User created successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login an existing user
app.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ message: "User not found" });

    if (await bcryptjs.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(
        { username: user.username, id: user._id },
        SECRET
      );
      res.status(200).send({ message: "Logged In Successfully", accessToken });
    } else {
      res.status(401).send({ message: "Invalid password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Get user profile (requires authentication)
app.get("/auth/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

//Tutor Routes
app.post("/tutors", authenticateToken, async (req, res) => {
  console.log("Request body:", req.body);
  try {
    // Extract userId from the token
    const userId = req.user.id;

    // Check if the user is already registered as a tutor
    const existingTutor = await Tutor.findOne({ userId });
    if (existingTutor) {
      return res
        .status(400)
        .send({ message: "User is already registered as a tutor" });
    }

    // Check if the tutor already exists based on other criteria, such as name and location
    const { name, location } = req.body;
    const existingTutorByNameAndLocation = await Tutor.findOne({
      name,
      location,
    });
    if (existingTutorByNameAndLocation) {
      return res.status(400).send({
        message: "Tutor with the same name and location already exists",
      });
    }

    // Create a new tutor with userId
    const tutor = new Tutor({ userId, ...req.body });
    await tutor.save();
    res.status(201).send({ message: "Tutor created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/seltutor", async (req, res) => {
  try {
    // Extract the subject from the query parameters
    const subject = req.query.subject;
    console.log(subject);
    // Check if subject is provided
    if (!subject) {
      return res.status(400).json({ message: "Subject parameter is required" });
    }

    // Find tutors that teach the specified subject
    const tutors = await Tutor.find({ subjectsTaught: subject });

    // Structure the data in a format suitable for response
    const tutorDetails = tutors.map((tutor) => ({
      id: tutor._id,
      name: tutor.name,
      subjectsTaught: tutor.subjectsTaught,
      qualifications: tutor.qualifications,
      hourlyRate: tutor.hourlyRate,
      availability: tutor.availability,
      rating: tutor.rating,
      reviews: tutor.reviews,
      // Add other fields as needed
    }));

    // Send the structured data as response
    res.status(200).json(tutorDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/send-message", authenticateToken, async (req, res) => {
  try {
    const { receiver, sender, content } = req.body; // Assuming you're sending the tutor's ID and user's ID from the frontend
    const senderId = req.user.id; // Get the sender's ID from the authentication token
    // Create a new message document with sender and receiver IDs and timestamp
    const newMessage = new Message({
      sender: senderId,
      receiver: receiver,
      content,
      timestamp: new Date(), // Set the timestamp to the current date and time
    });

    // Save the message document to the database
    await newMessage.save();

    // Log the message content and timestamp
    console.log("Sender:", senderId);
    console.log("Receiver:", receiver);
    console.log("Content:", content);
    console.log("Timestamp:", newMessage.timestamp);

    // Send a success response
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/inbox/usernames", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user's ID from the authentication token

    // Find all unique usernames from sent and received messages
    const sentUserIds = await Message.find({ sender: userId }).distinct(
      "receiver"
    );
    const receivedUserIds = await Message.find({ receiver: userId }).distinct(
      "sender"
    );
    const allUserIds = [...new Set([...sentUserIds, ...receivedUserIds])];

    // Fetch usernames and IDs associated with the user IDs
    const users = await User.find({ _id: { $in: allUserIds } });
    const userData = users.map((user) => ({
      id: user._id,
      username: user.username,
    }));
    console.log({ users: userData });
    res.status(200).json({ users: userData }); // Send the user IDs and usernames as response
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/inbox/conversation/:userId", authenticateToken, async (req, res) => {
  try {
    const currentUser = req.user.id; // Get the current user's ID from the authentication token
    const otherUser = req.params.userId; // Get the ID of the user whose conversation is requested

    // Find messages where the sender is the current user and the receiver is the other user, or vice versa
    const messages = await Message.find({
      $or: [
        { sender: currentUser, receiver: otherUser },
        { sender: otherUser, receiver: currentUser },
      ],
    })
      .sort({ timestamp: 1 })
      .populate("sender", "username")
      .populate("receiver", "username"); // Sort messages by timestamp in ascending order and populate sender and receiver usernames

    const populatedMessages = messages.map((message) => ({
      sender: message.sender.username,
      receiver: message.receiver.username,
      content: message.content,
      timestamp: message.timestamp,
    }));

    res.status(200).json({ messages: populatedMessages });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/create-offer", authenticateToken, async (req, res) => {
  const {
    student,
    description,
    type,
    numberOfSessions,
    price,
    uniqueCode,
    date,
    time,
    duration,
  } = req.body;
  const tutor = req.user.id;
  const offer = new Offer({
    tutor,
    student,
    description,
    type,
    numberOfSessions,
    price,
    uniqueCode,
    date,
    time,
    duration,
    timestamp: new Date(),
  });

  offer
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Offer created successfully", offer: result });
    })
    .catch((error) => {
      console.error("Error creating offer:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the offer" });
    });
});

app.get("/offers/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId; // Get the ID of the other user
    const tokenUserId = req.user.id; // Get the user's ID from the authentication token

    // Find offers where the tutor is the current user and the student is the other user, or vice versa
    const offers = await Offer.find({
      $or: [
        { tutor: userId, student: tokenUserId },
        { tutor: tokenUserId, student: userId },
      ],
    }).populate("tutor student", "username"); // Populate tutor and student fields with their usernames
    console.log({ offers });
    res.status(200).json({ offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define the route handler for fetching user details
app.get("/userdetails", authenticateToken, async (req, res) => {
  try {
    // Extract userId from the decoded token
    const userId = req.user.id;

    // Query the database to find the user details
    const user = await User.findById(userId);

    // Check if the user exists
    if (user) {
      console.log({ user });
      // If the user exists, return the user details as JSON in the response
      res.status(200).json({
        userId,
        username: user.username,
        // Add other user details as needed
      });
    } else {
      // If the user is not found, return a 404 status along with a message
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // If there's an error, return a 500 status along with an error message
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
