import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import './styles/customer.css';

const Customer = () => {
	const { id } = useParams<{ id: string }>();
	return (
		<div className="customer">
			<Helmet>
				<title>{id}</title>
			</Helmet>
			<h1>{id}</h1>
		</div>
	);
};

export default Customer;
