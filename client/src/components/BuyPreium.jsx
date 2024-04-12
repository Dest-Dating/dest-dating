import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { publicRequest } from "../requestMethods";

function BuyPremium() {
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

  // checkout function to initiate payment
  const checkout = async () => {
    try {
      const stripe = await loadStripe(
        "pk_test_51KadArSGLjUHhsp5qbEsOBlbvclSV0Pv8G8wtYqbI9BEG2wf0bTT543DDZI2UMrfX6YNqNW12wD0t83SX30W0gMF00J3vGjze8"
      );

      // const response = await publicRequest.post("/user/buySubscription");
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await fetch(
        "http://localhost:8000/user/buySubscription",
        {
          method: "POST",
          headers: headers,
          credentials: "include",
        }
      );

      const session = await response.json();

      const result = stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 bottom-0 left-0 z-50 bg-black bg-opacity-50 transition-opacity duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 bg-white rounded-lg shadow-md w-full lg:w-1/2 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold mb-4">Upgrade to Premium</h1>
          <p className="mb-5">
            Enjoy exclusive features and content as a premium member! Unlock
            access to high-quality courses, personalized learning paths, and
            priority support.
          </p>
          <p>
            As a premium member, you'll get:
            <ul className="list-disc ml-8">
              <li>Unlimited access to premium courses</li>
              <li>Personalized learning recommendations</li>
              <li>Priority customer support</li>
            </ul>
          </p>
          <button
            className="mt-6 px-6 py-3 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors duration-300"
            onClick={checkout}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyPremium;
