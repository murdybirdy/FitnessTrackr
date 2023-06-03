const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity 
    try {
      const { rows: [ activity ] } = await client.query(/*sql*/`
        INSERT INTO activities (name, description)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
      `, [ name, description]);
  
      // delete user.password;
      return activity;
  
    } catch (error) {
      console.log("Error creating activity!");
      throw error;
    }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(/*sql*/`
      SELECT *
      FROM activities;
    `)

    return rows;
  } catch (error) {
    console.log("Error getting all activities!", error);
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const { rows: [ activity ] } = await client.query(/*sql*/`
      SELECT *
      FROM activities
      WHERE id=$1;
    `,[id]);

    // delete user.password;
    return activity;

  } catch (error) {
    console.log("Error getting activity by id!", error);
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const { rows: [activity] } = await client.query(/*sql*/`
      SELECT *
      FROM activities
      WHERE name = $1;
    `, [ name ]);

    return activity;
  } catch (error) {
    console.log("Error getting activity by name!", error);
    throw error;
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  // try {
  //   routines.map(routine =>)
  // } catch (error) {
  //   console.log("Error attaching activities to routines", error);
  //   throw error;
  // }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}" = $${ index + 1 }`
  ).join(', ');
    console.log(setString);
  if (setString.length === 0) {
    return;
  }
  try {
    const { rows: [ activity ] } = await client.query(/*sql*/`
      UPDATE activities
      SET ${ setString }
      WHERE id = ${ id }
      RETURNING *;
    `, Object.values(fields));

    return activity;
  } catch (error) {
    console.log("Error updating activity!", error);
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
