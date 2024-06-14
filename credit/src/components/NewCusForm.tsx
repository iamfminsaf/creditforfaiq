import React, { SetStateAction, useState } from "react";
import "../styles/newcusform.css";
import cusvg from "../assets/cus.svg";

type NewCusFormProbs = {
  setNewCusFormActive: React.Dispatch<SetStateAction<boolean>>;
};

const NewCusForm: React.FC<NewCusFormProbs> = ({ setNewCusFormActive }) => {
  const [profile, setProfile] = useState(cusvg);
  const [cusName, setCusName] = useState("");
  const [formData, setFormData] = useState<FormData>();

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
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
        };
      };

      reader.readAsDataURL(file);
      const profileFormData = new FormData();
      profileFormData.set("profile", file);
      setFormData(profileFormData);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCusName(e.target.value);
    const nameFormData = new FormData();
    nameFormData.set("cusname", e.target.value);
    setFormData(nameFormData);
  };

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    await fetch("http://localhost:8080/api/cus", {
      method: "post",
      headers: {
        "content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((result) => {
        console.log(result);
      });
  };
  return (
    <div className="new-cus-form">
      <form onSubmit={(e) => handelSubmit(e)}>
        <div className="profile">
          <label htmlFor="profile">
            <img src={profile} alt="profile" />
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
            type="text"
            placeholder="Ex:Insaf FM"
            value={cusName}
            onChange={(e) => {
              handleNameChange(e);
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
