import { useState, useEffect } from "react";
import { PiArrowLeft, PiEnvelopeDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update errors on change
    setErrors({
      ...errors,
      [name]: value ? "" : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
    });
  };

  const isFormValid = formData.email && !errors.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!formData.email) {
      setErrors({ email: "Email address is required" });
      return;
    }
  
    setIsSubmitting(true);
    setErrors({ email: "" }); // Clear previous errors
  
    try {
      const response = await fetch("https://e-sdg.onrender.com/create/forgetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
  
      if (response.ok) {
        setShowModal(true); // Show success modal
      } else {
        const result = await response.json().catch(() => null);
        setErrors({ email: result?.message || "No account registered with this email." });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ email: "An error occurred. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="px-6 py-16 md:px-10 lg:px-20 justify-start md:justify-center"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(-1)}
        className="font-bold flex flex-row items-center space-x-1 border border-black p-2 rounded-md mb-6 cursor-pointer max-w-20"
      >
        <PiArrowLeft />
        <span>Back</span>
      </motion.div>

      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold"
      >
        Reset Password
      </motion.h2>
      
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500"
      >
        Enter the email you registered with and we'll send instructions to recover your account
      </motion.p>

      <form className="mt-6 w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
        <fieldset className="space-y-1 flex flex-col items-start justify-start">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full rounded-md border border-gray-500/50 text-sm py-3 px-3 outline-none focus:border-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out"
            required
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.email}
            </motion.p>
          )}
        </fieldset>

        <motion.button
          whileHover={!isSubmitting && isFormValid ? { scale: 1.01 } : {}}
          whileTap={!isSubmitting && isFormValid ? { scale: 0.99 } : {}}
          type="submit"
          className={`mt-2 py-3 rounded-full text-white w-full text-center cursor-pointer flex items-center justify-center ${
            isSubmitting || !isFormValid ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary"
          }`}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className={`rounded-full h-6 w-6 border-b-2 ${
                  isSubmitting ? "border-b-deepBlue" : "border-b-white"
                }`}
              ></motion.div>
              <span>Sending Email...</span>
            </div>
          ) : (
            "Send Email"
          )}
        </motion.button>
      </form>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white p-8 rounded-lg text-center max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <PiEnvelopeDuotone className="text-6xl text-deepBlue" />
              </motion.div>
              <h3 className="text-2xl font-bold mt-4">Email Sent</h3>
              <p className="text-gray-600 mt-2">
                We've sent an email to <strong>{formData.email}</strong>. Please follow the instructions in the email to reset your password.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-blue-700 transition-colors duration-300"
                onClick={() => setShowModal(false)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ForgotPassword;