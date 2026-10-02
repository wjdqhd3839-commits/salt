import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign, X } from 'lucide-react';
import { CashflowRecord } from '../types';

interface NewCashflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCashflow: (record: Omit<CashflowRecord, 'id' | 'createdAt'>) => void;
}

const INCOME_CATEGORIES = [
  '소금 판매 대금',
  '외상매출금 회수',
  '선수금 입금',
  '배송 운임 청구분',
  '기타 잡수입',
];

const EXPENSE_CATEGORIES = [
  '원염 대량 매입 (염전)',
  '해상 화물 선박 운임',
  '도내 화물차 운송비',
  '포장 자재비 (마대/비닐)',
  '창고 임대 및 보관료',
  '물류 장비 유류비',
  '상하차 작업 인건비',
  '사무실 관리비/공과금',
  '세무 기장료 및 수수료',
];

export const NewCashflowModal: React.FC<NewCashflowModalProps> = ({
  isOpen,
  onClose,
  onSaveCashflow,
}) => {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState<number>(100000);
  const [clientOrVendor, setClientOrVendor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('통장입금(제주은행)');
  const [memo, setMemo] = useState('');

  if (!isOpen) return null;

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0]);
    } else {
      setCategory(EXPENSE_CATEGORIES[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientOrVendor.trim()) {
      alert('거래처 또는 지급처를 입력해주세요.');
      return;
    }
    if (amount <= 0) {
      alert('0원 이상의 유효한 금액을 입력해주세요.');
      return;
    }

    const finalCategory = category === '직접입력' ? customCategory.trim() || '기타' : category;

    onSaveCashflow({
      date,
      type,
      category: finalCategory,
      amount,
      clientOrVendor: clientOrVendor.trim(),
      paymentMethod,
      memo: memo.trim() || undefined,
    });

    onClose();
  };

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              수입 / 지출 전표 등록
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Income / Expense Toggle */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">장부 구분</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 px-3 rounded-md border text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  type === 'income'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <span>수입 (돈 들어옴)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 px-3 rounded-md border text-center font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  type === 'expense'
                    ? 'bg-rose-50 border-rose-500 text-rose-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ArrowDownRight className="w-4 h-4 text-rose-600" />
                <span>지출 (비용 나감)</span>
              </button>
            </div>
          </div>

          {/* Date & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">발생 일자</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">금액 (원) *</label>
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md font-mono font-bold text-slate-900 focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">계정과목 / 항목</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md"
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="직접입력">직접 입력...</option>
            </select>
            {category === '직접입력' && (
              <input
                type="text"
                placeholder="과목명을 입력하세요"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-2 w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md"
              />
            )}
          </div>

          {/* Client or Vendor & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {type === 'income' ? '입금처 (거래처명)' : '지급처 (상호 또는 거래처)'} *
              </label>
              <input
                type="text"
                required
                placeholder={type === 'income' ? '예: 한림수산가공 (주)' : '예: 제주삼다해운 / 염전'}
                value={clientOrVendor}
                onChange={(e) => setClientOrVendor(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">결제 수단</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              >
                <option value="통장입금(제주은행)">통장입금 (제주은행)</option>
                <option value="법인/사업자카드">사업자 법인카드</option>
                <option value="전자세금계산서 이체">전자세금계산서 이체</option>
                <option value="현금영수증(지출증빙)">현금영수증 (지출증빙)</option>
                <option value="약속어음">약속어음</option>
              </select>
            </div>
          </div>

          {/* Memo */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">적요 및 상세 내용</label>
            <input
              type="text"
              placeholder="예: 천일염 20톤 목포-제주 선박 운임 결제"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-bold text-white rounded-md shadow-xs transition-colors ${
                type === 'income' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              {type === 'income' ? '수입 등록 완료' : '지출 등록 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
