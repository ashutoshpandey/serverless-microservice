import AWS from 'aws-sdk';
import createError from 'http-errors';
import bodyMiddleware from '../middlewares/bodyMiddleware.js';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateAuction(event, context) {
    const { id } = event.pathParameters;
    const { title, status } = event.body;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set title = :title, #status = :status',
        ExpressionAttributeValues: {
            ':title': title,
            ':status': status,
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

export const handler = bodyMiddleware(updateAuction);