import React from 'react';
import { Download, FileText, Printer, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import { SaleRecord } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleRecord | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, sale }) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatNumber = (num: number) => new Intl.NumberFormat('ko-KR').format(num);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl my-8 overflow-hidden border border-slate-300">
        {/* Modal Topbar (hidden during print) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-bold">거래명세표 (공급받는자 보관용 / 공급자 보관용)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white rounded transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>명세서 인쇄 (Ctrl+P)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div className="p-8 text-slate-900 font-sans print:p-0">
          {/* Invoice Title */}
          <div className="text-center pb-4 border-b-2 border-slate-900 relative">
            <h1 className="text-2xl font-black tracking-widest text-slate-900">거 래 명 세 표</h1>
            <p className="text-xs text-slate-500 mt-1">공급하는 자와 공급받는 자의 거래 합의 명세서</p>
            <div className="absolute right-0 bottom-2 text-xs font-mono text-slate-600">
              전표번호: {sale.id}
            </div>
          </div>

          {/* Supplier & Receiver Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
            {/* 공급자 정보 */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50/50">
              <div className="font-bold text-sky-900 mb-2 border-b pb-1">공급하는 자 (발행처)</div>
              <div className="grid grid-cols-3 gap-1.5 leading-relaxed">
                <span className="text-slate-500 font-medium">등록번호</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">{COMPANY_INFO.bizNumber}</span>

                <span className="text-slate-500 font-medium">상호(법인명)</span>
                <span className="font-bold text-slate-900">{COMPANY_INFO.name}</span>

                <span className="text-slate-500 font-medium">대표자성명</span>
                <span className="font-bold text-slate-900">{COMPANY_INFO.ceo} (인)</span>

                <span className="text-slate-500 font-medium">사업장주소</span>
                <span className="col-span-2 text-slate-700">{COMPANY_INFO.address}</span>

                <span className="text-slate-500 font-medium">업태 / 종목</span>
                <span className="col-span-2 text-slate-700">{COMPANY_INFO.businessType} / {COMPANY_INFO.businessItem}</span>

                <span className="text-slate-500 font-medium">대표전화</span>
                <span className="col-span-2 font-mono text-slate-700">{COMPANY_INFO.phone} / {COMPANY_INFO.mobile}</span>
              </div>
            </div>

            {/* 공급받는 자 정보 */}
            <div className="border border-slate-300 rounded p-3 bg-slate-50/50">
              <div className="font-bold text-slate-900 mb-2 border-b pb-1">공급받는 자 (귀하)</div>
              <div className="grid grid-cols-3 gap-1.5 leading-relaxed">
                <span className="text-slate-500 font-medium">등록번호</span>
                <span className="col-span-2 font-mono font-bold text-slate-900">
                  {sale.clientBizNumber || '일반 영세/개인 거래'}
                </span>

                <span className="text-slate-500 font-medium">상호 / 상호명</span>
                <span className="col-span-2 font-bold text-slate-900 text-sm">{sale.clientName}</span>

                <span className="text-slate-500 font-medium">연락처</span>
                <span className="col-span-2 font-mono text-slate-800">{sale.clientContact}</span>

                <span className="text-slate-500 font-medium">배송지</span>
                <span className="col-span-2 text-slate-700">{sale.address || '제주도내 지정 장소'}</span>

                <span className="text-slate-500 font-medium">거래일자</span>
                <span className="col-span-2 font-mono font-semibold text-slate-900">{sale.date}</span>

                <span className="text-slate-500 font-medium">배송형태</span>
                <span className="col-span-2 text-slate-700">
                  {sale.deliveryMethod === 'jeju_direct'
                    ? '제주도내 직배송'
                    : sale.deliveryMethod === 'freight_truck'
                    ? '도내 화물 용달'
                    : sale.deliveryMethod === 'port_logistics'
                    ? '제주항 물류 선적'
                    : '창고 직접 수령'}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="my-4 border border-slate-300">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                  <th className="p-2 border-r border-slate-300 text-center w-12">순번</th>
                  <th className="p-2 border-r border-slate-300">품목 및 상품명</th>
                  <th className="p-2 border-r border-slate-300">규격</th>
                  <th className="p-2 border-r border-slate-300 text-right w-16">수량</th>
                  <th className="p-2 border-r border-slate-300 text-center w-12">단위</th>
                  <th className="p-2 border-r border-slate-300 text-right w-24">단가</th>
                  <th className="p-2 border-r border-slate-300 text-right w-28">공급가액</th>
                  <th className="p-2 border-r border-slate-300 text-right w-20">세액</th>
                  <th className="p-2 text-center w-20">비고</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 border-r border-slate-200 text-center font-mono">1</td>
                  <td className="p-2 border-r border-slate-200 font-semibold">{sale.itemName}</td>
                  <td className="p-2 border-r border-slate-200 text-slate-600">{sale.itemSpec}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-mono font-bold">{formatNumber(sale.quantity)}</td>
                  <td className="p-2 border-r border-slate-200 text-center">{sale.unit}</td>
                  <td className="p-2 border-r border-slate-200 text-right font-mono">{formatNumber(sale.unitPrice)}원</td>
                  <td className="p-2 border-r border-slate-200 text-right font-mono font-semibold">{formatNumber(sale.supplyPrice)}원</td>
                  <td className="p-2 border-r border-slate-200 text-right font-mono text-slate-600">
                    {sale.taxAmount > 0 ? `${formatNumber(sale.taxAmount)}원` : '면세'}
                  </td>
                  <td className="p-2 text-center text-[11px] text-slate-500">{sale.memo || '-'}</td>
                </tr>
                {/* Empty rows to complete form layout */}
                {[2, 3, 4].map((i) => (
                  <tr key={i} className="border-b border-slate-100 text-slate-300">
                    <td className="p-2 border-r border-slate-100 text-center font-mono">{i}</td>
                    <td className="p-2 border-r border-slate-100"></td>
                    <td className="p-2 border-r border-slate-100"></td>
                    <td className="p-2 border-r border-slate-100"></td>
                    <td className="p-2 border-r border-slate-100"></td>
                    <td className="p-2 border-r border-slate-100"></td>
                    <td className="p-2 border-r border-slate-100"></td>
                    <td className="p-2 border-r border-slate-100"></td>
                    <td className="p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Payment Summary */}
          <div className="border-2 border-slate-900 p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <div className="text-slate-600 mb-1">
                입금 계좌안내: <span className="font-bold text-slate-900">{COMPANY_INFO.bankAccount}</span>
              </div>
              <div className="text-slate-500">
                결제상태: <span className="font-semibold text-slate-800">
                  {sale.paymentStatus === 'paid' ? '입금완료' : '외상 / 미수 정산대기'}
                </span> ({sale.paymentMethod})
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">
                공급가액 {formatNumber(sale.supplyPrice)}원 + 세액 {formatNumber(sale.taxAmount)}원
              </div>
              <div className="text-lg font-bold font-mono text-sky-900 mt-0.5">
                총 합계금액: {formatNumber(sale.totalAmount)}원
              </div>
            </div>
          </div>

          {/* Stamp / Confirmation */}
          <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
            <div>위 물품을 정히 공급(인수)하였음을 확인합니다.</div>
            <div className="flex items-center gap-6">
              <span>인수자: ________________ (서명)</span>
              <span>납품자: 제주소금도매상사 (인)</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom buttons */}
        <div className="no-print px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
          >
            닫기
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>인쇄하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
