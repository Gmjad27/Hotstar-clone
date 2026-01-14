const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

/* =======================
   MongoDB Connection
======================= */
mongoose
    .connect(`${process.env.mongodb_uri}`)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

/* =======================
   User Schema
======================= */
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model("User", UserSchema);

/* =======================
   JWT Middleware
======================= */
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token)
        return res.status(401).json({ message: "No token, access denied" });

    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

/* =======================
   SIGNUP
======================= */
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ message: "User already exists" });
    }
});

/* =======================
   LOGIN
======================= */
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});

/* =======================
   PROTECTED ROUTE
======================= */
app.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

/* =======================
   Server
======================= */
app.listen(5000, () =>
    console.log("Server running on http://localhost:5000")
);
