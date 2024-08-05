require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Atlas Connection
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
});

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Route to add contact
app.post('/add-contact', async (req, res) => {
    const { name, phoneNumber } = req.body;

    if (!name || !phoneNumber) {
        return res.status(400).send('Name and phone number are required');
    }

    try {
        const newContact = new Contact({ name, phoneNumber });
        await newContact.save();
        res.status(201).send('Contact added successfully');
    } catch (error) {
        res.status(500).send('Error adding contact: ' + error.message);
    }
});

// Route to fetch contacts
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).send('Error fetching contacts: ' + error.message);
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
