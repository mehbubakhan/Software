const { findAllUsers } = require('./models/User')

async function run() {
  try {
    const users = await findAllUsers()
    console.log(users)
  } catch (err) {
    console.error(err)
  }
  process.exit(0)
}

run()
