FROM node:22-slim AS build

ARG NPM_TOKEN

WORKDIR /app

COPY package*.json ./

RUN echo "registry=https://cfa.jfrog.io/artifactory/api/npm/npm/" > .npmrc && \
    echo "//cfa.jfrog.io/artifactory/api/npm/npm/:_authToken=${NPM_TOKEN}" >> .npmrc

RUN npm ci

COPY . .

RUN npm run build && rm -f .npmrc

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
