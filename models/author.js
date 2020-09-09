//author schema
const mongoose = require('mongoose');

let authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String
        }
    },
    dob: {
        type: String,
    },
    address: {
        state: {
            type: String,
            validate: {
                validator: function (char) {
                    return char.length>= 2 && char.length <= 3;
                },
                message: 'The state should be 2-3 characters in length'
            }
        },
        suburb: {
            type: String
        },
        street: {
            type: String
        },
        unit: {
            type: String
        },
    },
    numBooks: {
        type: Number,
        validate: {
            validator: function (num) {
                return num >= 1 && num <= 150;
            },
            message: 'Number of books should be a number between 1 and 150'
        }
    }
});
module.exports = mongoose.model('Author', authorSchema)