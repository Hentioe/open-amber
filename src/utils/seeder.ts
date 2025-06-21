import { seeds } from "../db";
import log from "../log";
import { createRecord, deleteRecord, getRecordBy } from "../modules/record";

async function run() {
  for (const record of seeds) {
    const exists = getRecordBy({ siteDomain: record.siteDomain });
    if (exists) deleteRecord(exists.id);

    const result = createRecord(record);
    if (result.ok) {
      log.info(`Generated seed record for ${record.siteDomain}`);
    } else {
      log.error(`Failed to generate seed record for ${record.siteDomain}: ${result.val}`);
    }
  }
}

export { run };
