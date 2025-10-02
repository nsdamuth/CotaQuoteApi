module.exports = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        quote_id: { type: 'string', format: 'uuid' },
        status: { type: 'string' },
        pickup: {
            type: 'object',
            properties: {
                contact_id: { type: 'string', format: 'uuid' },
                number: { type: 'string', example: '54321' },
                date: { type: 'string', format: 'date' },
                time: { type: 'string', format: 'time' },
                appointment_required: { type: 'boolean' }
            },
            required: ['contact_id']
        },
        dropoff: {
            type: 'object',
            properties: {
                contact_id: { type: 'string', format: 'uuid' },
                number: { type: 'string' },
                date: { type: 'string', format: 'date' },
                time: { type: 'string', format: 'time' },
                appointment_required: { type: 'boolean' }
            },
            required: ['contact_id']
        },
        commodities: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    weight: { type: 'number' },
                    type: { type: 'string' },
                    quantity: { type: 'number' },
                    piece_count: { type: 'number' },
                    length: { type: 'number' },
                    width: { type: 'number' },
                    height: { type: 'number' },
                    class: { type: 'string' }
                },
                required: ['name', 'weight']
            }
        },
        rate: { type: 'number' },
        rate_items: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    rate: { type: 'number' },
                    rate_type: { type: 'string' },
                }
            }
        },
        information: {
            type: 'object',
            properties: {
                po_number: { type: 'string' },
                bol_bumber: { type: 'string' },
                hbol_number: { type: 'string' },
                container_number: { type: 'string' },
                vessel_name: { type: 'string' },
            }
        }
    }
}