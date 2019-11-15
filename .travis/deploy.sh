#!/bin/bash

PACKAGE_VERSION=$(cat ./package.json | jq ".version" -r)

ORGANIZATION=cardjizzerapp

echo "Package ver: $PACKAGE_VERSION"

CONTAINER_TAG="docker.pkg.github.com/$ORGANIZATION/cardjizzerbackend/server:$PACKAGE_VERSION"

build () {
  docker login docker.pkg.github.com --username "CardJizzerApp" --password $TOKEN
  docker build -t $CONTAINER_TAG .
  docker push $CONTAINER_TAG
}

build

exit 0