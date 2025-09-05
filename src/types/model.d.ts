declare namespace Model {
  type ReviewStatus = "pending" | "approved" | "rejected";
  type SiteStatus = "open" | "closed";
  type Record = {
    id?: number;
    siteId: string;
    siteName: string;
    siteDomain: string;
    siteHome: string;
    siteOwner: string;
    siteInfo: string | null;
    siteStatus: SiteStatus;
    siteModify: Date;
    ownerEmail: string;
    reviewStatus: ReviewStatus;
    insertedAt?: Date;
    updatedAt?: Date;
  };

  type UpdateRecord = {
    siteName?: string;
    siteHome?: string;
    siteOwner?: string;
    siteInfo?: string | null;
    ownerEmail?: string;
    siteStatus?: SiteStatus;
    reviewStatus?: ReviewStatus;
  };
}
