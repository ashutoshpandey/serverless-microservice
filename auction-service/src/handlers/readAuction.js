import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function readAuction(event, context) {
    const { id } = event.pathParameters;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
    };

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
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

export const handler = readAuction;