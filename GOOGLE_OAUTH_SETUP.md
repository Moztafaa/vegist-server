# Google OAuth Integration Setup Guide

## Backend Setup (Completed ✅)

The following has been implemented in your Express.js backend:

1. **Dependencies Installed:**
   - `passport`
   - `passport-google-oauth20`
   - `@types/passport`
   - `@types/passport-google-oauth20`

2. **Files Modified/Created:**
   - ✅ `src/models/User.ts` - Added `googleId`, `authProvider` fields, made `password` optional
   - ✅ `src/config/passport.ts` - Created Passport Google OAuth strategy
   - ✅ `src/routes/authRoute.ts` - Added Google OAuth routes
   - ✅ `src/app.ts` - Initialized Passport middleware
   - ✅ `.env.example` - Added environment variables template

## Next Steps

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Configure consent screen if prompted
   - Application type: **Web application**
   - Name: Your app name (e.g., "Vegist App")

5. Add Authorized Redirect URIs:
   - **Development:** `http://localhost:8000/api/auth/google/callback`
   - **Production:** `https://your-domain.com/api/auth/google/callback`

6. Copy your **Client ID** and **Client Secret**

### 2. Update Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then update these values:
```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
FRONTEND_URL=http://localhost:4200
```

### 3. Backend API Endpoints

Your backend now has these endpoints:

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Google OAuth callback handler
- `POST /api/auth/register` - Traditional email/password registration (existing)
- `POST /api/auth/login` - Traditional email/password login (existing)

### 4. Angular Frontend Implementation

#### Step 1: Add Google Sign-In Button to Login Component

**login.component.html:**
```html
<div class="login-container">
  <!-- Your existing email/password form -->
  <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
    <!-- existing form fields -->
  </form>

  <!-- Divider -->
  <div class="divider">
    <span>OR</span>
  </div>

  <!-- Google Sign-In Button -->
  <button
    type="button"
    class="google-btn"
    (click)="loginWithGoogle()">
    <img src="assets/google-icon.svg" alt="Google">
    Continue with Google
  </button>
</div>
```

#### Step 2: Update Login Component TypeScript

**login.component.ts:**
```typescript
export class LoginComponent {
  // Your existing code...

  loginWithGoogle(): void {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = environment.apiUrl || 'http://localhost:8000';
    window.location.href = `${backendUrl}/api/auth/google`;
  }
}
```

#### Step 3: Create OAuth Callback Component/Handler

**Option A: Create a dedicated callback component:**

```bash
ng generate component auth-callback
```

**auth-callback.component.ts:**
```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  template: '<div class="loading">Authenticating...</div>',
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userId = params['userId'];
      const error = params['error'];

      if (error) {
        console.error('Authentication failed:', error);
        this.router.navigate(['/login'], {
          queryParams: { error: 'Google authentication failed' }
        });
        return;
      }

      if (token && userId) {
        // Store token in localStorage or your auth service
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);

        // Update auth service state
        this.authService.setAuthToken(token);

        // Redirect to dashboard or home
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
```

**Add route to app-routing.module.ts:**
```typescript
const routes: Routes = [
  // Your existing routes...
  { path: 'auth/callback', component: AuthCallbackComponent },
];
```

#### Step 4: Update Auth Service (if needed)

**auth.service.ts:**
```typescript
export class AuthService {
  // Your existing code...

  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
    // Decode token if needed
    // Update user state, etc.
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
```

#### Step 5: Add Styling

**login.component.css:**
```css
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 10px;
  color: #666;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.google-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.google-btn img {
  width: 20px;
  height: 20px;
}
```

### 5. Testing

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. Start your Angular app:
   ```bash
   ng serve
   ```

3. Click "Continue with Google" button
4. You'll be redirected to Google's login page
5. After successful authentication, you'll be redirected back to your app with a token

### 6. Important Notes

- **Existing users:** If a user registers with email/password first, then logs in with Google using the same email, the accounts will be automatically linked
- **New users:** Users who sign in with Google will have their accounts auto-verified (`isAccountVerified: true`)
- **Password:** Google users won't have a password field (it's optional now)
- **Profile photos:** Google profile pictures will be used automatically

### 7. Security Considerations

- Always use HTTPS in production
- Keep your `GOOGLE_CLIENT_SECRET` secure and never commit it to version control
- Add `.env` to your `.gitignore` file
- Validate tokens on protected routes using your existing `verifyToken` middleware
- Consider adding rate limiting to OAuth endpoints

### 8. Production Deployment

When deploying to production:
1. Update Google OAuth redirect URIs in Google Cloud Console
2. Update `FRONTEND_URL` in production environment variables
3. Ensure your backend callback URL matches Google Console settings
4. Use environment-specific configuration in Angular (`environment.prod.ts`)

## Troubleshooting

**Issue:** "Redirect URI mismatch"
- **Solution:** Ensure the callback URL in Google Console exactly matches your backend route

**Issue:** "Cannot read properties of undefined"
- **Solution:** Make sure user profile includes email in Google OAuth scope

**Issue:** Token not being saved
- **Solution:** Check browser console for CORS errors, ensure credentials are included

## Support

For questions or issues, refer to:
- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
