#!/bin/bash
set -o allexport
source .env
set +o allexport

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
      
      # Run zap-api-scan.py command
      echo "Starting zaproxy api scan..."
      python3 parse_api.py
      python "${SQLMAP_DIR}/sqlmap.py" \
        -m targets.info \
        --headers="Authorization: $authHeaderValue" \
        --level=5 \
        --risk=3 \
        -v 6 \
        --batch
    else
        # Authentication failed
        echo "Error: Access token not found"
        echo $response
    fi
else
    # Authentication failed
    echo "Error: Not response from Cognito"
fi
