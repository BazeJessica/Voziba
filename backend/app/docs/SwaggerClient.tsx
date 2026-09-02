'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function SwaggerClient({ spec }: { spec: any }) {
  useEffect(() => {
    // Suppress third-party legacy lifecycle warnings from swagger-ui-react internal components
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('UNSAFE_componentWillReceiveProps') ||
          args[0].includes('UNSAFE_componentWillMount'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '1rem' }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}
