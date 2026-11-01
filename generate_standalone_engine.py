import json
import app.insurers_data as d

# Extract all master data
insurers = d.INSURERS
standard_coverages = d.STANDARD_COVERAGES
caregiver_insurers = d.CAREGIVER_INSURERS
caregiver_coverages = d.CAREGIVER_COVERAGES
popularity_order = d.POPULARITY_ORDER
renewable_only_codes = d.RENEWABLE_ONLY_CODES
caregiver_groups = d.CAREGIVER_GROUPS

js_content = f"""/**
 * GA-INSIGHT Standalone Client-side Calculation & Master Engine
 * GitHub Pages 및 정적 웹 호스팅 완벽 지원 (백엔드 서버 없이 100% 브라우저 자체 구동)
 */

window.STANDALONE_MASTER = {{
  insurers: {json.dumps(insurers, ensure_ascii=False, indent=2)},
  standardCoverages: {json.dumps(standard_coverages, ensure_ascii=False, indent=2)},
  caregiverInsurers: {json.dumps(caregiver_insurers, ensure_ascii=False, indent=2)},
  caregiverCoverages: {json.dumps(caregiver_coverages, ensure_ascii=False, indent=2)},
  caregiverGroups: {json.dumps(caregiver_groups, ensure_ascii=False, indent=2)},
  popularityOrder: {json.dumps(popularity_order, ensure_ascii=False, indent=2)},
  renewableOnlyCodes: {json.dumps(renewable_only_codes, ensure_ascii=False, indent=2)}
}};

/**
 * 클라이언트 사이드 실시간 계산 엔진
 */
window.ClientCalculationEngine = {{

  // 1. 8대 손보사 건강보험(암·뇌·심장·수술비) 비교설계
  calculateMultiQuote: function(params) {{
    const age = params.age || 40;
    const gender = (params.gender || 'M').toUpperCase();
    const jobGrade = params.job_grade || 1;
    const healthType = params.health_type || 'standard';
    const paymentPeriod = params.payment_period || '20년납';
    const expiryPeriod = params.expiry_period || '90세만기';
    const reqCoverages = params.coverages || [];
    const customerId = params.customer_id || null;
    const customerName = params.customer_name || '고객';

    const covCatalog = {{}};
    window.STANDALONE_MASTER.standardCoverages.forEach(c => {{
      covCatalog[c.code] = c;
    }});

    const reqCovMap = {{}};
    const reqRenewalMap = {{}};
    reqCoverages.forEach(item => {{
      reqCovMap[item.code] = item.amount;
      reqRenewalMap[item.code] = item.renewal_type || 'non_renewable';
    }});

    // [유사암 20% 한도 연계] 일반암 + 통합암 가입금액 합산의 최대 20% 자동 보정
    const genAmt = reqCovMap['cov_cancer_gen'] || 0;
    const groupAmt = reqCovMap['cov_cancer_group_multi'] || 0;
    const baseCancer = genAmt + groupAmt;
    const maxSimLimit = Math.round(baseCancer * 0.20);
    if (reqCovMap['cov_cancer_sim'] !== undefined) {{
      if (baseCancer <= 0) {{
        reqCovMap['cov_cancer_sim'] = 0;
      }} else if (reqCovMap['cov_cancer_sim'] > maxSimLimit) {{
        reqCovMap['cov_cancer_sim'] = maxSimLimit;
      }}
    }}

    const coverageNames = {{}};
    window.STANDALONE_MASTER.standardCoverages.forEach(c => {{
      if (reqCovMap[c.code] && reqCovMap[c.code] > 0) {{
        coverageNames[c.code] = c.name;
      }}
    }});

    const isMale = (gender === 'M');
    const quotes = [];

    // 만기 계수
    const expiryFactor = expiryPeriod.includes('100') ? 1.15 : 1.0;

    window.STANDALONE_MASTER.insurers.forEach(ins => {{
      const insFactor = ins.base_factor || 1.0;
      const breakdown = {{}};
      let totalPremium = 0;
      let totalStdPremium = 0;

      Object.keys(reqCovMap).forEach(code => {{
        const amount = reqCovMap[code];
        if (amount <= 0 || !covCatalog[code]) return;

        const covDef = covCatalog[code];
        const category = covDef.category || '';
        const group = covDef.group || '';
        const baseRate = covDef.base_rate_per_1000 || 5000;

        // 연령 계수
        let ageFactor = 1.0;
        if (category.includes('진단비')) {{
          ageFactor = Math.max(0.35, Math.pow(age / 40.0, 1.95));
        }} else if (category.includes('암 특약')) {{
          ageFactor = Math.max(0.35, Math.pow(age / 40.0, 1.85));
        }} else if (category.includes('특약')) {{
          ageFactor = Math.max(0.4, Math.pow(age / 40.0, 1.7));
        }} else if (category.includes('수술비')) {{
          ageFactor = Math.max(0.45, Math.pow(age / 40.0, 1.45));
        }} else if (category.includes('배상책임')) {{
          ageFactor = 1.0;
        }} else if (category.includes('운전자')) {{
          ageFactor = (age < 65) ? 1.0 : 1.25;
        }} else {{
          ageFactor = Math.max(0.5, Math.pow(age / 40.0, 1.2));
        }}

        // 성별 계수
        let genderFactor = 1.0;
        if (code === 'cov_cancer_sim') {{
          genderFactor = isMale ? 0.85 : 1.25;
        }} else if (group === '뇌' || group === '심장') {{
          genderFactor = isMale ? 1.15 : 0.85;
        }} else if (group === '암') {{
          genderFactor = isMale ? 1.05 : 0.95;
        }} else if (code.includes('injury')) {{
          genderFactor = isMale ? 1.20 : 0.80;
        }}

        // 직업 계수
        let jobFactor = 1.0;
        if (category.includes('상해') || code.includes('injury')) {{
          if (jobGrade === 2) jobFactor = 1.45;
          else if (jobGrade >= 3) jobFactor = 2.20;
        }}

        // 건강유형 계수 (10년 무사고 고지 할인형 지원)
        let healthFactor = 1.0;
        if (healthType === 'healthy_10yr' || healthType === 'no_accident_10yr') {{
          if (!category.includes('배상책임')) {{
            const discounts = {{
              'kb': 0.77,       // KB 5.10.10: 23% 할인
              'hanwha': 0.80,   // 한화 시그니처: 20% 할인
              'meritz': 0.82,   // 메리츠 맞춤건강: 18% 할인
              'db': 0.83,       // DB 참좋은: 17% 할인
              'heungkuk': 0.84, // 흥국 모두담은: 16% 할인
              'hyundai': 0.84,  // 현대 퍼펙트: 16% 할인
              'samsung': 0.85,  // 삼성 마이헬스: 15% 할인
              'lotte': 0.85     // 롯데 let:smile: 15% 할인
            }};
            healthFactor = discounts[ins.id] || 0.82;
          }}
        }} else if (healthType === 'simple_355') {{
          healthFactor = category.includes('배상책임') ? 1.0 : 1.18;
        }} else if (healthType === 'simple_335') {{
          healthFactor = category.includes('배상책임') ? 1.0 : 1.28;
        }} else if (healthType === 'simple_325') {{
          healthFactor = category.includes('배상책임') ? 1.0 : 1.38;
        }}

        // 갱신/비갱신 계수
        const isRenewOnly = covDef.is_renewable_only || false;
        const chosenRenewal = reqRenewalMap[code] || 'non_renewable';
        let renewalFactor = 1.0;
        if (isRenewOnly || chosenRenewal === 'renewable') {{
          renewalFactor = 0.45; // 갱신형은 초기 약 55% 저렴
        }}

        // 월보험료 계산
        let itemPrem = (amount / 1000.0) * baseRate * ageFactor * genderFactor * jobFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        let stdItemPrem = (amount / 1000.0) * baseRate * ageFactor * genderFactor * jobFactor * 1.0 * expiryFactor * renewalFactor * insFactor;

        // 원수사별 특정 담보 보정
        if (ins.id === 'meritz' && group === '암') {{ itemPrem *= 0.95; stdItemPrem *= 0.95; }}
        if (ins.id === 'db' && category.includes('수술비')) {{ itemPrem *= 0.94; stdItemPrem *= 0.94; }}
        if (ins.id === 'kb' && (code === 'cov_cardio_special' || code === 'cov_cancer_major_nonbenefit')) {{ itemPrem *= 0.93; stdItemPrem *= 0.93; }}
        if (ins.id === 'hanwha' && !isMale && group === '암') {{ itemPrem *= 0.92; stdItemPrem *= 0.92; }}
        if (ins.id === 'heungkuk') {{ itemPrem *= 0.92; stdItemPrem *= 0.92; }} // 무해지 최저가

        const rounded = Math.max(50, Math.round(itemPrem / 10.0) * 10);
        const stdRounded = Math.max(50, Math.round(stdItemPrem / 10.0) * 10);
        breakdown[code] = rounded;
        totalPremium += rounded;
        totalStdPremium += stdRounded;
      }});

      if (totalPremium > 0) totalPremium = Math.max(20000, totalPremium);
      if (totalStdPremium > 0) totalStdPremium = Math.max(20000, totalStdPremium);
      else totalStdPremium = totalPremium;

      const discountAmount = Math.max(0, totalStdPremium - totalPremium);
      const discountRate = totalStdPremium > 0 ? Math.round((discountAmount / totalStdPremium) * 1000) / 10.0 : 0.0;
      const discountDesc = discountAmount > 0 ? `표준체 대비 월 ${{discountAmount.toLocaleString()}}원 할인 (-${{discountRate}}%)` : '';

      let pName = ins.standard_product;
      if (healthType === 'healthy_10yr' || healthType === 'no_accident_10yr') {{
        pName = ins.healthy_10yr_product || (ins.standard_product + ' (10년 무사고 고지형)');
      }} else if (healthType.includes('simple')) {{
        pName = ins.simple_product || ins.standard_product;
      }}

      const commPct = ins.commission_percent || 1150;
      const totalComm = Math.round(totalPremium * (commPct / 100.0));
      const immComm = Math.round(totalComm * (ins.immediate_rate || 0.4));
      const y1Comm = Math.round(totalComm * (ins.year1_rate || 0.72));
      const y2Comm = Math.round(totalComm * (ins.year2_rate || 0.28));
      const netComm = Math.round(totalComm * 0.967);

      quotes.push({{
        insurer_id: ins.id,
        insurer_name: ins.name,
        insurer_code: ins.code,
        theme_color: ins.theme_color,
        badge_color: ins.badge_color,
        product_name: pName,
        total_monthly_premium: totalPremium,
        strengths: ins.strengths,
        coverage_breakdown: breakdown,
        commission_est: `월납의 약 ${{commPct}}% (${{totalComm.toLocaleString()}}원)`,
        commission_total: totalComm,
        commission_immediate: immComm,
        commission_year1: y1Comm,
        commission_year2: y2Comm,
        commission_net: netComm,
        standard_monthly_premium: totalStdPremium,
        discount_amount: discountAmount,
        discount_rate: discountRate,
        discount_desc: discountDesc
      }});
    }});

    // 정렬 및 순위
    quotes.sort((a, b) => a.total_monthly_premium - b.total_monthly_premium);
    quotes.forEach((q, idx) => {{
      q.rank = idx + 1;
      q.is_cheapest = (idx === 0);
      q.is_recommended = false;
    }});

    // 추천 선정 (10년 무사고 고지 할인형인 경우 KB 5.10.10 파격할인 우선 반영)
    let recId = quotes[0].insurer_id;
    if (healthType === 'healthy_10yr' || healthType === 'no_accident_10yr') {{
      const kbQ = quotes.find(q => q.insurer_id === 'kb');
      if (kbQ && kbQ.rank <= 2) {{
        recId = 'kb';
      }} else {{
        recId = quotes[0].insurer_id;
      }}
    }} else {{
      for (let q of quotes) {{
        if (!isMale && q.insurer_id === 'hanwha' && q.rank <= 3) {{
          recId = 'hanwha';
          break;
        }} else if (q.insurer_id === 'db' && q.rank <= 2) {{
          recId = 'db';
          break;
        }}
      }}
    }}
    quotes.forEach(q => {{
      if (q.insurer_id === recId) q.is_recommended = true;
    }});

    const customerSummary = {{
      customer_id: customerId,
      name: customerName,
      age: age,
      gender: isMale ? '남성' : '여성',
      job_grade: `${{jobGrade}}급`,
      health_type: (healthType === 'healthy_10yr' || healthType === 'no_accident_10yr') ? '10년 무사고 고지 할인형 (5.10.10 초건강체)' : (healthType === 'standard' ? '표준체 (건강체)' : (healthType === 'simple_355' ? '간편 3.5.5' : '간편 3.3.5')),
      payment_period: paymentPeriod,
      expiry_period: expiryPeriod
    }};

    const coverageRenewalInfo = {{}};
    window.STANDALONE_MASTER.standardCoverages.forEach(c => {{
      coverageRenewalInfo[c.code] = {{
        code: c.code,
        name: c.name,
        renewal_type: c.renewal_type || 'selectable',
        is_renewable_only: c.is_renewable_only || false,
        renewal_cycle: c.renewal_cycle || '비갱신 또는 10/20년 갱신',
        renewal_desc: c.renewal_desc || '',
        selected_renewal: c.is_renewable_only ? 'renewable' : (reqRenewalMap[c.code] || 'non_renewable')
      }};
    }});

    return {{
      customer_summary: customerSummary,
      quotes: quotes,
      lowest_premium_insurer: quotes[0].insurer_name,
      recommended_insurer: (quotes.find(q => q.is_recommended) || quotes[0]).insurer_name,
      coverage_names: coverageNames,
      coverage_renewal_info: coverageRenewalInfo,
      max_discount_amount: Math.max(...quotes.map(q => q.discount_amount || 0)),
      max_discount_rate: Math.max(...quotes.map(q => q.discount_rate || 0)),
      has_discount: quotes.some(q => (q.discount_amount || 0) > 0)
    }};
  }},

  // 2. 간병보험(간병인 사용일당·장기요양·치매) 비교설계
  calculateCaregiverMultiQuote: function(params) {{
    const age = params.age || 60;
    const gender = (params.gender || 'F').toUpperCase();
    const jobGrade = params.job_grade || 1;
    const healthType = params.health_type || 'standard';
    const paymentPeriod = params.payment_period || '20년납';
    const expiryPeriod = params.expiry_period || '90세만기';
    const reqCoverages = params.coverages || [];
    const customerId = params.customer_id || null;
    const customerName = params.customer_name || '고객';

    const covCatalog = {{}};
    window.STANDALONE_MASTER.caregiverCoverages.forEach(c => {{
      covCatalog[c.code] = c;
    }});

    const reqCovMap = {{}};
    const reqRenewalMap = {{}};
    reqCoverages.forEach(item => {{
      reqCovMap[item.code] = item.amount;
      reqRenewalMap[item.code] = item.renewal_type || 'non_renewable';
    }});

    const coverageNames = {{}};
    window.STANDALONE_MASTER.caregiverCoverages.forEach(c => {{
      if (reqCovMap[c.code] && reqCovMap[c.code] > 0) {{
        coverageNames[c.code] = c.name;
      }}
    }});

    const isFemale = (gender === 'F');

    const healthFactors = {{
      'healthy_10yr': 0.85,
      'no_accident_10yr': 0.85,
      'standard': 1.0,
      'simple_355': 1.15,
      'simple_335': 1.25,
      'simple_325': 1.35
    }};
    const healthFactor = healthFactors[healthType] || 1.0;
    const expiryFactor = expiryPeriod.includes('100') ? 1.18 : 1.0;

    const quotes = [];

    window.STANDALONE_MASTER.caregiverInsurers.forEach(ins => {{
      const insFactor = ins.caregiver_factor || 1.0;
      const breakdown = {{}};
      let totalPremium = 0;

      Object.keys(reqCovMap).forEach(code => {{
        const amount = reqCovMap[code];
        if (amount <= 0 || !covCatalog[code]) return;

        const covDef = covCatalog[code];
        const baseRate = covDef.base_rate_per_1000 || 10000;
        const group = covDef.group || '';
        const unit = covDef.unit || '만원';

        // 연령 계수
        let ageFactor = 1.0;
        if (group.includes('간병인')) {{
          ageFactor = Math.max(0.4, Math.pow(age / 40.0, 1.65));
        }} else if (group.includes('장기요양')) {{
          ageFactor = Math.max(0.35, Math.pow(age / 40.0, 2.15));
        }} else if (group.includes('재가') || group.includes('시설')) {{
          ageFactor = Math.max(0.35, Math.pow(age / 40.0, 1.95));
        }} else if (group.includes('치매')) {{
          ageFactor = Math.max(0.3, Math.pow(age / 40.0, 2.45));
        }} else {{
          ageFactor = Math.max(0.4, Math.pow(age / 40.0, 1.5));
        }}

        // 성별 계수
        let genderFactor = 1.0;
        if (group.includes('치매') || group.includes('장기요양')) {{
          genderFactor = isFemale ? 1.18 : 0.88;
        }} else if (group.includes('간병인')) {{
          genderFactor = isFemale ? 1.10 : 0.92;
        }}

        // 갱신/비갱신
        const isRenewOnly = covDef.is_renewable_only || false;
        const chosenRenewal = reqRenewalMap[code] || 'non_renewable';
        let renewalFactor = (isRenewOnly || chosenRenewal === 'renewable') ? 0.48 : 1.0;

        let itemPrem = 0;
        if (unit.includes('만원/일')) {{
          const ratePerUnit = baseRate / 100.0;
          itemPrem = amount * ratePerUnit * ageFactor * genderFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        }} else if (unit.includes('만원/월')) {{
          const ratePerUnit = baseRate / 100.0;
          itemPrem = (amount / 10.0) * ratePerUnit * ageFactor * genderFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        }} else if (unit === '구좌') {{
          itemPrem = amount * baseRate * ageFactor * genderFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        }} else {{
          itemPrem = (amount / 1000.0) * baseRate * ageFactor * genderFactor * healthFactor * expiryFactor * renewalFactor * insFactor;
        }}

        const rounded = Math.max(100, Math.round(itemPrem / 10.0) * 10);
        breakdown[code] = rounded;
        totalPremium += rounded;
      }});

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
      const cgDiscDesc = cgDiscAmount > 0 ? `표준체 대비 월 ${{cgDiscAmount.toLocaleString()}}원 할인 (-${{cgDiscRate}}%)` : '';

      quotes.push({{
        insurer_id: ins.id,
        insurer_name: ins.name,
        insurer_code: ins.code,
        theme_color: ins.theme_color,
        badge_color: ins.badge_color,
        product_name: ins.caregiver_product,
        total_monthly_premium: totalPremium,
        strengths: ins.strengths,
        coverage_breakdown: breakdown,
        commission_est: `월납의 약 ${{commPct}}% (${{totalComm.toLocaleString()}}원)`,
        commission_total: totalComm,
        commission_immediate: immComm,
        commission_year1: y1Comm,
        commission_year2: y2Comm,
        commission_net: netComm,
        standard_monthly_premium: stdTotalPremium,
        discount_amount: cgDiscAmount,
        discount_rate: cgDiscRate,
        discount_desc: cgDiscDesc
      }});
    }});

    quotes.sort((a, b) => a.total_monthly_premium - b.total_monthly_premium);
    quotes.forEach((q, idx) => {{
      q.rank = idx + 1;
      q.is_cheapest = (idx === 0);
      q.is_recommended = false;
    }});

    let recId = quotes[0].insurer_id;
    for (let q of quotes) {{
      if (isFemale && q.insurer_id === 'hanwha' && q.rank <= 3) {{
        recId = 'hanwha';
        break;
      }} else if (['meritz', 'db'].includes(q.insurer_id) && q.rank <= 3) {{
        recId = q.insurer_id;
        break;
      }}
    }}
    quotes.forEach(q => {{
      if (q.insurer_id === recId) q.is_recommended = true;
    }});

    const customerSummary = {{
      customer_id: customerId,
      name: customerName,
      age: age,
      gender: isFemale ? '여성' : '남성',
      job_grade: `${{jobGrade}}급`,
      health_type: healthType === 'standard' ? '표준체 (건강체)' : (healthType === 'simple_355' ? '간편 3.5.5' : (healthType === 'simple_335' ? '간편 3.3.5' : '간편 3.2.5')),
      payment_period: paymentPeriod,
      expiry_period: expiryPeriod
    }};

    const coverageRenewalInfo = {{}};
    window.STANDALONE_MASTER.caregiverCoverages.forEach(c => {{
      coverageRenewalInfo[c.code] = {{
        code: c.code,
        name: c.name,
        renewal_type: c.renewal_type || 'selectable',
        is_renewable_only: c.is_renewable_only || false,
        renewal_cycle: c.renewal_cycle || '비갱신 또는 10/20년 갱신',
        renewal_desc: c.description || '',
        selected_renewal: c.is_renewable_only ? 'renewable' : (reqRenewalMap[c.code] || 'non_renewable')
      }};
    }});

    return {{
      customer_summary: customerSummary,
      quotes: quotes,
      lowest_premium_insurer: quotes[0].insurer_name,
      recommended_insurer: (quotes.find(q => q.is_recommended) || quotes[0]).insurer_name,
      coverage_names: coverageNames,
      coverage_renewal_info: coverageRenewalInfo
    }};
  }},

  // 3. 종합 보장 분석 (레이더 차트 & 점수 산출)
  diagnoseCoverage: function(params) {{
    const age = params.age || 40;
    const gender = (params.gender || 'M').toUpperCase();
    const currentCoverages = params.current_coverages || {{}};

    const diagList = window.STANDALONE_MASTER.standardCoverages.filter(c => c.in_diagnosis !== false);
    const details = [];
    let totalScoreWeight = 0;
    let earnedScore = 0;

    diagList.forEach(c => {{
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

      details.push({{
        code: c.code,
        name: c.name,
        category: c.category,
        current_amount: currentAmt,
        recommended_amount: recAmt,
        gap_amount: gapAmt,
        status: status,
        score: score,
        unit: c.unit || '만원'
      }});
    }});

    const overallScore = Math.round((earnedScore / totalScoreWeight) * 100);
    let summaryMsg = '';
    const actions = [];

    if (overallScore >= 80) {{
      summaryMsg = '전반적인 3대 질병 및 수술비 보장이 매우 안정적으로 준비되어 있습니다.';
    }} else if (overallScore >= 50) {{
      summaryMsg = '기본적인 보장은 갖추어져 있으나, 일부 최신 치료비 및 수술비 영역에 공백이 있습니다.';
    }} else {{
      summaryMsg = '핵심 진단비와 수술비 한도가 권장 기준에 크게 미달하여 집중 보강이 시급합니다.';
    }}

    details.forEach(d => {{
      if (d.gap_amount > 0) {{
        actions.push(`${{d.name}} 보장이 권장 대비 ${{d.gap_amount.toLocaleString()}}${{d.unit}} 부족합니다.`);
      }}
    }});

    return {{
      overall_score: overallScore,
      summary_message: summaryMsg,
      coverage_details: details,
      recommended_actions: actions.slice(0, 4)
    }};
  }}
}};
"""

with open(r"g:\내 드라이브\aiworks\ins\app\static\js\standalone_engine.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Generated standalone_engine.js successfully!")

