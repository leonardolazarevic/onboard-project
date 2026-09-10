FROM node:22

ARG NPM_TOKEN

WORKDIR /app

COPY package*.json ./

RUN echo "registry=https://cfa.jfrog.io/artifactory/api/npm/npm/" > .npmrc && \
    echo "//cfa.jfrog.io/artifactory/api/npm/npm/:_authToken=${NPM_TOKEN}" >> .npmrc

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]