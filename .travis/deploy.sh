PACKAGE_VERSION=$(cat ../package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

CONTAINER_TAG=docker.pkg.github.com/$DOCKER_USERNAME/cardjizzer-backend:$PACKAGE_VERSION

docker login docker.pkg.github.com --username $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker build -t $CONTAINER_TAG .
docker push $CONTAINER_TAG

