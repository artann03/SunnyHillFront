import { createAction, props } from '@ngrx/store';
import { UserState } from './user.types';

export const loadUserProfile = createAction('[User] Load Profile');
export const loadUserProfileSuccess = createAction(
  '[User] Load Profile Success',
  props<{ profile: UserState['profile'] }>()
);
export const loadUserProfileFailure = createAction(
  '[User] Load Profile Failure',
  props<{ error: string }>()
);

export const updateUserProfile = createAction(
  '[User] Update Profile',
  props<{ name: string; email: string }>()
);
export const updateUserProfileSuccess = createAction(
  '[User] Update Profile Success',
  props<{ profile: UserState['profile'] }>()
);
export const updateUserProfileFailure = createAction(
  '[User] Update Profile Failure',
  props<{ error: string }>()
); 