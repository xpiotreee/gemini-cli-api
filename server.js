const express = require('express');
const { execFile } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/generate', (req, res) => {
    const { prompt, model, session_id } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Field 'prompt' is required." });
    }

    const args = ['--output-format', 'json'];
    if (model) args.push('-m', model);
    if (session_id) args.push('--resume', session_id);
    args.push(prompt);

    execFile('gemini', args, { encoding: 'utf8' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ 
                error: "CLI execution failed", 
                details: stderr || error.message 
            });
        }

        let result;
        try {
            result = JSON.parse(stdout);
        } catch (e) {
            console.warn("Failed to parse JSON output:", e.message);
            result = stdout.trim();
        }

        res.json({ 
            result: result, 
        });
    });
});

app.listen(port, () => {
    console.log(`Gemini API wrapper listening on port ${port}`);
});