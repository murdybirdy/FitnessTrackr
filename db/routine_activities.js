const client = require("./client");

async function addActivityToRoutine({ routineId, activityId, count, duration }) {
  try {
    const { rows: [ routine_activity ] } = await client.query(/*sql*/ `
      INSERT INTO routine_activities ("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [ routineId, activityId, count, duration ]);

    return routine_activity;
    
  } catch (error) {
    console.log("Error adding activity to routine!");
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const { rows: [routine_activity] } = await client.query(/*sql*/ `
      SELECT *
      FROM routine_activities
      WHERE id=$1;
    `, [ id ]);
    
    return routine_activity;

  } catch (error) {
    console.log("Error getting routine by this id!");
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  console.log("Did I make it?", id);
  try {
    const { rows } = await client.query(/*sql*/ `
      SELECT *
      FROM routine_activities
      WHERE "routineId" = $1;
    `, [ id ])

    return rows;

  } catch (error) {
    console.log("Error getting routine activities by routine!");
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" = $${ index + 1 }`
  ).join(', ');
    console.log(setString);
  if (setString.length === 0) {
    return;
  }
  try {
    const { rows: [ routine_activity ] } = await client.query(/*sql*/`
      UPDATE routine_activities
      SET ${ setString }
      WHERE id = ${ id }
      RETURNING *;
    `, Object.values(fields));

    return routine_activity;

  } catch (error) {
    console.log("Error updating routine activity!");
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [ routine_activity ] } = await client.query(/*sql*/ `
      DELETE FROM routine_activities
      WHERE id = $1
      RETURNING *;
    `, [ id ]);

    return routine_activity;

  } catch (error) {
    console.log("Error destroying routine activity!");
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [ routine_activity ] } = await client.query(/*sql*/ `
      SELECT *
      FROM routine_activities
      WHERE id=$1;
    `, [ routineActivityId ]);
    const routineId = routine_activity.routineId;

    const { rows: [ routine ] } = await client.query(/*sql*/ `
      SELECT *
      FROM routines
      WHERE id=$1;
    `, [ routineId ]);

    if (routine.creatorId === userId) {
      return true;
    } else {
      return false;
    }

  } catch (error) {
    console.log("Error editing routine_activity!");
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
