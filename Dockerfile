# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2-alpine AS base
WORKDIR /usr/src/app
RUN set -xe \
    # install sqlite3 as database
    && apk add --no-cache sqlite

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Use the Node image to build the frontend
FROM node:22 AS frontend-build
WORKDIR /src/frontend
COPY frontend /src/frontend
ARG OPEN_AMBER_PLAUSIBLE_DOMAIN
ARG OPEN_AMBER_PLAUSIBLE_SRC
ENV OPEN_AMBER_PLAUSIBLE_DOMAIN=$OPEN_AMBER_PLAUSIBLE_DOMAIN \
    OPEN_AMBER_PLAUSIBLE_SRC=$OPEN_AMBER_PLAUSIBLE_SRC
RUN set -xe \
    && npm install --location=global pnpm@10 \
    && pnpm install \
    && pnpm build

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN set -xe \
    && . ./.env.test \
    && bun test \
    && bun run build

# copy production dependencies and source code into final image
FROM base AS release
WORKDIR /home/open-amber
ENV NODE_ENV=production
COPY --from=prerelease /usr/src/app/dist/*.js .
COPY --from=prerelease /usr/src/app/drizzle drizzle
COPY --from=frontend-build /src/public public

# run the app
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "--smol", "main.js" ]
