FROM node:12 as BUILD
COPY . /src
WORKDIR /src
RUN npm install
RUN npm run build

FROM nginx:alpine
RUN mkdir /app
WORKDIR /app
COPY --from=BUILD /src/dist /app/htdocs
COPY --from=BUILD /src/bin/entrypoint.sh /
COPY --from=BUILD /src/nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
