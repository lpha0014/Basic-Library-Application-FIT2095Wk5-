//book schema
const mongoose = require('mongoose');
let moment = require('moment');

let bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
    },
    isbn: {
        type: String,
    },
    date: {
        type: Date,
        get: function(newDate) {
            return moment(newDate).format('DD-MM-YYYY');
        },
        default: Date.now
    },
    summary: {
        type: String
    }
});
module.exports = mongoose.model('Book', bookSchema);