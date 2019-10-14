PACKAGE_VERSION=$(cat ./package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

CONTAINER_TAG=docker.pkg.github.com/$DOCKER_USERNAME/cardjizzer-backend:$PACKAGE_VERSION

function build {
  docker login docker.pkg.github.com --username $DOCKER_USERNAME --password $DOCKER_PASSWORD
  docker build -t $CONTAINER_TAG .
  docker push $CONTAINER_TAG
}

function deployToServer {
  ssh-keyscan -H $DEPLOY_IP >> ~/.ssh/known_Hosts
  ssh $DEPLOY_USER@$DEPLOY_IP "docker run $CONTAINER_TAG"
}

build

