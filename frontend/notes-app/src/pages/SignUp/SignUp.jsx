import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useState } from 'react'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post('/create-account', {
        fullName: name,
        email: email,
        password: password
      });

      if (response.status && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate("/dashboard");
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while signing up. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#b6dec4] via-[#a2d1b5] to-[#8ec4a6] px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl px-10 py-12 transition-transform transform hover:scale-[1.01] duration-300 ease-in-out">
          <form onSubmit={handleSignUp}>
            <h4 className="text-3xl font-bold text-center text-[#1a3e2d] mb-8">
              Create Your Account
            </h4>

            <input 
              type="text" 
              placeholder="Name" 
              className="w-full px-4 py-3 mb-4 text-sm bg-[#f1f9f5] border border-[#bddfc6] rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input 
              type="text" 
              placeholder="Email" 
              className="w-full px-4 py-3 mb-4 text-sm bg-[#f1f9f5] border border-[#bddfc6] rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputClassName="bg-[#f1f9f5] border border-[#bddfc6] text-gray-800 placeholder-gray-500 focus:ring-green-500"
            />

            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}

            <button
              type="submit"
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-green-700 to-emerald-800 text-white font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300"
            >
              Create Account
            </button>

            <p className="text-sm text-center mt-6 text-gray-600 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 underline hover:text-emerald-500 transition-all duration-300">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp
