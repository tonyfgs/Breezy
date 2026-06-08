require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
  console.log(`Posts service running on port ${PORT}`);
});
