const mongoose = require("mongoose")

const citySchema = new mongoose.Schema({
    name: String,
    date_import: Date,
    isdelete: Boolean,
})

module.exports = mongoose.model("cities", citySchema)