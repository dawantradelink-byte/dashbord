import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KoiPondCanvas } from './components/KoiPondCanvas';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { MetricCards } from './components/MetricCards';
import { VisitorTrendsChart } from './components/VisitorTrendsChart';
import { VisitorProfileDonut } from './components/VisitorProfileDonut';
import { TopPagesList } from './components/TopPagesList';
import { LeadsTable } from './components/LeadsTable';
import { IELTSEvaluationModal } from './components/IELTSEvaluationModal';
import { AddLeadModal } from './components/AddLeadModal';
import { EditLeadModal } from './components/EditLeadModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { ZenTestTakerView } from './components/ZenTestTakerView';
import { MotionDock } from './components/MotionDock';
import { MotionSitesModal, MotionTheme } from './components/MotionSitesModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { WaterCursorEffect } from './components/WaterCursorEffect';
import { UpperTabsBar } from './components/UpperTabsBar';

// Views for Sidebar Tabs
import { LeadsView } from './components/views/LeadsView';
import { IELTSMockView } from './components/views/IELTSMockView';
import { ClientsView } from './components/views/ClientsView';
import { VisaApplicationsView } from './components/views/VisaApplicationsView';
import { WebsiteAnalyticsView } from './components/views/WebsiteAnalyticsView';
import { AIBlogInspectorView } from './components/views/AIBlogInspectorView';
import { BlogManagerView } from './components/views/BlogManagerView';
import { StaffManagementView } from './components/views/StaffManagementView';
import { PagesView } from './components/views/PagesView';
import { SettingsView } from './components/views/SettingsView';

import { INITIAL_LEADS } from './data/mockData';
import { storageService } from './services/storageService';
import { Lead, LeadStatus, IELTSScoreBreakdown, IELTSMockTestHistoryEntry } from './types';

export default function App() {
  const [adminMode, setAdminMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Persistent Leads state initialized from StorageService
  const [leads, setLeads] = useState<Lead[]>(() => storageService.getLeads(INITIAL_LEADS));
  
  // Motion Theme (Motionsites.ai inspiration)
  const [motionTheme, setMotionTheme] = useState<MotionTheme>('pond');
  const [isMotionModalOpen, setIsMotionModalOpen] = useState<boolean>(false);
  const [isPondControlsOpen, setIsPondControlsOpen] = useState<boolean>(false);

  // Modals state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Evaluation Handler
  const handleOpenEvaluation = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEvaluationOpen(true);
  };

  const handleSaveEvaluation = (leadId: string, breakdown: IELTSScoreBreakdown, newStatus?: LeadStatus) => {
    const statusToSet = newStatus || 'Evaluated';
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          status: statusToSet,
          updatedAt: new Date().toLocaleString(),
          ieltsData: {
            ...(l.ieltsData || {
              testType: 'Academic' as const,
              targetCountry: 'Canada',
              targetBand: 7.5
            }),
            scores: breakdown
          }
        };
      }
      return l;
    });

    setLeads(updated);
    storageService.saveLeads(updated);
    addToast(
      'Evaluation Saved Successfully',
      `Overall Band: ${breakdown.overall.toFixed(1)} (${breakdown.cefrLevel}) · Status: ${statusToSet}`,
      'success'
    );
  };

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status, updatedAt: new Date().toLocaleString() } : l));
    setLeads(updated);
    storageService.saveLeads(updated);
    addToast('Status Updated', `Record #${id} marked as "${status}"`, 'info');
  };

  const handleOpenEdit = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedLead: Lead) => {
    const updated = leads.map((l) => (l.id === updatedLead.id ? updatedLead : l));
    setLeads(updated);
    storageService.saveLeads(updated);
    addToast('Lead Updated', `${updatedLead.name}'s record has been updated.`);
  };

  const handleOpenDelete = (lead: Lead) => {
    setLeadToDelete(lead);
  };

  const handleConfirmDelete = () => {
    if (!leadToDelete) return;
    const updated = leads.filter((l) => l.id !== leadToDelete.id);
    setLeads(updated);
    storageService.saveLeads(updated);
    addToast('Lead Deleted', `Removed ${leadToDelete.name} from records.`, 'error');
    setLeadToDelete(null);
  };

  const handleAddLead = (newLead: Lead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
    storageService.saveLeads(updated);
    addToast('New Student Lead Created', `${newLead.name} (${newLead.type}) has been registered.`);
  };

  const handleAddTestEntry = (leadId: string, entry: IELTSMockTestHistoryEntry) => {
    const updated = storageService.addMockTestHistoryEntry(leadId, entry);
    setLeads(updated);
    addToast('Mock Attempt Recorded', `Recorded "${entry.testTitle}" (Overall Band ${entry.overall.toFixed(1)})`);
  };

  // Render workspace content based on activeTab
  const renderWorkspace = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* 1. Top 4 KPI Metric Cards with Sparklines (Approved Image 1 layout) */}
            <MetricCards language={language} />

            {/* 2. Middle Grid: Visitor Trends (6 cols) + Visitor Profile (3 cols) + Top Pages (3 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5">
              <div className="xl:col-span-6">
                <VisitorTrendsChart language={language} />
              </div>
              <div className="xl:col-span-3">
                <VisitorProfileDonut language={language} />
              </div>
              <div className="xl:col-span-3">
                <TopPagesList language={language} />
              </div>
            </div>

            {/* 3. Bottom Table: Latest Leads & IELTS Mock Test Evaluation Hub */}
            <LeadsTable
              leads={leads}
              onOpenEvaluation={handleOpenEvaluation}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onUpdateStatus={handleUpdateStatus}
              onDeleteLead={(id) => {
                const target = leads.find((l) => l.id === id);
                if (target) handleOpenDelete(target);
              }}
              language={language}
              searchQuery={searchQuery}
            />
          </motion.div>
        );

      case 'Leads & Inquiries':
        return (
          <LeadsView
            key="leads"
            leads={leads}
            onOpenEvaluation={handleOpenEvaluation}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenEditModal={handleOpenEdit}
            onOpenDeleteModal={handleOpenDelete}
            onUpdateStatus={handleUpdateStatus}
            language={language}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );

      case 'IELTS Mock Test':
        return (
          <IELTSMockView
            key="ielts"
            leads={leads}
            onOpenEvaluation={handleOpenEvaluation}
            onOpenZenTestMode={() => setAdminMode(false)}
            onUpdateStatus={handleUpdateStatus}
            onAddTestEntry={handleAddTestEntry}
            language={language}
          />
        );

      case 'Students / Clients':
        return <ClientsView key="clients" language={language} />;

      case 'Visa Applications':
        return <VisaApplicationsView key="visas" language={language} />;

      case 'Website Analytics':
        return <WebsiteAnalyticsView key="analytics" language={language} />;

      case 'AI Blog Inspector':
        return <AIBlogInspectorView key="aiblog" language={language} />;

      case 'Blog Manager':
        return <BlogManagerView key="blogmgr" language={language} />;

      case 'Staff Management':
        return <StaffManagementView key="staff" language={language} />;

      case 'Pages':
        return <PagesView key="pages" language={language} />;

      case 'Settings':
        return <SettingsView key="settings" language={language} onShowToast={addToast} />;

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#150206] text-white overflow-x-hidden selection:bg-rose-500/30 selection:text-white font-sans">
      
      {/* 1. Realistic Swimming Koi Pond Background Canvas with Mouse Ripples */}
      <KoiPondCanvas opacity={0.92} interactive={true} />

      {/* 2. Fluid Water Cursor & Touch Ripple Layer (Desktop, Tablet & Mobile) */}
      <WaterCursorEffect />

      {/* 3. Main Content Layer with Liquid Glassmorphism */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* If in Student Zen Test-Taker Mode */}
        {!adminMode ? (
          <ZenTestTakerView
            onTestSubmitted={(lead) => {
              handleAddLead(lead);
              addToast('Mock Test Submitted Successfully', `Registered under ${lead.name}. Ishak Dawan will evaluate your scores.`);
            }}
            onExitToAdmin={() => setAdminMode(true)}
            language={language}
          />
        ) : (
          /* Full Admin Dashboard (Image 1 100% replica with all 11 functional workspaces) */
          <div className="flex-1 flex flex-col">
            {/* Top Navigation Header */}
            <Header
              language={language}
              onToggleLanguage={setLanguage}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              adminMode={adminMode}
              onToggleAdminMode={() => setAdminMode(false)}
              onOpenMotionModal={() => setIsMotionModalOpen(true)}
              activeTheme={motionTheme}
            />

            {/* Interactive Upper Tabs Bar with Liquid Wave Cursor Animation */}
            <UpperTabsBar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              language={language}
            />

            {/* Body: Sidebar + Active Workspace */}
            <div className="flex-1 flex">
              {/* Sidebar with Navigation Tabs */}
              <Sidebar
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                language={language}
              />

              {/* Main Workspace Area */}
              <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full overflow-y-auto">
                
                {/* Active Tab Workspace with Motion Transition */}
                <AnimatePresence mode="wait">
                  {renderWorkspace()}
                </AnimatePresence>

                {/* Footer Subtext */}
                <footer className="pt-6 pb-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-rose-300/50">
                  <div>
                    Next Border Visa Consultancy © 2026. All rights reserved. Ishak Dawan Admin Console.
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <button
                      onClick={() => setAdminMode(false)}
                      className="hover:text-rose-200 transition-colors flex items-center gap-1 text-rose-300/80"
                    >
                      <span>Zen Student Test Mode</span>
                    </button>
                    <span>·</span>
                    <a
                      href="https://motionsites.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-rose-200 transition-colors flex items-center gap-1 font-mono text-rose-400"
                    >
                      <span>Motionsites.ai Inspired</span>
                    </a>
                    <span>·</span>
                    <span className="font-mono text-emerald-400">Pond Physics: Active 🎏</span>
                  </div>
                </footer>
              </main>
            </div>
          </div>
        )}

      </div>

      {/* Floating Motion & Pond Controller Dock (Inspired by motionsites.ai) */}
      {adminMode && (
        <MotionDock
          onToggleZenMode={() => setAdminMode(false)}
          language={language}
          activeTheme={motionTheme}
          onSelectTheme={(t) => setMotionTheme(t)}
          onOpenMotionModal={() => setIsMotionModalOpen(true)}
          onOpenPondStudio={() => setIsPondControlsOpen(true)}
        />
      )}

      {/* Floating Dedicated Koi Pond Studio Controls Panel (Fish Count, Ripples, Ambient Color) */}
      <KoiPondControlsPanel
        isOpen={isPondControlsOpen}
        onClose={() => setIsPondControlsOpen(false)}
        language={language}
      />

      {/* MotionSites.ai Templates & Physics Inspiration Modal */}
      <MotionSitesModal
        isOpen={isMotionModalOpen}
        onClose={() => setIsMotionModalOpen(false)}
        activeTheme={motionTheme}
        onSelectTheme={(t) => setMotionTheme(t)}
        language={language}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* IELTS Mock Test Evaluation & Direct WhatsApp/Email Dispatch Modal */}
      <IELTSEvaluationModal
        lead={selectedLead}
        isOpen={isEvaluationOpen}
        onClose={() => {
          setIsEvaluationOpen(false);
          setSelectedLead(null);
        }}
        onSaveEvaluation={handleSaveEvaluation}
        language={language}
      />

      {/* Add New Lead / Mock Test Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={handleAddLead}
        language={language}
      />

      {/* Edit Lead Modal */}
      <EditLeadModal
        lead={leadToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setLeadToEdit(null);
        }}
        onSave={handleSaveEdit}
        language={language}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!leadToDelete}
        title="Delete Candidate Record?"
        message="This action will permanently delete this lead and its associated evaluation records from the database."
        itemName={leadToDelete ? `${leadToDelete.name} (${leadToDelete.type})` : undefined}
        onConfirm={handleConfirmDelete}
        onCancel={() => setLeadToDelete(null)}
      />

    </div>
  );
}
