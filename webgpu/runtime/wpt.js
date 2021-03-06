/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/

import { TestLoader } from '../framework/loader.js';
import { Logger } from '../framework/logger.js';
import { makeQueryString } from '../framework/url_query.js';
import { AsyncMutex } from '../framework/util/async_mutex.js';

(async () => {
  const loader = new TestLoader();
  const files = await loader.loadTestsFromQuery(window.location.search);
  const log = new Logger();
  const mutex = new AsyncMutex();
  const running = [];

  for (const f of files) {
    if (!('g' in f.spec)) {
      continue;
    }

    const [rec] = log.record(f.id);

    for (const t of f.spec.g.iterate(rec)) {
      // Note: apparently, async_tests must ALL be added within the same task.
      async_test(function () {
        const p = mutex.with(async () => {
          const r = await t.run();
          this.step(() => {
            if (r.status === 'fail') {
              throw (r.logs || []).join('\n');
            }
          });
          this.done();
        });
        running.push(p);
        return p;
      }, makeQueryString(f.id, t.id));
    }
  }

  await Promise.all(running);
  const resultsElem = document.getElementById('results');
  resultsElem.textContent = log.asJSON(2);
})();
//# sourceMappingURL=wpt.js.map