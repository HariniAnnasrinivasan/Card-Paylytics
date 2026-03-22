const axios = require('axios');
axios.get('http://localhost:5000/api/customer-insights/dashboard', { headers: { Authorization: "Bearer TEST_TOKEN"} })
  .then(res => console.log('SUCCESS:', Object.keys(res.data).join(', ')))
  .catch(err => console.error('ERROR (Expected Unauthorized or 500 if broken):', err.response ? err.response.data : err.message));
