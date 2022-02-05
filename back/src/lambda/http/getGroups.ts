import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import 'source-map-support/register'
// import * as AWS from 'aws-sdk'
import { getAllGroups } from "../../businessLogic/groups";

// const docClient = new AWS.DynamoDB.DocumentClient()

// const groupsTable = process.env.GROUPS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)

    // const result = await docClient.scan({ 
    //     TableName: groupsTable
    // }).promise()

    const groups = await getAllGroups();

    // const items = result.Items

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: groups
        })
    }
}
