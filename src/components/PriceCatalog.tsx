import React from 'react';
import { CheckCircle2, ChevronRight, Package, ShoppingCart } from 'lucide-react';
import { ProductItem } from '../types';

interface PriceCatalogProps {
  products: ProductItem[];
  onSelectProductForSale: (product: ProductItem) => void;
}

export const PriceCatalog: React.FC<PriceCatalogProps> = ({ products, onSelectProductForSale }) => {
  const formatNumber = (num: number) => new Intl.NumberFormat('ko-KR').format(num);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">제주소금도매상사 표준 도매 공급 단가표</h2>
          <p className="text-xs text-slate-500 mt-1">
            식자재 유통업체, 수산물 가공공장, 대형 식당 및 김치공장 공급용 기준 단가입니다. 대량 주문(100포 이상) 시 특별 할인가가 적용됩니다.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-md border border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>천일염(면세)</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>가공/꽃소금(과세 10%)</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>제주항 저온창고 상시 출고 가능</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((item) => {
          const marginRate = (((item.standardPrice - item.costPrice) / item.standardPrice) * 100).toFixed(1);

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: code & tax status */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-mono text-slate-400">{item.code}</span>
                  <div className="flex items-center gap-1.5">
                    <span>{item.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className={item.isTaxFree ? 'text-emerald-700 font-medium' : 'text-sky-700 font-medium'}>
                      {item.isTaxFree ? '면세 소금' : '과세 소금'}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {item.name}
                </h3>
                <div className="text-xs text-sky-700 font-medium mt-0.5">
                  규격: {item.spec}
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Pricing Grid */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">표준 도매가 (소량):</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {formatNumber(item.standardPrice)}원 <span className="text-[11px] font-normal text-slate-400">/{item.unit}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-sky-50/70 p-1.5 rounded">
                    <span className="text-sky-900 font-medium">대량 특판 (100+):</span>
                    <span className="font-mono tabular-nums font-bold text-sky-700">
                      {formatNumber(item.bulkPrice)}원 <span className="text-[11px] font-normal text-sky-600">/{item.unit}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>매입 원가: {formatNumber(item.costPrice)}원</span>
                    <span>마진율: {marginRate}%</span>
                  </div>
                </div>
              </div>

              {/* Bottom: Stock & Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-500">창고 재고: </span>
                  <span className="font-mono tabular-nums font-bold text-slate-800">
                    {formatNumber(item.stockQuantity)}
                  </span>
                  <span className="text-slate-400"> {item.unit}</span>
                </div>

                <button
                  onClick={() => onSelectProductForSale(item)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>판매 등록</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
