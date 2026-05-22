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

import React, { useState, useCallback } from 'react';
import { UiPolishEmptySession } from './ui_polish_empty_session';
import { AnimatedSidebar } from './ui_polish_sidebar';
import { SessionContainer } from './session_container';
import { SessionList } from './session_list';
import { UiPolishSearchPage } from './ui_polish_search_page';
import { SOURCE_PAGE_MOCK } from './session_models';
import {
  createSession,
  updateSession,
  setActiveSession,
  openCanvasPage,
} from './session_state_manager';
import { LATENCY_SPIKE_SESSION, ERROR_RATE_SPIKE_SESSION } from './session_mock_data';

/**
 * Initialize session state for the UI Polish page.
 */
function initializeSessionState() {
  const now = Date.now();
  const MINUTE = 60000;
  const HOUR = 3600000;
  const DAY = 86400000;

  const mockSessions = [
    { title: 'CPU Spike Analysis', createdAt: now - 25 * MINUTE, tabs: ['metrics'] },
    { title: 'Dashboard Layout Review', createdAt: now - 2 * HOUR, tabs: ['dashboards'] },
    { title: 'Log Pattern Clustering', createdAt: now - 4 * HOUR, tabs: ['logs', 'discover'] },
    { title: 'Alert Rule Tuning', createdAt: now - 6 * HOUR, tabs: ['alerts'] },
    { title: 'Trace Waterfall Debug', createdAt: now - 12 * HOUR, tabs: ['traces', 'app-map'] },
    { title: 'Memory Leak Investigation', createdAt: now - 1 * DAY, tabs: ['metrics', 'logs'] },
    { title: 'Service Dependency Mapping', createdAt: now - 2 * DAY, tabs: ['app-services', 'app-map'] },
    { title: 'Error Rate Correlation', createdAt: now - 3 * DAY, tabs: ['logs', 'alerts', 'dashboards'] },
    { title: 'Deployment Impact Review', createdAt: now - 4 * DAY, tabs: ['metrics'] },
    { title: 'Capacity Planning', createdAt: now - 5 * DAY, tabs: ['dashboards', 'metrics'] },
  ].map((s, i) => ({
    id: `session-mock-${i}-${Math.random().toString(36).slice(2, 9)}`,
    threadKey: i < 3 ? `thread-${i}` : null,
    pendingThread: null,
    title: s.title,
    threadPanelState: 'minimized',
    threadPanelWidth: 30,
    tabs: s.tabs.map((pageKey, ti) => ({ id: `tab-${i}-${ti}`, pageKey, title: pageKey })),
    activeTabId: s.tabs.length > 0 ? `tab-${i}-0` : null,
    createdAt: s.createdAt,
  }));

  return {
    sessions: [LATENCY_SPIKE_SESSION, ERROR_RATE_SPIKE_SESSION, ...mockSessions],
    activeSessionId: null,
    version: 1,
  };
}

/**
 * UiPolishPage — Standalone polished home page.
 * Self-contained session-based navigation with the polished empty session page.
 */
export const UiPolishPage = () => {
  const [sessionState, setSessionState] = useState(initializeSessionState);
  const [activeView, setActiveView] = useState('session');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSession = sessionState.sessions.find(
    (s) => s.id === sessionState.activeSessionId
  );

  const isEmptySession =
    activeSession &&
    !activeSession.threadKey &&
    !activeSession.pendingThread &&
    activeSession.tabs.length === 0;

  // Handlers
  const handleCreateSession = useCallback(() => {
    setSessionState((prev) => ({
      ...prev,
      activeSessionId: null,
    }));
    setActiveView('session');
  }, []);

  const handleBrowseSessions = useCallback(() => {
    setActiveView('session-list');
  }, []);

  const handleSearch = useCallback(() => {
    setActiveView('library');
  }, []);

  const handleSelectSession = useCallback((sessionId) => {
    setSessionState((prev) => setActiveSession(prev, sessionId));
    setActiveView('session');
  }, []);

  const handleUpdateSession = useCallback((updates) => {
    setSessionState((prev) => {
      if (!prev.activeSessionId) return prev;
      return updateSession(prev, prev.activeSessionId, updates);
    });
  }, []);

  const handleOpenCanvasPage = useCallback((pageKey, title) => {
    setSessionState((prev) => {
      if (!prev.activeSessionId) return prev;
      const pageEntry = SOURCE_PAGE_MOCK[pageKey];
      const displayTitle = title || (pageEntry ? pageEntry.title : pageKey);
      return openCanvasPage(prev, prev.activeSessionId, pageKey, displayTitle);
    });
  }, []);

  const handleStartThread = useCallback((prompt) => {
    setActiveView('session');
    setSessionState((prev) => {
      const threadKey = `thread-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const pendingThread = {
        key: threadKey,
        messages: prompt ? [{ role: 'user', author: 'You', content: prompt }] : [],
        sourcePageTitle: null,
      };
      const sessionTitle = prompt ? prompt.slice(0, 40) : 'New Thread';

      if (!prev.activeSessionId) {
        const newSession = {
          id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          threadKey,
          pendingThread,
          title: sessionTitle,
          threadPanelState: 'full-screen',
          threadPanelWidth: 30,
          tabs: [],
          activeTabId: null,
          createdAt: Date.now(),
        };
        return {
          ...prev,
          sessions: [newSession, ...prev.sessions],
          activeSessionId: newSession.id,
        };
      }

      return updateSession(prev, prev.activeSessionId, {
        threadKey,
        pendingThread,
        threadPanelState: 'full-screen',
        title: sessionTitle,
      });
    });
  }, []);

  const handleOpenPage = useCallback(
    (pageKey) => {
      const pageEntry = SOURCE_PAGE_MOCK[pageKey];
      const title = pageEntry ? pageEntry.title : pageKey;
      handleOpenCanvasPage(pageKey, title);
    },
    [handleOpenCanvasPage]
  );

  // Render
  const renderMainContent = () => {
    if (activeView === 'session-list') {
      const existingSessions = sessionState.sessions.filter(
        (s) => s.threadKey || s.pendingThread || s.tabs.length > 0
      );
      return (
        <SessionList
          sessions={existingSessions}
          activeSessionId={sessionState.activeSessionId}
          onSelectSession={handleSelectSession}
          onCreateSession={handleCreateSession}
        />
      );
    }

    if (activeView === 'library') {
      return (
        <UiPolishSearchPage
          initialQuery={searchQuery}
          onSelectPage={(pageKey, title) => {
            setSessionState((prev) => {
              const next = createSession(prev);
              const newSessionId = next.activeSessionId;
              const tab = {
                id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                pageKey,
                title,
              };
              return updateSession(next, newSessionId, {
                tabs: [tab],
                activeTabId: tab.id,
                threadPanelState: 'minimized',
                title,
              });
            });
            setActiveView('session');
          }}
        />
      );
    }

    if (!activeSession || isEmptySession) {
      return (
        <UiPolishEmptySession
          onStartThread={handleStartThread}
          onOpenPage={handleOpenPage}
          onViewSession={() => handleSelectSession('latency-spike-session')}
          onStartInvestigation={() => {}}
          sessions={sessionState.sessions.filter(
            (s) => s.threadKey || s.pendingThread || s.tabs.length > 0
          )}
          onSelectSession={handleSelectSession}
          recentItems={[]}
          favoriteItems={[]}
          systemAlert={null}
        />
      );
    }

    return (
      <SessionContainer
        session={activeSession}
        onUpdateSession={handleUpdateSession}
        onOpenCanvasPage={handleOpenCanvasPage}
      />
    );
  };

  return (
    <div style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <AnimatedSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onCreateSession={handleCreateSession}
        onBrowseSessions={handleBrowseSessions}
        onSearch={handleSearch}
        sessions={sessionState.sessions}
        activeSessionId={sessionState.activeSessionId}
        onSelectSession={handleSelectSession}
      />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {renderMainContent()}
      </div>
    </div>
  );
};
