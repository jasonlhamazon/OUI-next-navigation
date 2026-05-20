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

import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../../components/with_theme';
import {
  OuiButtonIcon,
  OuiIcon,
} from '../../../../src/components';
import { AnimatedSidebar } from './animated_sidebar';
import { OllyMascot } from './olly_mascot';

// ============================================================
// DATA
// ============================================================

const RECENT_ITEMS = [
  { name: 'Latency spike investigation', meta: 'Thread · 2 hours ago', icon: 'discuss' },
  { name: 'Health check, Apr 11', meta: 'Automation · 2:00 AM', icon: 'gear' },
  { name: 'Orchestrator misroute', meta: 'Investigation · 2 hours ago', icon: 'search' },
  { name: 'Error logs — checkout-svc', meta: 'Query · 5 min ago', icon: 'navDiscover' },
  { name: 'Payment service P99 breach', meta: 'Alert · Critical · 15 min ago', icon: 'navAlerting' },
  { name: 'CPU threshold exceeded', meta: 'Alert · Warning · 1 hour ago', icon: 'navAlerting' },
];

const EXPLORE_ITEMS = [
  { name: 'Dashboards', subtitle: 'Custom dashboards', icon: 'navDashboards' },
  { name: 'Logs', subtitle: 'Log exploration', icon: 'navDiscover' },
  { name: 'Discover (log)', subtitle: 'Saved log queries', icon: 'navDiscover' },
  { name: 'Discover (metric)', subtitle: 'Saved metric queries', icon: 'visArea' },
  { name: 'Metrics', subtitle: 'Metric analytics', icon: 'visArea' },
  { name: 'Notebooks', subtitle: 'Interactive analysis', icon: 'notebookApp' },
];

const FAVORITES = [
  { name: 'System overview', meta: 'Dashboard · 5 min ago', icon: 'navDashboards' },
  { name: 'Error rate by service', meta: 'Saved log · source=logs | where level="ERROR"', icon: 'navDiscover' },
  { name: 'CPU utilization', meta: 'Saved metric · stats avg(cpu) by host', icon: 'visArea' },
  { name: 'API performance', meta: 'Dashboard · Updated 30 min ago', icon: 'navDashboards' },
  { name: 'Checkout funnel', meta: 'Dashboard · Updated 1 h ago', icon: 'navDashboards' },
  { name: 'Memory pressure by host', meta: 'Saved metric · stats avg(mem) by host', icon: 'visArea' },
];

const MONITOR_ITEMS = [
  { name: 'Application Map', subtitle: 'Service topology', icon: 'navServiceMap' },
  { name: 'Application Traces', subtitle: 'Distributed tracing', icon: 'apmTrace' },
  { name: 'Application Services', subtitle: 'Service health', icon: 'apps' },
];

const TABS = ['Resume', 'Explore', 'Favorites', 'Monitor'];
const TAB_ICONS = { Resume: 'refresh', Explore: 'compass', Favorites: 'starEmpty', Monitor: 'eye' };

// ============================================================
// COMPONENTS
// ============================================================

function ListItem({ name, meta, icon, dark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 9,
        cursor: 'pointer',
        background: hovered ? (dark ? 'rgba(126,195,230,0.06)' : '#F5F6FB') : (dark ? 'rgba(255,255,255,0.02)' : '#FFFFFF'),
        border: `1px solid ${dark ? 'rgba(126,195,230,0.08)' : '#E4E6F0'}`,
        transition: 'background 150ms ease',
      }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        background: dark ? 'rgba(126,195,230,0.1)' : '#EDF0FB',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}>
        <OuiIcon type={icon} size="s" color={dark ? 'ghost' : 'primary'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: dark ? '#F2F6FB' : '#0B1733' }}>{name}</div>
        {meta && <div style={{ fontSize: 11, color: dark ? 'rgba(242,246,251,0.45)' : '#9BA3C2', marginTop: 1 }}>{meta}</div>}
      </div>
    </div>
  );
}

function GridCard({ name, subtitle, icon, dark }) {
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
      <div style={{ fontSize: 13, fontWeight: 500, color: dark ? '#F2F6FB' : '#0B1733' }}>{name}</div>
      {subtitle && <div style={{ fontSize: 11, color: dark ? 'rgba(242,246,251,0.45)' : '#9BA3C2' }}>{subtitle}</div>}
    </div>
  );
}

// ============================================================
// MAIN CONTENT
// ============================================================

const V3Content = () => {
  const themeContext = useContext(ThemeContext);
  const dark = themeContext.theme === 'v9-dark';
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Resume');
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      const textarea = el.querySelector('textarea');
      if (textarea) textarea.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  };

  const sectionLabel = {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: dark ? 'rgba(242,246,251,0.4)' : '#9BA3C2',
    marginBottom: 12,
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      padding: '64px 56px 48px',
      background: 'transparent',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header: Mascot + Title */}
        <div style={{ marginBottom: 8 }}>
          <OllyMascot size={44} />
        </div>
        <h1 style={{
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: -0.5,
          lineHeight: 1.1,
          margin: 0,
          color: dark ? '#F2F6FB' : '#0B1733',
        }}>
          Welcome back, John.
        </h1>
        <p style={{
          fontSize: 15,
          fontWeight: 400,
          color: dark ? 'rgba(126,195,230,0.7)' : '#2D4BD8',
          marginTop: 6,
          marginBottom: 28,
        }}>
          Your OpenSearch Observability assistant is ready.
        </p>

        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: 36 }} ref={textareaRef}>
          <textarea
            placeholder="Ask anything. Type / for actions, @ to reference a service."
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              display: 'block',
              width: '100%',
              padding: '16px 18px 44px',
              border: `1px solid ${dark ? 'rgba(126,195,230,0.18)' : '#D4DCE8'}`,
              borderRadius: 10,
              background: dark ? 'rgba(14, 26, 46, 0.6)' : '#FFFFFF',
              fontFamily: 'inherit',
              fontSize: 14,
              lineHeight: 1.5,
              color: dark ? '#F2F6FB' : '#0B1733',
              resize: 'none',
              outline: 'none',
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{ pointerEvents: 'auto' }}>
              <OuiButtonIcon iconType="plus" aria-label="Add" size="s" color="text" />
            </div>
            <div style={{ pointerEvents: 'auto' }}>
              <OuiButtonIcon iconType="sortUp" aria-label="Send" display="fill" size="s" isDisabled={!query.trim()} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 4,
          marginBottom: 28,
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

        {/* Tab content */}
        {activeTab === 'Resume' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Active alerts */}
            <div style={{
              display: 'flex',
              gap: 8,
              marginBottom: 12,
            }}>
              {[
                { label: 'P99 latency breach', color: '#DC3545' },
                { label: 'Disk usage 92%', color: '#CDA849' },
                { label: 'Error rate spike', color: '#DC3545' },
              ].map((alert) => (
                <div key={alert.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: dark ? 'rgba(220,53,69,0.08)' : 'rgba(220,53,69,0.05)',
                  border: `1px solid ${dark ? 'rgba(220,53,69,0.2)' : 'rgba(220,53,69,0.15)'}`,
                  cursor: 'pointer',
                  fontSize: 12,
                  color: dark ? '#F2F6FB' : '#0B1733',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: alert.color, flexShrink: 0 }} />
                  {alert.label}
                </div>
              ))}
            </div>

            {/* Recent items */}
            {RECENT_ITEMS.map((item) => (
              <ListItem key={item.name} name={item.name} meta={item.meta} icon={item.icon} dark={dark} />
            ))}
          </div>
        )}

        {activeTab === 'Explore' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {EXPLORE_ITEMS.map((item) => (
              <GridCard key={item.name} name={item.name} subtitle={item.subtitle} icon={item.icon} dark={dark} />
            ))}
          </div>
        )}

        {activeTab === 'Favorites' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FAVORITES.map((item) => (
              <ListItem key={item.name} name={item.name} meta={item.meta} icon={item.icon} dark={dark} />
            ))}
          </div>
        )}

        {activeTab === 'Monitor' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {MONITOR_ITEMS.map((item) => (
              <GridCard key={item.name} name={item.name} subtitle={item.subtitle} icon={item.icon} dark={dark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// EXPORT
// ============================================================

export const NewSessionPageV3 = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <V3Content />
      </div>
    </div>
  );
};
