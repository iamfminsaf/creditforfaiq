import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Credit from './Credit';
import Join from './Join';
import Customer from './Customer';
import ProtectedRoute from './ProtectedRoute';

ReactDOM.createRoot(document.getElementById('credit')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Credit />
						</ProtectedRoute>
					}
				/>
				<Route
					path="cus"
					element={
						<ProtectedRoute>
							<Customer />
						</ProtectedRoute>
					}
				/>
				<Route path="join" element={<Join />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
