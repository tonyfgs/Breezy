const router = require('express').Router();
const healthRouter = require('./health');

router.use('/health', healthRouter);

module.exports = router;
