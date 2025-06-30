import {initDDBClient} from './init-ddb-client.js';
import {GetCommand} from '@aws-sdk/lib-dynamodb';
import {usersTable} from './consts.js';

export const getUserById = async (id, consistentRead = true) => {
    const ddbClient = initDDBClient();
    const command = new GetCommand({
        TableName: usersTable,
        Key: {
            id,
        },
        ConsistentRead: consistentRead,
    });

    try {
        const response = await ddbClient.send(command);
        return response.Item;
    } catch (error) {
        console.error("Error getting item:", error);
        throw error;
    }
}
