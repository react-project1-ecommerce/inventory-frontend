import { useState } from 'react';

import axios from 'axios';

const Login = () => {

  const [email,setEmail] = useState('');

  const [password, setPassword]= useState('');

  const handleLogin = async(e)=>{

      e.preventDefault();  // prevents page refresh

      try{

      alert('here');
      alert(email);
      alert(password);

      //res is axios response object

      const res = await axios.post('http://localhost:3000/api/users/signIn',
                           {email,password},
                           {withCredentials: true,}   //tells Axios to allow cookies to be sent/received with this request.
                           );

      alert(JSON.stringify(res.data));

      }
      catch(err){

         //console.log(err.response?.data);  

       console.log("ERROR:", err); //if network error that means the react app is not recieving a HTTP response from localhost:3000

       console.log("MESSAGE:", err.message);

      }




  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin}>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;