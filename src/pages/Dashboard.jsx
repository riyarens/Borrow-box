import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, MessageSquare, Send, LayoutDashboard, Store, LogOut, Users, MessageCircle, Search } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, getDocs, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const QuickStats = ({ borrowsCount, salesCount, requestsCount }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: '#ecfccb', color: '#3f6212' }}><ShoppingBag size={24} /></div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{borrowsCount}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Active Borrows</div>
            </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: '#ffedd5', color: '#c2410c' }}><Package size={24} /></div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{salesCount}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Items for Sale</div>
            </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: '#dbeafe', color: '#1e40af' }}><Users size={24} /></div>
            <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{requestsCount}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Community Requests</div>
            </div>
        </div>
    </div>
);

const BorrowsSection = ({ borrows, handleRequestItem }) => (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: '#ecfccb', color: '#3f6212' }}>
                <ShoppingBag size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Active Borrows</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {borrows.length > 0 ? (
                borrows.map(borrow => {
                    let requestDateStr = 'N/A';
                    let returnDateStr = 'N/A';

                    try {
                        const dateValue = borrow.requestDate ? new Date(borrow.requestDate) : new Date();

                        if (borrow.fromDate) {
                            const fromVal = new Date(borrow.fromDate);
                            requestDateStr = !isNaN(fromVal) ? fromVal.toLocaleDateString() : borrow.fromDate;
                        } else if (!isNaN(dateValue)) {
                            requestDateStr = dateValue.toLocaleDateString();
                        }

                        if (borrow.returnDate) {
                            const returnDateVal = new Date(borrow.returnDate);
                            returnDateStr = !isNaN(returnDateVal) ? returnDateVal.toLocaleDateString() : borrow.returnDate;
                        } else if (!isNaN(dateValue)) {
                            const returnDateObj = new Date(dateValue);
                            returnDateObj.setMonth(returnDateObj.getMonth() + 4);
                            returnDateStr = returnDateObj.toLocaleDateString();
                        }
                    } catch (e) {
                        console.error("Date error", e);
                    }

                    return (
                        <div key={borrow.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1.1rem' }}>{borrow.productTitle}</div>
                            {borrow.category && (
                                <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    {borrow.category}
                                </div>
                            )}
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 500 }}>{borrow.fromDate ? "Needed from:" : "Requested:"}</span> {requestDateStr}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 500 }}>Return by:</span> {returnDateStr}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {borrow.status === 'accepted' && borrow.lenderName && (
                                    <div style={{ fontSize: '0.9rem', color: '#047857', background: '#d1fae5', padding: '0.5rem', borderRadius: '6px' }}>
                                        <b style={{ fontWeight: 600 }}>Accepted by:</b> {borrow.lenderName}
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        background: (borrow.status === 'active' || borrow.status === 'accepted') ? '#dcfce7' : '#fef9c3',
                                        color: (borrow.status === 'active' || borrow.status === 'accepted') ? '#166534' : '#854d0e',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        textTransform: 'capitalize',
                                        fontWeight: 500
                                    }}>
                                        {borrow.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                    No active borrows found.
                </p>
            )}
            <button onClick={handleRequestItem} className="btn btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }}>
                + Request Product
            </button>
        </div>
    </div>
);

const SalesSection = ({ userItems, handleAddItem, handleEditItem, handleRemoveItem }) => (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: '#ffedd5', color: '#c2410c' }}>
                <Package size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>My Sales</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {userItems.length > 0 ? (
                userItems.map(item => (
                    <div key={item.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Listed: {item.price}</div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button onClick={() => handleEditItem(item)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit</button>
                            <button onClick={() => handleRemoveItem(item.id)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}>Remove</button>
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                    You haven't listed any items yet.
                </p>
            )}
            <button onClick={handleAddItem} className="btn btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }}>
                + Add Product
            </button>
        </div>
    </div>
);

const ComplaintSection = ({ complaint, setComplaint, complaintCategory, setComplaintCategory, handleComplaintSubmit, myComplaints }) => (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: '#ffedd5', color: '#c2410c' }}>
                <MessageSquare size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Complaint Box</h2>
        </div>
        <form onSubmit={handleComplaintSubmit}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
                <select
                    className="input-field"
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                >
                    <option value="Borrow">Borrow</option>
                    <option value="Sale">Sale</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Describe your issue</label>
                <textarea
                    className="input-field"
                    rows="4"
                    placeholder="I had an issue with..."
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    required
                    style={{ resize: 'vertical' }}
                ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Submit Complaint <Send size={16} />
            </button>
        </form>

        {myComplaints.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {myComplaints.map(c => (
                        <div key={c.id} style={{ padding: '0.75rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                            <div style={{ fontSize: '0.9rem' }}>{c.issue}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                <span style={{ textTransform: 'capitalize', color: c.status === 'resolved' ? 'green' : 'orange' }}>{c.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const CommunitySection = ({ communityRequests, handleAcceptRequest }) => (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: '#dbeafe', color: '#1e40af' }}>
                <Users size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Community Requests</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            {communityRequests.length > 0 ? (
                communityRequests.map(req => (
                    <div key={req.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1.1rem' }}>{req.productTitle}</div>
                        {req.category && <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: 500 }}>{req.category}</div>}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <div><b>Requester:</b> {req.userName}</div>
                            {req.fromDate && <div><b>From:</b> {new Date(req.fromDate).toLocaleDateString()}</div>}
                            {req.returnDate && <div><b>To:</b> {new Date(req.returnDate).toLocaleDateString()}</div>}
                        </div>

                        <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="btn btn-primary"
                            style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.9rem' }}
                        >
                            Accept & Lend
                        </button>
                    </div>
                ))
            ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                    No open requests from others.
                </p>
            )}
        </div>
    </div>
);


const BrowseSection = ({ browseItems, handleContactSeller }) => (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: '#f3e8ff', color: '#7e22ce' }}>
                <Store size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Browse Marketplace</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {browseItems.length > 0 ? (
                browseItems.map(item => (
                    <div key={item.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <img
                            src={(item.image && !item.image.includes('1555421689')) ? item.image : (['textbook', 'book', 'physics', 'chemistry', 'math', 'project'].some(k => item.title.toLowerCase().includes(k)) || item.category === 'Textbooks'
                                ? 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000'
                                : 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=1000')}
                            alt={item.title}
                            style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.title}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 500 }}>{item.price} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>({item.type})</span></div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Seller: {item.sellerName}</div>
                        <button className="btn btn-secondary" style={{ marginTop: 'auto', fontSize: '0.9rem' }} onClick={() => handleContactSeller(item)}>
                            Contact Seller
                        </button>
                    </div>
                ))
            ) : (
                <p style={{ gridColumn: '1 / -1', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                    No items for sale yet.
                </p>
            )}
        </div>
    </div>
);

const MessagesSection = ({ chats, selectedChat, setSelectedChat, newMessage, setNewMessage, sendMessage, user }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedChat?.messages]);

    return (
        <div className="card" style={{ height: 'calc(100vh - 140px)', display: 'flex', gap: '1rem', padding: 0, overflow: 'hidden' }}>
            {/* Chat List (Sidebar) */}
            <div style={{ width: '300px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>
                    Messages
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {chats.map(chat => {
                        const otherUser = chat.participantsData?.find(p => p.uid !== user.uid) || { displayName: 'User' };
                        return (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    background: selectedChat?.id === chat.id ? '#f3f4f6' : 'transparent',
                                    borderBottom: '1px solid #f3f4f6'
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{otherUser.displayName || otherUser.email}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {chat.lastMessage?.text || 'No messages yet'}
                                </div>
                            </div>
                        );
                    })}
                    {chats.length === 0 && <div style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No conversations yet.</div>}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedChat ? (
                    <>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageCircle size={20} />
                            {selectedChat.participantsData?.find(p => p.uid !== user.uid)?.displayName || 'Chat'}
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {selectedChat.messages?.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.senderId === user.uid ? 'flex-end' : 'flex-start',
                                    backgroundColor: msg.senderId === user.uid ? 'var(--primary-color)' : '#f3f4f6',
                                    color: msg.senderId === user.uid ? 'white' : 'black',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '12px',
                                    maxWidth: '70%',
                                    fontSize: '0.95rem'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Select a conversation to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

const LostAndFoundSection = ({ lostItems, handleReportLostFound }) => (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c' }}>
                <Search size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem' }}>Lost & Found</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {lostItems.length > 0 ? (
                lostItems.map(item => (
                    <div key={item.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.title}</div>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: item.type === 'Lost' ? '#fef2f2' : '#ecfdf5',
                                color: item.type === 'Lost' ? '#ef4444' : '#047857',
                                fontWeight: 600,
                                textTransform: 'uppercase'
                            }}>
                                {item.type}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.description}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'auto' }}>
                            Posted by {item.userName} • {new Date(item.date).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginTop: '0.25rem' }}>
                            Contact: {item.contactInfo || 'N/A'}
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>No lost or found items reported.</p>
            )}
        </div>
        <button onClick={handleReportLostFound} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Report an Item
        </button>
    </div>
);

export default function Dashboard({ user }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [complaint, setComplaint] = useState('');
    const [complaintCategory, setComplaintCategory] = useState('Borrow');
    const [borrows, setBorrows] = useState([]);
    const [userItems, setUserItems] = useState([]);
    const navigate = useNavigate();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestItemName, setRequestItemName] = useState('');
    const [requestCategory, setRequestCategory] = useState('Textbooks');
    const [requestFromDate, setRequestFromDate] = useState('');
    const [requestReturnDate, setRequestReturnDate] = useState('');
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [addItemTitle, setAddItemTitle] = useState('');
    const [addItemPrice, setAddItemPrice] = useState('');
    const [addItemCategory, setAddItemCategory] = useState('Textbooks');
    const [addItemType, setAddItemType] = useState('Rent');
    const [communityRequests, setCommunityRequests] = useState([]);
    const [browseItems, setBrowseItems] = useState([]);
    const [myComplaints, setMyComplaints] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [lostItems, setLostItems] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportTitle, setReportTitle] = useState('');
    const [reportType, setReportType] = useState('Lost');
    const [reportDesc, setReportDesc] = useState('');
    const [reportContact, setReportContact] = useState('');
    const [showEditItemModal, setShowEditItemModal] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const [editItemTitle, setEditItemTitle] = useState('');
    const [editItemPrice, setEditItemPrice] = useState('');

    // Fetch Lost & Found Items
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'lost_found'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLostItems(items);
        }, (error) => {
            console.error("Error fetching lost/found:", error);
        });
        return () => unsubscribe();
    }, [user]);

    const handleReportLostFound = () => {
        setShowReportModal(true);
    };

    const submitReport = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'lost_found'), {
                userId: user.uid,
                userName: user.displayName || user.email,
                title: reportTitle,
                type: reportType,
                description: reportDesc,
                contactInfo: reportContact,
                date: new Date().toISOString()
            });
            alert("Report submitted successfully!");
            setShowReportModal(false);
            setReportTitle('');
            setReportDesc('');
            setReportContact('');
            setReportType('Lost');
        } catch (error) {
            console.error("Error submitting report:", error);
            if (error.message.includes("permissions") || error.code === "permission-denied") {
                alert("Firestore Permission Error! Check Security Rules.");
            } else {
                alert("Failed to submit report.");
            }
        }
    };

    // Fetch Chats
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChats(chatsData);
        });
        return () => unsubscribe();
    }, [user]);

    // Update selectedChat when chats change (to show new messages)
    useEffect(() => {
        if (selectedChat) {
            const updatedChat = chats.find(c => c.id === selectedChat.id);
            if (updatedChat) {
                // Only update if messages count changed or last message changed to avoid loops if strict equality fails?
                // Actually Firestore objects are always new. But setSelectedChat will trigger re-render.
                // If the content is "same" technically but new reference, it loops?
                // No, because setChats only happens when Snapshot fires (db change).
                // So this only triggers when DB changes.
                setSelectedChat(updatedChat);
            }
        }
    }, [chats]);

    const handleContactSeller = async (item) => {
        if (item.sellerId === user.uid) {
            alert("You cannot message yourself!");
            return;
        }

        const existingChat = chats.find(c => c.participants.includes(item.sellerId));
        if (existingChat) {
            setSelectedChat(existingChat);
            setActiveTab('messages');
        } else {
            try {
                const newChatData = {
                    participants: [user.uid, item.sellerId],
                    participantsData: [
                        { uid: user.uid, displayName: user.displayName || user.email },
                        { uid: item.sellerId, displayName: item.sellerName || 'Seller' }
                    ],
                    messages: [],
                    lastMessage: null,
                    createdAt: new Date().toISOString()
                };
                const docRef = await addDoc(collection(db, 'chats'), newChatData);
                const newChat = { id: docRef.id, ...newChatData };
                // Firestore snapshot will trigger soon, but set manually for immediate feedback
                setSelectedChat(newChat);
                setActiveTab('messages');
            } catch (error) {
                console.error("Error creating chat:", error);

                if (error.message.includes("permissions") || error.code === "permission-denied") {
                    alert("Firestore Permission Error (Chats)! \n\nEnsure your 'chats' collection rules allow read/write for authenticated users.");
                } else {
                    alert("Failed to start chat.");
                }
            }
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const msg = {
            senderId: user.uid,
            text: newMessage,
            timestamp: new Date().toISOString()
        };

        // Optimistic Update
        const prevSelectedChat = { ...selectedChat };
        const updatedMessagesLocally = [...(selectedChat.messages || []), msg];
        const updatedChatLocally = { ...prevSelectedChat, messages: updatedMessagesLocally, lastMessage: msg };

        setSelectedChat(updatedChatLocally);
        setNewMessage(''); // Clear input immediately

        try {
            const chatRef = doc(db, 'chats', selectedChat.id);
            await updateDoc(chatRef, {
                messages: updatedMessagesLocally,
                lastMessage: msg
            });
        } catch (error) {
            console.error("Error sending message:", error);

            if (error.message.includes("permissions") || error.code === "permission-denied") {
                alert("Firestore Permission Error! Check Security Rules for 'chats'.");
            } else {
                alert("Failed to send message: " + error.message);
            }

            // Revert optimistic update
            setSelectedChat(prevSelectedChat);
            setNewMessage(msg.text); // Restore text
        }
    };

    // Fetch user complaints
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'complaints'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const comps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyComplaints(comps);
        });
        return () => unsubscribe();
    }, [user]);

    // Fetch active borrows
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'borrows'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const borrowsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBorrows(borrowsData);
        });
        return () => unsubscribe();
    }, [user]);

    // Fetch user items for sale
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'products'), where('sellerId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserItems(itemsData);
        });
        return () => unsubscribe();
    }, [user]);

    // Fetch community requests
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'borrows'), where('status', '==', 'requested'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(req => req.userId !== user.uid);
            setCommunityRequests(reqs);
        });
        return () => unsubscribe();
    }, [user]);

    // Fetch browse items (others' products)
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'products'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(item => item.sellerId !== user.uid);
            setBrowseItems(items);
        });
        return () => unsubscribe();
    }, [user]);

    const handleAcceptRequest = async (requestId) => {
        if (!window.confirm("Are you sure you want to fulfill this request?")) return;

        try {
            await updateDoc(doc(db, 'borrows', requestId), {
                status: 'accepted',
                lenderId: user.uid,
                lenderName: user.displayName || user.email,
                acceptedDate: new Date().toISOString()
            });
            alert("Request accepted! You are now the lender.");
        } catch (error) {
            console.error("Error accepting request:", error);
            alert("Failed to accept request.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        if (!complaint) return;

        try {
            await addDoc(collection(db, 'complaints'), {
                userId: user.uid,
                userName: user.displayName || user.email,
                issue: complaint,
                category: complaintCategory,
                status: 'open',
                createdAt: new Date().toISOString()
            });
            const subject = encodeURIComponent(`BorrowBox Complaint: ${complaintCategory} - ${user.displayName || user.email}`);
            const body = encodeURIComponent(`User: ${user.displayName || user.email}\nCategory: ${complaintCategory}\n\nComplaint:\n${complaint}`);

            // Try to open Gmail compose window in new tab
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=riyarens05@gmail.com&su=${subject}&body=${body}`;
            window.open(gmailUrl, '_blank');

            alert('Complaint submitted! Opening Gmail to send to admin.');
            setComplaint('');
            setComplaintCategory('Borrow');
        } catch (error) {
            console.error("Error submitting complaint:", error);
            if (error.message.includes("permissions") || error.code === "permission-denied") {
                alert("Firestore Permission Error! \n\nPlease go to Firebase Console > Firestore Database > Rules.\nChange 'allow read, write: if false;' to 'allow read, write: if request.auth != null;'");
            } else {
                alert(`Failed to submit complaint: ${error.message}`);
            }
        }
    };

    const handleAddItem = () => {
        setShowAddItemModal(true);
    };

    const submitAddItem = async (e) => {
        e.preventDefault();
        console.log("Submitting item for user:", user?.uid);
        if (!user?.uid) {
            alert("User ID missing. Please log out and log in again.");
            return;
        }
        if (!addItemTitle || !addItemPrice) return;

        try {
            await addDoc(collection(db, 'products'), {
                sellerId: user.uid,
                sellerName: user.displayName || user.email,
                title: addItemTitle,
                price: addItemPrice,
                type: addItemType,
                category: addItemCategory,
                image: (addItemCategory === 'Textbooks' || addItemCategory === 'Stationary' || addItemTitle.toLowerCase().includes('book'))
                    ? 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000'
                    : 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=1000',
                createdAt: new Date().toISOString()
            });
            alert("Item listed successfully!");
            setShowAddItemModal(false);
            setAddItemTitle('');
            setAddItemPrice('');
            setAddItemCategory('Textbooks');
            setAddItemType('Rent');
        } catch (error) {
            console.error("Error adding item:", error);
            if (error.message.includes("permissions") || error.code === "permission-denied") {
                alert("Firestore Permission Error! \n\nPlease go to Firebase Console > Firestore Database > Rules.\nChange 'allow read, write: if false;' to 'allow read, write: if request.auth != null;'");
            } else {
                alert(`Failed to list item: ${error.message}`);
            }
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            try {
                await deleteDoc(doc(db, "products", itemId));
                alert("Item removed successfully.");
            } catch (error) {
                console.error("Error removing item:", error);
                alert("Failed to remove item.");
            }
        }
    };

    const handleEditItem = (item) => {
        setEditItemId(item.id);
        setEditItemTitle(item.title);
        setEditItemPrice(item.price);
        setShowEditItemModal(true);
    };

    const submitEditItem = async (e) => {
        e.preventDefault();
        if (!editItemId || !editItemTitle || !editItemPrice) return;

        try {
            await updateDoc(doc(db, 'products', editItemId), {
                title: editItemTitle,
                price: editItemPrice
            });
            alert("Item updated successfully!");
            setShowEditItemModal(false);
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update item.");
        }
    };

    const handleRequestItem = () => {
        setShowRequestModal(true);
    };

    const submitRequest = async (e) => {
        e.preventDefault();
        console.log("Submitting request for user:", user?.uid);
        if (!user?.uid) {
            alert("User ID missing. Please log out and log in again.");
            return;
        }
        if (!requestItemName) return;

        try {
            await addDoc(collection(db, 'borrows'), {
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || user.email,
                productTitle: requestItemName,
                category: requestCategory,
                fromDate: requestFromDate,
                returnDate: requestReturnDate,
                status: 'requested',
                requestDate: new Date().toISOString()
            });
            alert("Request added successfully!");
            setShowRequestModal(false);
            setRequestItemName('');
            setRequestCategory('Textbooks');
            setRequestFromDate('');
            setRequestReturnDate('');
        } catch (error) {
            console.error("Error adding request:", error);
            if (error.message.includes("permissions") || error.code === "permission-denied") {
                alert("Firestore Permission Error! \n\nPlease go to Firebase Console > Firestore Database > Rules.\nChange 'allow read, write: if false;' to 'allow read, write: if request.auth != null;'");
            } else {
                alert(`Failed to add request: ${error.message}`);
            }
        }
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 1rem',
                background: activeTab === id ? '#e0e7ff' : 'transparent',
                color: activeTab === id ? 'var(--primary-color)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                fontWeight: activeTab === id ? 600 : 500,
                fontSize: '0.95rem',
                transition: 'all 0.2s'
            }}
        >
            <Icon size={20} />
            {label}
        </button>
    );

    const BorrowsCard = () => (
        <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', borderRadius: '8px', background: '#e0e7ff', color: 'var(--primary-color)' }}>
                    <ShoppingBag size={24} />
                </div>
                <h2 style={{ fontSize: '1.25rem' }}>Active Borrows</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {borrows.length > 0 ? (
                    borrows.map(borrow => {
                        let requestDateStr = 'N/A';
                        let returnDateStr = 'N/A';

                        try {
                            const dateValue = borrow.requestDate ? new Date(borrow.requestDate) : new Date();

                            if (borrow.fromDate) {
                                const fromVal = new Date(borrow.fromDate);
                                requestDateStr = !isNaN(fromVal) ? fromVal.toLocaleDateString() : borrow.fromDate;
                            } else if (!isNaN(dateValue)) {
                                requestDateStr = dateValue.toLocaleDateString();
                            }

                            if (borrow.returnDate) {
                                const returnDateVal = new Date(borrow.returnDate);
                                returnDateStr = !isNaN(returnDateVal) ? returnDateVal.toLocaleDateString() : borrow.returnDate;
                            } else if (!isNaN(dateValue)) {
                                const returnDateObj = new Date(dateValue);
                                returnDateObj.setMonth(returnDateObj.getMonth() + 4);
                                returnDateStr = returnDateObj.toLocaleDateString();
                            }
                        } catch (e) {
                            console.error("Date error", e);
                        }

                        return (
                            <div key={borrow.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1.1rem' }}>{borrow.productTitle}</div>
                                {borrow.category && (
                                    <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: 500 }}>
                                        {borrow.category}
                                    </div>
                                )}
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 500 }}>{borrow.fromDate ? "Needed from:" : "Requested:"}</span> {requestDateStr}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 500 }}>Return by:</span> {returnDateStr}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {borrow.status === 'accepted' && borrow.lenderName && (
                                        <div style={{ fontSize: '0.9rem', color: '#047857', background: '#d1fae5', padding: '0.5rem', borderRadius: '6px' }}>
                                            <b style={{ fontWeight: 600 }}>Accepted by:</b> {borrow.lenderName}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            background: (borrow.status === 'active' || borrow.status === 'accepted') ? '#dcfce7' : '#fef9c3',
                                            color: (borrow.status === 'active' || borrow.status === 'accepted') ? '#166534' : '#854d0e',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            textTransform: 'capitalize',
                                            fontWeight: 500
                                        }}>
                                            {borrow.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                        No active borrows found.
                    </p>
                )}
                <button onClick={handleRequestItem} className="btn btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }}>
                    + Request Product
                </button>
            </div>
        </div>
    );

    const SalesCard = () => (
        <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', borderRadius: '8px', background: '#fce7f3', color: 'var(--secondary-color)' }}>
                    <Package size={24} />
                </div>
                <h2 style={{ fontSize: '1.25rem' }}>My Sales</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userItems.length > 0 ? (
                    userItems.map(item => (
                        <div key={item.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Listed: {item.price}</div>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>Edit</button>
                                <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#ef4444', borderColor: '#ef4444' }}>Remove</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                        You haven't listed any items yet.
                    </p>
                )}
                <button onClick={handleAddItem} className="btn btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }}>
                    + Add Product
                </button>
            </div>
        </div>
    );



    const CommunityRequestsCard = () => (
        <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', borderRadius: '8px', background: '#dbeafe', color: '#1d4ed8' }}>
                    <Users size={24} />
                </div>
                <h2 style={{ fontSize: '1.25rem' }}>Community Requests</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {communityRequests.length > 0 ? (
                    communityRequests.map(req => (
                        <div key={req.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1.1rem' }}>{req.productTitle}</div>
                            {req.category && <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: 500 }}>{req.category}</div>}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <div><b>Requester:</b> {req.userName}</div>
                                {req.fromDate && <div><b>From:</b> {new Date(req.fromDate).toLocaleDateString()}</div>}
                                {req.returnDate && <div><b>To:</b> {new Date(req.returnDate).toLocaleDateString()}</div>}
                            </div>

                            <button
                                onClick={() => handleAcceptRequest(req.id)}
                                className="btn btn-primary"
                                style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.9rem' }}
                            >
                                Accept & Lend
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                        No open requests from others.
                    </p>
                )}
            </div>
        </div>
    );

    const BrowseItemsCard = () => (
        <div className="card" style={{ height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ padding: '10px', borderRadius: '8px', background: '#f3e8ff', color: '#9333ea' }}>
                    <Store size={24} />
                </div>
                <h2 style={{ fontSize: '1.25rem' }}>Browse Marketplace</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {browseItems.length > 0 ? (
                    browseItems.map(item => (
                        <div key={item.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <img
                                src={item.image || 'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=1000'}
                                alt={item.title}
                                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{item.title}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 500 }}>{item.price} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>({item.type})</span></div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Seller: {item.sellerName}</div>
                            <button className="btn btn-secondary" style={{ marginTop: 'auto', fontSize: '0.9rem' }} onClick={() => alert("Contact feature coming soon!")}>
                                Contact Seller
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ gridColumn: '1 / -1', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                        No items for sale yet.
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 73px)' }}>
            {/* Sidebar */}
            <div style={{
                width: '260px',
                backgroundColor: 'white',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                position: 'sticky',
                top: '73px',
                height: 'calc(100vh - 73px)',
                padding: '1.5rem 1rem'
            }}>
                <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                    <h1 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Dashboard</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.displayName || user.email}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <SidebarItem id="overview" icon={LayoutDashboard} label="Overview" />
                    <SidebarItem id="borrows" icon={ShoppingBag} label="Active Borrows" />
                    <SidebarItem id="market" icon={Store} label="Browse Marketplace" />
                    <SidebarItem id="sales" icon={Package} label="My Sales" />
                    <SidebarItem id="community" icon={Users} label="Community Requests" />
                    <SidebarItem id="messages" icon={MessageCircle} label="Messages" />
                    <SidebarItem id="lost-found" icon={Search} label="Lost & Found" />
                    <SidebarItem id="complaints" icon={MessageSquare} label="Complaint Box" />
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '12px 1rem',
                            color: '#ef4444',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontWeight: 500,
                            fontSize: '0.95rem'
                        }}
                    >
                        <LogOut size={20} />
                        Log Out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textTransform: 'capitalize' }}>
                        {activeTab === 'overview' ? 'Overview' : activeTab.replace('-', ' ')}
                    </h2>

                    {activeTab === 'overview' && (
                        <>
                            <QuickStats
                                borrowsCount={borrows.length}
                                salesCount={userItems.length}
                                requestsCount={communityRequests.length}
                            />
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '1.5rem',
                                alignItems: 'stretch'
                            }}>
                                <BorrowsSection borrows={borrows} handleRequestItem={handleRequestItem} />
                                <CommunitySection communityRequests={communityRequests} handleAcceptRequest={handleAcceptRequest} />
                                <BrowseSection browseItems={browseItems} handleContactSeller={handleContactSeller} />
                                <SalesSection userItems={userItems} handleAddItem={handleAddItem} handleEditItem={handleEditItem} handleRemoveItem={handleRemoveItem} />
                                <LostAndFoundSection lostItems={lostItems} handleReportLostFound={handleReportLostFound} />
                            </div>
                        </>
                    )}

                    {activeTab === 'borrows' && <BorrowsSection borrows={borrows} handleRequestItem={handleRequestItem} />}
                    {activeTab === 'market' && <BrowseSection browseItems={browseItems} handleContactSeller={handleContactSeller} />}
                    {activeTab === 'sales' && <SalesSection userItems={userItems} handleAddItem={handleAddItem} handleEditItem={handleEditItem} handleRemoveItem={handleRemoveItem} />}
                    {activeTab === 'community' && <CommunitySection communityRequests={communityRequests} handleAcceptRequest={handleAcceptRequest} />}
                    {activeTab === 'messages' && <MessagesSection chats={chats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} user={user} />}
                    {activeTab === 'lost-found' && <LostAndFoundSection lostItems={lostItems} handleReportLostFound={handleReportLostFound} />}
                    {activeTab === 'complaints' && <ComplaintSection complaint={complaint} setComplaint={setComplaint} complaintCategory={complaintCategory} setComplaintCategory={setComplaintCategory} handleComplaintSubmit={handleComplaintSubmit} myComplaints={myComplaints} />}
                </div>
            </div>

            {showAddItemModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>List a New Item</h3>
                        <form onSubmit={submitAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Item Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={addItemTitle}
                                    onChange={(e) => setAddItemTitle(e.target.value)}
                                    placeholder="e.g. Physics Textbook"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={addItemPrice}
                                    onChange={(e) => setAddItemPrice(e.target.value)}
                                    placeholder="e.g. $20/sem"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
                                <select
                                    className="input-field"
                                    value={addItemCategory}
                                    onChange={(e) => setAddItemCategory(e.target.value)}
                                >
                                    <option value="Textbooks">Textbooks</option>
                                    <option value="Lab Equipment">Lab Equipment</option>
                                    <option value="Stationary">Stationary</option>
                                    <option value="Project">Project</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowAddItemModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>List Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showRequestModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Request an Item</h3>
                        <form onSubmit={submitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Item Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={requestItemName}
                                    onChange={(e) => setRequestItemName(e.target.value)}
                                    placeholder="e.g. Graphing Calculator"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
                                <select
                                    className="input-field"
                                    value={requestCategory}
                                    onChange={(e) => setRequestCategory(e.target.value)}
                                >
                                    <option value="Textbooks">Textbooks</option>
                                    <option value="Lab Equipment">Lab Equipment</option>
                                    <option value="Stationary">Stationary</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Needed From</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={requestFromDate}
                                        onChange={(e) => setRequestFromDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Needed Until</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={requestReturnDate}
                                        onChange={(e) => setRequestReturnDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowRequestModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>+ Add Product Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showReportModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Report Lost/Found Item</h3>
                        <form onSubmit={submitReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Type</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="Lost"
                                            checked={reportType === 'Lost'}
                                            onChange={() => setReportType('Lost')}
                                        />
                                        Lost
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="reportType"
                                            value="Found"
                                            checked={reportType === 'Found'}
                                            onChange={() => setReportType('Found')}
                                        />
                                        Found
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Item Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={reportTitle}
                                    onChange={(e) => setReportTitle(e.target.value)}
                                    placeholder="e.g. Blue Water Bottle"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
                                <textarea
                                    className="input-field"
                                    value={reportDesc}
                                    onChange={(e) => setReportDesc(e.target.value)}
                                    placeholder="Describe the item (color, brand, location where lost/found)..."
                                    required
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contact Info</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={reportContact}
                                    onChange={(e) => setReportContact(e.target.value)}
                                    placeholder="Phone number or location to collect"
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditItemModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Edit Item</h3>
                        <form onSubmit={submitEditItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Item Title</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editItemTitle}
                                    onChange={(e) => setEditItemTitle(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Price</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={editItemPrice}
                                    onChange={(e) => setEditItemPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowEditItemModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
