import React, { useState } from 'react';
import { Key, Save, AlertCircle, Eye, EyeOff, TestTube } from 'lucide-react';

interface PaymentKeys {
  publicKey: string;
  privateKey: string;
  baseUrl: string;
}

export function PaymentGatewaySettings() {
  const [keys, setKeys] = useState<PaymentKeys>({
    publicKey: '',
    privateKey: '',
    baseUrl: 'https://my-coolpay.com/api'
  });
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string>();
  const [testResult, setTestResult] = useState<'success' | 'error'>();

  const handleSave = async () => {
    if (!keys.publicKey || !keys.privateKey) {
      setError('Both public and private keys are required');
      return;
    }

    try {
      setSaving(true);
      setError(undefined);
      // TODO: Save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to save API keys');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      setError(undefined);
      setTestResult(undefined);
      // TODO: Implement test connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestResult('success');
    } catch (err) {
      setTestResult('error');
      setError('Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Payment Gateway</h2>
          <p className="text-sm text-gray-600">Configure My-CoolPay API keys</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Public Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Public Key
          </label>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-50">
              <Key className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={keys.publicKey}
              onChange={(e) => setKeys(prev => ({ ...prev, publicKey: e.target.value }))}
              placeholder="Enter your public key"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
            />
          </div>
        </div>

        {/* Private Key */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Private Key
          </label>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gray-50">
              <Key className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 relative">
              <input
                type={showPrivateKey ? 'text' : 'password'}
                value={keys.privateKey}
                onChange={(e) => setKeys(prev => ({ ...prev, privateKey: e.target.value }))}
                placeholder="Enter your private key"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
              />
              <button
                type="button"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                {showPrivateKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* API URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API URL
          </label>
          <input
            type="url"
            value={keys.baseUrl}
            onChange={(e) => setKeys(prev => ({ ...prev, baseUrl: e.target.value }))}
            placeholder="Enter API URL"
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-pink-500 focus:ring focus:ring-pink-200"
          />
        </div>

        {/* Test Connection */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={testConnection}
            disabled={testing || !keys.publicKey || !keys.privateKey}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
          >
            <TestTube className="w-4 h-4" />
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>

          {testResult === 'success' && (
            <p className="mt-2 text-sm text-green-600">
              Connection test successful!
            </p>
          )}
        </div>

        {/* Documentation */}
        <div className="p-4 rounded-lg bg-gray-50 text-sm text-gray-600">
          <h3 className="font-medium text-gray-900 mb-2">Important Notes</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Never share your private key with anyone</li>
            <li>Keep your keys secure and rotate them periodically</li>
            <li>Test your integration after updating keys</li>
            <li>
              <a 
                href="https://my-coolpay.com/docs" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700"
              >
                View My-CoolPay Documentation →
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}