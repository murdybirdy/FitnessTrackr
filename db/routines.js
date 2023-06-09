const { attachActivitiesToRoutines } = require('./activities');
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [ routine ] } = await client.query(/*sql*/ `
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;

  } catch (error) {
    console.log("Error creating routine!", error);
    throw error;
  } 
}

async function getRoutineById(id) {
  try {
    const { rows: [ routine ] } = await client.query(/*sql*/ `
      SELECT *
      FROM routines
      WHERE id = ${ id }
    `);

    return routine;

  } catch (error) {
    console.log("Error getting routine by Id!");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(/*sql*/ `
      SELECT *
      FROM routines;
    `);

    return rows;

  } catch (error) {
    console.log("Error getting routines without activities", error);
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(/*sql*/ `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id;
    `);

    return await attachActivitiesToRoutines(routines);

  } catch (error) {
    console.log("Error getting all routines!", error);
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    // const { rows: routines } = await client.query(/*sql*/ `
    //   SELECT routines.*, users.username AS "creatorName"
    //   FROM routines
    //   INNER JOIN users
    //   ON routines."creatorId" = users.id
    //   WHERE "isPublic" = true;
    // `);

    const routines = await getAllRoutines();
    const publicRoutines = routines.filter((routine) => routine.isPublic === true);

    return await publicRoutines;

  } catch (error) {
    console.log("Error getting public routines", error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutines();
    const userRoutines = routines.filter((routine) => routine.creatorName === username);

    return await userRoutines;

  } catch (error) {
    console.log("Error getting routines by user!");
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(/*sql*/`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      INNER JOIN users
      ON routines."creatorId" = users.id
      WHERE users.username = $1 AND routines."isPublic" = true;  
    `, [ username ]);
    return await attachActivitiesToRoutines(routines);

  } catch (error) {
    console.log("Error getting public routines by user!");
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    // const routines = await getAllRoutines();

    // const publicRoutines = routines.filter(
    //   (routine) =>
    //   routine.isPublic === true
    // );

    // const routinesByActivity = publicRoutines.activities.filter(
    // (activity) => activity.routineActivityId === id)

    // return routinesByActivity;

    const { rows: routines } = await client.query(/*sql*/ `
      SELECT routines.*, routine_activities."routineId", routine_activities."activityId", users.username AS "creatorName"
      FROM routines
      INNER JOIN routine_activities
      ON routines.id = routine_activities."routineId"
      INNER JOIN users
      ON routines."creatorId" = users.id
      WHERE routine_activities."activityId" = $1 AND routines."isPublic" = true;
    `, [ id ]);

    return await attachActivitiesToRoutines(routines);

  } catch (error) {
    console.log("Error getting public routines by activity!");
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setFields = Object.keys(fields).map(
    (key, index) => `"${ key }" = $${ index + 1 }`
  ).join(', ');
  
  if (setFields.length === 0) {
    return;
  }
  try {

    const { rows: [ routine ] } = await client.query(/*sql*/ `
      UPDATE routines
      SET ${ setFields }
      WHERE id = ${ id }
      RETURNING *;
    `, Object.values(fields));

    return routine;

  } catch (error) {
    console.log("Error updating routine!");
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(/*sql*/ `
    DELETE FROM routine_activities
    WHERE "routineId" = $1;
    `, [ id ]);

    await client.query(/*sql*/ `
      DELETE FROM routines
      WHERE id = ${id}
    `);

  } catch (error) {
    console.log("Error destroying routine!");
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
