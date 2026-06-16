const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/private/', function(req, res) {
    res.status(200).json({ msg: 'Welcome on private service' });
});

app.listen(port, () => {
    console.log(`Test private service running on port ${port}`);
});
