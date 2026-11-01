/**
 * GA-INSIGHT Standalone Client-side Calculation & Master Engine
 * GitHub Pages 및 정적 웹 호스팅 완벽 지원 (백엔드 서버 없이 100% 브라우저 자체 구동)
 */

window.STANDALONE_MASTER = {
  insurers: [
  {
    "id": "meritz",
    "name": "메리츠화재",
    "code": "M01",
    "theme_color": "#D32F2F",
    "badge_color": "bg-red-600 text-white",
    "tagline": "진단비 가성비 및 빠른 심사",
    "standard_product": "내Mom같은 맞춤건강보험",
    "simple_product": "간편한355 맞춤건강보험",
    "healthy_10yr_product": "내Mom같은 맞춤건강(10년 무사고 고지형)",
    "healthy_10yr_discount_pct": 18,
    "portal_url": "https://agency.meritzfire.com",
    "strengths": [
      "3대 진단비 저렴",
      "간편심사 승인율 우수",
      "전산설계 신속"
    ],
    "base_factor": 0.96,
    "commission_rate": "1,150%",
    "commission_percent": 1150,
    "immediate_rate": 0.4,
    "year1_rate": 0.72,
    "year2_rate": 0.28
  },
  {
    "id": "samsung",
    "name": "삼성화재",
    "code": "M02",
    "theme_color": "#1565C0",
    "badge_color": "bg-blue-700 text-white",
    "tagline": "업계 1위 브랜드 신뢰도 & 보상 서비스",
    "standard_product": "마이헬스 파트너",
    "simple_product": "천만안심 유병자간편보험",
    "healthy_10yr_product": "마이헬스 파트너(10년 건강고지 무사고 플랜)",
    "healthy_10yr_discount_pct": 15,
    "portal_url": "https://www.samsungfire.com/agent",
    "strengths": [
      "신속한 보상처리",
      "높은 지급여력비율(K-ICS)",
      "브랜드 인지도 최고"
    ],
    "base_factor": 1.05,
    "commission_rate": "1,050%",
    "commission_percent": 1050,
    "immediate_rate": 0.32,
    "year1_rate": 0.7,
    "year2_rate": 0.3
  },
  {
    "id": "db",
    "name": "DB손해보험",
    "code": "M03",
    "theme_color": "#2E7D32",
    "badge_color": "bg-green-700 text-white",
    "tagline": "수술비 담보 최강자 & 종합 균형설계",
    "standard_product": "참좋은훼밀리더블플러스",
    "simple_product": "나에게맞춘 간편건강보험",
    "healthy_10yr_product": "참좋은훼밀리더블(10년 무사고 고지 할인형)",
    "healthy_10yr_discount_pct": 17,
    "portal_url": "https://ga.idbins.com",
    "strengths": [
      "질병 1~5종 수술비 경쟁력",
      "운전자보험 독보적",
      "인수기준 유연"
    ],
    "base_factor": 0.98,
    "commission_rate": "1,180%",
    "commission_percent": 1180,
    "immediate_rate": 0.42,
    "year1_rate": 0.73,
    "year2_rate": 0.27
  },
  {
    "id": "hyundai",
    "name": "현대해상",
    "code": "M04",
    "theme_color": "#E65100",
    "badge_color": "bg-orange-600 text-white",
    "tagline": "어린이·태아보험 1등 및 종합 패밀리 케어",
    "standard_product": "퍼펙트플러스 종합보험",
    "simple_product": "간편한355 건강보험",
    "healthy_10yr_product": "퍼펙트플러스(10년 무사고 할인형)",
    "healthy_10yr_discount_pct": 16,
    "portal_url": "https://hi.hi.co.kr",
    "strengths": [
      "태아/자녀보험 1위",
      "특약 다양성",
      "산정특례 진단비 우수"
    ],
    "base_factor": 1.02,
    "commission_rate": "1,100%",
    "commission_percent": 1100,
    "immediate_rate": 0.35,
    "year1_rate": 0.71,
    "year2_rate": 0.29
  },
  {
    "id": "kb",
    "name": "KB손해보험",
    "code": "M05",
    "theme_color": "#F9A825",
    "badge_color": "bg-yellow-600 text-white",
    "tagline": "KB 5.10.10 건강고지 할인 및 뇌/심장 특화",
    "standard_product": "KB 5.10.10 플러스건강보험",
    "simple_product": "슬기로운 간편건강보험",
    "healthy_10yr_product": "KB 5.10.10 플러스 건강보험 (초건강체 23% 할인)",
    "healthy_10yr_discount_pct": 23,
    "portal_url": "https://partner.kbinsure.co.kr",
    "strengths": [
      "건강고지(10년 무사고) 파격 할인",
      "심혈관특정치료비",
      "KB금융그룹 연계"
    ],
    "base_factor": 0.97,
    "commission_rate": "1,120%",
    "commission_percent": 1120,
    "immediate_rate": 0.38,
    "year1_rate": 0.72,
    "year2_rate": 0.28
  },
  {
    "id": "hanwha",
    "name": "한화손해보험",
    "code": "M06",
    "theme_color": "#EF6C00",
    "badge_color": "bg-amber-700 text-white",
    "tagline": "여성 특화 연구소 & 시그니처 여성건강보험",
    "standard_product": "LIFEPLUS 시그니처 여성건강보험",
    "simple_product": "간편한 355 건강보험",
    "healthy_10yr_product": "LIFEPLUS 시그니처 건강(10년 무사고 할인형)",
    "healthy_10yr_discount_pct": 20,
    "portal_url": "https://hanwha.hwgeneralins.com",
    "strengths": [
      "여성 생애주기별 특화 담보",
      "유방암/자궁경부암 보장 강화",
      "보험료 경쟁력"
    ],
    "base_factor": 0.95,
    "commission_rate": "1,200%",
    "commission_percent": 1200,
    "immediate_rate": 0.45,
    "year1_rate": 0.74,
    "year2_rate": 0.26
  },
  {
    "id": "heungkuk",
    "name": "흥국화재",
    "code": "M07",
    "theme_color": "#C2185B",
    "badge_color": "bg-pink-700 text-white",
    "tagline": "가성비 암보험 및 든든한 실속 플랜",
    "standard_product": "흥Good 모두담은 암건강보험",
    "simple_product": "간편한 335 건강보험",
    "healthy_10yr_product": "흥Good 모두담은(10년 무사고 고지 할인형)",
    "healthy_10yr_discount_pct": 16,
    "portal_url": "https://ga.heungkukfire.co.kr",
    "strengths": [
      "원발암/전이암 복수보장",
      "무해지 환급형 저렴한 보험료",
      "실속파 고객 선호"
    ],
    "base_factor": 0.93,
    "commission_rate": "1,250%",
    "commission_percent": 1250,
    "immediate_rate": 0.48,
    "year1_rate": 0.75,
    "year2_rate": 0.25
  },
  {
    "id": "lotte",
    "name": "롯데손해보험",
    "code": "M08",
    "theme_color": "#37474F",
    "badge_color": "bg-slate-700 text-white",
    "tagline": "도전적 요율과 let:click 간편 프로세스",
    "standard_product": "let:smile 종합건강보험",
    "simple_product": "let:간편 355 건강보험",
    "healthy_10yr_product": "let:smile 종합건강(10년 무사고 고지형)",
    "healthy_10yr_discount_pct": 15,
    "portal_url": "https://ga.lotteins.co.kr",
    "strengths": [
      "높은 진단비 한도",
      "운전자 특약 우수",
      "공격적인 인수기준"
    ],
    "base_factor": 0.94,
    "commission_rate": "1,220%",
    "commission_percent": 1220,
    "immediate_rate": 0.46,
    "year1_rate": 0.74,
    "year2_rate": 0.26
  }
],
  standardCoverages: [
  {
    "code": "cov_cancer_gen",
    "name": "일반암 진단비",
    "category": "3대 질병 진단비",
    "recommended_amount": 5000,
    "unit": "만원",
    "min": 1000,
    "max": 10000,
    "step": 1000,
    "base_rate_per_1000": 8500,
    "description": "위암, 폐암, 대장암, 간암 등 모든 일반암 진단 시 1회 지급",
    "group": "암",
    "sub": "진단비",
    "default_on": true,
    "tip": "암 진단비의 기본 담보. 유사암·고액암 등 별도 담보와 범위를 구분해 설계",
    "popularity": 1,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_group_multi",
    "name": "통합암 진단비 (부위별 최대 10회)",
    "category": "3대 질병 진단비",
    "group": "암",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 3000,
    "unit": "만원",
    "min": 1000,
    "max": 5000,
    "step": 1000,
    "base_rate_per_1000": 11000,
    "in_diagnosis": false,
    "description": "신체 부위별(위·폐·대장·유방·자궁·전립선 등)로 최대 10회까지 각각 분리하여 진단비를 지급 (한화, 롯데, 흥국 등 시그니처)",
    "tip": "1회 받고 소멸하는 일반암 진단비와 달리 다른 부위 암 발생 시에도 각각 보장",
    "popularity": 2,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_sim",
    "name": "유사암 진단비",
    "category": "3대 질병 진단비",
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 0,
    "max": 5000,
    "step": 100,
    "base_rate_per_1000": 3200,
    "description": "갑상선암, 기타피부암, 제자리암, 경계성종양 각 1회 지급",
    "tip": "일반암의 10~20% 수준으로 제한되는 경우가 일반적 (보험사별 한도 확인)",
    "group": "암",
    "sub": "진단비",
    "default_on": true,
    "popularity": 3,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cerebro",
    "name": "뇌혈관질환 진단비",
    "category": "3대 질병 진단비",
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 500,
    "max": 5000,
    "step": 500,
    "base_rate_per_1000": 7800,
    "description": "뇌출혈, 뇌경색(중풍), 뇌혈관 기형 등 뇌혈관 전반 진단비",
    "group": "뇌",
    "sub": "진단비",
    "default_on": true,
    "tip": "범위 넓음(뇌출혈·뇌경색 포함 뇌혈관 전반). 뇌졸중·뇌출혈 진단비보다 보험료는 높음",
    "popularity": 4,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cardio",
    "name": "허혈성/심혈관 진단비",
    "category": "3대 질병 진단비",
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 500,
    "max": 5000,
    "step": 500,
    "base_rate_per_1000": 6200,
    "description": "급성심근경색증 및 협심증, 부정맥 등 심장질환 진단비",
    "group": "심장",
    "sub": "진단비",
    "default_on": true,
    "tip": "협심증 포함 허혈성 심장질환. 급성심근경색 진단비보다 범위 넓음",
    "popularity": 5,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_integrated",
    "name": "통합암치료비",
    "category": "암 특약(치료비·생활비)",
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 7000,
    "in_diagnosis": false,
    "description": "암 진단 후 수술·항암·방사선·표적/면역항암 등 치료 목적 입원·통원 시 치료비를 연 단위로 지급 (보험사별 지급범위 상이)",
    "group": "암",
    "sub": "치료비",
    "default_on": true,
    "tip": "보험사별로 지급 범위(수술·항암·방사선·입원·통원)가 다름",
    "popularity": 6,
    "renewal_type": "renewable_only",
    "renewal_cycle": "5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (5년 갱신)】 최신 비급여 암 치료(수술·항암·방사선) 연간 보장 담보로, 신의료기술 도입 및 손해율 변동 리스크로 인해 8대 손보사 모두 갱신형(통상 5년)으로만 운영됩니다."
  },
  {
    "code": "cov_cancer_major_nonbenefit",
    "name": "비급여 암주요치료비 (하이클래스)",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 1000,
    "max": 5000,
    "step": 1000,
    "base_rate_per_1000": 4800,
    "in_diagnosis": false,
    "description": "비급여 암 수술, 비급여 항암약물, 비급여 항암방사선 치료 시 행위별 정액 또는 연간 비례 지급 (KB손보 하이클래스 등)",
    "tip": "실손보험의 비급여 한도를 초과하는 최신 비급여 암 치료비를 집중 커버",
    "popularity": 7,
    "renewal_type": "renewable_only",
    "renewal_cycle": "5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (5년 갱신)】 비급여 암 수술·약물·방사선 주요치료비 한도형 담보로 8대 손보사 공통 5년 갱신형 전용입니다."
  },
  {
    "code": "cov_cancer_target",
    "name": "표적항암약물허가치료비",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 3500,
    "in_diagnosis": false,
    "description": "식약처 허가 표적항암약물 치료를 받은 경우 지급 (연 1회 등 보험사별 상이)",
    "tip": "특정 표적항암제 지급 대상·연간 횟수를 확인",
    "popularity": 8,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 표적항암제 등 고가 비급여 신약 출시 주기에 맞추어 8대 손보사 공통으로 갱신형 전용으로만 판매됩니다."
  },
  {
    "code": "cov_surg_disease_1_5",
    "name": "질병 1~5종 수술비",
    "category": "수술비 보장",
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 300,
    "max": 2000,
    "step": 100,
    "base_rate_per_1000": 5500,
    "description": "경증(1종)부터 고난도 암·뇌·심장 개복/개두 수술(5종)까지 수술 회당 차등 지급",
    "group": "수술비",
    "sub": "수술비",
    "default_on": false,
    "tip": "",
    "popularity": 9,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_hormone",
    "name": "항암 호르몬 약물치료비 (타목시펜 등)",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 2000,
    "step": 500,
    "base_rate_per_1000": 1400,
    "in_diagnosis": false,
    "description": "유방암·전립선암 등 호르몬 수용체 양성 암 진단 후 항호르몬제(타목시펜, 아로마신 등) 복용 시 매년 연 1회 정액 지급 (최대 5~10년)",
    "tip": "유방암 수술 후 5~10년간 장기 복용하는 필수 약물로 여성 고객 필수 추천 (롯데손보, 한화손보 등)",
    "popularity": 10,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_robot",
    "name": "로봇 암수술비 (다빈치·레보아이)",
    "category": "수술비 보장",
    "group": "암",
    "sub": "수술비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 1800,
    "in_diagnosis": false,
    "description": "다빈치 및 레보아이 수술로봇을 이용한 암 수술 시 수술 1회당 정액 지급",
    "tip": "전립선암, 자궁암, 갑상선암 등 고난도 정밀 수술 시 환자 본인부담금 완벽 보전 (KB손보, 한화손보 등)",
    "popularity": 11,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 첨단 로봇수술 기기 발전 및 비급여 수가 변동으로 손보사 공통 갱신형으로 운영됩니다."
  },
  {
    "code": "cov_cancer_metastatic",
    "name": "전이암 진단비",
    "category": "암 특약(치료비·생활비)",
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 2800,
    "in_diagnosis": false,
    "description": "암이 다른 장기로 전이된 것으로 진단 확정 시 1회 지급 (원발암 진단비와 별도)",
    "group": "암",
    "sub": "진단비",
    "default_on": true,
    "tip": "원발암 진단비와 별도 지급. 전이 확진 기준·지급횟수 확인",
    "popularity": 12,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_high",
    "name": "고액암 진단비",
    "category": "3대 질병 진단비",
    "group": "암",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 3000,
    "unit": "만원",
    "min": 1000,
    "max": 10000,
    "step": 1000,
    "base_rate_per_1000": 2600,
    "in_diagnosis": false,
    "description": "뇌종양·혈액암(백혈병·림프종)·췌장암·식도암·뼈암 등 치료비가 큰 암 진단 시 일반암에 더해 지급",
    "tip": "고액암 범위·분류(보험사별)와 일반암 진단비 대비 가산 여부를 확인",
    "popularity": 13,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_living",
    "name": "암 생활비 (월 지급)",
    "category": "암 특약(치료비·생활비)",
    "recommended_amount": 100,
    "unit": "만원/월",
    "min": 50,
    "max": 300,
    "step": 50,
    "base_rate_per_1000": 90000,
    "in_diagnosis": false,
    "description": "암 진단 확정 시 매월 생활비 지급 (월 100만원 × 60개월 기준, 보험사별 지급기간 상이)",
    "group": "암",
    "sub": "입원·생활비",
    "default_on": true,
    "tip": "지급기간(예: 60개월)·월 지급액에 따라 총보장액 차이가 큼",
    "popularity": 14,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_car_t",
    "name": "카티(CAR-T) 항암 면역치료비",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 5000,
    "unit": "만원",
    "min": 1000,
    "max": 5000,
    "step": 1000,
    "base_rate_per_1000": 800,
    "in_diagnosis": false,
    "description": "킴리아 등 1회 투약비용 수억 원에 달하는 첨단 환자맞춤형 CAR-T 세포치료 시 최초 1회 지급",
    "tip": "월 수백 원대 보험료로 5억 원대 초고가 첨단 항암 치료비를 확실하게 방어",
    "popularity": 15,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 초고가 바이오 신약(카티 항암치료) 특성상 8대 손보사 공통 갱신형 전용입니다."
  },
  {
    "code": "cov_brain_circ_treatment",
    "name": "급여 뇌혈관 순환계 특정치료비",
    "category": "뇌·심장 특약(치료비·입원)",
    "group": "뇌",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 2000,
    "step": 500,
    "base_rate_per_1000": 2400,
    "in_diagnosis": false,
    "description": "뇌혈관질환으로 수술, 혈전용해치료, 중환자실 입원, 약물치료, 뇌재활치료 등 뇌혈관 특정치료를 받은 경우 연간 1회 지급 (DB손보 참좋은 등)",
    "tip": "1회성 진단비의 공백을 메우고 매년 반복되는 급성기 및 만기 뇌혈관 치료비를 평생 보장",
    "popularity": 16,
    "renewal_type": "renewable_only",
    "renewal_cycle": "5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (5년 갱신)】 급여 뇌혈관 순환계 특정치료비 담보로 8대 손보사 공통 5년 갱신형 전용입니다."
  },
  {
    "code": "cov_cardio_circ_treatment",
    "name": "급여 허혈성·심혈관 순환계 특정치료비",
    "category": "뇌·심장 특약(치료비·입원)",
    "group": "심장",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 2000,
    "step": 500,
    "base_rate_per_1000": 2200,
    "in_diagnosis": false,
    "description": "협심증·심근경색으로 스텐트 삽입술, 관상동맥우회술, 혈전용해, 심박조율기 시술 등 특정치료 시 연간 1회 지급",
    "tip": "스텐트 시술을 여러 번 받는 환자에게 진단비보다 훨씬 실질적인 보장을 매년 제공",
    "popularity": 17,
    "renewal_type": "renewable_only",
    "renewal_cycle": "5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (5년 갱신)】 급여 심혈관 순환계 특정치료비 담보로 8대 손보사 공통 5년 갱신형 전용입니다."
  },
  {
    "code": "cov_cardio_special",
    "name": "허혈성심장질환 특정치료비(스텐트·우회술)",
    "category": "뇌·심장 특약(치료비·입원)",
    "group": "심장",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 2800,
    "in_diagnosis": false,
    "description": "스텐트 삽입술·관상동맥우회술 등 허혈성심장질환 특정치료 시 지급",
    "tip": "KB손해보험 등이 강조하는 특약, 시술 종류와 지급횟수 확인",
    "popularity": 18,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_stroke",
    "name": "뇌졸중 진단비",
    "category": "3대 질병 진단비",
    "group": "뇌",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 500,
    "max": 5000,
    "step": 500,
    "base_rate_per_1000": 5200,
    "in_diagnosis": false,
    "description": "뇌출혈·뇌경색(뇌졸중) 진단 시 지급 (뇌혈관질환 진단비보다 좁은 범위)",
    "tip": "뇌혈관질환 진단비와 중복 가입 여부 점검, 보장범위는 뇌출혈 → 뇌졸중 → 뇌혈관질환 순으로 넓어짐",
    "popularity": 19,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_ami",
    "name": "급성심근경색증 진단비",
    "category": "3대 질병 진단비",
    "group": "심장",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 500,
    "max": 5000,
    "step": 500,
    "base_rate_per_1000": 3000,
    "in_diagnosis": false,
    "description": "급성심근경색증 진단 시 지급 (허혈성심장질환 진단비보다 좁은 범위, 보험료 저렴)",
    "tip": "협심증은 제외되므로 허혈성심장질환 진단비와 함께 구성 검토",
    "popularity": 20,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_immune",
    "name": "면역항암약물허가치료비",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 2200,
    "in_diagnosis": false,
    "description": "식약처 허가 면역항암약물(면역관문억제제 등) 치료를 받은 경우 지급",
    "tip": "보장 약물 범위와 신약 추가 반영 여부가 보험사마다 다름",
    "popularity": 21,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 면역항암치료 비급여 약제비 담보로 8대 손보사 전원 갱신형 전용 특약입니다."
  },
  {
    "code": "cov_cancer_surgery",
    "name": "암 수술비",
    "category": "수술비 보장",
    "group": "암",
    "sub": "수술비",
    "default_on": false,
    "recommended_amount": 500,
    "unit": "만원",
    "min": 100,
    "max": 2000,
    "step": 100,
    "base_rate_per_1000": 4500,
    "in_diagnosis": false,
    "description": "암을 직접 치료할 목적의 수술 시 수술 1회당 지급",
    "tip": "내시경·로봇수술 포함 여부와 회당·연간 지급한도를 확인",
    "popularity": 22,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_hosp",
    "name": "암 직접치료 입원일당",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "입원·생활비",
    "default_on": false,
    "recommended_amount": 10,
    "unit": "만원/일",
    "min": 5,
    "max": 30,
    "step": 5,
    "base_rate_per_1000": 400000,
    "in_diagnosis": false,
    "description": "암 치료를 직접 목적으로 입원한 날 1일당 지급 (요양병원 입원은 제외되는 경우가 일반적)",
    "tip": "1회 입원·연간 지급한도 일수, 요양병원 제외 여부를 확인",
    "popularity": 23,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_special_room",
    "name": "상급종합병원 암 1인실 입원일당",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "입원·생활비",
    "default_on": false,
    "recommended_amount": 60,
    "unit": "만원/일",
    "min": 10,
    "max": 60,
    "step": 10,
    "base_rate_per_1000": 350000,
    "in_diagnosis": false,
    "description": "암 치료를 목적으로 상급종합병원 1인실에 입원한 경우 1일당 최대 60만 원 지급",
    "tip": "삼성화재, 메리츠, KB 등에서 면역 저하 암환자 격리 치료를 위해 대거 신설한 인기 특약",
    "popularity": 24,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 상급종합병원 암 1인실 입원일당 담보는 손보사 공통 갱신형 전용입니다."
  },
  {
    "code": "cov_cancer_radio",
    "name": "항암방사선·약물치료비",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 3000,
    "in_diagnosis": false,
    "description": "암 진단 후 항암방사선 또는 항암약물 치료를 받은 경우 지급",
    "tip": "통합암치료비와 지급 범위가 겹칠 수 있어 중복 설계 여부 점검",
    "popularity": 25,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_proton",
    "name": "중입자방사선치료비",
    "category": "암 특약(치료비·생활비)",
    "group": "암",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 3000,
    "unit": "만원",
    "min": 1000,
    "max": 5000,
    "step": 1000,
    "base_rate_per_1000": 600,
    "in_diagnosis": false,
    "description": "중입자(양성자 포함) 방사선 치료를 받은 경우 1회 지급",
    "tip": "보험료는 낮지만 보장 대상 치료와 지급횟수(보통 1회)를 확인",
    "popularity": 26,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 중입자·양성자 방사선 등 첨단 치료 기술 담보로 갱신형 전용으로 운영됩니다."
  },
  {
    "code": "cov_cancer_reocc",
    "name": "재진단암 진단비",
    "category": "3대 질병 진단비",
    "group": "암",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 500,
    "max": 5000,
    "step": 500,
    "base_rate_per_1000": 2200,
    "in_diagnosis": false,
    "description": "최초 암 진단 후 일정 기간 경과 뒤 새로 진단받은 암(재발·새 암) 진단 시 지급",
    "tip": "경과기간(예: 2년)·지급횟수 조건 확인, 일반암 진단비와 중복 설계 여부 점검",
    "popularity": 27,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_brain_reocc",
    "name": "재진단 뇌졸중 진단비",
    "category": "3대 질병 진단비",
    "group": "뇌",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 2000,
    "step": 500,
    "base_rate_per_1000": 2100,
    "in_diagnosis": false,
    "description": "첫 뇌졸중 진단 후 1~2년 경과 뒤 새롭게 발생한 뇌졸중(재발 및 새로운 부위) 진단 시 지급",
    "tip": "뇌졸중 재발률이 높은 환자에게 필수적인 2차 진단 보장",
    "popularity": 28,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cardio_reocc",
    "name": "재진단 급성심근경색증 진단비",
    "category": "3대 질병 진단비",
    "group": "심장",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 2000,
    "step": 500,
    "base_rate_per_1000": 1500,
    "in_diagnosis": false,
    "description": "최초 급성심근경색증 진단 후 2년 경과 뒤 새롭게 발생한 재발 심근경색 진단 시 지급",
    "tip": "심혈관 질환 재발 리스크를 장기적으로 완벽 방어",
    "popularity": 29,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_daily_liability",
    "name": "가족일상생활배상책임",
    "category": "배상책임",
    "recommended_amount": 10000,
    "unit": "만원",
    "min": 10000,
    "max": 10000,
    "step": 0,
    "base_rate_per_1000": 11,
    "description": "누수, 자전거 사고, 타인 물건/신체 손해 배상 (대인 무한/대물 1억)",
    "group": "배상책임",
    "sub": "기타",
    "default_on": false,
    "tip": "",
    "popularity": 30,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3년 갱신)】 실손 비례보상 담보로 금융당국 지침 및 손보사 공통 3년 갱신형으로만 가입 가능합니다. (비갱신형 불가)"
  },
  {
    "code": "cov_heart_disease",
    "name": "심장질환 진단비(부정맥·판막 포함)",
    "category": "3대 질병 진단비",
    "group": "심장",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 4200,
    "in_diagnosis": false,
    "description": "허혈성 외 부정맥·심부전·심장판막질환 등 심장질환 전반 진단 시 지급",
    "tip": "허혈성심장질환 진단비와 보장범위가 겹치는 부분 점검",
    "popularity": 31,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_brain_surgery_specific",
    "name": "뇌동맥류 수술비 (코일색전술·결찰술)",
    "category": "수술비 보장",
    "group": "뇌",
    "sub": "수술비",
    "default_on": false,
    "recommended_amount": 500,
    "unit": "만원",
    "min": 300,
    "max": 1000,
    "step": 100,
    "base_rate_per_1000": 1600,
    "in_diagnosis": false,
    "description": "비파열 뇌동맥류 진단 후 혈관내 코일색전술 또는 개두 클립결찰술 수술 시 수술 회당 지급",
    "tip": "건강검진 MRA/MRI에서 흔히 발견되는 뇌동맥류의 선제적 예방 시술비 집중 보장",
    "popularity": 32,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cardio_arrhythmia_device",
    "name": "심장박동기 및 제세동기(ICD) 삽입시술비",
    "category": "뇌·심장 특약(치료비·입원)",
    "group": "심장",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 500,
    "max": 2000,
    "step": 500,
    "base_rate_per_1000": 1200,
    "in_diagnosis": false,
    "description": "치명적 부정맥, 서맥, 심부전으로 인공심박조율기(Pacemaker) 또는 체내삽입형제세동기(ICD) 삽입 시 1회당 지급",
    "tip": "고령층 다빈도 부정맥 환자의 고액 기기 삽입 시술비 특화 보장",
    "popularity": 33,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cardio_angioplasty",
    "name": "관상동맥성형술(카테터·풍선확장술) 수술비",
    "category": "수술비 보장",
    "group": "심장",
    "sub": "수술비",
    "default_on": false,
    "recommended_amount": 500,
    "unit": "만원",
    "min": 300,
    "max": 1000,
    "step": 100,
    "base_rate_per_1000": 1900,
    "in_diagnosis": false,
    "description": "허혈성 심장질환으로 경피적 관상동맥 풍선확장술 또는 스텐트성형술 시술 시 매회 정액 지급",
    "tip": "허혈성 수술비와 중복 합산하여 스텐트 시술 시 고액 수술비 동시 수령",
    "popularity": 34,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_brain_hemorrhage",
    "name": "뇌출혈 진단비",
    "category": "3대 질병 진단비",
    "group": "뇌",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 500,
    "max": 5000,
    "step": 500,
    "base_rate_per_1000": 2800,
    "in_diagnosis": false,
    "description": "뇌출혈(지주막하·뇌내출혈 등) 진단 시 지급 (가장 좁은 범위, 보험료 저렴)",
    "tip": "뇌경색은 보장하지 않으므로 뇌졸중·뇌혈관질환 진단비와 함께 구성 검토",
    "popularity": 35,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_brain_surgery",
    "name": "뇌혈관질환 수술비",
    "category": "수술비 보장",
    "group": "뇌",
    "sub": "수술비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 300,
    "max": 3000,
    "step": 100,
    "base_rate_per_1000": 2600,
    "in_diagnosis": false,
    "description": "뇌혈관질환으로 수술 시 수술 1회당 지급",
    "tip": "개두·혈관내 시술 포함 여부를 확인",
    "popularity": 36,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cardio_surgery",
    "name": "허혈성심장질환 수술비",
    "category": "수술비 보장",
    "group": "심장",
    "sub": "수술비",
    "default_on": false,
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 300,
    "max": 3000,
    "step": 100,
    "base_rate_per_1000": 2200,
    "in_diagnosis": false,
    "description": "허혈성심장질환으로 수술 시 수술 1회당 지급",
    "tip": "특정치료비와 지급 대상 시술이 겹치는지 확인",
    "popularity": 37,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_brain_hosp",
    "name": "뇌혈관질환 입원일당",
    "category": "뇌·심장 특약(치료비·입원)",
    "group": "뇌",
    "sub": "입원·생활비",
    "default_on": false,
    "recommended_amount": 5,
    "unit": "만원/일",
    "min": 3,
    "max": 20,
    "step": 1,
    "base_rate_per_1000": 300000,
    "in_diagnosis": false,
    "description": "뇌혈관질환으로 입원한 날 1일당 지급",
    "tip": "연간·1회 입원 지급일수 한도를 확인",
    "popularity": 38,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cardio_hosp",
    "name": "허혈성심장질환 입원일당",
    "category": "뇌·심장 특약(치료비·입원)",
    "group": "심장",
    "sub": "입원·생활비",
    "default_on": false,
    "recommended_amount": 5,
    "unit": "만원/일",
    "min": 3,
    "max": 20,
    "step": 1,
    "base_rate_per_1000": 280000,
    "in_diagnosis": false,
    "description": "허혈성심장질환으로 입원한 날 1일당 지급",
    "tip": "연간·1회 입원 지급일수 한도를 확인",
    "popularity": 39,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_cancer_sjt",
    "name": "암 산정특례 진단비",
    "category": "3대 질병 진단비",
    "group": "암",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 500,
    "unit": "만원",
    "min": 300,
    "max": 2000,
    "step": 100,
    "base_rate_per_1000": 1500,
    "in_diagnosis": false,
    "description": "암 진단으로 건강보험 산정특례(중증질환 본인부담 경감)에 등록된 경우 지급",
    "tip": "산정특례 보장 유무·지급횟수는 보험사별로 다름",
    "popularity": 40,
    "renewal_type": "renewable_only",
    "renewal_cycle": "5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (5년 갱신)】 국민건강보험 암 중증질환 산정특례 재등록 주기(5년)에 연계되어 5년 갱신형으로만 취급됩니다."
  },
  {
    "code": "cov_brain_sjt",
    "name": "뇌혈관질환 산정특례 진단비",
    "category": "3대 질병 진단비",
    "group": "뇌",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 500,
    "unit": "만원",
    "min": 300,
    "max": 2000,
    "step": 100,
    "base_rate_per_1000": 1200,
    "in_diagnosis": false,
    "description": "뇌혈관질환으로 산정특례 대상에 등록된 경우 지급",
    "tip": "보험사에 따라 취급하지 않는 특약일 수 있음",
    "popularity": 41,
    "renewal_type": "renewable_only",
    "renewal_cycle": "5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (5년 갱신)】 뇌혈관 산정특례 재등록 기준에 연동되어 8대 손보사 공통 5년 갱신형 전용입니다."
  },
  {
    "code": "cov_cardio_sjt",
    "name": "심장질환 산정특례 진단비",
    "category": "3대 질병 진단비",
    "group": "심장",
    "sub": "진단비",
    "default_on": false,
    "recommended_amount": 500,
    "unit": "만원",
    "min": 300,
    "max": 2000,
    "step": 100,
    "base_rate_per_1000": 1200,
    "in_diagnosis": false,
    "description": "심장질환으로 산정특례 대상에 등록된 경우 지급",
    "tip": "보험사에 따라 취급하지 않는 특약일 수 있음",
    "popularity": 42,
    "renewal_type": "renewable_only",
    "renewal_cycle": "5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (5년 갱신)】 심장질환 산정특례 재등록 기준에 연동되어 8대 손보사 공통 5년 갱신형 전용입니다."
  },
  {
    "code": "cov_brain_thrombolysis",
    "name": "뇌졸중 혈전용해치료비",
    "category": "뇌·심장 특약(치료비·입원)",
    "group": "뇌",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 500,
    "unit": "만원",
    "min": 300,
    "max": 2000,
    "step": 100,
    "base_rate_per_1000": 1800,
    "in_diagnosis": false,
    "description": "급성 뇌경색으로 혈전용해제 치료(t-PA 등)를 받은 경우 지급",
    "tip": "급성기 치료 시 지급되며 진단비와 별도 지급인지 확인",
    "popularity": 43,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 급성기 혈전용해치료 특약으로 원수사별로 통상 3~5년 갱신형으로만 운영됩니다."
  },
  {
    "code": "cov_ami_thrombolysis",
    "name": "급성심근경색 혈전용해치료비",
    "category": "뇌·심장 특약(치료비·입원)",
    "group": "심장",
    "sub": "치료비",
    "default_on": false,
    "recommended_amount": 500,
    "unit": "만원",
    "min": 300,
    "max": 2000,
    "step": 100,
    "base_rate_per_1000": 1600,
    "in_diagnosis": false,
    "description": "급성심근경색으로 혈전용해치료를 받은 경우 지급",
    "tip": "급성기 치료 시 지급되며 진단비와 별도 지급인지 확인",
    "popularity": 44,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 급성심근경색 혈전용해 특약으로 원수사 공통 갱신형 전용입니다."
  },
  {
    "code": "cov_surg_injury_1_5",
    "name": "상해 1~5종 및 상해수술비",
    "category": "수술비 보장",
    "recommended_amount": 500,
    "unit": "만원",
    "min": 100,
    "max": 1000,
    "step": 100,
    "base_rate_per_1000": 2100,
    "description": "골절, 화상, 교통사고 등 사고 상해 수술비 매회 지급",
    "group": "수술비",
    "sub": "수술비",
    "default_on": false,
    "tip": "",
    "popularity": 45,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_surg_disease_gen",
    "name": "질병수술비 (기본)",
    "category": "수술비 보장",
    "recommended_amount": 50,
    "unit": "만원",
    "min": 30,
    "max": 100,
    "step": 10,
    "base_rate_per_1000": 4200,
    "description": "질병으로 인한 수술 시 매회 기본 지급",
    "group": "수술비",
    "sub": "수술비",
    "default_on": false,
    "tip": "",
    "popularity": 46,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "renewal_desc": "【소비자 선택 가능】 8대 손보사 공통으로 비갱신형(납입완료 후 만기까지 보험료 인상 없음)과 갱신형(초기 보험료가 저렴한 갱신형) 중 원하는 방식을 자유롭게 선택할 수 있습니다."
  },
  {
    "code": "cov_driver_package",
    "name": "운전자 필수 3종 세트",
    "category": "운전자/생활",
    "recommended_amount": 25000,
    "unit": "만원",
    "min": 0,
    "max": 25000,
    "step": 5000,
    "base_rate_per_1000": 45,
    "description": "교통사고처리지원금(합의금) 2.5억 + 변호사선임 5천만 + 벌금(대인/대물)",
    "group": "운전자",
    "sub": "기타",
    "default_on": false,
    "tip": "",
    "popularity": 47,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신",
    "is_renewable_only": true,
    "renewal_desc": "【갱신형만 가능한 특약 (3~5년 갱신)】 교통사고 형사합의금·공탁금 등 법률 및 제도 개정 리스크로 갱신형(3~5년 또는 10년 갱신) 전용으로 운영됩니다."
  }
],
  caregiverInsurers: [
  {
    "id": "meritz",
    "name": "메리츠화재",
    "code": "M01",
    "theme_color": "#D32F2F",
    "badge_color": "bg-red-600 text-white",
    "tagline": "간병인 보험의 원조 명가 & 1인실 연계",
    "caregiver_product": "당신곁의 돌봄 간병인보험",
    "portal_url": "https://agency.meritzfire.com",
    "strengths": [
      "간병인 사용일당 원조 명가",
      "요양병원 간병비 분리 심사 우수",
      "상급종합 1인실 입원일당 최대 60만 원"
    ],
    "caregiver_factor": 0.95,
    "commission_rate": "1,200%",
    "commission_percent": 1200,
    "immediate_rate": 0.42,
    "year1_rate": 0.74,
    "year2_rate": 0.26
  },
  {
    "id": "db",
    "name": "DB손해보험",
    "code": "M03",
    "theme_color": "#2E7D32",
    "badge_color": "bg-green-700 text-white",
    "tagline": "체증형 간병인 & 간호간병통합 10만 원 선도",
    "caregiver_product": "참좋은간병보험 (체증형)",
    "portal_url": "https://ga.idbins.com",
    "strengths": [
      "5년마다 10% 체증형 간병인 사용일당",
      "간호·간병통합서비스 최대 10만 원",
      "장기요양 1~5등급 재가/시설 패키지"
    ],
    "caregiver_factor": 0.94,
    "commission_rate": "1,250%",
    "commission_percent": 1250,
    "immediate_rate": 0.45,
    "year1_rate": 0.75,
    "year2_rate": 0.25
  },
  {
    "id": "kb",
    "name": "KB손해보험",
    "code": "M05",
    "theme_color": "#F9A825",
    "badge_color": "bg-yellow-600 text-white",
    "tagline": "상급종합 간병인 20만 & 5.10.10 무사고 할인",
    "caregiver_product": "KB 든든양호 간병보험",
    "portal_url": "https://kbins.co.kr/agent",
    "strengths": [
      "상급종합병원 간병인 사용일당 20만 원",
      "5.10.10 무사고 고지 시 최대 15% 할인",
      "간병인 파견 지원일당 안정적 운영"
    ],
    "caregiver_factor": 0.96,
    "commission_rate": "1,220%",
    "commission_percent": 1220,
    "immediate_rate": 0.43,
    "year1_rate": 0.73,
    "year2_rate": 0.27
  },
  {
    "id": "samsung",
    "name": "삼성화재",
    "code": "M02",
    "theme_color": "#1565C0",
    "badge_color": "bg-blue-700 text-white",
    "tagline": "신속한 간병인 현물 파견 & 브랜드 신뢰도 1위",
    "caregiver_product": "삼성화재 시니어 친화 간병보험",
    "portal_url": "https://www.samsungfire.com/agent",
    "strengths": [
      "간병인 현물 지원 파견 신속 배정",
      "지급여력(K-ICS) 1등 안정성",
      "장기요양 재가급여 안정적 심사"
    ],
    "caregiver_factor": 1.04,
    "commission_rate": "1,100%",
    "commission_percent": 1100,
    "immediate_rate": 0.35,
    "year1_rate": 0.7,
    "year2_rate": 0.3
  },
  {
    "id": "hyundai",
    "name": "현대해상",
    "code": "M04",
    "theme_color": "#E65100",
    "badge_color": "bg-orange-600 text-white",
    "tagline": "장기요양 등급판정 진단비 & 종합 패밀리 케어",
    "caregiver_product": "퍼펙트플러스 간병패키지",
    "portal_url": "https://hi.hi.co.kr",
    "strengths": [
      "장기요양 1~5등급 진단비 고액 보장",
      "간호간병통합서비스 분리 지급",
      "부모님 효도보험 패키지 구성 우수"
    ],
    "caregiver_factor": 1.01,
    "commission_rate": "1,150%",
    "commission_percent": 1150,
    "immediate_rate": 0.38,
    "year1_rate": 0.72,
    "year2_rate": 0.28
  },
  {
    "id": "hanwha",
    "name": "한화손해보험",
    "code": "M06",
    "theme_color": "#F57C00",
    "badge_color": "bg-orange-700 text-white",
    "tagline": "여성 간병 특화 & 알츠하이머 집중 돌봄",
    "caregiver_product": "시그니처 여성 간병돌봄보험",
    "portal_url": "https://ga.hwgeneralins.com",
    "strengths": [
      "여성 특정 질환 간병비 우대",
      "재가급여 매월 50만 원 확정 지급",
      "건강 10년 고지형 적용 시 최저가"
    ],
    "caregiver_factor": 0.97,
    "commission_rate": "1,200%",
    "commission_percent": 1200,
    "immediate_rate": 0.4,
    "year1_rate": 0.74,
    "year2_rate": 0.26
  },
  {
    "id": "heungkuk",
    "name": "흥국화재",
    "code": "M07",
    "theme_color": "#C2185B",
    "badge_color": "bg-pink-700 text-white",
    "tagline": "무해지 환급형 비갱신 간병인 최저가",
    "caregiver_product": "흥Good 착한가격 간병보험",
    "portal_url": "https://ga.heungkukfire.co.kr",
    "strengths": [
      "비갱신 간병인 사용일당 업계 최저가",
      "무해지 환급형 20년납 90세만기 실속형",
      "치매 진단비 가성비 우수"
    ],
    "caregiver_factor": 0.91,
    "commission_rate": "1,280%",
    "commission_percent": 1280,
    "immediate_rate": 0.48,
    "year1_rate": 0.76,
    "year2_rate": 0.24
  },
  {
    "id": "lotte",
    "name": "롯데손해보험",
    "code": "M08",
    "theme_color": "#D81B60",
    "badge_color": "bg-rose-600 text-white",
    "tagline": "장기요양 재가·시설급여 가성비 결합",
    "caregiver_product": "let:smile 간병보험",
    "portal_url": "https://ga.lotteins.co.kr",
    "strengths": [
      "재가급여 월 최대 70만 원 탑재",
      "장기요양 1~5등급 진단비 가성비",
      "간편심사 3.2.5 유병자 가입 유연"
    ],
    "caregiver_factor": 0.93,
    "commission_rate": "1,260%",
    "commission_percent": 1260,
    "immediate_rate": 0.46,
    "year1_rate": 0.75,
    "year2_rate": 0.25
  }
],
  caregiverCoverages: [
  {
    "code": "cov_cg_general",
    "name": "간병인 사용일당 (일반병원)",
    "group": "간병인 사용·지원",
    "category": "간병인 지원/사용",
    "recommended_amount": 15,
    "unit": "만원/일",
    "min": 5,
    "max": 20,
    "step": 1,
    "base_rate_per_1000": 160000,
    "default_on": true,
    "popularity": 1,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "description": "일반병원·의원·종합병원에 1일 이상 입원하여 간병인을 고용한 경우 1일당 가입금액 정액 지급 (180일 한도)",
    "tip": "간병보험의 가장 기본적이고 인기 있는 핵심 담보입니다."
  },
  {
    "code": "cov_cg_nursing_hosp",
    "name": "간병인 사용일당 (요양병원)",
    "group": "간병인 사용·지원",
    "category": "간병인 지원/사용",
    "recommended_amount": 3,
    "unit": "만원/일",
    "min": 1,
    "max": 5,
    "step": 1,
    "base_rate_per_1000": 180000,
    "default_on": true,
    "popularity": 2,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "description": "요양병원에 1일 이상 입원하여 간병인을 고용한 경우 1일당 지급 (보통 1일당 2~5만원 선 한도, 180일 한도)",
    "tip": "요양병원은 일반병원과 분리 지급되므로 가입금액 한도를 확인하세요."
  },
  {
    "code": "cov_cg_integrated_care",
    "name": "간호·간병통합서비스 사용일당",
    "group": "간병인 사용·지원",
    "category": "간병인 지원/사용",
    "recommended_amount": 5,
    "unit": "만원/일",
    "min": 1,
    "max": 10,
    "step": 1,
    "base_rate_per_1000": 90000,
    "default_on": true,
    "popularity": 3,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "description": "간호·간병통합서비스 병동에 입원한 경우 1일당 정액 지급 (개인 간병인 없이 병원 전담간호서비스 이용 시)",
    "tip": "대학병원 및 대형 종합병원에서 간호간병병동 이용 시 매우 유용한 담보입니다."
  },
  {
    "code": "cov_cg_escalating",
    "name": "체증형 간병인 사용일당 (5년마다 10% 체증)",
    "group": "간병인 사용·지원",
    "category": "간병인 지원/사용",
    "recommended_amount": 15,
    "unit": "만원/일",
    "min": 5,
    "max": 20,
    "step": 1,
    "base_rate_per_1000": 210000,
    "default_on": false,
    "popularity": 4,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "description": "가입 후 5년마다 가입금액이 10%씩 체증(최대 2배까지)되어 향후 간병인 인건비 상승을 완벽 방어하는 신개념 특약",
    "tip": "DB손보, 메리츠 등에서 주력으로 미는 인플레이션 방어형 간병인 담보입니다."
  },
  {
    "code": "cov_cg_dispatch",
    "name": "간병인 지원일당 (보험사 현물 파견)",
    "group": "간병인 사용·지원",
    "category": "간병인 지원/사용",
    "recommended_amount": 1,
    "unit": "구좌",
    "min": 0,
    "max": 1,
    "step": 1,
    "base_rate_per_1000": 18000,
    "default_on": false,
    "popularity": 5,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3년/10년 갱신형 전용",
    "is_renewable_only": true,
    "description": "입원 48시간 전 보험사에 요청 시 전문 간병인을 직접 병실로 파견하는 현물 지원 특약 (간병인 미사용 시 입원일당 대체)",
    "tip": "간병인을 직접 구하기 힘든 보호자에게 편리하며, 손보사 공통 갱신형으로 운영됩니다."
  },
  {
    "code": "cov_cg_room_1",
    "name": "상급종합병원 1인실 입원일당",
    "group": "간병인 사용·지원",
    "category": "입원/격리비",
    "recommended_amount": 50,
    "unit": "만원/일",
    "min": 10,
    "max": 60,
    "step": 10,
    "base_rate_per_1000": 12000,
    "default_on": false,
    "popularity": 6,
    "renewal_type": "renewable_only",
    "renewal_cycle": "3~5년 갱신형 전용",
    "is_renewable_only": true,
    "description": "상급종합병원 1인실 입원 시 1일당 최대 50~60만원 정액 지급 (간병인과 함께 프라이빗한 집중 치료 가능)",
    "tip": "삼성화재, 메리츠화재, KB손보 등에서 간병 패키지로 가장 인기 있는 연계 특약입니다."
  },
  {
    "code": "cov_ltc_diag_1_5",
    "name": "장기요양(1~5등급) 판정 진단비",
    "group": "장기요양(LTC) 진단",
    "category": "장기요양 진단비",
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 300,
    "max": 3000,
    "step": 100,
    "base_rate_per_1000": 1500,
    "default_on": true,
    "popularity": 7,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "description": "국민건강보험공단 노인장기요양보험 1~5등급 판정 확정 시 최초 1회 일시금 지급",
    "tip": "노인성 질환으로 거동이 불편해져 장기요양 판정 시 초기 간병 인프라 구축비로 활용됩니다."
  },
  {
    "code": "cov_ltc_diag_1_2",
    "name": "중증 장기요양(1~2등급) 판정 진단비",
    "group": "장기요양(LTC) 진단",
    "category": "장기요양 진단비",
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 900,
    "default_on": false,
    "popularity": 8,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10/20년 갱신 선택 가능",
    "is_renewable_only": false,
    "description": "와상 및 최중증 상태인 장기요양 1~2등급 판정 시 고액 일시금 추가 지급",
    "tip": "치명적 간병 상태에 대비하여 고액 치료비를 집중 확보할 수 있습니다."
  },
  {
    "code": "cov_ltc_cognitive",
    "name": "인지지원등급(치매) 판정 진단비",
    "group": "장기요양(LTC) 진단",
    "category": "장기요양 진단비",
    "recommended_amount": 300,
    "unit": "만원",
    "min": 100,
    "max": 500,
    "step": 50,
    "base_rate_per_1000": 1200,
    "default_on": false,
    "popularity": 9,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 선택 가능",
    "is_renewable_only": false,
    "description": "신체 기능은 양호하나 치매로 인해 인지지원등급 판정을 받은 경우 최초 1회 지급",
    "tip": "5등급 판정에 미달하는 초기 경증 치매 환자도 보장받을 수 있는 틈새 담보입니다."
  },
  {
    "code": "cov_ltc_home_care",
    "name": "장기요양 재가급여 지원금 (매월 지급)",
    "group": "재가·시설급여",
    "category": "매월 생활비",
    "recommended_amount": 50,
    "unit": "만원/월",
    "min": 20,
    "max": 100,
    "step": 10,
    "base_rate_per_1000": 38000,
    "default_on": true,
    "popularity": 10,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10년 갱신 선택 가능",
    "is_renewable_only": false,
    "description": "장기요양(1~5등급) 판정 후 방문요양, 주야간보호, 방문목욕, 복지용구 등 재가급여 월 1회 이상 이용 시 매월 정액 지급 (최대 10년)",
    "tip": "집에서 가족이나 요양보호사의 케어를 받으며 요양할 때 생활비를 지속 지원하는 최고 인기 특약입니다."
  },
  {
    "code": "cov_ltc_facility_care",
    "name": "장기요양 시설급여 지원금 (매월 지급)",
    "group": "재가·시설급여",
    "category": "매월 생활비",
    "recommended_amount": 50,
    "unit": "만원/월",
    "min": 20,
    "max": 100,
    "step": 10,
    "base_rate_per_1000": 42000,
    "default_on": false,
    "popularity": 11,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 또는 10년 갱신 선택 가능",
    "is_renewable_only": false,
    "description": "장기요양(1~5등급) 판정 후 노인요양시설, 노인요양공동생활가정 등 요양원에 입소하여 시설급여 이용 시 매월 정액 지급 (최대 10년)",
    "tip": "가정 간병이 어려워 요양원에 입소할 경우 발생하는 매월 본인부담금을 완벽 보전합니다."
  },
  {
    "code": "cov_dementia_mild",
    "name": "경도치매 진단비 (CDR 1점)",
    "group": "치매 진단·생활비",
    "category": "치매 진단비",
    "recommended_amount": 500,
    "unit": "만원",
    "min": 100,
    "max": 1000,
    "step": 100,
    "base_rate_per_1000": 1300,
    "default_on": false,
    "popularity": 12,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 선택 가능",
    "is_renewable_only": false,
    "description": "임상치매척도(CDR) 1점 판정 확정 시 최초 1회 지급 (초기 알츠하이머 및 일상생활 경증 장애)",
    "tip": "치매 보장은 중증보다 초기에 진단금을 받아 조기 치료를 시작하는 것이 핵심입니다."
  },
  {
    "code": "cov_dementia_moderate",
    "name": "중등도치매 진단비 (CDR 2점)",
    "group": "치매 진단·생활비",
    "category": "치매 진단비",
    "recommended_amount": 1000,
    "unit": "만원",
    "min": 300,
    "max": 2000,
    "step": 100,
    "base_rate_per_1000": 1100,
    "default_on": false,
    "popularity": 13,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 선택 가능",
    "is_renewable_only": false,
    "description": "임상치매척도(CDR) 2점 판정 확정 시 최초 1회 지급 (부분적 간병이 필요한 중등도 상태)",
    "tip": "경도치매 진단비와 합산하여 단계별로 누적 수령할 수 있습니다."
  },
  {
    "code": "cov_dementia_severe",
    "name": "중증치매 진단비 (CDR 3점 이상)",
    "group": "치매 진단·생활비",
    "category": "치매 진단비",
    "recommended_amount": 2000,
    "unit": "만원",
    "min": 500,
    "max": 3000,
    "step": 500,
    "base_rate_per_1000": 800,
    "default_on": false,
    "popularity": 14,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 선택 가능",
    "is_renewable_only": false,
    "description": "임상치매척도(CDR) 3점 이상 중증치매 판정 확정 시 최초 1회 고액 지급",
    "tip": "온전한 일상생활이 불가능한 중증치매 상태의 간병비를 대비합니다."
  },
  {
    "code": "cov_dementia_living",
    "name": "중증치매 간병생활자금 (매월 종신)",
    "group": "치매 진단·생활비",
    "category": "매월 생활비",
    "recommended_amount": 100,
    "unit": "만원/월",
    "min": 50,
    "max": 200,
    "step": 50,
    "base_rate_per_1000": 32000,
    "default_on": false,
    "popularity": 15,
    "renewal_type": "selectable",
    "renewal_cycle": "비갱신(20년납 90세만기) 선택 가능",
    "is_renewable_only": false,
    "description": "중증치매(CDR 3점 이상) 진단 확정 후 매월 생존 시 종신토록 간병생활자금 지급 (최저 36회 보증)",
    "tip": "장기화되는 중증치매 간병 부담을 가족에게 넘기지 않고 종신 간병비를 마련합니다."
  }
],
  caregiverGroups: [
  "간병인 사용·지원",
  "장기요양(LTC) 진단",
  "재가·시설급여",
  "치매 진단·생활비"
],
  popularityOrder: [
  "cov_cancer_gen",
  "cov_cancer_group_multi",
  "cov_cancer_sim",
  "cov_cerebro",
  "cov_cardio",
  "cov_cancer_integrated",
  "cov_cancer_major_nonbenefit",
  "cov_cancer_target",
  "cov_surg_disease_1_5",
  "cov_cancer_hormone",
  "cov_cancer_robot",
  "cov_cancer_metastatic",
  "cov_cancer_high",
  "cov_cancer_living",
  "cov_cancer_car_t",
  "cov_brain_circ_treatment",
  "cov_cardio_circ_treatment",
  "cov_cardio_special",
  "cov_stroke",
  "cov_ami",
  "cov_cancer_immune",
  "cov_cancer_surgery",
  "cov_cancer_hosp",
  "cov_cancer_special_room",
  "cov_cancer_radio",
  "cov_cancer_proton",
  "cov_cancer_reocc",
  "cov_brain_reocc",
  "cov_cardio_reocc",
  "cov_daily_liability",
  "cov_heart_disease",
  "cov_brain_surgery_specific",
  "cov_cardio_arrhythmia_device",
  "cov_cardio_angioplasty",
  "cov_brain_hemorrhage",
  "cov_brain_surgery",
  "cov_cardio_surgery",
  "cov_brain_hosp",
  "cov_cardio_hosp",
  "cov_cancer_sjt",
  "cov_brain_sjt",
  "cov_cardio_sjt",
  "cov_brain_thrombolysis",
  "cov_ami_thrombolysis",
  "cov_surg_injury_1_5",
  "cov_surg_disease_gen",
  "cov_driver_package"
],
  renewableOnlyCodes: {
  "cov_cancer_integrated": [
    "5년 갱신",
    "최신 비급여 암 치료(수술·항암·방사선) 연간 보장 담보로, 신의료기술 도입 및 손해율 변동 리스크로 인해 8대 손보사 모두 갱신형(통상 5년)으로만 운영됩니다."
  ],
  "cov_cancer_major_nonbenefit": [
    "5년 갱신",
    "비급여 암 수술·약물·방사선 주요치료비 한도형 담보로 8대 손보사 공통 5년 갱신형 전용입니다."
  ],
  "cov_cancer_target": [
    "3~5년 갱신",
    "표적항암제 등 고가 비급여 신약 출시 주기에 맞추어 8대 손보사 공통으로 갱신형 전용으로만 판매됩니다."
  ],
  "cov_cancer_immune": [
    "3~5년 갱신",
    "면역항암치료 비급여 약제비 담보로 8대 손보사 전원 갱신형 전용 특약입니다."
  ],
  "cov_cancer_car_t": [
    "3~5년 갱신",
    "초고가 바이오 신약(카티 항암치료) 특성상 8대 손보사 공통 갱신형 전용입니다."
  ],
  "cov_cancer_robot": [
    "3~5년 갱신",
    "첨단 로봇수술 기기 발전 및 비급여 수가 변동으로 손보사 공통 갱신형으로 운영됩니다."
  ],
  "cov_cancer_proton": [
    "3~5년 갱신",
    "중입자·양성자 방사선 등 첨단 치료 기술 담보로 갱신형 전용으로 운영됩니다."
  ],
  "cov_cancer_special_room": [
    "3~5년 갱신",
    "상급종합병원 암 1인실 입원일당 담보는 손보사 공통 갱신형 전용입니다."
  ],
  "cov_cancer_sjt": [
    "5년 갱신",
    "국민건강보험 암 중증질환 산정특례 재등록 주기(5년)에 연계되어 5년 갱신형으로만 취급됩니다."
  ],
  "cov_brain_circ_treatment": [
    "5년 갱신",
    "급여 뇌혈관 순환계 특정치료비 담보로 8대 손보사 공통 5년 갱신형 전용입니다."
  ],
  "cov_cardio_circ_treatment": [
    "5년 갱신",
    "급여 심혈관 순환계 특정치료비 담보로 8대 손보사 공통 5년 갱신형 전용입니다."
  ],
  "cov_brain_sjt": [
    "5년 갱신",
    "뇌혈관 산정특례 재등록 기준에 연동되어 8대 손보사 공통 5년 갱신형 전용입니다."
  ],
  "cov_cardio_sjt": [
    "5년 갱신",
    "심장질환 산정특례 재등록 기준에 연동되어 8대 손보사 공통 5년 갱신형 전용입니다."
  ],
  "cov_brain_thrombolysis": [
    "3~5년 갱신",
    "급성기 혈전용해치료 특약으로 원수사별로 통상 3~5년 갱신형으로만 운영됩니다."
  ],
  "cov_ami_thrombolysis": [
    "3~5년 갱신",
    "급성심근경색 혈전용해 특약으로 원수사 공통 갱신형 전용입니다."
  ],
  "cov_daily_liability": [
    "3년 갱신",
    "실손 비례보상 담보로 금융당국 지침 및 손보사 공통 3년 갱신형으로만 가입 가능합니다. (비갱신형 불가)"
  ],
  "cov_driver_package": [
    "3~5년 갱신",
    "교통사고 형사합의금·공탁금 등 법률 및 제도 개정 리스크로 갱신형(3~5년 또는 10년 갱신) 전용으로 운영됩니다."
  ]
}
};

/**
 * 클라이언트 사이드 실시간 계산 엔진
 */
window.ClientCalculationEngine = {

  // 1. 8대 손보사 건강보험(암·뇌·심장·수술비) 비교설계
  calculateMultiQuote: function(params) {
    const age = params.age || 40;
    const gender = (params.gender || 'M').toUpperCase();
    const jobGrade = params.job_grade || 1;
    const healthType = params.health_type || 'standard';
    const paymentPeriod = params.payment_period || '20년납';
    const expiryPeriod = params.expiry_period || '90세만기';
    const reqCoverages = params.coverages || [];
    const customerId = params.customer_id || null;
    const customerName = params.customer_name || '고객';

    const covCatalog = {};
    window.STANDALONE_MASTER.standardCoverages.forEach(c => {
      covCatalog[c.code] = c;
    });

    const reqCovMap = {};
    const reqRenewalMap = {};
    reqCoverages.forEach(item => {
      reqCovMap[item.code] = item.amount;
      reqRenewalMap[item.code] = item.renewal_type || 'non_renewable';
    });

    // [유사암 20% 한도 연계] 일반암 + 통합암 가입금액 합산의 최대 20% 자동 보정
    const genAmt = reqCovMap['cov_cancer_gen'] || 0;
    const groupAmt = reqCovMap['cov_cancer_group_multi'] || 0;
    const baseCancer = genAmt + groupAmt;
    const maxSimLimit = Math.round(baseCancer * 0.20);
    if (reqCovMap['cov_cancer_sim'] !== undefined) {
      if (baseCancer <= 0) {
        reqCovMap['cov_cancer_sim'] = 0;
      } else if (reqCovMap['cov_cancer_sim'] > maxSimLimit) {
        reqCovMap['cov_cancer_sim'] = maxSimLimit;
      }
    }

    const coverageNames = {};
    window.STANDALONE_MASTER.standardCoverages.forEach(c => {
      if (reqCovMap[c.code] && reqCovMap[c.code] > 0) {
        coverageNames[c.code] = c.name;
      }
    });

    const isMale = (gender === 'M');
    const quotes = [];

    // 만기 계수
    const expiryFactor = expiryPeriod.includes('100') ? 1.15 : 1.0;

    window.STANDALONE_MASTER.insurers.forEach(ins => {
      const insFactor = ins.base_factor || 1.0;
      const breakdown = {};
      let totalPremium = 0;
      let totalStdPremium = 0;

      Object.keys(reqCovMap).forEach(code => {
        const amount = reqCovMap[code];
        if (amount <= 0 || !covCatalog[code]) return;

        const covDef = covCatalog[code];
        const category = covDef.category || '';
        const group = covDef.group || '';
        const baseRate = covDef.base_rate_per_1000 || 5000;

        // 연령 계수
        let ageFactor = 1.0;
        if (category.includes('진단비')) {
          ageFactor = Math.max(0.35, Math.pow(age / 40.0, 1.95));
        } else if (category.includes('암 특약')) {
          ageFactor = Math.max(0.35, Math.pow(age / 40.0, 1.85));
        } else if (category.includes('특약')) {
          ageFactor = Math.max(0.4, Math.pow(age / 40.0, 1.7));
        } else if (category.includes('수술비')) {
          ageFactor = Math.max(0.45, Math.pow(age / 40.0, 1.45));
        } else if (category.includes('배상책임')) {
          ageFactor = 1.0;
        } else if (category.includes('운전자')) {
          ageFactor = (age < 65) ? 1.0 : 1.25;
        } else {
          ageFactor = Math.max(0.5, Math.pow(age / 40.0, 1.2));
        }

        // 성별 계수
        let genderFactor = 1.0;
        if (code === 'cov_cancer_sim') {
          genderFactor = isMale ? 0.85 : 1.25;
        } else if (group === '뇌' || group === '심장') {
          genderFactor = isMale ? 1.15 : 0.85;
        } else if (group === '암') {
          genderFactor = isMale ? 1.05 : 0.95;
        } else if (code.includes('injury')) {
          genderFactor = isMale ? 1.20 : 0.80;
        }

        // 직업 계수
        let jobFactor = 1.0;
        if (category.includes('상해') || code.includes('injury')) {
          if (jobGrade === 2) jobFactor = 1.45;
          else if (jobGrade >= 3) jobFactor = 2.20;
        }

        // 건강유형 계수 (10년 무사고 고지 할인형 지원)
        let healthFactor = 1.0;
        if (healthType === 'healthy_10yr' || healthType === 'no_accident_10yr') {
          if (!category.includes('배상책임')) {
            const discounts = {
              'kb': 0.77,       // KB 5.10.10: 23% 할인
              'hanwha': 0.80,   // 한화 시그니처: 20% 할인
              'meritz': 0.82,   // 메리츠 맞춤건강: 18% 할인
              'db': 0.83,       // DB 참좋은: 17% 할인
              'heungkuk': 0.84, // 흥국 모두담은: 16% 할인
              'hyundai': 0.84,  // 현대 퍼펙트: 16% 할인
              'samsung': 0.85,  // 삼성 마이헬스: 15% 할인
              'lotte': 0.85     // 롯데 let:smile: 15% 할인
            };
            healthFactor = discounts[ins.id] || 0.82;
          }
        } else if (healthType === 'simple_355') {
          healthFactor = category.includes('배상책임') ? 1.0 : 1.18;
        } else if (healthType === 'simple_335') {
          healthFactor = category.includes('배상책임') ? 1.0 : 1.28;
        } else if (healthType === 'simple_325') {
          healthFactor = category.includes('배상책임') ? 1.0 : 1.38;
        }

        // 갱신/비갱신 계수
        const isRenewOnly = covDef.is_renewable_only || false;
        const chosenRenewal = reqRenewalMap[code] || 'non_renewable';
        let renewalFactor = 1.0;
        if (isRenewOnly || chosenRenewal === 'renewable') {
          renewalFactor = 0.45; // 갱신형은 초기 약 55% 저렴
        }

        // 월보험료 계산
        let itemPrem = (amount / 1000.0) * baseRate * ageFactor * genderFactor * jobFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        let stdItemPrem = (amount / 1000.0) * baseRate * ageFactor * genderFactor * jobFactor * 1.0 * expiryFactor * renewalFactor * insFactor;

        // 원수사별 특정 담보 보정
        if (ins.id === 'meritz' && group === '암') { itemPrem *= 0.95; stdItemPrem *= 0.95; }
        if (ins.id === 'db' && category.includes('수술비')) { itemPrem *= 0.94; stdItemPrem *= 0.94; }
        if (ins.id === 'kb' && (code === 'cov_cardio_special' || code === 'cov_cancer_major_nonbenefit')) { itemPrem *= 0.93; stdItemPrem *= 0.93; }
        if (ins.id === 'hanwha' && !isMale && group === '암') { itemPrem *= 0.92; stdItemPrem *= 0.92; }
        if (ins.id === 'heungkuk') { itemPrem *= 0.92; stdItemPrem *= 0.92; } // 무해지 최저가

        const rounded = Math.max(50, Math.round(itemPrem / 10.0) * 10);
        const stdRounded = Math.max(50, Math.round(stdItemPrem / 10.0) * 10);
        breakdown[code] = rounded;
        totalPremium += rounded;
        totalStdPremium += stdRounded;
      });

      if (totalPremium > 0) totalPremium = Math.max(20000, totalPremium);
      if (totalStdPremium > 0) totalStdPremium = Math.max(20000, totalStdPremium);
      else totalStdPremium = totalPremium;

      const discountAmount = Math.max(0, totalStdPremium - totalPremium);
      const discountRate = totalStdPremium > 0 ? Math.round((discountAmount / totalStdPremium) * 1000) / 10.0 : 0.0;
      const discountDesc = discountAmount > 0 ? `표준체 대비 월 ${discountAmount.toLocaleString()}원 할인 (-${discountRate}%)` : '';

      let pName = ins.standard_product;
      if (healthType === 'healthy_10yr' || healthType === 'no_accident_10yr') {
        pName = ins.healthy_10yr_product || (ins.standard_product + ' (10년 무사고 고지형)');
      } else if (healthType.includes('simple')) {
        pName = ins.simple_product || ins.standard_product;
      }

      const commPct = ins.commission_percent || 1150;
      const totalComm = Math.round(totalPremium * (commPct / 100.0));
      const immComm = Math.round(totalComm * (ins.immediate_rate || 0.4));
      const y1Comm = Math.round(totalComm * (ins.year1_rate || 0.72));
      const y2Comm = Math.round(totalComm * (ins.year2_rate || 0.28));
      const netComm = Math.round(totalComm * 0.967);

      quotes.push({
        insurer_id: ins.id,
        insurer_name: ins.name,
        insurer_code: ins.code,
        theme_color: ins.theme_color,
        badge_color: ins.badge_color,
        product_name: pName,
        total_monthly_premium: totalPremium,
        strengths: ins.strengths,
        coverage_breakdown: breakdown,
        commission_est: `월납의 약 ${commPct}% (${totalComm.toLocaleString()}원)`,
        commission_total: totalComm,
        commission_immediate: immComm,
        commission_year1: y1Comm,
        commission_year2: y2Comm,
        commission_net: netComm,
        standard_monthly_premium: totalStdPremium,
        discount_amount: discountAmount,
        discount_rate: discountRate,
        discount_desc: discountDesc
      });
    });

    // 정렬 및 순위
    quotes.sort((a, b) => a.total_monthly_premium - b.total_monthly_premium);
    quotes.forEach((q, idx) => {
      q.rank = idx + 1;
      q.is_cheapest = (idx === 0);
      q.is_recommended = false;
    });

    // 추천 선정 (10년 무사고 고지 할인형인 경우 KB 5.10.10 파격할인 우선 반영)
    let recId = quotes[0].insurer_id;
    if (healthType === 'healthy_10yr' || healthType === 'no_accident_10yr') {
      const kbQ = quotes.find(q => q.insurer_id === 'kb');
      if (kbQ && kbQ.rank <= 2) {
        recId = 'kb';
      } else {
        recId = quotes[0].insurer_id;
      }
    } else {
      for (let q of quotes) {
        if (!isMale && q.insurer_id === 'hanwha' && q.rank <= 3) {
          recId = 'hanwha';
          break;
        } else if (q.insurer_id === 'db' && q.rank <= 2) {
          recId = 'db';
          break;
        }
      }
    }
    quotes.forEach(q => {
      if (q.insurer_id === recId) q.is_recommended = true;
    });

    const customerSummary = {
      customer_id: customerId,
      name: customerName,
      age: age,
      gender: isMale ? '남성' : '여성',
      job_grade: `${jobGrade}급`,
      health_type: (healthType === 'healthy_10yr' || healthType === 'no_accident_10yr') ? '10년 무사고 고지 할인형 (5.10.10 초건강체)' : (healthType === 'standard' ? '표준체 (건강체)' : (healthType === 'simple_355' ? '간편 3.5.5' : '간편 3.3.5')),
      payment_period: paymentPeriod,
      expiry_period: expiryPeriod
    };

    const coverageRenewalInfo = {};
    window.STANDALONE_MASTER.standardCoverages.forEach(c => {
      coverageRenewalInfo[c.code] = {
        code: c.code,
        name: c.name,
        renewal_type: c.renewal_type || 'selectable',
        is_renewable_only: c.is_renewable_only || false,
        renewal_cycle: c.renewal_cycle || '비갱신 또는 10/20년 갱신',
        renewal_desc: c.renewal_desc || '',
        selected_renewal: c.is_renewable_only ? 'renewable' : (reqRenewalMap[c.code] || 'non_renewable')
      };
    });

    return {
      customer_summary: customerSummary,
      quotes: quotes,
      lowest_premium_insurer: quotes[0].insurer_name,
      recommended_insurer: (quotes.find(q => q.is_recommended) || quotes[0]).insurer_name,
      coverage_names: coverageNames,
      coverage_renewal_info: coverageRenewalInfo,
      max_discount_amount: Math.max(...quotes.map(q => q.discount_amount || 0)),
      max_discount_rate: Math.max(...quotes.map(q => q.discount_rate || 0)),
      has_discount: quotes.some(q => (q.discount_amount || 0) > 0)
    };
  },

  // 2. 간병보험(간병인 사용일당·장기요양·치매) 비교설계
  calculateCaregiverMultiQuote: function(params) {
    const age = params.age || 60;
    const gender = (params.gender || 'F').toUpperCase();
    const jobGrade = params.job_grade || 1;
    const healthType = params.health_type || 'standard';
    const paymentPeriod = params.payment_period || '20년납';
    const expiryPeriod = params.expiry_period || '90세만기';
    const reqCoverages = params.coverages || [];
    const customerId = params.customer_id || null;
    const customerName = params.customer_name || '고객';

    const covCatalog = {};
    window.STANDALONE_MASTER.caregiverCoverages.forEach(c => {
      covCatalog[c.code] = c;
    });

    const reqCovMap = {};
    const reqRenewalMap = {};
    reqCoverages.forEach(item => {
      reqCovMap[item.code] = item.amount;
      reqRenewalMap[item.code] = item.renewal_type || 'non_renewable';
    });

    const coverageNames = {};
    window.STANDALONE_MASTER.caregiverCoverages.forEach(c => {
      if (reqCovMap[c.code] && reqCovMap[c.code] > 0) {
        coverageNames[c.code] = c.name;
      }
    });

    const isFemale = (gender === 'F');

    const healthFactors = {
      'healthy_10yr': 0.85,
      'no_accident_10yr': 0.85,
      'standard': 1.0,
      'simple_355': 1.15,
      'simple_335': 1.25,
      'simple_325': 1.35
    };
    const healthFactor = healthFactors[healthType] || 1.0;
    const expiryFactor = expiryPeriod.includes('100') ? 1.18 : 1.0;

    const quotes = [];

    window.STANDALONE_MASTER.caregiverInsurers.forEach(ins => {
      const insFactor = ins.caregiver_factor || 1.0;
      const breakdown = {};
      let totalPremium = 0;

      Object.keys(reqCovMap).forEach(code => {
        const amount = reqCovMap[code];
        if (amount <= 0 || !covCatalog[code]) return;

        const covDef = covCatalog[code];
        const baseRate = covDef.base_rate_per_1000 || 10000;
        const group = covDef.group || '';
        const unit = covDef.unit || '만원';

        // 연령 계수
        let ageFactor = 1.0;
        if (group.includes('간병인')) {
          ageFactor = Math.max(0.4, Math.pow(age / 40.0, 1.65));
        } else if (group.includes('장기요양')) {
          ageFactor = Math.max(0.35, Math.pow(age / 40.0, 2.15));
        } else if (group.includes('재가') || group.includes('시설')) {
          ageFactor = Math.max(0.35, Math.pow(age / 40.0, 1.95));
        } else if (group.includes('치매')) {
          ageFactor = Math.max(0.3, Math.pow(age / 40.0, 2.45));
        } else {
          ageFactor = Math.max(0.4, Math.pow(age / 40.0, 1.5));
        }

        // 성별 계수
        let genderFactor = 1.0;
        if (group.includes('치매') || group.includes('장기요양')) {
          genderFactor = isFemale ? 1.18 : 0.88;
        } else if (group.includes('간병인')) {
          genderFactor = isFemale ? 1.10 : 0.92;
        }

        // 갱신/비갱신
        const isRenewOnly = covDef.is_renewable_only || false;
        const chosenRenewal = reqRenewalMap[code] || 'non_renewable';
        let renewalFactor = (isRenewOnly || chosenRenewal === 'renewable') ? 0.48 : 1.0;

        let itemPrem = 0;
        if (unit.includes('만원/일')) {
          const ratePerUnit = baseRate / 100.0;
          itemPrem = amount * ratePerUnit * ageFactor * genderFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        } else if (unit.includes('만원/월')) {
          const ratePerUnit = baseRate / 100.0;
          itemPrem = (amount / 10.0) * ratePerUnit * ageFactor * genderFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        } else if (unit === '구좌') {
          itemPrem = amount * baseRate * ageFactor * genderFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        } else {
          itemPrem = (amount / 1000.0) * baseRate * ageFactor * genderFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        }

        const rounded = Math.max(100, Math.round(itemPrem / 10.0) * 10);
        breakdown[code] = rounded;
        totalPremium += rounded;
      });

      if (totalPremium > 0) totalPremium = Math.max(15000, totalPremium);

      const commPct = ins.commission_percent || 1200;
      const totalComm = Math.round(totalPremium * (commPct / 100.0));
      const immComm = Math.round(totalComm * (ins.immediate_rate || 0.42));
      const y1Comm = Math.round(totalComm * (ins.year1_rate || 0.74));
      const y2Comm = Math.round(totalComm * (ins.year2_rate || 0.26));
      const netComm = Math.round(totalComm * 0.967);

      const stdFactorVal = 1.0 / (healthFactor > 0 ? healthFactor : 1.0);
      const stdTotalPremium = (healthFactor < 1.0) ? Math.max(15000, Math.round(totalPremium * stdFactorVal / 10.0) * 10) : totalPremium;
      const cgDiscAmount = Math.max(0, stdTotalPremium - totalPremium);
      const cgDiscRate = stdTotalPremium > 0 ? Math.round((cgDiscAmount / stdTotalPremium) * 1000) / 10.0 : 0.0;
      const cgDiscDesc = cgDiscAmount > 0 ? `표준체 대비 월 ${cgDiscAmount.toLocaleString()}원 할인 (-${cgDiscRate}%)` : '';

      quotes.push({
        insurer_id: ins.id,
        insurer_name: ins.name,
        insurer_code: ins.code,
        theme_color: ins.theme_color,
        badge_color: ins.badge_color,
        product_name: ins.caregiver_product,
        total_monthly_premium: totalPremium,
        strengths: ins.strengths,
        coverage_breakdown: breakdown,
        commission_est: `월납의 약 ${commPct}% (${totalComm.toLocaleString()}원)`,
        commission_total: totalComm,
        commission_immediate: immComm,
        commission_year1: y1Comm,
        commission_year2: y2Comm,
        commission_net: netComm,
        standard_monthly_premium: stdTotalPremium,
        discount_amount: cgDiscAmount,
        discount_rate: cgDiscRate,
        discount_desc: cgDiscDesc
      });
    });

    quotes.sort((a, b) => a.total_monthly_premium - b.total_monthly_premium);
    quotes.forEach((q, idx) => {
      q.rank = idx + 1;
      q.is_cheapest = (idx === 0);
      q.is_recommended = false;
    });

    let recId = quotes[0].insurer_id;
    for (let q of quotes) {
      if (isFemale && q.insurer_id === 'hanwha' && q.rank <= 3) {
        recId = 'hanwha';
        break;
      } else if (['meritz', 'db'].includes(q.insurer_id) && q.rank <= 3) {
        recId = q.insurer_id;
        break;
      }
    }
    quotes.forEach(q => {
      if (q.insurer_id === recId) q.is_recommended = true;
    });

    const customerSummary = {
      customer_id: customerId,
      name: customerName,
      age: age,
      gender: isFemale ? '여성' : '남성',
      job_grade: `${jobGrade}급`,
      health_type: healthType === 'standard' ? '표준체 (건강체)' : (healthType === 'simple_355' ? '간편 3.5.5' : (healthType === 'simple_335' ? '간편 3.3.5' : '간편 3.2.5')),
      payment_period: paymentPeriod,
      expiry_period: expiryPeriod
    };

    const coverageRenewalInfo = {};
    window.STANDALONE_MASTER.caregiverCoverages.forEach(c => {
      coverageRenewalInfo[c.code] = {
        code: c.code,
        name: c.name,
        renewal_type: c.renewal_type || 'selectable',
        is_renewable_only: c.is_renewable_only || false,
        renewal_cycle: c.renewal_cycle || '비갱신 또는 10/20년 갱신',
        renewal_desc: c.description || '',
        selected_renewal: c.is_renewable_only ? 'renewable' : (reqRenewalMap[c.code] || 'non_renewable')
      };
    });

    return {
      customer_summary: customerSummary,
      quotes: quotes,
      lowest_premium_insurer: quotes[0].insurer_name,
      recommended_insurer: (quotes.find(q => q.is_recommended) || quotes[0]).insurer_name,
      coverage_names: coverageNames,
      coverage_renewal_info: coverageRenewalInfo
    };
  },

  // 3. 종합 보장 분석 (레이더 차트 & 점수 산출)
  diagnoseCoverage: function(params) {
    const age = params.age || 40;
    const gender = (params.gender || 'M').toUpperCase();
    const currentCoverages = params.current_coverages || {};

    const diagList = window.STANDALONE_MASTER.standardCoverages.filter(c => c.in_diagnosis !== false);
    const details = [];
    let totalScoreWeight = 0;
    let earnedScore = 0;

    diagList.forEach(c => {
      const currentAmt = currentCoverages[c.code] || 0;
      const recAmt = c.recommended_amount || 1000;
      const ratio = recAmt > 0 ? Math.min(1.2, currentAmt / recAmt) : 1.0;
      const score = Math.round(ratio * 100);
      const gapAmt = Math.max(0, recAmt - currentAmt);

      let status = '충족';
      if (ratio < 0.4) status = '심각한 부족';
      else if (ratio < 0.8) status = '부족';
      else if (ratio < 1.0) status = '약간 부족';

      earnedScore += score;
      totalScoreWeight += 100;

      details.push({
        code: c.code,
        name: c.name,
        category: c.category,
        current_amount: currentAmt,
        recommended_amount: recAmt,
        gap_amount: gapAmt,
        status: status,
        score: score,
        unit: c.unit || '만원'
      });
    });

    const overallScore = Math.round((earnedScore / totalScoreWeight) * 100);
    let summaryMsg = '';
    const actions = [];

    if (overallScore >= 80) {
      summaryMsg = '전반적인 3대 질병 및 수술비 보장이 매우 안정적으로 준비되어 있습니다.';
    } else if (overallScore >= 50) {
      summaryMsg = '기본적인 보장은 갖추어져 있으나, 일부 최신 치료비 및 수술비 영역에 공백이 있습니다.';
    } else {
      summaryMsg = '핵심 진단비와 수술비 한도가 권장 기준에 크게 미달하여 집중 보강이 시급합니다.';
    }

    details.forEach(d => {
      if (d.gap_amount > 0) {
        actions.push(`${d.name} 보장이 권장 대비 ${d.gap_amount.toLocaleString()}${d.unit} 부족합니다.`);
      }
    });

    return {
      overall_score: overallScore,
      summary_message: summaryMsg,
      coverage_details: details,
      recommended_actions: actions.slice(0, 4)
    };
  }
};
