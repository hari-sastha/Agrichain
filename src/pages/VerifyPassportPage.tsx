import React from 'react';
import { QRScanner } from '../components/passport/QRScanner';

export const VerifyPassportPage: React.FC = () => {
  return (
    <div className="py-8 space-y-6 animate-in fade-in duration-200">
      <QRScanner />
    </div>
  );
};
