import {initDDBClient} from '../../common/init-ddb-client.js';
import {BatchWriteCommand} from '@aws-sdk/lib-dynamodb';
import {resourcePrefix} from '../consts.js';

const buildDocument = (id, version, teamId, title, createdAt) => {
    return {
        id,
        version,
        teamId,
        title,
        createdAt,
    };
};

const buildDocuments = () => {
    return [
        buildDocument("1111", 1, "SALES", "DRAFT - Sales summary v1", 1770587041),
        buildDocument("1111", 2, "SALES", "DRAFT - Sales summary v2", 1771237012),
        buildDocument("1111", 3, "SALES", "Sales summary - final", 1774567078),
        buildDocument("2222", 1, "MARKETING", "Marketing Strategy", 1696587045),
    ];
};

const saveDocuments = async (documents) => {
    const ddbClient = initDDBClient();
    const saveDocumentsRequests = documents.map((event) => ({
        PutRequest: {
            Item: event,
        },
    }));
    const command = new BatchWriteCommand({
        RequestItems: {
            [`${resourcePrefix}-composite-key`]: saveDocumentsRequests,
        },
    });

    try {
        await ddbClient.send(command);

        const ids = documents.map((e) => e.id).join(", ");
        console.log("Documents saved successfully. IDs: ", ids);
    } catch (error) {
        console.error("Error saving documents:", error);
        throw error;
    }
};

export const handleAllDocuments = async () => {
    const documents = buildDocuments();
    await saveDocuments(documents);
};

// (async () => {
//   await handleAllDocuments();
// })();
