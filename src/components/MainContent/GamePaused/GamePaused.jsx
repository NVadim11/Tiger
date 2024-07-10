import React, { useEffect, useState } from 'react';
import tigranChill from '../../../img/tigranChill.gif';
import tigranCircle from '../../../img/tigran_circle.webp';
import { useTranslation } from 'react-i18next';

const GamePaused = ({ user, remainingTime }) => {
	const [timeRemaining, setTimeRemaining] = useState(remainingTime);
	const { t, i18n } = useTranslation();

	const changeLanguage = (language) => {
		i18n.changeLanguage(language);
	};

	useEffect(() => {
		setTimeRemaining(remainingTime);
	}, [remainingTime]);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}`;
	};

	return (
		<div className='mainContent__gamePaused'>
			<div className='mainContent__totalCoins'>
				<div className='mainContent__totalCoinsBox'>
					<div className='mainContent__totalCoinsImg' draggable='false'>
						<img src={tigranCircle} draggable='false' />
					</div>
					{user !== null && (
						<div className='mainContent__totalCoinsAmount'>
							<span>{user?.wallet_balance}</span>
						</div>
					)}
				</div>
			</div>
			{timeRemaining ? (
				<h4 style={{ marginBottom: '10px', marginTop: '20px' }}>
					Time remaining: {formatTime(timeRemaining)} minutes
				</h4>
			) : (
				<h4 style={{ marginBottom: '10px', marginTop: '20px' }}>Calculating...</h4>
			)}
			<div className='mainContent__imageContainer'>
				<img src={tigranChill} draggable='false' alt='Tigran Chill' />
			</div>
			<p style={{ marginTop: '20px' }}>Tigran is tired, come back when timer is over.</p>
		</div>
	);
};

export default GamePaused;
