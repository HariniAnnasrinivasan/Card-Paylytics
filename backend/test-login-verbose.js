const axios = require('axios');
axios.post('http://localhost:5000/api/auth/login', { email: 'manager@visabank.com', password: 'password123' })
.then(res => console.log('OK', res.data))
.catch(err => {
    if (err.response) {
        console.log('HTTP ERR', err.response.status, err.response.data);
    } else {
        console.log('NET ERR', err.message);
    }
});
