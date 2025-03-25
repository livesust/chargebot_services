# Chargebot Services
Chargebot Serverless API.

Implemented with https://sst.dev/

Docs: https://docs.sst.dev/

## Running in your local environment
In order to run locally, you need to create a new stage of your own.

```bash
npm run my-stage
```

Will deploy a `my-stage` stage into AWS and print config variables for you:
```
SST v2.30.3  ready!

➜  App:     chargebot-services
   Stage:   dev
   Console: https://console.sst.dev

|  CognitoStack PUBLISH_ASSETS_COMPLETE 
|  RDSStack PUBLISH_ASSETS_COMPLETE 
|  ChargebotStack PUBLISH_ASSETS_COMPLETE 
⠋  Deploying...

✔  Deployed:
   CognitoStack
   CognitoIdentityPoolId: us-east-1:71a31185-280c-4efb-a3ff-cd1199c564a5
   CognitoUserPoolClientId: 5i9455f6nnctsg0jckotho42ho
   CognitoUserPoolId: us-east-1_xIsDQ7O8z
   RDSStack
   RDSClusterEndpoint: {"hostname":"dev-chargebot-services-rdscluster.cluster-chbfcndbn3vk.us-east-1.rds.amazonaws.com","port":5432,"socketAddress":"dev-chargebot-services-rdscluster.cluster-chbfcndbn3vk.us-east-1.rds.amazonaws.com:5432"}
   RDSClusterIdentifier: dev-chargebot-services-rdscluster
   RDSSecretArn: arn:aws:secretsmanager:us-east-1:881739832873:secret:RDSClusterSecretC64011DA-butv92fmYFHF-DRk4RR
   ChargebotStack
   ApiEndpoint: https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com
   BucketName: dev-chargebot-services-chargebo-userbucketaebdbf86-aoqx1tppmpl7
```

### Removing local stage
If you are not going to use work on the project anymore (or for a few days), please remove it to not increase AWS costs.
```bash
npm remove my-stage
```
`NOTE: DO NOT REMOVE "staging" nor "production"`

## Setting Secrets
Use the following command to set a secret into a specific environment.

```bash
npx sst secrets --stage <env_name> set <secret_name> <secret_value>
```

## Deploying to Staging and Production
```bash
npx sst deploy --stage staging
npx sst deploy --stage production
```

## Access RDS via a SSH tunnel with bastion server
A bastion server must be setup on the VPC public subnet and modify the security group to allow access on SSH port 22.
Then, you can use the following command to formward RDS instance 5432 to your localhost:5433.

```bash
ssh -i <bastion-certificate>.pem -f -N -L 5433:<rds-server>:5432 ec2-user@<bastion-host> -v

ssh -i bastion-staging-rds.pem -f -N -L 5433:staging-chargebot-services-rdscluster.cluster-chbfcndbn3vk.us-east-1.rds.amazonaws.com:5432 ec2-user@ec2-54-165-187-31.compute-1.amazonaws.com -v
```

## Generate entities
### Create a entity
```bash
npm run crud --entity=foo
```
It will prompt for entity data and generate all necessary files, including tests.
A JSON of the entity definition will be saved in `.entities/foo.json`

To edit an entity, modify the JSON file and re-run the command.
### Regenerate all
```bash
npm run crud --all
```
It will regenerate all the entities defined in `.entities/` folder.
## Test
### Unit Tests
```bash
npm run test
```
### Postman
Ask for access to Sust Pro postman account. There's a postman Collection `Chargebot API` with several tests.
* test data: includes tests for setting up your local environment by creating some basic data.
* mobile app: API requests for react-native mobile app.
* crud: create, get, uptated, delete and search examples for some of the concepts.

## Security
### ZAProxy (Zed Attack Proxy)

1. Go to `packages/core/functions/security/zaproxy` dir
2. Export API Gateway OpenApi file
```bash
aws apigateway get-export --parameters extensions='apigateway' --rest-api-id <your-dev-api-id> --stage-name "$default" --export-type oas30 oas30.json
```
3. Create a `.env` file
```
COGNITO_USER=cognito user name
PASSWORD=cognito password
USER_POOL_ID=cognito user pool id
CLIENT_ID=cognito client id
REGION=us-east-1
```
4. Run security test with docker

```bash
docker-compose up
```

The result of all tests will be in the terminal, also some reports are generated into `zaproxy/reports`.

### SQLMap
1. Clone SQLMap
```bash
git clone --depth 1 https://github.com/sqlmapproject/sqlmap.git sqlmap-dev
```
1. Go to `packages/core/functions/security/sqlmap`
2. Install dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install openapi3-parser
```
3. Create/Edit `.env`file
```
COGNITO_USER=cognito user name
PASSWORD=cognito password
USER_POOL_ID=cognito user pool id
CLIENT_ID=cognito client id
REGION=us-east-1
API_URL=your api base endpoint
SQLMAP_DIR=/git-clone-dir-to/sqlmap-dev
```
4. Run `run_test.sh`
```bash
chmod+x run_test.sh && ./run_test.sh
```

More info about SQLMap usage [here](https://github.com/sqlmapproject/sqlmap/wiki/Usage)