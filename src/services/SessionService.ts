import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface SessionMetadata {
  id: string;
  startTime: string;
  lastUpdated: string;
}

export class SessionService {
  private basePath: string;

  constructor() {
    this.basePath = process.env.GEMINI_TMP_DIR || '/home/node/.gemini/tmp';
  }

  async listSessions(): Promise<SessionMetadata[]> {
    const pattern = path.join(this.basePath, '**/chats/*.json').replace(/\/g, '/');
    const files = await glob(pattern);
    
    const sessions = await Promise.all(
      files.map(async (file) => {
        const stats = await fs.promises.stat(file);
        const id = path.basename(file, '.json');
        
        return {
          id,
          startTime: stats.birthtime.toISOString(),
          lastUpdated: stats.mtime.toISOString(),
        };
      })
    );

    // Sort by lastUpdated descending
    return sessions.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  }

  async getSession(id: string): Promise<any> {
    // We search recursively just in case, but usually it should be in one of the subdirs
    const pattern = path.join(this.basePath, '**/chats/', `${id}.json`).replace(/\/g, '/');
    const files = await glob(pattern);

    if (files.length === 0) {
      return null;
    }

    const content = await fs.promises.readFile(files[0], 'utf8');
    try {
        return JSON.parse(content);
    } catch (e) {
        console.error(`Failed to parse session file ${files[0]}:`, e);
        throw new Error('CORRUPT_SESSION_FILE');
    }
  }
}

export const sessionService = new SessionService();
