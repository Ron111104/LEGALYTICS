import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    sendEmailVerification, 
    signInWithPopup, 
    signOut 
  } from "firebase/auth";
  import { auth, googleProvider } from "./firebaseConfig";
  
  // Sign up with email & password
  export const signUp = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user); // ✅ Send verification email
    return userCredential.user;
  };
  
  // Sign in with email & password (only if verified)
  export const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    if (!user.emailVerified) {
      throw new Error("Email not verified. Please check your inbox.");
    }
  
    return user;
  };
  
  // Google Sign-in
  export const signInWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  };
  
  // Forgot password
  export const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  // Sign out
  export const logout = async () => {
    return signOut(auth);
  };
  