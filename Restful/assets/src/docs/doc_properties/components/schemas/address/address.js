module.exports = {
    type: 'object',
    properties: {
        address: { type: 'string' },
        address_2: { type: 'string' },
        location: {
            type: 'object',
            properties: {
                city: { type: 'string' },
                state: { type: 'string' },
                zip: { type: 'string' }
            },
            required: ['zip']
        }
    },
    required: ['address', 'location']
}