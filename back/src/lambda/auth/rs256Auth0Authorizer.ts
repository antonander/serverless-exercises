import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { verify } from "jsonwebtoken";
import { JwtToken } from "../../auth/JwtToken";
import 'source-map-support/register'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJFnE/VhoZDDx7MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1mZG9ja2dmcC51cy5hdXRoMC5jb20wHhcNMjIwMjAyMDI1ODExWhcN
MzUxMDEyMDI1ODExWjAkMSIwIAYDVQQDExlkZXYtZmRvY2tnZnAudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlvgx+wrOqdHjRz1P
NnCw/PMJ2q7li4bRsgxTKTokem78KZg0QnsjByrn+zcR+RjN2moqDlnTU8Rw3gQZ
b9uasMF6S+8n9eBfzfcqwcibVRaZvvXioiesT0xEF69c94hBzvzXV4kFSomqT71n
vQbm8JrwdLjW7M1TjLg1LVeqDjkZjDlZ0RNr033PJEBLz+6sr8xJ+MTPJlsyR3p/
Hahwn/KdvGgY2Q8T5SnoprOvlbJNziJ6LPcHaJMNrQzuQBRsylCAYuFby1x6wlvD
tqZKlNIm1ntGZuMbfJ/knu4N3HlxXCj0Qy0ff6qAxCG0dxBL1D3h6WKxHDrR5oFr
fNe6jQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRcVs5pyuhQ
wis7mX7fxDU0JFylzTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AIlR3Nfb4K5QPqXtPHwEYQt8pJj8DoyOe/aykTHRz89uFZa1NGyZRsxygWirf5nz
+d0IPeDlSF3p9PWXyEsUretH6IJkltP2g1HkaT5S8oI9XU8y4BVodoQ5DIFkAQ2E
dQ+K+FK6vmaCIbcIyh8Sq8AHmg+KKmE11vmhEQeYETPb7l7ECXA0lX7AhKuUcaW5
syx+4o0UzvjEMWCOXuHAKIrjgBiglfq9DR/fgdYT6/uEVVg8IzIbcKvApYBMg12x
qlT8Kq1i7OzJyzn/KojCiVzMyxKI+cybzf3XmAnvTuivpknUGOBax6nRikfr5dBZ
EthX5jKk32ZD6Y/9QkIav2U=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    try {
        const decodedToken = verifyToken(event.authorizationToken)
        console.log('User was authorized')

        return {
            principalId: decodedToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }

    } catch (e) {
        console.log('User was not authorized ', e.message)

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

function verifyToken(authHeader: string): JwtToken{

    if(!authHeader)
        throw new Error('No authorization header')

    if( !authHeader.toLocaleLowerCase().startsWith('bearer '))
        throw new Error('Invalid authorization header')
    
    const split = authHeader.split(' ')
    console.log('The token before spliting ', authHeader)
    console.log('The token after spliting ', split)
    const token = split[1]

    console.log('The token we got ', token)

    // const secretObject : any = await getSecret()
    // const secret = secretObject[secretField]

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken

}