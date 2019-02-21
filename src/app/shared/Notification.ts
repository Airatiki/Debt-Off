import {User} from './User';

export class NotificationDTO {
  id: number;
  target: User;
  amount: number;
  time: Date;
  description: string;
}

export class NotificationStore {
  ingoing?: NotificationDTO[];
  outgoing?: NotificationDTO[];
}
