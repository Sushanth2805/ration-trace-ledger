
# Ration Distribution Blockchain System

This project combines a frontend interface with Ethereum blockchain integration for tracking government ration distribution in a transparent, decentralized manner.

## Features

- **Dual Mode Operation**: Works with both local blockchain simulation and actual Ethereum blockchain (Polygon Mumbai testnet)
- **Smart Contract Integration**: Uses Solidity smart contracts for secure, immutable record keeping
- **Hardhat Development Environment**: For local blockchain testing and deployment
- **MetaMask Integration**: Connect with MetaMask wallet for blockchain transactions
- **Polygon Mumbai Testnet**: Deploy to a free Ethereum-compatible testnet

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- NPM or Yarn
- MetaMask wallet extension installed in your browser

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   PRIVATE_KEY=your_wallet_private_key
   MUMBAI_URL=https://rpc-mumbai.maticvigil.com
   ```

4. Compile the smart contracts:
   ```
   npx hardhat compile
   ```

5. Run a local blockchain:
   ```
   npx hardhat node
   ```

6. Deploy the contract to the local blockchain:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

7. Update the contract address in `src/utils/contractService.ts` with the address from the deployment

8. Start the frontend:
   ```
   npm run dev
   ```

## Deploying to Polygon Mumbai Testnet

1. Get Mumbai MATIC tokens from a faucet (https://faucet.polygon.technology/)

2. Deploy to Mumbai:
   ```
   npx hardhat run scripts/deploy.js --network mumbai
   ```

3. Update the `DEMO_CONTRACT_ADDRESS` in `src/utils/contractService.ts` with the new address

## Testing

Run the smart contract tests:
```
npx hardhat test
```

## Using the Application

1. Access the application in your browser
2. Toggle between local blockchain mode and Ethereum mode using the switch
3. If using Ethereum mode, connect your MetaMask wallet when prompted
4. Add ration distribution records which will be stored on the selected blockchain
5. View records in the transactions table
6. Use the verification code "GOVT2024" for removal requests

## Smart Contract Structure

The main smart contract `RationDistribution.sol` handles:
- Adding new distribution records
- Verifying and marking records as removed (with verification)
- Providing statistics and record retrieval
- Access control for administrative functions

## Technical Notes

- The contract uses OpenZeppelin's Ownable for access control
- All transactions are hashed and linked in a blockchain-like structure
- Verification code is stored securely and used for removal authorization
- Events are emitted for all major state changes for transparency
