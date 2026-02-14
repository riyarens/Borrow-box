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
 **Screenshot 1: Homepage** - Shows dashboard and navigation<img width="927" height="468" alt="overview png" src="https://github.com/user-attachments/assets/68b03564-c3e1-4894-b62a-e56f60e9461f" />

**Screenshot 2: Marketplace** - shows sales <img width="936" height="487" alt="markpalce png" src="https://github.com/user-attachments/assets/cc3a7e08-e7fc-4d83-bae9-925a3f139ad6" />

 **Screenshot 3: Chat System** - Shows communication between buyer and seller<img width="920" height="460" alt="message png" src="https://github.com/user-attachments/assets/1ab9765c-4b8d-4412-b869-d1cddd0353fc" />


 **Screenshot 4: Add items** - shows items<img width="937" height="482" alt="addfile png" src="https://github.com/user-attachments/assets/6304b5ef-23d4-403a-aff7-bd0030c5e1e5" />


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
