import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { config } from "dotenv";

config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      callbackURL: `https://roomly-3xwk.vercel.app/auth/google/callback`,
      scope: ["email", "profile"], // Add scope here in the strategy configuration
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as any);
});

export default passport;