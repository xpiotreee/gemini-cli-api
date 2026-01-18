FROM naoyoshinori/gemini-cli:0-typescript-node

ENV NODE_ENV=production
WORKDIR /app

USER node
RUN npm init -y && \
    npm install express

COPY --chown=node:node server.js .

EXPOSE 3000

CMD ["node", "server.js"]