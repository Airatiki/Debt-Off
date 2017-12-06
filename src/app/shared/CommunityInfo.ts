import {User} from './User';

export class CommunityInfo {
  id: number;
  name: string;
  members?: [ User ];
}
