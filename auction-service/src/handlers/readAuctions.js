import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function readAuctions(event, context) {
    const { limit, lastEvaluatedKey } = event.queryStringParameters || {};

    const params = {
        TableName: 'AuctionsTable',
        Limit: limit ? parseInt(limit) : 10,
        ExclusiveStartKey: {
            id: lastEvaluatedKey ? lastEvaluatedKey : null
        }
    };

    const result = await dynamodb.scan(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            auctions: result.Items,
            lastEvaluatedKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null,
        }),
    };
};

export const handler = readAuctions;