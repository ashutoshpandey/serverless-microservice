import AWS from 'aws-sdk';
import createError from 'http-errors';
import pathMiddleware from '../middlewares/pathMiddleware.js';
import readAuctionsSchema from '../schemas/readAuctionsSchema.js';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function readAuctions(event, context) {
    const { limit, status, lastEvaluatedKey } = event.queryStringParameters || {};

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
            ':status': status
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        Limit: limit ? parseInt(limit) : 10,
        ExclusiveStartKey: {
            id: lastEvaluatedKey ? lastEvaluatedKey : null
        }
    };

    let result = null;
    try {
        result = await dynamodb.scan(params).promise();
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            auctions: result.Items,
            lastEvaluatedKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null,
        }),
    };
};

export const handler = pathMiddleware(readAuctions)
    .use(validator({ inputSchema: readAuctionsSchema, useDefaults: true }));