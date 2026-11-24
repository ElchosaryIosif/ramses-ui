# ── Stage 1: Build ────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────
FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# Fail the build on an invalid config rather than crash-looping at start-up.
# __PORT__ and __API_UPSTREAM__ are only filled in by the entrypoint, so test against defaults.
RUN sed -e 's/__PORT__/80/' -e 's#__API_UPSTREAM__#http://127.0.0.1:9#g' /etc/nginx/conf.d/default.conf > /tmp/check.conf \
    && cp /etc/nginx/conf.d/default.conf /tmp/template.conf \
    && cp /tmp/check.conf /etc/nginx/conf.d/default.conf \
    && nginx -t \
    && cp /tmp/template.conf /etc/nginx/conf.d/default.conf \
    && rm /tmp/check.conf /tmp/template.conf

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
