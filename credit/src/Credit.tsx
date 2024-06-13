import "./styles/credit.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerType } from "./types/CustomerType";
import CusList from "./components/CusList";

const Credit = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [totalBalance, setTotalBalance] = useState(0);
  const [cusList, setCusList] = useState<CustomerType[]>([]);

  const leaveNow = () => {
    localStorage.removeItem("token");
    navigate("/join");
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/cus/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Beared ${localStorage.getItem("token")}`,
      },
    })
      .then((resp) => resp.json())
      .then((result) => {
        setCusList(result.cusList);
        setTotalBalance(result.totalBalance);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="home">
      <header>
        <button
          className="logo"
          onClick={() => {
            history.go(0);
          }}
        ></button>

        <div className="search">
          <input
            type="search"
            placeholder="Search.."
            value={search}
            onChange={(e) => handleSearch(e)}
          />
        </div>

        <button className="leave-btn" onClick={leaveNow}></button>
      </header>

      <div className="toggle"></div>

      <div className="lists">
        {cusList.length === 0 ? (
          <h4 className="nocus">
            No customers.
            <br />
            Create new using the button below.
          </h4>
        ) : (
          cusList.map((customer) => (
            <CusList key={customer.cusID} customer={customer} />
          ))
        )}
      </div>

      <footer>
        <h3
          className={
            totalBalance < 0 ? "happy" : totalBalance == 0 ? "idle" : "sad"
          }
        >
          Rs. {totalBalance}
        </h3>

        <button></button>
      </footer>
    </div>
  );
};

export default Credit;
