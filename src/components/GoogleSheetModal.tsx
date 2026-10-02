import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  Play,
  RefreshCw,
  Sparkles,
  UploadCloud,
  Wrench,
  X,
} from 'lucide-react';
import { APPS_SCRIPT_TEMPLATE } from '../data/mockData';
import { GoogleSheetConfig } from '../types';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetConfig;
  onSaveConfig: (config: GoogleSheetConfig) => void;
  onPullFromSheet: () => Promise<void>;
  onPushToSheet: () => Promise<void>;
  onPushSalesOnly?: () => Promise<void>;
  onPushCashflowOnly?: () => Promise<void>;
  onSetupSheetProperties: () => Promise<void>;
  isSyncing: boolean;
  syncMessage: string | null;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onPullFromSheet,
  onPushToSheet,
  onPushSalesOnly,
  onPushCashflowOnly,
  onSetupSheetProperties,
  isSyncing,
  syncMessage,
}) => {
  const [url, setUrl] = useState(config.webAppUrl || '');
  const [autoSync, setAutoSync] = useState(config.autoSync ?? true);
  const [autoSyncInterval, setAutoSyncInterval] = useState(config.autoSyncInterval || 15);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'code' | 'guide'>('settings');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      ...config,
      webAppUrl: url.trim(),
      autoSync,
      autoSyncInterval,
      isConnected: Boolean(url.trim()),
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                구글 스프레드시트 실시간 연동 & 자동 속성 세팅
              </h2>
              <p className="text-xs text-slate-500">
                외부 유료 API 없이 Apps Script 웹앱 URL 하나로 실시간 양방향 동기화 및 5대 시트 서식 자동 구축
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            실시간 연동 & 동기화 제어
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'code'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            최신 앱스 스크립트 코드 복사 (v2.0)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-sky-600 text-sky-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            배포 및 트러블슈팅 가이드
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'settings' && (
            <div className="space-y-5">
              {/* URL Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  구글 앱스 스크립트 배포 웹앱 URL (Current Web App URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
                  >
                    URL 저장
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  * [배포] → [웹 앱] → [액세스 권한: 모든 사용자 (Anyone)]로 설정된 URL을 입력해주세요.
                </p>
              </div>

              {/* Status Message */}
              {syncMessage && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-md text-xs text-sky-900 font-medium">
                  {syncMessage}
                </div>
              )}

              {/* Real-time Auto-Sync Settings */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      실시간 백그라운드 자동 동기화 (Real-time Live Sync)
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      브라우저가 켜져 있는 동안 주기적으로 구글 시트의 변경사항을 자동 감지하고 최신 상태를 유지합니다.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => {
                        setAutoSync(e.target.checked);
                        onSaveConfig({
                          ...config,
                          webAppUrl: url.trim(),
                          autoSync: e.target.checked,
                          autoSyncInterval,
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {autoSync && (
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600">동기화 주기 선택:</span>
                    <div className="flex items-center gap-1 bg-white p-1 rounded border border-slate-200">
                      {[10, 15, 30, 60].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => {
                            setAutoSyncInterval(sec);
                            onSaveConfig({
                              ...config,
                              webAppUrl: url.trim(),
                              autoSync,
                              autoSyncInterval: sec,
                            });
                          }}
                          className={`px-2 py-0.5 rounded text-xs transition-colors ${
                            autoSyncInterval === sec
                              ? 'bg-sky-600 text-white font-bold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {sec}초
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Sync */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">시트 분리 동기화 및 속성 세팅</h4>
                  <span className="text-[11px] text-slate-500">판매실적과 수입지출을 독립적으로 전송 가능</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* 수입지출만 전송 */}
                  {onPushCashflowOnly && (
                    <button
                      onClick={onPushCashflowOnly}
                      disabled={isSyncing || !url}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-xs font-semibold disabled:opacity-50 transition-colors shadow-xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>수입·지출 장부만 시트로 전송 (POST)</span>
                    </button>
                  )}

                  {/* 판매실적만 전송 */}
                  {onPushSalesOnly && (
                    <button
                      onClick={onPushSalesOnly}
                      disabled={isSyncing || !url}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded-md text-xs font-semibold disabled:opacity-50 transition-colors shadow-xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>판매 실적 대장만 시트로 전송 (POST)</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-slate-200">
                  <button
                    onClick={onPullFromSheet}
                    disabled={isSyncing || !url}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-sky-600 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>시트에서 가져오기 (GET)</span>
                  </button>

                  <button
                    onClick={onPushToSheet}
                    disabled={isSyncing || !url}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold disabled:opacity-50 transition-colors shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                    <span>전체 일괄 전송 (판매+수입지출)</span>
                  </button>

                  <button
                    onClick={onSetupSheetProperties}
                    disabled={isSyncing || !url}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold disabled:opacity-50 transition-colors"
                    title="시트 이름, 4개 분리 탭, 계산식(=SUM), 통화 서식을 자동으로 세팅합니다"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>시트 속성 자동 구성</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    상태: {url ? '연결 주소 등록됨' : '미연결 (브라우저 로컬스토리지에 저장 중)'}
                  </span>
                  {config.lastSyncedAt && (
                    <span>최종 동기화: {config.lastSyncedAt}</span>
                  )}
                </div>
              </div>

              {/* What sheet properties are automatically created */}
              <div className="p-3.5 bg-sky-50/60 border border-sky-200/70 rounded-lg text-xs space-y-2">
                <div className="font-bold text-sky-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-700" />
                  <span>스프레드시트에 자동 생성되는 5개 탭 & 속성 안내</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                  <li className="flex items-start gap-1">
                    <span className="font-bold text-sky-800">1. [📊 실시간요약]:</span>
                    <span>총매출, 미수금, 수입, 지출, 순이익 계산수식 자동 연동</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="font-bold text-sky-800">2. [판매내역]:</span>
                    <span>17개 열 헤더, 통화 서식, 입금완료/외상미수 드롭다운</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="font-bold text-sky-800">3. [수입지출내역]:</span>
                    <span>구분(수입/지출), 도매 특화 계정과목 드롭다운 및 서식</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="font-bold text-sky-800">4. [도매품목단가표]:</span>
                    <span>천일염, 꽃소금, 죽염 등 표준도매가·대량특판가·재고</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900">
                    최신 Google Apps Script 코드 (v2.0 실시간 동기화 & 속성 자동화)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    구글 시트의 [확장 프로그램] → [Apps Script]에 붙여넣기하세요.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사 완료!' : '전체 코드 복사'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-md overflow-x-auto max-h-80 leading-relaxed">
                  {APPS_SCRIPT_TEMPLATE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 font-medium">
                ⚠️ <strong>동기화가 안 될 때 가장 흔한 원인 2가지:</strong>
                <ol className="list-decimal list-inside mt-1 font-normal text-xs space-y-1">
                  <li>Apps Script 코드를 수정한 후 [배포] → [배포 관리]에서 <strong>[새 버전]</strong>으로 다시 배포하지 않은 경우</li>
                  <li>배포 시 액세스 권한을 <strong>[모든 사용자(Anyone)]</strong>로 지정하지 않아 브라우저 접근이 차단된 경우</li>
                </ol>
              </div>

              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong className="text-slate-900">구글 스프레드시트 열기:</strong>
                  <div className="pl-5 text-slate-600 mt-0.5">
                    구글 드라이브에서 새 스프레드시트를 엽니다. (제목은 비워두셔도 스크립트가 <code>제주소금도매상사_통합관리시스템</code>으로 자동 변경합니다)
                  </div>
                </li>
                <li>
                  <strong className="text-slate-900">[확장 프로그램] → [Apps Script] 클릭:</strong>
                  <div className="pl-5 text-slate-600 mt-0.5">
                    편집기의 모든 기본 내용을 지우고, [최신 코드 복사] 버튼을 눌러 복사한 코드를 붙여넣은 뒤 <strong>Ctrl+S (저장)</strong>합니다.
                  </div>
                </li>
                <li>
                  <strong className="text-slate-900">웹 앱으로 배포하기:</strong>
                  <div className="pl-5 text-slate-600 mt-0.5 space-y-0.5">
                    <p>우측 상단 <code>[배포]</code> → <code>[새 배포]</code> 클릭</p>
                    <p>유형 선택(톱니바퀴) → <code>[웹 앱]</code></p>
                    <p>다음 사용자로 실행: <code>나(내 계정)</code></p>
                    <p className="text-rose-600 font-bold">
                      액세스 권한: <code>모든 사용자 (Anyone)</code> 필수 선택!
                    </p>
                  </div>
                </li>
                <li>
                  <strong className="text-slate-900">웹 앱 URL 등록 및 실시간 동기화 시작:</strong>
                  <div className="pl-5 text-slate-600 mt-0.5">
                    생성된 웹앱 주소(<code>https://script.google.com/macros/s/.../exec</code>)를 복사하여 첫 번째 탭의 입력창에 붙여넣고 [URL 저장]을 누르면 즉시 실시간 동기화가 가동됩니다!
                  </div>
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
