import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import AppRouter from './components/Router';
// import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      {/* <TonConnectUIProvider 
        manifestUrl="https://tg.tema.cash/tonconnect-manifest.json"
         walletsListConfiguration={{
          includeWallets: [
            {
              appName: "telegram-wallet",
              name: "Wallet",
              imageUrl: "https://wallet.tg/images/logo-288.png",
              aboutUrl: "https://wallet.tg/",
              universalLink: "https://t.me/wallet?attach=wallet",
              bridgeUrl: "https://bridge.ton.space/bridge",
              platforms: ["ios", "android", "macos", "windows", "linux"]
            },
            {
              appName: "tonkeeper",
              name: "Tonkeeper",
              imageUrl: "https://tonkeeper.com/assets/tonconnect-icon.png",
              tondns: "tonkeeper.ton",
              aboutUrl: "https://tonkeeper.com",
              universalLink: "https://app.tonkeeper.com/ton-connect",
              deepLink: "tonkeeper-tc://",
              bridgeUrl: ["https://bridge.tonapi.io/bridge", "tonkeeper"],
              platforms: ["ios", "android", "chrome", "firefox", "macos"]
            },
            {
              appName: "mytonwallet",
              name: "MyTonWallet",
              imageUrl: "https://mytonwallet.io/icon-256.png",
              aboutUrl: "https://mytonwallet.io",
              universalLink: "https://connect.mytonwallet.org",
              bridgeUrl: ["mytonwallet", "https://tonconnectbridge.mytonwallet.org/bridge/"],
              platforms: ["chrome", "windows", "macos", "linux", "ios", "android", "firefox"]
            },
            {
              appName: "openmask",
              name: "OpenMask",
              imageUrl: "https://raw.githubusercontent.com/OpenProduct/openmask-extension/main/public/openmask-logo-288.png",
              aboutUrl: "https://www.openmask.app/",
              bridgeUrl: "openmask",
              platforms: ["chrome"]
            },
            {
              appName: "tonhub",
              name: "Tonhub",
              imageUrl: "https://tonhub.com/tonconnect_logo.png",
              aboutUrl: "https://tonhub.com",
              universalLink: "https://tonhub.com/ton-connect",
              bridgeUrl: ["tonhub", "https://connect.tonhubapi.com/tonconnect"],
              platforms: ["ios", "android"]
            },
            {
              appName: "dewallet",
              name: "DeWallet",
              imageUrl: "https://raw.githubusercontent.com/delab-team/manifests-images/main/WalletAvatar.png",
              aboutUrl: "https://delabwallet.com",
              universalLink: "https://t.me/dewallet?attach=wallet",
              bridgeUrl: "https://sse-bridge.delab.team/bridge",
              platforms: ["ios", "android"]
            },
            {
              appName: "xtonwallet",
              name: "XTONWallet",
              imageUrl: "https://xtonwallet.com/assets/img/icon-256-back.png",
              aboutUrl: "https://xtonwallet.com",
              bridgeUrl: "xtonwallet",
              platforms: ["chrome", "firefox"]
            },
            {
              appName: "tonwallet",
              name: "TON Wallet",
              imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
              aboutUrl: "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
              bridgeUrl: "tonwallet",
              platforms: ["chrome"]
            },
            {
              appName: "bitgetTonWallet",
              name: "Bitget Wallet",
              imageUrl: "https://raw.githubusercontent.com/bitkeepwallet/download/main/logo/png/bitget_wallet_logo_0_gas_fee.png",
              aboutUrl: "https://web3.bitget.com",
              deepLink: "bitkeep://",
              bridgeUrl: ["bitgetTonWallet", "https://bridge.tonapi.io/bridge"],
              platforms: ["ios", "android", "chrome"],
              universalLink: "https://bkcode.vip/ton-connect"
            },
            {
              appName: "safepalwallet",
              name: "SafePal",
              imageUrl: "https://s.pvcliping.com/web/public_image/SafePal_x288.png",
              aboutUrl: "https://www.safepal.com",
              universalLink: "https://link.safepal.io/ton-connect",
              deepLink: "safepal-tc://",
              bridgeUrl: ["https://ton-bridge.safepal.com/tonbridge/v1/bridge", "safepalwallet"],
              platforms: ["ios", "android", "chrome", "firefox"]
            }
          ]
        }}
        actionsConfiguration={{
          twaReturnUrl: 'https://t.me/WebAppWalletBot/tigr_run_bot'
        }}
      > */}
        <AppRouter />
      {/* </TonConnectUIProvider> */}
    </Provider>
  );
}

export default App;
    