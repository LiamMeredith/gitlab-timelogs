export class User implements UserInterface {
  username: string;
  displayName: string;
  avatarUrl: string;

  constructor(data: UserInterface) {
    this.username = data.username ?? null;
    this.displayName = data.displayName ?? null;
    this.avatarUrl = data.avatarUrl ?? null;
  }

  public static createFromApi(data: any = {}): User {
    return new User({
      username: data.username,
      displayName: data.name,
      avatarUrl: data.avatar_url,
    });
  }
}

export interface UserInterface {
  username: string;
  displayName: string;
  avatarUrl: string;
}
