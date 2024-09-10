import AWS from 'aws-sdk';
import { getEndedAuctions } from '../helpers/getEndedAuctions';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function processAuctions(event, context) {
    try {
        let auctionsToClose = await getEndedAuctions();
        const closePromises = auctionsToClose.map(auction => closeAuction(auction.id));

        await Promise.all(closePromises);

        return { closed: closePromises.length };
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
};

export const handler = processAuctions;