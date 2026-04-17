const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

// DATABASE CONNECTION (AIVEN FIXED)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// CONNECT DB
db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});


// HOME PAGE
app.get("/", (req, res) => {

  db.query("SELECT * FROM students", (err, results) => {

    if (err) {
      return res.send("Database Error");
    }

    let html = `
<html>
<head>
<title>Student System</title>

<style>
body { font-family: Arial; margin:0; background:#f0f2f5; }
.header { background:#1877f2; color:white; padding:15px; font-size:22px; font-weight:bold; }
.container { width:70%; margin:auto; margin-top:30px; }
.card { background:white; padding:20px; margin-bottom:20px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.2); }
input { width:95%; padding:10px; margin-top:8px; margin-bottom:10px; border-radius:6px; border:1px solid #ddd; }
button { background:#1877f2; color:white; border:none; padding:10px 18px; border-radius:6px; cursor:pointer; }
.student { border-bottom:1px solid #ddd; padding:10px 0; }
.edit { color:#1877f2; margin-right:10px; }
.delete { color:red; }
</style>

</head>
<body>

<div class="header">Student CRUD Dashboard</div>

<div class="container">

<div class="card">
<h2>Add Student</h2>

<form method="POST" action="/add">
<input name="stud_name" placeholder="Name" required>
<input name="stud_address" placeholder="Address" required>
<input name="age" placeholder="Age" required>
<button>Add Student</button>
</form>

</div>

<div class="card">
<h2>Student List</h2>
`;

    results.forEach(student => {
      html += `
<div class="student">
<b>${student.stud_name}</b><br>
Address: ${student.stud_address}<br>
Age: ${student.age}<br>

<a class="edit" href="/edit/${student.stud_id}">Edit</a>
<a class="delete" href="/delete/${student.stud_id}">Delete</a>
</div>
`;
    });

    html += `
</div>
</div>
</body>
</html>
`;

    res.send(html);

  });

});


// ADD STUDENT
app.post("/add", (req, res) => {
  const { stud_name, stud_address, age } = req.body;

  db.query(
    "INSERT INTO students (stud_name, stud_address, age) VALUES (?, ?, ?)",
    [stud_name, stud_address, age],
    () => res.redirect("/")
  );
});


// EDIT PAGE
app.get("/edit/:id", (req, res) => {

  db.query(
    "SELECT * FROM students WHERE stud_id=?",
    [req.params.id],
    (err, results) => {

      const student = results[0];

      res.send(`
<html>
<body style="font-family:Arial;background:#f0f2f5;">

<div style="width:40%;margin:auto;margin-top:80px;background:white;padding:20px;border-radius:10px;">

<h2>Edit Student</h2>

<form method="POST" action="/update/${student.stud_id}">
<input name="stud_name" value="${student.stud_name}">
<input name="stud_address" value="${student.stud_address}">
<input name="age" value="${student.age}">
<button>Update</button>
</form>

</div>

</body>
</html>
`);
    }
  );
});


// UPDATE
app.post("/update/:id", (req, res) => {
  const { stud_name, stud_address, age } = req.body;

  db.query(
    "UPDATE students SET stud_name=?, stud_address=?, age=? WHERE stud_id=?",
    [stud_name, stud_address, age, req.params.id],
    () => res.redirect("/")
  );
});


// DELETE
app.get("/delete/:id", (req, res) => {
  db.query(
    "DELETE FROM students WHERE stud_id=?",
    [req.params.id],
    () => res.redirect("/")
  );
});


// START SERVER (RENDER FIX)
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});