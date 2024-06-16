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
	const [note, setNote] = useState('Loading..');
	const [newTransFormActive, setNewTransFormActive] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`${import.meta.env.VITE_SERVER_URL}/api/cus/${id}`, {
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
		fetch(`${import.meta.env.VITE_SERVER_URL}/api/cus/${id}/star`, {
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

	const newTransaction = (trans: transactionType) => {
		transaction.push(trans);
	};

	const newBalance = (amount: number) => {
		setBalance(balance + amount);
	};
	return (
		<>
			<div className="customer">
				<Helmet>
					<title>{cusName} | Cred It</title>
				</Helmet>
				<button className="back" onClick={() => navigate('/')}></button>
				<div className="details">
					<div className="profile">{profile ? <img src={`${import.meta.env.VITE_SERVER_URL}/profile/${profile}`} alt="profile" /> : <img src={cusvg} alt="profile" />}</div>
					<button className="star" onClick={starCus}>
						<img src={star ? starImg : unstarImg} alt="star" />
					</button>
					<h2 className="cusname">{cusName}</h2>
					<textarea
						className="note"
						value={note}
						onChange={(e) => {
							setNote(e.target.value);
						}}
					/>
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
			{newTransFormActive ? <NewTransForm id={id} cusname={cusName} newTransaction={newTransaction} setNewTransFormActive={setNewTransFormActive} newBalance={newBalance} /> : <></>}
		</>
	);
};

export default Customer;
