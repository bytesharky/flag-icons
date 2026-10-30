export async function middleware(context) {
  const res = await context.next();
  return new Response(res.body, {
    status: 404,
    statusText: 'Not Found',
    headers: res.headers,
  });
}

export const config = {
  matcher: ['/404.html'],
};
