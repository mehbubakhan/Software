require('dotenv').config();

console.log('Connection Config:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('User:', process.env.DB_USER);
console.log('Password:', `"${process.env.DB_PASSWORD}"`);
console.log('Password length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
console.log('DB Name:', process.env.DB_NAME);
