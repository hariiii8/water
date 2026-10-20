import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LanguageScreen } from './components/screens/LanguageScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { RegisterScreen } from './components/screens/RegisterScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ReportProblemScreen } from './components/screens/ReportProblemScreen';
import { MyComplaintsScreen } from './components/screens/MyComplaintsScreen';
import { MapScreen } from './components/screens/MapScreen';
import { MoreScreen } from './components/screens/MoreScreen';
import { OfficerDashboard } from './components/screens/OfficerDashboard';
import { OfficerFieldTasksScreen } from './components/screens/OfficerFieldTasksScreen';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { WaterSupplyModal } from './components/WaterSupplyModal';
import { WaterQualityModal } from './components/WaterQualityModal';
import { NotificationModal } from './components/NotificationModal';
import { MLStudioModal } from './components/MLStudioModal';

const AppContent: React.FC = () => {
  const {
    currentScreen,
    currentRole,
    activeTab,
    setActiveTab,
    setSelectedComplaint,
    setActiveModal,
    complaints,
    isReportingProblem,
    setIsReportingProblem,
    prefilledReportData,
    setPrefilledReportData
  } = useApp();

  const [preselectedCategory, setPreselectedCategory] = useState<any>(undefined);

  // If in Welcome/Language screen
  if (currentScreen === 'language') {
    return (
      <div className="h-screen sm:h-[100dvh] bg-slate-100 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        <div className="w-full max-w-3xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl overflow-y-auto shadow-xl flex flex-col bg-white border-0 sm:border sm:border-slate-200/90">
          <LanguageScreen />
        </div>
      </div>
    );
  }

  // If in Login screen
  if (currentScreen === 'login') {
    return (
      <div className="h-screen sm:h-[100dvh] bg-slate-100 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        <div className="w-full max-w-lg h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl overflow-y-auto shadow-xl flex flex-col bg-white border-0 sm:border sm:border-slate-200/90">
          <LoginScreen />
        </div>
      </div>
    );
  }

  // If in Register screen
  if (currentScreen === 'register') {
    return (
      <div className="h-screen sm:h-[100dvh] bg-slate-100 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        <div className="w-full max-w-xl h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl overflow-y-auto shadow-xl flex flex-col bg-white border-0 sm:border sm:border-slate-200/90">
          <RegisterScreen />
        </div>
      </div>
    );
  }

  // Main Dashboard Renderer
  const renderTabContent = () => {
    // If reporting a problem is triggered
    if (isReportingProblem) {
      return (
        <ReportProblemScreen
          initialCategory={prefilledReportData?.category || preselectedCategory}
          initialTitle={prefilledReportData?.title}
          initialDescription={prefilledReportData?.description}
          initialLocation={prefilledReportData?.location}
          initialWard={prefilledReportData?.ward}
          initialUrgency={prefilledReportData?.urgency}
          onCancel={() => {
            setIsReportingProblem(false);
            setPreselectedCategory(undefined);
            setPrefilledReportData(null);
          }}
          onSuccessView={(id) => {
            setIsReportingProblem(false);
            setPreselectedCategory(undefined);
            setPrefilledReportData(null);
            const found = complaints.find((c) => c.id === id);
            if (found) {
              setSelectedComplaint(found);
              setActiveModal('complaintDetail');
            }
            setActiveTab('complaints');
          }}
        />
      );
    }

    // Role-specific home tab
    if (activeTab === 'home') {
      if (currentRole === 'officer') {
        return <OfficerDashboard />;
      }
      return (
        <HomeScreen
          onReportClick={(cat?: any) => {
            setPreselectedCategory(cat);
            setIsReportingProblem(true);
          }}
        />
      );
    }

    if (activeTab === 'complaints') {
      if (currentRole === 'officer') {
        return <OfficerFieldTasksScreen />;
      }
      return (
        <MyComplaintsScreen
          onNewComplaint={() => {
            setPreselectedCategory(undefined);
            setIsReportingProblem(true);
          }}
        />
      );
    }

    if (activeTab === 'map') {
      return (
        <MapScreen
          onReportAtLocation={() => {
            setPreselectedCategory(undefined);
            setIsReportingProblem(true);
          }}
        />
      );
    }

    if (activeTab === 'more') {
      return <MoreScreen />;
    }

    return (
      <HomeScreen
        onReportClick={(cat?: any) => {
          setPreselectedCategory(cat);
          setIsReportingProblem(true);
        }}
      />
    );
  };

  return (
    <div className="h-screen sm:h-[100dvh] bg-slate-100 flex justify-center selection:bg-cyan-500 selection:text-white overflow-hidden">
      {/* Clean, locked application frame */}
      <div className="w-full max-w-md sm:max-w-3xl lg:max-w-4xl h-full flex flex-col bg-slate-50/70 shadow-lg relative sm:border-x sm:border-slate-200/80 overflow-hidden">
        {/* Global Header - Locked at Top */}
        <header className="shrink-0 z-30">
          <Header />
        </header>

        {/* Dynamic Main Page Content - Only this area scrolls! */}
        <main className="flex-1 px-3 py-3 sm:px-6 sm:py-5 pb-6 overflow-y-auto overscroll-contain">
          {renderTabContent()}
        </main>

        {/* Bottom Navigation - Statically locked at bottom, always visible without scrolling */}
        <footer className="shrink-0 z-40 bg-white">
          <BottomNav />
        </footer>

        {/* Universal Application Modals */}
        <ComplaintDetailModal />
        <WaterSupplyModal />
        <WaterQualityModal />
        <NotificationModal />
        <MLStudioModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
