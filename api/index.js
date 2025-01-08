const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // Import fs
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "hachjabcupjqdpb556aed";

const Place = require("./models/place");

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173",
}));

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({ userDoc });
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({ userDoc, status: "success", message: "Login successful" });
        }
      );
    } else {
      res.status(422).json({ status: "error", message: "Invalid password" });
    }
  } else {
    res.status(404).json({ status: "error", message: "User not found" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ status: "error", message: "Unauthorized" });
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "lax",
      secure: false,
    }).json(true);
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  const destination = path.join(__dirname, "uploads", newName);
  try {
    await imageDownloader.image({
      url: link,
      dest: destination,  // Save in the uploads directory
    });
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${newName}`;
    res.json(fileUrl);
  } catch (error) {
    console.error("Image download failed:", error.message);
    res.status(500).json({ message: "Image download failed", error });
  }
});


const phototsMiddleware = multer({ dest: "uploads/" });
app.post("/upload", phototsMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path: tempPath, originalname } = req.files[i];
    const ext = path.extname(originalname); // Get file extension
    const newPath = `${tempPath}${ext}`; // Add extension to temporary path
    fs.renameSync(tempPath, newPath); // Rename the file with extension
    const fileName = path.basename(newPath); // Extract the file name
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`; // Construct the correct URL
    uploadedFiles.push(fileUrl);
  }
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    try {
      // Create a new place document
      const placeDoc = await Place.create({
        owner: userData.id, // Use the user ID from the verified token
        title, 
        address, 
        addedPhotos, 
        description, 
        perks,
        extraInfo, 
        checkIn, 
        checkOut, 
        maxGuests,
      });

      // Send the newly created place document as the response
      res.json(placeDoc);
    } catch (error) {
      console.error("Failed to create place:", error);
      res.status(500).json({ status: "error", message: "Failed to create place" });
    }
  });
});



app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
