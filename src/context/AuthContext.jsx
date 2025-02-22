import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from "firebase/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register User
    const registerUser = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            setCurrentUser({ ...userCredential.user, displayName: name });
            return userCredential;
        } catch (error) {
            console.error("Registration Error:", error.message);
            throw new Error(error.message);
        }
    };

    // Login User
    const loginUser = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            console.error("Login Error:", error.message);
            throw new Error(error.message);
        }
    };

    // Google Sign-in
    const signInWithGoogle = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;

            // Ensure displayName is set
            if (!user.displayName) {
                const defaultName = user.email.split("@")[0]; // Use email prefix as default name
                await updateProfile(user, { displayName: defaultName });
                setCurrentUser({ ...user, displayName: defaultName });
            }

            return userCredential;
        } catch (error) {
            console.error("Google Sign-in Error:", error.message);
            throw new Error(error.message);
        }
    };

    // Logout User
    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout Error:", error.message);
            throw new Error(error.message);
        }
    };

    // Track authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = { currentUser, loading, registerUser, loginUser, signInWithGoogle, logout };

    if (loading) return null; // Prevent rendering before auth state is resolved

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
