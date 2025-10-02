const quote_examples = {
    Quote: {
        // total_weight: 4,
        shipment: {
            date: '2025-03-25',
            pickup: {
                zip: '58102'
            },
            dropoff: {
                zip: '58104'
            }
        },
        items: [
            {
                type: 'pallet',
                number: 2,
                length: 20,
                width: 20,
                height: 2,
                weight: 2
            }
        ]
    },
    Requote: {
        // total_weight: 10,
        carrier_quote_number: "QWRT4P3752",
        shipment: {
            date: '2025-03-26',
            pickup: {
                zip: '58102'
            },
            dropoff: {
                zip: '58104'
            },
            company: {
                id: '123e4567-e89b-12d3-a456-426614174000'
            }
        },
        items: [
            {
                type: 'pallet',
                number: 2,
                length: 20,
                width: 20,
                height: 2,
                weight: 5
            }
        ]
    }
}

module.exports = quote_examples