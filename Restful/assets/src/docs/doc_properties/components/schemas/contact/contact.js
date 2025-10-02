module.exports = {
    type: 'object',
    properties: {
        contact: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string', example: 'TestContact' },
                phone: { '$ref': '#/components/schemas/Phone' },
                email: { '$ref': '#/components/schemas/Email' },
                address: { '$ref': '#/components/schemas/Address' },
                roles: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' }
                        }
                    }
                }
            },
            required: ['name', 'roles', 'address', 'email']
        }
    },
    required: ['contact']
}