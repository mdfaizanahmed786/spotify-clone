import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import {RecoilRoot} from 'recoil'

function MyApp({ Component, pageProps:{session, ...pageProps} }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
      <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
// whenever we use login/logout state in react we need to persist the state. Hence to manage that we wrap the login/logout state in a session provider.
// Session provider is a higher order component that wraps the component and provides the session state.
// recoil is the state management library for react. it is just similar to redux.
// We need to wrap the component in a recoil root.
// it contains atoms which are just similar to the slices in redux.
// it also contains the state management logic.


// we can store the playlist id in the localstate, but we need to uplift the state hence we are using recoil.
