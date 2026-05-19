
'use client';

import { createContext, useContext, useState,useEffect,ReactNode } from 'react';


//login user object shape defines here..

interface User{
    id: number;
    uniqueId : string;
    name : string;
    email: string;
    country: string;
    role: 'admin' | 'worker';
}

interface AuthContextType{
    user: User | null;
    token: string | null;
    login: (token: string, refreshToken: string, user: User) => void;
    logout: ()=> void;
    isLoading: boolean;
}
// global state is undefind before the app runnig,
const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export function AuthProvider ({ children}: { children: ReactNode}){
        const [user, setUser] = useState<User | null>(null);
        const [token, setToken] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser){
            setToken (storedToken);
            setUser (JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, refreshToken: string, user: User)=>{
        localStorage.setItem('access_token',token);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, token, login, logout, isLoading}}>
        {children}
        </AuthContext.Provider>
    );

}
//custom hook
export function useAuth(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error ('useAuth must be used inside AuthProvider')
    }
    return context;
}
