import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserActions } from '../actions/user.actions';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserProfile),
      mergeMap(action =>
        this.userService.updateProfile(action).pipe(
          map(profile => {
            // If password was changed, dispatch logout action
            if (action.currentPassword && action.newPassword) {
              this.authService.logout();
              this.router.navigate(['/login']);
            }
            return UserActions.updateUserProfileSuccess({ profile });
          }),
          catchError(error => of(UserActions.updateUserProfileFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}
} 