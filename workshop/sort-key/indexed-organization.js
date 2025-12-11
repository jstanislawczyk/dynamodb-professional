import {initDDBClient} from '../../common/init-ddb-client.js';
import {BatchWriteCommand, QueryCommand} from '@aws-sdk/lib-dynamodb';
import {resourcePrefix} from '../consts.js';

const templatesIndexedTable = `${resourcePrefix}-templates-indexed`;

const buildTemplate = (tenantId, teamId, userId, name) => {
    return {
        id: crypto.randomUUID(),
        tenantId,
        teamId,
        userId,
        name,
    }
}

const buildTemplates = () => {
    return [
        // Templates for tenant 1
        buildTemplate('Tenant-1111', 'Team-1111', 'User-1111', 'Doc 1'),
        buildTemplate('Tenant-1111', 'Team-1111', 'User-1111', 'Doc 2'),
        buildTemplate('Tenant-1111', 'Team-1111', 'User-2222', 'Doc 3 '),
        buildTemplate('Tenant-1111', 'Team-2222', 'User-3333', 'Doc 4'),
        // Templates for tenant 2
        buildTemplate('Tenant-2222', 'TeamTenant2', 'UserTeam2', 'Excel'),
    ];
}

const saveTemplates = async (templates) => {
    const ddbClient = initDDBClient();
    const saveTemplatesRequests = templates.map(event => ({
        PutRequest: {
            Item: event,
        },
    }));
    const command = new BatchWriteCommand({
        RequestItems: {
            [templatesIndexedTable]: saveTemplatesRequests,
        },
    });

    try {
        await ddbClient.send(command);

        const ids = templates.map(e => e.id).join(', ');
        console.log('Templates saved successfully. IDs: ', ids);
    } catch (error) {
        console.error('Error saving templates:', error);
        throw error;
    }
}

const queryByIndex = async (tableName, indexName, keyName, keyValue) => {
    const ddbClient = initDDBClient();
    const params = {
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: {
            "#pk": keyName,
        },
        ExpressionAttributeValues: {
            ":pk": keyValue,
        },
    };

    try {
        const result = await ddbClient.send(new QueryCommand(params));
        return result.Items || [];
    } catch (err) {
        console.error("DDB Query Error:", err);
        throw err;
    }
}

export const handleIndexedOrganization = async () => {
    const templates = buildTemplates();
    await saveTemplates(templates)

    const byTenant = await queryByIndex(templatesIndexedTable, 'TENANT_GSI', 'tenantId', 'Tenant-1111');
    const byTeam = await queryByIndex(templatesIndexedTable, 'TEAM_GSI', 'teamId', 'Team-1111');
    const byUser = await queryByIndex(templatesIndexedTable, 'USER_GSI', 'userId', 'User-1111');

    console.log('By Tenant: ', byTenant);
    console.log('By Team: ', byTeam);
    console.log('By User: ', byUser);
}

// (async () => {
//     await handleIndexedOrganization();
// })();
