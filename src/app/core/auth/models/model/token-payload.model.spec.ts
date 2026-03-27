import { TokenPayload } from "./token-payload.model";



describe('TokenPayload Model', () => {
  it('debe crear un TokenPayload válido', () => {
    const payload: TokenPayload = {
      sub:         'test@gmail.com',
      authorities: 'ADMIN',
      userId:      1,
      exp:         9999999999,
      iat:         1000000000
    };

    expect(payload.sub).toBe('test@gmail.com');
    expect(payload.authorities).toBe('ADMIN');
    expect(payload.userId).toBe(1);
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  it('debe permitir roles CLIENT y SELLER', () => {
    const client: TokenPayload = {
      sub: 'client@gmail.com', authorities: 'CLIENT',
      userId: 2, exp: 9999999999, iat: 1000000000
    };
    const seller: TokenPayload = {
      sub: 'seller@gmail.com', authorities: 'SELLER',
      userId: 3, exp: 9999999999, iat: 1000000000
    };

    expect(client.authorities).toBe('CLIENT');
    expect(seller.authorities).toBe('SELLER');
  });
});
