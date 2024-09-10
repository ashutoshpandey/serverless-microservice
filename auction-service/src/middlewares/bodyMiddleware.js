import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';

const bodyMiddleware = (handler) => {
    return middy(handler)
        .use(httpJsonBodyParser())
        .use(httpEventNormalizer())
        .use(httpErrorHandler());
};

export default bodyMiddleware;    