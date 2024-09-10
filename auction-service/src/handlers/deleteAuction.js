import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteAuction(event, context) {
  const { id } = event.pathParameters;

  const params = {
    TableName: 'AuctionsTable',
    Key: { id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeValues: {
      ':status': 'REMOVED',
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ReturnValues: 'ALL_NEW',
  };

  const result = await dynamodb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
};

export const handler = deleteAuction;