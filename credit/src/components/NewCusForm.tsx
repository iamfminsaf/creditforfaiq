import React, { SetStateAction, useState } from "react";
import "../styles/newcusform.css";
import cusvg from "../assets/cus.svg";

type NewCusFormProbs = {
  setNewCusFormActive: React.Dispatch<SetStateAction<boolean>>;
};

const NewCusForm: React.FC<NewCusFormProbs> = ({ setNewCusFormActive }) => {
  const [profile, setProfile] = useState("");
  const [profileToUpload, setProfileToUpload] = useState<File>();
  const [cusName, setCusName] = useState("");
  const [noCusName, setNoCusName] = useState(false);

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      console.log(file);

      const reader = new FileReader();

      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target?.result as string;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const width = 300;
          const height = (300 * image.height) / image.width;
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(image, 0, 0, width, height);
          const imageDataUrl = canvas.toDataURL(file.type, 0.5);
          setProfile(imageDataUrl);
          const arr = imageDataUrl.split(",");
          const mime = arr[0].match(/:(.*?);/)![1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          setProfileToUpload(new File([u8arr], file.name, { type: mime }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cusName != "") {
      if (profile) {
        await fetch("http://localhost:8080/api/cus", {
          method: "post",
          headers: {
            "content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: profile,
        })
          .then((resp) => resp.json())
          .then((result) => {
            console.log(result);
          });
      } else {
        await fetch("http://localhost:8080/api/cus", {
          method: "post",
          headers: {
            "content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ cusname: cusName }),
        })
          .then((resp) => resp.json())
          .then((result) => {
            console.log(result);
          });
      }
    } else {
      setNoCusName(true);
    }
  };
  return (
    <div className="new-cus-form">
      <form onSubmit={(e) => handelSubmit(e)}>
        <div className="profile">
          <label htmlFor="profile">
            {profile ? (
              <img src={profile} alt="profile" />
            ) : (
              <img src={cusvg} alt="profile" />
            )}
          </label>
          <input
            type="file"
            id="profile"
            accept="image/*"
            onChange={(e) => {
              handleProfileUpload(e);
            }}
          />
        </div>
        <div className="cusname">
          <label htmlFor="cusname">Enter the customer name : </label>
          <input
            className={noCusName ? "no-cus-name" : ""}
            type="text"
            placeholder="Ex:Insaf FM"
            value={cusName}
            onChange={(e) => {
              setCusName(e.target.value);
              setNoCusName(false);
            }}
          />
        </div>
        <div className="btn">
          <button className="submit-btn" type="submit">
            Add new
          </button>
          <button
            className="cencel-btn"
            onClick={() => {
              setNewCusFormActive(false);
              setProfile("");
              setCusName("");
            }}
          >
            Cencel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCusForm;