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

import React, { useState } from 'react';

import {
  OuiButtonIcon,
  OuiCompressedTextArea,
  OuiIcon,
} from '../../../../src/components';

const CIRCLES = [
  { icon: 'starEmpty', label: 'Favorites', badge: '7', badgeKind: 'default', active: true },
  { icon: 'navAlerting', label: 'Alerts', badge: '7', badgeKind: 'danger' },
  { icon: 'navDashboards', label: 'Dashboards' },
  { icon: 'navDiscover', label: 'Discover (log)', badge: '3', badgeKind: 'primary' },
  { icon: 'visArea', label: 'Discover (metric)', badge: '2', badgeKind: 'primary' },
  { icon: 'navServiceMap', label: 'Application Map' },
  { icon: 'apmTrace', label: 'Application Traces' },
  { icon: 'apps', label: 'Application Services' },
  { icon: 'grid', label: 'More' },
];

const FAVORITES = [
  { name: 'System overview', meta: 'Dashboard · 5 min ago', icon: 'visArea', kind: 'default' },
  { name: 'Error rate by service', meta: 'Saved log · source=logs | where level="ERROR"', icon: 'navDiscover', kind: 'default' },
  { name: 'CPU utilization', meta: 'Saved metric · stats avg(cpu) by host', icon: 'visArea', kind: 'default' },
  { name: 'Payment service P99 latency breach', meta: 'Alert · Critical · 15 min ago', icon: 'navAlerting', kind: 'alert' },
  { name: 'API performance', meta: 'Dashboard · Updated 30 min ago', icon: 'visArea', kind: 'default' },
  { name: 'Checkout funnel', meta: 'Dashboard · Updated 1 h ago', icon: 'visArea', kind: 'default' },
  { name: 'Memory pressure by host', meta: 'Saved metric · stats avg(mem) by host', icon: 'visArea', kind: 'default' },
];

export const HomePage = ({ onNavigate, onContinueAsThread }) => {
  const [query, setQuery] = useState('');

  const MOCK_RESPONSE =
    'I looked into this and found a few things worth noting.\n\n**Summary**\n\n- The service metrics show a gradual increase in P99 latency over the past 6 hours.\n- Error rates remain within acceptable thresholds but are trending upward.\n- No recent deployments correlate with the change.\n\nI recommend checking the downstream dependency health and reviewing recent config changes in the environment.';

  const handleSend = () => {
    if (!query.trim()) return;
    if (onContinueAsThread) {
      onContinueAsThread(query.trim(), MOCK_RESPONSE);
    }
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="homePage__v4">
      <div className="homePage__v4Content">
        {/* Headline */}
        <div className="homePage__v4Headline">
          <h1 className="homePage__v4Title">
            Welcome, John.
          </h1>
          <span className="homePage__v4Subtitle">
            What should we look into together?
          </span>
        </div>

        {/* Input */}
        <div className="homePage__v4InputWrap">
          <div className="homePage__v4InputField">
            <OuiCompressedTextArea
              placeholder="Ask anything. Type / for actions, @ to reference a service."
              fullWidth
              resize="none"
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="homePage__v4Textarea"
            />
            <div className="homePage__v4InputActions">
              <OuiButtonIcon
                iconType="plus"
                aria-label="Add attachment"
                size="s"
                color="text"
              />
              <OuiButtonIcon
                iconType="sortUp"
                aria-label="Send message"
                display="fill"
                size="s"
                isDisabled={!query.trim()}
                onClick={handleSend}
              />
            </div>
          </div>
        </div>

        {/* Circles row */}
        <div className="homePage__v4Circles">
          {CIRCLES.map((c) => (
            <div
              key={c.label}
              className={`homePage__v4CircleItem${c.active ? ' homePage__v4CircleItem--active' : ''}`}
              onClick={() => onNavigate && onNavigate('page', c.label.toLowerCase())}>
              <div className={`homePage__v4CircleIcon${c.active ? ' homePage__v4CircleIcon--active' : ''}`}>
                <OuiIcon type={c.icon} size="m" />
                {c.badge && (
                  <span className={`homePage__v4Badge homePage__v4Badge--${c.badgeKind}`}>
                    {c.badge}
                  </span>
                )}
              </div>
              <span className="homePage__v4CircleLabel">{c.label}</span>
            </div>
          ))}
        </div>

        {/* Favorites list */}
        <div className="homePage__v4Favorites">
          <div className="homePage__v4FavoritesHeader">
            <span className="homePage__v4FavoritesTitle">
              Favorites <span className="homePage__v4FavoritesCount">· {FAVORITES.length} items</span>
            </span>
            <button type="button" className="homePage__v4FilterButton">
              <OuiIcon type="filter" size="s" />
              <span>All types</span>
              <OuiIcon type="arrowDown" size="s" />
            </button>
          </div>

          <div className="homePage__v4FavoritesList">
            {FAVORITES.map((row) => (
              <button
                key={row.name}
                type="button"
                className="homePage__v4FavoritesItem"
                onClick={() => onNavigate && onNavigate('page', 'dashboards')}>
                <div className="homePage__v4FavoritesItemText">
                  <span className="homePage__v4FavoritesItemName">{row.name}</span>
                  <span className="homePage__v4FavoritesItemMeta">{row.meta}</span>
                </div>
                <div className={`homePage__v4FavoritesItemIcon homePage__v4FavoritesItemIcon--${row.kind}`}>
                  <OuiIcon type={row.icon} size="s" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
