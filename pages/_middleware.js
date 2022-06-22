import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // we are checking if the user is authenticated or not through the req and through the jwt secret.
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;
  // we catch the request

  // Allow the request if the following is true
  //1. if it requests for next-auth session endpoint then allow it
  //2.  if token exists

  if (pathname.includes("api/auth") || token) {
    // if the token exists then we allow the request and continue to homepage

    return NextResponse.next();
  }
  //    if the token doesn't exist then we redirect to the login page
  
      if(!token && pathname!=='/login'){
        const url = req.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.rewrite(url)
   
      }
  


}

// middleware is a function that runs between request and response. In this project, if the user is not logged in, they will be redirected to the login page and if the user is logged in, then it the token gets checked and will be redirected to the homepage.
