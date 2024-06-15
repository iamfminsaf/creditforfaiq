import './styles/join.css';
import logo from './assets/logo.svg';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const Join = () => {
	const [uname, setUname] = useState('');
	const [pwd, setPwd] = useState('');
	const [MTField, setMTField] = useState(false);
	const [erroMSG, setErrorMSG] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const formData = { uname, pwd };
		const resp = await fetch('http://localhost:8080/api/user/join', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});
		if (resp.status == 406) {
			setMTField(true);
			setErrorMSG('pleace fill all field');
		}
		if (resp.status == 500) {
			setErrorMSG('Opps, something wrong in server !!');
		}
		const result = await resp.json();
		if (result.incorrectPwd) {
			setErrorMSG('Incorrect password!!');
		}
		if (result.token) {
			localStorage.setItem('token', result.token);
			navigate('/');
		}
	};

	return (
		<div className="join">
			<Helmet>
				<title>Join | Cred It</title>
			</Helmet>
			<header>
				<div className="logo">
					<img src={logo} alt="logo" />
				</div>
				<h1>Join</h1>
			</header>
			<form
				onSubmit={(e) => {
					handleSubmit(e);
				}}>
				<div className="input">
					<label htmlFor="uname" className={MTField ? 'mt' : ''}>
						Enter your username :{' '}
					</label>
					<input
						className={MTField ? 'mtinput' : ''}
						type="text"
						id="uname"
						placeholder="Ex:oppenheimer007"
						onChange={(e) => {
							setUname(e.target.value);
							setMTField(false);
							setErrorMSG('');
						}}
					/>
				</div>
				<div className="input">
					<label htmlFor="pwd" className={MTField ? 'mt' : ''}>
						Enter password :{' '}
					</label>
					<input
						className={MTField ? 'mtinput' : ''}
						type="password"
						id="pwd"
						placeholder="Ex:********"
						onChange={(e) => {
							setPwd(e.target.value);
							setMTField(false);
							setErrorMSG('');
						}}
					/>
				</div>
				<p className={erroMSG ? 'err' : ''}>{erroMSG ? erroMSG : ''}</p>
				<button type="submit">Join</button>
			</form>
		</div>
	);
};

export default Join;
