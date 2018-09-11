import req from 'request-promise';
import config from './../../../.config.json';

module.exports = (message) => {
  // req.debug = true;

  const payload = JSON.stringify({
    text: message
  });

  if (!slackWebhookUri) {
    throw new Error('slack webhook url missing');
  }

  const options = {
    method: 'POST',
    uri: config.SlackURL,
    form: { payload }
  };

  return req(options);
};
