import { createReducer, on } from '@ngrx/store';
import { initialUserState } from './user.types';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUserProfile, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.loadUserProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false
  })),
  on(UserActions.loadUserProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(UserActions.updateUserProfile, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserActions.updateUserProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false
  })),
  on(UserActions.updateUserProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 