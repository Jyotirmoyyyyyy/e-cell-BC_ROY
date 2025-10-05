const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
title: String,
content: String,
tags: [String],
imageData: String,
slug: String,
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Post', PostSchema);