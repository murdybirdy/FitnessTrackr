const express = require('express');
const { getRoutineById } = require('../db');
const router = express.Router();
const { UnauthorizedUpdateError, UnauthorizedDeleteError } = require('../errors');
const { 
  canEditRoutineActivity,
  getRoutineActivityById,
  updateRoutineActivity,
  destroyRoutineActivity
 } = require('../db/routine_activities');

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async (req, res, next) => {
  const { routineActivityId } = req.params;
  const count = req.body.count;
  const duration = req.body.duration;
  const userId = req.user.id;
  const username = req.user.username;

  try {
    const isValid = await canEditRoutineActivity(routineActivityId, userId);
    const routineActivity = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineActivity.routineId);
    
    if(!isValid) {
      throw ({
        error: "Unauthorized",
        message: UnauthorizedUpdateError(username, routine.name),
        name: "User"
      });
    } else {
      const updatedRoutineActivity = await updateRoutineActivity({
        id: routineActivityId,
        count,
        duration
      });
      res.send(updatedRoutineActivity);
    }

  } catch (error) {
    next(error);
  }
});

// DELETE /api/routine_activities/:routineActivityId
// router.delete('/:routineActivityId', async (req, res, next) => {
//   const id = req.params.routineActivityId;
//   const userId = req.user.id;
//   console.log("id, userId", id, userId);
//   const username = req.user.username;

//   try {
//     const isValid = await canEditRoutineActivity(id, userId);
//     const routineActivity = await getRoutineActivityById(id);
//     const routine = await getRoutineById(routineActivity.routineId);
    
//       const deletedRoutineActivity = await destroyRoutineActivity(id);
//       res.send(deletedRoutineActivity);

//   } catch (error) {
//     throw ({
//       statusCode: 403,
//       error: "Unauthorized",
//       message: UnauthorizedDeleteError(username, routine.name),
//       name: "User"
//     });
//   }
// });

router.delete('/:routineActivityId', async (req, res, next) => {
  const id = req.params.routineActivityId;
  const userId = req.user.id;
  const username = req.user.username;
  try {
    const isValid = await canEditRoutineActivity(id, userId);
    const routineActivity = await getRoutineActivityById(id);
    const routine = await getRoutineById(routineActivity.routineId);
    if (!isValid) {
      res.status(403).send ({
        error: "Unauthorized",
        name: "User",
        message:  UnauthorizedDeleteError(username, routine.name)
      })
    } else {
      const deletedRoutineActivity = await destroyRoutineActivity(id);
      res.send(deletedRoutineActivity);
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
