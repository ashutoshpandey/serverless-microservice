import AWS from 'aws-sdk';
import createError from 'http-errors';
import pathMiddleware from '../middlewares/pathMiddleware.js';

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

async function readAuction(event, context) {
    const { id } = event.pathParameters;

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

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
};

export const handler = pathMiddleware(readAuction);