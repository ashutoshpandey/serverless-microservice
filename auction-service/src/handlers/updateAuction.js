import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateAuction(event, context) {
    const { id } = event.pathParameters;
    const { title, status } = event.body;

    const params = {
        TableName: 'AuctionsTable',
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

    const result = await dynamodb.update(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(result.Attributes),
    };
};

export const handler = updateAuction;