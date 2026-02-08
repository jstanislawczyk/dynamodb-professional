import {initDDBClient} from '../../common/init-ddb-client.js';
import {BatchWriteCommand} from '@aws-sdk/lib-dynamodb';
import {resourcePrefix} from '../consts.js';

const buildUser = (id, name, email, phone) => {
    return {
        id,
        name,
        email,
        phone,
    };
};

const buildUsers = () => {
    return [
        buildUser("1111", "John Doe", "john@mail.com"),
        buildUser("2222", "Jane Doe", undefined, "123-456-7890"),
    ];
};

const saveUsers = async (users) => {
    const ddbClient = initDDBClient();
    const saveUsersRequests = users.map((event) => ({
        PutRequest: {
            Item: event,
        },
    }));
    const command = new BatchWriteCommand({
        RequestItems: {
            [`${resourcePrefix}-simple-key`]: saveUsersRequests,
        },
    });

    try {
        await ddbClient.send(command);

        const ids = users.map((e) => e.id).join(", ");
        console.log("Users saved successfully. IDs: ", ids);
    } catch (error) {
        console.error("Error saving users:", error);
        throw error;
    }
};

export const handleAllUsers = async () => {
    const users = buildUsers();
    await saveUsers(users);
};

// (async () => {
//   await handleAllUsers();
// })();
