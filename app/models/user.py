from pydantic import BaseModel, EmailStr
from datetime import datetime


class User(BaseModel):
  id: int
  email: EmailStr
  login: str
  password: str
  createdAt: datetime
  updatedAt: datetime