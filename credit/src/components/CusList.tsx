import "../styles/cuslist.css";
import cusvg from "../assets/cus.svg";
import { CustomerType } from "../types/CustomerType";

type CusListProbs = {
  customer: CustomerType;
};

const CusList = (probs: CusListProbs) => {
  const cusname = probs.customer.cusname;
  const profile = probs.customer.profile
    ? `http://localhost:8080/profile/${probs.customer.profile}`
    : cusvg;
  const balance = `Rs. ${probs.customer.balance}`;

  return (
    <div className="cus-list">
      <div className="profile">
        <img src={profile} alt="" />
      </div>
      <div className="detail">
        <p className="cusname">{cusname}</p>
        <p
          className={`balance ${
            probs.customer.balance < 0
              ? "happy"
              : probs.customer.balance == 0
              ? "idle"
              : "sad"
          }`}
        >
          {balance}
        </p>
      </div>
    </div>
  );
};

export default CusList;
