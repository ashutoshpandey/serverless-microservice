const createAuctionsSchema = {
    properties: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string'
                }
            },
            required: ['title']
        }
    },
    required: [
        'body'
    ]
};

export default readAuctionsSchema;