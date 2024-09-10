import AWS from 'aws-sdk';
import createError from 'http-errors';
import bodyMiddleware from '../middlewares/bodyMiddleware.js';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctionById(id) {
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
        return null;
    }

    return result.Item;
}

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;

    let auction;
    try {
        auction = await getAuctionById(id);
    }
    catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (auction == null) {
        return {
            statusCode: 404,
            body: 'Auction not found'
        };
    }

    if (amount <= auction.highestBid.amount) {
        throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount
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

export const handler = bodyMiddleware(placeBid);