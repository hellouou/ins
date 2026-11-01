"""
Pydantic 요청/응답 데이터 스키마
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class CustomerCreate(BaseModel):
    name: str
    gender: str = Field(..., description="'M' 또는 'F'")
    birthdate: str = Field(..., description="YYYY-MM-DD")
    job_grade: int = Field(default=1, description="1, 2, 3급")
    job_name: Optional[str] = "일반 사무직"
    phone: Optional[str] = ""
    is_driver: bool = True
    health_type: str = Field(default="standard", description="'standard', 'simple_355', 'simple_335'")
    memo: Optional[str] = ""

class CustomerResponse(CustomerCreate):
    id: int
    age: int
    created_at: str

class CoverageRequestItem(BaseModel):
    code: str
    amount: int = Field(..., description="가입금액 (만원 단위)")
    renewal_type: Optional[str] = Field(default="non_renewable", description="'non_renewable'(비갱신형) 또는 'renewable'(갱신형)")

class CalculateQuoteRequest(BaseModel):
    customer_id: Optional[int] = None
    gender: str = "M"
    age: int = 40
    job_grade: int = 1
    health_type: str = "standard" # standard, simple_355, simple_335
    payment_period: str = "20년납" # 20년납, 30년납
    expiry_period: str = "90세만기" # 90세만기, 100세만기
    coverages: List[CoverageRequestItem]

class InsurerQuoteItem(BaseModel):
    insurer_id: str
    insurer_name: str
    insurer_code: str
    theme_color: str
    badge_color: str
    product_name: str
    total_monthly_premium: int
    strengths: List[str]
    coverage_breakdown: Dict[str, int] # 담보코드: 월보험료
    rank: int = 0
    is_cheapest: bool = False
    is_recommended: bool = False
    commission_est: str = ""
    commission_total: int = 0
    commission_immediate: int = 0
    commission_year1: int = 0
    commission_year2: int = 0
    commission_net: int = 0
    standard_monthly_premium: Optional[int] = None
    discount_amount: Optional[int] = 0
    discount_rate: Optional[float] = 0.0
    discount_desc: Optional[str] = ""

class MultiQuoteResponse(BaseModel):
    customer_summary: Dict[str, Any]
    quotes: List[InsurerQuoteItem]
    lowest_premium_insurer: str
    recommended_insurer: str
    coverage_names: Dict[str, str]
    coverage_renewal_info: Optional[Dict[str, Any]] = None
    max_discount_amount: Optional[int] = 0
    max_discount_rate: Optional[float] = 0.0
    has_discount: Optional[bool] = False

class ExistingCoverageItem(BaseModel):
    code: str
    current_amount: int # 만원 단위

class DiagnosisRequest(BaseModel):
    customer_id: Optional[int] = None
    age: int
    gender: str
    existing_coverages: List[ExistingCoverageItem]

class CoverageDiagnosisDetail(BaseModel):
    code: str
    name: str
    category: str
    recommended_amount: int
    current_amount: int
    gap_amount: int
    status: str # 'sufficient' (충족), 'deficient' (부족), 'critical' (미가입/위험)
    description: str

class DiagnosisResponse(BaseModel):
    overall_score: int # 0 ~ 100점
    total_existing_monthly_est: int
    coverage_details: List[CoverageDiagnosisDetail]
    summary_message: str
    recommended_actions: List[str]

class ProposalSaveRequest(BaseModel):
    customer_id: int
    title: str
    plan_type: str = "standard_health"
    payment_period: str = "20년납"
    expiry_period: str = "90세만기"
    coverages: List[CoverageRequestItem]
    recommended_insurer_id: str

class AgencySettingsUpdate(BaseModel):
    agency_name: str
    representative: str
    registration_no: str
    contact: str
    agent_name: str
    agent_contact: str
