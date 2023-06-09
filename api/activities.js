const express = require('express');
const router = express.Router();
const { getActivityByName, createActivity } = require('../db/activities');

// GET /api/activities/:activityId/routines

// GET /api/activities

// POST /api/activities
router.post('/', async (req, res, next) => {
  try {
    const existingActivity = await getActivityByName(req.body.name);

    if (!existingActivity) {
      const newActivity = await createActivity(req.body);
      res.send(newActivity);
    } else {
      throw ({
        message: `An activity with name ${req.body.name} already exists`
      })
    }

  } catch (error) {
    next({
      error: "Duplicates",
      name: "Activity",
      message: `An activity with name ${req.body.name} already exists`
    })
  }
})

// PATCH /api/activities/:activityId

module.exports = router;
