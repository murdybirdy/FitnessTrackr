const express = require('express');
const router = express.Router();
const { ActivityNotFoundError, ActivityExistsError } = require('../errors');
const { getPublicRoutinesByActivity } = require('../db/routines');
const { 
  getActivityByName,
  createActivity,
  getAllActivities,
  updateActivity,
  getActivityById
} = require('../db/activities');

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
  const { activityId } = req.params;

  try {
    const publicRoutines = await getPublicRoutinesByActivity({ id: activityId });

    if (publicRoutines && publicRoutines.length) {
      res.send(publicRoutines);
      
    } else {
      throw ({
        error: "Not found",
        message: ActivityNotFoundError(activityId),
        name: "Activity Not Found Error"
      });
    }

  } catch (error) {
    next(error);
  }
});

// GET /api/activities
router.get('/', async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);

  } catch (error) {
    next(error);
  }
});

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
router.patch('/:activityId', async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  try {
    const activityByName = await getActivityByName(name);
    const activityById = await getActivityById(activityId);

    if (activityByName) {
      throw ({
        error: "Duplicate",
        message: ActivityExistsError(name),
        name: "Activity Exists Error"
      })
    } else if (!activityById) {
      throw ({
        error: "Not Found",
        message: ActivityNotFoundError(activityId),
        name: "Activity Not Found Error"
      })
    } else {
      const updatedActivity = await updateActivity({ 
        id: activityId, 
        name: name,
        description: description });
      res.send(updatedActivity);
    }

  } catch (error) {
    next(error);
  }
})

module.exports = router;
