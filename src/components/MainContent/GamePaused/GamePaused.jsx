import React, { useEffect, useState } from 'react';
import tigranCircle from '../../../img/Tigran_circle.webp';

const GamePaused = ({ remainingTime }) => {
	const [timeRemaining, setTimeRemaining] = useState(remainingTime);

	useEffect(() => {
		setTimeRemaining(remainingTime);
	}, [remainingTime]);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}`;
	};

	return (
		<div className='mainContent__gamePaused'>
			{timeRemaining ? (
				<h4>Time remaining: {formatTime(timeRemaining)} minutes</h4>
			) : (
				<h4>Calculating...</h4>
			)}
			<div className='mainContent__imageContainer'>
				<img src={tigranCircle} alt='Tigran face' />
			</div>
			<p>Tigran is tired, come back when timer is over.</p>
		</div>
	);
};

export default GamePaused;
