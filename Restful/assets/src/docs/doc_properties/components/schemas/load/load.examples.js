const load_examples = {
    Load: {
        pickup: {
            contact_id: '123e4567-e89b-12d3-a456-426614174000',
            number: '54321',
            date: '2025-03-09',
            time: '15:45',
            appointment_required: false
        },
        dropoff: {
            contact_id: '123e4567-e89b-12d3-a456-426614174001',
            number: '12345',
            date: '2025-03-25',
            time: '16:00',
            appointment_required: false
        },
        commodities: [
            {
                name: 'Potatoes',
                weight: 45.8,
                type: 'pallet',
                quantity: 3,
                piece_count: 2,
                length: 20,
                width: 20,
                height: 4,
                class: '50'
            }
        ],
        information: {
            po_number: '1234',
            bol_number: '4321'
        }
    },
    LoadUpdate: {
        status: "AT_SHIPPER",
        pickup: {
            contact_id: '123e4567-e89b-12d3-a456-426614174000',
            number: '54321',
            date: '2025-03-09',
            time: '15:45',
            appointment_required: false
        },
        dropoff: {
            contact_id: '123e4567-e89b-12d3-a456-426614174001',
            number: '12345',
            date: '2025-03-25',
            time: '16:00',
            appointment_required: false
        },
        commodities: [
            {
                id: '123e4567-e89b-12d3-a456-426614174001',
                name: 'Chairs',
                weight: 45.8,
                type: 'pallet',
                quantity: 3,
                piece_count: 2,
                length: 20,
                width: 20,
                height: 30,
                class: '50'
            }
        ],
        rate_items: [
            { 
                id: '123e4567-e89b-12d3-a456-426614174001',
                rate_type: "flat_rate", 
                rate: 700 
            }
        ],
        information: {
            po_number: '1234-3',
            bol_number: '4321-43'
        }
    },
}

module.exports = load_examples