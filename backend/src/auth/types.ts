export type JwtPayload = {
  sub: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};
