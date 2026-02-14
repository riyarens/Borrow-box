<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# BorrowBox

## Basic Details

| Detail | Information |
|--------|-------------|
| Project Name | BorrowBox |
| Team Name | Lunaria Annua |

## Team Members

- **Riya Rens** – Jyothi Engineering College, Thrissur
- **Anjaly PS** – Jyothi Engineering College, Thrissur

## Hosted Project Link

[Add your deployed link here]

## Project Description

BorrowBox is a campus-focused web application that allows students to borrow, lend, sell, and report lost or found items in one place. The system also includes a chat feature that enables users to communicate directly with sellers or lenders, making coordination easier and faster.

## The Problem Statement

Students often face problems such as:

- Losing items on campus with no proper recovery system
- Buying items they only need temporarily
- Difficulty finding a trusted platform to sell unused items
- Existing methods like WhatsApp groups or notice boards are unorganized and inefficient

## The Solution

BorrowBox provides:

- A centralized platform to borrow and lend items
- A buy/sell marketplace
- A lost and found reporting system
- A chat system for direct communication between users
- Secure authentication using Firebase
- Real-time data storage using Firestore

## Technical Details

### Technologies/Components Used

#### For Software

**Languages Used:**
- JavaScript
- HTML
- CSS

**Frameworks Used:**
- React

**Libraries/Services Used:**
- Firebase Authentication
- Firebase Firestore

**Tools Used:**
- VS Code
- Git & GitHub
- Firebase Console

### Features

- User authentication (Google / Email login)
- Add items for borrowing or selling
- Lost and Found reporting
- Real-time item updates
- Chat system to communicate with sellers

## Implementation

### Installation

```bash
npm install
```

### Run

```bash
npm run dev
```

## Project Documentation

### Screenshots

*(Add screenshots after completing UI)*

- **Screenshot 1: Homepage** - Shows dashboard and navigation
- **Screenshot 2: Add Item Page** - Shows posting of items for borrowing or selling
- **Screenshot 3: Chat System** - Shows communication between buyer and seller

### System Architecture

```
User → React Frontend → Firebase Authentication
         ↓
    Firestore Database
         ↓
    Chat Messages
```

**Explanation:**
- React handles UI
- Firebase Authentication handles login
- Firestore stores items and messages

### Application Workflow

1. User logs in
2. User browses or posts items
3. Data is saved in Firestore
4. Users communicate through chat

## Project Demo

**Video Link:** [Add demo video link here]

**Video demonstrates:**
- Login process
- Borrow or lend an item
- Posting an item
- Chatting with seller
- Report lost or found item

## AI Tools Used

| Tool | Purpose |
|------|---------|
| Gemini | UI suggestions, Debugging help, Code structure guidance |

## Human Contributions

- Architecture design
- UI development
- Firebase integration
- Testing

## Team Contributions

**Riya Rens**
- Frontend development
- Firebase integration

**Anjaly PS**
- UI design
- Testing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
