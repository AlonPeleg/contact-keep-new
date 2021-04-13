const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const app = express();

// Import Routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const contactsRoute = require("./routes/contacts");

dotenv.config();

// Connect to DB
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define routes
app.get("/", (req, res) => {
  res.json({ msg: "Welcome to Contact Keeper API" });
});

// Define Routes
app.use("/api/users", userRoute);
app.use("/api/contacts", contactsRoute);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
