import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const accessToken = userService.getAccessToken();

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Intercept 401 Unauthorized errors and attempt seamless token refresh
      if (
        error.status === 401 &&
        !req.url.includes('/auth/refresh') &&
        !req.url.includes('/auth/login')
      ) {
        const refreshToken = userService.getRefreshToken();
        if (refreshToken) {
          return userService.refreshTokenApi().pipe(
            switchMap((res: any) => {
              const newAccessToken = res.accessToken || res.token;
              if (newAccessToken) {
                userService.saveTokens(newAccessToken, res.refreshToken);

                // Re-send original request seamlessly with the newly acquired access token
                const retriedReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newAccessToken}`
                  }
                });
                return next(retriedReq);
              }

              userService.logout();
              return throwError(() => error);
            }),
            catchError((refreshErr) => {
              userService.logout();
              return throwError(() => refreshErr);
            })
          );
        } else {
          userService.logout();
        }
      }

      return throwError(() => error);
    })
  );
};
