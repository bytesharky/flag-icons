// export async function middleware(context) {
//   const res = await context.next();
//   return new Response(res.body, {
//     status: 404,
//     statusText: 'Not Found',
//     headers: res.headers,
//   });
// }
// 测试上面的改状态码不行，那就重写到不存在的路径
export function middleware(context) {
    return context.rewrite('/not-found-path');
}

export const config = {
  matcher: ['/404.html'],
};
