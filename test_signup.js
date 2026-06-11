const { createUser } = require('./backend/models/User');
const authController = require('./backend/controllers/authController');

const req = {
  body: {
    name: "Jane Nanny",
    email: "jane@nanny.com",
    password: "password123",
    role: "nanny",
    phone: "123456789",
    dob: "1990-01-01"
  }
};

const res = {
  json: (data) => console.log('res.json:', data),
  status: (code) => { console.log('res.status:', code); return res; }
};

async function run() {
  await authController.signup(req, res);
  const nannyController = require('./backend/controllers/nannyController');
  console.log('Mock profiles:', nannyController.mockNannyProfiles);
  process.exit(0);
}

run();
