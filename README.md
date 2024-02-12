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

## Deploying to Staging and Production
```bash
npx sst deploy --stage staging
npx sst deploy --stage production
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

1. Go to `zaproxy` dir
2. Create a `.env` file
```
COGNITO_USER=cognito user name
PASSWORD=cognito password
USER_POOL_ID=cognito user pool id
CLIENT_ID=cognito client id
REGION=us-east-1
```

3. Run security test with docker

```bash
docker-compose up
```

The result of all tests will be in the terminal, also some reports are generated into `zaproxy/reports`.

### SQLMap
```bash
python sqlmap.py \
  -u https://rfrtoqe0a9.execute-api.us-east-1.amazonaws.com/user \
  --level 5 \
  --risk 3 \
  --batch
```