export interface TokenPayload {
  sub:         string;
  authorities: string;
  userId:      number;
  exp:         number;
  iat:         number;
  iss?:        string;
  jti?:        string;
  nbf?:        number;
}
