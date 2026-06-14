const axios = require('axios');
async function test() {
  try {
    const login = await axios.post('http://localhost:5001/api/auth/login', { email: 'adoption01@gmail.com', password: '1234' });
    const token = login.data.token;
    const res = await axios.post('http://localhost:5001/api/adoption/children', { child_name: 'Test Child', age: 5, gender: 'Male', health_condition: 'Good', adoption_status: 'Available' }, { headers: { Authorization: `Bearer ${token}` } });
    console.log(res.data);
  } catch(e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
}
test();
