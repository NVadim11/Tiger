import bcrypt from 'bcryptjs';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import {
	useChangeWalletMutation,
	usePassDailyMutation,
	usePassPartnersMutation,
	usePassTaskMutation,
	useSetWalletMutation,
} from '../../services/phpService';

import cross from '../../img/cross.svg';
import tigerCoin from '../../img/Tigran_full.webp';
import visitWeb from '../../img/visit_website.svg';
import visitTGchannel from '../../img/visit_TG-channel.svg';
import visitTGchat from '../../img/visit_TG-chat.svg';
import visitX from '../../img/visit_X.svg';
import Modal from '../Modal/Modal';
import './Footer.scss';

const Footer = ({ user }) => {
	const tg = window.Telegram.WebApp;
	const userId = tg.initDataUnsafe?.user?.id;
	const [isVisible, setIsVisible] = useState(false);
	const [tasksOpen, setTasksOpen] = useState(false);
	const [passTask] = usePassTaskMutation();
	const [setWallet] = useSetWalletMutation();
	const [changeWallet] = useChangeWalletMutation();
	const [walletVaL, setWalletVal] = useState('');
	const [walletInputDisabled, setWalletInputDisabled] = useState(false);
	const [resetBtnDisabled, setResetBtnDisabled] = useState(false); // false?
	const [activeTab, setActiveTab] = useState(0);
	const [passDaily] = usePassDailyMutation();
	const [passPartners] = usePassPartnersMutation();

	const [inputFirst, setInputFirst] = useState(true);
	const [inputSecond, setInputSecond] = useState(false);

	const toggleFirst = () => {
		setInputFirst(true);
		setInputSecond(false);
	};

	const toggleSecond = () => {
		setInputFirst(false);
		setInputSecond(true);
	};

	const dailyTasksObj = user?.daily_quests;
	const partnerTaskObj = user?.partners_quests;

	const [twitterQuest, setTwitterQuest] = useState(user?.twitter);
	const [tgChatQuest, setTgChatQuest] = useState(user?.tg_chat);
	const [tgChannelQuest, setTgChannelQuest] = useState(user?.tg_channel);
	const [websiteQuest, setWebsiteQuest] = useState(user?.website);
	const [dailyQuests, setDailyQuests] = useState(dailyTasksObj);
	const [partnerQuests, setPartnerQuests] = useState(partnerTaskObj);

	// aws
	const secretKey = process.env.REACT_APP_SECRET_KEY;

	useEffect(() => {
		setTwitterQuest(user?.twitter);
		setTgChatQuest(user?.tg_chat);
		setTgChannelQuest(user?.tg_channel);
		setWebsiteQuest(user?.website);
		setPartnerQuests(partnerTaskObj);
		setDailyQuests(dailyTasksObj);
	}, [user]);

	const popupTasksTgl = tasksOpen ? 'popupTasks_show' : null;
	const popupTasks = `popupTasks ${popupTasksTgl}`;

	const handleTabClick = (index) => {
		setActiveTab(index);
	};

	const options = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'UTC',
	};
	const now = new Date();
	const dateStringWithTime = now.toLocaleString('en-GB', options);

	useEffect(() => {
		if (!user?.wallet_address) {
			toggleFirst();
		} else {
			toggleSecond();
			setWalletVal(user?.wallet_address);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			const updateGameStatus = () => {
				// Get the current time in Frankfurt time zone ('Etc/GMT-3')
				const currentTimeStamp = moment.tz('UTC').unix();
				const remainingTime = user?.update_wallet_at - currentTimeStamp;
				if (remainingTime >= 1) {
					if (remainingTime <= 0 || user.update_wallet_at === null) {
						setResetBtnDisabled(false);
					} else {
						setResetBtnDisabled(true);
						setWalletInputDisabled(true);
					}
				}
			};

			const timer = setInterval(() => {
				updateGameStatus();
			}, 1000);

			return () => {
				clearInterval(timer);
			};
		}
	}, [user]);

	const resetWalletEnabler = () => {
		setWalletInputDisabled(false);
		setWalletVal('');
		toggleFirst();
	};

	const tasksBtn = () => {
		fadeShow();
		setTimeout(() => {
			setTasksOpen(true);
		}, 250);
	};

	const fadeShow = () => {
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const footerTag = document.getElementById('footer');
		const bgTag = document.getElementById('bgImage');
		if (htmlTag) htmlTag.classList.add('popupTasks-show');
		if (headerTag) headerTag.classList.add('show-blur');
		if (mainTag) mainTag.classList.add('show-blur');
		if (footerTag) footerTag.classList.add('show-blur');
		if (bgTag) bgTag.classList.add('h100');
	};

	const tasksCloseToggler = () => {
		setTasksOpen(false);
		const htmlTag = document.getElementById('html');
		const headerTag = document.getElementById('header');
		const mainTag = document.getElementById('main');
		const footerTag = document.getElementById('footer');
		const bgTag = document.getElementById('bgImage');
		if (htmlTag) htmlTag.classList.remove('popupTasks-show');
		if (headerTag) headerTag.classList.remove('show-blur');
		if (mainTag) mainTag.classList.remove('show-blur');
		if (footerTag) footerTag.classList.remove('show-blur');
		if (bgTag) bgTag.classList.remove('h100');
	};

	const walletSubmitHandler = () => {
		if (!user?.wallet_address) {
			submitWallet();
		} else {
			resetWallet();
		}
	};

	const twitterClick = async () => {
		// tg.openLink('#');
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'twitter',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				// Update quest status to completed (status: 1)
				setTwitterQuest(1);
				setModalText('Task completed successfully.');
				openModal();
				blurPopupTasks();
				setModalType('green');
			} else {
				setModalText('An error occurred. Please try again later.');
				openModal();
				blurPopupTasks();
				setModalType('red');
			}
		} catch (e) {
			setModalText('An error occurred. Please try again later.');
			openModal();
			blurPopupTasks();
			setModalType('red');
		}
	};

	const tgClickChat = async () => {
		// tg.openLink('#');
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'tg_chat',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				// Update quest status to completed (status: 1)
				setTgChatQuest(1);
				setModalText('Task completed successfully.');
				openModal();
				blurPopupTasks();
				setModalType('green');
			} else {
				setModalText('An error occurred. Please try again later.');
				openModal();
				blurPopupTasks();
				setModalType('red');
			}
		} catch (e) {
			setModalText('An error occurred. Please try again later.');
			openModal();
			blurPopupTasks();
			setModalType('red');
		}
	};

	const tgClickChannel = async () => {
		// tg.openLink('#');
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'tg_channel',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				// Update quest status to completed (status: 1)
				setTgChannelQuest(1);
				setModalText('Task completed successfully.');
				openModal();
				blurPopupTasks();
				setModalType('green');
			} else {
				setModalText('An error occurred. Please try again later.');
				openModal();
				blurPopupTasks();
				setModalType('red');
			}
		} catch (e) {
			setModalText('An error occurred. Please try again later.');
			openModal();
			blurPopupTasks();
			setModalType('red');
		}
	};

	const websiteClick = async () => {
		// tg.openLink('#');
		try {
			await passTask({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				id_telegram: user?.id_telegram,
				task: 'website',
			}).unwrap();
			const res = { success: true };
			if (res.success) {
				// Update quest status to completed (status: 1)
				setWebsiteQuest(1);
				setModalText('Task completed successfully.');
				openModal();
				blurPopupTasks();
				setModalType('green');
			} else {
				setModalText('An error occurred. Please try again later.');
				openModal();
				blurPopupTasks();
				setModalType('red');
			}
		} catch (e) {
			setModalText('An error occurred. Please try again later.');
			openModal();
			blurPopupTasks();
			setModalType('red');
		}
	};

	const blurPopupTasks = () => {
		const popupTasks = document.getElementById('popupTasks');
		if (popupTasks) popupTasks.classList.add('show-blur');
		const footerTag = document.getElementById('footer');
		if (footerTag) footerTag.classList.add('show-blur');
	};

	const submitWallet = async () => {
		if (walletVaL) {
			try {
				const res = await setWallet({
					token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
					wallet_address: walletVaL,
					id_telegram: user?.id_telegram,
				}).unwrap();
				setResetBtnDisabled(true);
				setWalletInputDisabled(true);
				setModalText('Wallet submitted successfully.');
				openModal();
				blurPopupTasks();
				toggleSecond();
				setModalType('green');
			} catch (e) {
				setModalText('This wallet is already in use.');
				openModal();
				blurPopupTasks();
				setModalType('red');
			}
		}
	};

	const resetWallet = async () => {
		if (walletVaL) {
			try {
				const res = await changeWallet({
					token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
					wallet_address: walletVaL,
					user_id: user?.id,
				}).unwrap();
				setResetBtnDisabled(true);
				setWalletInputDisabled(true);
				setModalText('Wallet changed successfully.');
				openModal();
				blurPopupTasks();
				toggleSecond();
				setModalType('green');
			} catch (e) {
				setModalText('This wallet is already in use.');
				openModal();
				blurPopupTasks();
				setModalType('red');
			}
		}
	};

	const passDailyHandler = async (taskId, link) => {
		if (link !== null) {
			tg.openLink(link);
		}
		try {
			await passDaily({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				user_id: user?.id,
				daily_quest_id: taskId,
			}).unwrap();

			const res = { success: true };

			if (res.success) {
				// Update quest status to completed (status: 1)
				updateDailyQStatus(taskId, 1);
				setModalText('Task completed successfully.');
				openModal();
				blurPopupTasks();
				setModalType('green');
			} else {
				setModalText('An error occurred. Please try again later.');
				openModal();
				blurPopupTasks();
				setModalType('red');
			}
		} catch (e) {
			setModalText('An error occurred. Please try again later.');
			openModal();
			blurPopupTasks();
			setModalType('red');
		}
	};

	const updateDailyQStatus = (taskId, status) => {
		// Update the quest status in state
		setDailyQuests((prevQuests) =>
			prevQuests.map((quest) =>
				quest.id === taskId ? { ...quest, status: status } : quest
			)
		);
	};

	const partnersTaskHandler = async (taskId, link) => {
		if (link !== null) {
			tg.openLink(link);
		}
		try {
			await passPartners({
				token: await bcrypt.hash(secretKey + dateStringWithTime, 10),
				user_id: user?.id,
				partners_quest_id: taskId,
			}).unwrap();

			const res = { success: true };

			if (res.success) {
				// Update quest status to completed (status: 1)
				updatePartnerQStatus(taskId, 1);
				setModalText('Task completed successfully.');
				openModal();
				blurPopupTasks();
				setModalType('green');
			} else {
				setModalText('An error occurred. Please try again later.');
				openModal();
				blurPopupTasks();
				setModalType('red');
			}
		} catch (e) {
			setModalText('An error occurred. Please try again later.');
			openModal();
			blurPopupTasks();
			setModalType('red');
		}
	};

	const updatePartnerQStatus = (taskId, status) => {
		// Update the quest status in state
		setPartnerQuests((prevQuests) =>
			prevQuests.map((quest) =>
				quest.id === taskId ? { ...quest, status: status } : quest
			)
		);
	};

	// Modal logic
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [modalText, setModalText] = useState('');
	const [modalType, setModalType] = useState('green'); // Default modal type
	const [buttonText, setButtonText] = useState('');

	const openModal = (type, text, btnText) => {
		setModalType(type);
		setModalText(text);
		setButtonText(btnText);
		setIsModalVisible(true);
	};

	const closeModal = () => {
		setIsModalVisible(false);
		const popupTasks = document.getElementById('popupTasks');
		if (popupTasks) popupTasks.classList.remove('show-blur');
	};

	const handleModalButtonClick = () => {
		alert('Button inside modal clicked');
	};

	return (
		<>
			<footer id='footer' className='footerMain'>
				<div className='footerMain__container'>
					<div className='footerMain__activities'>
						<div className='footerMain__activitiesBtn'>
							<button onClick={tasksBtn}>
								<svg
									width='21'
									height='20'
									viewBox='0 0 21 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<g clip-path='url(#clip0_603_983)'>
										<path
											d='M15.024 0H6.64398C3.00398 0 0.833984 2.17 0.833984 5.81V14.19C0.833984 17.83 3.00398 20 6.64398 20H15.024C18.664 20 20.834 17.83 20.834 14.19V5.81C20.834 2.17 18.664 0 15.024 0ZM8.80398 12.9L6.55398 15.15C6.40398 15.3 6.21398 15.37 6.02398 15.37C5.83398 15.37 5.63398 15.3 5.49398 15.15L4.74398 14.4C4.44398 14.11 4.44398 13.63 4.74398 13.34C5.03398 13.05 5.50398 13.05 5.80398 13.34L6.02398 13.56L7.74398 11.84C8.03398 11.55 8.50398 11.55 8.80398 11.84C9.09398 12.13 9.09398 12.61 8.80398 12.9ZM8.80398 5.9L6.55398 8.15C6.40398 8.3 6.21398 8.37 6.02398 8.37C5.83398 8.37 5.63398 8.3 5.49398 8.15L4.74398 7.4C4.44398 7.11 4.44398 6.63 4.74398 6.34C5.03398 6.05 5.50398 6.05 5.80398 6.34L6.02398 6.56L7.74398 4.84C8.03398 4.55 8.50398 4.55 8.80398 4.84C9.09398 5.13 9.09398 5.61 8.80398 5.9ZM16.394 14.62H11.144C10.734 14.62 10.394 14.28 10.394 13.87C10.394 13.46 10.734 13.12 11.144 13.12H16.394C16.814 13.12 17.144 13.46 17.144 13.87C17.144 14.28 16.814 14.62 16.394 14.62ZM16.394 7.62H11.144C10.734 7.62 10.394 7.28 10.394 6.87C10.394 6.46 10.734 6.12 11.144 6.12H16.394C16.814 6.12 17.144 6.46 17.144 6.87C17.144 7.28 16.814 7.62 16.394 7.62Z'
											fill='white'
										/>
									</g>
									<defs>
										<clipPath id='clip0_603_983'>
											<rect
												width='20'
												height='20'
												fill='white'
												transform='translate(0.833984)'
											/>
										</clipPath>
									</defs>
								</svg>
								<span>Tasks</span>
							</button>
						</div>
						<div className='footerMain__activitiesBtn'>
							<button style={{ cursor: 'not-allowed' }} disabled>
								<span>Coming soon</span>
							</button>
						</div>
						<div className='footerMain__activitiesBtn'>
							<button style={{ cursor: 'not-allowed' }} disabled>
								<span>Coming soon</span>
							</button>
						</div>
					</div>
				</div>
			</footer>
			{tasksOpen && (
				<div id='popupTasks' aria-hidden='true' className={popupTasks}>
					<div className='popupTasks__wrapper'>
						<div className='popupTasks__content'>
							<button
								onClick={tasksCloseToggler}
								type='button'
								className='popupTasks__close'
							>
								<img src={cross} />
							</button>
							<div className='popupTasks__title'>
								<h4>Complete tasks and get rewarded!</h4>
							</div>
							<div className='popupTasks__coins'>
								<div className='popupTasks__coinBox'>
									{/* {user?.wallet_balance && ( */}
									<>
										<div className='popupTasks__coinImg' draggable='false'>
											<img src={tigerCoin} alt='Tigran coin' />
										</div>
										<div className='popupTasks__coinAmount'>
											{/* <span id='coinAmount'>{user?.wallet_balance}</span> */}
											<span id='coinAmount'>1233121</span>
										</div>
									</>
									{/* )} */}
								</div>
							</div>
							<div className='popupTasks__tabs-btns'>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 0 ? 'active' : ''}`}
									onClick={() => handleTabClick(0)}
								>
									<button>Social</button>
								</div>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 1 ? 'active' : ''}`}
									onClick={
										user?.wallet_address
											? () => handleTabClick(1)
											: () => {
													setModalText('Submit your wallet first.');
													openModal();
													blurPopupTasks();
											  }
									}
								>
									<button>Daily</button>
									{/* <div className='footerMain__activitiesHint'>Coming Soon</div> */}
								</div>
								<div
									className={`popupTasks__tabs-btn ${activeTab === 2 ? 'active' : ''}`}
									onClick={
										user?.wallet_address
											? () => handleTabClick(2)
											: () => {
													setModalText('Submit your wallet first.');
													openModal();
													blurPopupTasks();
											  }
									}
								>
									<button>Partnership</button>
									{/* <div className='footerMain__activitiesHint'>Coming Soon</div> */}
								</div>
							</div>
							<div className={`popupTasks__tasks ${activeTab === 0 ? 'active' : ''}`}>
								<div className='popupTasks__walletTask'>
									{inputFirst && (
										<>
											<div className='popupTasks__walletTask-title'>
												<span>Current wallet</span>
											</div>
											<div className='popupTasks__walletTask-input'>
												<input
													type='text'
													placeholder='Enter Solana Wallet Address'
													value={walletVaL}
													onChange={(e) => setWalletVal(e.target.value)}
													disabled={walletInputDisabled === true}
												/>
												<button
													className='popupTasks__walletTask-inputBtn'
													onClick={walletSubmitHandler}
													// disabled={walletInputDisabled === true}
												>
													<svg
														width='24'
														height='24'
														viewBox='0 0 24 24'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<g clip-path='url(#clip0_438_3037)'>
															<path
																d='M21.5966 4.90886C19.3742 2.00582 15.9949 0.34082 12.3252 0.34082C9.74522 0.34082 7.2987 1.16969 5.24998 2.73793C4.50871 3.30544 3.83811 3.96166 3.2543 4.68594L2.73374 1.73736C2.67675 1.41491 2.36892 1.19925 2.04678 1.25656L0.48984 1.53135C0.334977 1.5587 0.197346 1.64645 0.107148 1.77523C0.0169488 1.90408 -0.0183086 2.06337 0.00904354 2.21824L1.2459 9.22457C1.29673 9.51217 1.54685 9.71454 1.82907 9.71454C1.8633 9.71454 1.898 9.71154 1.93286 9.70537L8.93928 8.46852C9.26173 8.4116 9.47699 8.10408 9.42008 7.78163L9.14521 6.22469C9.11786 6.06983 9.03019 5.9322 8.90133 5.842C8.77248 5.7518 8.61319 5.71662 8.45832 5.7439L5.53868 6.25932C5.94936 5.77393 6.41419 5.33116 6.9319 4.93487C8.49413 3.73905 10.3597 3.10702 12.327 3.10702C15.1269 3.10702 17.7048 4.37684 19.3997 6.59078C20.8437 8.47697 21.4666 10.8127 21.1539 13.1675C20.8411 15.5224 19.63 17.6145 17.7437 19.0584C16.1771 20.2577 14.3144 20.8916 12.3572 20.8916C11.9622 20.8916 11.5618 20.865 11.1669 20.8126C8.81208 20.4999 6.71996 19.2889 5.27599 17.4025C4.39708 16.2545 3.80641 14.8998 3.56775 13.485C3.54158 13.33 3.45486 13.1917 3.32672 13.1005C3.19865 13.0094 3.03944 12.973 2.88442 12.999L1.32542 13.262C1.00257 13.3165 0.785022 13.6224 0.83941 13.9453C1.15269 15.8026 1.92709 17.5797 3.07897 19.0844C4.97211 21.5575 7.71515 23.1453 10.8025 23.5554C11.3191 23.624 11.8433 23.6588 12.3605 23.6588C14.9286 23.6588 17.3716 22.8276 19.4253 21.2554C21.8985 19.3623 23.4863 16.6192 23.8964 13.5317C24.3067 10.4443 23.4899 7.38194 21.5966 4.90886Z'
																fill='white'
															/>
														</g>
														<defs>
															<clipPath id='clip0_438_3037'>
																<rect width='24' height='24' fill='white' />
															</clipPath>
														</defs>
													</svg>
												</button>
											</div>
										</>
									)}
									{inputSecond && (
										<>
											<div className='popupTasks__walletTask-title'>
												<span>Current wallet</span>
											</div>
											<div className='popupTasks__walletTask-input'>
												<input type='text' value={walletVaL} disabled />
												<button
													className='popupTasks__walletTask-inputBtn'
													onClick={resetWalletEnabler}
													disabled={resetBtnDisabled === true}
												>
													<svg
														width='24'
														height='24'
														viewBox='0 0 24 24'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<g clip-path='url(#clip0_5228_4127)'>
															<path
																d='M21.5966 4.90886C19.3742 2.00582 15.9949 0.34082 12.3252 0.34082C9.74522 0.34082 7.2987 1.16969 5.24998 2.73793C4.50871 3.30544 3.83811 3.96166 3.2543 4.68594L2.73374 1.73736C2.67675 1.41491 2.36892 1.19925 2.04678 1.25656L0.48984 1.53135C0.334977 1.5587 0.197346 1.64645 0.107148 1.77523C0.0169488 1.90408 -0.0183086 2.06337 0.00904354 2.21824L1.2459 9.22457C1.29673 9.51217 1.54685 9.71454 1.82907 9.71454C1.8633 9.71454 1.898 9.71154 1.93286 9.70537L8.93928 8.46852C9.26173 8.4116 9.47699 8.10408 9.42008 7.78163L9.14521 6.22469C9.11786 6.06983 9.03019 5.9322 8.90133 5.842C8.77248 5.7518 8.61319 5.71662 8.45832 5.7439L5.53868 6.25932C5.94936 5.77393 6.41419 5.33116 6.9319 4.93487C8.49413 3.73905 10.3597 3.10702 12.327 3.10702C15.1269 3.10702 17.7048 4.37684 19.3997 6.59078C20.8437 8.47697 21.4666 10.8127 21.1539 13.1675C20.8411 15.5224 19.63 17.6145 17.7437 19.0584C16.1771 20.2577 14.3144 20.8916 12.3572 20.8916C11.9622 20.8916 11.5618 20.865 11.1669 20.8126C8.81208 20.4999 6.71996 19.2889 5.27599 17.4025C4.39708 16.2545 3.80641 14.8998 3.56775 13.485C3.54158 13.33 3.45486 13.1917 3.32672 13.1005C3.19865 13.0094 3.03944 12.973 2.88442 12.999L1.32542 13.262C1.00257 13.3165 0.785022 13.6224 0.83941 13.9453C1.15269 15.8026 1.92709 17.5797 3.07897 19.0844C4.97211 21.5575 7.71515 23.1453 10.8025 23.5554C11.3191 23.624 11.8433 23.6588 12.3605 23.6588C14.9286 23.6588 17.3716 22.8276 19.4253 21.2554C21.8985 19.3623 23.4863 16.6192 23.8964 13.5317C24.3067 10.4443 23.4899 7.38194 21.5966 4.90886Z'
																fill='white'
															/>
														</g>
														<defs>
															<clipPath id='clip0_5228_4127'>
																<rect width='24' height='24' fill='white' />
															</clipPath>
														</defs>
													</svg>
												</button>
											</div>
										</>
									)}
									<div className='popupTasks__walletTask-box'>
										<div className='popupTasks__walletTask-right'>
											<div className='popupTasks__walletTask-rightHint'>
												<span>*it can be done once every 3 days</span>
											</div>
										</div>
										{!user?.wallet_address ? (
											<div className='popupTasks__walletTask-left'>
												<p>+20000</p>
											</div>
										) : (
											''
										)}
									</div>
								</div>
								<div className='popupTasks__task'>
									<button onClick={twitterClick} disabled={twitterQuest === 1}>
										<div className='popupTasks__task-img'>
											<img src={visitX} alt='visitX' />
										</div>
										Follow Twitter
										{user?.twitter === 0 ? (
											<p>+10000 </p>
										) : (
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_438_3053)'>
													<path
														d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
														fill='#2CB726'
													/>
												</g>
												<defs>
													<clipPath id='clip0_438_3053'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={tgClickChat} disabled={tgChatQuest === 1}>
										<div className='popupTasks__task-img'>
											<img src={visitTGchat} alt='TG chat' />
										</div>
										Follow TG Chat
										{user?.tg_chat === 0 ? (
											<p>+10000 </p>
										) : (
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_438_3053)'>
													<path
														d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
														fill='#2CB726'
													/>
												</g>
												<defs>
													<clipPath id='clip0_438_3053'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={tgClickChannel} disabled={tgChannelQuest === 1}>
										<div className='popupTasks__task-img'>
											<img src={visitTGchannel} alt='TG channel' />
										</div>
										Follow TG Channel
										{user?.tg_channel === 0 ? (
											<p>+10000 </p>
										) : (
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_438_3053)'>
													<path
														d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
														fill='#2CB726'
													/>
												</g>
												<defs>
													<clipPath id='clip0_438_3053'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
								<div className='popupTasks__task'>
									<button onClick={websiteClick} disabled={websiteQuest === 1}>
										<div className='popupTasks__task-img'>
											<img src={visitWeb} alt='Website' />
										</div>
										Visit Website
										{user?.website === 0 ? (
											<p>+3000 </p>
										) : (
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<g clip-path='url(#clip0_438_3053)'>
													<path
														d='M12 0C5.38346 0 0 5.38346 0 12C0 18.6165 5.38346 24 12 24C18.6165 24 24 18.6165 24 12C24 5.38346 18.6165 0 12 0ZM18.7068 8.84211L11.0376 16.4511C10.5865 16.9023 9.86466 16.9323 9.38346 16.4812L5.32331 12.782C4.84211 12.3308 4.81203 11.5789 5.23308 11.0977C5.68421 10.6165 6.43609 10.5865 6.91729 11.0376L10.1353 13.985L16.9925 7.12782C17.4737 6.64662 18.2256 6.64662 18.7068 7.12782C19.188 7.60902 19.188 8.3609 18.7068 8.84211Z'
														fill='#2CB726'
													/>
												</g>
												<defs>
													<clipPath id='clip0_438_3053'>
														<rect width='24' height='24' fill='white' />
													</clipPath>
												</defs>
											</svg>
										)}
									</button>
								</div>
							</div>
							<div className={`popupTasks__tasks ${activeTab === 1 ? 'active' : ''}`}>
								{/* Render quests dynamically based on their status */}
								{dailyQuests && dailyQuests.length > 0 && (
									<>
										{dailyQuests.map((quest) => (
											<div className='popupTasks__task' key={quest.id}>
												{/* Conditionally render button or div */}
												{quest.required_amount === 0 && quest.required_referrals === 0 ? (
													<button
														disabled={quest.status === 1}
														onClick={() =>
															passDailyHandler(quest.id, quest.daily_quest.link)
														}
													>
														<span>{quest.daily_quest.name}</span>
														{quest.status === 0 ? (
															<p className='popupTasks__task-rew'>
																+{quest.reward}{' '}
																<img
																	className='rewardCoin'
																	alt='animation'
																	draggable='false'
																/>
															</p>
														) : (
															<svg
																width='24'
																height='24'
																viewBox='0 0 24 24'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'
															>
																<path
																	d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
																	stroke='white'
																	stroke-width='2'
																	stroke-linejoin='round'
																/>
																<path
																	d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
																	stroke='white'
																	stroke-width='2'
																	stroke-linecap='round'
																	stroke-linejoin='round'
																/>
															</svg>
														)}
													</button>
												) : (
													<button
														disabled={quest.status === 1}
														style={
															quest.required_amount > 0 || quest.required_referrals > 0
																? { paddingBottom: '24px' }
																: {}
														}
													>
														<span>{quest.daily_quest.name}</span>
														{quest.status === 0 ? (
															<p className='popupTasks__task-rew'>
																+{quest.reward}{' '}
																<img
																	className='rewardCoin'
																	alt='animation'
																	draggable='false'
																/>
															</p>
														) : (
															<svg
																width='24'
																height='24'
																viewBox='0 0 24 24'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'
															>
																<path
																	d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
																	stroke='white'
																	stroke-width='2'
																	stroke-linejoin='round'
																/>
																<path
																	d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
																	stroke='white'
																	stroke-width='2'
																	stroke-linecap='round'
																	stroke-linejoin='round'
																/>
															</svg>
														)}
													</button>
												)}
												{(quest.required_amount > 0 || quest.required_referrals > 0) && (
													<div className='popupTasks__progressBar'>
														<progress
															max={quest.required_amount || quest.required_referrals}
															value={quest.amount || quest.referrals}
														></progress>
													</div>
												)}
											</div>
										))}
									</>
								)}
							</div>
							<div className={`popupTasks__tasks ${activeTab === 2 ? 'active' : ''}`}>
								{/* Render quests dynamically based on their status */}
								{partnerQuests && partnerQuests.length > 0 && (
									<>
										{partnerQuests
											.filter((quest) => quest.partners_quest.vis === 1)
											.map((quest) => (
												<div className='popupTasks__task'>
													<button
														disabled={quest.status === 1}
														onClick={() =>
															partnersTaskHandler(quest.id, quest.partners_quest.link)
														}
													>
														<span>{quest.partners_quest.name}</span>
														{quest.status === 0 ? (
															<p className='popupTasks__task-rew'>
																+{quest.reward}{' '}
																<img
																	className='rewardCoin'
																	alt='animation'
																	draggable='false'
																/>
															</p>
														) : (
															<svg
																width='24'
																height='24'
																viewBox='0 0 24 24'
																fill='none'
																xmlns='http://www.w3.org/2000/svg'
															>
																<path
																	d='M12 23C13.4448 23.0019 14.8758 22.7182 16.2106 22.1653C17.5454 21.6124 18.7578 20.8011 19.7781 19.7781C20.8011 18.7578 21.6124 17.5454 22.1653 16.2106C22.7182 14.8758 23.0019 13.4448 23 12C23.0019 10.5552 22.7182 9.12427 22.1652 7.78945C21.6123 6.45462 20.8011 5.24222 19.7781 4.22191C18.7578 3.19893 17.5454 2.38766 16.2106 1.83474C14.8758 1.28181 13.4448 0.998137 12 1.00001C10.5552 0.998167 9.12427 1.28186 7.78945 1.83478C6.45462 2.3877 5.24222 3.19895 4.22191 4.22191C3.19895 5.24222 2.3877 6.45462 1.83478 7.78945C1.28186 9.12427 0.998167 10.5552 1.00001 12C0.998137 13.4448 1.28181 14.8758 1.83474 16.2106C2.38766 17.5454 3.19893 18.7578 4.22191 19.7781C5.24222 20.8011 6.45462 21.6123 7.78945 22.1652C9.12427 22.7182 10.5552 23.0019 12 23Z'
																	stroke='white'
																	stroke-width='2'
																	stroke-linejoin='round'
																/>
																<path
																	d='M7.59961 11.9992L10.8996 15.2992L17.4996 8.69922'
																	stroke='white'
																	stroke-width='2'
																	stroke-linecap='round'
																	stroke-linejoin='round'
																/>
															</svg>
														)}
													</button>
												</div>
											))}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			<Modal
				modalText={modalText}
				modalVisible={isModalVisible}
				onClose={closeModal}
				modalType={modalType}
				buttonText={buttonText}
				onButtonClick={handleModalButtonClick}
			/>
		</>
	);
};

export default Footer;
