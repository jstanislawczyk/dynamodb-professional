import {initDDBClient} from '../../common/init-ddb-client.js';
import {BatchWriteCommand, QueryCommand} from '@aws-sdk/lib-dynamodb';
import {resourcePrefix} from '../consts.js';

const templatesPartitionedTable = `${resourcePrefix}-templates-partitioned`;

const buildTemplate = (tenantId, teamId, userId, name) => {
    const id = crypto.randomUUID();

    return {
        PK: `TENANT:${tenantId}`,
        SK: `TEAM:${teamId}#USER:${userId}#TEMPLATE:${id}`,
        id,
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
        buildTemplate('Tenant-1111', 'Team-1111', 'User-2222', 'Doc 2 '),
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
            [templatesPartitionedTable]: saveTemplatesRequests,
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

const queryByPrefix = async (tenantId, prefix) => {
    const ddbClient = initDDBClient();
    const params = {
        TableName: templatesPartitionedTable,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
        ExpressionAttributeValues: {
            ':pk': `TENANT:${tenantId}`,
            ':prefix': prefix,
        },
    };

    try {
        const result = await ddbClient.send(new QueryCommand(params));
        return result.Items || [];
    } catch (err) {
        console.error('DDB Query Error:', err);
        throw err;
    }
}

(async () => {
    const templates = buildTemplates();
    await saveTemplates(templates)

    const byTenant = await queryByPrefix('Tenant-1111', 'TEAM:Team-1111');
    const byTeam = await queryByPrefix('Tenant-1111', 'TEAM:Team-1111#USER:User-1111');
    const byUser = await queryByPrefix('Tenant-1111', `TEAM:Team-1111#USER:User-1111#TEMPLATE:${templates[0].id}`);

    console.log('By Tenant: ', byTenant);
    console.log('By Team: ', byTeam);
    console.log('By User: ', byUser);
})();
