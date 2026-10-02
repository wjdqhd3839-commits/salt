import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { CashflowRecord } from '../types';

interface CashflowTableProps {
  cashflow: CashflowRecord[];
  onOpenNewCashflowModal: () => void;
  onDeleteCashflow: (id: string) => void;
  onPushCashflowToSheet?: () => void;
  onReloadGeneratedCashflow?: () => void;
  onClearAllCashflow?: () => void;
  isSyncing?: boolean;
  hasSheetUrl?: boolean;
}

export const CashflowTable: React.FC<CashflowTableProps> = ({
  cashflow,
  onOpenNewCashflowModal,
  onDeleteCashflow,
  onPushCashflowToSheet,
  onReloadGeneratedCashflow,
  onClearAllCashflow,
  isSyncing = false,
  hasSheetUrl = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    cashflow.forEach((c) => set.add(c.category));
    return Array.from(set);
  }, [cashflow]);

  const filteredCashflow = useMemo(() => {
    return cashflow.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientOrVendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.memo && item.memo.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchType = true;
      if (typeFilter !== 'all') {
        matchType = item.type === typeFilter;
      }

      let matchCategory = true;
      if (categoryFilter !== 'all') {
        matchCategory = item.category === categoryFilter;
      }

      return matchSearch && matchType && matchCategory;
    });
  }, [cashflow, searchTerm, typeFilter, categoryFilter]);

  const totalIncome = filteredCashflow
    .filter((c) => c.type === 'income')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalExpense = filteredCashflow
    .filter((c) => c.type === 'expense')
    .reduce((sum, c) => sum + c.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatNumber = (num: number) => new Intl.NumberFormat('ko-KR').format(num);

  const exportCSV = () => {
    const headers = ['장부ID', '일자', '구분', '계정과목', '금액', '거래처/지급처', '결제수단', '적요/비고'];
    const rows = filteredCashflow.map((c) => [
      `"${c.id}"`,
      `"${c.date}"`,
      `"${c.type === 'income' ? '수입' : '지출'}"`,
      `"${c.category}"`,
      c.amount,
      `"${c.clientOrVendor}"`,
      `"${c.paymentMethod}"`,
      `"${(c.memo || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `제주소금도매_수입지출장부_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="과목, 지급처, 적요 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 w-52 sm:w-60"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center p-1 bg-slate-100 rounded-md text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체 내역
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'income' ? 'bg-white text-emerald-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              수입만 (+{cashflow.filter((c) => c.type === 'income').length})
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'expense' ? 'bg-white text-rose-700 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              지출만 (-{cashflow.filter((c) => c.type === 'expense').length})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">모든 계정과목</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onPushCashflowToSheet && hasSheetUrl && (
            <button
              onClick={onPushCashflowToSheet}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md shadow-xs transition-colors whitespace-nowrap disabled:opacity-50"
              title="이 수입·지출 내역들만 구글 시트의 [수입지출_회계장부] 탭에 즉시 동기화합니다"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>내 시트에 수입·지출 연동</span>
            </button>
          )}

          {onReloadGeneratedCashflow && (
            <button
              onClick={onReloadGeneratedCashflow}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap"
              title="도매상사 수입·지출 표준 장부 데이터를 다시 생성합니다"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
              <span>장부 재설정</span>
            </button>
          )}

          {cashflow.length > 0 && onClearAllCashflow && (
            <button
              onClick={() => {
                if (confirm('수입·지출 장부 내역을 모두 비우시겠습니까?')) {
                  onClearAllCashflow();
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-md transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>장부 비우기</span>
            </button>
          )}

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>장부 CSV</span>
          </button>

          <button
            onClick={onOpenNewCashflowModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>전표 등록</span>
          </button>
        </div>
      </div>

      {/* Cashflow Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium whitespace-nowrap">
              <th className="py-2.5 px-3">일자</th>
              <th className="py-2.5 px-3 text-center">구분</th>
              <th className="py-2.5 px-3">계정과목 / 항목</th>
              <th className="py-2.5 px-3 text-right">금액</th>
              <th className="py-2.5 px-3">거래처 / 지급처</th>
              <th className="py-2.5 px-3">결제수단</th>
              <th className="py-2.5 px-3">적요 및 상세 메모</th>
              <th className="py-2.5 px-3 text-center">삭제</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCashflow.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm font-semibold text-slate-700">등록된 수입·지출 내역이 없습니다.</p>
                    <p className="text-xs text-slate-500">
                      상단의 [전표 등록] 버튼으로 입력하거나, [장부 재설정]을 눌러 표준 내역을 불러오실 수 있습니다.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCashflow.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {item.type === 'income' ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold">
                        <ArrowUpRight className="w-3 h-3" /> 수입
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-rose-700 font-bold">
                        <ArrowDownRight className="w-3 h-3" /> 지출
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold whitespace-nowrap">
                    <span className={item.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}>
                      {item.type === 'income' ? '+' : '-'}
                      {formatNumber(item.amount)}원
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap font-medium">
                    {item.clientOrVendor}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {item.paymentMethod}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-sm truncate" title={item.memo}>
                    {item.memo || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (confirm(`'${item.category}' 내역(${formatNumber(item.amount)}원)을 삭제하시겠습니까?`)) {
                          onDeleteCashflow(item.id);
                        }
                      }}
                      title="장부 내역 삭제"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Summary Footer */}
          {filteredCashflow.length > 0 && (
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-300 font-semibold text-slate-900">
                <td colSpan={3} className="py-3 px-3 text-right">
                  조회 합계 ({filteredCashflow.length}건):
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                  <div className="text-emerald-700 text-xs">수입 +{formatNumber(totalIncome)}원</div>
                  <div className="text-rose-700 text-xs">지출 -{formatNumber(totalExpense)}원</div>
                  <div className="text-sm font-bold text-slate-900 border-t border-slate-200 pt-0.5 mt-0.5">
                    차액 {balance >= 0 ? '+' : ''}{formatNumber(balance)}원
                  </div>
                </td>
                <td colSpan={4}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
