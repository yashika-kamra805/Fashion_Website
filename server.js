const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs"); // Import file system module

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const messagesFilePath = path.join(__dirname, "messages.json"); // Define file path

app.use(cors()); // Allow API requests
app.use(bodyParser.json()); // Parse JSON data
app.use(express.static(path.join(__dirname, "views"))); // Serves HTML files
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (CSS, JS, images)

// ✅ Ensure messages.json exists before reading
if (!fs.existsSync(messagesFilePath)) {
    fs.writeFileSync(messagesFilePath, JSON.stringify([])); // Create an empty array
}

// ✅ Serve Contact Page
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "views", "contact.html"); // Ensure correct path
    console.log("Serving file:", filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});
// ✅ Function to Read Messages
const readMessages = () => {
    if (fs.existsSync(messagesFilePath)) {
        return JSON.parse(fs.readFileSync(messagesFilePath, "utf8"));
    }
    return []; // Return empty array if file doesn't exist
};

// ✅ API to Get Saved Messages
app.get("/messages", (req, res) => {
    const messages = readMessages();
    res.json(messages);
});


// ✅ Handle Contact Form Submission
app.post("/submit-message", (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = { name, email, subject, message, date: new Date() };

    try {
        // Read existing messages
        let messages = [];
        if (fs.existsSync(messagesFilePath)) {
            messages = JSON.parse(fs.readFileSync(messagesFilePath, "utf8"));
        }
        
        // Add new message
        messages.push(newMessage);

        // Save back to file
        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));

        console.log("Form Submission:", newMessage);
        res.status(200).json({ message: "Message saved successfully!" });

    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Failed to save message" });
    }
});

// ✅ Update Existing Message (PUT Method)
app.put("/update-message", (req, res) => {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        return res.status(400).json({ error: "Email, subject, and message are required for update" });
    }

    try {
        let messages = JSON.parse(fs.readFileSync(messagesFilePath, "utf8"));

        // Find message by email
        let messageIndex = messages.findIndex((msg) => msg.email === email);

        if (messageIndex === -1) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Update message
        messages[messageIndex].subject = subject;
        messages[messageIndex].message = message;
        messages[messageIndex].date = new Date();

        // Save updated messages back to file
        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));

        console.log("Message Updated:", messages[messageIndex]);
        res.status(200).json({ message: "Message updated successfully!" });

    } catch (error) {
        console.error("Error updating message:", error);
        res.status(500).json({ error: "Failed to update message" });
    }
});

// 🗑 DELETE Method to Remove a Message by Email
app.delete("/delete-message", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required to delete a message" });
    }

    if (!fs.existsSync(messagesFilePath)) {
        return res.status(404).json({ error: "No messages found" });
    }

    let messages = JSON.parse(fs.readFileSync(messagesFilePath));

    // Filter messages to remove the one with the given email
    const filteredMessages = messages.filter((msg) => msg.email !== email);

    if (filteredMessages.length === messages.length) {
        return res.status(404).json({ error: "No message found for the given email" });
    }

    fs.writeFileSync(messagesFilePath, JSON.stringify(filteredMessages, null, 2));

    res.status(200).json({ message: "Message deleted successfully!" });
});

// Serve Signup Page
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"));
});
const readUsers= () => {
    if (fs.existsSync(usersFilePath)) {
        return JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
    }
    return []; // Return empty array if file doesn't exist
};

// ✅ API to Get Saved 
app.get("/users", (req, res) => {
    const data = readUsers();
    res.json(data);
});

const usersFilePath = path.join(__dirname, "users.json");

app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    let users = [];

    // Read existing users
    if (fs.existsSync(usersFilePath)) {
        const rawData = fs.readFileSync(usersFilePath, "utf8");
        users = JSON.parse(rawData);
    }

    // Check if email already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ error: "Email already registered" });
    }

    // Save new user (without hashing password)
    users.push({ username, email, password });

    // Write back to file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.status(200).json({ message: "Signup successful!" });
});

// 🗑 DELETE Method to Remove a User by Email
app.delete("/delete", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required to delete a user" });
    }

    if (!fs.existsSync(usersFilePath)) {
        return res.status(404).json({ error: "No users found" });
    }

    let users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

    // Filter users to remove the one with the given email
    const filteredUsers = users.filter((user) => user.email !== email);

    if (filteredUsers.length === users.length) {
        return res.status(404).json({ error: "No user found for the given email" });
    }

    fs.writeFileSync(usersFilePath, JSON.stringify(filteredUsers, null, 2));

    res.status(200).json({ message: "User deleted successfully!" });
});

// Corrected Login Page Route
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

// ✅ API to Get All Users
app.get("/users", (req, res) => {
    if (fs.existsSync(usersFilePath)) {
        const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
        return res.json(users);
    }
    res.status(404).json({ error: "No users found!" });
});

//Handle login

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    let users = [];

    // Read users.json and log output
    if (fs.existsSync(usersFilePath)) {
        const fileData = fs.readFileSync(usersFilePath, "utf8");
        try {
            users = JSON.parse(fileData);
            console.log("✅ Users Loaded:", users);
        } catch (error) {
            console.error("❌ Error parsing users.json:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        console.error("⚠️ users.json file not found!");
        return res.status(500).json({ error: "User database not found!" });
    }

    // Check if user exists
    const user = users.find(u => u.username === username);

    if (!user) {
        console.log("❌ User not found:", username);
        return res.status(401).json({ error: "Invalid username or password!" });
    }

    // Check password
    if (user.password !== password) {
        console.log("❌ Incorrect password for:", username);
        return res.status(401).json({ error: "Invalid username or password!" });
    }

    console.log("✅ Login successful for:", username);
    res.json({ message: "Login successful!", redirect: "/contact" });
});
  



//cart

app.get("/shop", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "shop.html"));
});
let cart = [];

// API to get cart items
app.get("/cart", (req, res) => {
    res.json(cart);
});

// API to add an item to the cart
app.post("/cart", (req, res) => {
    const item = req.body;
    item.id = cart.length ? cart[cart.length - 1].id + 1 : 1;  // Auto-increment ID
    cart.push(item);
    res.json({ message: "Item added to cart", cart });
});


// API to remove an item from the cart
app.delete("/cart/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    console.log(`Delete request received for ID: ${itemId}`); // Log request ID
    console.log("Current cart:", cart); // Log current cart before deletion

    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
        console.log(`Item with ID ${itemId} not found`);
        return res.status(404).json({ message: `Item with ID ${itemId} not found` });
    }

    cart.splice(itemIndex, 1);
    console.log(`Item with ID ${itemId} deleted`);
    res.json({ message: `Item with ID ${itemId} removed`, cart });
});


app.put("/cart/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedItem = req.body;
    
    let itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart[itemIndex] = { ...cart[itemIndex], ...updatedItem };
        res.json({ message: `Item with ID ${itemId} updated`, cart });
    } else {
        res.status(404).json({ message: `Item with ID ${itemId} not found` });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
