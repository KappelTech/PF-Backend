const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    exerciseName: { type: String },
    searchCount: { type: Number, default: 1 },
    lastSearchedAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model('SearchHistory', searchHistorySchema);
  