import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { LOGIN_URL } from "../../../lib/spotify";


async function refreshAccessToken(token) {
  // this function gets called when the accesstoken has expired
  try {
    const url =
      "https://accounts.spotify.com/api/token?" +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization:LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  // creating a custom login page rather than nextjs default login page
  pages: {
    signIn: "/login"
  },
  // now we need to provide the callbacks that handle authorization and send us accesstoken and the refresh token
  // this is where we will be handling the authorization and sending the access token to the server
  callbacks: {
    async jwt({ token, account, user }) {
      // first is the  initialSignIn, which is the first time the user is signing in
       
      if (account && user) {
        // returning the access and refresh token
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      // return the previous access token if it hasn't expired
      if (token.accessTokenExpires > Date.now()) {
        return token;
      }

      // now refresh the access token if it has expired
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // if the user is logged in, we will return the user data
      // if the user is on the client side and is logged in then it will return the user data.
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
     
      return session;
    },
  },
});

// what is the accesstoken?
// accesstoken is the token that is used to access the spotify api and gives bunch of amount of information the username and various other features that a spotify user can access after logging in.

// What is refreshToken?
// refreshToken is the token that is used to refresh the access token after the accesstoken has expired. refreshtoken does not expire.

// authorization handles the login state and other features to login and logout.
