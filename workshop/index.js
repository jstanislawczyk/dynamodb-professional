import { handleAllAlarms } from "./alarms/create-alarms-all.js";
import { handleSparseAlarms } from "./alarms/create-alarms-sparse.js";
import { handleIndexedOrganization } from "./sort-key/indexed-organization.js";
import { handlePartitionedOrganization } from "./sort-key/partitioned-organization.js";
import { handleNestedArticles } from "./articles/articles-nested.js";
import { handleRelation } from "./articles/articles-relation.js";
import { handleOptimisticLocking } from "./optimistic-locking/optimistic-locking.js";
import { handleSharding } from "./sharding/sharding.js";
import { handleAllUsers } from './keys/simple-key.js';
import { handleAllDocuments } from './keys/composite-key.js';

const isLiveWorkshop = false;

(async () => {
  // Keys
  await handleAllUsers();
  await handleAllDocuments();

  // Sort Key partitioning
  console.log("\n============= SORT KEY PARTITIONING =============");
  !isLiveWorkshop && await handleIndexedOrganization();
  await handlePartitionedOrganization();

  // Sparse Index
  console.log("\n============= ALARMS =============");
  await handleAllAlarms();
  await handleSparseAlarms();

  // One to Many
  console.log("\n============= ONE TO MANY =============");
  await handleNestedArticles();
  await handleRelation();

  // Optimistic Locking
  console.log("\n============= OPTIMISTIC LOCKING =============");
  !isLiveWorkshop && await handleOptimisticLocking();

  // Sharding
  console.log("\n============= SHARDING =============");
  await handleSharding();
})();
