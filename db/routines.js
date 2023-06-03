// const { attachActivitiesToRoutines } = require('./'); 
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
    const { rows } = await client.query(/*sql*/ `
      SELECT *
      FROM routines;
    `);

    return rows;

    // await attachActivitiesToRoutines(rows); // ???

  } catch (error) {
    console.log("Error getting all routines!", error);
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(/*sql*/ `
      SELECT *
      FROM routines
      WHERE "isPublic" = true;
    `);

    return routines;

  } catch (error) {
    console.log("Error getting public routines", error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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
