import { SetStateAction } from 'react';
import '../styles/newtransform.css';

type NewCusFormProbs = {
	setNewTransFormActive: React.Dispatch<SetStateAction<boolean>>;
};

const NewTransForm: React.FC<NewCusFormProbs> = ({ setNewTransFormActive }) => {
	return (
		<div className="new-tras-form">
			<button
				onClick={() => {
					setNewTransFormActive(false);
				}}>
				cencel
			</button>
		</div>
	);
};

export default NewTransForm;
