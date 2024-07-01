import axios from 'axios';
import bcrypt from 'bcryptjs';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { GameInfoContext } from '../../helpers/context';
import tigranCircle from '../../img/Tigran_circle.webp';
import { useUpdateBalanceMutation } from '../../services/phpService';
import Modal from '../Modal/Modal';
import './MainContent.scss';

const MainContent = ({ user }) => {
	const { state } = useContext(GameInfoContext);
	const isMedia = useMediaQuery({ maxWidth: '1439.98px' });
	const [currentImage, setCurrentImage] = useState(true);
	const [coinState, setCoinState] = useState(false);
	const [currCoins, setCurrCoins] = useState(0);
	const [currEnergy, setCurrEnergy] = useState(user?.energy); //user?.energy
	const [tigerIdle, setTigerIdle] = useState(tigranCircle);
	const [tigerActive, setTigerActive] = useState(tigranCircle);
	const coinRef = useRef(null);
	const [updateBalance] = useUpdateBalanceMutation();
	const [position, setPosition] = useState({ x: '0', y: '0' });
	const [boostPhase, setBoostPhase] = useState(false);
	const [visible, setVisible] = useState(false);
	const [tigerVisible, setTigerVisible] = useState(true);
	let [happinessVal, setHappinessVal] = useState(1);
	let [clickNewCoins, setClickNewCoins] = useState(1);
	const [gamePaused, setGamePaused] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState('');
	const [isAnimationActive, setIsAnimationActive] = useState(false);
	const [animations, setAnimations] = useState([]);
	const [totalPoints, setTotalPoints] = useState(user?.wallet_balance);
	const accumulatedCoinsRef = useRef(0);
	const [isCoinsChanged, setIsCoinsChanged] = useState(false);
	const isCoinsChangedRef = useRef(isCoinsChanged);
	const [resetCoinsCalled, setResetCoinsCalled] = useState(false);
	const timeoutRef = useRef(null);
	const tigerImgRef = useRef(null);

	const tg = window.Telegram.WebApp;
	const userId = tg.initDataUnsafe?.user?.id;

	// aws
	const secretKey = process.env.REACT_APP_SECRET_KEY;

	const secretURL = process.env.REACT_APP_SECRET_URL;
	const testURL = process.env.REACT_APP_TEST_URL;

	const isDesktop = () => {
		const userAgent = window.navigator.userAgent;
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		return !isMobile;
	};

	useEffect(() => {
		if (!isDesktop()) {
			const element = document.getElementById('clickableElement');
			if (element) {
				element.style.pointerEvents = 'none';
			}
		}
	}, []);

	const pauseGame = async () => {
		const currentTimeStamp = Math.floor(Date.now() / 1000);
		const futureTimestamp = currentTimeStamp + 60 * 60;
		const now = new Date();
		const options = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: 'UTC',
		};
		const dateStringWithTime = now.toLocaleString('en-GB', options);

		fetch(secretURL + '/api/set-activity', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: userId,
				timestamp: futureTimestamp,
			}),
		})
			.then((response) => {
				if (response.ok) {
				} else {
					console.log('Failed to pause game');
				}
			})
			.catch((e) => {
				console.log('Error pausing game');
			});
	};

	useEffect(() => {
		if (user) {
			setTimeout(() => {
				setCurrEnergy(user.energy);
			}, 500);
		}
	}, []);

	useEffect(() => {
		let pauseTimeoutId;

		if (currEnergy >= 1000) {
			setGamePaused(true);
			setTigerVisible(false);

			// Call pauseGame after 3 seconds
			pauseTimeoutId = setTimeout(() => {
				pauseGame();
			}, 1000);
		}

		return () => {
			clearTimeout(pauseTimeoutId);
		};
	}, [currEnergy]);

	const getGameStatus = async () => {
		try {
			const initGameStatusCheck = await axios.get(
				secretURL + `/api/telegram-id/${userId}`
			);
		} catch (e) {
			console.log('Error fetching leaderboard data');
		}
	};

	useEffect(() => {
		if (user) {
			const updateGameStatus = () => {
				// Get the current time in Frankfurt time zone ('Etc/GMT-3')
				const currentTimeStamp = moment.tz('UTC').unix();
				const remainingTime = user?.active_at - currentTimeStamp;
				if (remainingTime >= 0) {
					if (remainingTime <= 0) {
						setGamePaused(false);
						setTigerVisible(true);
					} else {
						setGamePaused(true);
						setTimeRemaining(remainingTime);
					}
				}
			};

			getGameStatus();

			const timeout = setTimeout(() => {
				getGameStatus();
			}, 1000);

			const timer = setInterval(() => {
				updateGameStatus();
			}, 1000);

			return () => {
				clearInterval(timer);
				clearTimeout(timeout);
			};
		}
	}, [userId, user]);

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		return `${minutes}`;
	};

	let tigerIdleImage = tigerIdle;
	let tigerActiveImage = tigerActive;

	const boostClickedHandler = () => {
		handleBoostClick();
	};

	const handleBoostClick = () => {
		const prevHappinessVal = happinessVal;
		const prevClickNewCoins = clickNewCoins;

		setBoostPhase(true);
		setVisible(false);
		setHappinessVal(4);
		setClickNewCoins(4);

		setTimeout(() => {
			setHappinessVal(prevHappinessVal);
			setClickNewCoins(prevClickNewCoins);
			setBoostPhase(false);
			setVisible(true);
		}, 10000);
	};

	const positions = [
		{ x: 100, y: -250 },
		{ x: 100, y: -200 },
		{ x: 100, y: -150 },
		{ x: 100, y: -100 },
		{ x: 100, y: -50 },
		{ x: 100, y: 0 },
		{ x: -50, y: -250 },
		{ x: -50, y: -200 },
		{ x: -50, y: -150 },
		{ x: -50, y: -100 },
		{ x: -50, y: -50 },
		{ x: -50, y: 0 },
		{ x: 210, y: -250 },
		{ x: 210, y: -200 },
		{ x: 210, y: -150 },
		{ x: 210, y: -100 },
		{ x: 210, y: -50 },
		{ x: 210, y: 0 },
	];

	const randomizePosition = () => {
		const randomIndex = Math.floor(Math.random() * positions.length);
		const { x, y } = positions[randomIndex];
		setPosition({ x, y });
	};

	useEffect(() => {
		if (gamePaused) {
			setCoinState(false);
			setBoostPhase(false);
			setVisible(false);
			setCurrentImage(false);
			setBoostPhase(false);
			clearAnimations();
			setHappinessVal(1);
			setClickNewCoins(1);
		}
	}, [gamePaused]);

	useEffect(() => {
		let showBoostTimeout;
		let hideBoostTimeout;

		if (!gamePaused) {
			if (!visible) {
				randomizePosition();
				showBoostTimeout = setTimeout(() => {
					randomizePosition();
					setVisible(true);
				}, Math.random() * (30000 - 13000) + 13000);
			} else {
				hideBoostTimeout = setTimeout(() => {
					setVisible(false);
				}, 8300);
			}
		}

		return () => {
			clearTimeout(showBoostTimeout);
			clearTimeout(hideBoostTimeout);
		};
	}, [visible, gamePaused]);

	useEffect(() => {
		if (currEnergy <= 0) {
			setCurrEnergy(0);
		}
	}, [currEnergy]);

	const updateCurrCoins = () => {
		if (currEnergy >= 0 && currEnergy <= 150) {
		} else if (currEnergy >= 151 && currEnergy <= 300) {
			tigerIdleImage = tigerIdleImage;
			tigerActiveImage = tigerActiveImage;
		} else if (currEnergy >= 301 && currEnergy <= 550 && !resetCoinsCalled) {
			setResetCoinsCalled(true); // Set the state to true
			resetCoins(); // Call resetCoins only once
			tigerIdleImage = tigerIdleImage;
			tigerActiveImage = tigerActiveImage;
		} else if (currEnergy >= 551 && currEnergy <= 800) {
			tigerIdleImage = tigerIdleImage;
			tigerActiveImage = tigerActiveImage;
		} else if (currEnergy >= 801 && currEnergy <= 1000) {
			tigerIdleImage = tigerIdleImage;
			tigerActiveImage = tigerActiveImage;
		}
		setTigerIdle(tigerIdleImage);
		setTigerActive(tigerActiveImage);
		setIsCoinsChanged(true);
		resetTimeout();
		return clickNewCoins;
	};

	const resetCoins = () => {
		submitData(accumulatedCoinsRef.current);
		accumulatedCoinsRef.current = 0;
	};

	const resetTimeout = () => {
		setIsCoinsChanged(false);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			submitData(accumulatedCoinsRef.current);

			accumulatedCoinsRef.current = 0;
		}, 500);
	};

	useEffect(() => {
		isCoinsChangedRef.current = isCoinsChanged;
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isCoinsChanged]);

	const submitData = async (coins) => {
		const now = new Date();
		const options = {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: 'UTC',
		};
		const dateStringWithTime = now.toLocaleString('en-GB', options);
		try {
			await updateBalance({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				score: coins,
			}).unwrap();
		} catch (e) {
			console.log('Error submitting coins:');
		}
	};

	const clearAnimations = () => {
		setAnimations([]);
	};

	const coinClicker = (event) => {
		if (!event.isTrusted) return;
		setCurrentImage(false);
		setCoinState(true);
		handleShowAnimation(event);
		setCurrEnergy((prevEnergy) => Math.min(prevEnergy + happinessVal, 1000));
		clearTimeout(tigerImgRef.current);
		clearTimeout(coinRef.current);
		tigerImgRef.current = setTimeout(() => setCurrentImage(true), 1100);
		coinRef.current = setTimeout(() => setCoinState(false), 4000);

		const clickNewCoins = updateCurrCoins();
		setCurrCoins((prevCoins) => prevCoins + clickNewCoins);
		accumulatedCoinsRef.current += clickNewCoins;
	};

	const handleTouchStart = (event) => {
		if (event.touches && event.touches.length > 1) {
			event.preventDefault();
			return;
		}
		if (!event.isTrusted) return;
		setCurrentImage(false);
		setCoinState(true);
		handleShowAnimation(event);
		clearTimeout(tigerImgRef.current);
		clearTimeout(coinRef.current);
		tigerImgRef.current = setTimeout(() => setCurrentImage(true), 1100);
		coinRef.current = setTimeout(() => setCoinState(false), 4000);
	};

	const handleTouchEnd = (event) => {
		if (event && event.changedTouches && event.changedTouches.length > 0) {
			Array.from(event.changedTouches).forEach((touch) => {
				handleShowAnimation({
					touches: [touch],
					target: event.target,
					currentTarget: event.currentTarget,
				});
			});
		} else {
			handleShowAnimation(event); // Обработка для не-touch событий
		}

		const clickNewCoins = updateCurrCoins();
		setCurrCoins((prevCoins) => prevCoins + clickNewCoins);
		accumulatedCoinsRef.current += clickNewCoins;
		setCurrEnergy((prevEnergy) => Math.min(prevEnergy + happinessVal, 1000));
	};

	const handleShowAnimation = (event) => {
		if (!event) return;

		if (event.stopPropagation) {
			event.stopPropagation();
		}

		const touch = event.touches ? event.touches[0] : event;
		const clicker = event.currentTarget || touch.target;
		if (!clicker) return;

		const rect = clicker.getBoundingClientRect();
		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;

		setAnimations((prev) => [...prev, { x, y }]);
		setIsAnimationActive(true);
	};

	const maxEnergy = 1000;

	const calculateStrokeDasharray = (currEnergy) => {
		const circleCircumference = 2 * Math.PI * 45; // 2 * PI * radius
		const percentage = (currEnergy / maxEnergy) * circleCircumference;
		return `${percentage} ${circleCircumference}`;
	};

	useEffect(() => {
		const fetchData = async () => {
			if (Object.keys(user).length) {
				setTotalPoints(user?.wallet_balance);
			}
		};

		if (user) {
			fetchData();
		}
	}, [user]);

	// Modal logic
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModal = () => {
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setIsModalVisible(false);
	};

	return (
		<div className='mainContent'>
			<div className='mainContent__gameContent'>
				<div className='mainContent__gameContentBox'>
					{gamePaused ? (
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
					) : (
						<>
							{tigerVisible && (
								<>
									{!gamePaused && (
										<div className='mainContent__coins'>
											<div className='mainContent__coinBox'>
												<div className='mainContent__coinImg' draggable='false'>
													<img src={tigranCircle} draggable='false' />
												</div>
												{!user && !totalPoints !== null && (
													<div className='mainContent__coinAmount'>
														<span>{totalPoints}123123</span>
													</div>
												)}
											</div>
										</div>
									)}
									{currentImage ? (
										<div
											className='mainContent__clickArea'
											onClick={isDesktop() ? coinClicker : null}
											onTouchStart={handleTouchStart}
											onTouchEnd={(e) => handleTouchEnd(e.touches[0], e)}
										>
											{animations.map((anim, index) => (
												<AnimatePresence key={index}>
													{isAnimationActive && (
														<motion.div
															className='clickerAnimation'
															initial={{ opacity: 1, y: 0 }}
															animate={{ opacity: [1, 0], y: [-30, -120] }}
															exit={{ opacity: 0 }}
															transition={{ duration: 2 }}
															style={{
																color: '#000',
																fontSize: '45px',
																left: `${anim.x}px`,
																top: `${anim.y}px`,
																position: 'absolute',
																color: boostPhase ? '#FFDA17' : '#000',
																zIndex: 10,
																textShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
															}}
															onAnimationComplete={() => {
																clearAnimations(index);
															}}
														>
															+{clickNewCoins}
														</motion.div>
													)}
												</AnimatePresence>
											))}
											<div className='mainContent__imageContainer'>
												<img
													src={boostPhase ? tigranCircle : tigranCircle}
													draggable='false'
													alt='Tigran animation'
												/>
											</div>
										</div>
									) : (
										<div
											className='mainContent__clickArea'
											onClick={isDesktop() ? coinClicker : null}
											onTouchStart={handleTouchStart}
											onTouchEnd={(e) => handleTouchEnd(e.touches[0], e)}
										>
											{animations.map((anim, index) => (
												<AnimatePresence key={index}>
													{isAnimationActive && (
														<motion.div
															className='clickerAnimation'
															initial={{ opacity: 1, y: 0 }}
															animate={{ opacity: [1, 0], y: [-30, -120] }}
															exit={{ opacity: 0 }}
															transition={{ duration: 2 }}
															style={{
																fontSize: '45px',
																left: `${anim.x}px`,
																top: `${anim.y}px`,
																position: 'absolute',
																color: boostPhase ? '#FFDA17' : '#000',
																zIndex: 10,
																textShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
															}}
															onAnimationComplete={() => {
																clearAnimations(index);
															}}
														>
															+{clickNewCoins}
														</motion.div>
													)}
												</AnimatePresence>
											))}
											<div className='mainContent__imageContainer'>
												<img
													src={boostPhase ? tigranCircle : tigranCircle}
													draggable='false'
													alt='Tigran animation'
												/>
											</div>
										</div>
									)}
									{!gamePaused && (
										<div className='mainContent__totalPoints'>
											<div className='mainContent__totalPoints-img' draggable='false'>
												<img src={tigranCircle} draggable='false' />
											</div>
											<div className='mainContent__totalPoints-text'>
												<span>For Session</span>
												<div className='blackLine'></div>
												<div className='mainContent__totalPoints-coins'>{currCoins}</div>
											</div>
										</div>
									)}
								</>
							)}
						</>
					)}
					<h1>My React App</h1>
					<button onClick={openModal}>Show Modal</button>
					<Modal
						modalText='This is a modal window'
						modalVisible={isModalVisible}
						onClose={closeModal}
					/>
				</div>
			</div>
		</div>
	);
};

export default MainContent;
