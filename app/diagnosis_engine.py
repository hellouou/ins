"""
고객 보장분석 & 진단 엔진
- 고객의 기존 보험 가입 내역을 분석하여 8대 필수 영역의 보장 적정성 평가
- 종합 점수(0~100점), 보장 공백(Gap), 진단 결과 및 리모델링 전략 자동 산출
"""

from typing import List, Dict, Any
from app.insurers_data import STANDARD_COVERAGES
from app.models import ExistingCoverageItem, CoverageDiagnosisDetail, DiagnosisResponse

class DiagnosisEngine:

    @classmethod
    def analyze_coverage(
        cls,
        age: int,
        gender: str,
        existing_coverages: List[ExistingCoverageItem]
    ) -> DiagnosisResponse:
        """기존 가입 내역 대비 적정 보장 진단 및 점수 산출"""
        cov_dict = {item.code: item.current_amount for item in existing_coverages}
        
        details: List[CoverageDiagnosisDetail] = []
        total_score_points = 0
        max_possible_points = 0
        total_existing_monthly_est = 0

        # 보장별 가중치 (암, 뇌, 심장, 수술비 순)
        weights = {
            "cov_cancer_gen": 25,
            "cov_cancer_sim": 10,
            "cov_cerebro": 15,
            "cov_cardio": 15,
            "cov_surg_disease_1_5": 15,
            "cov_surg_disease_gen": 5,
            "cov_surg_injury_1_5": 5,
            "cov_daily_liability": 5,
            "cov_driver_package": 5
        }

        recommended_actions = []

        for std in STANDARD_COVERAGES:
            if std.get("in_diagnosis") is False:
                continue  # 비교설계 전용 특약은 보장분석(점수) 대상에서 제외
            code = std["code"]
            name = std["name"]
            category = std["category"]
            rec_amt = std["recommended_amount"]
            cur_amt = cov_dict.get(code, 0)
            gap = max(0, rec_amt - cur_amt)

            # 상태 판정
            if cur_amt >= rec_amt:
                status = "sufficient" # 충족
                ratio = 1.0
            elif cur_amt > 0:
                status = "deficient" # 부족
                ratio = cur_amt / rec_amt
            else:
                status = "critical" # 미가입 (위험)
                ratio = 0.0

            # 점수 산출
            w = weights.get(code, 10)
            max_possible_points += w
            total_score_points += (w * ratio)

            # 리모델링 코멘트 및 권장 조치
            if status == "critical":
                if code == "cov_cancer_gen":
                    recommended_actions.append("암 발병 시 치료비 및 생활비 공백이 심각하므로 일반암 진단비 최소 3,000~5,000만원 우선 확보가 시급합니다.")
                elif code in ["cov_cerebro", "cov_cardio"]:
                    recommended_actions.append("뇌경색(중풍) 및 협심증 보장이 누락된 상태입니다. 범위가 넓은 뇌혈관·허혈성 진단비 보강이 필요합니다.")
                elif code == "cov_daily_liability":
                    recommended_actions.append("일상생활 중 배상책임(누수, 타인 재물/신체 손해) 담보가 전혀 없어 1천원대 비용으로 1억원 한도 즉시 가입을 권장합니다.")
                elif code == "cov_surg_disease_1_5":
                    recommended_actions.append("질병 수술비(1~5종)가 미가입되어 로봇수술 등 고액 비급여 수술비 부담에 취약합니다.")
            elif status == "deficient":
                if code == "cov_cancer_gen" and cur_amt < 3000:
                    recommended_actions.append(f"일반암 진단비가 {cur_amt:,}만원으로 평균 치료비(약 5천만원) 대비 부족하여 추가 보강이 유리합니다.")

            details.append(CoverageDiagnosisDetail(
                code=code,
                name=name,
                category=category,
                recommended_amount=rec_amt,
                current_amount=cur_amt,
                gap_amount=gap,
                status=status,
                description=std["description"]
            ))

        final_score = int(round((total_score_points / max_possible_points) * 100))

        # 종합 평가 총평 메시지
        if final_score >= 85:
            summary = "현재 보장 상태가 매우 우수하며 주요 질병 및 수술비가 균형 있게 준비되어 있습니다. 불필요한 중복 담보 다이어트 위주로 점검을 권장합니다."
        elif final_score >= 60:
            summary = "기본적인 보장은 구성되어 있으나, 2대 질환(뇌혈관/허혈성) 또는 수술비 한도 등 일부 필수 보장에 공백이 발견되었습니다."
        else:
            summary = "중대 질환(암·뇌·심장) 및 수술비에 대한 보장 공백이 매우 큽니다. 의료비 및 치료 기간 중 소득 상실에 대비한 전면적인 리모델링이 필요합니다."

        if not recommended_actions:
            recommended_actions.append("현재 가입된 보험의 갱신/비갱신 주기 및 불필요한 적립보험료 최소화 여부를 점검하세요.")

        return DiagnosisResponse(
            overall_score=final_score,
            total_existing_monthly_est=total_existing_monthly_est,
            coverage_details=details,
            summary_message=summary,
            recommended_actions=recommended_actions[:4] # 핵심 4개 액션
        )
