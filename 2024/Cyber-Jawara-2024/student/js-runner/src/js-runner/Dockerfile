# Use an official Node.js Alpine image for a lightweight container
FROM node:16-alpine

RUN apk update
RUN apk add curl

WORKDIR /app

RUN yarn init -y && yarn add express vm2

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

COPY ./code .

EXPOSE 4932

USER nobody

CMD ["node", "index.js"]