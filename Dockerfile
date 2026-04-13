# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the entire project
COPY . ./

# 환경변수 정의 
ARG NUXT_PUBLIC_API_BASE

# 환경변수 주입
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
# docker build --build-arg NUXT_PUBLIC_API_BASE=http://api.server.com . 로 도커 실행 스크립트에서 주입을 해줄 것.


# Build the project
RUN npm run build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

# Change the port and host
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]


