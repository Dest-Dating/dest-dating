import { useSelector } from "react-redux";
import { IoHeart } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { FaAngleUp } from "react-icons/fa";

function Test() {
  const user = useSelector((state) => state?.user?.currentUser?.data?.user);
  const imageDivs = useRef([]);
  const [view, setView] = useState(0);

  const handleViewChange = (add) => {
    if (view === 0 && add < 0) return;
    if (view === user.photosLink.length && add > 0) return;
    setView(view + add);
  };

  useEffect(() => {
    if (imageDivs.current.length === 0) return;
    imageDivs.current[view].scrollIntoView({ behavior: "smooth" }); //smooth ni hora
  }, [view]);

  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <div className="relative">
        <div>
          <div
            style={{
              backgroundImage:
                "url(https://images.pexels.com/photos/301673/pexels-photo-301673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
            }}
            className="relative shadow-xl rounded-2xl w-[500px] max-h-[500px]  min-h-[500px] border border-rose-200 bg-rose-50 overflow-y-scroll"
          >
            <div className="relative backdrop-blur-sm">
              <div
                name="header"
                className="sticky top-0 -my-[50px] z-1  p-3  bg-gradient-to-b from-[rgba(0,0,0,.3)] to-transparent w-full text-white"
              >
                <div
                  name="username"
                  className="text-xl font-bold  font-handwritten"
                >
                  {user.name}
                </div>
                <div style={{ fontSize: "11px" }}>
                  {/*//todo: fill user details here*/}
                  <div name="age">(23)</div>
                  <div name="interest">Web Developer</div>
                  <div name="age">Leetcode: 23523</div>
                </div>
              </div>

              <div
                name="session1"
                className="border"
                ref={(ref) => (imageDivs.current[0] = ref)}
              >
                <div className="max-h-[500px] flex justify-center items-center w-[100%]">
                  <img
                    className="w-full h-[500px] object-cover"
                    src={user.photosLink[0].photoLink}
                    alt=""
                  />
                </div>
              </div>

              {user.photosLink.map((obj) => {
                return (
                  <div
                    key={obj.index + 1}
                    className="flex items-center"
                    ref={(ref) => (imageDivs.current[obj.index + 1] = ref)}
                    name="session2"
                  >
                    <div className="h-[500px] min-w-[300px] flex">
                      <img
                        className="object-cover h-[500px] w-[300px] object-center"
                        src={user.photosLink[obj.index].photoLink}
                        alt=""
                      />
                    </div>
                    <div className="p-3">
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries, but also the leap
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            name="up down"
            className={`absolute flex flex-col gap-4 right-5 top-[70%]`}
          >
            <div
              name="accept"
              onClick={(e) => handleViewChange(-1)}
              className={`hover:scale-105 active:scale-100 w-6 h-6 border rounded-full flex justify-center items-center shadow-xl  border-stone-200 bg-white ${
                view === 0 && "opacity-0"
              }`}
            >
              <FaAngleUp />
            </div>
            <div
              name="accept"
              onClick={(e) => handleViewChange(1)}
              className={`hover:scale-105 active:scale-100 w-6 h-6 border rounded-full flex justify-center items-center shadow-xl  border-stone-200 bg-white ${
                view === user.photosLink.length && "opacity-0"
              }`}
            >
              <FaAngleDown />
            </div>
          </div>

          <div
            name="controls"
            className="absolute left-[50%] -translate-x-1/2 flex gap-10 -bottom-10 "
          >
            <div
              name="accept"
              className="hover:scale-105 active:scale-100 w-20 h-20 border rounded-full flex justify-center items-center shadow-xl  border-stone-200 bg-white"
            >
              <RxCross2 size={50} color="red" />
            </div>
            <div
              name="accept"
              className="hover:scale-105 active:scale-100  w-20 h-20 border rounded-full flex justify-center items-center shadow-xl  border-stone-200 bg-white"
            >
              <IoHeart size={50} color="red" />
            </div>
          </div>
        </div>
      </div>

      <div name="view more"></div>
    </div>
  );
}

export default Test;
