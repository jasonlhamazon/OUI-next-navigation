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

import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from '../../components/with_theme';
import {
  OuiAvatar,
  OuiButtonIcon,
  OuiIcon,
  OuiPopover,
  OuiToolTip,
} from '../../../../src/components';
import {
  WorkspaceNavPanelContent,
  SettingsPopoverContent,
  ProfilePopoverContent,
} from './sample_pages_left_nav';

// ============================================================
// TOKENS
// ============================================================

const LIGHT = {
  sidebarBg: '#F5F6FB',
  divider: '#E0E2ED',
  dividerPanel: '#E4E6F0',
  idleIcon: '#9BA3C2',
  hoverBg: '#E8EAF5',
  textPrimary: '#0B1733',
  textMuted: '#9BA3C2',
  textSub: '#B2B8D2',
  recentActiveBg: '#EDF2F8',
  recentMetaDot: '#B8D0E8',
  accent: '#2E4A8F',
  avatarBg: '#DC3545',
  borderRight: '#E0E2ED',
};

const DARK = {
  sidebarBg: '#1A2332',
  divider: 'rgba(126,195,230, 0.14)',
  dividerPanel: 'rgba(126,195,230, 0.14)',
  idleIcon: 'rgba(242,246,251, 0.45)',
  hoverBg: 'rgba(126,195,230, 0.12)',
  textPrimary: '#F2F6FB',
  textMuted: 'rgba(242,246,251, 0.55)',
  textSub: 'rgba(242,246,251, 0.40)',
  recentActiveBg: 'rgba(126,195,230, 0.12)',
  recentMetaDot: 'rgba(126,195,230, 0.5)',
  accent: '#7EC3E6',
  avatarBg: '#DC3545',
  borderRight: 'rgba(126,195,230, 0.14)',
};

// ============================================================
// ICONS
// ============================================================

function SideIcon({ name, size = 16, stroke = 'currentColor', strokeWidth = 1.6 }) {
  const c = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'sidebar': return <svg {...c}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>;
    case 'plus': return <svg {...c}><path d="M12 5v14M5 12h14"/></svg>;
    case 'search': return <svg {...c}><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'chats2': return <svg {...c}><rect x="8" y="3" width="13" height="9" rx="2"/><rect x="3" y="8" width="13" height="9" rx="2"/><path d="M7 17v3l4-3"/></svg>;
    case 'building': return <svg {...c}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>;
    case 'code': return <svg {...c}><path d="M9 8l-4 4 4 4M15 8l4 4-4 4"/></svg>;
    case 'settings': return <svg {...c}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>;
    case 'chat': return <svg {...c}><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3.5V16H6a2 2 0 0 1-2-2V6z"/></svg>;
    case 'agents': return <svg {...c}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="6" r="2"/></svg>;
    case 'evaluations': return <svg {...c}><path d="M9 11l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>;
    case 'chev-ud': return <svg {...c}><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>;
    default: return null;
  }
}

// ============================================================
// LOGO
// ============================================================

function OSLogo({ size = 20, spinKey = 0 }) {
  const animating = spinKey > 0;
  const quarterPath = "M61.7374 23.5C60.4878 23.5 59.4748 24.513 59.4748 25.7626C59.4748 44.3813 44.3813 59.4748 25.7626 59.4748C24.513 59.4748 23.5 60.4878 23.5 61.7374C23.5 62.987 24.513 64 25.7626 64C46.8805 64 64 46.8805 64 25.7626C64 24.513 62.987 23.5 61.7374 23.5Z";

  const spinStyle = animating ? {
    transformOrigin: '26px 26px',
    transformBox: 'view-box',
    animation: 'osQuarterRotate 900ms cubic-bezier(0.22, 0.61, 0.36, 1) 1 both',
  } : { transformOrigin: '26px 26px', transformBox: 'view-box' };

  const wobbleStyle = animating ? {
    transformOrigin: '26px 26px',
    transformBox: 'view-box',
    animation: 'osWobble 900ms cubic-bezier(0.34, 1.32, 0.64, 1) 1',
  } : { transformOrigin: '26px 26px', transformBox: 'view-box' };

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="OpenSearch">
      <g key={`quarter-${spinKey}`} style={spinStyle}>
        <path d={quarterPath} fill="#005EB8"/>
      </g>
      <g key={`wobble-${spinKey}`} style={wobbleStyle}>
        <path d="M48.0814 38C50.2572 34.4505 52.3615 29.7178 51.9475 23.0921C51.0899 9.36725 38.6589 -1.04463 26.9206 0.0837327C22.3253 0.525465 17.6068 4.2712 18.026 10.9805C18.2082 13.8961 19.6352 15.6169 21.9544 16.9399C24.1618 18.1992 26.9978 18.9969 30.2128 19.9011C34.0962 20.9934 38.6009 22.2203 42.063 24.7717C46.2125 27.8295 49.0491 31.3743 48.0814 38Z" fill="#003B5C"/>
        <path d="M3.91861 14C1.74276 17.5495 -0.361506 22.2822 0.0524931 28.9079C0.910072 42.6327 13.3411 53.0446 25.0794 51.9163C29.6747 51.4745 34.3932 47.7288 33.974 41.0195C33.7918 38.1039 32.3647 36.3831 30.0456 35.0601C27.8382 33.8008 25.0022 33.0031 21.7872 32.0989C17.9038 31.0066 13.3991 29.7797 9.93694 27.2283C5.78746 24.1704 2.95092 20.6257 3.91861 14Z" fill="#005EB8"/>
      </g>
    </svg>
  );
}

// ============================================================
// COLLAPSED RAIL (48px)
// ============================================================

function NavRail({ onExpand, spinKey, dark, navPopover, openNavPopover, closeNavPopover, setNavPopover, themeContext, appearanceSelection, setAppearanceSelection, onCreateSession, onBrowseSessions, onSearch }) {
  const t = dark ? DARK : LIGHT;


  return (
    <div
      onClick={onExpand}
      style={{
        width: 48,
        height: '100%',
        background: t.sidebarBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0 10px',
        cursor: 'pointer',
        transition: 'background 240ms ease',
      }}>
      {/* Top scrollable section */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <div style={{ marginBottom: 8, flexShrink: 0 }}>
          <OuiToolTip content="Hi, I'm Olly, your OpenSearch Observability assistant." position="right">
            <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <OSLogo size={22} spinKey={spinKey} />
            </span>
          </OuiToolTip>
        </div>
        <OuiToolTip content="Toggle sidebar" position="right">
          <span><RailButton icon="sidebar" t={t} onClick={(e) => { e.stopPropagation(); onExpand(); }} /></span>
        </OuiToolTip>
        <Divider width={24} color={t.divider} />
        <OuiToolTip content="New session" position="right">
          <span><RailButton icon="plus" t={t} onClick={(e) => { e.stopPropagation(); onCreateSession && onCreateSession(); }} /></span>
        </OuiToolTip>
        <OuiToolTip content="Search" position="right">
          <span><RailButton icon="search" t={t} onClick={(e) => { e.stopPropagation(); onSearch && onSearch(); }} /></span>
        </OuiToolTip>
        <OuiToolTip content="All sessions" position="right">
          <span><RailButton icon="chats2" t={t} onClick={(e) => { e.stopPropagation(); onBrowseSessions && onBrowseSessions(); }} /></span>
        </OuiToolTip>
      </div>

      {/* Bottom pinned section with popovers */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Divider width={24} color={t.divider} />

        {/* Workspace */}
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => openNavPopover('workspace-footer')}
          onMouseLeave={() => closeNavPopover()}>
          <OuiPopover
            button={
              <OuiButtonIcon
                iconType="wsSelector"
                aria-label="Workspace"
                color="subdued"
                display="empty"
                size="s"
              />
            }
            isOpen={navPopover === 'workspace-footer'}
            closePopover={() => setNavPopover(null)}
            anchorPosition="rightDown"
            panelPaddingSize="s"
            panelClassName="samplePagesLeftNav__popoverPanel">
            <div
              onMouseEnter={() => openNavPopover('workspace-footer')}
              onMouseLeave={() => closeNavPopover()}>
              <WorkspaceNavPanelContent
                onPageChange={() => setNavPopover(null)}
                onOpenPanel={() => setNavPopover(null)}
                onItemSelect={() => setNavPopover(null)}
                onPopoverNavigate={() => setNavPopover(null)}
              />
            </div>
          </OuiPopover>
        </div>

        {/* Developer tools */}
        <div onClick={(e) => e.stopPropagation()}>
          <OuiToolTip content="Developer tools" position="right">
            <OuiButtonIcon
              iconType="navDevtools"
              aria-label="Developer tools"
              color="subdued"
              display="empty"
              size="s"
              onClick={() => {}}
            />
          </OuiToolTip>
        </div>

        {/* Settings */}
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => openNavPopover('settings-footer')}
          onMouseLeave={() => closeNavPopover()}>
          <OuiPopover
            button={
              <OuiButtonIcon
                iconType="gear"
                aria-label="Settings"
                color="subdued"
                display="empty"
                size="s"
              />
            }
            isOpen={navPopover === 'settings-footer'}
            closePopover={() => setNavPopover(null)}
            anchorPosition="rightDown"
            panelPaddingSize="s"
            panelClassName="samplePagesLeftNav__popoverPanel">
            <div
              onMouseEnter={() => openNavPopover('settings-footer')}
              onMouseLeave={() => closeNavPopover()}>
              <SettingsPopoverContent
                themeContext={themeContext}
                appearanceSelection={appearanceSelection}
                onAppearanceChange={setAppearanceSelection}
                onPageChange={() => setNavPopover(null)}
              />
            </div>
          </OuiPopover>
        </div>

        <Divider width={24} color={t.divider} />

        {/* Profile / Avatar */}
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => openNavPopover('profile')}
          onMouseLeave={() => closeNavPopover()}>
          <OuiPopover
            button={<OuiAvatar name="JD" size="s" color="#2E4A8F" initialsLength={2} />}
            isOpen={navPopover === 'profile'}
            closePopover={() => setNavPopover(null)}
            anchorPosition="rightDown"
            panelPaddingSize="s"
            panelClassName="samplePagesLeftNav__popoverPanel">
            <div
              onMouseEnter={() => openNavPopover('profile')}
              onMouseLeave={() => closeNavPopover()}>
              <ProfilePopoverContent />
            </div>
          </OuiPopover>
        </div>
      </div>
    </div>
  );
}

function RailButton({ icon, t, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 32,
        height: 32,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 8,
        cursor: 'pointer',
        background: hovered ? t.hoverBg : 'transparent',
        color: t.idleIcon,
        border: 'none',
        padding: 0,
        transition: 'background 150ms ease',
      }}>
      <SideIcon name={icon} size={16} />
    </button>
  );
}

// ============================================================
// EXPANDED PANEL (240px)
// ============================================================

function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return 'Older';
}

function NavPanel({ onCollapse, spinKey, dark, navPopover, openNavPopover, closeNavPopover, setNavPopover, themeContext, appearanceSelection, setAppearanceSelection, onCreateSession, onBrowseSessions, onSearch, sessions, activeSessionId, onSelectSession }) {
  const t = dark ? DARK : LIGHT;
  const [scrolled, setScrolled] = React.useState(false);

  const recents = (sessions || []).map((s) => ({
    id: s.id,
    name: s.title || 'New Session',
    meta: [formatTime(s.createdAt), ...(s.tabs.length > 0 ? [`${s.tabs.length} tab${s.tabs.length > 1 ? 's' : ''}`] : [])],
    isActive: s.id === activeSessionId,
  }));

  return (
    <div style={{
      width: 240,
      height: '100%',
      background: t.sidebarBg,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'background 240ms ease',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <OSLogo size={20} spinKey={spinKey} />
          <span style={{ fontSize: 14, fontWeight: 500, color: t.textPrimary }}>OpenSearch</span>
        </div>
        <PanelButton icon="sidebar" t={t} onClick={onCollapse} />
      </div>

      {/* Sticky top actions */}
      <div style={{ padding: '2px 8px 4px', flexShrink: 0, borderBottom: scrolled ? `1px solid ${t.dividerPanel}` : '1px solid transparent', transition: 'border-color 150ms ease' }}>
        <PanelItem icon="plus" label="New session" t={t} onClick={onCreateSession} />
        <PanelItem icon="search" label="Search" t={t} onClick={onSearch} />
      </div>

      {/* Scrollable middle: All sessions, AI tools, Recent */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px', minHeight: 0 }} onScroll={(e) => setScrolled(e.target.scrollTop > 0)}>
        <div style={{ padding: '2px 0 4px' }}>
          <PanelItem icon="chats2" label="All sessions" t={t} onClick={onBrowseSessions} />
        </div>

        <div style={{ height: 1, background: t.dividerPanel, margin: '6px 0' }} />

        <div style={{ padding: '4px 0 0' }}>
          <div style={{
            fontSize: 10,
            fontWeight: 500,
            color: t.textSub,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '8px 8px 8px',
          }}>Recent</div>
          {recents.map((r) => (
            <RecentItem key={r.id} name={r.name} meta={r.meta} t={t} isActive={r.isActive} onClick={() => onSelectSession && onSelectSession(r.id)} />
          ))}
        </div>
      </div>

      {/* Bottom nav with popovers */}
      <div style={{ height: 1, background: t.dividerPanel, margin: '2px 8px', flexShrink: 0 }} />
      <div style={{ padding: '4px 8px', flexShrink: 0 }}>
        {/* Workspace */}
        <div
          onMouseEnter={() => openNavPopover('workspace-footer')}
          onMouseLeave={() => closeNavPopover()}>
          <OuiPopover
            button={
              <PanelItem icon="building" label="Workspace" t={t} />
            }
            isOpen={navPopover === 'workspace-footer'}
            closePopover={() => setNavPopover(null)}
            anchorPosition="rightDown"
            panelPaddingSize="s"
            panelClassName="samplePagesLeftNav__popoverPanel">
            <div
              onMouseEnter={() => openNavPopover('workspace-footer')}
              onMouseLeave={() => closeNavPopover()}>
              <WorkspaceNavPanelContent
                onPageChange={() => setNavPopover(null)}
                onOpenPanel={() => setNavPopover(null)}
                onItemSelect={() => setNavPopover(null)}
                onPopoverNavigate={() => setNavPopover(null)}
              />
            </div>
          </OuiPopover>
        </div>

        {/* Developer tools */}
        <PanelItem icon="code" label="Developer tools" t={t} />

        {/* Settings */}
        <div
          onMouseEnter={() => openNavPopover('settings-footer')}
          onMouseLeave={() => closeNavPopover()}>
          <OuiPopover
            button={
              <PanelItem icon="settings" label="Settings" t={t} />
            }
            isOpen={navPopover === 'settings-footer'}
            closePopover={() => setNavPopover(null)}
            anchorPosition="rightDown"
            panelPaddingSize="s"
            panelClassName="samplePagesLeftNav__popoverPanel">
            <div
              onMouseEnter={() => openNavPopover('settings-footer')}
              onMouseLeave={() => closeNavPopover()}>
              <SettingsPopoverContent
                themeContext={themeContext}
                appearanceSelection={appearanceSelection}
                onAppearanceChange={setAppearanceSelection}
                onPageChange={() => setNavPopover(null)}
              />
            </div>
          </OuiPopover>
        </div>
      </div>

      {/* Footer user with popover */}
      <div style={{ height: 1, background: t.dividerPanel, margin: '6px 8px', flexShrink: 0 }} />
      <div
        style={{ padding: '10px 12px', flexShrink: 0 }}
        onMouseEnter={() => openNavPopover('profile')}
        onMouseLeave={() => closeNavPopover()}>
        <OuiPopover
          button={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <OuiAvatar name="JD" size="s" color="#2E4A8F" initialsLength={2} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: t.textPrimary }}>John Doe</div>
              </div>
              <div style={{ color: t.textMuted }}>
                <OuiIcon type="arrowRight" size="s" />
              </div>
            </div>
          }
          isOpen={navPopover === 'profile'}
          closePopover={() => setNavPopover(null)}
          anchorPosition="rightDown"
          panelPaddingSize="s"
          panelClassName="samplePagesLeftNav__popoverPanel">
          <div
            onMouseEnter={() => openNavPopover('profile')}
            onMouseLeave={() => closeNavPopover()}>
            <ProfilePopoverContent />
          </div>
        </OuiPopover>
      </div>
    </div>
  );
}

function PanelButton({ icon, t, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28,
        height: 28,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 6,
        cursor: 'pointer',
        background: hovered ? t.hoverBg : 'transparent',
        color: t.textMuted,
        border: 'none',
        padding: 0,
        transition: 'background 150ms ease',
      }}>
      <SideIcon name={icon} size={15} />
    </button>
  );
}

function PanelItem({ icon, label, t, onClick }) {
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
        padding: '7px 8px',
        borderRadius: 8,
        cursor: 'pointer',
        background: hovered ? t.hoverBg : 'transparent',
        color: t.textPrimary,
        fontSize: 13,
        fontWeight: 400,
        transition: 'background 150ms ease',
      }}>
      <span style={{ color: t.textMuted, display: 'grid', placeItems: 'center' }}>
        <SideIcon name={icon} size={15} />
      </span>
      {label}
    </div>
  );
}

function PanelItemWithBadge({ icon, label, badge, t }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '7px 8px',
        borderRadius: 8,
        cursor: 'pointer',
        background: hovered ? t.hoverBg : 'transparent',
        color: t.textPrimary,
        fontSize: 13,
        fontWeight: 400,
        transition: 'background 150ms ease',
      }}>
      <span style={{ color: t.textMuted, display: 'grid', placeItems: 'center' }}>
        <SideIcon name={icon} size={15} />
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{
        fontSize: 10,
        fontWeight: 600,
        color: t.accent,
        background: t.hoverBg,
        borderRadius: 4,
        padding: '1px 5px',
        lineHeight: 1.4,
      }}>{badge}</span>
    </div>
  );
}

function RecentItem({ name, meta, t, isActive, onClick }) {
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
        padding: '7px 8px',
        borderRadius: 8,
        cursor: 'pointer',
        background: isActive ? t.hoverBg : hovered ? t.hoverBg : 'transparent',
        transition: 'background 150ms ease',
      }}>
      <span style={{ color: isActive ? t.accent : t.textMuted, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <SideIcon name="chat" size={15} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          color: isActive ? t.accent : t.textPrimary,
          fontWeight: isActive ? 500 : 400,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>{name}</div>
        <div style={{
          fontSize: 10,
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
              {i > 0 && <span style={{ width: 4, height: 4, borderRadius: '50%', background: t.recentMetaDot, flexShrink: 0 }} />}
              <span>{m}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DIVIDER
// ============================================================

function Divider({ width, color }) {
  return (
    <div style={{ width, height: 1, background: color, margin: '6px 0', flexShrink: 0 }} />
  );
}

// ============================================================
// ANIMATED SIDEBAR (wrapper)
// ============================================================

export const AnimatedSidebar = ({ collapsed, setCollapsed, onCreateSession, onBrowseSessions, onSearch, sessions, activeSessionId, onSelectSession }) => {
  const themeContext = useContext(ThemeContext);
  const dark = themeContext.theme === 'v9-dark';
  const t = dark ? DARK : LIGHT;

  const dur = '320ms';
  const ease = 'cubic-bezier(0.32, 0.72, 0, 1)';
  const [spinKey, setSpinKey] = React.useState(0);
  const firstRun = useRef(true);

  // Popover state (shared between rail and panel)
  const [navPopover, setNavPopover] = useState(null);
  const navPopoverTimer = useRef(null);
  const [appearanceSelection, setAppearanceSelection] = useState(
    dark ? 'v9-dark' : 'v9-light'
  );

  const openNavPopover = useCallback((key) => {
    if (navPopoverTimer.current) clearTimeout(navPopoverTimer.current);
    setNavPopover(key);
  }, []);

  const closeNavPopover = useCallback(() => {
    navPopoverTimer.current = setTimeout(() => setNavPopover(null), 150);
  }, []);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setSpinKey((k) => k + 1);
  }, [collapsed]);

  return (
    <>
      {/* Global keyframes — injected once */}
      <style>{`
        @keyframes osQuarterRotate {
          0%   { transform: rotate(0deg); }
          72%  { transform: rotate(382deg); }
          88%  { transform: rotate(355deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes osWobble {
          0%, 100% { transform: rotate(0deg); }
          35%      { transform: rotate(-14deg); }
          70%      { transform: rotate(6deg); }
        }
      `}</style>
      <div style={{
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: '100vh',
        width: collapsed ? 48 : 240,
        transition: `width ${dur} ${ease}, background 240ms ease, border-color 240ms ease`,
        overflow: 'hidden',
        flexShrink: 0,
        background: t.sidebarBg,
        borderRight: `1px solid ${t.borderRight}`,
        marginRight: 8,
        zIndex: 10,
      }}>
        {/* Panel (240px) — fades based on collapsed state */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          opacity: collapsed ? 0 : 1,
          transform: collapsed ? 'translateX(-6px)' : 'translateX(0)',
          transition: `opacity ${collapsed ? '160ms' : '220ms'} ${ease} ${collapsed ? '0ms' : '120ms'}, transform ${dur} ${ease}`,
          pointerEvents: collapsed ? 'none' : 'auto',
        }}>
          <NavPanel
            onCollapse={() => setCollapsed(true)}
            spinKey={spinKey}
            dark={dark}
            navPopover={collapsed ? null : navPopover}
            openNavPopover={openNavPopover}
            closeNavPopover={closeNavPopover}
            setNavPopover={setNavPopover}
            themeContext={themeContext}
            appearanceSelection={appearanceSelection}
            setAppearanceSelection={setAppearanceSelection}
            onCreateSession={onCreateSession}
            onBrowseSessions={onBrowseSessions}
            onSearch={onSearch}
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={onSelectSession}
          />
        </div>

        {/* Rail (48px) — fades based on collapsed state */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 48,
          opacity: collapsed ? 1 : 0,
          transition: `opacity ${collapsed ? '220ms' : '160ms'} ${ease} ${collapsed ? '120ms' : '0ms'}`,
          pointerEvents: collapsed ? 'auto' : 'none',
        }}>
          <NavRail
            onExpand={() => setCollapsed(false)}
            spinKey={spinKey}
            dark={dark}
            navPopover={collapsed ? navPopover : null}
            openNavPopover={openNavPopover}
            closeNavPopover={closeNavPopover}
            setNavPopover={setNavPopover}
            themeContext={themeContext}
            appearanceSelection={appearanceSelection}
            setAppearanceSelection={setAppearanceSelection}
            onCreateSession={onCreateSession}
            onBrowseSessions={onBrowseSessions}
            onSearch={onSearch}
          />
        </div>
      </div>
    </>
  );
};
