import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { convexClient } from './lib/convex';
import { ConvexProvider } from 'convex/react';

const root = createRoot(document.getElementById('root')!);

if (convexClient) {
  root.render(
    <StrictMode>
      <ConvexProvider client={convexClient}>
        <App />
      </ConvexProvider>
    </StrictMode>,
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
