import AWS from 'aws-sdk';
import middy from '@middy/core';
import createError from 'http-errors';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function readAuction(event, context) {
    const { id } = event.pathParameters;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
    };

    let result = null;
    try {
        result = await dynamodb.get(params).promise();
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!result || !result.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Auction not found' }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
    };
};

export const handler = middy(readAuction)
    .use(httpEventNormalizer())
    .use(httpErrorHandler());