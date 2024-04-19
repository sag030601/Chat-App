
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import loader from "../assets/loader.gif";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatars, setSelectedAvatars] = useState(undefined);

  const ToastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    theme: "dark",
    draggable: true,
  };


  useEffect(  () => {
    if(!localStorage.getItem('chat-app')){
      navigate('/login')
    }
  },[])

  // const setProfilePicture = async () => {
  //   if (selectedAvatars === undefined) {
  //     toast.error("Please select an avatar", ToastOptions);
  //   } else {
  //     try {
  //       const user = JSON.parse(localStorage.getItem("chat-app"));
  //       const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
  //         image: avatars(selectedAvatars),
  //       });

  //       if (data.isSet) {
  //         user.isAvatarImageSet = true;
  //         user.avatarImage = data.image;
  //         localStorage.setItem("chat-app", JSON.stringify(user));
  //         navigate("/");
  //       } else {
  //         toast.error(
  //           "Error setting avatar, please try again",
  //           ToastOptions
  //         );
  //       }
  //     } catch (error) {
  //       console.error("Error setting profile picture:", error);
  //     }
  //   }
  // };

  // ... (previous code)

const setProfilePicture = async () => {
  if (selectedAvatars === undefined) {
    toast.error("Please select an avatar", ToastOptions);
  } else {
    try {
      const user = await JSON.parse(localStorage.getItem("chat-app"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatars],  // Use the selected avatar index
      });
      console.log(data)
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar, please try again", ToastOptions);
      }
    } catch (error) {
      console.error("Error setting profile picture:", error);
    }
  }
};

// ... (remaining code)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const response = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`,
            {
              responseType: "arraybuffer",
            }
          );

          const arrayBuffer = response.data;
          const bytes = new Uint8Array(arrayBuffer);
          const binaryString = bytes.reduce(
            (acc, byte) => acc + String.fromCharCode(byte),
            ""
          );
          const base64 = btoa(binaryString);
          data.push(base64);
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching avatar data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar </h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatars === index ? "selected" : ""
                } `}
                onClick={() => setSelectedAvatars(index)}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                />
              </div>
            ))}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Container>
      )}
      <ToastContainer {...ToastOptions} />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }

      &.selected {
        border: 0.4rem solid #4e0eff;
      }
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #3b0d9e;
    }
  }
`;
