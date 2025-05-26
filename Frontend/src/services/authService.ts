import { authApi } from '../lib/api/authApi';
import { LoginInput, LoginResponse, User } from '../types';


export const login = async (credentials: LoginInput): Promise<{ userType: string }> => {
    const { data } = await authApi.post<LoginResponse>('/auth/login', credentials);
    return { userType: data.userType };
};

export const getSession = async (): Promise<User> => {
    const { data } = await authApi.get("/auth/me")
    return data;
}

export const logout = async () => {
    await authApi.post("/auth/logout")
}