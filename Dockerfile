FROM --platform=${BUILDPLATFORM} node:22-alpine AS base
WORKDIR /usr/app
ENV PATH="$PATH:node_modules/.bin"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g corepack && corepack enable

RUN apk update \
  && apk upgrade \
  && rm -rf /var/cache/apk/*

FROM base AS prod-deps
COPY pnpm-lock.yaml package.json .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile \
  && pnpm build \
  && find . \( \! -name "." -a \! -name "dist" -a \! -name "package.json" \) -maxdepth 1 -print | xargs rm -rf

FROM base AS prod
ENV NODE_ENV=production
ENV PORT=8000

RUN chown -R node:node /usr/app
USER node

COPY --from=prod-deps --chown=node:node /usr/app .
COPY --from=build --chown=node:node /usr/app/dist dist

EXPOSE 8000
CMD [ "node", "/usr/app/dist/server.js" ]
