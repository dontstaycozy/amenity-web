"use client";
import React, { useState } from 'react';
import { Plus } from '../components/svgs';
import styles from './HelpPage.module.css';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: '#22305a',
      borderRadius: 8,
      marginBottom: 12,
      padding: 16,
      color: '#fff'
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <Plus style={{
          marginRight: 12,
          transform: open ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.2s'
        }} />
        <span style={{ fontWeight: 600 }}>{question}</span>
      </div>
      {open && (
        <div style={{ marginTop: 12, color: '#ffe8a3', whiteSpace: 'pre-line' }}>
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;