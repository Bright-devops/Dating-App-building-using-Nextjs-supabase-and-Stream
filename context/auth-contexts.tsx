"use client";
import { User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useContext } from "react";
import { useRouter } from "next/navigation"; // ADD THIS IMPORT

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function Authprovider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const supabase = createClient();
    const router = useRouter(); // ADD THIS

    useEffect(() => {
        async function checkUser() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
                console.log(session?.user);
            } catch (error) {
                console.error('Error fetching session:', error);
            } finally {
                setLoading(false);
            }
        }
        
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function signOut() {
        try {
            await supabase.auth.signOut();
            setUser(null);
            router.push('/'); // ADD THIS - Redirects to home page
            router.refresh(); // ADD THIS - Refreshes the page to clear any cached data
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an Authprovider');
    }
    return context;
};