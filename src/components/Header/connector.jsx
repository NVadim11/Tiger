import React from 'react';
import { SendTransactionRequest, TonConnect, UserRejectsError, WalletInfo, WalletInfoInjected } from '@tonconnect/sdk';
import { notification } from 'antd';
import { isMobile, openLink } from 'src/utils';

const dappMetadata = {
	manifestUrl:
		'https://tg.tema.cash/tonconnect/tonconnect-manifest.json',
};

export const connector = new TonConnect(dappMetadata);

export async function sendTransaction(tx, wallet) {
	try {
		if ('universalLink' in wallet && !wallet.embedded && isMobile()) {
			openLink(addReturnStrategy(wallet.universalLink, 'none'), '_blank');
		}

		const result = await connector.sendTransaction(tx);
		notification.success({
			message: 'Successful transaction',
			description:
				'Your transaction was successfully sent. Please wait until the transaction is included in the TON blockchain.',
			duration: 5,
		});
		console.log(`Send tx result: ${JSON.stringify(result)}`);
		return result;
	} catch (e) {
		let message = 'Send transaction error';
		let description = '';

		if (typeof e === 'object' && e instanceof UserRejectsError) {
			message = 'You rejected the transaction';
			description = 'Please try again and confirm the transaction in your wallet.';
		}

		notification.error({
			message,
			description,
		});
		console.log(e);
		throw e;
	}
}

export function addReturnStrategy(url, returnStrategy) {
	const link = new URL(url);
	link.searchParams.append('ret', returnStrategy);
	return link.toString();
}
