const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from the current directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tourism', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define the Destination schema
const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // URL to the image
    location: { type: String, required: true } // Optional: location details
});

// Create the Destination model
const Destination = mongoose.model('Destination', destinationSchema);

// Sample route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve index.html
});

// Route to get all destinations
app.get('/api/destinations', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (err) {
        res.status(500).send('Error retrieving destinations');
    }
});

// Route to add a new destination
app.post('/api/destinations', async (req, res) => {
    const { name, description, image, location } = req.body;

    const newDestination = new Destination({
        name,
        description,
        image,
        location
    });

    try {
        await newDestination.save();
        res.status(201).send('Destination added successfully');
    } catch (err) {
        res.status(400).send('Error adding destination: ' + err.message);
    }
});

// Route to update a destination by ID
app.put('/api/destinations/:id', async (req, res) => {
    try {
        const updatedDestination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDestination) {
            return res.status(404).send('Destination not found');
        }
        res.json(updatedDestination);
    } catch (err) {
        res.status(400).send('Error updating destination: ' + err.message);
    }
});

// Route to delete a destination by ID
app.delete('/api/destinations/:id', async (req, res) => {
    try {
        const deletedDestination = await Destination.findByIdAndDelete(req.params.id);
        if (!deletedDestination) {
            return res.status(404).send('Destination not found');
        }
        res.send('Destination deleted successfully');
    } catch (err) {
        res.status(400).send('Error deleting destination: ' + err.message);
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
