import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiXCircle } from "react-icons/fi"; // Import the cross icon from react-icons library

function PaymentFailure() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []); // Run only once on component mount

  const currentUser = useSelector(
    (state) => state?.user?.currentUser?.data?.user
  );

  useEffect(() => {
    // Once the component mounts or email/password changes, set imageLoaded to true to trigger the fade-in effect
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]);

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 z-50 bg-black bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex justify-center min-h-screen bg-pink-50">
        <div
          className={`p-4 bg-white mt-10 rounded-lg shadow-md w-full lg:w-1/2 flex flex-col justify-center items-center h-1/3 transition-transform duration-500 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-center mb-6 text-red-500">
            <FiXCircle className="text-4xl mr-2 animate-pulse" />{" "}
            {/* Red cross icon */}
            <h1 className="text-2xl font-semibold">Payment Unsuccessful</h1>
          </div>
          <p className="mb-5">
            We're sorry, but it seems your payment was unsuccessful. Please try
            again or explore other payment options.
          </p>

          <button className="mt-4 bg-pink-300 text-white hover:bg-pink-400 px-4 py-2 rounded-md">
            Try Again
          </button>
          <button className="mt-4 bg-pink-300 text-white hover:bg-pink-400 px-4 py-2 rounded-md">
            Find Me a Match!
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailure;
