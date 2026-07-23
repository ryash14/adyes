/**
 * Authentication Service
 * Clean abstraction over Firebase Auth
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userService } from './user.service';

class AuthService {
  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    this.githubProvider = new GithubAuthProvider();
  }

  /**
   * Register with Email and Password
   */
  async registerWithEmail(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const oauthResult = await this.handleOAuthResult(result);
      return oauthResult;
    } catch (error) {
      console.error('Registration error:', error);
      return { user: null, error: this.handleAuthError(error) };
    }
  }

  /**
   * Login with Email and Password
   */
  async loginWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: this.handleAuthError(error) };
    }
  }

  /**
   * Sign in with Google (popup-based — no page reload)
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const oauthResult = await this.handleOAuthResult(result);
      return oauthResult;
    } catch (error) {
      console.error('Google sign in error:', error);
      
      if (error.code === 'auth/configuration-not-found') {
        return { 
          user: null,
          error: 'Google Sign-In is not configured. Please enable it in Firebase Console under Authentication > Sign-in method > Google.' 
        };
      }
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return { user: null, error: null }; // User cancelled — not an error
      }
      
      return { user: null, error: this.handleAuthError(error) };
    }
  }

  /**
   * Sign in with GitHub (popup-based — no page reload)
   */
  async signInWithGithub() {
    try {
      const result = await signInWithPopup(auth, this.githubProvider);
      const oauthResult = await this.handleOAuthResult(result);
      return oauthResult;
    } catch (error) {
      console.error('GitHub sign in error:', error);
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        return {
          user: null,
          error: 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.'
        };
      }
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        return { user: null, error: null }; // User cancelled — not an error
      }
      
      return { user: null, error: this.handleAuthError(error) };
    }
  }

  /**
   * Handle the result of a popup sign-in
   */
  async handleOAuthResult(result) {
    if (!result || !result.user) return { user: null, error: null };

    const user = result.user;
    
    try {
      // Check if user document exists, create if not
      const userDoc = await userService.getUser(user.uid);
      if (!userDoc.data) {
        const isGithub = result.providerId === 'github.com' || user.providerData[0]?.providerId === 'github.com';
        
        await userService.createUser(user.uid, {
          email: user.email || (isGithub ? `${user.providerData[0].uid}@github.com` : ''),
          displayName: user.displayName || (isGithub && result.user.reloadUserInfo?.screenName ? result.user.reloadUserInfo.screenName : user.email),
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        });
      } else if (user.photoURL && userDoc.data.photoURL !== user.photoURL) {
        await userService.updateUser(user.uid, {
          photoURL: user.photoURL,
        });
      }

      return { user, error: null };
    } catch (error) {
      console.error('OAuth result handling error:', error);
      return { user: null, error: this.handleAuthError(error) };
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      await firebaseSignOut(auth);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: this.handleAuthError(error) };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: this.handleAuthError(error) };
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return auth.currentUser;
  }

  /**
   * Handle Firebase auth errors
   */
  handleAuthError(error) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/popup-closed-by-user': 'Sign in cancelled',
      'auth/cancelled-popup-request': 'Sign in cancelled',
      'auth/configuration-not-found': 'Google Sign-In not configured. Please use email/password.',
      'auth/invalid-credential': 'Invalid email or password',
    };

    return errorMessages[error.code] || error.message || 'An error occurred';
  }
}

export const authService = new AuthService();
export default authService;
