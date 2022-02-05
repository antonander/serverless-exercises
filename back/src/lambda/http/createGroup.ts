import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import 'source-map-support/register'
// import * as AWS from 'aws-sdk'
// import * as uuid from 'uuid'
// import { getUserId } from "../../auth/utils";
import { createGroup } from "../../businessLogic/groups";
import { CreateGroupRequest } from "../../requests/CreateGroupRequest";

// const docClient = new AWS.DynamoDB.DocumentClient()
// const groupsTable = process.env.GROUPS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)

    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const newGroup: CreateGroupRequest = JSON.parse(event.body)

    const newItem = await createGroup(newGroup, jwtToken)

    // const userId = getUserId(jwtToken)

    // const itemid = uuid.v4()
    // const parsedBody = JSON.parse(event.body)

    // const newItem = {
    //   id: itemid,
    //   userId: userId,
    //   ...parsedBody
    // }

    // await docClient.put({
    //   TableName: groupsTable,
    //   Item: newItem
    // }).promise()

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Contol-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
}

