//import './index.module.css'; // optional global CSS
import SessionWrapper from './SessionWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><SessionWrapper>{children}</SessionWrapper></body>
    </html>
  );
}
