require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testApi() {
  try {
    const token = jwt.sign({ id: 902, role: 'parent' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const profile = {
      name: "Demo Parent",
      phone: "111-222-3333",
      address: "456 Test Ave",
      emergencyContact: "John Doe",
      childModePin: "9999",
      childName: "Tommy",
      childAge: "5",
      photo: ""
    };
    
    const res = await axios.put('http://localhost:5001/api/families/my/profile', profile, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("API Response:", res.data);
    
    const resGet = await axios.get('http://localhost:5001/api/families/my/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("GET Response:", resGet.data);
    
  } catch (err) {
    console.error("API Error:", err.response ? err.response.data : err.message);
  }
}
testApi();
