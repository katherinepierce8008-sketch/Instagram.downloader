
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper برای خواندن/نوشتن users.json
const usersFile = path.join(__dirname, 'users.json');

function readUsers() {
  const data = fs.readFileSync(usersFile, 'utf8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
}

// API لاگین
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است.' });
  }

  res.json({
    username: user.username,
    role: user.role,
    grades: user.grades || {}
  });
});

// API گرفتن همه یوزرها
app.get('/api/users', (req, res) => {
  const users = readUsers();

  const sanitized = users.map(u => ({
    username: u.username,
    role: u.role,
    grades: u.grades || {}
  }));

  res.json(sanitized);
});

// API ساخت یوزر جدید
app.post('/api/users', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'یوزرنیم و پسورد اجباری است.' });
  }

  const users = readUsers();
  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.status(409).json({ message: 'این یوزرنیم قبلاً ثبت شده است.' });
  }

  const newUser = {
    username,
    password,
    role: role || 'student',
    grades: {}
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ message: 'کاربر با موفقیت ایجاد شد.', user: newUser });
});

// API ثبت/ویرایش نمرات
app.post('/api/grades', (req, res) => {
  const { username, midterm, final, classwork } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'یوزرنیم دانشجو الزامی است.' });
  }

  const users = readUsers();
  const student = users.find(u => u.username === username && u.role === 'student');

  if (!student) {
    return res.status(404).json({ message: 'دانشجو پیدا نشد.' });
  }

  student.grades = {
    midterm: midterm ?? student.grades?.midterm ?? null,
    final: final ?? student.grades?.final ?? null,
    classwork: classwork ?? student.grades?.classwork ?? null
  };

  writeUsers(users);

  res.json({ message: 'نمرات با موفقیت ثبت شد.', grades: student.grades });
});

// ساعت (اختیاری)
app.get('/api/time', (req, res) => {
  const now = new Date();
  res.json({ now: now.toISOString() });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
  console.log(`Portal Mahmoudi running on http://localhost:${PORT}`);
});


