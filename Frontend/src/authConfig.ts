export const authConfig = {
  clientId: 'FitnessAppClient',
  authorizationEndpoint: 'http://localhost:7080/realms/FitnessApp/protocol/openid-connect/auth',
  tokenEndpoint: 'http://localhost:7080/realms/FitnessApp/protocol/openid-connect/token',
  redirectUri: 'http://localhost:5173/',
  scope: 'openid profile email offline_access',
  autoLogin: false, // 👈 Add this line to prevent automatic redirect on refresh
  pkce: true,
  storage: "local", // this ensures tokens go to localStorage
}
