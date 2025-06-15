# Over Network – Auth Challenge (Part 1)

This project is my completed submission for the **Overmind Aptos Hackathon – Over Network Auth Part 1** challenge.

The goal of this challenge was to implement an authentication flow for an on-chain profile system, using a combination of blockchain interaction and modern frontend development practices.

## Challenge Objectives

- Integrate user login/logout flow using on-chain profiles
- Store user data securely in local and cookie storage
- Create blockchain profiles tied to Aptos wallet accounts
- Understand and use a custom `User` type for storage and authentication
- Render views conditionally based on login state

## Key Features

- Profile creation using a `createProfile` smart contract function
- Local storage and cookie-based session management (`storeUser`, `dropUser`)
- Responsive UI with shadcn/ui, Tailwind CSS, and Next.js
- Auth-aware layout and login window components
- Simple role and permission logic using wallet-signed accounts

## Tech Stack

- React + Next.js (frontend framework)
- Tailwind CSS and shadcn/ui (styling and components)
- Aptos blockchain (on-chain profile logic)
- Yarn (package manager)

## Folder Structure

This folder contains:

- My completed submission inside [`over-network-pt-2-clpwaevi40008js08mghcpclk`](./over-network-pt-2-clpwaevi40008js08mghcpclk)
- An [original README](./over-network-pt-2-clpwaevi40008js08mghcpclk/README.md) with implementation instructions and developer cheat sheet
