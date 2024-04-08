import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function PaymentSucess() {
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
          <h1 className="text-2xl mb-4 font-semibold">Payment Successful</h1>
          <p className="mb-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis,
            minus nemo nisi inventore quas esse ratione ea impedit est aut
            similique necessitatibus in animi, quae minima? Alias unde officiis
            fugit, molestias ipsam veritatis deleniti magni maiores in autem
            porro sunt nihil tempora nam asperiores magnam iusto. Explicabo
            eaque quasi quod?
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos velit
            dicta neque accusantium eligendi illum impedit eveniet sint at
            assumenda.
          </p>
          <button className="mt-4 bg-pink-300 px-4 py-2 rounded-md">
            Find Me a Match!
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSucess;
