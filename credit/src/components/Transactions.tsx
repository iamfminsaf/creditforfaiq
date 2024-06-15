import '../styles/transactions.css';
import { transactionType } from '../types/Transaction';

const Transactions = ({ transactions }: { transactions: transactionType[] }) => {
	return (
		<table className="trans-table">
			<thead>
				<tr>
					<th>Time</th>
					<th>Date</th>
					<th>Description</th>
					<th>Amount</th>
				</tr>
			</thead>
			<tbody>
				{transactions.map((trans) => (
					<tr className={trans.amount < 0 ? 'happy-trans' : 'sad-trans'}>
						<td>{trans.time}</td>
						<td>{trans.date}</td>
						<td>{trans.desc}</td>
						<td>Rs.{trans.amount}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Transactions;
