/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import React, { useContext } from 'react';
import { ThemeContext } from '../../components/with_theme';
import {
  OuiIcon,
  OuiTitle,
} from '../../../../src/components';

function formatSessionTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function ChatIcon({ size = 15, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3.5V16H6a2 2 0 0 1-2-2V6z"/>
    </svg>
  );
}

export const SessionList = ({
  sessions = [],
  activeSessionId,
  onSelectSession,
  onCreateSession,
}) => {
  const themeContext = useContext(ThemeContext);
  const dark = themeContext.theme === 'v9-dark';

  const t = dark ? {
    textPrimary: '#F2F6FB',
    textMuted: 'rgba(242,246,251, 0.55)',
    textSub: 'rgba(242,246,251, 0.40)',
    hoverBg: 'rgba(126,195,230, 0.12)',
    dot: 'rgba(126,195,230, 0.5)',
    accent: '#7EC3E6',
  } : {
    textPrimary: '#0B1733',
    textMuted: '#9BA3C2',
    textSub: '#B2B8D2',
    hoverBg: '#E8EAF5',
    dot: '#C5D0F8',
    accent: '#2D4BD8',
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: '32px 40px',
      overflowY: 'auto',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 640, width: '100%' }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <OuiTitle size="s">
            <h2>All sessions</h2>
          </OuiTitle>
          <button
            type="button"
            className="emptySessionPage__v4FilterButton"
            onClick={onCreateSession}
            aria-label="New session"
          >
            <OuiIcon type="plus" size="s" />
            <span>Add new</span>
          </button>
        </div>

        {/* Session items — same style as left nav Recent */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const meta = [formatSessionTime(session.createdAt)];
            if (session.tabs.length > 0) {
              meta.push(`${session.tabs.length} ${session.tabs.length === 1 ? 'tab' : 'tabs'}`);
            }
            if (session.threadKey) {
              meta.push('Thread');
            }

            return (
              <SessionRow
                key={session.id}
                name={session.title}
                meta={meta}
                isActive={isActive}
                t={t}
                onClick={() => onSelectSession(session.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

function SessionRow({ name, meta, isActive, t, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '9px 10px',
        borderRadius: 8,
        cursor: 'pointer',
        background: isActive ? t.hoverBg : hovered ? t.hoverBg : 'transparent',
        transition: 'background 150ms ease',
      }}>
      <span style={{
        color: isActive ? t.accent : t.textMuted,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}>
        <ChatIcon size={15} stroke="currentColor" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13,
          color: isActive ? t.accent : t.textPrimary,
          fontWeight: isActive ? 500 : 400,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{name}</div>
        <div style={{
          fontSize: 11,
          color: t.textSub,
          marginTop: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {meta.map((m, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ width: 4, height: 4, borderRadius: '50%', background: t.dot, flexShrink: 0 }} />}
              <span>{m}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      {isActive && (
        <span style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: t.accent,
          flexShrink: 0,
        }} />
      )}
    </div>
  );
}
