'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [serverMessage, setServerMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testServerConnection = async () => {
    setLoading(true);
    setError('');
    setServerMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/test');
      const data = await response.json();
      setServerMessage(data.message);
    } catch (err) {
      setError('Failed to connect to server. Make sure the server is running on port 5000.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Secret Dashboard</h1>
      <p className="mb-6">You are logged in!</p>
      
      <div className="space-y-4 mb-6">
        <Button 
          onClick={testServerConnection} 
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Server Connection'}
        </Button>
        
        {serverMessage && (
          <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-md">
            <p className="text-green-800 dark:text-green-200">
              <strong>Success!</strong> {serverMessage}
            </p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md">
            <p className="text-red-800 dark:text-red-200">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </div>

      <Link href="/dashboard/upload-test">
        <Button variant="outline">Test Cloudinary Image Upload</Button>
      </Link>
    </div>
  );
}

