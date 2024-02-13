#!/bin/bash

# Construct request body for authentication
requestBody=$(cat <<EOF
{
    "AuthParameters": {
        "USERNAME": "${COGNITO_USER}",
        "PASSWORD": "${PASSWORD}"
    },
    "AuthFlow": "USER_PASSWORD_AUTH",
    "ClientId": "${CLIENT_ID}"
}
EOF
)

# Send authentication request to Cognito
response=$(curl -s -X POST -H "Content-Type: application/x-amz-json-1.1" -H "X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth" \
-d "$requestBody" "https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}")

echo "Login into: https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID} as ${COGNITO_USER}"
if [ -n "$response" ]; then
    # Authentication successful
    idToken=$(echo "$response" | grep -o '"IdToken": *"[^"]*"' | awk -F '"' '{print $4}')
    if [ -n "$idToken" ]; then
      echo "Token Acquired"
      
      # Concatenate "Bearer" with idToken value
      authHeaderValue="Bearer $idToken"
      export ZAP_AUTH_HEADER_VALUE="$authHeaderValue"
      
      # Run zap-api-scan.py command
      echo "Starting zaproxy api scan..."
      zap-api-scan.py -t /zap/wrk/api_oas30.json -f openapi -a -r /zap/wrk/reports/zap_report.html -w /zap/wrk/reports/zap_report.md
    else
        # Authentication failed
        echo "Error: Access token not found"
        echo $response
    fi
else
    # Authentication failed
    echo "Error: Not response from Cognito"
fi
