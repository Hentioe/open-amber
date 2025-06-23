function renderRecord(record: Model.Record) {
  return {
    site_id: record.siteId,
    site_name: record.siteName,
    site_domain: record.siteDomain,
    site_home: record.siteHome,
    site_info: record.siteInfo,
    site_owner: record.siteOwner,
    site_status: record.siteStatus,
    site_modify: new Date(record.siteModify),
    owner_email: record.ownerEmail,
    review_status: record.reviewStatus,
  };
}

function renderRecords(records: Model.Record[]) {
  return records.map(renderRecord);
}

export { renderRecord, renderRecords };
