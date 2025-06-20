"use client";
  import React, { useState } from 'react';
import styles from "./index.module.css";
import { collection, addDoc } from "firebase/firestore";
import { useRouter} from "next/navigation";
import { db } from '../Firebaseconfig';
import { signIn } from "next-auth/react";

//async function for adding data to firebase
 async function addData(username: string, password: string, email:string): Promise<boolean> {
  try {
    const docRef = await addDoc(collection(db, "Users"), {
      username,
      password,
      email,
    });
    console.log("Successfull!! Document written with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding data", error);
    return false;
  }
}

// Types
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

interface SignUpFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Login form component with form state management and validation
const LogInForm = ({ onSwitch }: { onSwitch: () => void }) => {
  // Form state management
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError("Username and password are required.");
      return;
    }
    const res = await signIn('credentials', {
      redirect: false,

      username: form.username,
      password: form.password,

      
    });
    
  if(res?.ok){
    setForm({
      username: '',
      password: '',
      remember: false,
    });
    setError("");
    router.push('/homePage')
  }else{
 setForm({
      username: '',
      password: '',
      remember: false,
    });
    setError("invalid credentials");
  }
  
  };
  

  return (
    <div className={styles.signupForm}>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div
          style={{
            marginBottom: 18,
            position: "relative",
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <label style={{ display: "none" }}>Username</label>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: 10,
              fontSize: 22,
              color: "#222",
            }}
          >
            👤
          </span>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            style={{ paddingLeft: 48, width: "100%" }}
          />
        </div>
        <div
          style={{
            marginBottom: 18,
            position: "relative",
            maxWidth: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <label style={{ display: "none" }}>Password</label>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: 10,
              fontSize: 22,
              color: "#222",
            }}
          >
            🔒
          </span>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            style={{ paddingLeft: 48, width: "100%" }}
          />
          <span
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: "absolute",
              right: 16,
              top: 10,
              fontSize: 22,
              color: "#222",
              cursor: "pointer",
              userSelect: "none",
            }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 15,
            }}
            htmlFor="remember"
          >
            <input
              type="checkbox"
              name="remember"
              id="remember"
              checked={form.remember}
              onChange={handleChange}
              style={{ marginRight: 8 }}
            />
            Remember me
          </label>
          <span className={styles.forgotPassword}>Forgot Password?</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.footer}>
          <span>
            Don't have an account?{" "}
            <a
              href="#"
              style={{ color: "#e0c58f", textDecoration: "underline" }}
              onClick={onSwitch}
            >
              Sign Up
            </a>
          </span>
        </div>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

// Sign up form component with form state management and validation
const SignUpForm = ({ onSwitch }: { onSwitch: () => void }) => {
  // Form state management
  const [form, setForm] = useState<SignUpFormState>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    //calling addData function to store user newly created accounts
    const success = await addData(form.username, form.password,form.email);

    if(success){
      setForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

   
    setError("Sign up successful!");
    
    }else{
      setForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
      setError("failed to sign up");
    }
  };
 

  return (
    <div className={styles.signupForm}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={{ marginBottom: 18 }}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>
        <div className={styles.row} style={{ marginBottom: 18 }}>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
            />
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.footer}>
          <span>
            Already have an account?{" "}
            <a
              href="#"
              style={{ color: "#e0c58f", textDecoration: "underline" }}
              onClick={onSwitch}
            >
              Login
            </a>
          </span>
        </div>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

// Main authentication page component that handles switching between login and signup forms
const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className={styles.background}>
      <div className={styles.signupContainer}>
        <div className={styles.treeLogo}></div>
        {showLogin ? (
          <LogInForm onSwitch={() => setShowLogin(false)} />
        ) : (
          <SignUpForm onSwitch={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
