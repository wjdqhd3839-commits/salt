import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Info,
  Package,
  Plus,
  RefreshCw,
  Users,
} from 'lucide-react';
import { CashflowTable } from './components/CashflowTable';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { Header } from './components/Header';
import { InvoiceModal } from './components/InvoiceModal';
import { NewCashflowModal } from './components/NewCashflowModal';
import { NewSaleModal } from './components/NewSaleModal';
import { PriceCatalog } from './components/PriceCatalog';
import { SalesTable } from './components/SalesTable';
import { StatsCards } from './components/StatsCards';
import {
  COMPANY_INFO,
  INITIAL_CASHFLOW,
  INITIAL_PRODUCTS,
  INITIAL_SALES,
} from './data/mockData';
import {
  fetchGoogleSheetData,
  getStoredCashflow,
  getStoredConfig,
  getStoredSales,
  postToGoogleSheet,
  saveStoredCashflow,
  saveStoredConfig,
  saveStoredSales,
} from './services/googleSheets';
import {
  AppViewMode,
  CashflowRecord,
  GoogleSheetConfig,
  ProductItem,
  SaleRecord,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'sales' | 'cashflow' | 'catalog' | 'settings'>('sales');
  const [viewMode, setViewMode] = useState<AppViewMode>('all');

  // Core Data State
  const [sales, setSales] = useState<SaleRecord[]>(() => getStoredSales(INITIAL_SALES));
  const [cashflow, setCashflow] = useState<CashflowRecord[]>(() => getStoredCashflow(INITIAL_CASHFLOW));
  const [products] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(() => getStoredConfig());

  // UI / Modal States
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [isNewCashflowModalOpen, setIsNewCashflowModalOpen] = useState(false);
  const [selectedInvoiceSale, setSelectedInvoiceSale] = useState<SaleRecord | null>(null);
  const [preselectedProduct, setPreselectedProduct] = useState<ProductItem | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto-hide feedback after 5s
  useEffect(() => {
    if (syncFeedback) {
      const timer = setTimeout(() => setSyncFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [syncFeedback]);

  // Real-time Auto-Sync Interval & Tab Visibility listener
  useEffect(() => {
    if (!sheetConfig.webAppUrl || !sheetConfig.autoSync) return;

    const intervalMs = (sheetConfig.autoSyncInterval || 15) * 1000;

    const performSilentSync = async () => {
      if (isSyncing) return;
      try {
        const res = await fetchGoogleSheetData(sheetConfig.webAppUrl);
        if (!res.error) {
          if (res.sales && res.sales.length > 0) {
            setSales(res.sales);
            saveStoredSales(res.sales);
          }
          if (res.cashflow && res.cashflow.length > 0) {
            setCashflow(res.cashflow);
            saveStoredCashflow(res.cashflow);
          }
          const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setSheetConfig((prev) => {
            const updated = {
              ...prev,
              lastSyncedAt: now,
              isConnected: true,
              sheetTitle: res.sheetTitle || prev.sheetTitle,
            };
            saveStoredConfig(updated);
            return updated;
          });
        }
      } catch (e) {
        console.warn('Background auto-sync skipped', e);
      }
    };

    // Run interval
    const intervalId = setInterval(performSilentSync, intervalMs);

    // Run when user returns to window/tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performSilentSync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sheetConfig.webAppUrl, sheetConfig.autoSync, sheetConfig.autoSyncInterval, isSyncing]);

  // Persist sales changes
  const updateSales = (newSales: SaleRecord[]) => {
    setSales(newSales);
    saveStoredSales(newSales);
  };

  // Persist cashflow changes
  const updateCashflow = (newCashflow: CashflowRecord[]) => {
    setCashflow(newCashflow);
    saveStoredCashflow(newCashflow);
  };

  // Persist config changes
  const handleSaveConfig = (newConfig: GoogleSheetConfig) => {
    setSheetConfig(newConfig);
    saveStoredConfig(newConfig);
    setSyncFeedback({
      message: newConfig.webAppUrl ? '구글 앱스 스크립트 웹앱 주소가 저장되었습니다.' : '구글 시트 연동이 해제되었습니다.',
      type: 'info',
    });
  };

  // Add Sale
  const handleSaveSale = async (
    saleData: Omit<SaleRecord, 'id' | 'createdAt'>,
    autoRecordCashflow: boolean
  ) => {
    const newId = `sale-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      sales.length + 1
    ).padStart(3, '0')}`;
    const newSale: SaleRecord = {
      ...saleData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    const nextSales = [newSale, ...sales];
    updateSales(nextSales);

    // Auto cashflow entry
    if (autoRecordCashflow && saleData.paymentStatus === 'paid') {
      const newCashflowRecord: CashflowRecord = {
        id: `cf-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
          cashflow.length + 1
        ).padStart(3, '0')}`,
        date: saleData.date,
        type: 'income',
        category: '소금 판매 대금',
        amount: saleData.totalAmount,
        clientOrVendor: saleData.clientName,
        paymentMethod:
          saleData.paymentMethod === 'bank_transfer'
            ? '통장입금(제주은행)'
            : saleData.paymentMethod === 'card'
            ? '사업자 법인카드'
            : '현금',
        memo: `[판매연동] ${saleData.itemName} ${saleData.quantity}${saleData.unit} 출고 결제대금`,
        createdAt: new Date().toISOString(),
      };
      updateCashflow([newCashflowRecord, ...cashflow]);
    }

    setSyncFeedback({
      message: `판매 전표(${newSale.clientName} / ${newSale.totalAmount.toLocaleString()}원)가 등록되었습니다.`,
      type: 'success',
    });

    // Background push to sheet if configured
    if (sheetConfig.webAppUrl) {
      try {
        await postToGoogleSheet(sheetConfig.webAppUrl, {
          action: 'saveSale',
          data: newSale,
        });
      } catch (err) {
        console.error('Failed background sync to sheet', err);
      }
    }
  };

  // Add Cashflow
  const handleSaveCashflow = async (recordData: Omit<CashflowRecord, 'id' | 'createdAt'>) => {
    const newId = `cf-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(
      cashflow.length + 1
    ).padStart(3, '0')}`;
    const newRecord: CashflowRecord = {
      ...recordData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    const nextCashflow = [newRecord, ...cashflow];
    updateCashflow(nextCashflow);

    setSyncFeedback({
      message: `장부 전표(${newRecord.type === 'income' ? '수입' : '지출'} ${newRecord.amount.toLocaleString()}원)가 등록되었습니다.`,
      type: 'success',
    });

    if (sheetConfig.webAppUrl) {
      try {
        await postToGoogleSheet(sheetConfig.webAppUrl, {
          action: 'saveCashflow',
          data: newRecord,
        });
      } catch (err) {
        console.error('Failed background sync to sheet', err);
      }
    }
  };

  // Delete Sale
  const handleDeleteSale = (id: string) => {
    const nextSales = sales.filter((s) => s.id !== id);
    updateSales(nextSales);
  };

  // Clear all sales
  const handleClearAllSales = async () => {
    updateSales([]);
    setSyncFeedback({
      message: '판매 내역이 모두 초기화되었습니다. 우리 판매 내역을 새롭게 직접 등록하실 수 있습니다.',
      type: 'info',
    });
    if (sheetConfig.webAppUrl) {
      try {
        await postToGoogleSheet(sheetConfig.webAppUrl, {
          action: 'syncSalesOnly',
          sales: [],
        });
      } catch (e) {
        console.warn('Failed to clear sheet sales', e);
      }
    }
  };

  // Reload/Regenerate sales records
  const handleReloadGeneratedSales = () => {
    updateSales(INITIAL_SALES);
    setSyncFeedback({
      message: `제주소금도매상사의 표준 도매 판매 실적 대장(${INITIAL_SALES.length}건)이 새롭게 생성·반영되었습니다.`,
      type: 'success',
    });
  };

  // Delete Cashflow
  const handleDeleteCashflow = (id: string) => {
    const nextCashflow = cashflow.filter((c) => c.id !== id);
    updateCashflow(nextCashflow);
  };

  // Reload/Regenerate cashflow records
  const handleReloadGeneratedCashflow = () => {
    updateCashflow(INITIAL_CASHFLOW);
    setSyncFeedback({
      message: `제주소금도매상사의 공식 수입·지출 회계 장부(${INITIAL_CASHFLOW.length}건)가 새롭게 생성·반영되었습니다.`,
      type: 'success',
    });
  };

  // Clear all cashflow
  const handleClearAllCashflow = async () => {
    updateCashflow([]);
    setSyncFeedback({
      message: '수입·지출 회계 장부가 초기화되었습니다. 새로운 입출금 전표를 등록하실 수 있습니다.',
      type: 'info',
    });
    if (sheetConfig.webAppUrl) {
      try {
        await postToGoogleSheet(sheetConfig.webAppUrl, {
          action: 'syncCashflowOnly',
          cashflow: [],
        });
      } catch (e) {
        console.warn('Failed to clear sheet cashflow', e);
      }
    }
  };

  // Pull from Google Sheet (GET)
  const handlePullFromSheet = async () => {
    if (!sheetConfig.webAppUrl) {
      setSyncFeedback({ message: '먼저 구글 앱스 스크립트 웹앱 URL을 입력해주세요.', type: 'error' });
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    const res = await fetchGoogleSheetData(sheetConfig.webAppUrl);
    setIsSyncing(false);

    if (res.error) {
      setSyncFeedback({ message: res.error, type: 'error' });
      return;
    }

    if (res.sales && res.sales.length > 0) {
      updateSales(res.sales);
    }
    if (res.cashflow && res.cashflow.length > 0) {
      updateCashflow(res.cashflow);
    }

    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedConfig: GoogleSheetConfig = {
      ...sheetConfig,
      lastSyncedAt: now,
      isConnected: true,
      sheetTitle: res.sheetTitle || sheetConfig.sheetTitle,
    };
    handleSaveConfig(updatedConfig);

    setSyncFeedback({
      message: `구글 시트에서 최신 데이터(판매 ${res.sales?.length || 0}건, 수입지출 ${res.cashflow?.length || 0}건)를 성공적으로 불러왔습니다.`,
      type: 'success',
    });
  };

  // Push Sales Only to Google Sheet (POST)
  const handlePushSalesOnly = async () => {
    if (!sheetConfig.webAppUrl) {
      setSyncFeedback({ message: '먼저 구글 앱스 스크립트 웹앱 URL을 입력해주세요.', type: 'error' });
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    const res = await postToGoogleSheet(sheetConfig.webAppUrl, {
      action: 'syncSalesOnly',
      sales,
    });

    setIsSyncing(false);

    if (!res.success) {
      setSyncFeedback({ message: res.message || '판매내역 시트 동기화 실패', type: 'error' });
      return;
    }

    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedConfig: GoogleSheetConfig = {
      ...sheetConfig,
      lastSyncedAt: now,
      isConnected: true,
    };
    handleSaveConfig(updatedConfig);

    setSyncFeedback({
      message: `판매 전표 ${sales.length}건이 구글 시트 [판매실적_출고대장] 탭에 성공적으로 전송되었습니다.`,
      type: 'success',
    });
  };

  // Push Cashflow Only to Google Sheet (POST)
  const handlePushCashflowOnly = async () => {
    if (!sheetConfig.webAppUrl) {
      setSyncFeedback({ message: '먼저 구글 앱스 스크립트 웹앱 URL을 입력해주세요.', type: 'error' });
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    const res = await postToGoogleSheet(sheetConfig.webAppUrl, {
      action: 'syncCashflowOnly',
      cashflow,
    });

    setIsSyncing(false);

    if (!res.success) {
      setSyncFeedback({ message: res.message || '수입지출내역 시트 동기화 실패', type: 'error' });
      return;
    }

    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedConfig: GoogleSheetConfig = {
      ...sheetConfig,
      lastSyncedAt: now,
      isConnected: true,
    };
    handleSaveConfig(updatedConfig);

    setSyncFeedback({
      message: `수입·지출 전표 ${cashflow.length}건이 구글 시트 [수입지출_회계장부] 탭에 성공적으로 전송되었습니다.`,
      type: 'success',
    });
  };

  // Push All to Google Sheet (POST)
  const handlePushToSheet = async () => {
    if (!sheetConfig.webAppUrl) {
      setSyncFeedback({ message: '먼저 구글 앱스 스크립트 웹앱 URL을 입력해주세요.', type: 'error' });
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    const res = await postToGoogleSheet(sheetConfig.webAppUrl, {
      action: 'syncAll',
      sales,
      cashflow,
    });

    setIsSyncing(false);

    if (!res.success) {
      setSyncFeedback({ message: res.message || '시트 동기화 실패', type: 'error' });
      return;
    }

    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const updatedConfig: GoogleSheetConfig = {
      ...sheetConfig,
      lastSyncedAt: now,
      isConnected: true,
    };
    handleSaveConfig(updatedConfig);

    setSyncFeedback({
      message: '현재 로컬에 보관된 모든 판매 및 수입지출 데이터가 구글 스프레드시트에 성공적으로 기록되었습니다.',
      type: 'success',
    });
  };

  // Auto setup sheet properties & 5 tabs
  const handleSetupSheetProperties = async () => {
    if (!sheetConfig.webAppUrl) {
      setSyncFeedback({ message: '먼저 구글 앱스 스크립트 웹앱 URL을 입력해주세요.', type: 'error' });
      return;
    }

    setIsSyncing(true);
    setSyncFeedback({
      message: '구글 스프레드시트 5개 탭 서식, 대시보드 계산수식, 속성을 자동 구성 중입니다...',
      type: 'info',
    });

    try {
      // 1. Trigger setupSheet on Apps Script
      await postToGoogleSheet(sheetConfig.webAppUrl, {
        action: 'setupSheet',
      });

      // 2. Push current sales and cashflow to populate the sheets
      await postToGoogleSheet(sheetConfig.webAppUrl, {
        action: 'syncAll',
        sales,
        cashflow,
      });

      // 3. Pull back to verify
      await handlePullFromSheet();

      setSyncFeedback({
        message: '구글 스프레드시트에 [📊 실시간요약], [판매실적_출고대장], [수입지출_회계장부], [도매품목단가표] 및 계산수식이 완벽하게 자동 구축되었습니다!',
        type: 'success',
      });
    } catch (e: any) {
      setSyncFeedback({
        message: `시트 속성 구성 중 오류 발생: ${e.message}`,
        type: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Quick action from Catalog
  const handleSelectProductForSale = (product: ProductItem) => {
    setPreselectedProduct(product);
    setIsNewSaleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sheetConfig={sheetConfig}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onOpenNewSaleModal={() => {
          setPreselectedProduct(null);
          setIsNewSaleModalOpen(true);
        }}
        onOpenNewCashflowModal={() => setIsNewCashflowModalOpen(true)}
        isSyncing={isSyncing}
        onSyncNow={sheetConfig.webAppUrl ? handlePullFromSheet : () => setIsSheetModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Banner Notice / Sync Status */}
        {syncFeedback && (
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
              syncFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : syncFeedback.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {syncFeedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : syncFeedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
              )}
              <span>{syncFeedback.message}</span>
            </div>
            <button
              onClick={() => setSyncFeedback(null)}
              className="text-slate-400 hover:text-slate-700 ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Mode Alert when sales_public is on */}
        {viewMode === 'sales_public' && (
          <div className="no-print bg-emerald-50 border border-emerald-300 p-3.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-emerald-950 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1 font-bold bg-emerald-700 text-white px-2 py-0.5 rounded text-[11px]">
                <Users className="w-3.5 h-3.5" />
                영업·외부 공유 모드 작동 중
              </span>
              <span className="text-slate-700">
                다른 사람(거래처, 직원, 기사님 등)에게 화면을 보여줄 때 수입·지출 장부 및 매입 원가, 순이익이 완전히 숨겨집니다.
              </span>
            </div>
            <button
              onClick={() => setViewMode('all')}
              className="px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 rounded font-semibold text-xs whitespace-nowrap self-start sm:self-center transition-colors cursor-pointer"
            >
              전체 관리자 모드로 전환
            </button>
          </div>
        )}

        {/* Company Overview & Google Sheets Quick Link banner if not configured */}
        {!sheetConfig.webAppUrl && (
          <div className="no-print bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-50 text-sky-700 rounded-md shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  구글 스프레드시트 (Apps Script 웹앱) 연동 준비 완료
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  현재 데이터는 브라우저 로컬 저장소에 안전하게 보관 중입니다. 구글 시트 웹앱 URL을 입력하시면 실시간 GET/POST 동기화가 활성화됩니다.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsSheetModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap self-start sm:self-center"
            >
              시트 연동 및 코드 복사
            </button>
          </div>
        )}

        {/* Top KPI Statistics Cards */}
        <StatsCards sales={sales} cashflow={cashflow} viewMode={viewMode} />

        {/* Tab View Content */}
        {activeTab === 'sales' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">판매 및 출고 전표 대장</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>총 {sales.length}건 등록</span>
                  <span aria-hidden="true">·</span>
                  <span>판매단가, 공급가액, 면세/과세 부가세, 배송방식 및 외상 미수금 관리</span>
                </div>
              </div>
            </div>

            <SalesTable
              sales={sales}
              onOpenNewSaleModal={() => {
                setPreselectedProduct(null);
                setIsNewSaleModalOpen(true);
              }}
              onOpenInvoiceModal={(sale) => setSelectedInvoiceSale(sale)}
              onDeleteSale={handleDeleteSale}
              onClearAllSales={handleClearAllSales}
              onReloadGeneratedSales={handleReloadGeneratedSales}
              onPushSalesToSheet={handlePushSalesOnly}
              isSyncing={isSyncing}
              hasSheetUrl={Boolean(sheetConfig.webAppUrl)}
            />
          </div>
        )}

        {activeTab === 'cashflow' && viewMode !== 'sales_public' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">수입 및 지출 회계 장부</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>총 {cashflow.length}건 입출금 기록</span>
                  <span aria-hidden="true">·</span>
                  <span>소금 판매수입, 외상수금, 원염 매입비, 선박 해상운임, 창고료, 인건비</span>
                </div>
              </div>
            </div>

            <CashflowTable
              cashflow={cashflow}
              onOpenNewCashflowModal={() => setIsNewCashflowModalOpen(true)}
              onDeleteCashflow={handleDeleteCashflow}
              onPushCashflowToSheet={handlePushCashflowOnly}
              onReloadGeneratedCashflow={handleReloadGeneratedCashflow}
              onClearAllCashflow={handleClearAllCashflow}
              isSyncing={isSyncing}
              hasSheetUrl={Boolean(sheetConfig.webAppUrl)}
            />
          </div>
        )}

        {activeTab === 'catalog' && (
          <PriceCatalog
            products={products}
            onSelectProductForSale={handleSelectProductForSale}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-semibold text-slate-800">
              {COMPANY_INFO.name} <span className="font-normal text-slate-400">| 사업자등록번호: {COMPANY_INFO.bizNumber}</span>
            </div>
            <div>
              사업장: {COMPANY_INFO.address} | 전화 직통: {COMPANY_INFO.phone}
            </div>
          </div>
          <div className="text-center md:text-right space-y-1">
            <div>입금전용: {COMPANY_INFO.bankAccount}</div>
            <div className="text-slate-400">© 2026 Jeju Salt Wholesale Corp. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewSaleModal
        isOpen={isNewSaleModalOpen}
        onClose={() => {
          setIsNewSaleModalOpen(false);
          setPreselectedProduct(null);
        }}
        products={products}
        preselectedProduct={preselectedProduct}
        onSaveSale={handleSaveSale}
      />

      <NewCashflowModal
        isOpen={isNewCashflowModalOpen}
        onClose={() => setIsNewCashflowModalOpen(false)}
        onSaveCashflow={handleSaveCashflow}
      />

      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        config={sheetConfig}
        onSaveConfig={handleSaveConfig}
        onPullFromSheet={handlePullFromSheet}
        onPushToSheet={handlePushToSheet}
        onPushSalesOnly={handlePushSalesOnly}
        onPushCashflowOnly={handlePushCashflowOnly}
        onSetupSheetProperties={handleSetupSheetProperties}
        isSyncing={isSyncing}
        syncMessage={syncFeedback?.message || null}
      />

      <InvoiceModal
        isOpen={Boolean(selectedInvoiceSale)}
        onClose={() => setSelectedInvoiceSale(null)}
        sale={selectedInvoiceSale}
      />
    </div>
  );
}
