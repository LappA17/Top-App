FROM node:14-alpine
WORKDIR /opt/app
ADD package.json
RUN npm install
ADD . .
ENV NODE_ENV production
RUN npm build
RUN npn prune --production
CMD ["npm", "start"]
EXPOSE 3000