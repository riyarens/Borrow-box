import React, { useState, useEffect } from 'react';
import { Search, Filter, Book, Monitor, Cpu, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

export default function Marketplace() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        });
        return () => unsubscribe();
    }, []);

    const handleBorrow = async (product) => {
        if (!auth.currentUser) {
            alert('Please login to borrow items');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'borrows'), {
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                userName: auth.currentUser.displayName,
                productId: product.id,
                productTitle: product.title,
                price: product.price,
                status: 'pending',
                requestDate: new Date().toISOString(),
                createdAt: new Date().toISOString()
            });
            alert(`Request sent for ${product.title}!`);
        } catch (error) {
            console.error("Error requesting borrow:", error);
            alert("Failed to send request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'All' || product.category === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Marketplace</h1>

                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search for books, electronics..."
                            className="input-field"
                            style={{ marginTop: 0, paddingLeft: '40px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '5px' }}>
                        {['All', 'Textbooks', 'Electronics', 'Lab Gear'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`btn ${category === cat ? 'btn-primary' : 'btn-secondary'} `}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Listings Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                {filteredProducts.map(product => (
                    <div key={product.id} className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}>
                        <div style={{ height: '180px', position: 'relative' }}>
                            <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                <button style={{ background: 'white', borderRadius: '50%', padding: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    <Heart size={16} color="var(--text-secondary)" />
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '1rem',
                                    backgroundColor: product.type === 'Rent' ? '#e0e7ff' : '#fce7f3',
                                    color: product.type === 'Rent' ? 'var(--primary-color)' : 'var(--secondary-color)'
                                }}>
                                    {product.type}
                                </span>
                                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{product.price}</span>
                            </div>

                            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', lineHeight: '1.4', height: '2.8rem', overflow: 'hidden' }}>{product.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {product.category === 'Textbooks' && <Book size={14} />}
                                {product.category === 'Electronics' && <Monitor size={14} />}
                                {product.category === 'Lab Gear' && <Cpu size={14} />}
                                {product.category}
                            </p>

                            <button
                                onClick={() => handleBorrow(product)}
                                className="btn btn-secondary"
                                style={{ width: '100%', marginTop: '1rem', fontSize: '0.9rem', padding: '8px' }}
                            >
                                Request to {product.type === 'Rent' ? 'Borrow' : 'Buy'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
