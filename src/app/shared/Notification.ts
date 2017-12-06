import {User} from './User';

export class Notification {
  id: number;
  target: User;
  amount: number;
  time: Date;
  description: string;
}

export class NotificationStore {
  ingoing?: Notification[];
  outgoing?: Notification[];
}
