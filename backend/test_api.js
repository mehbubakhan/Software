require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 115, role: 'parent' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

async function testApi() {
  try {
    console.log("Testing /messages/contacts...");
    const resContacts = await axios.get('http://localhost:5001/api/messages/contacts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Contacts count:", resContacts.data.data.length);
  } catch (err) {
    console.error("Contacts API Error:", err.response ? err.response.data : err.message);
  }

  try {
    console.log("\nTesting /messages (conversations)...");
    const resConv = await axios.get('http://localhost:5001/api/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Conversations count:", resConv.data.data.length);
  } catch (err) {
    console.error("Conversations API Error:", err.response ? err.response.data : err.message);
  }
}

testApi();
