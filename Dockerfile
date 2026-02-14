FROM naoyoshinori/gemini-cli:0-typescript-node

ENV NODE_ENV=production
WORKDIR /app

# The base image might have specific permissions, let's stick to what's likely expected
USER root
RUN chown node:node /app
RUN mkdir /tmp/gemini && chown node:node /tmp/gemini
USER node

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .

RUN npm run build && npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
