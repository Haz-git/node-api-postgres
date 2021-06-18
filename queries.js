const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: true,
});

//Get all users:
const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) throw error;

        response.status(200).json(results.rows);
    });
}

//Get all user but with async/await:
// const getUsers = async (request, response) => {
//     try {
//         let result = await pool.query('SELECT * FROM users ORDER BY id ASC');
//         if (result) response.status(200).json(result.rows);
//     } catch(err) {
//         throw new err;
//     }
// }

//Get a single user by ID:
const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) throw error;

        response.status(200).json(results.rows);
    })
}

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

//Update a single user
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

//Delete a single user

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}