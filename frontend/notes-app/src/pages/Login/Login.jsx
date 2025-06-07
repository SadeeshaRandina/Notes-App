import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'

const Login = () => {
  return (
    <>
      <Navbar/>

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={() => {}}>
            <h4 className="text-2xl mb-7 font-semibold">Login</h4>

            <input type="text" placeholder="Email" className="input-box"/>

            <PasswordInput/>

            <button type="submit" className="btn-primary">Login</button>

            <p className="text-sm text-center mt-4 font-semibold" >
              Not registered yet? {" "}
              <Link to="/signup" className="text-blue-500 underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login