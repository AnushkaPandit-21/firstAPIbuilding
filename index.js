const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();
app.use(express.json());

// 1. Connect to MySQL (update password!)
const sequelize = new Sequelize("usersdb", "root", "dattatray@21", {
  host: "localhost",
  port: 3306, // default MySQL port
  dialect: "mysql",
});

// 2. Define User model
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,  // age must be integer
      min: 1,       // optional: must be positive
    }
  },
});

// 3. Sync database
sequelize.sync().then(() => {
  console.log("✅ Database & tables ready!");
});

// 4. Routes
// Add user
app.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const user = await User.create({ name, email, age });
    res.status(201).json(user);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Email must be unique" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Start server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
