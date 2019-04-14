"use strict";

require("dotenv").config();
const dialogflow = require("dialogflow");

const DIALOGFLOW_CREDENTIALS = {
  type: "service_account",
  project_id: process.env.private_key,
  private_key: process.env.private_key,
  client_email: process.env.client_email
};

const getIntentForUserText = async (sessionId, query) => {
  try {
    console.log(`Get Intent.\nUser ID ${sessionId}.\nQuery:${query}`);
    const languageCode = "en-US";
    let dialogflowCreds = {
      credentials: {
        private_key: DIALOGFLOW_CREDENTIALS.private_key,
        client_email: DIALOGFLOW_CREDENTIALS.client_email
      }
    };
    const sessionClient = new dialogflow.SessionsClient(dialogflowCreds);
    const sessionPath = sessionClient.sessionPath(
      DIALOGFLOW_CREDENTIALS.project_id,
      sessionId
    );
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          // The language used by the client (en-US)
          languageCode
        }
      }
    };

    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent");
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
    return result;
  } catch (e) {
    throw e;
  }
};

const createNewIntent = async intentInfo => {
  try {
    console.log(`Creating a new intent...`);
    let dialogflowCreds = {
      credentials: {
        private_key: DIALOGFLOW_CREDENTIALS.private_key,
        client_email: DIALOGFLOW_CREDENTIALS.client_email
      }
    };
    const intentsClient = new dialogflow.IntentsClient(dialogflowCreds);
    const agentPath = intentsClient.projectAgentPath(
      DIALOGFLOW_CREDENTIALS.project_id
    );

    const intentResult = {
      action: intentInfo.displayName,
      parameters: [],
      messages: [
        {
          text: {
            text: [intentInfo.textResponse]
          }
        }
      ],
      outputContexts: [],
      resetContexts: false
    };

    const phrases = [];
    for (let i = 0; i < intentInfo.utterances.length; i++) {
      phrases.push({
        type: "EXAMPLE",
        parts: [{ text: intentInfo.utterances[i] }]
      });
    }

    const intent = {
      displayName: intentInfo.displayName,
      webhookState: "WEBHOOK_STATE_DISABLED",
      trainingPhrases: phrases,
      mlEnabled: false,
      priority: 500000,
      messages: intentResult.messages
    };
    const request = {
      parent: agentPath,
      intent: intent
    };
    const result = await intentsClient.createIntent(request);
    return result;
  } catch (e) {
    throw e;
  }
};

const listIntents = async () => {
  try {
    console.log(`Listing intents...`);
    let dialogflowCreds = {
      credentials: {
        private_key: DIALOGFLOW_CREDENTIALS.private_key,
        client_email: DIALOGFLOW_CREDENTIALS.client_email
      }
    };
    const intentsClient = new dialogflow.IntentsClient(dialogflowCreds);
    const projectAgentPath = intentsClient.projectAgentPath(
      DIALOGFLOW_CREDENTIALS.project_id
    );
    const request = {
      parent: projectAgentPath
    };
    const result = await intentsClient.listIntents(request);
    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  getIntentForUserText,
  createNewIntent,
  listIntents
};
