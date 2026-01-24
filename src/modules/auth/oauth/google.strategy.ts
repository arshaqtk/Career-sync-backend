import { ENV } from "../../../config/env";
import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

passport.use(
  new GoogleStrategy(
    
    {
      clientID: ENV.GOOGLE_CLIENT_ID!,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/api/auth/google/callback",  
    },
    async (_, __, profile, done) => {
      try {
        console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET?.slice(0, 6));
        const payload = {
          email: profile.emails?.[0].value!,
          name: profile.displayName,
          profilePictureUrl: profile.photos?.[0].value,
          provider: "google",
          providerId: profile.id,
        }
        console.log("called")
        return done(null, payload)
      } catch (err) {
        return done(err, undefined)
      }
    }
  )
)
