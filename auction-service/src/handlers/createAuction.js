import AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import bodyMiddleware from '../middlewares/bodyMiddleware.js';
import createAuctionsSchema from '../schemas/createAuctionSchema.js';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;
  const now = new Date();
  const endDate = new Date();

  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    highestBid: {
      amount: 0
    },
    title,
    status: 'OPEN',
    createdAt: now.toISOString()
  };

  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction
    }).promise();
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

export const handler = bodyMiddleware(createAuction)
  .use(validator({ inputSchema: createAuctionsSchema }));