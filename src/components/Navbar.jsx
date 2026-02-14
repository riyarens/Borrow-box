import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      alert('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--border-color)',
      padding: '1rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
          <ShoppingBag size={24} />
          BorrowBox
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }}>


          {user ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Hi, {user.displayName || user.email}</span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                <LogOut size={16} /> Log out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-secondary">Log in</Link>
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', color: 'var(--text-primary)' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          borderTop: '1px solid var(--border-color)',
          padding: '1rem',
          backgroundColor: 'white',
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>


            {user ? (
              <>
                <div style={{ textAlign: 'center', fontWeight: 600 }}>Hi, {user.displayName || user.email}</div>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn btn-secondary" style={{ width: '100%' }}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ textAlign: 'center' }}>Log in</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ textAlign: 'center' }}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
