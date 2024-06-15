import { Helmet } from 'react-helmet';
import './styles/customer.css';
import cusvg from './assets/cus.svg';
import starImg from './assets/star.svg';
import unstarImg from './assets/unstar.svg';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { transactionType } from './types/Transaction';
import NewTransForm from './components/NewTransForm';
import Transactions from './components/Transactions';

const Customer = () => {
	const params = useSearchParams();
	const id = params[0].get('id');
	const [cusName, setCusName] = useState('loading..');
	const [profile, setProfile] = useState();
	const [balance, setBalance] = useState(0);
	const [star, setStar] = useState(false);
	const [transaction, setTransaction] = useState<transactionType[]>([{ amount: 0, desc: 'Loading..', time: 'XX:XX XM', date: 'XX/XXX' }]);
	const [note, setNote] = useState();
	const [newTransFormActive, setNewTransFormActive] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`http://localhost:8080/api/cus/${id}`, {
			method: 'get',
			headers: {
				'content-Type': 'application/json',
				authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then((resp) => resp.json())
			.then((result) => {
				setCusName(result.cusname);
				setBalance(result.balance);
				setProfile(result.profile);
				setNote(result.note ? result.note : 'No notes...');
				setStar(result.star);
				setTransaction(result.transaction);
			});
	}, []);

	const starCus = () => {
		fetch(`http://localhost:8080/api/cus/${id}/star`, {
			method: 'put',
			headers: {
				'content-Type': 'application/json',
				authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		})
			.then((resp) => resp.json())
			.then((result) => {
				setStar(result.star);
			});
	};
	return (
		<>
			<div className="customer">
				<Helmet>
					<title>{cusName} | Cred It</title>
				</Helmet>
				<button className="back" onClick={() => navigate('/')}></button>
				<div className="details">
					<div className="profile">{profile ? <img src={`http://localhost:8080/profile/${profile}`} alt="profile" /> : <img src={cusvg} alt="profile" />}</div>
					<button className="star" onClick={starCus}>
						<img src={star ? starImg : unstarImg} alt="star" />
					</button>
					<h2 className="cusname">{cusName}</h2>
					<p className="note">{note}</p>
				</div>
				<div className="transactions">
					{transaction?.length !== 0 ? (
						<Transactions transactions={transaction} />
					) : (
						<h4 className="no-trans">
							No transactions.
							<br /> Create new by clicking the button belew..
						</h4>
					)}
				</div>
				<footer>
					<h3 className={balance < 0 ? 'happy' : balance == 0 ? 'idle' : 'sad'}>Rs. {balance < 0 ? balance * -1 : balance}</h3>

					<button
						className="add-new-cus-btn"
						onClick={() => {
							setNewTransFormActive(true);
						}}></button>
				</footer>
			</div>
			{newTransFormActive ? <NewTransForm id={id} setNewTransFormActive={setNewTransFormActive} /> : <></>}
		</>
	);
};

export default Customer;
