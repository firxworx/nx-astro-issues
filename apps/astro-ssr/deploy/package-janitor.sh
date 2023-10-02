#!/usr/bin/env bash

# exact packages to remove
declare -a exactPackagesToRemove=("pg" "ts-node" "tsx" "argon2" "multer" "connect-pg-simple" "cookie-parser")

# keywords in package names to target for removal
declare -a keywordPackagesToRemove=("fastify" "express" "aws-cdk" "slonik" "postgres" "aws-sdk" "socket.io" "@swc" "@neondatabase")

# process exact matches
for exactPackage in "${exactPackagesToRemove[@]}"; do
  jq "del(.dependencies.\"$exactPackage\", .devDependencies.\"$exactPackage\")" package.json > package.temp.json && \
  mv package.temp.json package.json
done

# process keyword matches
for keyword in "${keywordPackagesToRemove[@]}"; do
  jq ".dependencies |= with_entries(select(.key | contains(\"$keyword\") | not)) | .devDependencies |= with_entries(select(.key | contains(\"$keyword\") | not))" package.json > package.temp.json && \
  mv package.temp.json package.json
done
