# builder stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

COPY ./src ./src
COPY ./public ./public
COPY ./server.ts ./server.ts
COPY ./next.config.ts ./next.config.ts
COPY ./postcss.config.mjs ./postcss.config.mjs
COPY ./tsconfig.json ./tsconfig.server.json ./

RUN npm run build

# production stage
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./

# RUN npm install --frozen-lockfile --only=production
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/tsconfig.json ./tsconfig.json

ENV NODE_ENV=production
ENV PORT=$PORT

EXPOSE $PORT

CMD ["npm", "run", "start"]