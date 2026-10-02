import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  DollarSign,
  Package,
  PackageCheck,
  ReceiptText,
  TrendingUp,
} from 'lucide-react';
import { AppViewMode, CashflowRecord, SaleRecord } from '../types';

interface StatsCardsProps {
  sales: SaleRecord[];
  cashflow: CashflowRecord[];
  viewMode?: AppViewMode;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ sales, cashflow, viewMode = 'all' }) => {
  // Aggregate sales figures
  const totalSalesAmount = sales.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalSalesCount = sales.length;
  const totalQuantity = sales.reduce((sum, item) => sum + item.quantity, 0);

  // Unpaid sales (Receivables)
  const unpaidSales = sales.filter((item) => item.paymentStatus === 'unpaid' || item.paymentStatus === 'partial');
  const unpaidAmount = unpaidSales.reduce((sum, item) => sum + item.totalAmount, 0);
  const paidSales = sales.filter((item) => item.paymentStatus === 'paid');

  // Cashflow aggregates
  const totalIncome = cashflow
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = cashflow
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const formatWon = (val: number) => {
    return new Intl.NumberFormat('ko-KR').format(val) + '원';
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('ko-KR').format(val);
  };

  // 영업/공유 모드일 때는 민감한 지출/순이익을 감추고 출고 및 판매 실적 위주로 표시
  if (viewMode === 'sales_public') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. 총 판매 실적 매출액 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-700">총 판매 실적 매출</span>
            <PackageCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            {formatWon(totalSalesAmount)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>누적 출고 건수</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-700">{totalSalesCount}건 완료</span>
          </div>
        </div>

        {/* 2. 총 출고 물량 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-700">총 출고 수량 (포대/톤백)</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700 tracking-tight">
            {formatNumber(totalQuantity)} <span className="text-sm font-normal text-slate-600">포/톤</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>제주도내 직배 및 화물선적</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">정상 출고</span>
          </div>
        </div>

        {/* 3. 정상 결제 완료 건수 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-700">정상 수납 완료율</span>
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-sky-800 tracking-tight">
            {totalSalesCount > 0 ? ((paidSales.length / totalSalesCount) * 100).toFixed(0) + '%' : '100%'}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>정상 입금</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-700">{paidSales.length}건 ({formatWon(paidSales.reduce((s, i) => s + i.totalAmount, 0))})</span>
          </div>
        </div>

        {/* 4. 평균 공급 단가 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-700">건당 평균 공급 규모</span>
            <TrendingUp className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-800 tracking-tight">
            {totalSalesCount > 0 ? formatWon(Math.round(totalSalesAmount / totalSalesCount)) : '0원'}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span>도매 표준 기준단가</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 font-medium">대량 특판 적용</span>
          </div>
        </div>
      </div>
    );
  }

  // 내부 회계 / 통합 모드 (수입, 지출, 순이익, 미수금 등 전체 재무 지표 노출)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. 총 매출액 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium">총 판매 매출액</span>
          <PackageCheck className="w-4 h-4 text-sky-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
          {formatWon(totalSalesAmount)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span>누적 출고건수</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-700">{totalSalesCount}건 ({formatNumber(totalQuantity)}포)</span>
        </div>
      </div>

      {/* 2. 실제 수입액 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium">장부 수입 합계</span>
          <ArrowUpRight className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700 tracking-tight">
          {formatWon(totalIncome)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span>판매금·외상수금</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-600 font-medium">통장 실입금</span>
        </div>
      </div>

      {/* 3. 실제 지출액 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium">장부 지출 합계</span>
          <ArrowDownRight className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-rose-700 tracking-tight">
          {formatWon(totalExpense)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span>원염매입·물류·운임</span>
          <span aria-hidden="true">·</span>
          <span className="text-rose-600 font-medium">출금 완료</span>
        </div>
      </div>

      {/* 4. 순수익 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium">누적 순이익 (수입-지출)</span>
          <Banknote className="w-4 h-4 text-sky-700" />
        </div>
        <div
          className={`text-xl sm:text-2xl font-bold font-mono tabular-nums tracking-tight ${
            netProfit >= 0 ? 'text-sky-800' : 'text-rose-700'
          }`}
        >
          {formatWon(netProfit)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span>수익률</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-slate-700">
            {totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) + '%' : '0%'}
          </span>
        </div>
      </div>

      {/* 5. 미수금 잔액 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium">외상 미수금 잔액</span>
          <ReceiptText className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-700 tracking-tight">
          {formatWon(unpaidAmount)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <span>미수 전표</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-amber-700">{unpaidSales.length}건 정산 대기</span>
        </div>
      </div>
    </div>
  );
};
