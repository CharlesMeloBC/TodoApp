const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("./data/users"); 

const app = express();
const PORT = 5000;
const JWT_SECRET = "seu_segredo_aqui"; 

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token recebido:", token); 
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso restrito a administradores" });
  }
  next();
};

app.use(cors());
app.use(express.json());

// Banco de dados in-memory
const tasks = [];

// Rotas
app.get("/tasks", authenticateJWT, (req, res) => {
  res.json(tasks);
});

app.post("/tasks", authenticateJWT, isAdmin, (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Título é obrigatório" });
  }

  const newTask = {
    id: uuidv4(),
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", authenticateJWT, isAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title,
    status,
    description,
    updatedAt: new Date().toISOString(),
  };
  res.json(tasks[taskIndex]);
});

app.delete("/tasks/:id", authenticateJWT, isAdmin, (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Tarefa não encontrada" });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// Rota de Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => {
    let userTest = user.email === email
    return userTest
  });
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Senha incorreta" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login bem-sucedido", token });
});

// Servidor rodando
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
