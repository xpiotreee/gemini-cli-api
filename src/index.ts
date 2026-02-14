import express, { Request, Response, NextFunction } from 'express';
import { execFile } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';
import { sessionService } from './services/SessionService';
import { openAIService } from './services/OpenAIService';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

interface GenerateRequestBody {
    prompt: string;
    model?: string;
    session_id?: string;
}

app.post('/generate', (req: Request<{}, {}, GenerateRequestBody>, res: Response, next: NextFunction) => {
    const { prompt, model, session_id } = req.body;

    if (!prompt) {
        return res.status(400).json({ 
            error: "VALIDATION_ERROR", 
            message: "Field 'prompt' is required." 
        });
    }

    const args = ['--output-format', 'json'];
    if (model) args.push('-m', model);
    if (session_id) args.push('--resume', session_id);
    args.push(prompt);

    execFile('gemini', args, { encoding: 'utf8', cwd: '/tmp/gemini' }, (error, stdout, stderr) => {
        if (error) {
            return next(error);
        }

        let result;
        try {
            result = JSON.parse(stdout);
        } catch (e: any) {
            console.warn("Failed to parse JSON output:", e.message);
            result = stdout.trim();
        }

        res.json({ 
            result: result, 
        });
    });
});

app.get('/sessions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessions = await sessionService.listSessions();
        res.json({ sessions });
    } catch (error) {
        next(error);
    }
});

app.get('/sessions/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session = await sessionService.getSession(req.params.id);
        if (!session) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'Session not found'
            });
        }
        res.json(session);
    } catch (error) {
        next(error);
    }
});

app.post('/v1/chat/completions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const stream = openAIService.chatCompletionStream(req.body);
            for await (const chunk of stream) {
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            }
            res.write('data: [DONE]\n\n');
            res.end();
        } else {
            const result = await openAIService.chatCompletion(req.body);
            res.json(result);
        }
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Gemini API wrapper listening on port ${port}`);
});
