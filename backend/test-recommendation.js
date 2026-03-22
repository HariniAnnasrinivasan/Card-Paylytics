const axios = require('axios');
axios.get('http://localhost:5000/api/recommendation/dashboard', { headers: { Authorization: "Bearer TEST_TOKEN"} })
  .then(res => console.log('RECOMMENDATION SUCCESS:', Object.keys(res.data).join(', ')))
  .catch(err => console.error('RECOMMENDATION ERROR:', err.response ? err.response.data : err.message));
