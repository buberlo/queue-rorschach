import React from 'react';
import '../globals.css';

export const metadata = {
  title: {
    default: 'Queue Rorschach',
    template: '%s · Queue Rorschach',
  },
  description:
    'Anonymous visitor sessions turned into inkblot images, LLM stories, cognitive mismatch scores, and shareable Rorschach reports.',
  applicationName: 'Queue Rorschach',
  openGraph: {
    title: 'Queue Rorschach',
    description:
      'Ingest anonymous session paths, generate inkblots and stories, and score interpretive mismatch.',
    siteName: 'Queue Rorschach',
  },
  twitter: {
    card: 'summary',
    title: 'Queue Rorschach',
    description:
      'Anonymous session paths, inkblot images, LLM stories, and shareable mismatch reports.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}