/* eslint-disable no-useless-catch */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const express = require("express");
const router = express.Router();
const { 
  createUser,
  getUserByUsername,
  getUserById 
} = require('../db');
const {
  getPublicRoutinesByUser,
  getAllRoutinesByUser
} = require('../db/routines');

// POST /api/users/register
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  
  try {
    const _user = await getUserByUsername(username);
    if (password.length < 8) {
      next({
        error: "Password must be 8 characters",
        message: "Password Too Short!",
        name: "ShortPasswordError"
      });

    } else if (_user) {
      next({
        error: "Password must be 8 characters",
        message: `User ${username} is already taken.`,
        name: "ShortPasswordError"
      });

    } else {
      const user = await createUser(req.body);
      res.send({
        message: "User created successfully!",
        token: "token",
        user
      });

    }

  } catch ({ name, message }) {
    next({ name, message })
  }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  // if (!username || !password ) {
  //   next({
  //     message: "Please supply both a username and password"
  //   });
  // }

  try {
    const user = await getUserByUsername(username);
    // const userPassword = user.password;

    if (user) {
      const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET);
      res.send({
        user,
        token,
        message: "you're logged in!" 
      })
    }

  } catch (error) {
    next(error);
  }
});

// GET /api/users/me
router.get('/me', async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization"); 

  if (!auth) {
    res.status(401).send({
      error: "No token found",
      message: "You must be logged in to perform this action",
      name: "Unauthorized Error"
    })
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const { id } = jwt.verify(token, JWT_SECRET);
  
      if (id) {
        res.send(await getUserById(id));
      }
    } catch (error) {
      next(error);
    }
  }
})

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
   const currentUser = req.user.username;
   const userToSearch = req.params.username;

   try {
     if (currentUser !== userToSearch) {
      const publicRoutines = await getPublicRoutinesByUser(req.params);
      res.send(publicRoutines)
      
     } else {
      const allUserRoutines = await getAllRoutinesByUser(req.user);
      res.send(allUserRoutines)
     }

   } catch (error) {
    next(error);
   }
})

module.exports = router;
