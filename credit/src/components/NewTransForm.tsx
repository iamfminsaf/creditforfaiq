import React, { SetStateAction, useState } from 'react';
import '../styles/newtransform.css';

type NewCusFormProbs = {
	id: string | null;
	setNewTransFormActive: React.Dispatch<SetStateAction<boolean>>;
};

const NewTransForm: React.FC<NewCusFormProbs> = ({ id, setNewTransFormActive }) => {
	const [desc, setDesc] = useState('No description');
	const [amount, setAmount] = useState(0);
	const [vector, setVector] = useState<'p' | 'm'>('p');
	const handleNewTransFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const amountWithVector = vector == 'p' ? amount : amount * -1;
		const formData = {
			desc,
			amount: amountWithVector,
		};
		fetch(`http://localhost:8080/api/cus/${id}`, {
			method: 'post',
			headers: {
				'content-Type': 'application/json',
				authorization: `Beared ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify(formData),
		})
			.then((resp) => resp.json())
			.then((result) => {
				console.log(result);
			});
	};
	return (
		<div className="new-tras-form">
			<form
				onSubmit={(e) => {
					handleNewTransFormSubmit(e);
				}}>
				<div className="desc">
					<label htmlFor="desc">Enter thr description :</label>
					<input
						id="desc"
						type="text"
						value={desc}
						onChange={(e) => {
							setDesc(e.target.value);
						}}
					/>
				</div>
				<div className="amount">
					<label htmlFor="amount">Transaction amount :</label>
					<input
						type="number"
						id="amount"
						value={amount}
						onChange={(e) => {
							setAmount(Number.parseFloat(e.target.value));
						}}
						placeholder="XXXX"
					/>
				</div>
				<div className="vector">
					<input
						type="button"
						value="+"
						className={`p ${vector == 'p' ? 'selected' : ''}`}
						onClick={() => {
							setVector('p');
						}}
					/>
					<input
						type="button"
						value="-"
						className={`m ${vector == 'm' ? 'selected' : ''}`}
						onClick={() => {
							setVector('m');
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
