export default {
  // meEndpoint: '/auth/me',


  meEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/get-data`,


  loginEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/admin/signin`,

  // loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
