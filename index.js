const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let sessions = {};

app.post('/control', (req, res) => {
    const { action, value, sessionId } = req.body;

    if (!sessions[sessionId]) {
        return res.status(400).json({ error: 'Invalid session ID' });
    }

    if (action === 'play' || action === 'pause' || action === 'stop' || action === 'volume') {
        sessions[sessionId].status = action;
        if (action === 'volume') {
            sessions[sessionId].volume = value;
        }
    }

    res.json({ status: 'Button click received', action });
});

app.post('/update-url', (req, res) => {
    const { url, sessionId } = req.body;

    if (!sessions[sessionId]) {
        sessions[sessionId] = { url: '', status: 'stop', volume: 100 };
    }

    sessions[sessionId].url = url;
    res.json({ status: 'URL updated', sessionId });
});

app.get('/current-url/:sessionId', (req, res) => {
    const { sessionId } = req.params;

    if (!sessions[sessionId]) {
        return res.status(400).json({ error: 'Invalid session ID' });
    }

    res.json({
        success: true,
        sessionId,
        url: sessions[sessionId].url,
        status: sessions[sessionId].status,
        volume: sessions[sessionId].volume
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
