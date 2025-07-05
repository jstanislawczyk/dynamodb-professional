import {initDDBClient} from './init-ddb-client.js';
import {QueryCommand} from '@aws-sdk/lib-dynamodb';
import {teamIdGSI, usersTable} from './consts.js';

export const getUsersByTeam = async (teamId) => {
    const ddbClient = initDDBClient();
    const command = new QueryCommand({
        TableName: usersTable,
        KeyConditionExpression: 'teamId = :teamId',
        ExpressionAttributeValues: {
            ':teamId': teamId,
        },
        IndexName: teamIdGSI,
    });

    try {
        const response = await ddbClient.send(command);
        return response.Items;
    } catch (error) {
        console.error('Error getting items:', error);
        throw error;
    }
}
