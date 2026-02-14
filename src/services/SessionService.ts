import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface SessionMetadata {
  id: string;
  startTime: string;
  lastUpdated: string;
  filename: string;
}

export class SessionService {
  private basePath: string;

  constructor() {
    this.basePath = process.env.GEMINI_TMP_DIR || '/home/node/.gemini/tmp';
  }

  async listSessions(): Promise<SessionMetadata[]> {
    const pattern = path.join(this.basePath, '**/chats/*.json').replace(/\\/g, '/');
    const files = await glob(pattern);
    
    const sessions = await Promise.all(
      files.map(async (file) => {
        try {
          const stats = await fs.promises.stat(file);
          const content = await fs.promises.readFile(file, 'utf8');
          const data = JSON.parse(content);
          
          return {
            id: data.sessionId || path.basename(file, '.json'),
            startTime: data.startTime || stats.birthtime.toISOString(),
            lastUpdated: data.lastUpdated || stats.mtime.toISOString(),
            filename: path.basename(file),
          };
        } catch (e) {
          console.error(`Failed to process session file ${file}:`, e);
          return null;
        }
      })
    );

    // Filter out nulls and sort by lastUpdated descending
    return sessions
      .filter((s): s is SessionMetadata => s !== null)
      .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  }

  async getSession(id: string): Promise<any> {
    const prefix = id.split('-')[0];
    const pattern = path.join(this.basePath, '**/chats/', `*${prefix}.json`).replace(/\\/g, '/');
    const files = await glob(pattern);

    for (const file of files) {
      try {
        const content = await fs.promises.readFile(file, 'utf8');
        const data = JSON.parse(content);
        if (data.sessionId === id) {
          return data;
        }
      } catch (e) {
        console.error(`Failed to parse session file ${file}:`, e);
      }
    }

    return null;
  }
}

export const sessionService = new SessionService();
