FROM node:lts-alpine3.17

COPY --chown=nobody:nobody ./* /app/

RUN cd /app && \
    npm install && \
    chown -R nobody:nobody /app && \
    install -o nobody \
            -g nobody \
            -d /.npm

EXPOSE 8000

USER nobody
WORKDIR /app

ENTRYPOINT []
CMD ["npm", "start"]
