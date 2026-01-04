# Project Overview

- wemint.app is a digital product studio; “mint” means “create.”
- This repo is the main site (landing) plus the first product, Mintcoin.
- Intent: the studio is for creating new things; more “mint” products will follow.

## Main Pages

- `index.html` = main landing page for wemint.app (brand intro + animations).
- `mintcoin.html` = Mintcoin product UI (tabs: New coin / Created coin).

## UI Files

- `styles.css` styles `index.html`.
- `mintcoin.css` styles `mintcoin.html` (IBM Plex Mono, dark mono UI).
- `mintcoin.js` handles tabs, MetaMask connect, image preview, and calling `createCoin`.

## Smart Contracts

- `contracts/MintCoin.sol` = ERC20 with mintable/burnable/pausable/ownable + optional cap.
- `contracts/CoinFactory.sol` = deploys `MintCoin` and collects `deployFee`.

## Hardhat

- `hardhat.config.js` uses Base Sepolia.
- `scripts/deploy.js` deploys `CoinFactory` with deploy fee `0.001` ETH and fee recipient `0x0df214be853caE6f646c9929EAfF857cb3452EFd`.
- `.env.example` lists required env vars.

## Notes / Current Behavior

- `mintcoin.html` uses favicon ⭐️ and IBM Plex Mono.
- MetaMask connect shows short address on the button and fills OWNER ADDRESS (readonly).
- `createCoin` call in `mintcoin.js` needs `FACTORY_ADDRESS` to be replaced after deployment.
- Network options in the form: BASE MAINNET / BASE SEPOLIA.
- ERC-20 is the only standard option.

## Deploy / Run (Hardhat)

- Install deps: `npm install`
- Set `.env` with `BASE_SEPOLIA_RPC_URL` and `PRIVATE_KEY`
- Deploy factory: `npm run deploy:base-sepolia`
- Copy deployed address into `mintcoin.js` `FACTORY_ADDRESS`.
