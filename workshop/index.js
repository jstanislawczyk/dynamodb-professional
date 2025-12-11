import {handleAllAlarms} from './alarms/create-alarms-all.js';
import {handleSparseAlarms} from './alarms/create-alarms-sparse.js';
import {handleIndexedOrganization} from './sort-key/indexed-organization.js';
import {handlePartitionedOrganization} from './sort-key/partitioned-organization.js';

(async () => {
    // Sparse Index
    console.log("\n============= ALARMS =============");
    await handleAllAlarms();
    await handleSparseAlarms();

    // Sort Key partitioning
    console.log("\n============= SORT KEY PARTITIONING =============");
    await handleIndexedOrganization();
    await handlePartitionedOrganization();
})();
