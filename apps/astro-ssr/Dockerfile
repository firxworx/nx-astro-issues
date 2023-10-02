# #######################################################################################################################
# #######################################################################################################################
# Dockerfile that builds Astro with SSR as multi-stage Docker build
# #######################################################################################################################
# #######################################################################################################################

# build with docker buildkit (required for the `--mount-type` option)
# DOCKER_BUILDKIT=1 docker buildx build -f apps/astro-ssr/Dockerfile -t astro-ssr-demo:latest --platform=linux/amd64 .

# build with docker buildkit for arm64 (note: lambda containers do not support multi-arch; only ecs/fargate can)
# DOCKER_BUILDKIT=1 docker buildx build -f apps/astro-ssr/Dockerfile -t astro-ssr-demo:latest --platform=linux/arm64 .

# add --no-cache to the build command to force a rebuild of the image

# run docker image as container
# docker run --name astro-ssr --rm -p 4321:4321 astro-ssr-demo:latest

# stop container
# docker stop astro-ssr-demo
# or more generically (stop any container running on port 4321)
# docker stop $(docker ps | grep ':4321' | awk '{print $1}')

# inspect size of image with
# docker images astro-ssr-demo:latest

# inspect the size of layers with
# docker history astro-ssr-demo:latest

# shell into container
# docker run -it astro-ssr-demo:latest bash

# #######################################################################################################################
# base image
# #######################################################################################################################

FROM node:18-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV ASTRO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED 1

# node-slim is debian based so use apt-get
RUN apt-get update && apt-get install -y \
  curl \
  ca-certificates \
  dumb-init \
  jq \
  bash \
  build-essential \
  python3 \
  nano \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# install pnpm via corepack
RUN corepack enable
RUN corepack prepare pnpm@8.8.0 --activate

# create our own non-root user and group 'bot' with uid+guid 9999 (debian-based)
RUN groupadd -g 9999 bot \
    && useradd -r -m -u 9999 -g bot bot

WORKDIR /app
RUN chown bot:bot /app

USER bot

# copying the package lock as a discrete step caches it independently of the source code
COPY --chown=bot:bot package.json pnpm-lock.yaml ./

# copy the package cleanup the best we can do for smaller build if nx + astro are not able to produce package.json
COPY --chown=bot:bot apps/astro-ssr/deploy/package-janitor.sh .

# make package cleanup executable and run it
RUN chmod +x package-janitor.sh && ./package-janitor.sh && rm package-janitor.sh

# fix the lockfile as a cached layer prior to hand-off to the prod-deps and build-deps
# this single step MASSIVELY blows out the size of the image by >1gb (it seems to store all on the image despite mount=type)
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --lockfile-only --fix-lockfile
#
# this would not be required if Nx could generate a package.json + lock with only the deps required for the build

# #######################################################################################################################
# production-only dependencies
# #######################################################################################################################

FROM base AS prod-deps
USER bot

# @temp not as rigorous but we just rewrote package.json so can't use a frozen lockfile :P
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod
# vs. desirable and production-worthy...
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# #######################################################################################################################
# build dependencies (development + production)
# #######################################################################################################################

FROM base AS build-deps
USER bot

RUN ls -la

# @temp not as rigorous but we just rewrote package.json so can't use a frozen lockfile :P
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
# vs. desirable and production-worthy...
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# #######################################################################################################################
# build image
# #######################################################################################################################

FROM build-deps AS build

ENV NODE_ENV="production"
USER bot

COPY --chown=bot:bot . .

RUN ls -la

# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm astro build --root apps/astro-ssr --verbose

# this will segfault...
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm nx build astro-ssr --prod

# #######################################################################################################################
# runtime image for deployment
# #######################################################################################################################

FROM base AS runtime

ENV PATH="/app/node_modules/.bin:$PATH"
ENV NODE_ENV="production"

USER bot

# https://github.com/awslabs/aws-lambda-web-adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.1 /lambda-adapter /opt/extensions/lambda-adapter

# @todo need a custom executor (or alternative nx workflow) that generates a package.json and lock file with only astro deps

COPY --chown=bot:bot --from=prod-deps /app/node_modules ./node_modules
COPY --chown=bot:bot --from=build /app/dist/apps/astro-ssr/dist ./dist

# reminder: you can't use variable interpolation with a Heredoc in a Dockerfile
# however you can use `RUN echo "VAR=$ARG" >> .env` or use a command e.g. `sed` or `envsubst`
# also note if you quote the EOF ("EOF") it will not interpolate
RUN cat <<EOF > .env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable
HELLO=world
EOF

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
