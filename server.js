import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// Setup for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Function to check if the IP is from Finland or Scandinavia
const isAllowedIP = async (ip) => {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        if (data.status === "fail") return false;

        const allowedCountries = ["Finland", "Sweden", "Norway", "Denmark"];
        return allowedCountries.includes(data.country);
    } catch (error) {
        console.error("IP check error:", error);
        return false;
    }
};

// Middleware to check IP and serve the correct page
app.use(async (req, res, next) => {
    const userIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // const userIP = "146.70.207.38";  // Hardcoded for local testing
    if (await isAllowedIP(userIP)) {
        next(); // Allow access to normal pages
    } else {
        res.status(403).sendFile(path.join(__dirname, "public", "403.html"));
    }
});

// Serve static content
app.use(express.static("public"));

// Basic homepage
// Route for home page
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Login page
app.use(express.json()); // Middleware to parse JSON requests

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "Betty" && password === "Betty") {
        res.json({ success: true, flag: "obscuractf{N0_VPN_C4n_S4v3_Y0u!}" });
    } else {
        res.json({ success: false, message: "Invalid credentials, try again!" });
    }
});




// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
