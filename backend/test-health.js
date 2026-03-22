const axios = require('axios');
axios.get('http://localhost:5000/health')
  .then(res => console.log('HEALTH OK', res.data))
  .catch(err => console.log('HEALTH ERR', err.message));
