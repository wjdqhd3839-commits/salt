import { CompanyInfo, ProductItem, SaleRecord, CashflowRecord } from '../types';

export const COMPANY_INFO: CompanyInfo = {
  name: '제주소금도매상사',
  bizNumber: '616-99-44675',
  ceo: '대표',
  address: '제주특별자치도 진남로 2길 33-1 제주소금도매상사',
  phone: '010-3698-8222',
  mobile: '010-3698-8222',
  email: 'jejusalt.wholesale@gmail.com',
  bankAccount: '제주은행 (예금주: 제주소금도매상사)',
  businessType: '도매 및 소매업',
  businessItem: '천일염, 식용소금, 수산가공용 소금, 절임염',
};

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-01',
    code: 'JS-101',
    name: '제주 청정 갯벌 천일염',
    spec: '20kg 포대 (PP마대)',
    category: 'natural_salt',
    categoryLabel: '천일염',
    costPrice: 16000,
    standardPrice: 22000,
    bulkPrice: 20000,
    stockQuantity: 420,
    unit: '포',
    isTaxFree: true,
    description: '자연 일조와 해풍으로 건조한 미네랄 풍부 천일염, 간수 1년 자연탈수',
  },
  {
    id: 'prod-02',
    code: 'JS-102',
    name: '간수 3년 숙성 탈수 천일염 (명품)',
    spec: '20kg 포대 (이중방수)',
    category: 'natural_salt',
    categoryLabel: '천일염',
    costPrice: 24000,
    standardPrice: 32000,
    bulkPrice: 29000,
    stockQuantity: 280,
    unit: '포',
    isTaxFree: true,
    description: '쓴맛을 내는 간수를 3년간 완전히 제거하여 감칠맛이 도는 최고급 소금',
  },
  {
    id: 'prod-03',
    code: 'JS-201',
    name: '제주 용암해수 꽃소금 (재제염)',
    spec: '10kg 박스 (1kg x 10봉)',
    category: 'flake_salt',
    categoryLabel: '꽃소금',
    costPrice: 19000,
    standardPrice: 26000,
    bulkPrice: 24000,
    stockQuantity: 195,
    unit: '박스',
    isTaxFree: false,
    description: '제주 용암해수로 끓여 불순물을 완전히 제거한 고순도 조리용 꽃소금',
  },
  {
    id: 'prod-04',
    code: 'JS-202',
    name: '제주 용암해수 꽃소금 업소용',
    spec: '20kg 대용량 포대',
    category: 'flake_salt',
    categoryLabel: '꽃소금',
    costPrice: 27000,
    standardPrice: 36000,
    bulkPrice: 33000,
    stockQuantity: 160,
    unit: '포',
    isTaxFree: false,
    description: '식당 및 식품가공 공장용 맑고 고운 입자의 대용량 조리염',
  },
  {
    id: 'prod-05',
    code: 'JS-301',
    name: '제주 전통 3회 구운 대나무 죽염',
    spec: '5kg 항아리지함 (1kg x 5)',
    category: 'roasted_salt',
    categoryLabel: '구운소금/죽염',
    costPrice: 48000,
    standardPrice: 65000,
    bulkPrice: 59000,
    stockQuantity: 75,
    unit: '세트',
    isTaxFree: false,
    description: '제주 왕대나무에 천일염을 다져 넣고 황토로 가마소성한 알칼리성 건강염',
  },
  {
    id: 'prod-06',
    code: 'JS-401',
    name: '김장용 굵은 소금 (특품 알소금)',
    spec: '20kg 포대 (식품용 PP)',
    category: 'kimchi_salt',
    categoryLabel: '절임용 굵은소금',
    costPrice: 15000,
    standardPrice: 21000,
    bulkPrice: 19000,
    stockQuantity: 580,
    unit: '포',
    isTaxFree: true,
    description: '배추가 쉽게 무르지 않고 아삭함이 오래 유지되는 김장 배추 절임 전용 굵은염',
  },
  {
    id: 'prod-07',
    code: 'JS-501',
    name: '수산물 가공·염장용 정제 원염',
    spec: '1,000kg 톤백 (Bulk)',
    category: 'industrial_salt',
    categoryLabel: '수산물 가공용',
    costPrice: 380000,
    standardPrice: 490000,
    bulkPrice: 460000,
    stockQuantity: 18,
    unit: '톤백',
    isTaxFree: true,
    description: '성산·한림 고등어/갈치 염장 및 젓갈 가공공장 전용 대량 벌크 원염',
  },
  {
    id: 'prod-08',
    code: 'JS-502',
    name: '제주 식당 조리용 정제소금 99.5%',
    spec: '25kg 마대',
    category: 'industrial_salt',
    categoryLabel: '업소용 정제염',
    costPrice: 13500,
    standardPrice: 18500,
    bulkPrice: 17000,
    stockQuantity: 340,
    unit: '포',
    isTaxFree: false,
    description: '고기국수집, 해장국집, 구이전문점 테이블 및 조리용 표준 백색 정제염',
  },
];

// 제주소금도매상사 공식 판매 실적 및 출고 대장 데이터
export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'sale-202610-001',
    date: '2026-10-01',
    clientName: '조천 절임배추 가공공장',
    clientContact: '064-783-9120',
    clientBizNumber: '616-89-22341',
    address: '제주시 조천읍 신북로 210',
    itemName: '김장용 굵은 소금 (특품 알소금)',
    itemSpec: '20kg 포대 (식품용 PP)',
    quantity: 200,
    unit: '포',
    unitPrice: 19000,
    supplyPrice: 3800000,
    taxType: 'tax_free',
    taxAmount: 0,
    totalAmount: 3800000,
    paymentStatus: 'unpaid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'freight_truck',
    memo: '가을 조천 배추 절임용 1차 대량 출고 (화물 5톤 직배)',
    createdAt: '2026-10-01T08:30:00Z',
  },
  {
    id: 'sale-202609-001',
    date: '2026-09-30',
    clientName: '한림수산가공 (주)',
    clientContact: '064-796-4120',
    clientBizNumber: '616-86-12345',
    address: '제주시 한림읍 한림해안로 142',
    itemName: '수산물 가공·염장용 정제 원염',
    itemSpec: '1,000kg 톤백 (Bulk)',
    quantity: 4,
    unit: '톤백',
    unitPrice: 470000,
    supplyPrice: 1880000,
    taxType: 'tax_free',
    taxAmount: 0,
    totalAmount: 1880000,
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'freight_truck',
    memo: '고등어 가공 시즌 1차 입고분 (화물 5톤차 직배)',
    createdAt: '2026-09-30T09:30:00Z',
  },
  {
    id: 'sale-202609-002',
    date: '2026-09-29',
    clientName: '제주시 농협 하나로마트 물류센터',
    clientContact: '064-720-5500',
    clientBizNumber: '616-82-01990',
    address: '제주시 무근성길 45',
    itemName: '제주 용암해수 꽃소금 (재제염)',
    itemSpec: '10kg 박스 (1kg x 10봉)',
    quantity: 80,
    unit: '박스',
    unitPrice: 24000,
    supplyPrice: 1920000,
    taxType: 'taxable',
    taxAmount: 192000,
    totalAmount: 2112000,
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'jeju_direct',
    memo: '도내 마트 지점 납품용 대량 입고 (부가세 세금계산서 발행)',
    createdAt: '2026-09-29T10:15:00Z',
  },
  {
    id: 'sale-202609-003',
    date: '2026-09-28',
    clientName: '서귀포 흑돼지 식자재유통',
    clientContact: '010-4491-8822',
    clientBizNumber: '616-12-88291',
    address: '서귀포시 일주동로 8520',
    itemName: '간수 3년 숙성 탈수 천일염 (명품)',
    itemSpec: '20kg 포대 (이중방수)',
    quantity: 50,
    unit: '포',
    unitPrice: 29500,
    supplyPrice: 1475000,
    taxType: 'tax_free',
    taxAmount: 0,
    totalAmount: 1475000,
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'jeju_direct',
    memo: '중문 일대 흑돼지 구이전문점 납품용 직배송',
    createdAt: '2026-09-28T11:15:00Z',
  },
  {
    id: 'sale-202609-004',
    date: '2026-09-27',
    clientName: '표선 김치영농조합법인',
    clientContact: '064-787-3390',
    clientBizNumber: '616-82-45910',
    address: '서귀포시 표선면 번영로 2100',
    itemName: '김장용 굵은 소금 (특품 알소금)',
    itemSpec: '20kg 포대 (식품용 PP)',
    quantity: 120,
    unit: '포',
    unitPrice: 19000,
    supplyPrice: 2280000,
    taxType: 'tax_free',
    taxAmount: 0,
    totalAmount: 2280000,
    paymentStatus: 'unpaid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'freight_truck',
    memo: '가을 알타리/갓김치 절임용, 10월 10일 월말 정산 예정',
    createdAt: '2026-09-27T14:20:00Z',
  },
  {
    id: 'sale-202609-005',
    date: '2026-09-26',
    clientName: '제주항 건어물도매 유통센터',
    clientContact: '064-722-9018',
    clientBizNumber: '616-09-31201',
    address: '제주시 임항로 92',
    itemName: '제주 용암해수 꽃소금 (재제염)',
    itemSpec: '10kg 박스 (1kg x 10봉)',
    quantity: 35,
    unit: '박스',
    unitPrice: 24500,
    supplyPrice: 857500,
    taxType: 'taxable',
    taxAmount: 85750,
    totalAmount: 943250,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    deliveryMethod: 'pickup',
    memo: '창고 직접 방문 차량 상차 완료 (법인카드 승인)',
    createdAt: '2026-09-26T16:00:00Z',
  },
  {
    id: 'sale-202609-006',
    date: '2026-09-25',
    clientName: '제주 고기국수 본점 및 가맹사업본부',
    clientContact: '010-8921-3910',
    clientBizNumber: '616-24-91029',
    address: '제주시 삼성로 65',
    itemName: '제주 청정 갯벌 천일염',
    itemSpec: '20kg 포대 (PP마대)',
    quantity: 60,
    unit: '포',
    unitPrice: 20500,
    supplyPrice: 1230000,
    taxType: 'tax_free',
    taxAmount: 0,
    totalAmount: 1230000,
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'jeju_direct',
    memo: '육수 우림 및 고기 삶기용 표준염 60포 당일 직배',
    createdAt: '2026-09-25T10:00:00Z',
  },
  {
    id: 'sale-202609-007',
    date: '2026-09-24',
    clientName: '성산포 은갈치 건조 가공장',
    clientContact: '064-784-5501',
    clientBizNumber: '616-83-77211',
    address: '서귀포시 성산읍 성산등용로 89',
    itemName: '간수 3년 숙성 탈수 천일염 (명품)',
    itemSpec: '20kg 포대 (이중방수)',
    quantity: 80,
    unit: '포',
    unitPrice: 29500,
    supplyPrice: 2360000,
    taxType: 'tax_free',
    taxAmount: 0,
    totalAmount: 2360000,
    paymentStatus: 'unpaid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'freight_truck',
    memo: '성산포 위판 갈치 건조용, 익월 15일 결제 예정',
    createdAt: '2026-09-24T13:45:00Z',
  },
  {
    id: 'sale-202609-008',
    date: '2026-09-22',
    clientName: '제주 명품 특산품 판매관',
    clientContact: '064-748-0099',
    clientBizNumber: '616-15-44280',
    address: '제주시 연동 12길 18',
    itemName: '제주 전통 3회 구운 대나무 죽염',
    itemSpec: '5kg 항아리지함 (1kg x 5)',
    quantity: 25,
    unit: '세트',
    unitPrice: 60000,
    supplyPrice: 1500000,
    taxType: 'taxable',
    taxAmount: 150000,
    totalAmount: 1650000,
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'jeju_direct',
    memo: '가을 관광 시즌 공항 및 특산품 매대 진열용 납품',
    createdAt: '2026-09-22T15:10:00Z',
  },
  {
    id: 'sale-202609-009',
    date: '2026-09-20',
    clientName: '모슬포 대방어 축제 위판조합',
    clientContact: '064-794-2201',
    clientBizNumber: '616-88-99012',
    address: '서귀포시 대정읍 하모항구로 56',
    itemName: '제주 청정 갯벌 천일염',
    itemSpec: '20kg 포대 (PP마대)',
    quantity: 150,
    unit: '포',
    unitPrice: 20000,
    supplyPrice: 3000000,
    taxType: 'tax_free',
    taxAmount: 0,
    totalAmount: 3000000,
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    deliveryMethod: 'freight_truck',
    memo: '방어 활어 수조 조절 및 축제 사전 준비 대량 공급',
    createdAt: '2026-09-20T08:50:00Z',
  },
];

// 제주소금도매상사 공식 수입·지출 회계 장부 데이터 (구글 시트 연동 전용)
export const INITIAL_CASHFLOW: CashflowRecord[] = [
  {
    id: 'cf-202610-001',
    date: '2026-10-01',
    type: 'income',
    category: '소금 판매 대금',
    amount: 2112000,
    clientOrVendor: '제주시 농협 하나로마트 물류센터',
    paymentMethod: '통장입금(제주은행)',
    memo: '꽃소금 80박스 공급대금 입금 완료',
    createdAt: '2026-10-01T11:00:00Z',
  },
  {
    id: 'cf-202609-001',
    date: '2026-09-30',
    type: 'income',
    category: '소금 판매 대금',
    amount: 1880000,
    clientOrVendor: '한림수산가공 (주)',
    paymentMethod: '통장입금(제주은행)',
    memo: '정제 원염 4톤백 공급 대금 입금 확인',
    createdAt: '2026-09-30T10:05:00Z',
  },
  {
    id: 'cf-202609-002',
    date: '2026-09-29',
    type: 'expense',
    category: '해상 화물 선박 운임',
    amount: 1450000,
    clientOrVendor: '제주삼다해운 (주)',
    paymentMethod: '세금계산서 계좌이체',
    memo: '목포항 -> 제주항 천일염 20톤 선박 화물 운송비',
    createdAt: '2026-09-29T16:00:00Z',
  },
  {
    id: 'cf-202609-003',
    date: '2026-09-28',
    type: 'income',
    category: '소금 판매 대금',
    amount: 1475000,
    clientOrVendor: '서귀포 흑돼지 식자재유통',
    paymentMethod: '통장입금(제주은행)',
    memo: '숙성 천일염 50포 결제 대금 완납',
    createdAt: '2026-09-28T14:30:00Z',
  },
  {
    id: 'cf-202609-004',
    date: '2026-09-27',
    type: 'expense',
    category: '포장 자재비 (마대/비닐)',
    amount: 880000,
    clientOrVendor: '성진화학패키징',
    paymentMethod: '통장입금',
    memo: '20kg 친환경 PP코팅 마대 2,000장 제작 및 인쇄 납품',
    createdAt: '2026-09-27T17:20:00Z',
  },
  {
    id: 'cf-202609-005',
    date: '2026-09-26',
    type: 'income',
    category: '소금 판매 대금',
    amount: 943250,
    clientOrVendor: '제주항 건어물도매 유통센터',
    paymentMethod: '법인카드 승인',
    memo: '꽃소금 10kg 35박스 결제 (부가세 85,750원 포함)',
    createdAt: '2026-09-26T16:05:00Z',
  },
  {
    id: 'cf-202609-006',
    date: '2026-09-25',
    type: 'expense',
    category: '원염 대량 매입 (염전)',
    amount: 6400000,
    clientOrVendor: '비금도 청정염전 영농회',
    paymentMethod: '전자세금계산서 이체',
    memo: '가을 햇천일염 20kg 포대 400포 직구매 대금 결제',
    createdAt: '2026-09-25T15:30:00Z',
  },
  {
    id: 'cf-202609-007',
    date: '2026-09-24',
    type: 'expense',
    category: '물류 장비 유류비',
    amount: 240000,
    clientOrVendor: '제주항 알뜰주유소',
    paymentMethod: '사업자카드',
    memo: '3톤 디젤 지게차 및 1톤 납품 화물차 경유 주유',
    createdAt: '2026-09-24T18:00:00Z',
  },
  {
    id: 'cf-202609-008',
    date: '2026-09-22',
    type: 'income',
    category: '외상매출금 회수',
    amount: 3500000,
    clientOrVendor: '한림수산가공 (주)',
    paymentMethod: '통장입금(제주은행)',
    memo: '8월분 외상 미수 잔액 전액 입금 정산 완료',
    createdAt: '2026-09-22T09:40:00Z',
  },
  {
    id: 'cf-202609-009',
    date: '2026-09-20',
    type: 'expense',
    category: '창고 임대 및 보관료',
    amount: 1200000,
    clientOrVendor: '제주항만공사 물류관리처',
    paymentMethod: '자동이체',
    memo: '9월 제주항 물류단지 B동 저온/건조창고 120평 임대료',
    createdAt: '2026-09-20T10:00:00Z',
  },
];

export const APPS_SCRIPT_TEMPLATE = `/**
 * =========================================================================
 * 제주소금도매상사 - 구글 앱스 스크립트(Google Apps Script) v3.0
 * 판매실적 대장과 수입·지출 회계장부 분리 동기화 및 속성 자동 구성
 * =========================================================================
 * 
 * [특징]
 * 1. 탭 분리 관리: [판매실적_출고대장]과 [수입지출_회계장부] 독립 저장 및 동기화
 * 2. 실시간 경영 대시보드 [📊 실시간요약]: 엑셀 자동 수식(=SUM, =SUMIF) 반영
 * 3. GET/POST 이중 지원으로 브라우저 CORS 차단 완벽 방지
 */

// 1. GET 요청 핸들러
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'getAll';
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  autoSetupSpreadsheet(ss);

  // GET 방식 안전 저장 모드
  if (action === 'saveSale' && e.parameter.data) {
    try {
      var saleObj = JSON.parse(decodeURIComponent(e.parameter.data));
      appendSingleSale(ss.getSheetByName("판매실적_출고대장"), saleObj);
      return createJsonResponse({ status: 'success', message: '판매 실적 전표가 시트에 기록되었습니다.' });
    } catch(err) {
      return createJsonResponse({ status: 'error', message: err.toString() });
    }
  }

  if (action === 'saveCashflow' && e.parameter.data) {
    try {
      var cfObj = JSON.parse(decodeURIComponent(e.parameter.data));
      appendSingleCashflow(ss.getSheetByName("수입지출_회계장부"), cfObj);
      return createJsonResponse({ status: 'success', message: '수입지출 장부 전표가 시트에 기록되었습니다.' });
    } catch(err) {
      return createJsonResponse({ status: 'error', message: err.toString() });
    }
  }

  // 데이터 조회
  var result = {
    sheetTitle: ss.getName(),
    spreadsheetId: ss.getId(),
    updatedAt: new Date().toISOString()
  };

  if (action === 'getAll' || action === 'getSales') {
    result.sales = getSheetData(ss.getSheetByName("판매실적_출고대장") || ss.getSheetByName("판매내역"));
  }
  if (action === 'getAll' || action === 'getCashflow') {
    result.cashflow = getSheetData(ss.getSheetByName("수입지출_회계장부") || ss.getSheetByName("수입지출내역"));
  }
  if (action === 'getAll') {
    result.products = getSheetData(ss.getSheetByName("도매품목단가표"));
  }

  return createJsonResponse({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: result
  });
}

// 2. POST 요청 핸들러
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    autoSetupSpreadsheet(ss);

    var rawData = e.postData ? e.postData.contents : null;
    if (!rawData) {
      return createJsonResponse({ status: 'error', message: '전송된 데이터가 없습니다.' });
    }

    var payload = JSON.parse(rawData);
    var action = payload.action;

    var salesSheet = ss.getSheetByName("판매실적_출고대장") || ss.getSheetByName("판매내역");
    var cashSheet = ss.getSheetByName("수입지출_회계장부") || ss.getSheetByName("수입지출내역");

    if (action === 'saveSale') {
      appendSingleSale(salesSheet, payload.data);
    } else if (action === 'saveCashflow') {
      appendSingleCashflow(cashSheet, payload.data);
    } else if (action === 'syncSalesOnly') {
      if (payload.sales) {
        clearAndAppendSales(salesSheet, payload.sales);
      }
    } else if (action === 'syncCashflowOnly') {
      if (payload.cashflow) {
        clearAndAppendCashflow(cashSheet, payload.cashflow);
      }
    } else if (action === 'syncAll') {
      if (payload.sales) {
        clearAndAppendSales(salesSheet, payload.sales);
      }
      if (payload.cashflow) {
        clearAndAppendCashflow(cashSheet, payload.cashflow);
      }
    } else if (action === 'setupSheet') {
      autoSetupSpreadsheet(ss, true);
    }

    return createJsonResponse({
      status: 'success',
      message: '구글 스프레드시트에 성공적으로 동기화되었습니다.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return createJsonResponse({
      status: 'error',
      message: error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

// 3. 스프레드시트 탭 및 수식 자동 구성 엔진
function autoSetupSpreadsheet(ss) {
  try {
    var curName = ss.getName();
    if (curName === "제목 없는 스프레드시트" || curName.indexOf("제주소금") === -1) {
      ss.rename("제주소금도매상사_통합관리시스템");
    }
  } catch(e) {}

  // 3-1. [📊 실시간요약] 탭
  var dashSheet = ss.getSheetByName("📊 실시간요약");
  if (!dashSheet) {
    dashSheet = ss.insertSheet("📊 실시간요약", 0);
    dashSheet.getRange("A1:E1").merge().setValue("제주소금도매상사 실시간 경영 요약 대시보드")
      .setBackground("#0f172a").setFontColor("#ffffff").setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");

    var summaryData = [
      ["구분", "실시간 집계 금액", "산출 수식 / 설명", "최종 갱신 시각", ""],
      ["총 소금 매출액", "=SUM(판매실적_출고대장!L2:L)", "판매실적 합계금액 열 합산", "=NOW()", ""],
      ["외상 미수금 잔액", '=SUMIF(판매실적_출고대장!M2:M, "외상미수", 판매실적_출고대장!L2:L)', "미수 상태 전표 누적액", "", ""],
      ["장부 수입 합계", '=SUMIF(수입지출_회계장부!C2:C, "수입", 수입지출_회계장부!E2:E)', "실제 통장 입금 총액", "", ""],
      ["장부 지출 합계", '=SUMIF(수입지출_회계장부!C2:C, "지출", 수입지출_회계장부!E2:E)', "원염매입/운임/비용 총액", "", ""],
      ["영업 순이익 (수입-지출)", "=B5-B6", "누적 실현 순이익", "", ""],
      ["미결제 외상 전표 수", '=COUNTIF(판매실적_출고대장!M2:M, "외상미수")', "미수금 회수 대상 거래 건수", "", ""]
    ];

    dashSheet.getRange(3, 1, summaryData.length, 5).setValues(summaryData);
    dashSheet.getRange("A3:E3").setBackground("#1e293b").setFontColor("#ffffff").setFontWeight("bold");
    dashSheet.getRange("B4:B7").setNumberFormat("#,##0\\"원\\"").setFontWeight("bold");
    dashSheet.getRange("B8").setNumberFormat("#,##0\\"건\\"");
    dashSheet.setColumnWidth(1, 200);
    dashSheet.setColumnWidth(2, 180);
    dashSheet.setColumnWidth(3, 220);
    dashSheet.setColumnWidth(4, 180);
  }

  // 3-2. [판매실적_출고대장] 탭
  var salesSheet = ss.getSheetByName("판매실적_출고대장") || ss.getSheetByName("판매내역");
  if (!salesSheet) {
    salesSheet = ss.insertSheet("판매실적_출고대장", 1);
    var salesHeaders = [
      "전표ID", "판매일자", "거래처명", "연락처", "품목명", "규격",
      "수량", "단위", "단가(원)", "공급가액(원)", "부가세(원)", "합계금액(원)",
      "결제상태", "결제방식", "배송방식", "비고/적요", "기록시각"
    ];
    salesSheet.appendRow(salesHeaders);
    salesSheet.getRange(1, 1, 1, 17)
      .setBackground("#0284c7")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    salesSheet.setFrozenRows(1);

    salesSheet.setColumnWidth(1, 140);
    salesSheet.setColumnWidth(2, 100);
    salesSheet.setColumnWidth(3, 160);
    salesSheet.setColumnWidth(4, 120);
    salesSheet.setColumnWidth(5, 180);
    salesSheet.setColumnWidth(6, 140);
    salesSheet.getRange("I2:L").setNumberFormat("#,##0");

    var rulePayment = SpreadsheetApp.newDataValidation()
      .requireValueInList(["입금완료", "외상미수", "어음결제"], true).build();
    salesSheet.getRange("M2:M").setDataValidation(rulePayment);

    var ruleDelivery = SpreadsheetApp.newDataValidation()
      .requireValueInList(["도내 직배송", "화물 용달", "제주항 물류", "창고 방문"], true).build();
    salesSheet.getRange("O2:O").setDataValidation(ruleDelivery);
  }

  // 3-3. [수입지출_회계장부] 탭
  var cashSheet = ss.getSheetByName("수입지출_회계장부") || ss.getSheetByName("수입지출내역");
  if (!cashSheet) {
    cashSheet = ss.insertSheet("수입지출_회계장부", 2);
    var cashHeaders = [
      "장부ID", "일자", "구분", "항목/계정과목", "금액(원)",
      "거래처/지급처", "결제수단", "적요/비고", "기록시각"
    ];
    cashSheet.appendRow(cashHeaders);
    cashSheet.getRange(1, 1, 1, 9)
      .setBackground("#0f766e")
      .setFontColor("#ffffff")
      .setFontWeight("bold")
      .setHorizontalAlignment("center");
    cashSheet.setFrozenRows(1);

    cashSheet.setColumnWidth(1, 140);
    cashSheet.setColumnWidth(2, 100);
    cashSheet.setColumnWidth(3, 80);
    cashSheet.setColumnWidth(4, 160);
    cashSheet.setColumnWidth(5, 120);
    cashSheet.setColumnWidth(6, 160);
    cashSheet.setColumnWidth(7, 130);
    cashSheet.setColumnWidth(8, 240);
    cashSheet.getRange("E2:E").setNumberFormat("#,##0");

    var ruleType = SpreadsheetApp.newDataValidation()
      .requireValueInList(["수입", "지출"], true).build();
    cashSheet.getRange("C2:C").setDataValidation(ruleType);
  }

  // 3-4. [도매품목단가표] 탭
  var prodSheet = ss.getSheetByName("도매품목단가표");
  if (!prodSheet) {
    prodSheet = ss.insertSheet("도매품목단가표", 3);
    var prodHeaders = ["품목코드", "품목명", "포장규격", "분류", "매입원가", "표준도매가", "대량특판가(100+)", "재고수량", "단위", "과세구분"];
    prodSheet.appendRow(prodHeaders);
    prodSheet.getRange(1, 1, 1, 10).setBackground("#334155").setFontColor("#ffffff").setFontWeight("bold");
    prodSheet.setFrozenRows(1);

    var defaultProducts = [
      ["JS-101", "제주 청정 갯벌 천일염", "20kg 포대 (PP마대)", "천일염", 16000, 22000, 20000, 420, "포", "면세"],
      ["JS-102", "간수 3년 숙성 탈수 천일염 (명품)", "20kg 포대 (이중방수)", "천일염", 24000, 32000, 29000, 280, "포", "면세"],
      ["JS-201", "제주 용암해수 꽃소금 (재제염)", "10kg 박스 (1kg x 10봉)", "꽃소금", 19000, 26000, 24000, 195, "박스", "과세"],
      ["JS-202", "제주 용암해수 꽃소금 업소용", "20kg 대용량 포대", "꽃소금", 27000, 36000, 33000, 160, "포", "과세"],
      ["JS-301", "제주 전통 3회 구운 대나무 죽염", "5kg 항아리지함 (1kg x 5)", "구운소금", 48000, 65000, 59000, 75, "세트", "과세"],
      ["JS-401", "김장용 굵은 소금 (특품 알소금)", "20kg 포대 (식품용 PP)", "절임염", 15000, 21000, 19000, 580, "포", "면세"],
      ["JS-501", "수산물 가공·염장용 정제 원염", "1,000kg 톤백 (Bulk)", "가공용", 380000, 490000, 460000, 18, "톤백", "면세"],
      ["JS-502", "제주 식당 조리용 정제소금 99.5%", "25kg 마대", "업소용", 13500, 18500, 17000, 340, "포", "과세"]
    ];
    prodSheet.getRange(2, 1, defaultProducts.length, 10).setValues(defaultProducts);
    prodSheet.getRange("E2:G").setNumberFormat("#,##0");
  }

  var defaultSheet1 = ss.getSheetByName("시트1") || ss.getSheetByName("Sheet1");
  if (defaultSheet1 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet1); } catch(e) {}
  }
}

// 4. 단일 행 추가
function appendSingleSale(sheet, s) {
  sheet.appendRow([
    s.id,
    s.date,
    s.clientName,
    s.clientContact,
    s.itemName,
    s.itemSpec,
    s.quantity,
    s.unit,
    s.unitPrice,
    s.supplyPrice,
    s.taxAmount,
    s.totalAmount,
    s.paymentStatus === 'paid' ? '입금완료' : (s.paymentStatus === 'bill' ? '어음결제' : '외상미수'),
    s.paymentMethod,
    s.deliveryMethod === 'jeju_direct' ? '도내 직배송' : (s.deliveryMethod === 'freight_truck' ? '화물 용달' : (s.deliveryMethod === 'port_logistics' ? '제주항 물류' : '창고 방문')),
    s.memo || '',
    new Date().toISOString()
  ]);
}

function appendSingleCashflow(sheet, c) {
  sheet.appendRow([
    c.id,
    c.date,
    c.type === 'income' ? '수입' : '지출',
    c.category,
    c.amount,
    c.clientOrVendor,
    c.paymentMethod,
    c.memo || '',
    new Date().toISOString()
  ]);
}

// 5. 전체 덮어쓰기
function clearAndAppendSales(sheet, sales) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 17).clearContent();
  }
  var rows = sales.map(function(s) {
    return [
      s.id, s.date, s.clientName, s.clientContact, s.itemName, s.itemSpec,
      s.quantity, s.unit, s.unitPrice, s.supplyPrice, s.taxAmount, s.totalAmount,
      s.paymentStatus === 'paid' ? '입금완료' : (s.paymentStatus === 'bill' ? '어음결제' : '외상미수'),
      s.paymentMethod,
      s.deliveryMethod === 'jeju_direct' ? '도내 직배송' : (s.deliveryMethod === 'freight_truck' ? '화물 용달' : (s.deliveryMethod === 'port_logistics' ? '제주항 물류' : '창고 방문')),
      s.memo || '', s.createdAt
    ];
  });
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 17).setValues(rows);
  }
}

function clearAndAppendCashflow(sheet, cashflow) {
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 9).clearContent();
  }
  var rows = cashflow.map(function(c) {
    return [
      c.id, c.date, c.type === 'income' ? '수입' : '지출', c.category, c.amount,
      c.clientOrVendor, c.paymentMethod, c.memo || '', c.createdAt
    ];
  });
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 9).setValues(rows);
  }
}

// 6. 데이터 추출
function getSheetData(sheet) {
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  var headers = rows[0];
  var data = [];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[0] && !row[1] && !row[2]) continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    data.push(obj);
  }
  return data;
}

// 7. JSON 응답
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
