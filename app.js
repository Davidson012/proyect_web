//import dotenv from 'dotenv';
//dotenv.config({ path: './src/env/.env' });

import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import db from './src/database/db.js';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(
  '/css',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css'))
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))
);

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

app.get('/forget-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'forget-password.html'));
});

app.post('/forget-password', (req, res) => {
  const { email } = req.body;

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: 'Restablecimiento de contraseña',
    text: `Recibió este correo electrónico porque usted (u otra persona) solicitó el restablecimiento de la contraseña de su cuenta.\n\n
    Haga clic en el siguiente enlace, o cópielo y péguelo en su navegador para completar el proceso:\n\n
    http://${req.headers.host}/reset-password\n\n
    Si no solicitó esto, ignore este correo electrónico y su contraseña permanecerá sin cambios.\n`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    res.send(
      `Se ha enviado un enlace para restablecer su contraseña a ${email}.`
    );
  });
});

app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'reset-password.html'));
});

app.post('/reset-password', (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match.');
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const query = 'UPDATE users SET password_user = ? WHERE email_user = ?';
  const values = [hashedPassword, email];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating password:', err);
      return res.status(500).send('Error updating password');
    }
    res.send('Password has been reset.');
  });
});

app.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const query =
    'INSERT INTO users (email_user, name_user, password_user) VALUES (?, ?, ?)';

  db.query(query, [email, username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error registering user');
    }
    res.send('User registered successfully');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email_user = ?';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error logging in user:', err);
      return res.status(500).send('Error logging in user');
    }
    if (results.length > 0) {
      const user = results[0];
      const passwordIsValid = bcrypt.compareSync(password, user.password_user);
      if (!passwordIsValid) {
        return res.status(401).send('Invalid email or password');
      }
      res.send('Login successful');
    } else {
      res.status(401).send('Invalid email or password');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
