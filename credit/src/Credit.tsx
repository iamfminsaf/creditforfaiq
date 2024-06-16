import './styles/credit.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomerType } from './types/CustomerType';
import CusList from './components/CusList';

import cusImg from './assets/cus.svg';
import starImg from './assets/star.svg';
import NewCusForm from './components/NewCusForm';

const Credit = () => {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [allToggle, setAllToggle] = useState(true);
	const [staredToggle, setStaredToggle] = useState(false);
	const [cusList, setCusList] = useState<CustomerType[]>([]);
	const [staredCusList, setStaredCusList] = useState<CustomerType[]>([]);
	const [searchCusList, setSearchCusList] = useState<CustomerType[]>([]);
	const [totalBalance, setTotalBalance] = useState(0);
	const [newCusFormActive, setNewCusFormActive] = useState(false);

	const leaveNow = () => {
		localStorage.removeItem('token');
		navigate('/join');
	};

	useEffect(() => {
		fetch(`${import.meta.env.VITE_SERVER_URL}/api/cus`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Beared ${localStorage.getItem('token')}`,
			},
		})
			.then((resp) => resp.json())
			.then((result) => {
				setCusList(result.cusList);
				setTotalBalance(result.totalBalance);
			});
	}, []);

	useEffect(() => {
		var staredCusList: CustomerType[] = [];
		cusList.map((list) => {
			if (list.star) {
				staredCusList.push(list);
			}
		});
		setStaredCusList(staredCusList);
	}, [allToggle]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		var searchCusList: CustomerType[] = [];
		staredToggle
			? staredCusList.map((cus) => {
					if (cus.cusname.toLowerCase().includes(e.target.value.toLocaleLowerCase()) || cus.balance.toString().toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())) searchCusList.push(cus);
			  })
			: cusList.map((cus) => {
					if (cus.cusname.toLocaleLowerCase().startsWith(e.target.value.toLocaleLowerCase()) || cus.balance.toString().toLocaleLowerCase().startsWith(e.target.value.toLocaleLowerCase())) searchCusList.push(cus);
			  });
		setSearchCusList(searchCusList);
	};

	const toggleList = () => {
		setAllToggle(!allToggle);
		setStaredToggle(!staredToggle);
	};

	return (
		<div className="home">
			<header>
				<button
					className="logo"
					onClick={() => {
						history.go(0);
					}}></button>

				<div className="search">
					<input type="search" placeholder="Search.." value={search} onChange={(e) => handleSearch(e)} />
				</div>

				<button className="leave-btn" onClick={leaveNow}></button>
			</header>

			<button className="toggle" onClick={toggleList}>
				<div className={`opt ${allToggle ? 'active' : ''}`}>
					<img src={cusImg} alt="all" />
					All
				</div>
				<div className={`opt ${staredToggle ? 'active ' : ''}`}>
					<img src={starImg} alt="stared" />
					Stared
				</div>
			</button>

			<div className="lists">
				{search == '' ? (
					staredToggle ? (
						staredCusList.length === 0 ? (
							<h4 className="nocus">
								No stared customers.
								<br />
								Star customers to access them easily!!.
							</h4>
						) : (
							staredCusList.map((customer) => <CusList key={customer.cusID} customer={customer} />)
						)
					) : cusList.length === 0 ? (
						<h4 className="nocus">
							No customers.
							<br />
							Create new using the button below.
						</h4>
					) : (
						cusList.map((customer) => <CusList key={customer.cusID} customer={customer} />)
					)
				) : searchCusList.length === 0 ? (
					<h4 className="nocus">No customer match with your search. Check for spelling!!</h4>
				) : (
					searchCusList.map((customer) => <CusList key={customer.cusID} customer={customer} />)
				)}
			</div>

			<footer>
				<h3 className={totalBalance < 0 ? 'happy' : totalBalance == 0 ? 'idle' : 'sad'}>Rs. {totalBalance < 0 ? totalBalance * -1 : totalBalance}</h3>

				<button
					className="add-new-cu-btn"
					onClick={() => {
						setNewCusFormActive(true);
					}}></button>
			</footer>
			{newCusFormActive ? <NewCusForm setNewCusFormActive={setNewCusFormActive} /> : <></>}
		</div>
	);
};

export default Credit;
