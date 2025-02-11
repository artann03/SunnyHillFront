import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  loadProfile$: any;
  updateProfile$: any;

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {
    console.log('[UserEffects] Constructor called');
    
    this.loadProfile$ = createEffect(() => {
      console.log('[UserEffects] loadProfile$ effect created');
      return this.actions$.pipe(
        tap(action => console.log('[UserEffects] Received action:', action)),
        ofType(UserActions.loadUserProfile),
        mergeMap(() => 
          this.authService.getUserProfile().pipe(
            map(profile => UserActions.loadUserProfileSuccess({ profile })),
            catchError(error => 
              of(UserActions.loadUserProfileFailure({ 
                error: error.message || 'Failed to load profile' 
              }))
            )
          )
        )
      );
    });

    this.updateProfile$ = createEffect(() => {
      return this.actions$.pipe(
        ofType(UserActions.updateUserProfile),
        mergeMap(({ name, email }) => 
          this.authService.updateProfile({ name, email }).pipe(
            map(profile => UserActions.updateUserProfileSuccess({ profile })),
            catchError(error => 
              of(UserActions.updateUserProfileFailure({ 
                error: error.message || 'Failed to update profile' 
              }))
            )
          )
        )
      );
    });
  }
}