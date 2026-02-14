import { execFile, spawn } from 'child_process';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export class OpenAIService {
  /**
   * Transforms OpenAI messages into a single prompt for the Gemini CLI.
   * Handles role mapping and alternation.
   */
  preparePrompt(messages: OpenAIMessage[]): string {
    let systemInstruction = '';
    const chatMessages: { role: string; content: string }[] = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction += msg.content + '\n';
      } else {
        const role = msg.role === 'assistant' ? 'model' : 'user';
        
        // Merge consecutive messages with the same role
        const lastMsg = chatMessages[chatMessages.length - 1];
        if (lastMsg && lastMsg.role === role) {
          lastMsg.content += '\n' + msg.content;
        } else {
          chatMessages.push({ role, content: msg.content });
        }
      }
    }

    // Ensure role alternation: user, model, user...
    if (chatMessages.length > 0 && chatMessages[0].role === 'model') {
      chatMessages.unshift({ role: 'user', content: '...' });
    }

    // Construct the final prompt
    let finalPrompt = '';
    if (systemInstruction) {
      finalPrompt += `System Instruction:\n${systemInstruction.trim()}\n\n`;
    }

    for (const msg of chatMessages) {
      finalPrompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    }

    return finalPrompt.trim();
  }

  /**
   * Maps OpenAI parameters to Gemini CLI arguments.
   */
  prepareArgs(request: OpenAIRequest): string[] {
    const args = ['--output-format', request.stream ? 'stream-json' : 'json'];
    
    if (request.model) {
      args.push('-m', request.model);
    }
    
    return args;
  }

  /**
   * Executes the Gemini CLI and returns the response in OpenAI format.
   */
  async chatCompletion(request: OpenAIRequest): Promise<any> {
    const prompt = this.preparePrompt(request.messages);
    const args = this.prepareArgs(request);
    args.push('-p', prompt);

    return new Promise((resolve, reject) => {
      execFile('gemini', args, { encoding: 'utf8', cwd: '/tmp/gemini' }, (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }

        let content = '';
        let usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

        try {
          const jsonMatch = stdout.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            content = result.response || result.result || result.content || '';
            
            if (result.stats && result.stats.models) {
              const modelKey = Object.keys(result.stats.models)[0];
              if (modelKey) {
                const tokens = result.stats.models[modelKey].tokens;
                usage = {
                  prompt_tokens: tokens.prompt || tokens.input || 0,
                  completion_tokens: tokens.candidates || 0,
                  total_tokens: tokens.total || 0
                };
              }
            }
          } else {
            content = stdout.trim();
          }
        } catch (e) {
          console.warn("Failed to parse JSON output:", e);
          content = stdout.trim();
        }

        resolve({
          id: `chatcmpl-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model: request.model,
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: content
              },
              finish_reason: 'stop'
            }
          ],
          usage
        });
      });
    });
  }

  /**
   * Executes the Gemini CLI in stream-json mode and provides a generator for OpenAI chunks.
   */
  async *chatCompletionStream(request: OpenAIRequest): AsyncGenerator<any> {
    const prompt = this.preparePrompt(request.messages);
    const args = this.prepareArgs(request);
    args.push('-p', prompt);

    const child = spawn('gemini', args, { cwd: '/tmp/gemini' });
    const completionId = `chatcmpl-${Date.now()}`;
    const created = Math.floor(Date.now() / 1000);

    let buffer = '';
    let lastUsage: any = null;

    for await (const chunk of child.stdout) {
      buffer += chunk.toString();
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim() || !line.includes('{')) continue;

        try {
          const jsonMatch = line.match(/\{.*\}/);
          if (!jsonMatch) continue;

          const json = JSON.parse(jsonMatch[0]);
          
          if (json.type === 'message' && json.role === 'assistant' && json.content) {
            yield {
              id: completionId,
              object: 'chat.completion.chunk',
              created: created,
              model: request.model,
              choices: [
                {
                  index: 0,
                  delta: {
                    content: json.content
                  },
                  finish_reason: null
                }
              ]
            };
          } else if (json.type === 'result' && json.stats) {
            lastUsage = {
              prompt_tokens: json.stats.input_tokens || json.stats.input || 0,
              completion_tokens: json.stats.output_tokens || 0,
              total_tokens: json.stats.total_tokens || 0
            };
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }

    // Final chunk
    yield {
      id: completionId,
      object: 'chat.completion.chunk',
      created: created,
      model: request.model,
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: 'stop'
        }
      ],
      usage: lastUsage
    };
  }
}

export const openAIService = new OpenAIService();
