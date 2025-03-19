export enum ChildNeedGroupStatus {
  OPEN = 'Open',
  WAITING_FILE_UPLOAD = 'Waiting File Upload',
  CLOSE = 'Close',
}

export enum NeedSafeType {
  INCOME = 'Income',
  OUTCOME = 'Outcome',
}

export enum NeedStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  NOT_COMPLETED = 'Not Completed', // Bunu otorite seçer
  MET = 'Met',
}

export enum NeedUrgency {
  NORMAL = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}
