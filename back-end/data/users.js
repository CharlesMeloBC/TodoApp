const bcrypt = require("bcryptjs");

const users = [
  {
    id: "admin", 
    email: "admin@example.com", // Email ao invés de username
    password: bcrypt.hashSync("998877", 10), // Senha criptografada
    role: "admin", 
  },
];

module.exports = users;
