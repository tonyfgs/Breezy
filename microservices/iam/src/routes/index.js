const router = require('express').Router();
const healthRouter = require('./health');

router.get('/', (_req, res) => {
  res.json({ service: 'IAM Service' });
});

router.use('/health', healthRouter);

module.exports = router;
