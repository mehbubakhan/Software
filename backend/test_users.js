require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 147, role: 'admin' }, process.env.JWT_SECRET || 'your_jwt_secret');

async function testUsers() {
  try {
    const res = await axios.get('http://localhost:5001/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Success! Users found:", res.data.data.length);
  } catch(err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}
testUsers();
