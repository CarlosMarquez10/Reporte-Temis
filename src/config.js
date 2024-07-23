import dotenv from 'dotenv';

dotenv.config();
export const PORT = process.env.PORT || 3000;
export const User = process.env.User;
export const Password = process.env.Password;
export const UserCorreo = process.env.UserCorreo;