const express = require('express');
const multer = require('multer');
const slugify = require('slugify');
const Post = require('../models/Post');
const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get('/', async (req, res) => {
const posts = await Post.find().sort({ createdAt: -1 });
res.json(posts);
});


router.get('/:id', async (req, res) => {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ error: 'Not found' });
res.json(post);
});


router.post('/', upload.single('image'), async (req, res) => {
const { title, content, tags } = req.body;
let imageData = '';
if (req.file) {
const mime = req.file.mimetype;
imageData = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
}


const post = new Post({
title,
content,
tags: tags.split(',').map(t => t.trim()),
imageData,
slug: slugify(title, { lower: true }),
});


await post.save();
res.status(201).json(post);
});


router.put('/:id', upload.single('image'), async (req, res) => {
const { title, content, tags } = req.body;
const updateData = { title, content, tags: tags.split(',').map(t => t.trim()) };


if (req.file) {
const mime = req.file.mimetype;
updateData.imageData = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
}


const post = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
res.json(post);
});


router.delete('/:id', async (req, res) => {
await Post.findByIdAndDelete(req.params.id);
res.json({ success: true });
});


module.exports = router;