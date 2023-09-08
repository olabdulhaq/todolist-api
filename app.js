const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

const todosFilePath = 'tasks.json';

function readTodosFile() {
  const data = fs.readFileSync(todosFilePath, 'utf8');
  return JSON.parse(data);
}

function writeTodosFile(data) {
  fs.writeFileSync(todosFilePath, JSON.stringify(data, null, 2));
}

function generateUniqueId() {
  return Date.now();
}

// Create a new task
app.post('/tasks', (req, res) => {
  const { task, startTime, endTime, date } = req.body;

  if (!task || !date) {
    return res.status(400).json({ error: 'Task and date are required' });
  }

  const tasks = readTodosFile();
  const newTask = {
    id: generateUniqueId(),
    task,
    startTime,
    endTime,
    date,
    completed: false,
  };

  tasks.unshift(newTask);
  writeTodosFile(tasks);

  res.status(201).json(newTask);
});

// GET route to fetch todos with pagination
app.get('/tasks', (req, res) => {
  const tasks = readTodosFile();

  res.json({
    received: tasks.length,
    rows: tasks,
  });
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task, startTime, endTime, date, completed } = req.body;

  const tasks = readTodosFile();
  const taskToUpdate = tasks.find((task) => task.id === parseInt(id));

  if (!taskToUpdate) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (task) {
    taskToUpdate.task = task;
  }

  if (completed !== undefined) {
    taskToUpdate.completed = completed;
  }

  if (completed !== undefined) {
    taskToUpdate.startTime = startTime;
  }

  if (completed !== undefined) {
    taskToUpdate.endTime = endTime;
  }

  if (completed !== undefined) {
    taskToUpdate.date = date;
  }

  writeTodosFile(tasks);

  res.json(taskToUpdate);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const tasks = readTodosFile();
  const indexToRemove = tasks.findIndex((task) => task.id === parseInt(id));

  if (indexToRemove === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  tasks.splice(indexToRemove, 1);
  writeTodosFile(tasks);

  res.status(204).send(); // 204 means No Content (successful deletion)
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
