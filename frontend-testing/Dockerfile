FROM cypress/included:10.3.1-typescript

RUN mkdir /cypress-app

WORKDIR /cypress-app
COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./cypress.config.ts ./

RUN npm install

COPY . .



ENTRYPOINT [ "npx","cypress","run","--spec","cypress/e2e/myTodo/main.cy.ts" ]

CMD [ "" ]
