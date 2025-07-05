import {initDDBClient} from './init-ddb-client.js';
import {PutCommand} from '@aws-sdk/lib-dynamodb';
import {usersTable} from './consts.js';

export const saveUser = async (user) => {
    const ddbClient = initDDBClient();
    const command = new PutCommand({
        TableName: usersTable,
        Item: user,
    });

    try {
        await ddbClient.send(command);
        console.log('User saved successfully:', user);
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}
