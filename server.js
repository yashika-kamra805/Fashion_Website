const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs"); 
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.static(path.join(__dirname, "views")));

const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" }
  });

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/Shopdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

  const Message = require("./models/Message");
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "contact.html"));
});
//messages
app.get("/messages", async (req, res) => {
    try {
      const messages = await Message.find().sort({ date: -1 });
      res.json(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });  

  app.post("/submit-message", async (req, res) => {
    const { name, email, subject, message } = req.body;
  
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const newMessage = new Message({ name, email, subject, message });
      await newMessage.save();
  
      console.log("Form Submission:", newMessage);
      res.status(200).json({ message: "Message saved successfully!" });
    } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ error: "Failed to save message" });
    }
  });
  
  
  app.put("/update-message", async (req, res) => {
    const { email, subject, message } = req.body;
  
    if (!email || !subject || !message) {
      return res.status(400).json({ error: "Email, subject, and message are required for update" });
    }
  
    try {
      const updated = await Message.findOneAndUpdate(
        { email },
        { subject, message, date: new Date() },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ error: "Message not found" });
      }
  
      res.status(200).json({ message: "Message updated successfully!", updated });
    } catch (error) {
      console.error("Error updating message:", error);
      res.status(500).json({ error: "Failed to update message" });
    }
  });
  
  app.delete("/delete-message", async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: "Email is required to delete a message" });
    }
  
    try {
      const deleted = await Message.findOneAndDelete({ email });
  
      if (!deleted) {
        return res.status(404).json({ error: "No message found for the given email" });
      }
  
      res.status(200).json({ message: "Message deleted successfully!" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });
  
//signup
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"));
  });

  app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

const User = require("./models/User");
const saltRounds = 10;

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hashedPassword, role: email === "admin2884@gmail.com" ? "admin" : "user" });
    await newUser.save();

    res.status(200).json({ message: "Signup successful!" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/delete", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required to delete a user" });
    }

    try {
        const userToDelete = await User.findOne({ email });

        if (!userToDelete) {
            return res.status(404).json({ error: "No user found with the given email" });
        }

        await User.deleteOne({ email });

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        console.error("Error during user deletion:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//login
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

const SECRET_KEY = "your_jwt_secret"; 

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }
    const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    res.json({
      message: user.role === "admin" ? "Welcome Admin!" : "Welcome User!",
      role: user.role,
      token,
      email: user.email,
      redirect: "/contact"
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//cart
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token required" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user; 
        next();
    });
}
app.get("/shop",(req,res) => {
    res.sendFile(path.join(__dirname, "views" , "shop.html"));
})

const Cart = require("./models/Cart");

app.get("/cart", authenticateToken, async (req, res) => {
    try {
      const email = req.user.email;
      const cart = await Cart.findOne({ email });
      res.json(cart ? cart.items : []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });
  const Product = require('./models/Product'); 

app.post("/cart/add", authenticateToken, async (req, res) => {
  const email = req.user.email;
    let newItem = req.body;
  
    try {
     if (newItem.productId && !newItem.title && !newItem.name) {
        const product = await Product.findById(newItem.productId);
          if (!product) {
              return res.status(404).json({ error: "Product not found" });
          }
  
        newItem = {
            itemId: Date.now(),
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            productId: product._id,
        };
          } else {
              newItem.itemId = Date.now(); // add itemId to frontend item
          }
  
          let cart = await Cart.findOne({ email });
          if (!cart) {
              cart = new Cart({ email, items: [newItem] });
          } else {
              cart.items.push(newItem);
          }
  
          await cart.save();
          res.status(200).json({ message: "Item added to cart", item: newItem });
  
      } catch (err) {
          console.error("Error adding item to cart:", err);
          res.status(500).json({ error: "Failed to add item to cart" });
      }
  });
  

  app.post("/cart/remove", authenticateToken, async (req, res) => {
    const email = req.user.email;
    const { itemId } = req.body;

    try {
        const cart = await Cart.findOne({ email });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        console.log("Removing itemId:", itemId);
        console.log("Existing itemIds:", cart.items.map(item => item.itemId));

        cart.items = cart.items.filter(item => item.itemId.toString() !== itemId.toString());
        await cart.save();

        res.json({ message: "Item removed", cart: cart.items });
    } catch (err) {
        console.error("Error removing item:", err);
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
});


//admin role

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

app.get("/products", async (req, res) => {
  try {
      const products = await Product.find();
      res.json(products);
  } catch (err) {
      res.status(500).json({ error: "Error fetching products" });
  }
});

app.post("/products-add", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can add products" });
  }

  const { name, price, category, image, stock } = req.body;

  if (!name || !price || !category || !image || !stock) {
      return res.status(400).json({ error: "All fields are required" });
  }

  try {
      const newProduct = new Product({ name, price, category, image, stock });
      await newProduct.save();
      res.status(200).json({ message: "Product added successfully", newProduct });
  } catch (err) {
      res.status(500).json({ error: "Error saving product" });
  }
});

app.delete("/products-delete/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can delete products" });
  }

  try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });

      res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
      res.status(500).json({ error: "Error deleting product" });
  }
});

app.put("/products-edit/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can edit products" });
  }

  const { name, price, category, image, stock } = req.body;

  try {
      const product = await Product.findByIdAndUpdate(
          req.params.id,
          { name, price, category, image, stock },
          { new: true }
      );

      if (!product) return res.status(404).json({ error: "Product not found" });

      res.status(200).json({ message: "Product updated", product });
  } catch (err) {
      res.status(500).json({ error: "Error updating product" });
  }
});

app.get("/more", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "more.html"));
});

// app.get('/cart/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//       const cart = await Cart.findOne({ userId }).populate('products.productId');

//       if (!cart) {
//           return res.status(404).json({ message: 'Cart not found' });
//       }

//       res.status(200).json(cart);
//   } catch (err) {
//       console.error('Error fetching cart:', err);
//       res.status(500).json({ message: 'Server error' });
//   }
// });

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});