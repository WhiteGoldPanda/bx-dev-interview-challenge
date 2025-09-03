import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type SafeUser = { id: string; email: string };

@Injectable()
export class AuthService {
  // Demo user. Replace with DB lookup & hashed passwords in real apps.
  private users = [
    { id: 'u1', email: 'test@example.com', password: 'Pass123' },
  ];

  constructor(private jwt: JwtService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(email: string, password: string): Promise<SafeUser> {
    const u = this.users.find(
      (x) => x.email === email && x.password === password,
    );
    if (!u) throw new UnauthorizedException('Invalid credentials');
    return { id: u.id, email: u.email };
  }

  issueToken(user: SafeUser) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwt.sign(payload),
      user: { email: user.email, sub: user.id },
    };
  }
}
