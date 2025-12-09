import {initDDBClient} from '../common/init-ddb-client.js';
import {BatchWriteCommand} from '@aws-sdk/lib-dynamodb';
import {sensorEventsTable} from '../common/consts.js';

const buildEvent = (sensorId, value, createdAt, status) => {
    return {
        id: crypto.randomUUID(),
        sensorId,
        value,
        createdAt,
        status,
        SENSOR_STATUS_GSI_PK: `${sensorId}#${status}`,
        // This attribute is only set for ALARM status. Thus, only ALARM events will be indexed in the ALARM_GSI.
        ALARM_GSI_PK: status === 'ALARM' ? sensorId : undefined,
    }
}

const buildEvents = () => {
    return [
        // Events for sensor-1
        buildEvent('sensor-1', 23.0, 1756068060, 'OK'),
        buildEvent('sensor-1', 25.5, 1756068120, 'OK'),
        buildEvent('sensor-1', 30.2, 1756068180, 'ALARM '),
        buildEvent('sensor-1', 28.4, 1756068240, 'OK'),
        buildEvent('sensor-1', 31.3, 1756068360, 'ALARM'),
        // Events for sensor-2
        buildEvent('sensor-2', 31.5, 1756068120, 'ALARM'),
        buildEvent('sensor-2', 21.2, 1756068180, 'OK'),
        buildEvent('sensor-2', 22.4, 1756068240, 'OK'),
        buildEvent('sensor-2', 35.0, 1756068300, 'ALARM'),
        buildEvent('sensor-2', 36.5, 1756068360, 'ALARM'),
    ];
}

const saveEvents = async (sensorEvents) => {
    const ddbClient = initDDBClient();
    const saveEventsRequests = sensorEvents.map(event => ({
        PutRequest: {
            Item: event,
        },
    }));
    const command = new BatchWriteCommand({
        RequestItems: {
            [sensorEventsTable]: saveEventsRequests,
        },
    });

    try {
        await ddbClient.send(command);

        const ids = sensorEvents.map(e => e.id).join(', ');
        console.log('Events saved successfully. IDs: ', ids);
    } catch (error) {
        console.error('Error saving events:', error);
        throw error;
    }
}

(async () => {
    const events = buildEvents();
    await saveEvents(events)
})();
