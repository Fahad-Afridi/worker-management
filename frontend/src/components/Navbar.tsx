
'use client' ;

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar(){
    const {user, logout } = useAuth();
    const router = useRouter();

    const handleBack = () =>{
        router.back();
    };

    const handleLogout = () =>{
        logout();
        router.push('/login');
    };

    return(
        <nav>
            <div>
                {/* Left side - Back button + app name */}

                <div>
                    <button onClick={handleBack}>
                    ← Back
                    </button>
                    <span>Worker Management</span>
                </div>

                {/* Right side - user into + logout */}

                <div>
                    {user && (              
                        <span>
                            {user.name} ({user.role})   {/* && for conditional rendaring */}
                        </span>
                    )}   
                    <button onClick={handleLogout}>
                        Logout                    
                    </button>        
                </div>
            </div>
        </nav>
    )
}