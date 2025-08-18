import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import { storage } from './storage';
import type { Express } from 'express';
import type { User } from '@shared/schema';

export function setupAuth(app: Express) {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'ride-compare-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Passport configuration
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for username/password authentication
  passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username: string, password: string, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        const isValidPassword = await storage.validatePassword(user, password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Serialize user for session storage
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Authentication required' });
}

// Middleware to check if user is not authenticated (for login/signup pages)
export function requireNoAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.status(400).json({ error: 'Already authenticated' });
}