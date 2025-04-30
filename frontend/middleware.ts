import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define route protection rules here:
const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isBuyerRoute = createRouteMatcher(['/buyer(.*)'])
const isSellerSignUpRoute = createRouteMatcher(['/seller/store/create'])
const isSellerRoute = createRouteMatcher(['/seller(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Fetch the user's role from the session claims
  const userRole = (await auth()).sessionClaims?.metadata?.role

  // The logic here is to make sure that a user with a certain role can only access certain routes
  // For example, if the user is an admin, they can access only admin routes
  // If the user is a buyer, they can only access buyer routes
  // If the user is a seller, they can only access seller routes and buyer routes
  // If the user is not logged in, they can only access public routes
  // Please submit PRS by the morning!

  switch (userRole) {
    case 'admin':
      // admin user trying to access admin routes
      if (isAdminRoute(req)) {
        return NextResponse.next()
      }
      // admin user trying to access buyer or seller routes
      if (isBuyerRoute(req)|| isSellerRoute(req)) {
        const url = new URL('/admin/home', req.url)
        console.log('An admin cannot access buyer or seller routes. Redirecting ...:', url)
        return NextResponse.redirect(url)
      }
      break
    case 'buyer':
      if (isBuyerRoute(req)) {
        return NextResponse.next()
      }
      if (isSellerSignUpRoute(req))
      {
        return NextResponse.next()
      }
      if (isAdminRoute(req) || isSellerRoute(req)) {
        const url = new URL('/buyer/home', req.url)
        console.log('A buyer cannot access admin or seller routes. Redirecting ...:', url)
        return NextResponse.redirect(url)
      }
      break
      
    case 'seller':
      // TODO: seller user trying to access seller routes
      if (isSellerSignUpRoute(req))
      {
        const url = new URL('/seller/dashboard', req.url)
        console.log('A seller cannot create more than one store Redirecting ...:', url)
        return NextResponse.redirect(url)
      }
      if (isSellerRoute(req)) {
        return NextResponse.next();
      }
      // TODO: seller user trying to access admin routes
      if (isAdminRoute(req)) {
        const url = new URL('/seller/dashboard', req.url)
        console.log('A seller cannot access admin routes. Redirecting ...:', url)
        return NextResponse.redirect(url)
      }
      break
    default:
      // user is not logged in
      if (isAdminRoute(req)|| isBuyerRoute(req)|| isSellerRoute(req)) {
        const url = new URL('/', req.url)
        console.log('An unauthenticated user cannot access admin, buyer or seller routes. Redirecting ...:', url)
        return NextResponse.redirect(url)
      }
      break
    };
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}