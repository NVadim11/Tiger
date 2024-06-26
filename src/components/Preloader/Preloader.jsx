import React, { useEffect, useState } from 'react';

const ProgressBar = ({ progress, rotate }) => {
	const radius = 130; // Radius of the circle
	const strokeWidth = 2; // Width of the stroke
	const normalizedRadius = radius - strokeWidth * 2;
	const circumference = normalizedRadius * 2 * Math.PI;

	// Calculate the strokeDashoffset based on the progress and offset
	const strokeDashoffset = circumference - (progress / 60) * circumference;

	return (
		<svg
			height={radius * 2}
			width={radius * 2}
			className={`progress-bar ${rotate ? 'rotate' : ''}`}
		>
			<circle
				className='progress-bar-background'
				stroke='#ffffff'
				opacity={0.5}
				fill='transparent'
				strokeWidth={strokeWidth}
				r={normalizedRadius}
				cx={radius}
				cy={radius}
			/>
			<circle
				className='progress-bar-progress'
				stroke='#ffffff'
				fill='transparent'
				strokeWidth={strokeWidth}
				strokeDasharray={circumference + ' ' + circumference}
				style={{ strokeDashoffset }}
				r={normalizedRadius}
				cx={radius}
				cy={radius}
			/>
		</svg>
	);
};

const Preloader = ({ loaded }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prevProgress) => (prevProgress === 0 ? 100 : prevProgress + 1));
		}, 35);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<>
			<div className={`preloader${loaded ? ' loaded' : ''}`}>
				<div
					className='progress-container'
					style={{
						zIndex: '1000',
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center', // Center horizontally
						height: '100vh', // Full viewport height
					}}
				>
					<div
						style={{
							zIndex: '1000',
							width: '205px',
							height: '205px',
							position: 'absolute',
							borderRadius: '100%',
							background:
								'radial-gradient(184.14% 50.12% at 50% 50%, rgb(28, 175, 238) 18.268051743507385%, rgb(63, 219, 60) 100%)',
						}}
					>
						{/* <img
							className='cat-image'
							src={cat}
							alt='Tim The Cat'
							style={{
								zIndex: '1000',
								position: 'absolute',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								bottom: '30px',
								left: '3px',
								paddingBottom: '15px',
							}}
						/> */}
					</div>
					<ProgressBar progress={progress} rotate={progress === 100} />
				</div>
				<div
					className='mainContent__animation'
					style={{
						zIndex: '1000',
					}}
				>
				</div>
			</div>
		</>
	);
};

export default Preloader;
