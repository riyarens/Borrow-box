import React, { useEffect, useState } from 'react';
import { ArrowRight, Book, Monitor, Cpu, Search, Handshake, RotateCcw, ShieldCheck, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Dashboard from './Dashboard';

export default function Home() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleStartBorrowing = (e) => {
        e.preventDefault();
        navigate('/signup'); // This is only reachable if user is null
    };

    if (user) {
        return <Dashboard user={user} />;
    }

    return (
        <div className="home">
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                padding: '8rem 0',
                textAlign: 'center',
                backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop")', // Campus/Student Library vibe
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)' // Dark overlay
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        lineHeight: 1.2
                    }}>
                        Campus Essentials,<br />On Demand.
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '2.5rem',
                        maxWidth: '600px',
                        margin: '0 auto 2.5rem',
                        opacity: 0.9
                    }}>
                        Why buy when you can borrow? Connect with students to rent textbooks, electronics, and gear securely.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={handleStartBorrowing} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Start Borrowing <ArrowRight size={20} />
                        </button>
                        <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1.1rem', background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
                            Log In
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                        <div>
                            <div style={{ width: '80px', height: '80px', background: '#ecfccb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#3f6212' }}>
                                <Search size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Find Item</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Search for textbooks, calculators, or lab coats listed by other students.</p>
                        </div>
                        <div>
                            <div style={{ width: '80px', height: '80px', background: '#ecfccb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#365314' }}>
                                <Handshake size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Request & Meet</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Send a request, agree on a time, and meet on campus for the exchange.</p>
                        </div>
                        <div>
                            <div style={{ width: '80px', height: '80px', background: '#ffedd5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#c2410c' }}>
                                <RotateCcw size={40} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Return & Repeat</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Use the item for the agreed duration, return it, and build your trust score.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories/Features */}
            <section style={{ padding: '5rem 0', backgroundColor: 'var(--background-color)' }}>
                <div className="container">
                    <h2 className="section-title">Popular Categories</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div className="card" style={{ textAlign: 'left', transition: 'transform 0.2s', cursor: 'default' }}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}><Book size={32} /></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Textbooks</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Save up to 80% compared to bookstore prices. Rent for the semester.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'left' }}>
                            <div style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}><Monitor size={32} /></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Electronics</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Calculators, chargers, and spare monitors for your dorm setup.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'left' }}>
                            <div style={{ color: '#65a30d', marginBottom: '1rem' }}><Cpu size={32} /></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Lab Equipment</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Arduino kits, drafting tables, and safety gear for engineering labs.</p>
                        </div>
                        <div className="card" style={{ textAlign: 'left' }}>
                            <div style={{ color: '#ca8a04', marginBottom: '1rem' }}><Heart size={32} /></div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Household items</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Kettles, drying racks and other essentials for dorm living.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section style={{ padding: '5rem 0', backgroundColor: 'white' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Built for the<br />Student Community</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            BorrowBox is designed to make campus life affordable and sustainable. Reduce waste, save money, and help your peers.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <ShieldCheck size={24} color="var(--primary-color)" style={{ marginTop: '4px' }} />
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Verified Students</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Only students with valid .edu emails can join.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <Handshake size={24} color="var(--primary-color)" style={{ marginTop: '4px' }} />
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Secure Transactions</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Log exchanges and build reputation scores.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                            alt="Students studying"
                            style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: '#2f3e1b', color: 'white', padding: '3rem 0', textAlign: 'center' }}>
                <div className="container">
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>BorrowBox</h3>
                    <p style={{ color: '#a8a29e', marginBottom: '2rem' }}>Made with ❤️ for students.</p>
                    <div style={{ fontSize: '0.9rem', color: '#57534e' }}>&copy; 2026 BorrowBox. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
}
