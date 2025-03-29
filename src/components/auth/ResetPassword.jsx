import { useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaXmark, FaCheck } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    passwordVisible: false,
    confirmPasswordVisible: false,
  });

  const [passwordConditions, setPasswordConditions] = useState({
    minLength: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams(); // Extract token from URL params

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate fields on change
    if (name === "password") {
      validatePassword(value);
      setErrors((prev) => ({ ...prev, password: "" }));
    } else if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const validatePassword = (password) => {
    setPasswordConditions({
      minLength: password.length >= 8,
      upper: /(?=.*[A-Z])/.test(password),
      lower: /(?=.*[a-z])/.test(password),
      number: /(?=.*\d)/.test(password),
      special: /(?=.*[!@#$%*?&._])/.test(password),
    });
  };

  const isPasswordValid =
    passwordConditions.minLength &&
    passwordConditions.upper &&
    passwordConditions.lower &&
    passwordConditions.number &&
    passwordConditions.special;

  const isFormValid =
    isPasswordValid &&
    formData.password &&
    formData.confirmPassword === formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for errors before submitting
    const newErrors = {
      password: formData.password ? "" : "Password is required",
      confirmPassword: formData.confirmPassword === formData.password ? "" : "Passwords do not match",
    };

    setErrors(newErrors);

    if (isFormValid) {
      setIsSubmitting(true);

      try {
        const response = await fetch(`https://e-sdg.onrender.com/create/reset-password/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword: formData.password }),
        });

        if (response.ok) {
          // If the API call is successful, navigate to the login page
          navigate("/auth/login");
        } else {
          // Handle API errors
          const result = await response.json();
          setErrors((prev) => ({ ...prev, password: result.message || "Failed to reset password. Please try again." }));
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors((prev) => ({ ...prev, password: "An error occurred. Please try again later." }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="px-10 py-16 md:px-16 lg:px-20 w-full flex flex-col justify-start md:justify-center">
      <div
        onClick={() => navigate(-1)}
        className="font-bold flex flex-row items-center space-x-1 border border-black p-2 rounded-md mb-6 cursor-pointer max-w-20"
      >
        <FaArrowLeft />
        <span>Back</span>
      </div>
      <h2 className="text-2xl font-bold">Create New Password</h2>
      <p className="text-gray-500">Create new password and ensure to keep it safe</p>

      <form className="mt-6 w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
        {/* Password Field */}
        <fieldset className="space-y-1 flex flex-col items-start justify-start">
          <label htmlFor="password">Password</label>
          <div className="relative w-full">
            <input
              type={formData.passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              className="w-full rounded-md border border-gray-500/50 text-sm py-3 px-3 outline-none focus:border-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out"
              required
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, passwordVisible: !formData.passwordVisible })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {formData.passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {/* Password Conditions */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm flex border items-center gap-2 ${
                passwordConditions.minLength
                  ? "bg-green-100 text-green-700 border border-green-500"
                  : "bg-red-100 text-red-700 border-red-400"
              }`}
            >
              Minimum 8 characters
              {passwordConditions.minLength ? <FaCheck /> : <FaXmark />}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 ${
                passwordConditions.upper
                  ? "bg-green-100 text-green-700 border-green-500"
                  : "bg-red-100 text-red-700 border-red-400"
              }`}
            >
              1 Upper letter
              {passwordConditions.upper ? <FaCheck /> : <FaXmark />}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm border flex items-center gap-2 ${
                passwordConditions.lower
                  ? "bg-green-100 text-green-700 border-green-500"
                  : "bg-red-100 text-red-700 border-red-400"
              }`}
            >
              1 Lowercase letter
              {passwordConditions.lower ? <FaCheck /> : <FaXmark />}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm flex border items-center gap-2 ${
                passwordConditions.number
                  ? "bg-green-100 text-green-700 border-green-500"
                  : "bg-red-100 text-red-700 border-red-400"
              }`}
            >
              <span>1 Number </span>
              {passwordConditions.number ? <FaCheck /> : <FaXmark />}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm flex border items-center gap-2 ${
                passwordConditions.special
                  ? "bg-green-100 text-green-700 border-green-500"
                  : "bg-red-100 text-red-700 border-red-400"
              }`}
            >
              <span>1 Special character</span>
              {passwordConditions.special ? <FaCheck /> : <FaXmark />}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </fieldset>

        {/* Confirm Password Field */}
        <fieldset className="space-y-1 flex flex-col items-start justify-start">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="relative w-full">
            <input
              type={formData.confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your Password"
              className="w-full rounded-md border border-gray-500/50 text-sm py-3 px-3 outline-none focus:border-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out"
              required
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, confirmPasswordVisible: !formData.confirmPasswordVisible })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {formData.confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          className={`mt-2 py-3 rounded-full text-white w-full text-center cursor-pointer flex items-center justify-center ${
            isSubmitting || !isFormValid ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
          }`}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Resetting Password...</span>
            </div>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;