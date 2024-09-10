# Serverless Framework Node HTTP API on AWS

This template demonstrates how to make a simple HTTP API with Node.js running on AWS Lambda and API Gateway using the Serverless Framework.

This template does not include any kind of persistence (database). For more advanced examples, check out the [serverless/examples repository](https://github.com/serverless/examples/) which includes Typescript, Mongo, DynamoDB and other examples.

## Usage

### To run locally

```
serverless invoke local --function createAuction --path test-data/create-auction.json
example: {"body": "body": "{\"title\": \"First\"}"}

serverless invoke local --function readAuctions --path test-data/read-auctions.json
example: {"queryStringParameters": {"limit":"5"}}
example: {"queryStringParameters": {"limit":"5", "lastEvaluatedKey": "some-id"}}

serverless invoke local --function readAuction --path test-data/read-auction.json
example: {"pathParameters": {"id":"some-id"}}

serverless invoke local --function updateAuction --path test-data/update-auction.json
example: {"pathParameters": {"id":"some-id"},"body": {"title": "First"}}

serverless invoke local --function deleteAuction --path test-data/delete-auction.json
example: {"pathParameters": {"id":"some-id"}}
```

### Deployment

In order to deploy the example, you need to run the following command:

```
serverless deploy

or

serverless deploy --stage dev
```

After running deploy, you should see output similar to:

```
Deploying "serverless-http-api" to stage "dev" (us-east-1)

✔ Service deployed to stack serverless-http-api-dev (91s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  createAuction: auction-service-dev-createAuction (4.4 MB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [HTTP API (API Gateway V2) event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api).

### Invocation

After successful deployment, you can call the created application via HTTP:

```
POST https://xxxxxxx.execute-api.us-east-1.amazonaws.com/

{
  "title": "Some title"
}
```

Which should result in response similar to:

```json
{
  "status": "OPEN",
  "createdAt": "2024-09-10T03:13:37Z"
}
```

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.
