import React, { useMemo, useState } from 'react';
import { Download, Eye, FileText, Filter, Package, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { SaleRecord } from '../types';

interface SalesTableProps {
  sales: SaleRecord[];
  onOpenNewSaleModal: () => void;
  onOpenInvoiceModal: (sale: SaleRecord) => void;
  onDeleteSale: (id: string) => void;
  onClearAllSales?: () => void;
  onReloadGeneratedSales?: () => void;
  onPushSalesToSheet?: () => void;
  isSyncing?: boolean;
  hasSheetUrl?: boolean;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onOpenNewSaleModal,
  onOpenInvoiceModal,
  onDeleteSale,
  onClearAllSales,
  onReloadGeneratedSales,
  onPushSalesToSheet,
  isSyncing = false,
  hasSheetUrl = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const formatDate = (d: string) => {
    if (!d) return '';
    return d.includes('T') ? d.split('T')[0] : d.length >= 10 ? d.slice(0, 10) : d;
  };

  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      // Search
      const matchSearch =
        searchTerm === '' ||
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.memo && item.memo.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status
      let matchStatus = true;
      if (statusFilter === 'paid') {
        matchStatus = item.paymentStatus === 'paid';
      } else if (statusFilter === 'unpaid') {
        matchStatus = item.paymentStatus === 'unpaid' || item.paymentStatus === 'partial';
      }

      // Date
      let matchDate = true;
      const today = new Date().toISOString().slice(0, 10);
      if (dateFilter === 'today') {
        matchDate = item.date === today;
      } else if (dateFilter === 'week') {
        const itemTime = new Date(item.date).getTime();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        matchDate = itemTime >= oneWeekAgo;
      } else if (dateFilter === 'month') {
        matchDate = item.date.startsWith(today.slice(0, 7));
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [sales, searchTerm, statusFilter, dateFilter]);

  const totalFilteredQuantity = filteredSales.reduce((acc, cur) => acc + cur.quantity, 0);
  const totalFilteredAmount = filteredSales.reduce((acc, cur) => acc + cur.totalAmount, 0);

  const formatNumber = (num: number) => new Intl.NumberFormat('ko-KR').format(num);

  const exportCSV = () => {
    const headers = [
      '전표ID',
      '판매일자',
      '거래처명',
      '연락처',
      '사업자번호',
      '품목명',
      '규격',
      '수량',
      '단위',
      '판매단가',
      '공급가액',
      '과세구분',
      '부가세',
      '합계금액',
      '결제상태',
      '결제방식',
      '배송방식',
      '비고',
    ];

    const rows = filteredSales.map((s) => [
      `"${s.id}"`,
      `"${s.date}"`,
      `"${s.clientName}"`,
      `"${s.clientContact}"`,
      `"${s.clientBizNumber || ''}"`,
      `"${s.itemName}"`,
      `"${s.itemSpec}"`,
      s.quantity,
      `"${s.unit}"`,
      s.unitPrice,
      s.supplyPrice,
      `"${s.taxType === 'tax_free' ? '면세' : '과세'}"`,
      s.taxAmount,
      s.totalAmount,
      `"${s.paymentStatus === 'paid' ? '입금완료' : '외상미수금'}"`,
      `"${s.paymentMethod}"`,
      `"${s.deliveryMethod}"`,
      `"${(s.memo || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `제주소금도매_판매내역_${new Date().toISOString().slice(0, 10)}.csv`);
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
              placeholder="거래처명, 품목, 비고 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 w-56 sm:w-64"
            />
          </div>

          {/* Date Filter Segmented control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-md text-xs">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateFilter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체 기간
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateFilter === 'today' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              오늘
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateFilter === 'week' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              최근 7일
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-2.5 py-1 rounded transition-colors ${
                dateFilter === 'month' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              이번 달
            </button>
          </div>

          {/* Payment Status Segmented control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-md text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              결제 전체
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'paid' ? 'bg-white text-emerald-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              입금완료
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'unpaid' ? 'bg-white text-amber-800 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              외상/미수
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onPushSalesToSheet && hasSheetUrl && (
            <button
              onClick={onPushSalesToSheet}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-600 rounded-md shadow-xs transition-colors whitespace-nowrap disabled:opacity-50"
              title="이 판매 내역들만 구글 시트의 [판매실적_출고대장] 탭에 즉시 동기화합니다"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>내 시트에 판매 실적 연동</span>
            </button>
          )}

          {onReloadGeneratedSales && (
            <button
              onClick={onReloadGeneratedSales}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap"
              title="제주소금도매상사 표준 도매 판매 실적 대장을 다시 생성·복원합니다"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
              <span>판매 실적 다시 생성</span>
            </button>
          )}

          {sales.length > 0 && onClearAllSales && (
            <button
              onClick={() => {
                if (confirm('현재 등록된 판매 내역을 모두 지우시겠습니까?\n우리 판매 내역을 새롭게 직접 등록할 수 있도록 깨끗하게 초기화합니다.')) {
                  onClearAllSales();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-md transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>판매내역 비우기</span>
            </button>
          )}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV 저장</span>
          </button>
          <button
            onClick={onOpenNewSaleModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-500 transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 판매 전표 등록</span>
          </button>
        </div>
      </div>

      {/* Sales Records Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium whitespace-nowrap">
              <th className="py-2.5 px-3">판매일자</th>
              <th className="py-2.5 px-3">거래처명</th>
              <th className="py-2.5 px-3">품목명 / 규격</th>
              <th className="py-2.5 px-3 text-right">수량</th>
              <th className="py-2.5 px-3 text-right">판매단가</th>
              <th className="py-2.5 px-3 text-right">공급가액</th>
              <th className="py-2.5 px-3 text-right">부가세</th>
              <th className="py-2.5 px-3 text-right font-semibold">합계금액</th>
              <th className="py-2.5 px-3 text-center">결제상태</th>
              <th className="py-2.5 px-3">배송구분</th>
              <th className="py-2.5 px-3">비고</th>
              <th className="py-2.5 px-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2.5 text-slate-500">
                    <Package className="w-9 h-9 text-slate-300 stroke-1" />
                    <p className="text-sm font-semibold text-slate-800">등록된 판매 내역이 없습니다.</p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      상단의 <strong className="text-sky-700">[새 판매 전표 등록]</strong> 버튼으로 등록하거나, 도매 실적을 다시 불러오실 수 있습니다.
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={onOpenNewSaleModal}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-md shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>새 판매 등록하기</span>
                      </button>
                      {onReloadGeneratedSales && (
                        <button
                          onClick={onReloadGeneratedSales}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-sky-600" />
                          <span>도매 판매실적 불러오기</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSales.map((item) => (
                <tr key={item.id} className="hover:bg-sky-50/50 transition-colors group">
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {formatDate(item.date)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    <div>{item.clientName}</div>
                    <div className="text-[11px] font-normal text-slate-400 font-mono">{item.clientContact}</div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">
                    <div className="font-medium">{item.itemName}</div>
                    <div className="text-[11px] text-slate-400">{item.itemSpec}</div>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-800 whitespace-nowrap">
                    {formatNumber(item.quantity)} <span className="text-slate-400 font-normal">{item.unit}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {formatNumber(item.unitPrice)}원
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                    {formatNumber(item.supplyPrice)}원
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                    {item.taxAmount > 0 ? `${formatNumber(item.taxAmount)}원` : '면세'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-sky-900 whitespace-nowrap">
                    {formatNumber(item.totalAmount)}원
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {item.paymentStatus === 'paid' ? (
                      <span className="text-emerald-700 font-semibold text-[11px]">입금완료</span>
                    ) : item.paymentStatus === 'bill' ? (
                      <span className="text-blue-700 font-semibold text-[11px]">어음결제</span>
                    ) : (
                      <span className="text-amber-700 font-semibold text-[11px]">외상미수</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px] whitespace-nowrap">
                    {item.deliveryMethod === 'jeju_direct'
                      ? '도내 직배송'
                      : item.deliveryMethod === 'freight_truck'
                      ? '화물 용달'
                      : item.deliveryMethod === 'port_logistics'
                      ? '제주항 물류'
                      : '창고 방문'}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs truncate" title={item.memo}>
                    {item.memo || '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenInvoiceModal(item)}
                        title="거래명세서 / 영수증 인쇄"
                        className="p-1 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`'${item.clientName}'의 판매 전표를 삭제하시겠습니까?`)) {
                            onDeleteSale(item.id);
                          }
                        }}
                        title="전표 삭제"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Table Summary Footer */}
          {filteredSales.length > 0 && (
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-300 font-semibold text-slate-900">
                <td colSpan={3} className="py-3 px-3 text-right">
                  조회 합계 ({filteredSales.length}건):
                </td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-sky-800">
                  {formatNumber(totalFilteredQuantity)}
                </td>
                <td colSpan={3}></td>
                <td className="py-3 px-3 text-right font-mono tabular-nums text-lg text-sky-900">
                  {formatNumber(totalFilteredAmount)}원
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
