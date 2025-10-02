const contact_examples = {
    Contact: {
        contact: {
            name: 'TestContact',
            phone: {
                country_code: 1,
                extension: 1,
                area_code: 555,
                phone_number: '1234567' 
            },
            email: {
                email: 'test@gmail.com'
            },
            address: {
                address: '12 St N',
                address_2: 'Ste. 203',
                location: {
                    city: 'Atlanta',
                    state: 'Georgia',
                    zip: '30033' 
                }
            },
            roles: [
                { name: 'SHIPPER' }
            ]
        }
    },
    ContactUpdate: {
        contact: {
            name: 'TestContactOne',
            phone: {
                country_code: 1,
                extension: 1,
                area_code: 444,
                phone_number: '7654321'
            },
            email: {
                email: 'test123@gmail.com'
            },
            address: {
                address: '123 St W',
                address_2: 'Ste. 204',
                location: {
                    city: 'Atlanta',
                    state: 'Georgia',
                    zip: '30035'
                }
            },
            roles: [
                { name: 'CONSIGNEE' }
            ]
        }
    },
}

module.exports = contact_examples