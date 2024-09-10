import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';

const pathMiddleware = (handler) => {
    return middy(handler)
        .use(httpEventNormalizer())
        .use(httpErrorHandler());
};

export default pathMiddleware;
