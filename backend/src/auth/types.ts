export type JwtPayload = {
  sub: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  description: string | null;
  photoUrl: string | null;
  birthDate: string | null;
  createdAt: string;
};
