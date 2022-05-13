const mongoose = require('mongoose')
const Project = require('./project')

const testSchema = new mongoose.Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    password: { type: String, select: false },
    username: { type: String, required: true },
    Project : [{ type: Schema.Types.ObjectId, ref: "Project" }]
})

module.exports = mongoose.model('Test', testSchema)