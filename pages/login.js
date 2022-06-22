/* eslint-disable @next/next/no-img-element */
import React from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

const login = ({ providers }) => {
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-pink-700 min-h-screen flex flex-col items-center justify-center gap-44 ">
      <Head>
        <title>Spotify Login</title>
      </Head>
      <div className="flex gap-4 items-center justify-center mr-2">

      <Image src="https://i.imgur.com/fPuEa9V.png" alt="logo"  width={80} height={80} />
        <h1 className="text-white font-bold text-4xl">Spotify</h1>
         
      </div>
      <div className="hero flex flex-col gap-1">
        <h2 className="text-3xl text-white font-bold">Millions of songs.</h2>
        <h2 className="text-3xl text-white font-bold">Free on Spotify.</h2>
      </div>
      {/* will return array of providers which contain only values, if entries are passed then both keys and values are returned */}
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          {/* singin with provider and it redirects to a callback url to homepage */}
          <button className="bg-[#18D860] md:px-24 px-20 font-bold py-2  text-lg hover:bg-green-600 rounded-full text-white " onClick={()=>signIn(provider.id, {callbackUrl:"/"})}> Login with {provider.name}</button>
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