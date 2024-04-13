import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { Resizable } from "re-resizable";

const RoomPage = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=oUFJJNQGwhk");
  const [pip, setPip] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [controls, setControls] = useState(false);
  const [light, setLight] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(false);
  const [upperHeight, setUpperHeight] = useState("70%");
  const [seeking, setSeeking] = useState(false);
  const [lowerHeight, setLowerHeight] = useState("50%");
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [urlChange, setUrlChange] = useState("");

  const location = useLocation();
  const movieDate = location.state?.movieDate;
  // alert(movieDate);

  // const handleDrag = useCallback((e) => {
  //   const totalHeight = window.innerHeight;
  //   const deltaY = e.clientY - totalHeight * 0.15;
  //   const upperPercentage = (deltaY / totalHeight) * 100;
  //   const lowerPercentage = 100 - upperPercentage;
  //   setUpperHeight(`${upperPercentage}%`);
  //   setLowerHeight(`${lowerPercentage}%`);
  // }, []);

  const onMouseUp = () => {
    //   document.removeEventListener("mousemove", handleDrag);
    //   document.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseDown = () => {
    //   document.addEventListener("mousemove", handleDrag);
    //   document.addEventListener("mouseup", onMouseUp);
  };

  const handleEndButtonClick = () => {
    // Stop all tracks in the stream
    if (myStream) {
      myStream.getTracks().forEach((track) => {
        track.stop(); // Stop the track
      });
    }
    // Reset myStream state to null
    setMyStream(null);
    // Navigate to the desired location
    navigate("/");
  };

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  useEffect(() => {
    socket.on("playPause", () => {
      setPlaying(!playing);
      setButtonsVisible(playing);
    });
  }, [playing, socket]);

  const load = (url) => {
    setUrl(url);
    setPlayed(0);
    setLoaded(0);
    setPip(false);
  };

  const handlePlayPause = () => {
    socket.emit("playPause");
  };

  const handleStop = () => {
    setUrl(null);
    setPlaying(false);
  };

  const handleToggleControls = () => {
    const newUrl = url;
    setControls(!controls);
    setUrl(null);
    setUrl(newUrl);
  };

  const handleToggleLight = () => {
    setLight(!light);
  };

  const handleToggleLoop = () => {
    setLoop(!loop);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleToggleMuted = () => {
    setMuted(!muted);
  };

  const handleSetPlaybackRate = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleOnPlaybackRateChange = (speed) => {
    setPlaybackRate(parseFloat(speed));
  };

  const handleTogglePIP = () => {
    setPip(!pip);
  };

  const handlePlay = () => {
    console.log("onPlay");
    setPlaying(true);
  };

  const handleEnablePIP = () => {
    console.log("onEnablePIP");
    setPip(true);
  };

  const handleDisablePIP = () => {
    console.log("onDisablePIP");
    setPip(false);
  };

  const handlePause = () => {
    console.log("onPause");
    setPlaying(false);
  };

  const handleSeekMouseDown = (e) => {
    console.log("onSeekMouseDown");
  };

  const handleSeekChange = (e) => {
    console.log("onSeekChange", e);
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    console.log("onSeekMouseUp");
  };

  useEffect(() => {
    socket.on("urlChange", (data) => {
      setPlaying(false);
      setUrl(data.urlChange);
    });
  }, [socket]);

  const handleSetClick = () => {
    socket.emit("urlChange", { urlChange });
  };

  const handleProgress = (state) => {
    console.log("onProgress", state);
    // We only want to update time slider if we are not currently seeking
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
  };

  // const handleUrlChange(()=>{

  // })

  const handleEnded = () => {
    console.log("onEnded");
    setPlaying(loop);
  };

  const handleDuration = (duration) => {
    console.log("onDuration", duration);
    setDuration(duration);
  };

  const handleClickFullscreen = () => {
    console.log("onFullscreen");
  };

  const renderLoadButton = (url, label) => {
    return <button onClick={() => load(url)}>{label}</button>;
  };

  return (
    <div className="flex flex-col h-screen overflow-x-hidden overflow-y-hidden bg-black">
      {movieDate && (
        <div style={{ height: upperHeight }}>
          {/* Upper part content */}
          <ReactPlayer
            className="react-player"
            width="100%"
            height="100%"
            url={url}
            pip={pip}
            playing={playing}
            controls={controls}
            light={light}
            loop={loop}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            onReady={() => console.log("onReady")}
            onStart={() => console.log("onStart")}
            onPlay={handlePlay}
            onEnablePIP={handleEnablePIP}
            onDisablePIP={handleDisablePIP}
            onPause={handlePause}
            onBuffer={() => console.log("onBuffer")}
            onPlaybackRateChange={handleOnPlaybackRateChange}
            onSeek={(e) => console.log("onSeek", e)}
            onEnded={handleEnded}
            onError={(e) => console.log("onError", e)}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onPlaybackQualityChange={(e) =>
              console.log("onPlaybackQualityChange", e)
            }
          />
        </div>
      )}
      <div
        className="bg-slate-900"
        id="divider"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        style={{
          cursor: "row-resize",
          height: "5px",
        }}
      ></div>
      <div>
        <div className="flex-grow flex flex-col items-center justify-center bg-black py-2 resize-y ">
          {/* Video Controls */}
          <div className="flex p-2">
            {movieDate && (
              <div className="flex justify-center items-center bg-white p-4 border-t border-gray-300 rounded-full mr-10">
                {/* Play/Pause Button */}
                <button onClick={handlePlayPause} className="">
                  {playing ? <FaPause /> : <FaPlay />}
                </button>
              </div>
            )}
            {buttonsVisible && movieDate && (
              <input
                placeholder="Input URL here ..."
                className="rounded-lg"
                type="text"
                onChange={(e) => {
                  setUrlChange(e.target.value);
                }}
              />
            )}
            {buttonsVisible && movieDate && (
              <button
                onClick={handleSetClick}
                className="text-white rounded-lg px-4 mx-4 bg-slate-700"
              >
                Set
              </button>
            )}
            {buttonsVisible && (
              <button
                onClick={handleEndButtonClick}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mx-2"
              >
                End
              </button>
            )}
            {remoteSocketId && buttonsVisible && (
              <button
                onClick={handleCallUser}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mx-2"
              >
                CALL
              </button>
            )}
            {myStream && buttonsVisible && (
              <button
                onClick={sendStreams}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mx-2"
              >
                Send Stream
              </button>
            )}
          </div>
          {/* Display remote and local streams */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            {/* Display Remote Stream */}
            <div className="relative md:w-auto">
              {remoteStream && (
                <Resizable
                  width={320} // Initial width
                  height={180} // Initial height
                  className="overflow-hidden rounded-lg"
                >
                  <ReactPlayer
                    playing
                    muted
                    url={remoteStream}
                    width="100%"
                    height="auto"
                    style={{ borderRadius: "10px" }}
                  />
                  {/* Display Local Stream */}
                  {myStream && (
                    <div className="absolute bottom-0 right-0 z-20 w-16 md:w-24">
                      <Resizable
                        width={160} // Initial width
                        height={160} // Initial height
                        className="overflow-hidden rounded-lg"
                      >
                        <ReactPlayer
                          playing
                          muted
                          url={myStream}
                          width="100%"
                          height="auto"
                          style={{ borderRadius: "10px" }}
                        />
                      </Resizable>
                    </div>
                  )}
                </Resizable>
              )}
            </div>
          </div>
          ; ;
        </div>
        {/* Bottom Buttons */}
        {/* <div className="flex flex-col items-center justify-center bg-slate-900"> */}
        {/* <div className="flex justify-center items-center bg-white">
          <div className="fixed bottom-0 left-0 right-0 bg-slate-100 flex justify-around p-4 border-t border-gray-300"></div>
        </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default RoomPage;
