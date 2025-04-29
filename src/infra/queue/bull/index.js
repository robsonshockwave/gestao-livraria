const Queue = require('bull');
const sendMail = require('../../../main/jobs/sendMail');

const sendMailQueue = new Queue(sendMail.key, {
  redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

module.exports = { sendMailQueue };
