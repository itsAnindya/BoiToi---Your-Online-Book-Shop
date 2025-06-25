import React from 'react';

const CartIcon = ({ count = 0, onClick }) => (
  <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ verticalAlign: 'middle' }}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6" />
    </svg>
    {count > 0 && (
      <span
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px',
          fontWeight: 'bold',
          lineHeight: 1,
        }}
      >
        {count}
      </span>
    )}
  </div>
);

export default CartIcon;