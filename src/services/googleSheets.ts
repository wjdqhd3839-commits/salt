import { CashflowRecord, GoogleSheetConfig, SaleRecord } from '../types';

const STORAGE_KEYS = {
  CONFIG: 'jeju_salt_sheet_config_v3',
  SALES: 'jeju_salt_sales_data_v4',
  CASHFLOW: 'jeju_salt_cashflow_data_v4',
};

export const getStoredConfig = (): GoogleSheetConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load Google Sheet config', e);
  }
  return {
    webAppUrl: '',
    lastSyncedAt: null,
    isConnected: false,
    autoSync: true,
    autoSyncInterval: 15, // 15 seconds real-time polling
    sheetTitle: '',
    syncStatus: 'idle',
    errorMessage: null,
  };
};

export const saveStoredConfig = (config: GoogleSheetConfig) => {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
};

export const getStoredSales = (fallback: SaleRecord[]): SaleRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load local sales', e);
  }
  return fallback;
};

export const saveStoredSales = (sales: SaleRecord[]) => {
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
};

export const getStoredCashflow = (fallback: CashflowRecord[]): CashflowRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CASHFLOW);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load local cashflow', e);
  }
  return fallback;
};

export const saveStoredCashflow = (cashflow: CashflowRecord[]) => {
  localStorage.setItem(STORAGE_KEYS.CASHFLOW, JSON.stringify(cashflow));
};

/**
 * Fetch data from Google Apps Script Web App (GET)
 */
export const fetchGoogleSheetData = async (
  webAppUrl: string
): Promise<{ sales?: SaleRecord[]; cashflow?: CashflowRecord[]; sheetTitle?: string; error?: string }> => {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return { error: '유효한 Google Apps Script 웹앱 URL을 입력해주세요.' };
  }

  try {
    const cleanUrl = webAppUrl.trim();
    const targetUrl = new URL(cleanUrl);
    targetUrl.searchParams.set('action', 'getAll');
    targetUrl.searchParams.set('t', Date.now().toString());

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`구글 서버 응답 오류 (HTTP ${response.status})`);
    }

    const json = await response.json();
    if (json.status !== 'success' || !json.data) {
      throw new Error(json.message || '데이터 구조가 올바르지 않습니다.');
    }

    const rawSales = json.data.sales || [];
    const rawCashflow = json.data.cashflow || [];
    const sheetTitle = json.data.sheetTitle || '제주소금도매상사_통합관리시스템';

    // Flexible column mapping helper
    const getVal = (row: any, ...keys: string[]) => {
      for (const k of keys) {
        if (row[k] !== undefined && row[k] !== null && row[k] !== '') {
          return row[k];
        }
      }
      return '';
    };

    const mappedSales: SaleRecord[] = rawSales
      .filter((r: any) => getVal(r, '전표ID', 'id', '판매일자', 'date', '거래처명', 'clientName'))
      .map((r: any, idx: number) => {
        const quantity = Number(getVal(r, '수량', 'quantity') || 1);
        const unitPrice = Number(getVal(r, '단가(원)', '단가', 'unitPrice') || 0);
        const supplyPrice = Number(getVal(r, '공급가액(원)', '공급가액', 'supplyPrice') || quantity * unitPrice);
        const taxAmount = Number(getVal(r, '부가세(원)', '부가세', 'taxAmount') || 0);
        const totalAmount = Number(getVal(r, '합계금액(원)', '합계금액', 'totalAmount') || supplyPrice + taxAmount);

        const statusRaw = String(getVal(r, '결제상태', 'paymentStatus')).trim();
        let paymentStatus: SaleRecord['paymentStatus'] = 'paid';
        if (statusRaw.includes('외상') || statusRaw.includes('미수') || statusRaw === 'unpaid') {
          paymentStatus = 'unpaid';
        } else if (statusRaw.includes('어음') || statusRaw === 'bill') {
          paymentStatus = 'bill';
        }

        const deliveryRaw = String(getVal(r, '배송방식', 'deliveryMethod')).trim();
        let deliveryMethod: SaleRecord['deliveryMethod'] = 'jeju_direct';
        if (deliveryRaw.includes('화물') || deliveryRaw.includes('용달') || deliveryRaw === 'freight_truck') {
          deliveryMethod = 'freight_truck';
        } else if (deliveryRaw.includes('항') || deliveryRaw.includes('선적') || deliveryRaw === 'port_logistics') {
          deliveryMethod = 'port_logistics';
        } else if (deliveryRaw.includes('방문') || deliveryRaw.includes('수령') || deliveryRaw === 'pickup') {
          deliveryMethod = 'pickup';
        }

        const rawSaleDate = String(getVal(r, '판매일자', 'date') || new Date().toISOString().slice(0, 10));
        const cleanSaleDate = rawSaleDate.includes('T')
          ? rawSaleDate.split('T')[0]
          : rawSaleDate.length >= 10
          ? rawSaleDate.slice(0, 10)
          : rawSaleDate;

        return {
          id: String(getVal(r, '전표ID', 'id') || `sale-gs-${Date.now()}-${idx}`),
          date: cleanSaleDate,
          clientName: String(getVal(r, '거래처명', 'clientName') || '거래처'),
          clientContact: String(getVal(r, '연락처', 'clientContact')),
          itemName: String(getVal(r, '품목명', 'itemName') || '천일염'),
          itemSpec: String(getVal(r, '규격', 'itemSpec') || '20kg 포대'),
          quantity,
          unit: String(getVal(r, '단위', 'unit') || '포'),
          unitPrice,
          supplyPrice,
          taxType: taxAmount > 0 ? 'taxable' : 'tax_free',
          taxAmount,
          totalAmount,
          paymentStatus,
          paymentMethod: 'bank_transfer',
          deliveryMethod,
          memo: String(getVal(r, '비고/적요', '비고', 'memo')),
          createdAt: String(getVal(r, '기록시각', 'createdAt') || new Date().toISOString()),
        };
      });

    const mappedCashflow: CashflowRecord[] = rawCashflow
      .filter((r: any) => getVal(r, '장부ID', 'id', '일자', 'date', '항목/계정과목', 'category'))
      .map((r: any, idx: number) => {
        const typeRaw = String(getVal(r, '구분', 'type')).trim();
        const type = typeRaw.includes('지출') || typeRaw === 'expense' ? 'expense' : 'income';
        const amount = Number(getVal(r, '금액(원)', '금액', 'amount') || 0);

        const rawCfDate = String(getVal(r, '일자', 'date') || new Date().toISOString().slice(0, 10));
        const cleanCfDate = rawCfDate.includes('T')
          ? rawCfDate.split('T')[0]
          : rawCfDate.length >= 10
          ? rawCfDate.slice(0, 10)
          : rawCfDate;

        return {
          id: String(getVal(r, '장부ID', 'id') || `cf-gs-${Date.now()}-${idx}`),
          date: cleanCfDate,
          type,
          category: String(getVal(r, '항목/계정과목', '계정과목', 'category') || '소금 판매 대금'),
          amount,
          clientOrVendor: String(getVal(r, '거래처/지급처', 'clientOrVendor') || '-'),
          paymentMethod: String(getVal(r, '결제수단', 'paymentMethod') || '통장입금'),
          memo: String(getVal(r, '적요/비고', '적요', 'memo')),
          createdAt: String(getVal(r, '기록시각', 'createdAt') || new Date().toISOString()),
        };
      });

    return {
      sales: mappedSales,
      cashflow: mappedCashflow,
      sheetTitle,
    };
  } catch (error: any) {
    console.error('Error fetching from Apps Script:', error);
    return {
      error: `시트 데이터 연동 실패: ${error.message || '네트워크 오류'}. 배포 시 '액세스 권한: 모든 사용자(Anyone)'로 설정되었는지 확인해주세요.`,
    };
  }
};

/**
 * Send record to Google Apps Script Web App (POST with GET fallback)
 */
export const postToGoogleSheet = async (
  webAppUrl: string,
  payload: {
    action: 'saveSale' | 'saveCashflow' | 'syncAll' | 'syncSalesOnly' | 'syncCashflowOnly' | 'setupSheet';
    data?: any;
    sales?: SaleRecord[];
    cashflow?: CashflowRecord[];
  }
): Promise<{ success: boolean; message?: string }> => {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return { success: false, message: 'Google Apps Script 웹앱 URL이 등록되지 않았습니다.' };
  }

  const cleanUrl = webAppUrl.trim();

  // Try 1: Standard POST with text/plain (bypasses CORS preflight)
  try {
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        if (json.status === 'success') {
          return { success: true, message: json.message || '구글 시트 동기화 완료' };
        }
      } catch {
        return { success: true, message: '구글 시트로 성공적으로 기록되었습니다.' };
      }
    }
  } catch (postErr) {
    console.warn('POST failed, attempting fallback to GET URL parameter mode...', postErr);
  }

  // Try 2: Fallback to GET URL params for single records to bypass browser CORS blocking
  if (payload.action === 'saveSale' || payload.action === 'saveCashflow') {
    try {
      const fallbackUrl = new URL(cleanUrl);
      fallbackUrl.searchParams.set('action', payload.action);
      fallbackUrl.searchParams.set('data', encodeURIComponent(JSON.stringify(payload.data)));
      fallbackUrl.searchParams.set('t', Date.now().toString());

      const res = await fetch(fallbackUrl.toString(), { method: 'GET' });
      if (res.ok) {
        return { success: true, message: '안전 모드로 구글 시트에 실시간 기록되었습니다.' };
      }
    } catch (fallbackErr: any) {
      console.error('Fallback GET also failed', fallbackErr);
    }
  }

  return {
    success: false,
    message: '구글 시트 전송 실패. 배포 시 [액세스 권한: 모든 사용자(Anyone)] 설정을 꼭 확인해주세요.',
  };
};
