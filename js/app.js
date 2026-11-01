// GA-INSIGHT Frontend Application Logic

let insurers = [];
let standardCoverages = [];
let caregiverCoverages = [];
let caregiverGroups = [];
let caregiverInsurers = [];
let currentCaregiverQuoteResult = null;
let cgRiderRenewalSettings = {};

// 보장분석(점수·레이더) 대상 담보: 비교설계 전용 특약(in_diagnosis=false)은 제외
function diagCoverages() {
    return standardCoverages.filter(c => c.in_diagnosis !== false);
}
let customers = [];
let currentCustomer = null;
let currentQuoteResult = null;
let currentDiagnosisResult = null;
let agencySettings = null;
let radarChartInstance = null;

// 초기화
document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

async function initApp() {
    if (typeof initThemeMode === 'function') initThemeMode();
    try {
        await Promise.all([
            fetchInsurers(),
            fetchStandardCoverages(),
            fetchCaregiverCoverages(),
            fetchCaregiverInsurers(),
            fetchCustomers(),
            fetchAgencySettings()
        ]);

        renderDashboard();
        renderDiagnosisInputs();
        renderCalculatorInputs();
        renderCaregiverInputs();
        renderRPAPanel();

        // 기본 계산 실행 (건강보험 및 간병보험)
        await triggerCalculation();
        await triggerCaregiverCalculation();
    } catch (err) {
        console.error('App initialization error:', err);
    }
}

// 탭 전환
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.remove('hidden');

    const activeBtn = document.getElementById(`nav-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (tabId === 'tab-diagnose' && radarChartInstance) {
        radarChartInstance.resize();
    }
}

// ----------------- API 호출 (하이브리드: 백엔드 API 우선, 실패 시 클라이언트 자체 엔진 자동 폴백) -----------------
async function fetchInsurers() {
    try {
        const res = await fetch('/api/insurers');
        if (res.ok) {
            insurers = await res.json();
            return;
        }
    } catch (e) {
        console.log('Backend offline or static mode: using standalone insurers');
    }
    if (window.STANDALONE_MASTER && window.STANDALONE_MASTER.insurers) {
        insurers = window.STANDALONE_MASTER.insurers;
    }
}

async function fetchStandardCoverages() {
    try {
        const res = await fetch('/api/standard-coverages');
        if (res.ok) {
            standardCoverages = await res.json();
            return;
        }
    } catch (e) {
        console.log('Backend offline or static mode: using standalone standardCoverages');
    }
    if (window.STANDALONE_MASTER && window.STANDALONE_MASTER.standardCoverages) {
        standardCoverages = window.STANDALONE_MASTER.standardCoverages;
    }
}

async function fetchCaregiverCoverages() {
    try {
        const res = await fetch('/api/caregiver-coverages');
        if (res.ok) {
            const data = await res.json();
            caregiverGroups = data.groups || [];
            caregiverCoverages = data.coverages || [];
            return;
        }
    } catch (e) {
        console.log('Backend offline or static mode: using standalone caregiverCoverages');
    }
    if (window.STANDALONE_MASTER) {
        caregiverGroups = window.STANDALONE_MASTER.caregiverGroups || [];
        caregiverCoverages = window.STANDALONE_MASTER.caregiverCoverages || [];
    }
}

async function fetchCaregiverInsurers() {
    try {
        const res = await fetch('/api/caregiver-insurers');
        if (res.ok) {
            caregiverInsurers = await res.json();
            return;
        }
    } catch (e) {
        console.log('Backend offline or static mode: using standalone caregiverInsurers');
    }
    if (window.STANDALONE_MASTER && window.STANDALONE_MASTER.caregiverInsurers) {
        caregiverInsurers = window.STANDALONE_MASTER.caregiverInsurers;
    }
}

async function fetchCustomers() {
    try {
        const res = await fetch('/api/customers');
        if (res.ok) {
            customers = await res.json();
            localStorage.setItem('ga_customers', JSON.stringify(customers));
            updateCustomerDropdowns();
            renderCustomerTable();
            return;
        }
    } catch (e) {
        console.log('Backend offline or static mode: using localStorage customers');
    }
    // localStorage 폴백
    const saved = localStorage.getItem('ga_customers');
    if (saved) {
        try { customers = JSON.parse(saved); } catch(err) { customers = []; }
    } else {
        // 기본 시연용 고객
        customers = [
            { id: 1, name: '김철수', gender: 'M', birthdate: '1984-05-15', age: 40, job_grade: 1, job_name: 'IT 기획자', phone: '010-1234-5678', health_type: 'standard', is_driver: true },
            { id: 2, name: '이영희', gender: 'F', birthdate: '1989-11-20', age: 35, job_grade: 1, job_name: '교사', phone: '010-9876-5432', health_type: 'standard', is_driver: true },
            { id: 3, name: '박영선', gender: 'F', birthdate: '1964-08-10', age: 60, job_grade: 1, job_name: '주부', phone: '010-5555-4321', health_type: 'simple_355', is_driver: false }
        ];
        localStorage.setItem('ga_customers', JSON.stringify(customers));
    }
    updateCustomerDropdowns();
    renderCustomerTable();
}

async function fetchAgencySettings() {
    try {
        const res = await fetch('/api/agency-settings');
        if (res.ok) {
            agencySettings = await res.json();
            localStorage.setItem('ga_agency_settings', JSON.stringify(agencySettings));
            applyAgencySettingsToUI();
            return;
        }
    } catch (e) {
        console.log('Backend offline or static mode: using localStorage agencySettings');
    }
    const saved = localStorage.getItem('ga_agency_settings');
    if (saved) {
        try { agencySettings = JSON.parse(saved); } catch(err) { agencySettings = null; }
    }
    if (!agencySettings) {
        agencySettings = {
            agency_name: '인슈탑 법인보험대리점(GA)',
            representative: '대표이사',
            registration_no: 'GA-2026-001',
            contact: '02-1588-0000',
            agent_name: '수석설계사',
            agent_contact: '010-1234-5678'
        };
    }
    applyAgencySettingsToUI();
}

function applyAgencySettingsToUI() {
    if (!agencySettings) return;
    document.getElementById('header-agency-name').innerText = agencySettings.agency_name || '인슈탑 법인보험대리점';
    document.getElementById('header-agent-name').innerText = agencySettings.agent_name || '수석설계사';
    document.getElementById('header-agent-contact').innerText = agencySettings.agent_contact || '010-1234-5678';

    // 설정 폼에 바인딩
    document.getElementById('set-agency-name').value = agencySettings.agency_name || '';
    document.getElementById('set-representative').value = agencySettings.representative || '';
    document.getElementById('set-reg-no').value = agencySettings.registration_no || '';
    document.getElementById('set-contact').value = agencySettings.contact || '';
    document.getElementById('set-agent-name').value = agencySettings.agent_name || '';
    document.getElementById('set-agent-contact').value = agencySettings.agent_contact || '';
}

// ----------------- 대시보드 렌더링 -----------------
function renderDashboard() {
    document.getElementById('dash-cust-count').innerText = `${customers.length}명`;
    
    const grid = document.getElementById('insurers-grid');
    if (!grid) return;
    grid.innerHTML = '';

    insurers.forEach(ins => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer flex flex-col justify-between";
        card.onclick = () => window.open(ins.portal_url, '_blank');
        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-sm text-slate-800">${ins.name}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded font-semibold ${ins.badge_color}">${ins.code}</span>
                </div>
                <div class="text-xs text-slate-500 font-medium mb-1">${ins.standard_product}</div>
                <div class="text-[11px] text-slate-600 line-clamp-1 mb-2">${ins.tagline}</div>
                <div class="flex flex-wrap gap-1">
                    ${ins.strengths.slice(0, 2).map(s => `<span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">• ${s}</span>`).join('')}
                </div>
            </div>
            <div class="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                <span class="text-slate-400">전산 바로가기</span>
                <span class="text-blue-600 font-semibold flex items-center gap-1">접속 <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i></span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ----------------- 고객 관리 (CRM) -----------------
function updateCustomerDropdowns() {
    const diagSelect = document.getElementById('diag-cust-select');
    const calcSelect = document.getElementById('calc-cust-select');
    const cgSelect = document.getElementById('cg-cust-select');

    let options = '<option value="">-- 고객 선택 --</option>';
    customers.forEach(c => {
        options += `<option value="${c.id}">${c.name} (${c.age}세, ${c.gender === 'M' ? '남' : '여'}, ${c.job_name || '사무직'})</option>`;
    });

    if (diagSelect) diagSelect.innerHTML = options;
    if (calcSelect) calcSelect.innerHTML = options;
    if (cgSelect) cgSelect.innerHTML = options;
}

function renderCustomerTable() {
    const tbody = document.getElementById('customer-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (customers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400">등록된 고객이 없습니다. 우측 상단 '신규 고객 등록'을 눌러주세요.</td></tr>`;
        return;
    }

    customers.forEach(c => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition";
        const genderLabel = c.gender === 'M' ? '<span class="text-blue-600 font-semibold">남</span>' : '<span class="text-rose-600 font-semibold">여</span>';
        const healthBadge = c.health_type === 'standard' 
            ? '<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs">표준체</span>'
            : (c.health_type === 'simple_355' 
                ? '<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-xs">간편 3.5.5</span>'
                : '<span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-xs">간편 3.3.5</span>');

        tr.innerHTML = `
            <td class="p-3 font-bold text-slate-900">${c.name}</td>
            <td class="p-3">${c.age}세 (${genderLabel})</td>
            <td class="p-3 text-slate-500">${c.birthdate}</td>
            <td class="p-3">${c.job_name || '-'} (${c.job_grade}급)</td>
            <td class="p-3">${healthBadge}</td>
            <td class="p-3 text-slate-600">${c.phone || '-'}</td>
            <td class="p-3 text-right space-x-1">
                <button onclick="selectCustomerForCalc(${c.id})" class="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-semibold">
                    비교설계
                </button>
                <button onclick="selectCustomerForDiag(${c.id})" class="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-xs font-semibold">
                    보장분석
                </button>
                <button onclick="deleteCustomer(${c.id})" class="p-1 text-slate-300 hover:text-rose-600 text-xs">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openCustomerModal() {
    document.getElementById('customer-modal').classList.remove('hidden');
}

function closeCustomerModal() {
    document.getElementById('customer-modal').classList.add('hidden');
    document.getElementById('customer-form').reset();
}

async function handleCustomerSubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('cust-name').value,
        gender: document.getElementById('cust-gender').value,
        birthdate: document.getElementById('cust-birthdate').value,
        job_grade: parseInt(document.getElementById('cust-job-grade').value),
        job_name: document.getElementById('cust-job-name').value,
        phone: document.getElementById('cust-phone').value,
        health_type: document.getElementById('cust-health-type').value,
        memo: document.getElementById('cust-memo').value,
        is_driver: true
    };

    const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        closeCustomerModal();
        await fetchCustomers();
        alert('신규 고객이 성공적으로 등록되었습니다.');
    } else {
        alert('고객 등록 중 오류가 발생했습니다.');
    }
}

async function deleteCustomer(id) {
    if (!confirm('해당 고객 데이터를 삭제하시겠습니까? 관련 설계 이력도 함께 삭제됩니다.')) return;
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    if (res.ok) {
        await fetchCustomers();
    }
}

function selectCustomerForCalc(id) {
    const c = customers.find(x => x.id === id);
    if (!c) return;
    switchTab('tab-calculate');
    document.getElementById('calc-cust-select').value = id;
    onCalcCustomerChange();
}

function selectCustomerForDiag(id) {
    const c = customers.find(x => x.id === id);
    if (!c) return;
    switchTab('tab-diagnose');
    document.getElementById('diag-cust-select').value = id;
    onDiagCustomerChange();
}

// ----------------- 보장 분석 모듈 -----------------
function renderDiagnosisInputs() {
    const container = document.getElementById('diag-inputs-container');
    if (!container) return;
    container.innerHTML = '';

    diagCoverages().forEach(c => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between text-xs py-1.5 border-b border-slate-100";
        div.innerHTML = `
            <div class="flex-1 pr-2">
                <span class="font-bold text-slate-800">${c.name}</span>
                <span class="text-[10px] text-slate-400 block">${c.category} · 권장: ${c.recommended_amount.toLocaleString()}만원</span>
            </div>
            <div class="w-32 flex items-center gap-1">
                <input type="number" id="diag-cov-${c.code}" value="0" step="${c.step || 500}" class="w-full text-right border border-slate-300 rounded px-2 py-1 text-xs font-semibold">
                <span class="text-slate-500 whitespace-nowrap">만원</span>
            </div>
        `;
        container.appendChild(div);
    });

    // 기본 레이더 차트 초기화
    initRadarChart();
}

function onDiagCustomerChange() {
    const select = document.getElementById('diag-cust-select');
    const custId = parseInt(select.value);
    if (!custId) return;
    const cust = customers.find(c => c.id === custId);
    if (cust) {
        document.getElementById('diag-age').value = cust.age;
        document.getElementById('diag-gender').value = cust.gender;
    }
}

function initRadarChart() {
    const ctx = document.getElementById('radarChart');
    if (!ctx) return;

    if (radarChartInstance) {
        radarChartInstance.destroy();
    }

    const labels = diagCoverages().map(c => c.name.length > 7 ? c.name.substring(0, 7) + '..' : c.name);

    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '권장 보장 기준 (100%)',
                    data: diagCoverages().map(() => 100),
                    borderColor: 'rgba(59, 130, 246, 0.4)',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    borderWidth: 1.5,
                    borderDash: [4, 4],
                    pointRadius: 2
                },
                {
                    label: '고객 현재 보장 상태',
                    data: diagCoverages().map(() => 0),
                    borderColor: 'rgba(239, 68, 68, 0.9)',
                    backgroundColor: 'rgba(239, 68, 68, 0.25)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 120,
                    ticks: { display: false, stepSize: 30 },
                    pointLabels: {
                        font: { size: 10, weight: 'bold' },
                        color: '#475569'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 10, font: { size: 11 } }
                }
            }
        }
    });
}

async function runDiagnosis() {
    const age = parseInt(document.getElementById('diag-age').value) || 40;
    const gender = document.getElementById('diag-gender').value;
    const custSelect = document.getElementById('diag-cust-select');
    const customerId = custSelect.value ? parseInt(custSelect.value) : null;

    const existingCoverages = diagCoverages().map(c => {
        const val = parseInt(document.getElementById(`diag-cov-${c.code}`).value) || 0;
        return { code: c.code, current_amount: val };
    });

    let diagResult = null;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const res = await fetch('/api/diagnose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                customer_id: customerId,
                age: age,
                gender: gender,
                existing_coverages: existingCoverages
            })
        });
        clearTimeout(timeoutId);
        if (res.ok) diagResult = await res.json();
    } catch (err) {}

    if (!diagResult && window.ClientCalculationEngine && window.ClientCalculationEngine.diagnoseCoverage) {
        try {
            diagResult = window.ClientCalculationEngine.diagnoseCoverage({
                customer_id: customerId,
                age: age,
                gender: gender,
                existing_coverages: existingCoverages
            });
        } catch (engineErr) {
            console.error('Client diagnose engine error:', engineErr);
        }
    }

    if (diagResult) {
        currentDiagnosisResult = diagResult;
        renderDiagnosisResults(currentDiagnosisResult);
    }
}

function renderDiagnosisResults(data) {
    const scoreVal = document.getElementById('diag-score-val');
    const scoreBadge = document.getElementById('diag-score-badge');
    const summaryText = document.getElementById('diag-summary-text');
    const actionsList = document.getElementById('diag-actions-list');

    scoreVal.innerText = `${data.overall_score}점`;
    summaryText.innerText = data.summary_message;

    if (data.overall_score >= 80) {
        scoreVal.className = "text-5xl font-black text-emerald-600";
        scoreBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800";
        scoreBadge.innerText = "보장 충족 (안전)";
    } else if (data.overall_score >= 50) {
        scoreVal.className = "text-5xl font-black text-amber-500";
        scoreBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800";
        scoreBadge.innerText = "보장 보통 (일부 공백)";
    } else {
        scoreVal.className = "text-5xl font-black text-rose-600";
        scoreBadge.className = "px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800";
        scoreBadge.innerText = "보장 취약 (즉시 보강 필요)";
    }

    // 액션 리스트 렌더링
    actionsList.innerHTML = '';
    data.recommended_actions.forEach(action => {
        const li = document.createElement('li');
        li.className = "flex items-start gap-1.5";
        li.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-rose-500 mt-0.5"></i> <span>${action}</span>`;
        actionsList.appendChild(li);
    });

    // 레이더 차트 데이터 업데이트
    if (radarChartInstance) {
        const percentages = data.coverage_details.map(d => {
            if (d.recommended_amount === 0) return 100;
            return Math.min(120, Math.round((d.current_amount / d.recommended_amount) * 100));
        });
        radarChartInstance.data.datasets[1].data = percentages;
        radarChartInstance.update();
    }
}

function applyDeficitToCalculator() {
    if (!currentDiagnosisResult) {
        alert('먼저 보장 분석을 실행해 주세요.');
        return;
    }

    // 분석에서 부족한 담보 gap_amount를 설계기 입력창에 세팅
    currentDiagnosisResult.coverage_details.forEach(d => {
        const input = document.getElementById(`calc-amt-${d.code}`);
        if (input) {
            input.value = d.gap_amount > 0 ? d.gap_amount : d.recommended_amount;
        }
    });

    // 고객 정보 동기화
    const custSelect = document.getElementById('diag-cust-select');
    if (custSelect.value) {
        document.getElementById('calc-cust-select').value = custSelect.value;
        onCalcCustomerChange();
    } else {
        document.getElementById('calc-age').value = document.getElementById('diag-age').value;
        document.getElementById('calc-gender').value = document.getElementById('diag-gender').value;
    }

    switchTab('tab-calculate');
    enforcePresetExclusions();
    triggerCalculation();
}

// ----------------- 8대 손보사 비교설계 모듈 -----------------
// 담보 묶음(암/뇌/심장/수술비/배상책임/운전자) 표시 순서와 스타일
const GROUP_ORDER = ['암', '뇌', '심장', '수술비', '배상책임', '운전자'];
const CORE_GROUPS = ['암', '뇌', '심장'];
const GROUP_STYLE = {
    '암':      { icon: 'fa-ribbon',      color: 'text-rose-700',   bg: 'bg-rose-50',   border: 'border-rose-200',   label: '암 관련 특약' },
    '뇌':      { icon: 'fa-brain',       color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', label: '뇌혈관 관련 특약' },
    '심장':    { icon: 'fa-heart-pulse', color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    label: '심장 관련 특약' },
    '수술비':  { icon: 'fa-scissors',    color: 'text-slate-700',  bg: 'bg-slate-100', border: 'border-slate-200',  label: '수술비 (일반)' },
    '배상책임': { icon: 'fa-umbrella',    color: 'text-slate-700',  bg: 'bg-slate-100', border: 'border-slate-200',  label: '배상책임' },
    '운전자':  { icon: 'fa-car',         color: 'text-slate-700',  bg: 'bg-slate-100', border: 'border-slate-200',  label: '운전자' }
};

// 담보 구성 프리셋
let calcPreset = 'core3';

// 특약별 소비자 갱신/비갱신 선택 저장소: { [code]: 'non_renewable' | 'renewable' }
let riderRenewalSettings = {};

// 인기 순위 배지
function popularityBadge(rank) {
    if (!rank) return '';
    if (rank <= 5) {
        return `<span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold shrink-0"><i class="fa-solid fa-fire"></i> 인기 ${rank}위</span>`;
    }
    if (rank <= 15) {
        return `<span class="text-[9px] px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 font-semibold shrink-0">인기 ${rank}위</span>`;
    }
    return `<span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-400 shrink-0">인기 ${rank}위</span>`;
}

// 갱신/비갱신 배지 및 안내
function renewalBadgeAndSelector(c) {
    if (c.is_renewable_only) {
        return `
            <div class="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span class="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    <i class="fa-solid fa-arrows-rotate text-[9px]"></i> 갱신형만 가능한 특약 (${c.renewal_cycle || '3~5년 갱신'})
                </span>
                <span class="text-slate-400 text-[10px]">8대 손보사 공통</span>
            </div>
            <div class="text-[10px] text-purple-800/90 bg-purple-50/50 p-1.5 rounded mt-0.5 leading-snug">
                <i class="fa-solid fa-circle-info"></i> ${c.renewal_desc}
            </div>
        `;
    }

    const currentChoice = riderRenewalSettings[c.code] || 'non_renewable';
    const isNonRenew = currentChoice === 'non_renewable';

    return `
        <div class="mt-1 pt-1 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px]">
            <div class="flex items-center gap-1">
                <span class="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    <i class="fa-solid fa-sliders text-[9px]"></i> 갱신/비갱신 선택가능
                </span>
                <span class="text-slate-400 text-[10px]">소비자 직접선택</span>
            </div>
            <div class="inline-flex rounded-md shadow-xs text-[10px] border border-slate-200 overflow-hidden shrink-0" role="group">
                <button type="button" id="btn-renew-${c.code}-non" onclick="setRiderRenewal('${c.code}', 'non_renewable')" class="px-2 py-0.5 font-bold transition whitespace-nowrap tracking-tight ${isNonRenew ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}">
                    비갱신형(안정)
                </button>
                <button type="button" id="btn-renew-${c.code}-ren" onclick="setRiderRenewal('${c.code}', 'renewable')" class="px-2 py-0.5 font-bold transition whitespace-nowrap tracking-tight ${!isNonRenew ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}">
                    갱신형(초기할인)
                </button>
            </div>
        </div>
        <div class="text-[10px] text-slate-400 leading-snug mt-0.5 break-keep">
            ${c.renewal_desc}
        </div>
    `;
}

function renderCalculatorInputs() {
    const container = document.getElementById('calc-coverages-container');
    if (!container) return;
    container.innerHTML = '';

    GROUP_ORDER.forEach(group => {
        const items = standardCoverages.filter(c => c.group === group);
        if (items.length === 0) return;
        const st = GROUP_STYLE[group];

        const det = document.createElement('details');
        det.className = `rounded-lg border ${st.border} overflow-hidden`;
        if (CORE_GROUPS.includes(group)) det.open = true;

        const btnCls = "px-1.5 py-0.5 rounded bg-white border border-slate-300 hover:bg-slate-100 text-[10px] font-semibold text-slate-700";
        det.innerHTML = `
            <summary class="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer ${st.bg} select-none">
                <span class="font-bold text-xs ${st.color} flex items-center gap-1.5">
                    <i class="fa-solid ${st.icon}"></i> ${st.label}
                    <span id="grp-count-${group}" class="text-[10px] font-semibold text-slate-500">0/${items.length}개</span>
                </span>
                <span class="flex gap-1" onclick="event.stopPropagation()">
                    <button type="button" onclick="event.preventDefault(); setGroup('${group}', 'all')" class="${btnCls}">전체 넣기</button>
                    <button type="button" onclick="event.preventDefault(); setGroup('${group}', 'core')" class="${btnCls}">핵심만</button>
                    <button type="button" onclick="event.preventDefault(); setGroup('${group}', 'none')" class="${btnCls}">모두 빼기</button>
                </span>
            </summary>
            <div class="p-2 space-y-2.5 bg-white"></div>
        `;
        const body = det.querySelector('div.p-2');

        items.forEach(c => {
            const row = document.createElement('div');
            row.id = `calc-row-${c.code}`;
            row.className = "p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5 transition";
            row.innerHTML = `
                <div class="flex items-center justify-between gap-2">
                    <label class="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                        <input type="checkbox" id="calc-chk-${c.code}" onchange="onRiderToggle('${c.code}')" class="w-4 h-4 accent-rose-600 shrink-0">
                        <span class="font-bold text-slate-800">${c.name}</span>
                        ${popularityBadge(c.popularity)}
                        <span class="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">${c.sub || ''}</span>
                    </label>
                    <div class="flex items-center gap-1 shrink-0">
                        <input type="number" id="calc-amt-${c.code}" value="${c.recommended_amount}" data-last="${c.recommended_amount}" step="${c.step || 500}" min="0" max="${c.max}" onchange="onAmountChange('${c.code}')" class="w-16 text-right border border-slate-300 rounded px-1.5 py-0.5 font-bold text-slate-900 bg-white">
                        <span class="text-slate-500 text-[10px] font-semibold w-10">${c.unit}</span>
                    </div>
                </div>
                <div class="text-[10px] text-slate-500 leading-snug">${c.description}</div>
                ${c.tip ? `<div class="text-[10px] text-blue-700/80 leading-snug"><i class="fa-regular fa-lightbulb"></i> ${c.tip}</div>` : ''}
                ${renewalBadgeAndSelector(c)}
                ${c.code === 'cov_cancer_sim' ? '<div id="sim-cancer-link-notice" class="transition-all duration-300"></div>' : ''}
            `;
            body.appendChild(row);
        });

        container.appendChild(det);
    });

    // 기본 프리셋 적용
    applyPreset(calcPreset, false);
    if (typeof syncSimilarCancerAmount === 'function') syncSimilarCancerAmount('init');
}

// 개별 특약 갱신/비갱신 변경
function setRiderRenewal(code, type) {
    riderRenewalSettings[code] = type;
    updateRiderRenewalButtons(code);
    triggerCalculation();
}

function updateRiderRenewalButtons(code) {
    const btnNon = document.getElementById(`btn-renew-${code}-non`);
    const btnRen = document.getElementById(`btn-renew-${code}-ren`);
    if (!btnNon || !btnRen) return;

    const currentChoice = riderRenewalSettings[code] || 'non_renewable';
    if (currentChoice === 'non_renewable') {
        btnNon.className = "px-2 py-0.5 font-bold transition whitespace-nowrap tracking-tight bg-blue-600 text-white";
        btnRen.className = "px-2 py-0.5 font-bold transition whitespace-nowrap tracking-tight bg-white text-slate-600 hover:bg-slate-50";
    } else {
        btnRen.className = "px-2 py-0.5 font-bold transition whitespace-nowrap tracking-tight bg-amber-600 text-white";
        btnNon.className = "px-2 py-0.5 font-bold transition whitespace-nowrap tracking-tight bg-white text-slate-600 hover:bg-slate-50";
    }
}

// 전체 선택가능 특약 일괄 갱신형/비갱신형 변경
function setAllSelectableRenewal(type) {
    standardCoverages.forEach(c => {
        if (!c.is_renewable_only) {
            riderRenewalSettings[c.code] = type;
            updateRiderRenewalButtons(c.code);
        }
    });

    const btnNon = document.getElementById('btn-global-non-renew');
    const btnRen = document.getElementById('btn-global-renew');
    if (btnNon && btnRen) {
        if (type === 'non_renewable') {
            btnNon.className = "px-2 py-1 rounded bg-blue-600 text-white font-bold text-[10.5px] shadow transition whitespace-nowrap tracking-tight flex items-center gap-1";
            btnRen.className = "px-2 py-1 rounded bg-white border border-slate-300 text-slate-700 font-bold text-[10.5px] hover:bg-slate-50 transition whitespace-nowrap tracking-tight flex items-center gap-1";
        } else {
            btnRen.className = "px-2 py-1 rounded bg-amber-600 text-white font-bold text-[10.5px] shadow transition whitespace-nowrap tracking-tight flex items-center gap-1";
            btnNon.className = "px-2 py-1 rounded bg-white border border-slate-300 text-slate-700 font-bold text-[10.5px] hover:bg-slate-50 transition whitespace-nowrap tracking-tight flex items-center gap-1";
        }
    }
    triggerCalculation();
}

// 특약 1건을 넣거나 뺀다
function setRider(code, on) {
    const input = document.getElementById(`calc-amt-${code}`);
    const cov = standardCoverages.find(c => c.code === code);
    if (!input || !cov) return;
    if (on) {
        input.value = parseInt(input.dataset.last) || cov.recommended_amount;
    } else {
        if (parseInt(input.value) > 0) input.dataset.last = input.value;
        input.value = 0;
    }
}

function onRiderToggle(code) {
    const chk = document.getElementById(`calc-chk-${code}`);
    setRider(code, chk.checked);

    // [유사암 20% 한도 연동] 일반암/통합암/유사암 상태 변경 시 연동 처리
    if (typeof syncSimilarCancerAmount === 'function') {
        if (code === 'cov_cancer_gen' || code === 'cov_cancer_group_multi') {
            syncSimilarCancerAmount(code === 'cov_cancer_gen' ? 'gen' : 'group');
        } else if (code === 'cov_cancer_sim') {
            syncSimilarCancerAmount(chk.checked ? 'sim_chk_on' : 'sim_chk_off');
        }
    }

    markCustomPreset();
    triggerCalculation();
}

function onAmountChange(code) {
    const input = document.getElementById(`calc-amt-${code}`);
    const v = parseInt(input.value) || 0;
    if (v > 0) input.dataset.last = v;

    // [유사암 20% 한도 연동] 금액 변경 시 실시간 연동
    if (typeof syncSimilarCancerAmount === 'function') {
        if (code === 'cov_cancer_gen' || code === 'cov_cancer_group_multi') {
            syncSimilarCancerAmount(code === 'cov_cancer_gen' ? 'gen' : 'group');
        } else if (code === 'cov_cancer_sim') {
            syncSimilarCancerAmount('sim_amt');
        }
    }

    markCustomPreset();
    triggerCalculation();
}

function setGroup(group, mode) {
    standardCoverages.filter(c => c.group === group).forEach(c => {
        const on = mode === 'all' ? true : (mode === 'core' ? !!c.default_on : false);
        setRider(c.code, on);
    });
    if (group === '암' && typeof syncSimilarCancerAmount === 'function') {
        syncSimilarCancerAmount('group');
    }
    markCustomPreset();
    triggerCalculation();
}

function setCoverageAmount(code, amount) {
    const input = document.getElementById(`calc-amt-${code}`);
    if (input) {
        input.value = amount;
        if (amount > 0) input.dataset.last = amount;
        if (typeof syncSimilarCancerAmount === 'function') {
            if (code === 'cov_cancer_gen' || code === 'cov_cancer_group_multi') {
                syncSimilarCancerAmount(code === 'cov_cancer_gen' ? 'gen' : 'group');
            } else if (code === 'cov_cancer_sim') {
                syncSimilarCancerAmount('sim_amt');
            }
        }
        markCustomPreset();
        triggerCalculation();
    }
}

function updatePresetButtons() {
    const on = "p-2 rounded-lg border-2 border-rose-500 bg-rose-50 text-rose-700 text-xs font-bold text-left transition break-keep";
    const off = "p-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-bold text-left transition break-keep";
    const map = { core3: 'preset-btn-core3', core3_full: 'preset-btn-full', all: 'preset-btn-all' };
    Object.entries(map).forEach(([key, id]) => {
        const el = document.getElementById(id);
        if (el) el.className = (calcPreset === key) ? on : off;
    });
}

function markCustomPreset() {
    calcPreset = 'custom';
    updatePresetButtons();
}

function applyPreset(preset, recalc = true) {
    calcPreset = preset;
    standardCoverages.forEach(c => {
        const input = document.getElementById(`calc-amt-${c.code}`);
        if (!input) return;
        let on;
        if (preset === 'all') on = true;
        else if (preset === 'core3_full') on = CORE_GROUPS.includes(c.group);
        else on = !!c.default_on;
        input.value = on ? c.recommended_amount : 0;
        input.dataset.last = c.recommended_amount;
    });
    // 프리셋 적용 시 유사암 20% 한도 일괄 동기화
    if (typeof syncSimilarCancerAmount === 'function') syncSimilarCancerAmount('preset');
    updatePresetButtons();
    if (recalc) triggerCalculation();
}

function enforcePresetExclusions() {
    if (calcPreset !== 'core3' && calcPreset !== 'core3_full') return;
    standardCoverages.forEach(c => {
        if (!CORE_GROUPS.includes(c.group)) setRider(c.code, false);
    });
}

function syncRiderUI() {
    const counts = {};
    let total = 0;
    standardCoverages.forEach(c => {
        const input = document.getElementById(`calc-amt-${c.code}`);
        const chk = document.getElementById(`calc-chk-${c.code}`);
        const row = document.getElementById(`calc-row-${c.code}`);
        if (!input || !chk) return;
        const on = (parseInt(input.value) || 0) > 0;
        chk.checked = on;
        if (row) row.classList.toggle('opacity-50', !on);
        counts[c.group] = counts[c.group] || { on: 0, all: 0 };
        counts[c.group].all++;
        if (on) { counts[c.group].on++; total++; }
    });
    Object.entries(counts).forEach(([group, v]) => {
        const el = document.getElementById(`grp-count-${group}`);
        if (el) el.innerText = `${v.on}/${v.all}개`;
    });
    const totalEl = document.getElementById('calc-selected-count');
    if (totalEl) totalEl.innerText = `선택 ${total}개 담보`;
}

function resetCoveragesToRecommended() {
    if (calcPreset === 'custom') {
        standardCoverages.forEach(c => {
            const input = document.getElementById(`calc-amt-${c.code}`);
            if (input && (parseInt(input.value) || 0) > 0) input.value = c.recommended_amount;
            if (input) input.dataset.last = c.recommended_amount;
        });
        triggerCalculation();
    } else {
        applyPreset(calcPreset);
    }
}

function onCalcCustomerChange() {
    const select = document.getElementById('calc-cust-select');
    const custId = parseInt(select.value);
    if (!custId) return;
    const cust = customers.find(c => c.id === custId);
    if (cust) {
        document.getElementById('calc-name').value = cust.name;
        document.getElementById('calc-gender').value = cust.gender;
        document.getElementById('calc-age').value = cust.age;
        document.getElementById('calc-job').value = cust.job_grade;
        document.getElementById('calc-health').value = cust.health_type;
        triggerCalculation();
    }
}

async function triggerCalculation() {
    if (typeof syncSimilarCancerAmount === 'function') syncSimilarCancerAmount('trigger');
    syncRiderUI();
    const name = document.getElementById('calc-name')?.value || '고객';
    const gender = document.getElementById('calc-gender')?.value || 'M';
    const age = parseInt(document.getElementById('calc-age')?.value) || 40;
    const jobGrade = parseInt(document.getElementById('calc-job')?.value) || 1;
    const healthType = document.getElementById('calc-health')?.value || 'standard';
    const termVal = document.getElementById('calc-term')?.value || '20년납_90세만기';
    const [paymentPeriod, expiryPeriod] = termVal.split('_');

    const custSelect = document.getElementById('calc-cust-select');
    const customerId = (custSelect && custSelect.value) ? parseInt(custSelect.value) : null;

    const coverages = standardCoverages.map(c => {
        const amtEl = document.getElementById(`calc-amt-${c.code}`);
        const val = amtEl ? (parseInt(amtEl.value) || 0) : 0;
        const rType = c.is_renewable_only ? 'renewable' : (riderRenewalSettings[c.code] || 'non_renewable');
        return { code: c.code, amount: val, renewal_type: rType };
    });

    let calcResult = null;

    // 1. 백엔드 API 시도 (1.5초 타임아웃으로 오프라인 시 지연 없이 즉시 자체 엔진 가동)
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const res = await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                customer_id: customerId,
                gender: gender,
                age: age,
                job_grade: jobGrade,
                health_type: healthType,
                payment_period: paymentPeriod,
                expiry_period: expiryPeriod,
                coverages: coverages
            })
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            calcResult = await res.json();
        }
    } catch (err) {
        // 서버 미가동 또는 정적 파일(file:/// 또는 GitHub Pages) 모드
    }

    // 2. 백엔드 미응답 시 100% 독립 클라이언트 연산 엔진(standalone_engine.js)으로 즉시 산출
    if (!calcResult && window.ClientCalculationEngine && window.ClientCalculationEngine.calculateMultiQuote) {
        try {
            calcResult = window.ClientCalculationEngine.calculateMultiQuote({
                customer_id: customerId,
                customer_name: name,
                gender: gender,
                age: age,
                job_grade: jobGrade,
                health_type: healthType,
                payment_period: paymentPeriod,
                expiry_period: expiryPeriod,
                coverages: coverages
            });
        } catch (engineErr) {
            console.error('Client calculation engine error:', engineErr);
        }
    }

    if (calcResult) {
        currentQuoteResult = calcResult;
        renderQuoteResults(currentQuoteResult);
        updateRPAPayload();
    }
}

function renderQuoteResults(data) {
    if (!data || !data.quotes) return;

    // 요약 하이라이트
    const recInsurer = data.quotes.find(q => q.is_recommended) || data.quotes[0];
    const cheapest = data.quotes[0];

    const recEl = document.getElementById('summary-rec-insurer');
    if (recEl) recEl.innerText = recInsurer.insurer_name;
    const lowEl = document.getElementById('summary-lowest-premium');
    if (lowEl) lowEl.innerText = `${cheapest.total_monthly_premium.toLocaleString()}원`;

    // 10년 무사고 고지 할인 감지 및 설명 강조
    const maxDiscQuote = [...data.quotes].sort((a, b) => (b.discount_amount || 0) - (a.discount_amount || 0))[0];
    const hasDiscount = maxDiscQuote && (maxDiscQuote.discount_amount || 0) > 0;

    let descText = `총 8개사 중 ${recInsurer.insurer_name}이 최적 조건 (${recInsurer.product_name})`;
    if (hasDiscount) {
        descText += `<br><span class="inline-flex items-center gap-1.5 mt-1 text-emerald-300 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/60 text-xs">
            <i class="fa-solid fa-tags text-emerald-400"></i>
            10년 무사고 할인 적용: 표준체 대비 월 최대 <strong>${maxDiscQuote.discount_amount.toLocaleString()}원 (-${maxDiscQuote.discount_rate}%)</strong> 절감! (20년 총 <strong>${(maxDiscQuote.discount_amount * 12 * 20).toLocaleString()}원</strong> SAVE)
        </span>`;
        document.getElementById('summary-rec-desc').innerHTML = descText;
    } else {
        document.getElementById('summary-rec-desc').innerText = descText;
    }

    // 설계사 예상 수당 배지 갱신
    const commBadge = document.getElementById('summary-commission-badge');
    if (commBadge && recInsurer.commission_total) {
        const share = (selectedCommissionShare || 75) / 100.0;
        const myIncome = Math.round(recInsurer.commission_total * share);
        commBadge.innerHTML = `<i class="fa-solid fa-sack-dollar text-amber-400"></i> ${recInsurer.insurer_name} 예상수당: 약 <span class="text-white font-bold">${myIncome.toLocaleString()}원</span> (지급률 ${selectedCommissionShare || 75}%)`;
    }

    // 순위 카드 렌더링
    const rankContainer = document.getElementById('quotes-ranking-cards');
    rankContainer.innerHTML = '';

    const share = (selectedCommissionShare || 75) / 100.0;
    data.quotes.forEach(q => {
        const card = document.createElement('div');
        const isBest = q.is_recommended;
        const fcIncome = Math.round((q.commission_total || 0) * share);
        const isDiscounted = (q.discount_amount || 0) > 0;

        card.className = `p-3 rounded-xl border text-xs flex flex-col justify-between transition ${
            isBest ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/40 shadow-md' : 'bg-white border-slate-200 hover:shadow-sm'
        }`;

        let priceBlock = '';
        if (isDiscounted) {
            priceBlock = `
                <div class="mt-1.5">
                    <div class="flex items-center justify-between text-[11px] text-slate-400">
                        <span>표준체: <del>${(q.standard_monthly_premium || q.total_monthly_premium).toLocaleString()}원</del></span>
                        <span class="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">-${q.discount_rate}%</span>
                    </div>
                    <div class="text-base font-black text-emerald-800 flex items-baseline justify-between mt-0.5">
                        <span>${q.total_monthly_premium.toLocaleString()}<span class="text-xs font-normal text-slate-500">원/월</span></span>
                        <span class="text-[10px] text-emerald-700 font-bold">-${q.discount_amount.toLocaleString()}원</span>
                    </div>
                    <div class="mt-1 px-1.5 py-0.5 rounded bg-emerald-100/80 text-[10px] text-emerald-900 font-bold flex justify-between items-center">
                        <span>10년 무사고 고지</span>
                        <span>20년 ${(q.discount_amount * 12 * 20).toLocaleString()}원 절감</span>
                    </div>
                </div>
            `;
        } else {
            priceBlock = `
                <div class="text-sm font-black text-slate-900 mt-2">
                    ${q.total_monthly_premium.toLocaleString()}원
                </div>
            `;
        }

        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between mb-1">
                    <span class="font-bold text-slate-800 truncate">${q.insurer_name}</span>
                    <span class="text-[10px] font-black ${q.rank === 1 ? 'text-rose-600' : 'text-slate-400'}">${q.rank}위</span>
                </div>
                <div class="text-[10px] text-slate-500 line-clamp-1" title="${q.product_name}">${q.product_name}</div>
                ${priceBlock}
            </div>
            <div class="mt-2 pt-1 border-t border-slate-100 flex flex-col gap-0.5 text-[10px] text-slate-500">
                <div class="flex justify-between items-center">
                    <span>시책: ${q.commission_est}</span>
                    ${isBest ? '<span class="text-rose-600 font-bold">추천</span>' : ''}
                </div>
                <div class="text-[10px] font-bold text-amber-700 flex justify-between items-center">
                    <span>수당(${selectedCommissionShare || 75}%):</span>
                    <span>약 ${fcIncome.toLocaleString()}원</span>
                </div>
            </div>
        `;
        rankContainer.appendChild(card);
    });

    // 매트릭스 테이블 렌더링
    renderMatrixTable(data);
}

function renderMatrixTable(data) {
    const table = document.getElementById('matrix-table');
    if (!table) return;

    let headerHtml = `
        <thead>
            <tr class="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th class="p-2.5 font-bold min-w-[150px]">담보명 (설정금액 / 갱신형태)</th>
    `;

    data.quotes.forEach(q => {
        headerHtml += `
            <th class="p-2 text-center min-w-[90px] ${q.is_recommended ? 'bg-rose-100/60 text-rose-900 font-black' : ''}">
                <div>${q.insurer_name}</div>
                <div class="text-[10px] font-normal text-slate-500">${q.rank}위</div>
            </th>
        `;
    });
    headerHtml += `</tr></thead>`;

    let bodyHtml = `<tbody class="divide-y divide-slate-100">`;

    // 담보별 행 (암/뇌/심장... 묶음별로 구분하고 묶음 소계 표시)
    const colSpan = data.quotes.length + 1;
    GROUP_ORDER.forEach(group => {
        const included = standardCoverages.filter(cov => {
            if (cov.group !== group) return false;
            const amtInput = document.getElementById(`calc-amt-${cov.code}`);
            const curAmt = amtInput ? parseInt(amtInput.value) || 0 : 0;
            return curAmt > 0;
        });
        if (included.length === 0) return;

        const st = GROUP_STYLE[group];
        bodyHtml += `
            <tr class="${st.bg}">
                <td colspan="${colSpan}" class="p-2 font-bold text-xs ${st.color}">
                    <i class="fa-solid ${st.icon}"></i> ${st.label} (${included.length}개 선택됨)
                </td>
            </tr>
        `;

        included.forEach(cov => {
            const curAmt = parseInt(document.getElementById(`calc-amt-${cov.code}`).value) || 0;
            const isRenewOnly = cov.is_renewable_only;
            const currentChoice = isRenewOnly ? 'renewable' : (riderRenewalSettings[cov.code] || 'non_renewable');

            let renewalBadge = '';
            if (isRenewOnly) {
                renewalBadge = `<span class="inline-block text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold border border-purple-200 mt-0.5" title="${cov.renewal_desc}">갱신형 전용 (${cov.renewal_cycle})</span>`;
            } else if (currentChoice === 'renewable') {
                renewalBadge = `<span class="inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200 mt-0.5" title="소비자 선택: 갱신형 (초기 약 55% 할인)">선택: 갱신형</span>`;
            } else {
                renewalBadge = `<span class="inline-block text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200 mt-0.5" title="소비자 선택: 비갱신형 (만기까지 보험료 불변)">선택: 비갱신형</span>`;
            }

            // 해당 담보의 8개사 중 최저가 찾기
            const premiums = data.quotes.map(q => q.coverage_breakdown[cov.code] || 0);
            const minPrem = Math.min(...premiums.filter(p => p > 0));

            bodyHtml += `
                <tr class="hover:bg-slate-50">
                    <td class="p-2 font-medium text-slate-800">
                        <div class="flex items-center gap-1.5">
                            <span>${cov.name}</span>
                            ${popularityBadge(cov.popularity)}
                        </div>
                        <div class="text-[10px] text-slate-500 font-normal mt-0.5">
                            ${curAmt.toLocaleString()}${cov.unit} · ${renewalBadge}
                        </div>
                    </td>
            `;

            data.quotes.forEach(q => {
                const prem = q.coverage_breakdown[cov.code] || 0;
                const isLowest = (prem === minPrem && prem > 0);
                bodyHtml += `
                    <td class="p-2 text-center ${isLowest ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600'}">
                        <div>${prem.toLocaleString()}원</div>
                        ${isLowest ? '<span class="inline-block text-[9px] text-emerald-600 font-normal">최저가</span>' : ''}
                    </td>
                `;
            });

            bodyHtml += `</tr>`;
        });

        // 묶음 소계 (보험사별)
        const subtotals = data.quotes.map(q =>
            included.reduce((sum, cov) => sum + (q.coverage_breakdown[cov.code] || 0), 0)
        );
        const minSub = Math.min(...subtotals);
        bodyHtml += `
            <tr class="bg-slate-50 border-t border-slate-200 font-semibold text-slate-700">
                <td class="p-2 text-xs">${st.label} 소계</td>
                ${subtotals.map(s => `
                    <td class="p-2 text-center text-xs ${s === minSub ? 'text-emerald-700 font-bold' : ''}">${s.toLocaleString()}원</td>
                `).join('')}
            </tr>
        `;
    });

    // 10년 무사고 고지 할인 행 (표준체 가격과 비교 제시)
    const hasDiscount = data.quotes.some(q => (q.discount_amount || 0) > 0);
    if (hasDiscount) {
        bodyHtml += `
            <tr class="bg-amber-50/60 text-[11px] text-slate-600 border-t-2 border-amber-300">
                <td class="p-2.5 font-bold">
                    <div class="flex items-center gap-1.5 text-slate-700">
                        <i class="fa-regular fa-calendar-check text-amber-600"></i>
                        <span>표준체 기준 월 보험료 (할인 전 정상가)</span>
                    </div>
                </td>
        `;
        data.quotes.forEach(q => {
            const stdVal = q.standard_monthly_premium || q.total_monthly_premium;
            bodyHtml += `
                <td class="p-2 text-center line-through text-slate-400">
                    ${stdVal.toLocaleString()}원
                </td>
            `;
        });
        bodyHtml += `</tr>`;

        bodyHtml += `
            <tr class="bg-emerald-50 text-[11px] font-bold text-emerald-900 border-b border-emerald-300">
                <td class="p-2.5">
                    <div class="flex items-center justify-between">
                        <span class="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                            <i class="fa-solid fa-tags text-emerald-600"></i>
                            <span>10년 무사고 할인 금액 (월 절감액 / 20년 총액)</span>
                        </span>
                        <span class="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-extrabold">할인 제시</span>
                    </div>
                </td>
        `;
        data.quotes.forEach(q => {
            const discAmt = q.discount_amount || 0;
            const discRt = q.discount_rate || 0.0;
            bodyHtml += `
                <td class="p-2 text-center text-emerald-700">
                    <div>-${discAmt.toLocaleString()}원 <span class="text-[10px] font-normal">(-${discRt}%)</span></div>
                    <div class="text-[10px] text-emerald-600 font-normal">20년 -${(discAmt * 12 * 20).toLocaleString()}원</div>
                </td>
            `;
        });
        bodyHtml += `</tr>`;
    }

    // 최종 합계 행
    bodyHtml += `
        <tr class="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
            <td class="p-2.5">
                <div>총 합계 월 보험료</div>
                ${hasDiscount ? '<span class="text-[10px] text-emerald-700 font-normal">(10년 무사고 고지 할인 최종 반영)</span>' : ''}
            </td>
    `;
    data.quotes.forEach(q => {
        bodyHtml += `
            <td class="p-2 text-center ${q.is_recommended ? 'text-rose-600 text-sm font-black' : ''}">
                ${q.total_monthly_premium.toLocaleString()}원
            </td>
        `;
    });
    bodyHtml += `</tr></tbody>`;

    table.innerHTML = headerHtml + bodyHtml;
}

// ----------------- 고객 맞춤 제안서 인쇄 모달 -----------------
function openPrintModal() {
    if (!currentQuoteResult) {
        alert('먼저 비교설계를 실행해 주세요.');
        return;
    }

    const modal = document.getElementById('print-modal');
    modal.classList.remove('hidden');

    const custName = document.getElementById('calc-name').value || '고객';
    const age = document.getElementById('calc-age').value;
    const gender = document.getElementById('calc-gender').value === 'M' ? '남성' : '여성';
    const job = document.getElementById('calc-job').value;
    const health = document.getElementById('calc-health').selectedOptions[0].text;
    const term = document.getElementById('calc-term').selectedOptions[0].text;

    document.getElementById('print-cust-name').innerText = custName;
    document.getElementById('print-p-name').innerText = custName;
    document.getElementById('print-p-age').innerText = `만 ${age}세 (${gender})`;
    document.getElementById('print-p-job').innerText = `${job}급 (${health})`;
    document.getElementById('print-p-term').innerText = term;

    // 대리점 정보
    if (agencySettings) {
        document.getElementById('print-agency-name').innerText = agencySettings.agency_name || '인슈탑 법인보험대리점(GA)';
        document.getElementById('print-agent-name').innerText = agencySettings.agent_name || '수석설계사';
        document.getElementById('print-agent-contact').innerText = agencySettings.agent_contact || '010-1234-5678';
    }

    // 작성일
    const now = new Date();
    document.getElementById('print-date').innerText = `작성일: ${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}`;

    // 1위 및 2위 플랜
    const quotes = currentQuoteResult.quotes;
    const best = quotes[0];
    const second = quotes[1] || quotes[0];

    document.getElementById('print-best-insurer').innerText = best.insurer_name;
    document.getElementById('print-best-product').innerText = best.product_name;
    document.getElementById('print-best-premium').innerText = `월 ${best.total_monthly_premium.toLocaleString()}원`;
    document.getElementById('print-best-strength').innerText = `• ${best.strengths.join(' · ')}`;

    document.getElementById('print-second-insurer').innerText = second.insurer_name;
    document.getElementById('print-second-product').innerText = second.product_name;
    document.getElementById('print-second-premium').innerText = `월 ${second.total_monthly_premium.toLocaleString()}원`;
    document.getElementById('print-second-strength').innerText = `• ${second.strengths.join(' · ')}`;

    // 인쇄용 매트릭스 테이블
    const printTable = document.getElementById('print-matrix-table');
    printTable.innerHTML = document.getElementById('matrix-table').innerHTML;
}

function closePrintModal() {
    document.getElementById('print-modal').classList.add('hidden');
}

// ----------------- 설계사 예상 수당 및 시책 분석 모달 -----------------
let selectedCommissionShare = 75; // 기본 일반FC 75% 지급률

function openCommissionModal() {
    if (!currentQuoteResult) {
        alert('먼저 비교설계를 실행해 주세요.');
        return;
    }
    const modal = document.getElementById('commission-modal');
    modal.classList.remove('hidden');

    const name = document.getElementById('calc-name').value || '고객';
    const age = document.getElementById('calc-age').value;
    const gender = document.getElementById('calc-gender').value === 'M' ? '남성' : '여성';
    document.getElementById('comm-cust-summary').innerText = `${name} 고객님 (만 ${age}세, ${gender})`;

    renderCommissionTable();
}

function closeCommissionModal() {
    document.getElementById('commission-modal').classList.add('hidden');
}

function setCommissionShare(share) {
    selectedCommissionShare = share;
    [100, 85, 75, 65].forEach(s => {
        const btn = document.getElementById(`btn-share-${s}`);
        if (btn) {
            btn.className = (s === share)
                ? "px-2.5 py-1 rounded text-xs font-bold transition bg-amber-600 text-white shadow-xs"
                : "px-2.5 py-1 rounded text-xs font-bold transition text-slate-600 hover:bg-slate-100";
        }
    });
    document.getElementById('comm-share-display').innerText = `${share}%`;
    renderCommissionTable();
    if (currentQuoteResult) renderQuoteResults(currentQuoteResult);
}

function renderCommissionTable() {
    if (!currentQuoteResult || !currentQuoteResult.quotes) return;
    const tbody = document.getElementById('commission-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const share = selectedCommissionShare / 100.0;
    const sortedByIncome = [...currentQuoteResult.quotes].sort((a, b) => (b.commission_total || 0) - (a.commission_total || 0));
    const highestComm = sortedByIncome[0];

    sortedByIncome.forEach((q, idx) => {
        const total = Math.round((q.commission_total || 0) * share);
        const imm = Math.round((q.commission_immediate || 0) * share);
        const y1 = Math.round((q.commission_year1 || 0) * share);
        const y2 = Math.round((q.commission_year2 || 0) * share);
        const net = Math.round(total * (1.0 - 0.033));

        const tr = document.createElement('tr');
        tr.className = "hover:bg-amber-50/40 transition";
        tr.innerHTML = `
            <td class="p-3">
                <div class="flex items-center gap-1.5 font-bold text-slate-900">
                    <span class="text-[11px] font-black text-slate-400">${idx + 1}위</span>
                    <span>${q.insurer_name}</span>
                    ${idx === 0 ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">최대 수당</span>' : ''}
                </div>
                <div class="text-[10px] text-slate-500">${q.product_name}</div>
            </td>
            <td class="p-3 text-right font-semibold text-slate-800">${q.total_monthly_premium.toLocaleString()}원</td>
            <td class="p-3 text-center text-slate-600 font-bold">${q.commission_est}</td>
            <td class="p-3 text-right font-black text-amber-700 bg-amber-50/60 text-sm">약 ${total.toLocaleString()}원</td>
            <td class="p-3 text-right text-slate-700 font-semibold">${imm.toLocaleString()}원</td>
            <td class="p-3 text-right text-slate-600">${y1.toLocaleString()}원</td>
            <td class="p-3 text-right text-slate-500">${y2.toLocaleString()}원</td>
            <td class="p-3 text-right font-bold text-emerald-700">${net.toLocaleString()}원</td>
        `;
        tbody.appendChild(tr);
    });

    // 하단 코멘트 갱신
    const bestInc = document.getElementById('comm-best-income-desc');
    if (bestInc && highestComm) {
        bestInc.innerHTML = `현재 설계 기준 설계사 총 수당이 가장 큰 회사는 <b>${highestComm.insurer_name}</b> (지급률 ${selectedCommissionShare}% 기준 <b>약 ${Math.round(highestComm.commission_total * share).toLocaleString()}원</b>) 입니다.`;
    }
}

async function saveCurrentProposal() {
    if (!currentQuoteResult) return;
    const custSelect = document.getElementById('calc-cust-select');
    const custId = custSelect.value ? parseInt(custSelect.value) : (customers[0] ? customers[0].id : null);

    if (!custId) {
        alert('제안서를 저장할 고객을 먼저 선택하거나 등록해 주세요.');
        return;
    }

    const title = `${document.getElementById('calc-name').value} 고객 8대 손보사 비교설계안`;
    const coverages = standardCoverages.map(c => {
        const val = parseInt(document.getElementById(`calc-amt-${c.code}`).value) || 0;
        return { code: c.code, amount: val };
    });

    const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customer_id: custId,
            title: title,
            plan_type: 'standard_health',
            payment_period: '20년납',
            expiry_period: '90세만기',
            coverages: coverages,
            recommended_insurer_id: currentQuoteResult.quotes[0].insurer_id
        })
    });

    if (res.ok) {
        alert('비교설계 제안서가 DB에 성공적으로 저장되었습니다.');
        const propCountEl = document.getElementById('dash-prop-count');
        const cur = parseInt(propCountEl.innerText) || 0;
        propCountEl.innerText = `${cur + 1}건`;
    }
}

// ----------------- 원수사 전산 RPA 브릿지 -----------------
function renderRPAPanel() {
    const btnContainer = document.getElementById('rpa-insurers-buttons');
    if (!btnContainer) return;
    btnContainer.innerHTML = '';

    insurers.forEach(ins => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => selectRPAInsurer(ins.id);
        btn.className = "p-2.5 rounded-lg border border-slate-200 hover:border-purple-500 hover:bg-purple-50 text-left transition flex items-center justify-between";
        btn.innerHTML = `
            <div>
                <div class="font-bold text-xs text-slate-800">${ins.name}</div>
                <div class="text-[10px] text-slate-400">${ins.code} 포털</div>
            </div>
            <a href="${ins.portal_url}" target="_blank" onclick="event.stopPropagation()" class="text-xs text-blue-600 hover:text-blue-800">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        `;
        btnContainer.appendChild(btn);
    });

    // 기본 첫 번째 원수사 스크립트 로드
    selectRPAInsurer('meritz');
}

async function updateRPAPayload() {
    const customer = {
        name: document.getElementById('calc-name').value,
        gender: document.getElementById('calc-gender').value,
        age: parseInt(document.getElementById('calc-age').value) || 40,
        job_grade: parseInt(document.getElementById('calc-job').value) || 1,
        health_type: document.getElementById('calc-health').selectedOptions[0].text,
        birthdate: '1984-05-15',
        is_driver: true
    };

    const coverages = standardCoverages.map(c => {
        const val = parseInt(document.getElementById(`calc-amt-${c.code}`).value) || 0;
        return { name: c.name, code: c.code, amount: val };
    }).filter(c => c.amount > 0);

    const res = await fetch('/api/rpa/clipboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, coverages })
    });

    if (res.ok) {
        const data = await res.json();
        document.getElementById('rpa-clipboard-text').value = data.text;
    }
}

async function selectRPAInsurer(insurerId) {
    const customer = {
        name: document.getElementById('calc-name').value,
        gender: document.getElementById('calc-gender').value,
        age: parseInt(document.getElementById('calc-age').value) || 40,
        job_grade: parseInt(document.getElementById('calc-job').value) || 1,
        health_type: document.getElementById('calc-health').selectedOptions[0].text,
        birthdate: '1984-05-15'
    };

    const coverages = standardCoverages.map(c => {
        const val = parseInt(document.getElementById(`calc-amt-${c.code}`).value) || 0;
        return { name: c.name, code: c.code, amount: val };
    });

    const res = await fetch('/api/rpa/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insurer_id: insurerId, customer, coverages })
    });

    if (res.ok) {
        const data = await res.json();
        document.getElementById('rpa-script-preview').innerText = data.script;
    }
}

function copyRPAPayload() {
    const text = document.getElementById('rpa-clipboard-text').value;
    navigator.clipboard.writeText(text).then(() => {
        alert('전산 입력용 데이터가 클립보드에 복사되었습니다!\n원수사 전산 화면에서 붙여넣어(Ctrl+V) 활용하세요.');
    });
}

function downloadRPAScript() {
    const script = document.getElementById('rpa-script-preview').innerText;
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rpa_insurer_automation.py';
    a.click();
    URL.revokeObjectURL(url);
}

// ----------------- 대리점 설정 저장 -----------------
async function saveAgencySettings(e) {
    e.preventDefault();
    const payload = {
        agency_name: document.getElementById('set-agency-name').value,
        representative: document.getElementById('set-representative').value,
        registration_no: document.getElementById('set-reg-no').value,
        contact: document.getElementById('set-contact').value,
        agent_name: document.getElementById('set-agent-name').value,
        agent_contact: document.getElementById('set-agent-contact').value
    };

    const res = await fetch('/api/agency-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        await fetchAgencySettings();
        alert('대리점 및 설계사 정보가 성공적으로 저장되었습니다.');
    }
}

// ===========================================================================
// 간병보험 (간병인 사용일당 · 장기요양 · 치매) 비교설계 모듈
// ===========================================================================

const CG_GROUP_STYLE = {
    '간병인 사용·지원': { icon: 'fa-user-nurse', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', label: '간병인 사용·지원일당 (핵심)' },
    '장기요양(LTC) 진단': { icon: 'fa-id-card-clip', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', label: '장기요양(LTC) 등급판정 진단비' },
    '재가·시설급여': { icon: 'fa-house-chimney-medical', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: '장기요양 재가·시설급여 (매월 생활비)' },
    '치매 진단·생활비': { icon: 'fa-brain', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', label: '치매 단계별 진단비 & 간병생활비' }
};

function onCgCustomerChange() {
    const select = document.getElementById('cg-cust-select');
    const custId = parseInt(select.value);
    if (!custId) return;
    const cust = customers.find(c => c.id === custId);
    if (cust) {
        document.getElementById('cg-name').value = cust.name;
        document.getElementById('cg-age').value = cust.age;
        document.getElementById('cg-gender').value = cust.gender;
        if (cust.health_type) document.getElementById('cg-health').value = cust.health_type;
        if (cust.job_grade) document.getElementById('cg-job').value = cust.job_grade;
        triggerCaregiverCalculation();
    }
}

function renderCaregiverInputs() {
    const container = document.getElementById('cg-coverages-container');
    if (!container) return;
    container.innerHTML = '';

    if (!caregiverGroups || caregiverGroups.length === 0) return;

    caregiverGroups.forEach(groupName => {
        const groupCoverages = caregiverCoverages.filter(c => c.group === groupName);
        if (groupCoverages.length === 0) return;

        const style = CG_GROUP_STYLE[groupName] || { icon: 'fa-shield-halved', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', label: groupName };

        const groupWrapper = document.createElement('div');
        groupWrapper.className = `rounded-xl border ${style.border} ${style.bg} p-3.5 space-y-2.5`;

        const groupHeader = `
            <div class="flex items-center justify-between pb-1.5 border-b ${style.border}">
                <div class="flex items-center gap-1.5">
                    <i class="fa-solid ${style.icon} ${style.color} text-sm"></i>
                    <span class="font-bold text-xs ${style.color}">${style.label}</span>
                    <span class="text-[10px] text-slate-400 font-mono">(${groupCoverages.length})</span>
                </div>
            </div>
        `;

        let itemsHtml = '';
        groupCoverages.forEach(c => {
            const isChecked = c.default_on;
            const initAmt = isChecked ? c.recommended_amount : 0;
            const unitLabel = c.unit || '만원';

            // 갱신/비갱신 배지
            let renewalHtml = '';
            if (c.is_renewable_only) {
                renewalHtml = `
                    <div class="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span class="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            <i class="fa-solid fa-arrows-rotate text-[9px]"></i> 갱신형 전용 (${c.renewal_cycle || '갱신형'})
                        </span>
                        <span class="text-slate-400 text-[10px]">8대 손보사 공통</span>
                    </div>
                `;
            } else {
                const currentChoice = cgRiderRenewalSettings[c.code] || 'non_renewable';
                const isNonRenew = currentChoice === 'non_renewable';
                renewalHtml = `
                    <div class="mt-1 pt-1 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px]">
                        <span class="text-slate-500 font-medium">유형 선택:</span>
                        <div class="inline-flex rounded border border-slate-300 bg-white p-0.5" role="group">
                            <button type="button" onclick="setCaregiverRenewalType('${c.code}', 'non_renewable')"
                                class="px-2 py-0.5 rounded text-[10px] font-bold transition ${isNonRenew ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}">
                                비갱신형 (추천)
                            </button>
                            <button type="button" onclick="setCaregiverRenewalType('${c.code}', 'renewable')"
                                class="px-2 py-0.5 rounded text-[10px] font-bold transition ${!isNonRenew ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}">
                                갱신형 (실속)
                            </button>
                        </div>
                    </div>
                `;
            }

            itemsHtml += `
                <div class="bg-white rounded-lg p-3 border border-slate-200 shadow-2xs hover:border-teal-300 transition" id="cg-card-${c.code}">
                    <div class="flex items-center justify-between gap-2 mb-1.5">
                        <label class="flex items-center gap-2 cursor-pointer flex-1">
                            <input type="checkbox" id="cg-check-${c.code}" ${isChecked ? 'checked' : ''} onchange="onCgCheckChange('${c.code}')"
                                class="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500">
                            <span class="font-bold text-xs text-slate-800 hover:text-teal-700">${c.name}</span>
                        </label>
                        <span class="text-[9px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold shrink-0">인기 ${c.popularity || 1}위</span>
                    </div>

                    <div class="text-[11px] text-slate-500 leading-snug mb-2">${c.description || ''}</div>

                    <!-- 금액 슬라이더 및 인풋 -->
                    <div class="flex items-center gap-2">
                        <input type="range" id="cg-slider-${c.code}" min="${c.min}" max="${c.max}" step="${c.step}" value="${initAmt}"
                            oninput="onCgSliderInput('${c.code}')"
                            class="flex-1 accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer">
                        <div class="w-24 flex items-center justify-end gap-1">
                            <input type="number" id="cg-amt-${c.code}" min="${c.min}" max="${c.max}" step="${c.step}" value="${initAmt}"
                                oninput="onCgNumberInput('${c.code}')"
                                class="w-16 text-right font-bold text-xs border border-slate-300 rounded px-1.5 py-1 focus:ring-1 focus:ring-teal-500">
                            <span class="text-[11px] text-slate-500 whitespace-nowrap">${unitLabel}</span>
                        </div>
                    </div>

                    ${renewalHtml}
                </div>
            `;
        });

        groupWrapper.innerHTML = groupHeader + `<div class="space-y-2">${itemsHtml}</div>`;
        container.appendChild(groupWrapper);
    });

    updateCgActiveCountBadge();
}

function onCgCheckChange(code) {
    const chk = document.getElementById(`cg-check-${code}`);
    const slider = document.getElementById(`cg-slider-${code}`);
    const num = document.getElementById(`cg-amt-${code}`);
    const def = caregiverCoverages.find(c => c.code === code);
    if (!def) return;

    if (chk.checked) {
        const val = def.recommended_amount || def.min;
        slider.value = val;
        num.value = val;
    } else {
        slider.value = 0;
        num.value = 0;
    }
    updateCgActiveCountBadge();
    triggerCaregiverCalculation();
}

function onCgSliderInput(code) {
    const slider = document.getElementById(`cg-slider-${code}`);
    const num = document.getElementById(`cg-amt-${code}`);
    const chk = document.getElementById(`cg-check-${code}`);
    const val = parseInt(slider.value) || 0;

    num.value = val;
    chk.checked = (val > 0);
    updateCgActiveCountBadge();
    triggerCaregiverCalculation();
}

function onCgNumberInput(code) {
    const slider = document.getElementById(`cg-slider-${code}`);
    const num = document.getElementById(`cg-amt-${code}`);
    const chk = document.getElementById(`cg-check-${code}`);
    const val = parseInt(num.value) || 0;

    slider.value = val;
    chk.checked = (val > 0);
    updateCgActiveCountBadge();
    triggerCaregiverCalculation();
}

function setCaregiverRenewalType(code, type) {
    cgRiderRenewalSettings[code] = type;
    renderCaregiverInputs();
    triggerCaregiverCalculation();
}

function updateCgActiveCountBadge() {
    let count = 0;
    caregiverCoverages.forEach(c => {
        const chk = document.getElementById(`cg-check-${c.code}`);
        if (chk && chk.checked) count++;
    });
    const badge = document.getElementById('cg-active-cov-badge');
    if (badge) badge.innerText = `${count}개 담보 선택`;
}

function applyCaregiverPreset(presetType) {
    caregiverCoverages.forEach(c => {
        const chk = document.getElementById(`cg-check-${c.code}`);
        const slider = document.getElementById(`cg-slider-${c.code}`);
        const num = document.getElementById(`cg-amt-${c.code}`);
        if (!chk || !slider || !num) return;

        let active = false;
        let amt = 0;

        if (presetType === 'basic') {
            // 간병인 사용일당 실속 플랜
            if (c.code === 'cov_cg_general') { active = true; amt = 15; }
            else if (c.code === 'cov_cg_nursing_hosp') { active = true; amt = 3; }
            else if (c.code === 'cov_cg_integrated_care') { active = true; amt = 5; }
        } else if (presetType === 'escalating') {
            // 체증형 풀패키지
            if (c.code === 'cov_cg_escalating') { active = true; amt = 15; }
            else if (c.code === 'cov_cg_nursing_hosp') { active = true; amt = 5; }
            else if (c.code === 'cov_cg_integrated_care') { active = true; amt = 10; }
            else if (c.code === 'cov_cg_room_1') { active = true; amt = 50; }
        } else if (presetType === 'ltc') {
            // 장기요양 재가·시설 플랜
            if (c.code === 'cov_ltc_diag_1_5') { active = true; amt = 1000; }
            else if (c.code === 'cov_ltc_home_care') { active = true; amt = 50; }
            else if (c.code === 'cov_ltc_facility_care') { active = true; amt = 50; }
        } else if (presetType === 'dementia') {
            // 치매 집중 케어 플랜
            if (c.code === 'cov_dementia_mild') { active = true; amt = 500; }
            else if (c.code === 'cov_dementia_moderate') { active = true; amt = 1000; }
            else if (c.code === 'cov_dementia_severe') { active = true; amt = 2000; }
            else if (c.code === 'cov_dementia_living') { active = true; amt = 100; }
        } else if (presetType === 'reset') {
            active = false;
            amt = 0;
        }

        chk.checked = active;
        slider.value = amt;
        num.value = amt;
    });

    updateCgActiveCountBadge();
    triggerCaregiverCalculation();
}

async function triggerCaregiverCalculation() {
    const name = document.getElementById('cg-name')?.value || '김영희';
    const gender = document.getElementById('cg-gender')?.value || 'F';
    const age = parseInt(document.getElementById('cg-age')?.value) || 60;
    const jobGrade = parseInt(document.getElementById('cg-job')?.value) || 1;
    const healthType = document.getElementById('cg-health')?.value || 'standard';
    const term = document.getElementById('cg-term')?.value || '20년납_90세만기';

    const parts = term.split('_');
    const paymentPeriod = parts[0] || '20년납';
    const expiryPeriod = parts[1] || '90세만기';

    const selectedCoverages = [];
    caregiverCoverages.forEach(c => {
        const chk = document.getElementById(`cg-check-${c.code}`);
        const num = document.getElementById(`cg-amt-${c.code}`);
        if (chk && chk.checked) {
            const amt = parseInt(num.value) || 0;
            if (amt > 0) {
                const isRenewOnly = c.is_renewable_only;
                const chosenRenew = isRenewOnly ? 'renewable' : (cgRiderRenewalSettings[c.code] || 'non_renewable');
                selectedCoverages.push({
                    code: c.code,
                    amount: amt,
                    renewal_type: chosenRenew
                });
            }
        }
    });

    if (selectedCoverages.length === 0) {
        document.getElementById('cg-quotes-ranking-cards').innerHTML = '<div class="col-span-full p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">선택된 담보가 없습니다. 좌측에서 원하는 특약을 1개 이상 선택해 주세요.</div>';
        document.getElementById('cg-matrix-table').innerHTML = '';
        return;
    }

    const payload = {
        age: age,
        gender: gender,
        job_grade: jobGrade,
        health_type: healthType,
        payment_period: paymentPeriod,
        expiry_period: expiryPeriod,
        coverages: selectedCoverages
    };

    let calcResult = null;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const res = await fetch('/api/calculate/caregiver', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify(payload)
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            calcResult = await res.json();
        }
    } catch (err) {
        // 서버 미가동 또는 정적 파일 모드
    }

    // 백엔드 미응답 시 클라이언트 간병보험 독립 엔진 즉시 가동
    if (!calcResult && window.ClientCalculationEngine && window.ClientCalculationEngine.calculateCaregiverMultiQuote) {
        try {
            calcResult = window.ClientCalculationEngine.calculateCaregiverMultiQuote(payload);
        } catch (engineErr) {
            console.error('Client caregiver engine error:', engineErr);
        }
    }

    if (calcResult) {
        currentCaregiverQuoteResult = calcResult;
        renderCaregiverQuotesResult(calcResult);
    }
}

function renderCaregiverQuotesResult(data) {
    if (!data || !data.quotes || data.quotes.length === 0) return;

    // 상단 요약 업데이트
    const lowest = data.quotes[0];
    const recommended = data.quotes.find(q => q.is_recommended) || lowest;

    const lowestElem = document.getElementById('cg-lowest-insurer');
    if (lowestElem) {
        lowestElem.innerHTML = `<strong>${lowest.insurer_name}</strong> (${lowest.total_monthly_premium.toLocaleString()}원) <span class="text-xs text-teal-200 ml-1">· 추천: ${recommended.insurer_name}</span>`;
    }

    const detailElem = document.getElementById('cg-result-detail-text');
    if (detailElem) {
        const s = data.customer_summary;
        detailElem.innerText = `${s.name}님 (${s.age}세 ${s.gender}, ${s.job_grade}, ${s.health_type}) · ${s.payment_period} ${s.expiry_period}`;
    }

    // 8개사 순위 카드 렌더링
    const cardsContainer = document.getElementById('cg-quotes-ranking-cards');
    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        data.quotes.forEach(q => {
            const card = document.createElement('div');
            const borderCls = q.is_cheapest ? 'border-2 border-teal-500 shadow-md ring-2 ring-teal-100' : (q.is_recommended ? 'border-2 border-blue-500 shadow-md' : 'border border-slate-200');
            card.className = `bg-white rounded-xl p-3.5 flex flex-col justify-between transition hover:shadow-lg ${borderCls}`;

            let badgesHtml = '';
            if (q.is_cheapest) badgesHtml += '<span class="px-1.5 py-0.5 rounded bg-teal-600 text-white text-[9px] font-bold">최저가 1위</span>';
            if (q.is_recommended) badgesHtml += '<span class="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">GA 추천</span>';

            card.innerHTML = `
                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="font-bold text-xs text-slate-800 flex items-center gap-1">
                            <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold" style="background-color: ${q.theme_color}">${q.rank}</span>
                            ${q.insurer_name}
                        </span>
                        <div class="flex gap-1">${badgesHtml}</div>
                    </div>
                    <div class="text-[11px] text-slate-500 font-semibold truncate mb-1" title="${q.product_name}">${q.product_name}</div>
                    ${(q.discount_amount || 0) > 0 ? `
                        <div class="mb-2">
                            <div class="flex items-center justify-between text-[11px] text-slate-400">
                                <span>표준체: <del>${(q.standard_monthly_premium || q.total_monthly_premium).toLocaleString()}원</del></span>
                                <span class="text-teal-700 font-bold bg-teal-50 px-1 rounded">-${q.discount_rate}%</span>
                            </div>
                            <div class="text-lg font-black text-teal-800 flex items-baseline justify-between mt-0.5">
                                <span>${q.total_monthly_premium.toLocaleString()}<span class="text-xs font-normal text-slate-500 ml-0.5">원/월</span></span>
                                <span class="text-[10px] text-teal-700 font-bold">-${q.discount_amount.toLocaleString()}원</span>
                            </div>
                            <div class="mt-1 px-1.5 py-0.5 rounded bg-teal-100/80 text-[10px] text-teal-900 font-bold flex justify-between items-center">
                                <span>10년 무사고 고지</span>
                                <span>20년 ${(q.discount_amount * 12 * 20).toLocaleString()}원 절감</span>
                            </div>
                        </div>
                    ` : `
                        <div class="text-lg font-black text-slate-900 tracking-tight mb-2">
                            ${q.total_monthly_premium.toLocaleString()}<span class="text-xs font-normal text-slate-500 ml-0.5">원/월</span>
                        </div>
                    `}
                    <div class="space-y-1 mb-2">
                        ${q.strengths.slice(0, 2).map(st => `<div class="text-[10px] text-slate-600 flex items-start gap-1"><span class="text-teal-500">•</span><span class="truncate">${st}</span></div>`).join('')}
                    </div>
                </div>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span class="text-slate-400">수당: <strong class="text-amber-700">${(q.commission_total || 0).toLocaleString()}원</strong></span>
                    <button onclick="openCaregiverCommissionModal()" class="text-teal-700 font-bold hover:underline">상세 ➔</button>
                </div>
            `;
            cardsContainer.appendChild(card);
        });
    }

    // 담보별 매트릭스 테이블 렌더링
    const table = document.getElementById('cg-matrix-table');
    if (table) {
        table.innerHTML = '';

        // 헤더
        const thead = document.createElement('thead');
        let headerHtml = `
            <tr class="bg-slate-100 border-b border-slate-200 text-slate-700">
                <th class="p-2.5 font-bold w-48">선택 담보 및 가입금액</th>
        `;
        data.quotes.forEach(q => {
            const highlight = q.is_cheapest ? 'bg-teal-50 text-teal-800' : '';
            headerHtml += `
                <th class="p-2.5 text-center font-bold ${highlight}">
                    <div>${q.insurer_name}</div>
                    <div class="text-[10px] font-normal text-slate-400 truncate max-w-[85px]">${q.product_name}</div>
                </th>
            `;
        });
        headerHtml += '</tr>';
        thead.innerHTML = headerHtml;
        table.appendChild(thead);

        // 바디
        const tbody = document.createElement('tbody');
        tbody.className = 'divide-y divide-slate-100';

        const covCodes = Object.keys(data.coverage_names);
        covCodes.forEach(code => {
            const covName = data.coverage_names[code];
            const covDef = caregiverCoverages.find(c => c.code === code) || {};
            const amtInput = document.getElementById(`cg-amt-${code}`);
            const amt = amtInput ? amtInput.value : '';
            const unit = covDef.unit || '만원';

            let rowHtml = `
                <tr class="hover:bg-slate-50 transition">
                    <td class="p-2.5">
                        <div class="font-bold text-slate-800 text-xs">${covName}</div>
                        <div class="text-[10px] text-teal-600 font-semibold">${amt}${unit}</div>
                    </td>
            `;

            // 각 보험사별 해당 담보 보험료
            const prems = data.quotes.map(q => q.coverage_breakdown[code] || 0);
            const minPrem = Math.min(...prems.filter(p => p > 0));

            data.quotes.forEach((q, idx) => {
                const prem = prems[idx];
                const isMin = (prem === minPrem && minPrem > 0);
                const cellCls = isMin ? 'bg-teal-50/70 font-bold text-teal-700' : 'text-slate-700';
                rowHtml += `
                    <td class="p-2.5 text-center text-xs ${cellCls}">
                        ${prem > 0 ? prem.toLocaleString() + '원' : '-'}
                        ${isMin ? '<span class="text-[9px] text-teal-600 block">최저</span>' : ''}
                    </td>
                `;
            });

            rowHtml += '</tr>';
            tbody.innerHTML += rowHtml;
        });

        // 푸터 (합계 및 10년 무사고 할인 비교)
        const tfoot = document.createElement('tfoot');
        let footHtml = '';

        const hasCgDisc = data.quotes.some(q => (q.discount_amount || 0) > 0);
        if (hasCgDisc) {
            footHtml += `
                <tr class="bg-amber-50/70 text-[11px] text-slate-600 border-t-2 border-amber-300">
                    <td class="p-2.5 font-bold">
                        <div class="flex items-center gap-1.5 text-slate-700">
                            <i class="fa-regular fa-calendar-check text-amber-600"></i>
                            <span>표준체 월 보험료 (할인 전 정상가)</span>
                        </div>
                    </td>
            `;
            data.quotes.forEach(q => {
                const stdVal = q.standard_monthly_premium || q.total_monthly_premium;
                footHtml += `
                    <td class="p-2 text-center line-through text-slate-400">
                        ${stdVal.toLocaleString()}원
                    </td>
                `;
            });
            footHtml += `</tr>`;

            footHtml += `
                <tr class="bg-teal-50 text-[11px] font-bold text-teal-900 border-b border-teal-300">
                    <td class="p-2.5">
                        <div class="flex items-center justify-between">
                            <span class="flex items-center gap-1.5 text-teal-800 font-extrabold">
                                <i class="fa-solid fa-tags text-teal-600"></i>
                                <span>10년 무사고 할인 금액 (월 절감액 / 20년 총액)</span>
                            </span>
                            <span class="text-[10px] bg-teal-200 text-teal-800 px-1.5 py-0.5 rounded font-extrabold">할인 제시</span>
                        </div>
                    </td>
            `;
            data.quotes.forEach(q => {
                const discAmt = q.discount_amount || 0;
                const discRt = q.discount_rate || 0.0;
                footHtml += `
                    <td class="p-2 text-center text-teal-700">
                        <div>-${discAmt.toLocaleString()}원 <span class="text-[10px] font-normal">(-${discRt}%)</span></div>
                        <div class="text-[10px] text-teal-600 font-normal">20년 -${(discAmt * 12 * 20).toLocaleString()}원</div>
                    </td>
                `;
            });
            footHtml += `</tr>`;
        }

        footHtml += `
            <tr class="bg-slate-900 text-white font-bold border-t-2 border-slate-700">
                <td class="p-3 text-xs">
                    <div>월 총 납입보험료 합계</div>
                    <div class="text-[10px] text-slate-400 font-normal">${hasCgDisc ? '(10년 무사고 할인 최종 반영)' : '8대 손보사 동시 비교'}</div>
                </td>
        `;
        data.quotes.forEach(q => {
            const highlight = q.is_cheapest ? 'text-teal-400 font-black' : '';
            footHtml += `
                <td class="p-3 text-center text-xs ${highlight}">
                    <div>${q.total_monthly_premium.toLocaleString()}원</div>
                    <div class="text-[10px] font-normal text-slate-400">${q.rank}위</div>
                </td>
            `;
        });
        footHtml += '</tr>';
        tfoot.innerHTML = footHtml;

        table.appendChild(tbody);
        table.appendChild(tfoot);
    }
}

function openCaregiverCommissionModal() {
    if (!currentCaregiverQuoteResult) {
        alert('먼저 간병보험 비교설계를 실행해 주세요.');
        return;
    }
    currentQuoteResult = currentCaregiverQuoteResult;
    openCommissionModal();
}

function openCaregiverPrintModal() {
    if (!currentCaregiverQuoteResult) {
        alert('먼저 간병보험 비교설계를 실행해 주세요.');
        return;
    }
    currentQuoteResult = currentCaregiverQuoteResult;
    openPrintModal();
}



// ======================================================================
// [1. 화면 테마 모드 관리 엔진 (화이트 / 그레이 / 어두운 테마)]
// ======================================================================

function setThemeMode(mode) {
    if (!['white', 'gray', 'dark'].includes(mode)) mode = 'white';

    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('theme-white', 'theme-gray', 'theme-dark');
    if (body) body.classList.remove('theme-white', 'theme-gray', 'theme-dark');

    root.classList.add(`theme-${mode}`);
    if (body) body.classList.add(`theme-${mode}`);

    try {
        localStorage.setItem('ga_theme_mode', mode);
    } catch (e) {}

    updateThemeButtonsUI(mode);

    const modeNames = {
        white: { label: '화이트 모드', desc: '밝고 선명한 순백 화면', icon: 'fa-sun text-amber-400' },
        gray: { label: '그레이 모드', desc: '눈이 편안한 슬레이트 그레이 화면', icon: 'fa-cloud text-slate-300' },
        dark: { label: '어두운 테마 모드', desc: '프리미엄 딥 다크 화면', icon: 'fa-moon text-indigo-400' }
    };
    const info = modeNames[mode];
    if (typeof showToast === 'function') {
        showToast(`
            <div class="flex items-center gap-2">
                <i class="fa-solid ${info.icon} text-base"></i>
                <div>
                    <span class="font-extrabold text-white text-xs">${info.label} 적용</span>
                    <span class="block text-[10.5px] text-slate-300">${info.desc}</span>
                </div>
            </div>
        `, 'info');
    }
}

function updateThemeButtonsUI(mode) {
    const modes = ['white', 'gray', 'dark'];
    modes.forEach(m => {
        const btn = document.getElementById(`btn-theme-${m}`);
        if (!btn) return;
        if (m === mode) {
            btn.className = "px-2 py-1 rounded-md transition-all flex items-center gap-1 bg-blue-600 text-white font-black shadow-sm text-[11px]";
        } else {
            btn.className = "px-2 py-1 rounded-md transition-all flex items-center gap-1 text-slate-400 hover:text-white hover:bg-slate-800 font-semibold text-[11px]";
        }
    });
}

function initThemeMode() {
    let saved = 'white';
    try {
        saved = localStorage.getItem('ga_theme_mode') || 'white';
    } catch (e) {}
    setThemeMode(saved);
}

// ======================================================================
// [2. 공유 링크 복사 및 세련된 플로팅 토스트 알림 엔진]
// ======================================================================

function copyShareLink() {
    let shareUrl = 'https://hellouou.github.io/ins/index.html';
    if (window.location.protocol.startsWith('http') && 
        !window.location.hostname.includes('localhost') && 
        !window.location.hostname.includes('127.0.0.1')) {
        shareUrl = window.location.href;
    }

    function performCopy(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            return new Promise((resolve, reject) => {
                try {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = text;
                    tempInput.style.position = 'fixed';
                    tempInput.style.left = '-9999px';
                    tempInput.style.top = '-9999px';
                    tempInput.setAttribute('readonly', '');
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    const successful = document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    if (successful) resolve();
                    else reject(new Error('execCommand failed'));
                } catch (err) {
                    reject(err);
                }
            });
        }
    }

    performCopy(shareUrl).then(() => {
        const btn = document.getElementById('btn-header-share') || document.querySelector('button[onclick="copyShareLink()"]');
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>링크 복사 완료!</span>';
            btn.classList.remove('bg-amber-400', 'hover:bg-amber-300', 'text-slate-900');
            btn.classList.add('bg-emerald-500', 'text-white', 'shadow-md');
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove('bg-emerald-500', 'text-white', 'shadow-md');
                btn.classList.add('bg-amber-400', 'hover:bg-amber-300', 'text-slate-900');
            }, 2200);
        }

        showToast(`
            <div class="space-y-0.5">
                <div class="font-extrabold text-sm flex items-center gap-1.5 text-emerald-400">
                    <i class="fa-solid fa-circle-check"></i> 링크가 클립보드에 복사되었습니다!
                </div>
                <div class="text-[11px] text-slate-300 font-mono break-all">${shareUrl}</div>
                <div class="text-[10.5px] text-slate-400 mt-1">
                    카카오톡이나 문자에 바로 <strong>붙여넣기(Ctrl+V)</strong>하여 누구에게나 비교설계 링크를 공유하세요.
                </div>
            </div>
        `, 'success');
    }).catch(err => {
        window.prompt('아래 링크를 복사(Ctrl+C)하여 고객에게 전달하세요:', shareUrl);
    });
}

function showToast(htmlContent, type = 'info') {
    let container = document.getElementById('global-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        container.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none max-w-md w-full px-4';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const borderCls = type === 'success' ? 'border-emerald-500/60' : (type === 'warning' ? 'border-amber-500/60' : 'border-blue-500/60');
    toast.className = `pointer-events-auto bg-slate-900/95 text-white px-4 py-3 rounded-xl border ${borderCls} shadow-2xl backdrop-blur-md text-xs transition-all duration-300 opacity-0 translate-y-3 w-full`;
    toast.innerHTML = htmlContent;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-3');
        toast.classList.add('opacity-100', 'translate-y-0');
    });

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-3');
        setTimeout(() => {
            if (toast.parentElement) toast.parentElement.removeChild(toast);
        }, 300);
    }, 3500);
}

// ======================================================================
// [3. 유사암 20% 한도 자동 연동 엔진 (일반암 + 통합암 합산 규정)]
// ======================================================================

function syncSimilarCancerAmount(triggerSource = 'auto') {
    const genInput = document.getElementById('calc-amt-cov_cancer_gen');
    const genChk = document.getElementById('calc-chk-cov_cancer_gen');
    const groupInput = document.getElementById('calc-amt-cov_cancer_group_multi');
    const groupChk = document.getElementById('calc-chk-cov_cancer_group_multi');
    const simInput = document.getElementById('calc-amt-cov_cancer_sim');
    const simChk = document.getElementById('calc-chk-cov_cancer_sim');

    if (!simInput || !simChk) return;

    const genChecked = genChk ? genChk.checked : ((parseInt(genInput?.value) || 0) > 0);
    const genAmt = genChecked ? (parseInt(genInput?.value) || 0) : 0;

    const groupChecked = groupChk ? groupChk.checked : ((parseInt(groupInput?.value) || 0) > 0);
    const groupAmt = groupChecked ? (parseInt(groupInput?.value) || 0) : 0;

    const baseCancerAmount = genAmt + groupAmt;
    const maxSimilarLimit = Math.round(baseCancerAmount * 0.20);

    updateSimilarCancerNoticeUI(baseCancerAmount, maxSimilarLimit, genAmt, groupAmt, genChecked, groupChecked);

    if (baseCancerAmount <= 0) {
        simInput.value = 0;
        simInput.dataset.last = 0;
        simInput.max = 0;
        simChk.checked = false;
        const row = document.getElementById('calc-row-cov_cancer_sim');
        if (row) row.classList.add('opacity-50');
        return;
    }

    simInput.max = maxSimilarLimit;

    if (triggerSource === 'sim_amt') {
        let userVal = parseInt(simInput.value) || 0;
        if (userVal > maxSimilarLimit) {
            simInput.value = maxSimilarLimit;
            userVal = maxSimilarLimit;
            alertSimilarCancerLimit(baseCancerAmount, maxSimilarLimit);
        }
        simInput.dataset.last = userVal;
        simChk.checked = userVal > 0;
        const row = document.getElementById('calc-row-cov_cancer_sim');
        if (row) row.classList.toggle('opacity-50', userVal <= 0);
    } else if (triggerSource === 'sim_chk_off') {
        simInput.value = 0;
        simChk.checked = false;
        const row = document.getElementById('calc-row-cov_cancer_sim');
        if (row) row.classList.add('opacity-50');
    } else {
        simInput.value = maxSimilarLimit;
        simInput.dataset.last = maxSimilarLimit;
        simChk.checked = true;
        const row = document.getElementById('calc-row-cov_cancer_sim');
        if (row) row.classList.remove('opacity-50');
    }
}

function updateSimilarCancerNoticeUI(base, limit, genAmt, groupAmt, genOn, groupOn) {
    let noticeEl = document.getElementById('sim-cancer-link-notice');
    const simRow = document.getElementById('calc-row-cov_cancer_sim');
    if (!simRow) return;

    if (!noticeEl) {
        noticeEl = document.createElement('div');
        noticeEl.id = 'sim-cancer-link-notice';
        simRow.appendChild(noticeEl);
    }

    if (base > 0) {
        const parts = [];
        if (genAmt > 0) parts.push(`일반암 ${genAmt.toLocaleString()}만`);
        if (groupAmt > 0) parts.push(`통합암 ${groupAmt.toLocaleString()}만`);
        const formulaStr = parts.join(' + ') + ` = 기준 <strong>${base.toLocaleString()}만원</strong>`;

        noticeEl.className = "mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] leading-relaxed shadow-sm transition-all";
        noticeEl.innerHTML = `
            <div class="flex items-center gap-1.5 font-bold text-emerald-800">
                <i class="fa-solid fa-link text-emerald-600"></i>
                <span>유사암 20% 한도 연동 활성화</span>
                <span class="ml-auto px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-extrabold">20% 한도 자동연계</span>
            </div>
            <div class="mt-1 text-slate-700 text-[10.5px]">
                ${formulaStr}의 20% 한도인 <strong class="text-emerald-900 bg-emerald-100 px-1 py-0.5 rounded font-black border border-emerald-200">${limit.toLocaleString()}만원</strong>이 자동 설정되었습니다.
            </div>
            <div class="text-[10px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                <i class="fa-solid fa-lightbulb text-amber-500"></i>
                <span>한 상품 내 일반암·통합암 동시 가입 시 합산 기준(20%)으로 유사암 한도가 자동 확대 적용됩니다.</span>
            </div>
        `;
    } else {
        noticeEl.className = "mt-2 p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[11px] leading-relaxed transition-all";
        noticeEl.innerHTML = `
            <div class="flex items-center gap-1.5 font-bold text-amber-800">
                <i class="fa-solid fa-circle-exclamation text-amber-600"></i>
                <span>유사암 한도 연계 대기</span>
            </div>
            <div class="mt-0.5 text-slate-700 text-[10.5px]">
                유사암은 보험사 공통 규정상 <strong>일반암 또는 통합암 가입금액의 20%</strong> 내에서만 가입할 수 있습니다. 위 일반암이나 통합암을 선택해 주세요.
            </div>
        `;
    }
}

function alertSimilarCancerLimit(base, limit) {
    const msg = `[유사암 한도 안내] 유사암은 일반암+통합암(${base.toLocaleString()}만원)의 최대 20%인 ${limit.toLocaleString()}만원까지만 가입 가능합니다.`;
    if (typeof showToast === 'function') {
        showToast(msg);
    } else {
        console.warn(msg);
    }
}
