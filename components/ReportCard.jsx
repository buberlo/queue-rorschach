'use client';

import { useState } from 'react';
import InkblotViewer from './InkblotViewer';

const normalizeScore = (report) => {
  const raw = report?.mismatchScore ?? report?.score ?? 0;
  const value = raw && typeof raw === 'object' ? raw.score ?? raw.value ?? 0 : raw;
  const num = Number(value) || 0;
  const pct = num <= 1 ? num * 100 : num;
  return Math.max(0, Math.min(100, Math.round(pct)));
};

const scoreLabel = (pct) => {
  if (pct >= 70) return 'Strong mismatch';
  if (pct >= 40) return 'Moderate mismatch';
  return 'Close alignment';
};

export default function ReportCard({ report }) {
  const [copied, setCopied] = useState('');
  const [status, setStatus] = useState('');

  if (!report) return null;

  const scorePct = normalizeScore(report);
  const url =
    report.url ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/report/${report.id}`
      : `/report/${report.id}`);
  const story = report.story || report.llmStory || '';
  const suggestedCopy = report.suggestedCopy || report.copyRewrite || '';
  const interpretation = report.interpretation || '';
  const llmInterpretation = report.llmInterpretation || '';
  const prompt = report.prompt || report.pathSummary || 'Anonymous session path';
  const inkblot = report.inkblotSvg || report.inkblot;

  const copyValue = async (value, key, message) => {
    if (!value) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(key);
      setStatus(message);
      setTimeout(() => {
        setCopied('');
        setStatus('');
      }, 1800);
    } catch {
      setStatus('Copy failed');
      setTimeout(() => setStatus(''), 1800);
    }
  };

  const share = async () => {
    const data = {
      title: 'Queue Rorschach Report',
      text: `Rorschach mismatch: ${scorePct}%`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
        setStatus('Shared');
      } else {
        await copyValue(url, 'url', 'Link copied');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setStatus('Share failed');
      }
    }

    setTimeout(() => setStatus(''), 2200);
  };

  return (
    <article className="report-card" data-report-id={report.id}>
      <header className="report-card__header">
        <div>
          <h2>Queue Rorschach Report</h2>
          <p className="report-card__meta">
            {report.id}
            {report.createdAt ? ` · ${new Date(report.createdAt).toLocaleString()}` : ''}
          </p>
        </div>

        <div
          className="report-card__score"
          role="meter"
          aria-valuenow={scorePct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span>{scorePct}%</span>
          <strong>{scoreLabel(scorePct)}</strong>
          <div className="score-bar">
            <div className="score-bar__fill" style={{ width: `${scorePct}%` }} />
          </div>
        </div>
      </header>

      {inkblot ? <InkblotViewer svg={inkblot} prompt={prompt} /> : null}

      <section className="report-card__section">
        <h3>Interpretations</h3>
        <div className="report-card__grid">
          <div>
            <h4>Your interpretation</h4>
            <p>{interpretation || 'No interpretation provided.'}</p>
          </div>
          <div>
            <h4>LLM interpretation</h4>
            <p>{llmInterpretation || 'No LLM interpretation available.'}</p>
          </div>
        </div>
      </section>

      {story ? (
        <section className="report-card__section">
          <h3>Generated story</h3>
          <p className="report-card__story">{story}</p>
        </section>
      ) : null}

      {suggestedCopy ? (
        <section className="report-card__section">
          <h3>Suggested copy rewrite</h3>
          <p>{suggestedCopy}</p>
        </section>
      ) : null}

      <footer className="report-card__actions">
        <button type="button" onClick={share}>
          {copied === 'url' ? 'Link copied' : 'Share report'}
        </button>
        <button type="button" onClick={() => copyValue(url, 'url', 'Link copied')}>
          {copied === 'url' ? 'Copied' : 'Copy link'}
        </button>
        {story ? (
          <button type="button" onClick={() => copyValue(story, 'story', 'Story copied')}>