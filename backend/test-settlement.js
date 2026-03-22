const axios = require('axios');
axios.get('http://localhost:5000/api/settlement/dashboard', { headers: { Authorization: "Bearer TEST_TOKEN_IF_NEEDED"} })
  .then(res => console.log('SUCCESS:', Object.keys(res.data).join(', ')))
  .catch(err => console.error('ERROR:', err.response ? err.response.data : err.message));
