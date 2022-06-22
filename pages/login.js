/* eslint-disable @next/next/no-img-element */
import React from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import Head from "next/head";

const login = ({ providers }) => {
  
  return (
    <div className="flex flex-col items-center min-h-screen justify-center w-full bg-black">
      <Head>
        <title>Spotify Login</title>
      </Head>
      <img src="https:/links.papareact.com/9xl" alt="logo"  className="w-52 mb-8"/>
      {/* will return array of providers which contain only values, if entries are passed then both keys and values are returned */}
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          {/* singin with provider and it redirects to a callback url to homepage */}
          <button className="bg-[#18D860] p-4 hover:bg-green-600 rounded-full text-white" onClick={()=>signIn(provider.id, {callbackUrl:"/"})}> Login with {provider.name}</button>
        </div>
      ))}
    </div>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
export default login;
// on the login page we are generating the custom scopes that are accessed to the user.