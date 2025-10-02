module.exports = {
    type: 'object',
    properties: {
        // total_weight: { type: 'number' },
        carrier_quote_number: { type: 'string' },
        shipment: {
            type: 'object',
            properties: {
                date: { type: 'string', format: 'date' },
                pickup: {
                    type: 'object',
                    properties: {
                        zip: { type: 'string' }
                    },
                    required: ['zip']
                },
                dropoff: {
                    type: 'object',
                    properties: {
                        zip: { type: 'string' }
                    },
                    required: ['zip']
                }
                // company: {
                //     type: 'object',
                //     properties: {
                //         id: { type: 'string' }
                //     },
                //     required: ['id']
                // }
            }
        },
        items: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    type: { type: 'string' },
                    number: { type: 'number' },
                    length: { type: 'number' },
                    width: { type: 'number' },
                    height: { type: 'number' },
                    weight: { type: 'number' },
                },
                required: ['type', 'number', 'length', 'width', 'height', 'weight']
            }
        }
    },
    required: ['total_weight', 'shipment', 'items']
}