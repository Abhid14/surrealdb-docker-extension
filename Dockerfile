# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM node:18-alpine AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine:3.18
LABEL org.opencontainers.image.title="SurrealDB" \
    org.opencontainers.image.description="Manage SurrealDB databases directly from Docker Desktop" \
    org.opencontainers.image.vendor="SurrealDB Extension Team" \
    com.docker.desktop.extension.api.version="0.3.4" \
    com.docker.desktop.extension.icon="https://raw.githubusercontent.com/surrealdb/surrealdb/main/img/icon.png" \
    com.docker.extension.screenshots='[{"alt":"SurrealDB Dashboard", "url":"https://raw.githubusercontent.com/surrealdb/surrealdb/main/img/screenshot.png"}]' \
    com.docker.extension.detailed-description="<p>SurrealDB Extension for Docker Desktop allows you to easily create, manage, and query SurrealDB databases. Features include:</p><ul><li>Create and manage SurrealDB instances</li><li>Interactive query editor with syntax highlighting</li><li>Visual database explorer</li><li>Import/Export data</li><li>Real-time query execution</li></ul>" \
    com.docker.extension.publisher-url="https://surrealdb.com" \
    com.docker.extension.additional-urls='[{"title":"Documentation","url":"https://surrealdb.com/docs"},{"title":"GitHub","url":"https://github.com/surrealdb/surrealdb"}]' \
    com.docker.extension.categories="database,developer-tools" \
    com.docker.extension.changelog="<ul><li>Initial release with database management</li><li>Query editor with syntax highlighting</li><li>Database explorer</li></ul>"

COPY metadata.json .
COPY surrealdb.svg .
COPY --from=client-builder /ui/build ui
