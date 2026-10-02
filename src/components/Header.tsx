import React from 'react';
import {
  Cloud,
  CloudOff,
  Eye,
  FileSpreadsheet,
  Lock,
  Plus,
  RefreshCw,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { AppViewMode, GoogleSheetConfig } from '../types';

interface HeaderProps {
  activeTab: 'sales' | 'cashflow' | 'catalog' | 'settings';
  setActiveTab: (tab: 'sales' | 'cashflow' | 'catalog' | 'settings') => void;
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  sheetConfig: GoogleSheetConfig;
  onOpenSheetModal: () => void;
  onOpenNewSaleModal: () => void;
  onOpenNewCashflowModal: () => void;
  isSyncing: boolean;
  onSyncNow: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  sheetConfig,
  onOpenSheetModal,
  onOpenNewSaleModal,
  onOpenNewCashflowModal,
  isSyncing,
  onSyncNow,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element Brand Wordmark with subtle symbol */}
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/jeju_salt_symbol_1790835311628.jpg"
              alt="제주소금도매상사 로고"
              className="w-9 h-9 rounded object-cover border border-slate-700 bg-white"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <button
              onClick={() => setActiveTab('sales')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                  제주소금도매상사
                </span>
                {viewMode === 'sales_public' && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    <Users className="w-3 h-3 text-emerald-400" />
                    <span>영업·공유 모드 (수입지출 숨김)</span>
                  </span>
                )}
                {viewMode === 'accounting_internal' && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>대표·내부회계 모드</span>
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links based on ViewMode */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'sales'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              판매·출고 실적
            </button>

            {/* 수입지출 장부는 영업/공유 모드에서는 완벽히 숨김! */}
            {viewMode !== 'sales_public' && (
              <button
                onClick={() => setActiveTab('cashflow')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'cashflow'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                수입·지출 장부
              </button>
            )}

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              도매 품목·단가표
            </button>

            {viewMode !== 'sales_public' && (
              <button
                onClick={onOpenSheetModal}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  sheetConfig.webAppUrl
                    ? 'text-emerald-300 hover:bg-slate-800'
                    : 'text-amber-300 hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                구글 시트 연동
              </button>
            )}
          </nav>

          {/* Zone 3: Mode Switcher & Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Switcher */}
            <div className="hidden lg:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => {
                  setViewMode('all');
                }}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  viewMode === 'all'
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="모든 메뉴와 기능을 한눈에 봅니다"
              >
                통합 모드
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('sales_public');
                  setActiveTab('sales');
                }}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                  viewMode === 'sales_public'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
                title="다른 사람에게 보여줄 때 수입·지출 내역과 원가를 숨깁니다"
              >
                <Users className="w-3 h-3" />
                <span>영업·공유용</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('accounting_internal');
                  setActiveTab('cashflow');
                }}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                  viewMode === 'accounting_internal'
                    ? 'bg-amber-700 text-white font-bold'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
                title="대표자 전용 수입/지출 회계 장부 모드"
              >
                <Lock className="w-3 h-3" />
                <span>내부 회계</span>
              </button>
            </div>

            {/* Real-time Sync state indicator */}
            {viewMode !== 'sales_public' && (
              <button
                onClick={onSyncNow}
                disabled={isSyncing}
                title={
                  sheetConfig.webAppUrl
                    ? `구글 시트 실시간 연동 중 (${sheetConfig.lastSyncedAt ? '최근: ' + sheetConfig.lastSyncedAt : '대기'})`
                    : '구글 시트 미연동 (클릭하여 시트 연동)'
                }
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  sheetConfig.webAppUrl
                    ? 'bg-slate-800 border-emerald-500/50 text-emerald-300 hover:bg-slate-700'
                    : 'bg-slate-800 border-amber-500/40 text-amber-300 hover:bg-slate-700'
                }`}
              >
                {isSyncing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                ) : sheetConfig.webAppUrl ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                ) : (
                  <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="whitespace-nowrap">
                  {isSyncing
                    ? '동기화 중...'
                    : sheetConfig.webAppUrl
                    ? `실시간 연동 (${sheetConfig.lastSyncedAt || '대기'})`
                    : '시트 미연결'}
                </span>
              </button>
            )}

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5">
              {viewMode !== 'sales_public' && (
                <button
                  onClick={onOpenNewCashflowModal}
                  className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
                >
                  + 지출/수입 등록
                </button>
              )}
              <button
                onClick={onOpenNewSaleModal}
                className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md shadow-sm transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>새 판매 등록</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('sales')}
            className={`py-1 px-2 ${activeTab === 'sales' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
          >
            판매·출고
          </button>
          {viewMode !== 'sales_public' && (
            <button
              onClick={() => setActiveTab('cashflow')}
              className={`py-1 px-2 ${activeTab === 'cashflow' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
            >
              수입·지출
            </button>
          )}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-1 px-2 ${activeTab === 'catalog' ? 'text-sky-400 font-semibold' : 'text-slate-400'}`}
          >
            도매단가표
          </button>
          {viewMode !== 'sales_public' && (
            <button
              onClick={onOpenSheetModal}
              className={`py-1 px-2 flex items-center gap-1 ${sheetConfig.webAppUrl ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              시트연동
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
