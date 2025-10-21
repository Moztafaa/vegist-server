import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if email already exists (linked to local account)
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.authProvider = "google";
            // Update profile photo if user has default photo
            if (
              !user.profilePhoto?.url ||
              user.profilePhoto?.url.includes("blank-profile-picture")
            ) {
              user.profilePhoto = {
                url:
                  profile.photos?.[0]?.value ||
                  user.profilePhoto.url ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
                publicId: null,
              };
            }
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        user = new User({
          googleId: profile.id,
          username: profile.displayName || "Google User",
          email: email,
          authProvider: "google",
          isAccountVerified: true, // Auto-verify Google users
          profilePhoto: {
            url:
              profile.photos?.[0]?.value ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
            publicId: null,
          },
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error as Error, false);
      }
    }
  )
);

export default passport;
