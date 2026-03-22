process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
axios.post('https://localhost:3000/api/auth/login', { email: 'admin@visabank.com', password: 'password' })
  .then(res => console.log('SUCCESS:', res.data))
  .catch(err => console.error('ERROR:', err.response ? err.response.data : err.message));
