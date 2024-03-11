const express = require('express');
const router = express.Router();
const { body } = require('express-validator')

const topicApi = require('../api/topic_api')

const checkLogin = require('../middleware/check_login')

router.get('/topics', checkLogin, topicApi.get_topics)

module.exports = router;
