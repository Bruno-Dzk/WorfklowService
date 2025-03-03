# Stage 1: Build
FROM node:23-alpine3.20 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:23-alpine3.20
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production

RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*d

COPY --from=builder /usr/src/app/dist ./dist

USER node

HEALTHCHECK --interval=1s --timeout=2s \
  CMD curl -f http://localhost:3000/healthcheck || exit 1

CMD ["npm", "start"]