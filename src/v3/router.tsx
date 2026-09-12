import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPageV3 } from './pages/LandingPageV3';
import { ClaimPageV3 } from './pages/ClaimPageV3';
import { ActivatePageV3 } from './pages/ActivatePageV3';
import { AppShellV3 } from './components/AppShellV3';
import { AIHomePageV3 } from './pages/AIHomePageV3';
import { SkillsPageV3 } from './pages/SkillsPageV3';
import { EnergyPageV3 } from './pages/EnergyPageV3';
import { MarketPageV3 } from './pages/MarketPageV3';
import { ActivityPageV3 } from './pages/ActivityPageV3';
import { TraceDetailPageV3 } from './pages/TraceDetailPageV3';
import { MePageV3 } from './pages/MePageV3';

export const routerV3 = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageV3 />,
  },
  {
    path: '/claim',
    element: <ClaimPageV3 />,
  },
  {
    path: '/activate',
    element: <ActivatePageV3 />,
  },
  {
    path: '/app',
    element: <AppShellV3 />,
    children: [
      {
        index: true,
        element: <AIHomePageV3 />,
      },
      {
        path: 'skills',
        element: <SkillsPageV3 />,
      },
      {
        path: 'energy',
        element: <EnergyPageV3 />,
      },
      {
        path: 'market',
        element: <MarketPageV3 />,
      },
      {
        path: 'activity',
        element: <ActivityPageV3 />,
      },
      {
        path: 'trace/:id',
        element: <TraceDetailPageV3 />,
      },
      {
        path: 'me',
        element: <MePageV3 />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/app" replace />,
  },
]);
