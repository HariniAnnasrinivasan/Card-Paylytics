const axios = require('axios');
axios.post('http://localhost:5000/api/auth/login', { email: 'manager@visabank.com', password: 'password123' })
.then(res => {
   console.log("Logged in!", res.data.token.substring(0, 10) + '...');
   return axios.get('http://localhost:5000/api/manager/dashboard', { headers: { Authorization: 'Bearer ' + res.data.token }});
})
.then(res => console.log('MANAGER OK'))
.catch(err => console.error("ERR:", err.response ? err.response.status : err.message));
