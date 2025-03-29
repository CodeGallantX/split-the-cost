import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const OTPForm = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();
  const { token } = useParams();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state or session storage
    const storedEmail = location.state?.email || sessionStorage.getItem("loginEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate("/auth/verification");
    }
    setCountdown(120); // 2-minute countdown
  }, [location, navigate]);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleChange = (e) => {
    setOtp(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || isNaN(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`https://e-sdg.onrender.com/create/login-session/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "OTP verification failed");
      }

      // Store authentication data
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("userData", JSON.stringify(result.userData));
      
      // Redirect to appropriate dashboard based on role
      const userRole = result.userData?.role?.toLowerCase() || "student";
      navigate(`/${userRole}/dashboard`);
      
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(error.message || "An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      const response = await fetch("https://e-sdg.onrender.com/create/verifyLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sessionStorage.getItem("loginEmail"),
          password: sessionStorage.getItem("loginPassword")
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to resend OTP");
      }

      const result = await response.json();
      if (result.success) {
        setCountdown(120); // Reset countdown
      } else {
        throw new Error(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `Resending in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}s`;
  };

  return (
    <div className="px-6 py-16 md:px-12 w-full flex flex-col justify-center">
      <div
        onClick={() => navigate(-1)}
        className="font-bold flex flex-row items-center space-x-1 border border-black p-2 rounded-md mb-6 cursor-pointer max-w-20"
      >
        <FaArrowLeft />
        <span>Back</span>
      </div>
      <h2 className="text-2xl font-bold">Enter OTP</h2>
      <p className="text-gray-500">
        A 6-digit OTP has been sent to {email}. Please enter it below.
      </p>

      <form className="mt-6 w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
        <fieldset className="space-y-1 flex flex-col items-start justify-start">
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            name="otp"
            id="otp"
            value={otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            className="w-full rounded-md border border-gray-500/50 text-sm py-3 px-3 outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out"
            required
            maxLength={6}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </fieldset>


        <button
          type="submit"
          className={`mt-2 py-3 rounded-full text-white w-full text-center flex items-center justify-center ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify"
          )}
        </button>
        <div className="flex items-center justify-start text-sm text-gray-600 mt-4">
          <span>Didn't receive code?</span>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={countdown > 0 || isResending}
            className={`ml-1 ${
              countdown > 0 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-primary underline cursor-pointer hover:text-primary/80'
            } ${
              isResending ? 'cursor-not-allowed' : ''
            }`}
          >
            {isResending ? "Sending..." : countdown > 0 ? formatCountdown() : "Resend"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OTPForm;