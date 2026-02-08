from pydantic import BaseModel, EmailStr
from typing import Optional


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    middleName: Optional[str] = None
    description: Optional[str] = None
    photoUrl: Optional[str] = None
    birthDate: Optional[str] = None
    createdAt: str


class AuthPayload(BaseModel):
    user: UserOut


class RegisterIn(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UpdateProfileIn(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    middleName: Optional[str] = None
    description: Optional[str] = None
    birthDate: Optional[str] = None


class UploadProfilePhotoIn(BaseModel):
    fileName: str
    base64: str
