// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ry15ry6ao5'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-4g80gb5t.us.auth0.com', // Auth0 domain
  clientId: 'WOO9X5sYNRFdOhZw8NlueMLDF2uo3gC9', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
