import AWS from 'aws-sdk';
import pathMiddleware from '../middlewares/pathMiddleware.js';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteAuction(event, context) {
  const { id } = event.pathParameters;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
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

  let result = null;
  try {
    result = await dynamodb.update(params).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
  };
};

export const handler = pathMiddleware(deleteAuction);