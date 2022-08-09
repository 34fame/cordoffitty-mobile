import * as jose from 'jose'

export const decodeJwt = (token) => {
   return jose.decodeJwt(token)
}