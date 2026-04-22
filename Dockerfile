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
# NUXT_PUBLIC_API_BASE:브라우저에서 요청하는 api
# NUXT_API_SERVER_URL: 서버에서 요청하는 api
ARG NUXT_PUBLIC_API_BASE  
# Nitro 서버가 Docker 내부에서 백엔드로 직접 통신할 때 사용하는 서버 전용 URL
# routeRules(프록시) 설정은 빌드 타임에 결정되므로 반드시 빌드 ARG로 주입해야 함
ARG NUXT_API_SERVER_URL 

# 환경변수 주입
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_API_SERVER_URL=$NUXT_API_SERVER_URL

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


