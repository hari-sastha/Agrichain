import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SimulationProvider } from './contexts/SimulationContext';
import { BlockchainProvider } from './contexts/BlockchainContext';
import { AlertProvider } from './contexts/AlertContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { ShipmentsPage } from './pages/ShipmentsPage';
import { ShipmentDetailPage } from './pages/ShipmentDetailPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { IoTDevicesPage } from './pages/IoTDevicesPage';
import { AlertsPage } from './pages/AlertsPage';
import { BlockchainPage } from './pages/BlockchainPage';
import { ChainOfCustodyPage } from './pages/ChainOfCustodyPage';
import { DigitalPassportPage } from './pages/DigitalPassportPage';
import { VerifyPassportPage } from './pages/VerifyPassportPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SimulationProvider>
        <BlockchainProvider>
          <AlertProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketing & Auth Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Public Standalone Digital Passport Page */}
                <Route path="/passport/:shipmentId" element={<DigitalPassportPage />} />

                {/* Authenticated Application Shell Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/shipments"
                  element={
                    <AppLayout>
                      <ShipmentsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/shipments/:id"
                  element={
                    <AppLayout>
                      <ShipmentDetailPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/monitoring"
                  element={
                    <AppLayout>
                      <LiveMonitoringPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/iot-devices"
                  element={
                    <AppLayout>
                      <IoTDevicesPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/alerts"
                  element={
                    <AppLayout>
                      <AlertsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/blockchain"
                  element={
                    <AppLayout>
                      <BlockchainPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/chain-of-custody/:shipmentId"
                  element={
                    <AppLayout>
                      <ChainOfCustodyPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/verify"
                  element={
                    <AppLayout>
                      <VerifyPassportPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <AppLayout>
                      <AnalyticsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <AppLayout>
                      <ReportsPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <AppLayout>
                      <UsersPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AppLayout>
                      <SettingsPage />
                    </AppLayout>
                  }
                />

                {/* Fallback Catch-all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </AlertProvider>
        </BlockchainProvider>
      </SimulationProvider>
    </AuthProvider>
  );
};

export default App;
