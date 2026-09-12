const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendSMS = async (to, body) => {
  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE,
    to
  });
};