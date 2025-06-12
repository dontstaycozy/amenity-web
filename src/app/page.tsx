"use client";

import React, { useState, FormEvent } from "react";
import {data} from "./Firebaseconfig"
import { collection, addDoc } from "firebase/firestore";


//function for adding data to database
async function addData(username: string, password: string): Promise<boolean> {
  try {
    const docRef = await addDoc(collection(data, "message"), {
      username,
      password,
    });
    console.log("Successfull!! Document written with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding data", error);
    return false;
  }
}

export default function Home() {
  //variables for the username and password
  const [username, setUser] = useState<string>("");
  const [password, setPass] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const added = await addData(username, password);
    if (added) {
      setUser("");
      setPass("");
      alert("Data added successfully");
    }
  };

  return (
    <main className="flex flex-col gap-8 items-center sm:items-start">
      <h1 className="text-5xl font-bold m-10">Add data to Firebase database</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-gray-700 font-bold mb-2"
          >
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />

          <label
            htmlFor="password"
            className="block text-gray-700 font-bold mt-4 mb-2"
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPass(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Add Account
          </button>
        </div>
      </form>
    </main>
  );
}
