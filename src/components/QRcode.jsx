import React from 'react';
import QRimg from '../img/qr.png';
const TelegramLinking = () => {
	return (
		<div
			style={{
				position: 'fixed',
				top: '0',
				left: '0',
				width: '100vw',
				height: '100vh',
				background: 'linear-gradient(180deg, #0b1f46 0%, #000 100%)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				transition: 'opacity 1s ease-out, visibility 0s 1s, transform 1s ease-in-out',
				opacity: '1',
				visibility: 'visible',
				overflow: 'hidden',
				transformOrigin: 'center center',
				zIndex: '10000',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<h1
					style={{
						display: 'flex',
						width: 'fit-content',
						margin: '30px 0 30px 0',
						fontWeight: '900',
						fontSize: '24px',
						lineHeight: '100%',
						textAlign: 'center',
					}}
				>
					Leave the desktop. <br />
					Mobile gaming rocks!
				</h1>
				<div
					style={{
						display: 'flex',
						scale: '90%',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<img
						src={QRimg}
						alt='QR redirect'
						style={{
							borderRadius: '20px',
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default TelegramLinking;
