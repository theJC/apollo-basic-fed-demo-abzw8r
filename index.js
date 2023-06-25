import { buildSubgraph as business } from './subgraph_business.js';
import { buildSubgraph as search } from './subgraph_search.js';
import { buildGateway } from './gateway.js';

(async () => {
  await Promise.all([business(4001), search(4002)]);
  await buildGateway(4000);
})();
