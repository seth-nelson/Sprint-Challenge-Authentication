const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const secrets = require('../config/secrets.js');

const Users = require('../users/users-model.js');
const { isValid } = require('../users/users-service.js');


function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
  };
    const options = {
      expiresIn: '2H'
    };

    return jwt.sign(payload, secrets.jwtSecret, options)
}

router.post('/register', (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 7;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    Users.add(credentials)
    .then(user => {
      const token = genToken(saved);
      res.status(201).json({ data: user, token });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
  } else {
    res.status(400).json({ message: 'Please provide alphanumeric username and password.' });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({ message: 'Welcome to our API.', token});
        } else {
          res.status(401).json({ message: 'Invalid credentials.' });
        }
      })
      .catch(err => {
        res.status(500).json({ message: error.message });
      });
    } else {
      res.status(400).json({ message: 'Please provide alphanumerical username and password.' });
    }
});


module.exports = router;
