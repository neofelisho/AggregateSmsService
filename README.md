# AggregateSmsService

Aggregate multiple SMS (Short Message Service) using [node.js](http://nodejs.org).

## Prerequisite

- [Azure subscription](https://azure.microsoft.com/en-us/free/)
- [Azure Storage Account](https://docs.microsoft.com/azure/storage/common/storage-account-options), because this service will use [Queue Storage](https://azure.microsoft.com/services/storage/queues/), please select **General-purpose v1** or **General-purpose v2**.

## Installation

There are three [Azure](https://azure.microsoft.com/) [Functions](https://azure.microsoft.com/services/functions/). Deploy functions according to this [document](https://github.com/Microsoft/vscode-azurefunctions#javascript), or deploy manually.

## Manual Deployment

1. Create an [Azure Function App](https://docs.microsoft.com/azure/azure-functions/), or use the existing one.
2. Add new functions, we need to establish two [HTTP triger](https://docs.microsoft.com/azure/azure-functions/functions-bindings-http-webhook) functions and one [Queue trigger](https://docs.microsoft.com/azure/azure-functions/functions-create-storage-queue-triggered-function) function, and select the language as `JavaScript`.
3. Copy the code and paste to the `index.js`, if the code reference to `lib` folder, add correspond `.js` file in the function and alter the path because they are in the same folder of Azure Function.
    ```js
    // for example, alter these:
    const validateContact = require('../lib/contact_validator')
    const utility = require('../lib/utility')

    // to:
    const validateContact = require('./contact_validator')
    const utility = require('./utility')
    ```
4. There are four SMS settings which had passed the testing. If we want to use them, add SMS settings according the the `default.js` in the config folder. Remember to alter the path in the code of `sms_submail.js` and others. 
5. Set the [integration of function](https://azure.microsoft.com/en-us/resources/videos/azure-functions-integration/). We can add the settings step by step via the UI of Azure function. Or use the [Advanced editor](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings) and paste the settings of `function.json`.
6. [Install NPM packages](https://docs.microsoft.com/zh-tw/azure/azure-functions/functions-reference-node#node-version-and-package-management). This reference document provides many basic notices.
7. Add `AZURE_STORAGE_CONNECTION_STRING` setting in the `Application settings. Because the npm package 'azure-storage' will use this setting.
8. Add log table by the table name in `utility.js`.

After completing above eight steps, we could test this service by:

1. Sending a short message via API: SendSms.
2. Watch the log of 'QueueTriggerSmsService' in Azure Portal.
3. Use [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/) to inspect the result.

## Features
 Our service provies these functions:

- API for sending short message.
- API for querying sending logs.
- Log mechanism.
- Auto switch different SMS by logs and preset scenario.

### SendSms API

```bash
curl -X POST \
  'https://[functions-domain].azurewebsites.net/api/SendSms?code=[function-key]' \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -d '{
	contact: '\''[contact-number]'\'',
	message: '\''[short-message]'\'',
	platform: '\''[log-the-platform]'\'',
	username: '\''[log-the-username]'\''
}'
```

### QuerySmsLog API

```bash
curl -X GET \
  'https://[function-domain].azurewebsites.net/api/QuerySmsLog/[contact-number]?code=[function-key]&take=1' \
  -H 'Cache-Control: no-cache'
```
