import React from 'react';

export default function Modal({ modalText, modalVisible, onClose }) {
	const errorCloseToggler = () => {
		onClose();
	};

	if (!modalVisible) return null;

	return (
		<div id='modalWindow' aria-hidden='true' className='modalWindow'>
			<div className='modalWindow__wrapper'>
				<div className='modalWindow__content'>
					<button
						onClick={errorCloseToggler}
						type='button'
						className='modalWindow__close'
					>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<g clip-path='url(#clip0_5186_2444)'>
								<path
									d='M12 0C9.62663 0 7.30655 0.703787 5.33316 2.02236C3.35977 3.34094 1.8217 5.21508 0.913451 7.4078C0.00519945 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693604 16.6689 1.83649 18.807 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0865C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9962 8.81855 22.7308 5.76849 20.4811 3.51886C18.2315 1.26924 15.1814 0.00375324 12 0ZM16.6276 15.0862C16.7318 15.1868 16.8149 15.3072 16.8721 15.4403C16.9293 15.5734 16.9594 15.7165 16.9606 15.8614C16.9619 16.0062 16.9343 16.1499 16.8794 16.2839C16.8246 16.418 16.7436 16.5398 16.6412 16.6422C16.5387 16.7447 16.4169 16.8257 16.2829 16.8805C16.1488 16.9354 16.0051 16.963 15.8603 16.9617C15.7154 16.9605 15.5723 16.9304 15.4392 16.8732C15.3061 16.816 15.1857 16.7329 15.0851 16.6287L12 13.5425L8.91491 16.6287C8.70916 16.8274 8.4336 16.9374 8.14756 16.9349C7.86153 16.9324 7.58792 16.8177 7.38566 16.6154C7.18339 16.4132 7.06866 16.1396 7.06618 15.8535C7.06369 15.5675 7.17365 15.2919 7.37237 15.0862L10.4575 12L7.37237 8.91382C7.26817 8.81318 7.18507 8.69281 7.12789 8.55971C7.07072 8.42662 7.04063 8.28347 7.03937 8.13862C7.03811 7.99377 7.06571 7.85012 7.12056 7.71605C7.17541 7.58198 7.25642 7.46018 7.35884 7.35775C7.46127 7.25532 7.58308 7.17432 7.71714 7.11947C7.85121 7.06461 7.99486 7.03701 8.13971 7.03827C8.28456 7.03953 8.42771 7.06962 8.56081 7.1268C8.6939 7.18397 8.81428 7.26708 8.91491 7.37127L12 10.4575L15.0851 7.37127C15.1857 7.26708 15.3061 7.18397 15.4392 7.1268C15.5723 7.06962 15.7154 7.03953 15.8603 7.03827C16.0051 7.03701 16.1488 7.06461 16.2829 7.11947C16.4169 7.17432 16.5387 7.25532 16.6412 7.35775C16.7436 7.46018 16.8246 7.58198 16.8794 7.71605C16.9343 7.85012 16.9619 7.99377 16.9606 8.13862C16.9594 8.28347 16.9293 8.42662 16.8721 8.55971C16.8149 8.69281 16.7318 8.81318 16.6276 8.91382L13.5425 12L16.6276 15.0862Z'
									fill='white'
									fill-opacity='0.2'
								/>
							</g>
							<defs>
								<clipPath id='clip0_5186_2444'>
									<rect width='24' height='24' fill='white' />
								</clipPath>
							</defs>
						</svg>
					</button>
					<div className='modalWindow__title'>
						<h4>{modalText}</h4>
					</div>
				</div>
			</div>
		</div>
	);
}
