import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateSubscription } from "../redux/apiCalls/apiCalls";
import { useDispatch, useSelector } from "react-redux";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const completeUser = useSelector((state) => state?.user?.currentUser);

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
    validateSubscription(dispatch, completeUser);
  }, []);

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 z-50 bg-black bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex justify-center min-h-screen bg-rose-50">
        <div
          className={`p-4 bg-white mt-10 rounded-lg shadow-md w-full lg:w-1/2 flex flex-col justify-center items-center h-1/3 transition-transform duration-500 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <h1 className="text-2xl mb-4 font-semibold">Payment Successful</h1>
          <p className="mb-5">
            Congratulations! Your payment was successful. Enjoy your premium
            membership benefits!
          </p>
          <p>
            As a premium member, you'll get:
            <ul className="list-disc ml-8">
              <li>Access to exclusive content</li>
              <li>Priority support</li>
              <li>And much more!</li>
            </ul>
          </p>
          <button
            className="mt-4 bg-rose-300 px-4 py-2 rounded-md text-white hover:bg-rose-400 transition-colors duration-300"
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
