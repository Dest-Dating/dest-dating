import { IoHeart } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import Heatmap from "../Heatmap.jsx";

const Center = ({ user, handleLike, handleReject }) => {

  const viewCount = 5;
  console.log(user);

  const dob = new Date(user.dob);
  const currentDate = new Date();
  const diff = currentDate - dob;
  const ageDate = new Date(diff);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  const imageDivs = useRef([]);
  const [view, setView] = useState(0);

  const handleViewChange = (add) => {
    if (view === 0 && add < 0) return;
    if (view === viewCount && add > 0) return;
    setView(view + add);
  };

  useEffect(() => {
    if (imageDivs.current.length === 0) return;
    imageDivs.current[view].scrollIntoView({ behavior: "smooth" }); //smooth ni hora
  }, [view]);

  function getColor(difficulty) {
    switch (difficulty) {
      case "all":
        return "text-black col-span-2  text-center";
      case "easy":
        return "text-orange-500 col-span-2";
      case "medium":
        return "text-rose-600";
      case "hard":
        return "text-red-800";
    }
  }

  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: [], datasets: [{
      label: ["Solved"], data: user.leetcodeData?.submissionCount?.map((sub) => {
        if (user.leetcodeData?.submissionCount?.length === 1) return sub.count; else {
          if (sub.difficulty !== "All") return sub.count;
        }
      }), backgroundColor: ["" + "rgb(153 27 27)", //hard
        "rgb(249 115 22)", //easy
        "rgb(225 29 72)", //medium
      ], // borderColor: ["#47e9b8", "#aff072", "#008f40"],
    }],
  };

  const options = {};

  function getContent(i) {
    switch (i) {
      case 0:
        if (!user.bio) return <></>;
        return <div className="p-4">
          <div className="m-3 text-lg underline">Bio</div>
          {user.bio || ""}
        </div>;
      case 1:
        if (user.fieldsOfInterests?.length === 0) return <></>;
        return <div>
          <div className="flex flex-wrap">
            <div className="m-3 text-lg underline">Fields of interest</div>
            {user.fieldsOfInterests?.map((title, index) => {
              return <div key={index}
                          className={`px-2 py-1 rounded-2xl m-2 gap-2 text-sm cursor-pointer text-white bg-rose-400 shadow-xl`}>

                <div className="block">{title}</div>
              </div>;
            })}
          </div>
        </div>;
      case 2:
        if (user.codingLanguage?.length === 0) return <></>;
        return <div className="min-w-[200px]">
          <div className="flex flex-wrap">
            <div className="m-3 text-lg underline">Coding languages</div>
            {user.codingLanguage?.map((title, index) => {
              return <div key={index}
                          className={`px-2 py-1 rounded-2xl m-2 gap-2 text-sm cursor-pointer text-white bg-rose-400 shadow-xl`}>

                <div className="block">{title}</div>
              </div>;
            })}
          </div>
        </div>;
      case 3:
        if (!user.leetcodeData?.leetcodeUsername) return <></>;
        return <div className="min-w-[200px]">
          <div className="m-3 text-lg underline">Leetcode Profile</div>
          <div className="bg-transparent/5 px-2 m-1">
            <div>Username:</div>
            <a
              href={`https://leetcode.com/${user.leetcodeData?.leetcodeUsername}/`}
              className="text-blue-500 underline">{user.leetcodeData?.leetcodeUsername}</a>
          </div>
          <div className="bg-transparent/5 px-2 m-1">
            <div>Streak:</div>
            <div className="text-rose-400">{user.leetcodeData?.streak || 0}</div>
          </div>
          <div>
            <Doughnut
              data={data}
              options={options}
              className="max-w-[150px] max-h-[150px]"
            />
            <div className="grid grid-cols-2 gap-x-2 mt-2 m-1 font-medium">
              {user.leetcodeData?.submissionCount?.map((sub) => (<div
                className={getColor(sub?.difficulty?.toLowerCase()) + " bold"}
                key={sub.difficulty}
              >
                {`${sub.difficulty}: ${sub.count}`}
              </div>))}
            </div>
          </div>
        </div>;
      case 4:
        if (!user.leetcodeData?.heatmap) return <></>;
        return <>
          <div className="absolute top-10">
            <div className="m-3 text-lg underline">Leetcode Heatmap</div>

          </div>
          <div className="absolute bottom-10">
            <Heatmap heatmapData={user.leetcodeData?.heatmap} year={2024} />
          </div>
        </>;
    }
    return <>Meow</>;
  }

  return (<div
    className="flex justify-center items-center relative h-full *:transition scale-[.60] xs:scale-75 sm:scale-100 ">
    <div className="relative">
      <div>
        <div
          style={{
            backgroundImage: "url(https://images.pexels.com/photos/2088170/pexels-photo-2088170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
          }}
          className="bg-no-repeat bg-center relative shadow-xl rounded-2xl w-[500px] max-h-[500px]  min-h-[500px] outline-0 bg-rose-50 overflow-y-scroll"
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
                {user.name[0].toUpperCase() + user.name.slice(1)}

              </div>
              <div style={{ fontSize: "11px" }}>
                {/*//todo: fill user details here*/}
                <div name="age">({age})</div>
                <div name="interest">{user.fieldsOfInterests ? user.fieldsOfInterests[0] : " "}</div>
                <div name="age">{user.rank || " "}</div>
              </div>
            </div>

            <div
              name="session1"
              className="border"
              ref={(ref) => (imageDivs.current[0] = ref)}
            >
              <div className="max-h-[500px] flex justify-center items-center w-[100%]">
                <img
                  className="w-full h-[500px] object-cover object-top"
                  src={user.photosLink[0].photoLink}
                  alt=""
                />
              </div>
            </div>

            {/*{user.photosLink.map((obj) => {*/}
            {/*  return (*/}
            {/*    <div*/}
            {/*      key={obj.index + 1}*/}
            {/*      className="flex items-center"*/}
            {/*      ref={(ref) => (imageDivs.current[obj.index + 1] = ref)}*/}
            {/*      name="session2"*/}
            {/*    >*/}
            {/*      <div className="h-[500px] min-w-[300px] flex">*/}
            {/*        <img*/}
            {/*          className="object-cover h-[500px] w-[300px] object-center"*/}
            {/*          src={user.photosLink[obj.index].photoLink}*/}
            {/*          alt=""*/}
            {/*        />*/}
            {/*      </div>*/}
            {/*      <div className="p-3">*/}
            {/*        scrambled it to make a type specimen book. It has survived*/}
            {/*        not only five centuries, but also the leap*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  );*/}
            {/*})}*/}

            {Array(viewCount).fill(0).map((_, i) => {
              return (<div
                key={i}
                className="flex relative items-center"
                ref={(ref) => (imageDivs.current[i + 1] = ref)}
                name="session"
              >
                <div className="h-[500px] relative  min-w-[300px] flex">
                  <img
                    className="object-cover h-[500px]  object-center"
                    src={user.photosLink[i % user.photosLink.length].photoLink}
                  />
                </div>
                {getContent(i)}
              </div>);
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
            className={`hover:scale-105 active:scale-100 w-6 h-6 border rounded-full flex justify-center items-center shadow-xl  border-stone-200 bg-white ${view === 0 && "opacity-0"}`}
          >
            <FaAngleUp />
          </div>
          <div
            name="accept"
            onClick={(e) => handleViewChange(1)}
            className={`hover:scale-105 active:scale-100 w-6 h-6 border rounded-full flex justify-center items-center shadow-xl  border-stone-200 bg-white ${view === viewCount && "opacity-0"}`}
          >
            <FaAngleDown />
          </div>
        </div>

        <div
          name="controls"
          className="absolute left-[50%] -translate-x-1/2 flex gap-10 -bottom-10 "
        >
          <div
            name="reject"
            onClick={() => handleReject()}
            className="hover:scale-105 active:scale-100 w-20 h-20 border rounded-full flex justify-center items-center shadow-xl  border-stone-200 bg-white"
          >
            <RxCross2 size={50} color="red" />
          </div>
          <div
            name="accept"
            onClick={() => handleLike()}
            className="hover:scale-105 active:scale-100 active:shadow-red-600 active:shadow-2xl w-20 h-20 border rounded-full flex justify-center items-center shadow-xl  border-stone-200 bg-white"
          >
            <IoHeart size={50} color="red" />
          </div>
        </div>
      </div>
    </div>

    <div name="view more"></div>
  </div>);
};

export default Center;
