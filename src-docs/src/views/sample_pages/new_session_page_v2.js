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

import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../components/with_theme';
import {
  OuiIcon,
  OuiTitle,
} from '../../../../src/components';
import { AnimatedSidebar } from './animated_sidebar';
import { OllyMascot } from './olly_mascot';

const RECENT_SESSIONS = [
  { id: '1', title: 'Error Rate Spike', type: 'Thread', time: '2 hours ago' },
  { id: '2', title: 'Health check, Apr 11', type: 'Automation', time: '2:00 AM' },
  { id: '3', title: 'Orchestrator misroute', type: 'Investigation', time: '2 hours ago' },
  { id: '4', title: 'Error logs — checkout-svc', type: 'Query', time: '5 min ago' },
];

const TABS = ['Resume', 'Explore', 'Favorites', 'Monitor'];
const TAB_ICONS = { Resume: 'refresh', Explore: 'compass', Favorites: 'starEmpty', Monitor: 'eye' };

const MONITOR_ITEMS = [
  { label: 'Dashboards', subtitle: 'Custom dashboards', icon: 'navDashboards' },
  { label: 'Application Map', subtitle: 'Service topology', icon: 'navServiceMap' },
  { label: 'Services', subtitle: 'Application services', icon: 'apps' },
  { label: 'Agents', subtitle: 'AI agents', icon: 'watchesApp' },
  { label: 'Alarms', subtitle: 'Alert management', icon: 'navAlerting' },
  { label: 'SLOs', subtitle: 'Service level objectives', icon: 'visGoal' },
];

const BUILD_ITEMS = [
  { label: 'Explorer', subtitle: 'Log exploration', icon: 'navDiscover' },
  { label: 'Prompt Playground', subtitle: 'Test prompts', icon: 'consoleApp' },
  { label: 'Evaluators', subtitle: 'Agent evals', icon: 'checkInCircleFilled' },
  { label: 'Datasets', subtitle: 'Data management', icon: 'database' },
  { label: 'Automations', subtitle: 'Workflow rules', icon: 'gear' },
];

function SessionCard({ title, type, time, dark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '0 0 200px',
        height: 160,
        borderRadius: 12,
        border: `1px solid ${dark ? 'rgba(126,195,230,0.12)' : '#E4E6F0'}`,
        background: dark ? (hovered ? 'rgba(126,195,230,0.06)' : 'rgba(255,255,255,0.02)') : (hovered ? '#F5F6FB' : '#FFFFFF'),
        padding: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: dark ? '#F2F6FB' : '#0B1733', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 11, color: dark ? 'rgba(242,246,251,0.5)' : '#9BA3C2' }}>{type} · {time}</div>
    </div>
  );
}

function QuickstartCard({ label, subtitle, icon, dark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 10,
        border: `1px solid ${dark ? 'rgba(126,195,230,0.12)' : '#E4E6F0'}`,
        background: dark ? (hovered ? 'rgba(126,195,230,0.06)' : 'rgba(255,255,255,0.02)') : (hovered ? '#F5F6FB' : '#FFFFFF'),
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        transition: 'background 150ms ease',
        textAlign: 'center',
      }}>
      <OuiIcon type={icon} size="l" color={dark ? 'ghost' : 'subdued'} />
      <div style={{ fontSize: 13, fontWeight: 500, color: dark ? '#F2F6FB' : '#0B1733' }}>{label}</div>
      <div style={{ fontSize: 11, color: dark ? 'rgba(242,246,251,0.45)' : '#9BA3C2' }}>{subtitle}</div>
    </div>
  );
}

const NewSessionPageV2Content = () => {
  const themeContext = useContext(ThemeContext);
  const dark = themeContext.theme === 'v9-dark';
  const [activeTab, setActiveTab] = useState('Explore');

  const sectionLabel = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: dark ? 'rgba(242,246,251,0.4)' : '#9BA3C2',
    marginBottom: 16,
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      padding: '48px 56px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Pick up where you left off */}
        <div style={{ marginBottom: 48 }}>
          <div style={sectionLabel}>Pick up where you left off</div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {RECENT_SESSIONS.map((s) => (
              <SessionCard key={s.id} title={s.title} type={s.type} time={s.time} dark={dark} />
            ))}
          </div>
          <div style={{ marginTop: 12, textAlign: 'right' }}>
            <span style={{ fontSize: 13, color: dark ? '#7EC3E6' : '#2D4BD8', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              View all sessions <OuiIcon type="arrowRight" size="s" />
            </span>
          </div>
        </div>

        {/* Start something new */}
        <div>
          <div style={sectionLabel}>Start something new</div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: 4,
            marginBottom: 32,
            background: dark ? 'rgba(126,195,230,0.06)' : '#F0F2F7',
            borderRadius: 8,
            padding: 4,
            width: 'fit-content',
          }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeTab === tab ? (dark ? 'rgba(126,195,230,0.15)' : '#FFFFFF') : 'transparent',
                  boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  color: activeTab === tab ? (dark ? '#F2F6FB' : '#0B1733') : (dark ? 'rgba(242,246,251,0.55)' : '#9BA3C2'),
                  fontSize: 13,
                  fontWeight: activeTab === tab ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}>
                <OuiIcon type={TAB_ICONS[tab]} size="s" />
                {tab}
              </button>
            ))}
          </div>

          {/* Create content */}
          {activeTab === 'Explore' && (
            <>
              <div style={{ marginBottom: 32 }}>
                <div style={{ ...sectionLabel, marginBottom: 12 }}>Monitor</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {MONITOR_ITEMS.map((item) => (
                    <QuickstartCard key={item.label} {...item} dark={dark} />
                  ))}
                </div>
              </div>
              <div>
                <div style={{ ...sectionLabel, marginBottom: 12 }}>Build</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {BUILD_ITEMS.map((item) => (
                    <QuickstartCard key={item.label} {...item} dark={dark} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Resume — recent sessions inline */}
          {activeTab === 'Resume' && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {RECENT_SESSIONS.map((s) => (
                <SessionCard key={s.id} title={s.title} type={s.type} time={s.time} dark={dark} />
              ))}
            </div>
          )}

          {/* Favorites */}
          {activeTab === 'Favorites' && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: dark ? 'rgba(242,246,251,0.4)' : '#9BA3C2', fontSize: 14 }}>
              Your starred dashboards, queries, and views will appear here.
            </div>
          )}

          {/* Monitor */}
          {activeTab === 'Monitor' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {MONITOR_ITEMS.map((item) => (
                <QuickstartCard key={item.label} {...item} dark={dark} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function BottomInputBar({ dark }) {
  const [query, setQuery] = useState('');
  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 620,
      zIndex: 20,
      background: dark ? 'rgba(14, 26, 46, 0.88)' : 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      borderRadius: 16,
      border: `1px solid ${dark ? 'rgba(126,195,230,0.15)' : '#D4DCE8'}`,
      boxShadow: dark
        ? '0 12px 40px rgba(0,0,0,0.4)'
        : '0 12px 40px rgba(45,75,216,0.1), 0 2px 8px rgba(0,0,0,0.04)',
      padding: '16px 20px',
    }}>
      {/* Greeting */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
      }}>
        <OllyMascot size={28} />
        <span style={{
          fontSize: 14,
          fontWeight: 500,
          color: dark ? '#F2F6FB' : '#0B1733',
        }}>
          Hey John, your OpenSearch Observability assistant is ready.
        </span>
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 10,
        background: dark ? 'rgba(255,255,255,0.04)' : '#F5F6FB',
        border: `1px solid ${dark ? 'rgba(126,195,230,0.12)' : '#E4E6F0'}`,
      }}>
        <input
          type="text"
          placeholder="Ask anything or use / for commands"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 14,
            color: dark ? '#F2F6FB' : '#0B1733',
          }}
        />
        <OuiIcon type="starEmpty" size="m" color={dark ? 'ghost' : 'subdued'} style={{ cursor: 'pointer' }} />
        <OuiIcon type="inputOutput" size="m" color={dark ? 'ghost' : 'subdued'} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

export const NewSessionPageV2 = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const themeContext = useContext(ThemeContext);
  const dark = themeContext.theme === 'v9-dark';

  return (
    <div style={{
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <AnimatedSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        locked
      />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', position: 'relative' }}>
        <NewSessionPageV2Content />
        <BottomInputBar dark={dark} />
      </div>
    </div>
  );
};
