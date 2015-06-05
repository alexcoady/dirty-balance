var mongoose = require("mongoose");

var EntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  vendor: String,
  description: String,
  amount: Number,
  tags: [String],
  timeline: {
    added: {
      date: {
        type: Date,
        default: Date.now
      }
    },
    updated: Date,
    removed: Date
  }
});


var EntryModel = mongoose.model( "Entry", EntrySchema );

module.exports = {
  Model: EntryModel,
  Schema: EntrySchema
};
