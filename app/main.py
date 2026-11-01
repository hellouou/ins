"""
GA-INSIGHT: 손해보험 법인대리점 통합 보험설계 & 보장분석 메인 API 서버
"""

import os
import json
import urllib.request
from datetime import datetime, date
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware

from app.database import get_db, init_db
from app.insurers_data import (
    INSURERS, STANDARD_COVERAGES,
    CAREGIVER_INSURERS, CAREGIVER_COVERAGES, CAREGIVER_GROUPS
)
from app.models import (
    CustomerCreate, CustomerResponse, CalculateQuoteRequest, MultiQuoteResponse,
    DiagnosisRequest, DiagnosisResponse, ProposalSaveRequest, AgencySettingsUpdate
)
from app.calculation_engine import CalculationEngine
from app.diagnosis_engine import DiagnosisEngine
from app.rpa_service import RPAService

# DB 초기화
init_db()

app = FastAPI(
    title="GA-INSIGHT: 손해보험 법인대리점 통합설계 플랫폼",
    version="1.0.0",
    description="8대 손해보험사 실시간 비교설계, 보장분석, 고객제안서 및 원수사 RPA 연동"
)

# CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR, exist_ok=True)

# ----------------- 유틸 함수 -----------------
def calculate_age(birthdate_str: str) -> int:
    """생년월일(YYYY-MM-DD)로부터 만 나이 계산"""
    try:
        birth = datetime.strptime(birthdate_str, "%Y-%m-%d").date()
        today = date.today()
        age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
        return max(0, age)
    except Exception:
        return 40

# ----------------- 기본 마스터 데이터 API -----------------
@app.get("/api/insurers")
def get_insurers():
    """8대 주요 손해보험사 정보 반환"""
    return INSURERS

@app.get("/api/standard-coverages")
def get_standard_coverages():
    """표준 담보 목록 및 기준 금액 반환"""
    return STANDARD_COVERAGES

@app.get("/api/caregiver-coverages")
def get_caregiver_coverages():
    """간병보험(간병인 사용일당·장기요양·치매) 특약 목록 및 그룹 반환"""
    return {
        "groups": CAREGIVER_GROUPS,
        "coverages": CAREGIVER_COVERAGES
    }

@app.get("/api/caregiver-insurers")
def get_caregiver_insurers():
    """8대 주요 손해보험사 간병보험 전용 마스터 데이터 반환"""
    return CAREGIVER_INSURERS

@app.get("/api/agency-settings")
def get_agency_settings():
    """대리점 및 담당 설계사 설정 정보 반환"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM agency_settings ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return {
        "agency_name": "GA 통합보험대리점",
        "representative": "대표이사",
        "registration_no": "GA-2024-001",
        "contact": "02-1588-0000",
        "agent_name": "수석설계사",
        "agent_contact": "010-0000-0000"
    }

@app.post("/api/agency-settings")
def update_agency_settings(settings: AgencySettingsUpdate):
    """대리점 정보 갱신"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE agency_settings SET
        agency_name = ?,
        representative = ?,
        registration_no = ?,
        contact = ?,
        agent_name = ?,
        agent_contact = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = (SELECT id FROM agency_settings ORDER BY id DESC LIMIT 1)
    """, (
        settings.agency_name, settings.representative, settings.registration_no,
        settings.contact, settings.agent_name, settings.agent_contact
    ))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "설정이 저장되었습니다."}

# ----------------- 고객 관리 API -----------------
@app.get("/api/customers")
def list_customers():
    """등록된 고객 목록 조회"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/customers")
def create_customer(cust: CustomerCreate):
    """신규 고객 등록"""
    age = calculate_age(cust.birthdate)
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO customers (name, gender, birthdate, age, job_grade, job_name, phone, is_driver, health_type, memo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        cust.name, cust.gender, cust.birthdate, age, cust.job_grade,
        cust.job_name, cust.phone, 1 if cust.is_driver else 0, cust.health_type, cust.memo
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {"status": "success", "id": new_id, "age": age}

@app.get("/api/customers/{customer_id}")
def get_customer(customer_id: int):
    """특정 고객 상세 조회"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers WHERE id = ?", (customer_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # 최근 제안서 목록
    cursor.execute("SELECT id, title, plan_type, status, created_at FROM proposals WHERE customer_id = ? ORDER BY id DESC", (customer_id,))
    proposals = [dict(p) for p in cursor.fetchall()]
    
    conn.close()
    data = dict(row)
    data["proposals"] = proposals
    return data

@app.delete("/api/customers/{customer_id}")
def delete_customer(customer_id: int):
    """고객 삭제"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM customers WHERE id = ?", (customer_id,))
    cursor.execute("DELETE FROM proposals WHERE customer_id = ?", (customer_id,))
    cursor.execute("DELETE FROM diagnoses WHERE customer_id = ?", (customer_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "삭제 완료"}

# ----------------- 8대 손보사 비교설계 계산 API -----------------
@app.post("/api/calculate", response_model=MultiQuoteResponse)
def calculate_quote(req: CalculateQuoteRequest):
    """8대 손보사 실시간 동시 비교 견적 산출"""
    customer_name = "고객"
    if req.customer_id:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM customers WHERE id = ?", (req.customer_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            customer_name = row["name"]

    response = CalculationEngine.calculate_multi_quote(
        age=req.age,
        gender=req.gender,
        job_grade=req.job_grade,
        health_type=req.health_type,
        payment_period=req.payment_period,
        expiry_period=req.expiry_period,
        coverages=req.coverages,
        customer_id=req.customer_id,
        customer_name=customer_name
    )
    return response

@app.post("/api/calculate/caregiver", response_model=MultiQuoteResponse)
def calculate_caregiver_quote(req: CalculateQuoteRequest):
    """간병보험(간병인 사용일당·장기요양·치매) 8대 손보사 실시간 동시 비교 견적 산출"""
    customer_name = "고객"
    if req.customer_id:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM customers WHERE id = ?", (req.customer_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            customer_name = row["name"]

    response = CalculationEngine.calculate_caregiver_multi_quote(
        age=req.age,
        gender=req.gender,
        job_grade=req.job_grade,
        health_type=req.health_type,
        payment_period=req.payment_period,
        expiry_period=req.expiry_period,
        coverages=req.coverages,
        customer_id=req.customer_id,
        customer_name=customer_name
    )
    return response

# ----------------- 보장 분석 진단 API -----------------
@app.post("/api/diagnose", response_model=DiagnosisResponse)
def diagnose_coverage(req: DiagnosisRequest):
    """고객 기존 가입 보장 분석 및 진단 점수/갭 산출"""
    result = DiagnosisEngine.analyze_coverage(
        age=req.age,
        gender=req.gender,
        existing_coverages=req.existing_coverages
    )

    if req.customer_id:
        # DB 저장
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO diagnoses (customer_id, existing_coverages_json, diagnosis_result_json, score)
        VALUES (?, ?, ?, ?)
        """, (
            req.customer_id,
            json.dumps([c.dict() for c in req.existing_coverages]),
            json.dumps(result.dict(), ensure_ascii=False),
            result.overall_score
        ))
        conn.commit()
        conn.close()

    return result

# ----------------- 제안서 저장 및 출력 API -----------------
@app.post("/api/proposals")
def save_proposal(req: ProposalSaveRequest):
    """설계한 비교견적 제안서 DB 저장"""
    # 견적 재계산
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customers WHERE id = ?", (req.customer_id,))
    cust = cursor.fetchone()
    if not cust:
        conn.close()
        raise HTTPException(status_code=404, detail="Customer not found")
    
    quote_res = CalculationEngine.calculate_multi_quote(
        age=cust["age"],
        gender=cust["gender"],
        job_grade=cust["job_grade"],
        health_type=cust["health_type"],
        payment_period=req.payment_period,
        expiry_period=req.expiry_period,
        coverages=req.coverages,
        customer_id=req.customer_id,
        customer_name=cust["name"]
    )

    cursor.execute("""
    INSERT INTO proposals (
        customer_id, title, plan_type, payment_period, expiry_period,
        coverages_json, calculated_results_json, recommended_insurer_id, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        req.customer_id,
        req.title,
        req.plan_type,
        req.payment_period,
        req.expiry_period,
        json.dumps([c.dict() for c in req.coverages]),
        json.dumps(quote_res.dict(), ensure_ascii=False),
        req.recommended_insurer_id,
        "presented"
    ))
    prop_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return {"status": "success", "id": prop_id}

@app.get("/api/proposals/{proposal_id}")
def get_proposal(proposal_id: int):
    """저장된 제안서 상세 데이터 조회 (인쇄/출력 뷰용)"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT p.*, c.name as customer_name, c.gender, c.birthdate, c.age, c.job_name, c.phone
    FROM proposals p
    JOIN customers c ON p.customer_id = c.id
    WHERE p.id = ?
    """, (proposal_id,))
    row = cursor.fetchone()
    
    cursor.execute("SELECT * FROM agency_settings ORDER BY id DESC LIMIT 1")
    agency = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Proposal not found")

    prop_data = dict(row)
    prop_data["calculated_results"] = json.loads(prop_data["calculated_results_json"])
    prop_data["coverages"] = json.loads(prop_data["coverages_json"])
    prop_data["agency"] = dict(agency) if agency else {}
    return prop_data

# ----------------- RPA 브릿지 API -----------------
@app.post("/api/rpa/clipboard")
async def generate_clipboard(req: Request):
    """원수사 전산 자동 주입용 정형 텍스트 생성"""
    data = await req.json()
    customer = data.get("customer", {})
    coverages = data.get("coverages", [])
    text = RPAService.generate_clipboard_payload(customer, coverages)
    return {"text": text}

@app.post("/api/rpa/script")
async def generate_script(req: Request):
    """Playwright 자동화 코드 생성"""
    data = await req.json()
    insurer_id = data.get("insurer_id", "meritz")
    customer = data.get("customer", {})
    coverages = data.get("coverages", [])
    script = RPAService.generate_playwright_script(insurer_id, customer, coverages)
    return {"script": script}

# ----------------- 홈페이지 상담 신청 접수 API -----------------
@app.post("/api/consultations")
async def create_consultation(req: Request):
    """홈페이지에서 유입된 고객의 무료 비교설계 상담 신청 접수"""
    data = await req.json()
    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    birthdate = data.get("birthdate", "1985-05-15")
    interest_field = data.get("interest_field", "3대 질병 진단비")
    preferred_time = data.get("preferred_time", "언제나 가능")
    message = data.get("message", "")
    sim_summary = data.get("sim_summary", "")

    if not name or not phone:
        raise HTTPException(status_code=400, detail="성함과 연락처는 필수입니다.")

    age = calculate_age(birthdate)
    conn = get_db()
    cursor = conn.cursor()

    # 1. 상담신청 테이블 저장
    cursor.execute("""
    INSERT INTO consultations (name, phone, birthdate, interest_field, preferred_time, message, status)
    VALUES (?, ?, ?, ?, ?, ?, '신규접수')
    """, (name, phone, birthdate, interest_field, preferred_time, message))
    consult_id = cursor.lastrowid

    # 2. CRM 고객 테이블에도 자동 연동 등록 (설계사 전산에서 바로 보이도록)
    memo_text = f"[홈페이지 상담접수 #{consult_id}] 분야: {interest_field} | 희망시간: {preferred_time} | 메시지: {message}"
    if sim_summary:
        memo_text += f" | 견적: {sim_summary}"
    cursor.execute("""
    INSERT INTO customers (name, gender, birthdate, age, job_grade, job_name, phone, is_driver, health_type, memo)
    VALUES (?, 'M', ?, ?, 1, '일반(온라인문의)', ?, 1, 'standard', ?)
    """, (name, birthdate, age, phone, memo_text))

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "id": consult_id,
        "message": "상담 신청이 정상 접수되었습니다."
    }

@app.get("/api/consultations")
def list_consultations():
    """접수된 상담 목록 조회"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM consultations ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ----------------- 프론트엔드 라우트 -----------------
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

css_dir = os.path.join(STATIC_DIR, "css")
if os.path.exists(css_dir):
    app.mount("/css", StaticFiles(directory=css_dir), name="css")

js_dir = os.path.join(STATIC_DIR, "js")
if os.path.exists(js_dir):
    app.mount("/js", StaticFiles(directory=js_dir), name="js")

@app.get("/youtube_analysis.html", response_class=HTMLResponse)
def get_yt_analysis():
    p = os.path.join(STATIC_DIR, "youtube_analysis.html")
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("Not Found", status_code=404)

@app.get("/youtube_ppt.html", response_class=HTMLResponse)
def get_yt_ppt():
    p = os.path.join(STATIC_DIR, "youtube_ppt.html")
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("Not Found", status_code=404)

@app.get("/home.html", response_class=HTMLResponse)
def get_home_page():
    return home_page()

@app.get("/", response_class=HTMLResponse)
def home_page():
    """법인대리점 공식 로컬 홈페이지 (고객 랜딩 및 상담 접수)"""
    home_file = os.path.join(STATIC_DIR, "home.html")
    if os.path.exists(home_file):
        with open(home_file, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    # fallback
    return portal_page()

@app.get("/portal", response_class=HTMLResponse)
@app.get("/agent", response_class=HTMLResponse)
def portal_page():
    """설계사용 GA-INSIGHT 비교설계 및 CRM 포털"""
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h1>GA-INSIGHT 플랫폼 로딩 중...</h1>")
