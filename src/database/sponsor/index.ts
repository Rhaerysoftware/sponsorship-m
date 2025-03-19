export enum SponsorshipStatus {
  DENIED = 'Denied',
  BLOCKED = 'Blocked',
  APPROVED = 'Approved',
  WAITING_FOR_PAYMENT = 'Waiting for Payment',
  WAITING_FOR_AUTHORIZATION = 'Waiting for Authorization',
  CHILD_DELETED = 'Child Deleted',
  USER_DELETED = 'User Deleted',
}

export enum SpStatus {
  ACTIVE = 'ACTIVE',
  REQUIRES_PAYMENT = 'REQUIRES_PAYMENT',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  CANCELLED_BY_AUTHORITY = 'CANCELLED_BY_AUTHORITY',
}

export enum FixNeedStatus {
  ACTIVE = 'Active',
  DEACTIVE = 'Deactive',
}
