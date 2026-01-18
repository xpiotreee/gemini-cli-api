const express = require('express');
const { execFile } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/generate', (req, res) => {
    const prompt = req.body.prompt;

    if (!prompt) {
        return res.status(400).json({ error: "Field 'prompt' is required." });
    }

    execFile('gemini', [prompt], { encoding: 'utf8' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ 
                error: "CLI execution failed", 
                details: stderr || error.message 
            });
        }

        res.json({ 
            result: stdout.trim(),
            raw_output: stdout 
        });
    });
});

app.listen(port, () => {
    console.log(`Gemini API wrapper listening on port ${port}`);
});