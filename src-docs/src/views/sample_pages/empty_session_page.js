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

import React, { useState, useMemo, useEffect, useRef } from 'react';

import {
  OuiButtonIcon,
  OuiIcon,
  OuiPopover,
} from '../../../../src/components';

import { SOURCE_PAGE_MOCK } from './session_models';
import { OllyMascot } from './olly_mascot';

const CIRCLES = [
  { icon: 'starEmpty', label: 'Favorites', badgeKind: 'default', filter: 'all', badgeFromTotal: true },
  { icon: 'navAlerting', label: 'Alerts', badgeKind: 'danger', filter: 'alert', badgeFromType: 'alert' },
  { icon: 'navDashboards', label: 'Dashboards', filter: 'dashboard', badgeFromType: 'dashboard' },
  { icon: 'navDiscover', label: 'Discover (log)', badgeKind: 'primary', filter: 'log', badgeFromType: 'log' },
  { icon: 'visArea', label: 'Discover (metric)', badgeKind: 'primary', filter: 'metric', badgeFromType: 'metric' },
  { icon: 'navServiceMap', label: 'Application Map', page: 'app-map' },
  { icon: 'apmTrace', label: 'Application Traces', page: 'app-traces' },
  { icon: 'apps', label: 'Application Services', page: 'app-services' },
  { icon: 'grid', label: 'More' },
];

const FILTER_OPTIONS = [
  { key: 'all', label: 'All types', icon: 'filter' },
  { key: 'dashboard', label: 'Dashboards', icon: 'navDashboards' },
  { key: 'log', label: 'Saved logs', icon: 'navDiscover' },
  { key: 'metric', label: 'Saved metrics', icon: 'visArea' },
  { key: 'alert', label: 'Alerts', icon: 'navAlerting' },
];

const FAVORITES = [
  { name: 'System overview', meta: 'Dashboard · 5 min ago', icon: 'navDashboards', kind: 'default', type: 'dashboard' },
  { name: 'Error rate by service', meta: 'Saved log · source=logs | where level="ERROR"', icon: 'navDiscover', kind: 'default', type: 'log' },
  { name: 'CPU utilization', meta: 'Saved metric · stats avg(cpu) by host', icon: 'visArea', kind: 'default', type: 'metric' },
  { name: 'Payment service P99 latency breach', meta: 'Alert · Critical · 15 min ago', icon: 'navAlerting', kind: 'alert', type: 'alert' },
  { name: 'API performance', meta: 'Dashboard · Updated 30 min ago', icon: 'navDashboards', kind: 'default', type: 'dashboard' },
  { name: 'Checkout funnel', meta: 'Dashboard · Updated 1 h ago', icon: 'navDashboards', kind: 'default', type: 'dashboard' },
  { name: 'Memory pressure by host', meta: 'Saved metric · stats avg(mem) by host', icon: 'visArea', kind: 'default', type: 'metric' },
  { name: 'Node disk usage exceeded 90%', meta: 'Alert · Warning · 45 min ago', icon: 'navAlerting', kind: 'alert', type: 'alert' },
  { name: 'Error rate spike detected', meta: 'Alert · Critical · 1 h ago', icon: 'navAlerting', kind: 'alert', type: 'alert' },
  { name: 'Connection pool exhaustion', meta: 'Alert · Critical · 2 h ago', icon: 'navAlerting', kind: 'alert', type: 'alert' },
  { name: 'Response time degradation', meta: 'Alert · Warning · 3 h ago', icon: 'navAlerting', kind: 'alert', type: 'alert' },
  { name: 'Upstream dependency timeout', meta: 'Alert · Critical · 4 h ago', icon: 'navAlerting', kind: 'alert', type: 'alert' },
  { name: 'Certificate expiry approaching', meta: 'Alert · Warning · 6 h ago', icon: 'navAlerting', kind: 'alert', type: 'alert' },
];

/**
 * EmptySessionPage — The welcome experience shown when a session has no thread and no pages open.
 * Matches the v4 design: headline, input, circles row, favorites list.
 */
export const EmptySessionPage = ({
  onStartThread,
  onOpenPage,
}) => {
  const [query, setQuery] = useState('');
  const [activeCircle, setActiveCircle] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      const textarea = el.querySelector('textarea');
      if (textarea) textarea.focus();
    }
  }, []);

  const activeFilterOption = FILTER_OPTIONS.find((f) => f.key === activeFilter);

  const filteredFavorites = useMemo(() => {
    if (activeFilter === 'all') return FAVORITES;
    return FAVORITES.filter((f) => f.type === activeFilter);
  }, [activeFilter]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(10);
  }, [activeFilter]);

  const visibleItems = filteredFavorites.slice(0, visibleCount);
  const hasMore = visibleCount < filteredFavorites.length;

  // Lazy load on scroll
  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40 && hasMore) {
      setVisibleCount((prev) => prev + 10);
    }
  };

  // Compute badge counts
  const getBadge = (c) => {
    if (c.badgeFromTotal) return String(FAVORITES.length);
    if (c.badgeFromType) return String(FAVORITES.filter((f) => f.type === c.badgeFromType).length);
    return null;
  };

  const handleSend = () => {
    if (!query.trim()) return;
    if (onStartThread) {
      onStartThread(query.trim());
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
    <div className="emptySessionPage">
      <div className="emptySessionPage__panel">
        <div className="emptySessionPage__v4Content">
          {/* Headline */}
          <div className="emptySessionPage__v4Headline">
            <OllyMascot size={48} />
            <h1 className="emptySessionPage__v4Title">
              Welcome back, John.
            </h1>
            <span className="emptySessionPage__v4Subtitle">
              Your OpenSearch Observability assistant is ready.
            </span>
          </div>

          {/* Input */}
          <div className="emptySessionPage__v4InputWrap">
            <div className="emptySessionPage__v4InputField" ref={textareaRef}>
              <textarea
                placeholder="Ask anything. Type / for actions, @ to reference a service."
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="emptySessionPage__v4Textarea"
              />
              <div className="emptySessionPage__v4InputActions">
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
          <div className="emptySessionPage__v4Circles">
            {CIRCLES.map((c) => {
              if (c.label === 'More') {
                return (
                  <OuiPopover
                    key={c.label}
                    button={
                      <div
                        className="emptySessionPage__v4CircleItem"
                        onClick={() => setMoreOpen(!moreOpen)}>
                        <div className="emptySessionPage__v4CircleIcon">
                          <OuiIcon type={c.icon} size="m" />
                        </div>
                        <span className="emptySessionPage__v4CircleLabel">{c.label}</span>
                      </div>
                    }
                    isOpen={moreOpen}
                    closePopover={() => setMoreOpen(false)}
                    anchorPosition="downCenter"
                    panelPaddingSize="none"
                    panelClassName="emptySessionPage__v4MorePanel">
                    <div className="emptySessionPage__v4MoreGrid">
                      {Object.entries(SOURCE_PAGE_MOCK)
                        .filter(([key]) => !['alerts', 'dashboards', 'discover-log', 'discover-metric', 'app-map', 'app-traces', 'app-services'].includes(key))
                        .map(([pageKey, { title }]) => {
                          const iconMap = {
                            logs: 'navDiscover',
                            'alerts-detail': 'navAlerting',
                            notebooks: 'notebookApp',
                            metrics: 'visArea',
                            discover: 'discoverApp',
                            traces: 'apmTrace',
                          };
                          return (
                            <button
                              key={pageKey}
                              type="button"
                              className="emptySessionPage__v4MoreItem"
                              onClick={() => {
                                onOpenPage && onOpenPage(pageKey);
                                setMoreOpen(false);
                              }}>
                              <OuiIcon type={iconMap[pageKey] || 'document'} size="m" />
                              <span>{title}</span>
                            </button>
                          );
                        })}
                    </div>
                  </OuiPopover>
                );
              }
              const isActive = c.filter ? activeCircle === c.filter : false;
              const handleClick = () => {
                if (c.filter) {
                  setActiveCircle(c.filter);
                  setActiveFilter(c.filter);
                } else if (c.page) {
                  onOpenPage && onOpenPage(c.page);
                }
              };
              const badge = getBadge(c);
              return (
                <div
                  key={c.label}
                  className={`emptySessionPage__v4CircleItem${isActive ? ' emptySessionPage__v4CircleItem--active' : ''}`}
                  onClick={handleClick}>
                  <div className={`emptySessionPage__v4CircleIcon${isActive ? ' emptySessionPage__v4CircleIcon--active' : ''}`}>
                    <OuiIcon type={c.icon} size="m" />
                    {badge && (
                      <span className={`emptySessionPage__v4Badge emptySessionPage__v4Badge--${c.badgeKind || 'default'}`}>
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="emptySessionPage__v4CircleLabel">{c.label}</span>
                </div>
              );
            })}
          </div>

          {/* Favorites section */}
          <div className="emptySessionPage__v4Favorites">
            <div className="emptySessionPage__v4FavoritesHeader">
              <span className="emptySessionPage__v4FavoritesTitle">
                {activeCircle === 'all' ? 'Favorites' : CIRCLES.find((c) => c.filter === activeCircle)?.label || 'Favorites'}
                <span className="emptySessionPage__v4FavoritesCount">
                  &nbsp;· {filteredFavorites.length} item{filteredFavorites.length !== 1 ? 's' : ''}
                </span>
              </span>
              <div className="emptySessionPage__v4FavoritesActions">
                {activeCircle !== 'all' && (
                  <button
                    type="button"
                    className="emptySessionPage__v4FilterButton"
                    onClick={() => onOpenPage && onOpenPage(activeCircle === 'dashboard' ? 'dashboards' : activeCircle === 'log' ? 'discover-log' : activeCircle === 'metric' ? 'discover-metric' : 'alerts')}>
                    <OuiIcon type="plus" size="s" />
                    <span>Add new</span>
                  </button>
                )}
                {activeCircle === 'all' && (
                <OuiPopover
                  button={
                    <button
                      type="button"
                      className="emptySessionPage__v4FilterButton"
                      onClick={() => setFilterOpen(!filterOpen)}>
                      <OuiIcon type={activeFilterOption.icon} size="s" />
                      <span>{activeFilterOption.label}</span>
                      <OuiIcon type="arrowDown" size="s" />
                    </button>
                  }
                  isOpen={filterOpen}
                closePopover={() => setFilterOpen(false)}
                anchorPosition="downRight"
                panelPaddingSize="none">
                <div className="emptySessionPage__v4FilterDropdown">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`emptySessionPage__v4FilterDropdownItem${activeFilter === opt.key ? ' emptySessionPage__v4FilterDropdownItem--active' : ''}`}
                      onClick={() => {
                        setActiveFilter(opt.key);
                        setFilterOpen(false);
                      }}>
                      <OuiIcon type={opt.icon} size="s" />
                      <span>{opt.label}</span>
                      {activeFilter === opt.key && (
                        <OuiIcon type="check" size="s" className="emptySessionPage__v4FilterCheck" />
                      )}
                    </button>
                  ))}
                </div>
              </OuiPopover>
                )}
              </div>
            </div>

            <div className="emptySessionPage__v4FavoritesList" ref={listRef} onScroll={handleScroll}>
              {filteredFavorites.length === 0 ? (
                <div className="emptySessionPage__v4FavoritesEmpty">
                  No items match this filter
                </div>
              ) : (
                <>
                  {visibleItems.map((row) => (
                    <button
                      key={row.name}
                      type="button"
                      className="emptySessionPage__v4FavoritesItem"
                      onClick={() => onOpenPage && onOpenPage('dashboards')}>
                      <div className="emptySessionPage__v4FavoritesItemText">
                        <span className="emptySessionPage__v4FavoritesItemName">{row.name}</span>
                        <span className="emptySessionPage__v4FavoritesItemMeta">{row.meta}</span>
                      </div>
                      <div className={`emptySessionPage__v4FavoritesItemIcon emptySessionPage__v4FavoritesItemIcon--${row.kind}`}>
                        <OuiIcon type={row.icon} size="s" />
                      </div>
                    </button>
                  ))}
                  {hasMore && (
                    <div className="emptySessionPage__v4FavoritesLoading">
                      Loading more...
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
