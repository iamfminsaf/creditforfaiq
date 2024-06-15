import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './components/Loading';

type ProtectedRouteProbs = { children: ReactNode };

const ProtectedRoute: React.FC<ProtectedRouteProbs> = ({ children }) => {
	const navigate = useNavigate();
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			navigate('/join');
			console.log('AuthToken not found !!!');
		} else {
			fetch('http://localhost:8080/api/user/verify', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Beared ${token}`,
				},
				body: JSON.stringify({ token }),
			})
				.then((resp) => resp.json())
				.then((data) => {
					if (data.authenticated) {
						setAuthenticated(true);
					} else {
						navigate('/join');
					}
				});
		}
	}, [authenticated]);

	if (!authenticated) {
		return <Loading />;
	}

	return <div>{children}</div>;
};

export default ProtectedRoute;
