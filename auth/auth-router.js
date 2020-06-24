const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secrets = require('../config/secrets.js');

const Users = require('../users/users-model.js');


function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  };
    const options = {
      expiresIn: '2h' 
    };
  const token = jwt.sign(payload, secrets.jwtSecret, options);
  return token;
}

router.post('/register', (req, res) => {
  // implement registration
  const user = req.body;
  if (typeof user.username === 'undefined' || typeof user.password === 'undefined') {
    res.status(401).json({ error: 'missing username or password field' });
  } else {
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users.add(user)
      .then((saved) => {
        const token = genToken(saved);
        res.status(201).json({ created_user: saved, token });
      })
      .catch((err) => res.status(500).json({
        error: 'error while registering user',
        message: err.message,
      }));
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;
  if (typeof username === 'undefined' || typeof password === 'undefined') {
    res.status(401).json({ error: 'missing username or password field' });
  } else {
    Users.findBy({ username })
      .first()
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ username: user.username, token });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch((err) => res.status(500).json({
        error: 'error while logging into database',
        message: err.message,
      }));
  }
});

module.exports = router;
