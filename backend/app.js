const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const postsRoute = require('./routes/posts');


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/posts', postsRoute);


mongoose.connect(process.env.MONGO_URI)
.then(() => app.listen(PORT, () => console.log(`Backend running on ${PORT}`)))
.catch(err => console.error('DB error:', err));