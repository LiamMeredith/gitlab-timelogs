import { secondsToHms } from '../utils/date.util';
import { Issue } from './issue.model';
import { TimelogType } from './timelog-type.enum';
import { User } from './user.model';

export class Timelog implements TimelogInterface {
  // Can be either the issue title or the merge request tiel
  public title: string;
  public description: string;
  public timeSpent: number;
  public timeSpentDisplay?: string;
  public user: User;
  public spentAt: string;
  public issue: Issue;
  public colorDisplay?: string;
  public note: string;
  public spentAtDate: Date;
  public type: TimelogType;
  public webUrl: string;

  constructor(data: TimelogInterface) {
    this.title = data.title ?? '';
    this.description = data.description ?? '';
    this.timeSpent = data.timeSpent ?? 0;
    this.timeSpentDisplay = data.timeSpentDisplay ?? '';
    this.user = data.user ?? null;
    this.spentAtDate = data.spentAtDate ?? null;
    this.spentAt = data.spentAt ?? null;
    this.issue = data.issue ?? null;
    this.colorDisplay = data.colorDisplay ?? '';
    this.note = data.note ?? '';
    this.type = data.type ?? null;
    this.webUrl = data.webUrl ?? '';
  }

  public static createFromApi(data: any = {}): Timelog {
    const issue = Issue.createFromApi(data.issue ?? {});
    const spentAtDate = new Date(data?.spentAt);
    let type: TimelogType;
    if(data.mergeRequest) {
      type = TimelogType.MergeRequest;
    } else if(data.issue) {
      type = TimelogType.Feature;
    }
    return new Timelog({
      title: data.mergeRequest?.title ?? issue.title,
      description: data.mergeRequest?.descriptionHtml ?? issue.description,
      timeSpent: data.timeSpent,
      timeSpentDisplay: secondsToHms(data.timeSpent),
      user: User.createFromApi(data.user ?? {}),
      spentAt: new Date(data.spentAt).toLocaleDateString('en-GB'),
      issue,
      spentAtDate,
      note: data.note?.body,
      type,
      webUrl: data.mergeRequest?.webUrl ?? issue.webUrl,
    });
  }
}

export interface TimelogInterface {
  title: string;
  description: string;
  timeSpent: number;
  timeSpentDisplay?: string;
  user: User;
  spentAt: string;
  spentAtDate: Date;
  issue: Issue;
  colorDisplay?: string;
  note: string;
  type: TimelogType;
  webUrl: string;
}
