export class Issue implements IssueInterface {
  public title: string;
  public description: string;
  public webPath: string;
  public projectId: string;
  public webUrl: string;

  constructor(data: IssueInterface) {
    this.title = data.title ?? 'No title';
    this.description = data.description ?? 'No description available';
    this.webPath = data.webPath ?? null;
    this.projectId = data.projectId;
    this.webUrl = data.webUrl;
  }

  public static createFromApi(data: any = {}): Issue {
    return new Issue({
      title: data.title,
      description: data.descriptionHtml,
      projectId: data.projectId,
      webPath: data.webPath,
      webUrl: data.webUrl,
    });
  }
}

export interface IssueInterface {
  title: string;
  description: string;
  webPath: string;
  projectId: string;
  webUrl: string;
}
