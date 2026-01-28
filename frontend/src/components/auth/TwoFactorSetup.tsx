'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ShieldCheck, 
  Smartphone, 
  Key, 
  QrCode, 
  Copy, 
  Check,
  AlertTriangle,
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean) => void;
  userEmail: string;
}

interface QRCodeData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export default function TwoFactorSetup({
  isOpen,
  onClose,
  onComplete,
  userEmail
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'backup' | 'complete'>('intro');
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedCodes, setCopiedCodes] = useState<boolean[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate 2FA secret and QR code
  const setupTwoFactor = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/auth/2fa/setup', { method: 'POST' });
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData: QRCodeData = {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Travellr:${encodeURIComponent(userEmail)}?secret=JBSWY3DPEHPK3PXP&issuer=Travellr`,
        backupCodes: [
          '123456789',
          '987654321',
          '456789123',
          '789123456',
          '321654987',
          '654987321',
          '147258369',
          '963852741'
        ]
      };
      
      setQrData(mockData);
      setStep('qr');
    } catch (err) {
      setError('Failed to setup 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify the entered code
  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real app, this would verify with the backend
      // const response = await fetch('/api/auth/2fa/verify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code: verificationCode, secret: qrData?.secret })
      // });
      
      // Mock verification (accept any 6-digit code)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === '123456' || verificationCode.length === 6) {
        setStep('backup');
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Complete the setup
  const completeSetup = async () => {
    setLoading(true);
    
    try {
      // Save 2FA settings to backend
      // await fetch('/api/auth/2fa/enable', { method: 'POST' });
      
      setStep('complete');
      setTimeout(() => {
        onComplete(true);
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Copy backup code to clipboard
  const copyBackupCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodes(prev => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
      
      setTimeout(() => {
        setCopiedCodes(prev => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      }, 2000);
      
      toast.success('Backup code copied!');
    } catch (err) {
      toast.error('Failed to copy backup code');
    }
  };

  // Handle verification code input
  const handleCodeInput = (value: string, index: number) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = verificationCode.split('');
      newCode[index] = value;
      setVerificationCode(newCode.slice(0, 6).join(''));
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const renderIntroStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <Shield className="w-10 h-10 text-blue-600" />
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Secure Your Account
        </h3>
        <p className="text-gray-600">
          Two-factor authentication adds an extra layer of security to your account.
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 text-left">
        <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li className="flex items-start">
            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
            Install an authenticator app (Google Authenticator, Authy)
          </li>
          <li className="flex items-start">
            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
            Scan the QR code with your authenticator app
          </li>
          <li className="flex items-start">
            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
            Enter the code from your app to verify setup
          </li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Skip for Now
        </Button>
        <Button onClick={setupTwoFactor} disabled={loading} className="flex-1">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
          Get Started
        </Button>
      </div>
    </motion.div>
  );

  const renderQRStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Scan QR Code
        </h3>
        <p className="text-gray-600">
          Use your authenticator app to scan this QR code
        </p>
      </div>

      {qrData && (
        <div className="flex justify-center">
          <div className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
            <img 
              src={qrData.qrCodeUrl} 
              alt="2FA QR Code" 
              className="w-48 h-48"
            />
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Manual Setup</h4>
        <p className="text-sm text-gray-600 mb-2">
          If you can't scan the QR code, enter this secret key manually:
        </p>
        <div className="flex items-center space-x-2">
          <code className="flex-1 bg-white px-3 py-2 rounded border text-sm font-mono">
            {qrData?.secret}
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={() => qrData && navigator.clipboard.writeText(qrData.secret)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('intro')} className="flex-1">
          Back
        </Button>
        <Button onClick={() => setStep('verify')} className="flex-1">
          I've Scanned It
        </Button>
      </div>
    </motion.div>
  );

  const renderVerifyStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Verify Setup
        </h3>
        <p className="text-gray-600">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Input
              key={index}
              ref={(el: HTMLInputElement | null) => {
                if (el) inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={verificationCode[index] || ''}
              onChange={(e) => handleCodeInput(e.target.value, index)}
              className="w-12 h-12 text-center text-xl font-bold"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 justify-center">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('qr')} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={verifyCode} 
          disabled={loading || verificationCode.length !== 6} 
          className="flex-1"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
          Verify
        </Button>
      </div>
    </motion.div>
  );

  const renderBackupStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Save Backup Codes
        </h3>
        <p className="text-gray-600">
          Store these backup codes in a safe place. You can use them to access your account if you lose your phone.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 font-semibold text-sm">Important!</p>
            <p className="text-red-700 text-sm">
              Each backup code can only be used once. Keep them secure and don't share them.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {qrData?.backupCodes.map((code, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-2 bg-gray-50 rounded border"
          >
            <code className="flex-1 font-mono text-sm">{code}</code>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyBackupCode(code, index)}
              className="h-8 w-8 p-0"
            >
              {copiedCodes[index] ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('verify')} className="flex-1">
          Back
        </Button>
        <Button onClick={completeSetup} disabled={loading} className="flex-1">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
          Complete Setup
        </Button>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <ShieldCheck className="w-10 h-10 text-green-600" />
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Two-Factor Authentication Enabled!
        </h3>
        <p className="text-gray-600">
          Your account is now more secure. You'll need your authenticator app to sign in.
        </p>
      </div>

      <Badge variant="secondary" className="bg-green-100 text-green-800">
        ✓ Account Security Enhanced
      </Badge>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        >
          <Card>
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>Two-Factor Authentication</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {step === 'intro' && renderIntroStep()}
              {step === 'qr' && renderQRStep()}
              {step === 'verify' && renderVerifyStep()}
              {step === 'backup' && renderBackupStep()}
              {step === 'complete' && renderCompleteStep()}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}