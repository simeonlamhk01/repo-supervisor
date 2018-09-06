import req from 'request-promise';

module.exports = (message) => {
  // req.debug = true;

  const payload = JSON.stringify({
    text: message
  });

  const slackWebhookUri = process.env.SLACK_INCOMING_WEBHOOK_URL_REPO_SUPERVISOR;

  if (!slackWebhookUri) {
    throw new Error('slack webhook url missing');
  }

  const options = {
    method: 'POST',
    uri: slackWebhookUri,
    form: { payload }
  };

  return req(options);
};
