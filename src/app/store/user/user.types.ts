import { UserProfile } from '../../models/user.interface';

export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  profile: null,
  loading: false,
  error: null
}; 