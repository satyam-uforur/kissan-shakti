import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
    themeColor: '#16a34a',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: 'किसान शक्ति - AI Voice Assistant',
    description: 'AI Voice Assistant for Indian Farmers by KissanAI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="hi">
            <body>{children}</body>
        </html>
    );
}