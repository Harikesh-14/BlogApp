const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new Schema({
    firstName: { type: String, required: true, min: 4 },
    lastName: { type: String, required: true, min: 4 },
    email: { type: String, required: true, min: 4, unique: true },
    number: { type: Number, required: true, min: 10, unique: true },
    password: { type: String, required: true, min: 4 },
})

const UserModel = model('User', UserSchema)

module.exports = UserModel