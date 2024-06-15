import '../styles/cuslist.css';
import cusvg from '../assets/cus.svg';
import { CustomerType } from '../types/CustomerType';
import { useNavigate } from 'react-router-dom';

type CusListProbs = {
	customer: CustomerType;
};

const CusList = (probs: CusListProbs) => {
	const navigate = useNavigate();
	const cusname = probs.customer.cusname;
	const profile = probs.customer.profile ? `http://localhost:8080/profile/${probs.customer.profile}` : cusvg;
	const balance = `Rs. ${probs.customer.balance}`;

	return (
		<div
			className="cus-list"
			onClick={() => {
				navigate(`/cus?id=${probs.customer.cusID}`);
			}}>
			<div className="profile">
				<img src={profile} alt="" />
			</div>
			<div className="detail">
				<p className="cusname">{cusname}</p>
				<p className={`balance ${probs.customer.balance < 0 ? 'happy' : probs.customer.balance == 0 ? 'idle' : 'sad'}`}>{balance}</p>
			</div>
		</div>
	);
};

export default CusList;
