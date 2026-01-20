# make sure the version number matches the version in package.json
docker build -t prompt-vault .
docker tag prompt-vault paulwoods/prompt-vault:0.0.1
docker tag prompt-vault paulwoods/prompt-vault:latest
docker push paulwoods/prompt-vault:0.0.1
docker push paulwoods/prompt-vault:latest
