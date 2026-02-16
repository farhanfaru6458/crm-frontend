
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('crm_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login - in a real app this would verify credentials
        // For now, we will check if there is a registered user matching the email
        const registeredUser = localStorage.getItem('crm_registered_user');

        if (registeredUser) {
            const parsedUser = JSON.parse(registeredUser);
            if (parsedUser.email === email && parsedUser.password === password) {
                setUser(parsedUser);
                localStorage.setItem('crm_user', JSON.stringify(parsedUser));
                return { success: true };
            }
        }

        // Fallback Mock User for testing if no registration has happened
        if (email === "demo@example.com" && password === "password") {
            const demoUser = { firstName: "Demo", lastName: "User", email: "demo@example.com" };
            setUser(demoUser);
            localStorage.setItem('crm_user', JSON.stringify(demoUser));
            return { success: true };
        }

        return { success: false, error: "Invalid email or password" };
    };

    const register = (userData) => {
        // Save minimal user data for session
        // In a real app this would POST to backend
        // We will save to a 'registered_user' key to simulate a "database"
        localStorage.setItem('crm_registered_user', JSON.stringify(userData));

        // Auto login after register? Or require login?
        // Let's auto login for better UX
        setUser(userData);
        localStorage.setItem('crm_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('crm_user');
    };

    const updateUser = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('crm_user', JSON.stringify(newUser));

        // Also update registered user if it matches, to persist changes across login/logout
        const registeredUser = localStorage.getItem('crm_registered_user');
        if (registeredUser) {
            const parsedRegistered = JSON.parse(registeredUser);
            if (parsedRegistered.email === user.email) {
                const newRegistered = { ...parsedRegistered, ...updatedData };
                localStorage.setItem('crm_registered_user', JSON.stringify(newRegistered));
            }
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
