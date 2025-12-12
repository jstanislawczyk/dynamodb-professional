import { initDDBClient } from "../../common/init-ddb-client.js";
import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { resourcePrefix } from "../consts.js";

const buildEvent = (id, sensorId, value, createdAt, status) => {
  return {
    id,
    sensorId,
    value,
    createdAt,
    status,
    ALARM_GSI_PK: status === "ALARM" ? sensorId : undefined,
  };
};

const buildEvents = () => {
  return [
    // Events for sensor-1
    buildEvent("1111", "sensor-1", 23.0, 1756068060, "OK"),
    buildEvent("2222", "sensor-1", 25.5, 1756068120, "OK"),
    buildEvent("3333", "sensor-1", 30.2, 1756068180, "ALARM "),
    buildEvent("4444", "sensor-1", 28.4, 1756068240, "ALARM"),
    // Events for sensor-2
    buildEvent("5555", "sensor-2", 31.5, 1756068120, "ALARM"),
  ];
};

const saveEvents = async (sensorEvents) => {
  const ddbClient = initDDBClient();
  const saveEventsRequests = sensorEvents.map((event) => ({
    PutRequest: {
      Item: event,
    },
  }));
  const command = new BatchWriteCommand({
    RequestItems: {
      [`${resourcePrefix}-alarms-sparse`]: saveEventsRequests,
    },
  });

  try {
    await ddbClient.send(command);

    const ids = sensorEvents.map((e) => e.id).join(", ");
    console.log("Events saved successfully. IDs: ", ids);
  } catch (error) {
    console.error("Error saving events:", error);
    throw error;
  }
};

export const handleSparseAlarms = async () => {
  const events = buildEvents();
  await saveEvents(events);
};

// (async () => {
//   await handleSparseAlarms();
// })();
