const schemas = require('./schemas/schemas.js')
const { Quote, Requote } = require('./schemas/quote/quote.examples.js')
const { Load, LoadUpdate } = require('./schemas/load/load.examples.js')
const { Contact, ContactUpdate } = require('./schemas/contact/contact.examples.js')

module.exports = {
    // All the schemas automatically get put into the model section of the UI.
    schemas: schemas,
    examples: {
        Contact: Contact,
        ContactUpdate: ContactUpdate,
        Load: Load,
        LoadUpdate: LoadUpdate,
        Quote: Quote,
        Requote: Requote,
    },
    parameters: {
        id: {
            name: 'id',
            in: 'path',
            schema: {
                type: 'string',
                format: 'uuid',
            },
            required: true,
        },
        num: {
            name: 'num',
            in: 'query',
            schema: {
                type: 'number',
                minimum: 1,
            },
            description: 'Number of objects to request.',
            default: 10
        },
        version: {
            name: 'version',
            in: 'path',
            schema: {
                type: 'string'
            },
            description: 'The version of the Api.',
            required: true,
            default: 'v1'
        },
        name: {
            name: 'name',
            in: 'query',
            schema: {
                type: 'string'
            },
            description: 'The name of the object.'
        },
        role: {
            name: 'role',
            in: 'query',
            schema: {
                type: 'string'
            },
            description: 'The role of the object.'
        },
        status: {
            name: 'status',
            in: 'query',
            schema: {
                type: 'string'
            },
            description: 'The status of the object.'
        }
    },
    responses: {
        // Example of using the response in the documentation
        // #swagger.responses[400] = { $ref: '#/components/responses/ErrorResponse' }
        ErrorResponse: {
            content: {
                'application/json': {
                    schema: { 
                        type: 'object',
                        properties: {
                            error: {
                                type: 'object',
                                properties: {
                                    code: { type: 'integer' },
                                    message: { type: 'string' },
                                    details: { type: 'string' }
                                }
                            }
                        },
                        example: {
                            code: 400,
                            message: 'Bad Request',
                            details: "Invalid parameter 'id'"
                        }
                    },
                }
            }
        },
    }
}