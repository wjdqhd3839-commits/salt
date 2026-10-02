import React, { useEffect, useState } from 'react';
import { Calculator, Calendar, Check, Package, Truck, User, X } from 'lucide-react';
import { ProductItem, SaleRecord } from '../types';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  preselectedProduct?: ProductItem | null;
  onSaveSale: (
    sale: Omit<SaleRecord, 'id' | 'createdAt'>,
    autoRecordCashflow: boolean
  ) => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({
  isOpen,
  onClose,
  products,
  preselectedProduct,
  onSaveSale,
}) => {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [clientBizNumber, setClientBizNumber] = useState('');
  const [address, setAddress] = useState('');

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [itemName, setItemName] = useState('');
  const [itemSpec, setItemSpec] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('포');
  const [unitPrice, setUnitPrice] = useState<number>(22000);
  const [taxType, setTaxType] = useState<'tax_free' | 'taxable'>('tax_free');

  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid' | 'partial' | 'bill'>('paid');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash' | 'card' | 'promissory_note'>('bank_transfer');
  const [deliveryMethod, setDeliveryMethod] = useState<'jeju_direct' | 'freight_truck' | 'port_logistics' | 'pickup'>('jeju_direct');
  const [memo, setMemo] = useState('');
  const [autoRecordCashflow, setAutoRecordCashflow] = useState(true);

  // When opening or preselectedProduct changes
  useEffect(() => {
    if (preselectedProduct) {
      setSelectedProductId(preselectedProduct.id);
      setItemName(preselectedProduct.name);
      setItemSpec(preselectedProduct.spec);
      setUnit(preselectedProduct.unit);
      setTaxType(preselectedProduct.isTaxFree ? 'tax_free' : 'taxable');
      setUnitPrice(quantity >= 100 ? preselectedProduct.bulkPrice : preselectedProduct.standardPrice);
    } else if (products.length > 0 && !selectedProductId) {
      const first = products[0];
      setSelectedProductId(first.id);
      setItemName(first.name);
      setItemSpec(first.spec);
      setUnit(first.unit);
      setTaxType(first.isTaxFree ? 'tax_free' : 'taxable');
      setUnitPrice(first.standardPrice);
    }
  }, [preselectedProduct, products, isOpen]);

  // Adjust unit price when quantity crosses 100 if matching catalog product
  const handleQuantityChange = (q: number) => {
    const newQty = Math.max(1, q);
    setQuantity(newQty);

    const product = products.find((p) => p.id === selectedProductId);
    if (product) {
      if (newQty >= 100) {
        setUnitPrice(product.bulkPrice);
      } else {
        setUnitPrice(product.standardPrice);
      }
    }
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    const prod = products.find((p) => p.id === id);
    if (prod) {
      setItemName(prod.name);
      setItemSpec(prod.spec);
      setUnit(prod.unit);
      setTaxType(prod.isTaxFree ? 'tax_free' : 'taxable');
      setUnitPrice(quantity >= 100 ? prod.bulkPrice : prod.standardPrice);
    }
  };

  // Calculations
  const supplyPrice = quantity * unitPrice;
  const taxAmount = taxType === 'taxable' ? Math.round(supplyPrice * 0.1) : 0;
  const totalAmount = supplyPrice + taxAmount;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('거래처명을 입력해주세요.');
      return;
    }
    if (!itemName.trim()) {
      alert('품목명을 입력해주세요.');
      return;
    }

    onSaveSale(
      {
        date,
        clientName: clientName.trim(),
        clientContact: clientContact.trim(),
        clientBizNumber: clientBizNumber.trim() || undefined,
        address: address.trim() || undefined,
        itemName,
        itemSpec,
        quantity,
        unit,
        unitPrice,
        supplyPrice,
        taxType,
        taxAmount,
        totalAmount,
        paymentStatus,
        paymentMethod,
        deliveryMethod,
        memo: memo.trim() || undefined,
      },
      paymentStatus === 'paid' && autoRecordCashflow
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">제주 소금 판매 전표 등록</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Row 1: Date & Client Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">판매 일자</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                거래처명 (식당/수산/마트/가공공장) *
              </label>
              <input
                type="text"
                required
                placeholder="예: 한림수산가공 (주)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Row 2: Client Contact & Biz Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">거래처 연락처</label>
              <input
                type="text"
                placeholder="예: 064-796-4120 / 010-..."
                value={clientContact}
                onChange={(e) => setClientContact(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">사업자등록번호 (선택)</label>
              <input
                type="text"
                placeholder="예: 616-86-12345"
                value={clientBizNumber}
                onChange={(e) => setClientBizNumber(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Row 3: Product Select & Item Info */}
          <div className="p-3 bg-sky-50/50 rounded-lg border border-sky-100 space-y-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">도매 품목 선택</label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md font-medium text-slate-800 focus:ring-1 focus:ring-sky-500"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.categoryLabel}] {p.name} ({p.spec}) - 기준단가: {p.standardPrice.toLocaleString()}원 / 대량: {p.bulkPrice.toLocaleString()}원
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">품목 규격</label>
                <input
                  type="text"
                  value={itemSpec}
                  onChange={(e) => setItemSpec(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">주문 수량 ({unit})</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono font-bold text-slate-900"
                />
                {quantity >= 100 && (
                  <p className="text-[10px] text-sky-600 font-semibold mt-0.5">
                    * 100포 이상 대량 특판가 자동 적용됨
                  </p>
                )}
              </div>
              <div>
                <label className="block text-slate-600 mb-1">판매 단가 (원)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Tax & Total Calculation */}
            <div className="pt-2 border-t border-sky-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">과세 구분:</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="taxType"
                    checked={taxType === 'tax_free'}
                    onChange={() => setTaxType('tax_free')}
                  />
                  <span>면세 (비가공 천일염)</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer ml-2">
                  <input
                    type="radio"
                    name="taxType"
                    checked={taxType === 'taxable'}
                    onChange={() => setTaxType('taxable')}
                  />
                  <span>과세 10% (가공/꽃소금/죽염)</span>
                </label>
              </div>

              <div className="text-right font-mono tabular-nums">
                <div className="text-xs text-slate-600">
                  공급가: {supplyPrice.toLocaleString()}원 + 부가세: {taxAmount.toLocaleString()}원
                </div>
                <div className="text-sm font-bold text-sky-900">
                  합계: {totalAmount.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Payment & Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">결제 상태</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              >
                <option value="paid">입금 완료</option>
                <option value="unpaid">외상 / 미수금</option>
                <option value="bill">전자어음 결제</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">결제 방식</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              >
                <option value="bank_transfer">제주은행 통장입금</option>
                <option value="cash">현금 결제</option>
                <option value="card">신용/체크카드</option>
                <option value="promissory_note">약속어음</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">배송 / 출고 방식</label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              >
                <option value="jeju_direct">제주도내 직배송 (1톤 탑차)</option>
                <option value="freight_truck">도내 화물 용달 (5톤/11톤)</option>
                <option value="port_logistics">제주항 삼다물류 선적</option>
                <option value="pickup">창고 직접 방문 수령</option>
              </select>
            </div>
          </div>

          {/* Delivery Address & Memo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">배송지 주소 (선택)</label>
              <input
                type="text"
                placeholder="예: 서귀포시 안덕면 신화역사로..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">특이사항 및 메모</label>
              <input
                type="text"
                placeholder="예: 익월 10일 일괄결제, 지게차 하차 필요 등"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md"
              />
            </div>
          </div>

          {/* Auto record in cashflow */}
          {paymentStatus === 'paid' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-emerald-900 font-medium">
                <input
                  type="checkbox"
                  checked={autoRecordCashflow}
                  onChange={(e) => setAutoRecordCashflow(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>이 판매대금({totalAmount.toLocaleString()}원)을 수입 장부에 자동으로 입금 등록하기</span>
              </label>
            </div>
          )}

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
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-md shadow-xs transition-colors"
            >
              판매 전표 발행 및 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
