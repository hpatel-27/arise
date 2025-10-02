import { useState } from "react";
import { register } from "../services/authService";
import { ToastContainer } from "react-toastify";
import { notify } from "../utils/notify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = [];
    if (password !== confirmPassword) errors.push("Passwords do not match");
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (!email.includes("@")) errors.push("Invalid email format");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Register attempted");
    setIsSubmitting(true);
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => console.error(err));
      setIsSubmitting(false);
      notify(errors.join(". "));
      return;
    }

    try {
      // Register this user with their user
      const data = await register(email, password);
      console.log("Registration data", data);
      notify("Registration successful! Please log in.");
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      // Update error to a pop up with Toast or sweetalert2?
      console.error("Registration failed:", error.message);
      notify(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Pixel art of Sung Jin-Woo's sword"
            src="/src/assets/sword-jin-woo.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign up for an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  autoComplete="new-password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 cursor-pointer shadow-sm transition ease-in-out"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-blue-400 hover:text-blue-500"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Register;
