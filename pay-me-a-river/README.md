# Pay Me a River – Remastered

This project is a frontend submission for the **Overmind Aptos Hackathon**, specifically completing the **"Pay Me a River – Remastered"** quest. It connects a React-based dApp to the `pay_me_a_river` smart contract deployed on Aptos Testnet.

The application enables users to stream APT tokens in real time through wallet-based interactions, mirroring the behavior of recurring payments. The UI integrates with the Aptos Wallet Adapter and displays live blockchain data through the Aptos API.

---

## Objectives

- Connect user wallets using Aptos Wallet Adapter
- Interact with a deployed `pay_me_a_river` contract via Aptos API and SDK
- Create, accept, cancel, and claim APT payment streams
- Display active and historical streams using real event data
- Use conditional rendering and modular UI components

---

## Features

- **Wallet Integration**: Connect/disconnect Aptos wallets, sign & submit transactions.
- **Stream Management**:
  - `create_stream`, `accept_stream`, `claim_stream`, `cancel_stream`
- **Event Monitoring**:
  - Listen for `stream_create`, `stream_accept`, `stream_claim`, and `stream_close` events
- **Dynamic UI**:
  - Real-time state rendering
  - List filtering and conditional view logic
- **Data Handling**:
  - View functions, API polling, and account introspection

---

## Tech Stack

- **React / Next.js** for the frontend framework
- **Tailwind CSS** and **shadcn/ui** for UI components
- **Aptos Wallet Adapter** to connect wallets
- **Aptos TS SDK** to fund and query accounts
- **Aptos API** to access view functions and blockchain events
- **Yarn** for dependency management

---

## Setup Instructions

# Navigate to the app folder, install and run dev:

```bash
cd pay-me-a-river/app
 yarn install
 yarn dev
```
