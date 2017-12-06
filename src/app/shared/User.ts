export class User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email?: string;
  avatarUri?: string;
}

export class UserInfo {
  info: User;
  requisites?: [
    {
      id: number,
      description: string
    }
    ];
}

export class UserSummary {
  credits?: [
    {
      user: User,
      totalAmount: number
    }
    ];
  debts?: [
    {
      user: User,
      'totalAmount': number
    }
    ];
}

