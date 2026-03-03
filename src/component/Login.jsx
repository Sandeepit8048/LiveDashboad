import React, { useState, useEffect } from "react";

function Login() {
  const [logindata, setLogindata] = useState({
    user: "",
    password: "",
  });

  const[checked, setChecked] = useState();

  const [store, setStore] = useState(() => {
    const save = localStorage.getItem("store");
    return save ? JSON.parse(save) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("store", JSON.stringify(store));
  }, [store]);

  function handleChange(e) {
    const { name, value } = e.target;

    setLogindata({
      ...logindata,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const updatestore = [...store, logindata];
    setStore(updatestore);

    // Reset form
    setLogindata({
      user: "",
      password: "",
    });
  }

  return (
    <div className="sm:min-h-screen sm:flex sm:flex-col sm:items-center sm:justify-center bg-gradient-to-r from-red-100 to-yellow-100">

      {/* Login Card */}
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-sm">

        <h2 className="sm:text-2xl font-bold text-center mb-5 text-gray-800">
          Create-Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>

            <input
              type="text"
              name="user"
              placeholder="Enter username"
              onChange={handleChange}
              value={logindata.user}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="******"
              onChange={handleChange}
              value={logindata.password}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
              <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Accept Terms
      </label>
            <input type="chechbox" required />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          >
            Create-Account
          </button>

        </form>
      </div>

      {/* Stored Users */}
      {store.length > 0 && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-4 w-full max-w-sm">

          <h3 className="text-lg font-bold text-center mb-3">
            Saved Users
          </h3>

          {store.map((e, id) => (
            <div
              key={id}
              className="border-b last:border-none py-2 text-sm"
            >
              <p>
                <span className="font-semibold">Username:</span>{" "}
                {e.user}
              </p>

              <p>
                <span className="font-semibold">Password:</span>{" "}
                {e.password}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Login;