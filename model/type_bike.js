const mongoose = require("mongoose")

const typeSchema = new mongoose.Schema({
    name: String,
    date_import: Date,
    isdelete: Boolean,
})

module.exports = mongoose.model("type", typeSchema)