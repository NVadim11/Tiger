import React from 'react';
import GreenIcon from './Icons/GreenIcon';
import YellowIcon from './Icons/YellowIcon';
import RedIcon from './Icons/RedIcon';
import cross from '../../img/cross.svg'

import './Modal.scss';

// <div className='ModalTest'>
// <h1>My React App</h1>
// <button
// 	onClick={() => openModal('green', 'This is a green modal', 'Confirm')}
// >
// 	Show Green Modal
// </button>
// <button onClick={() => openModal('red', 'This is a red modal', 'Delete')}>
// 	Show Red Modal
// </button>
// <button
// 	onClick={() => openModal('yellow', 'This is a yellow modal', 'Proceed')}
// >
// 	Show Yellow Modal
// </button>
// <Modal
// 	modalText={modalText}
// 	modalVisible={isModalVisible}
// 	onClose={closeModal}
// 	modalType={modalType}
// 	buttonText={buttonText}
// 	onButtonClick={handleModalButtonClick}
// />
// </div>

// Modal logic
// const [isModalVisible, setIsModalVisible] = useState(false);
// const [modalText, setModalText] = useState('');
// const [modalType, setModalType] = useState('green'); // Default modal type
// const [buttonText, setButtonText] = useState('');

// const openModal = (type, text, btnText) => {
// 	setModalType(type);
// 	setModalText(text);
// 	setButtonText(btnText);
// 	setIsModalVisible(true);
// };

// const closeModal = () => {
// 	setIsModalVisible(false);
// };

// const handleModalButtonClick = () => {
// 	alert('Button inside modal clicked');
// };

export default function Modal({
	modalText,
	modalVisible,
	onClose,
	modalType,
	buttonText,
	onButtonClick,
}) {
	const errorCloseToggler = () => {
		onClose();
	};

	if (!modalVisible) return null;

	let IconComponent;
	switch (modalType) {
		case 'green':
			IconComponent = GreenIcon;
			break;
		case 'red':
			IconComponent = RedIcon;
			break;
		case 'yellow':
			IconComponent = YellowIcon;
			break;
		default:
			IconComponent = null;
	}

	return (
		<div id='modalWindow' aria-hidden='true' className='modalWindow'>
			<button onClick={errorCloseToggler} type='button' className='modalWindow__close'>
				<img src={cross} alt="" />
			</button>
			<div className='modalWindow__icon'>{IconComponent && <IconComponent />}</div>
			<div className='modalWindow__title'>
				<h4>{modalText}</h4>
			</div>
			<button onClick={onButtonClick} type='button' className='modalWindow__action'>
				{buttonText}
			</button>
		</div>
	);
}
