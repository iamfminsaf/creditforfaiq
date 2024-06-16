import React, { SetStateAction, useState } from 'react';
import '../styles/newtransform.css';
import { transactionType } from '../types/Transaction';

type NewCusFormProbs = {
	id: string | null;
	cusname: string | null;
	setNewTransFormActive: React.Dispatch<SetStateAction<boolean>>;
	newTransaction: ({}: transactionType) => void;
	newBalance: (balance: number) => void;
};

const NewTransForm: React.FC<NewCusFormProbs> = ({ id, cusname, setNewTransFormActive, newTransaction, newBalance }) => {
	const [desc, setDesc] = useState('');
	const [amount, setAmount] = useState<number>();
	const [vector, setVector] = useState<'p' | 'm'>('p');
	const [noAmount, setNoAmount] = useState(false);
	const handleNewTransFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (amount == undefined) {
			console.log(amount);

			setNoAmount(true);
		} else {
			const amountWithVector = vector == 'p' ? amount : amount * -1;

			const descToSend = desc == '' ? 'No description' : desc;
			const formData = {
				desc: descToSend,
				amount: amountWithVector,
			};

			fetch(`${import.meta.env.VITE_SERVER_URL}/api/cus/${id}`, {
				method: 'post',
				headers: {
					'content-Type': 'application/json',
					authorization: `Beared ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify(formData),
			})
				.then((resp) => resp.json())
				.then((result) => {
					if (result.newTransaction) {
						newTransaction(result.newTransaction);
						setNewTransFormActive(false);
						newBalance(result.newTransaction.amount);
					}
				});
		}
	};
	return (
		<div className="new-tras-form">
			<form
				onSubmit={(e) => {
					handleNewTransFormSubmit(e);
				}}>
				<h2>
					Adding for <span>{cusname}</span>
				</h2>
				<div className="desc">
					<label htmlFor="desc">Enter thr description :</label>
					<input
						id="desc"
						type="text"
						value={desc}
						onChange={(e) => {
							setDesc(e.target.value);
						}}
						placeholder="No description"
					/>
				</div>
				<div className="amount">
					<label htmlFor="amount" className={noAmount ? 'no-amount' : ''}>
						Transaction amount :
					</label>
					<input
						className={noAmount ? 'no-amount' : ''}
						type="number"
						id="amount"
						value={amount}
						onChange={(e) => {
							setAmount(Number.parseFloat(e.target.value));
							setNoAmount(false);
						}}
						placeholder="XXXX"
					/>
				</div>
				<div className="vector">
					<input
						type="button"
						value="-"
						className={`m ${vector == 'm' ? 'selected' : ''}`}
						onClick={() => {
							setVector('m');
						}}
					/>
					<input
						type="button"
						value="+"
						className={`p ${vector == 'p' ? 'selected' : ''}`}
						onClick={() => {
							setVector('p');
						}}
					/>
				</div>
				<div className="btns">
					<button
						className="cancel"
						onClick={() => {
							setNewTransFormActive(false);
						}}>
						cencel
					</button>
					<button type="submit" className="add">
						Add
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewTransForm;
