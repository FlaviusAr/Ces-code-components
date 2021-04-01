FROM node:14

WORKDIR /code-component-definer

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js", "code-component-definer", "--of", "results.json", "--ftg", "filesToGroup.txt" ]