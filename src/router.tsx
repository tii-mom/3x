import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { OnboardingCapitalPage } from './pages/OnboardingCapitalPage';
import { MilestonePage } from './pages/MilestonePage';
import { MandatePage } from './pages/MandatePage';
import { WalletActivationPage } from './pages/WalletActivationPage';
import { FundingPage } from './pages/FundingPage';

import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { AIPage } from './pages/AIPage';
import { DecisionDetailPage } from './pages/DecisionDetailPage';
import { ActivityPage } from './pages/ActivityPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { GoalJourneyPage } from './pages/GoalJourneyPage';
import { MilestoneCompletePage } from './pages/MilestoneCompletePage';
import { ControlsPage } from './pages/ControlsPage';
import { SharePage } from './pages/SharePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/start',
    element: <OnboardingCapitalPage />,
  },
  {
    path: '/start/milestone',
    element: <MilestonePage />,
  },
  {
    path: '/start/mandate',
    element: <MandatePage />,
  },
  {
    path: '/wallet/activate',
    element: <WalletActivationPage />,
  },
  {
    path: '/wallet/fund',
    element: <FundingPage />,
  },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'ai',
        element: <AIPage />,
      },
      {
        path: 'decision/:id',
        element: <DecisionDetailPage />,
      },
      {
        path: 'activity',
        element: <ActivityPage />,
      },
      {
        path: 'portfolio',
        element: <PortfolioPage />,
      },
      {
        path: 'goal',
        element: <GoalJourneyPage />,
      },
      {
        path: 'milestone-complete',
        element: <MilestoneCompletePage />,
      },
      {
        path: 'controls',
        element: <ControlsPage />,
      },
      {
        path: 'share',
        element: <SharePage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/app" replace />,
  },
]);
