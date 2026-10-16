const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let students = [
  { id: 'SV001', name: 'Nguyen Van A', age: 20, grade: 'K20' },
  { id: 'SV002', name: 'Tran Thi B',   age: 21, grade: 'K20' },
  { id: 'SV003', name: 'Le Van C',     age: 19, grade: 'K21' },
];

app.get('/api/students', (req, res) => {
  res.json({ success: true, data: students, total: students.length });
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json({ success: true, data: student });
});

app.post('/api/students', (req, res) => {
  const { id, name, age, grade } = req.body;
  if (!id || !name) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const newStudent = { id, name, age: age || 0, grade: grade || '' };
  students.push(newStudent);
  res.status(201).json({ success: true, data: newStudent });
});

app.put('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  students[index] = { ...students[index], ...req.body };
  res.json({ success: true, data: students[index] });
});

app.delete('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  students.splice(index, 1);
  res.json({ success: true, message: 'Student deleted' });
});

app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  });
});

app.get('/api/search', (req, res) => {
  const q = req.query.q || '';
  const results = students.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase())
  );
  if (results.length === 0) {
    return res.send('<p>Không tìm thấy sinh viên với từ khóa: <b>' + q + '</b></p>');
  }
  res.json({ success: true, data: results, keyword: q });
});

app.listen(PORT, () => {
  console.log('Student API running at http://localhost:' + PORT);
});
