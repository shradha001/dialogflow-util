"use strict";
const dialogflow = require("./dialogflow");

const getIntent = async text => {
  try {
    const sessionId = "123456789";
    const intents = await dialogflow.getIntentForUserText(sessionId, text);
    console.log("Get intent response ", intents);
  } catch (e) {
    console.log(`Error in fetching intent details ${e}`);
  }
};

const createIntent = async intent => {
  try {
    const result = await dialogflow.createNewIntent(intent);
    console.log("create intent response ", result);
  } catch (e) {
    console.log(`Error in creating a new intent ${e}`);
  }
};

const listIntents = async () => {
  try {
    const result = await dialogflow.listIntents();
    console.log("list intent response ", result);
  } catch (e) {
    console.log(`Error in listing the intent ${e}`);
  }
};

(async () => {
  await createIntent({
    displayName: "thanks",
    textResponse: "Glad to help!",
    utterances: ["thanks"]
  });
  await getIntent("hi");
  await listIntents();
})();
