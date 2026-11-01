"""
8대 손해보험사 실시간 비교설계 및 보험료 산출 엔진
- 메리츠화재, 삼성화재, DB손해보험, 현대해상, KB손해보험, 한화손해보험, 흥국화재, 롯데손해보험
- 연령, 성별, 직업급수(1~3급), 병력유형(표준체/간편355/간편335), 납기/만기 반영
- 각 사별 담보별 특화 가중치 및 실무 계수 적용
"""

import math
from typing import List, Dict, Any
from app.insurers_data import (
    INSURERS, STANDARD_COVERAGES,
    CAREGIVER_INSURERS, CAREGIVER_COVERAGES, CAREGIVER_GROUPS
)
from app.models import CoverageRequestItem, InsurerQuoteItem, MultiQuoteResponse

class CalculationEngine:

    @staticmethod
    def calculate_age_factor(age: int, category: str) -> float:
        """연령에 따른 위험률 계수 산출 (기준연령: 40세 = 1.0)"""
        if "진단비" in category:
            # 진단비는 나이에 따라 가파르게 증가 (지수 곡선)
            return max(0.35, round(math.pow(age / 40.0, 1.95), 3))
        elif "암 특약" in category:
            # 암 치료비·전이암·생활비 특약도 암 위험률 기반으로 연령 증가 폭이 큼
            return max(0.35, round(math.pow(age / 40.0, 1.85), 3))
        elif "특약" in category:
            # 뇌·심장 치료비/입원 특약 등: 뇌·심혈관 위험률 기반으로 연령 증가
            return max(0.4, round(math.pow(age / 40.0, 1.7), 3))
        elif "수술비" in category:
            return max(0.45, round(math.pow(age / 40.0, 1.45), 3))
        elif "배상책임" in category:
            # 배상책임은 연령 영향 적음
            return 1.0
        elif "운전자" in category:
            # 운전자는 연령보다 운전위험이 크며 약간의 차이만 존재
            return 1.0 if age < 65 else 1.25
        else:
            return max(0.5, round(math.pow(age / 40.0, 1.2), 3))

    @staticmethod
    def calculate_gender_factor(gender: str, coverage_code: str) -> float:
        """성별에 따른 질환별 발생 위험 가중치"""
        is_male = (gender.upper() == "M")
        cov = next((c for c in STANDARD_COVERAGES if c["code"] == coverage_code), {})
        group = cov.get("group")

        if coverage_code == "cov_cancer_sim":
            # 갑상선암 등으로 인해 유사암은 여성이 상대적으로 높음
            return 0.85 if is_male else 1.25
        elif group in ("뇌", "심장"):
            # 뇌혈관 및 허혈성/심장질환은 남성이 상대적으로 높음
            return 1.15 if is_male else 0.85
        elif group == "암":
            # 일반암은 40대 전후 기준 남녀 유사하나 50대 이후 남성 급증
            return 1.05 if is_male else 0.95
        elif "injury" in coverage_code:
            # 상해는 활동량이 많은 남성이 통상 높음
            return 1.20 if is_male else 0.80
        return 1.0

    @staticmethod
    def calculate_job_factor(job_grade: int, coverage_code: str, category: str) -> float:
        """직업급수(1급:사무, 2급:외근/영업, 3급:현장/생산)에 따른 계수"""
        if "상해" in category or "injury" in coverage_code:
            if job_grade == 1:
                return 1.0
            elif job_grade == 2:
                return 1.45
            elif job_grade >= 3:
                return 2.20
        # 질병 및 진단비는 직업급수 영향 없음
        return 1.0

    @staticmethod
    def calculate_health_type_factor(health_type: str, category: str, insurer_id: str = None) -> float:
        """표준체 vs 10년 무사고 고지 할인형 vs 간편고지(유병자 3.5.5, 3.3.5, 3.2.5) 요율 계수"""
        if health_type in ["healthy_10yr", "no_accident_10yr"]:
            # 10년 무사고 고지 할인형 (5.10.10 초건강체): 표준체 대비 15~23% 추가 할인
            if "배상책임" in category:
                return 1.0
            discounts = {
                "kb": 0.77,       # KB 5.10.10 플러스: 최대 23% 할인
                "hanwha": 0.80,   # 한화 시그니처: 20% 할인
                "meritz": 0.82,   # 메리츠 맞춤건강: 18% 할인
                "db": 0.83,       # DB 참좋은: 17% 할인
                "heungkuk": 0.84, # 흥국 모두담은: 16% 할인
                "hyundai": 0.84,  # 현대 퍼펙트: 16% 할인
                "samsung": 0.85,  # 삼성 마이헬스: 15% 할인
                "lotte": 0.85     # 롯데 let:smile: 15% 할인
            }
            if insurer_id and insurer_id in discounts:
                return discounts[insurer_id]
            return 0.82
        elif health_type == "standard":
            return 1.0
        elif health_type == "simple_355":
            return 1.18 if "배상책임" not in category else 1.0
        elif health_type == "simple_335":
            return 1.35 if "배상책임" not in category else 1.0
        elif health_type == "simple_325":
            return 1.45 if "배상책임" not in category else 1.0
        return 1.0

    @staticmethod
    def calculate_term_factor(payment_period: str, expiry_period: str) -> float:
        """납입기간 및 만기 기간에 따른 월 보험료 환산 계수"""
        # 기준: 20년납 90세만기 = 1.0
        factor = 1.0
        if "30년납" in payment_period:
            factor *= 0.82 # 납입기간이 길수록 월보험료는 낮아짐
        elif "10년납" in payment_period:
            factor *= 1.65
        
        if "100세만기" in expiry_period:
            factor *= 1.12 # 만기가 길수록 위험률 증가
        elif "80세만기" in expiry_period:
            factor *= 0.85
        return factor

    @classmethod
    def calculate_coverage_premium(
        cls,
        cov_code: str,
        amount_manwon: int,
        age: int,
        gender: str,
        job_grade: int,
        health_type: str,
        payment_period: str,
        expiry_period: str,
        insurer: Dict[str, Any],
        renewal_type: str = "non_renewable"
    ) -> int:
        """단일 담보에 대한 원수사별 최종 월보험료 산출 (원 단위, 10원 단위 반올림)"""
        # 담보 기본 정보 조회
        cov_info = next((c for c in STANDARD_COVERAGES if c["code"] == cov_code), None)
        if not cov_info or amount_manwon <= 0:
            return 0

        base_rate = cov_info["base_rate_per_1000"] # 1천만원당 기준 월보험료
        category = cov_info["category"]

        # 계수 계산
        age_f = cls.calculate_age_factor(age, category)
        gender_f = cls.calculate_gender_factor(gender, cov_code)
        job_f = cls.calculate_job_factor(job_grade, cov_code, category)
        health_f = cls.calculate_health_type_factor(health_type, category, insurer.get("id"))
        term_f = cls.calculate_term_factor(payment_period, expiry_period)

        # 갱신/비갱신 요율 계수 산정
        # selectable 특약에서 소비자가 'renewable'(갱신형)을 선택한 경우:
        # 10년/20년 갱신형은 만기까지의 평균위험률 선납이 아닌 해당 기간 위험률만 납부하므로 초기 보험료가 약 45% 수준으로 저렴
        renewal_f = 1.0
        if cov_info.get("renewal_type") == "selectable":
            if renewal_type == "renewable":
                renewal_f = 0.45
            else:
                renewal_f = 1.0
        
        # 보험사별 고유 특화 가중치 적용
        ins_id = insurer["id"]
        ins_factor = insurer.get("base_factor", 1.0)

        # 원수사별 전략 담보 할인 가중치
        if ins_id == "meritz" and "진단비" in category:
            ins_factor *= 0.94 # 메리츠는 3대 진단비 경쟁력 높음
        elif ins_id == "db" and "수술비" in category:
            ins_factor *= 0.90 # DB는 질병수술비 업계 최고 경쟁력
        elif ins_id == "hanwha" and gender.upper() == "F":
            ins_factor *= 0.91 # 한화 시그니처 여성 특화 할인
        elif ins_id == "heungkuk" and cov_info.get("group") == "암":
            ins_factor *= 0.90 # 흥국 암 담보 가성비
        elif ins_id == "kb" and cov_info.get("group") in ("뇌", "심장"):
            ins_factor *= 0.93 # KB 뇌/심장 특화 할인
        elif ins_id == "hyundai" and ("배상책임" in category or "운전자" in category or cov_code.endswith("_sjt")):
            ins_factor *= 0.92 # 현대 일배책·생활특약 및 산정특례 진단비 경쟁력

        # 최종 월 보험료 계산
        raw_premium = (amount_manwon / 1000.0) * base_rate * age_f * gender_f * job_f * health_f * term_f * renewal_f * ins_factor
        
        # 10원 단위 반올림
        final_premium = int(round(raw_premium, -1))
        return max(100, final_premium)

    @classmethod
    def calculate_multi_quote(
        cls,
        age: int,
        gender: str,
        job_grade: int,
        health_type: str,
        payment_period: str,
        expiry_period: str,
        coverages: List[CoverageRequestItem],
        customer_id: int = None,
        customer_name: str = "고객"
    ) -> MultiQuoteResponse:
        """8대 전 손해보험사 동시 견적 산출 및 순위 매김"""
        quotes: List[InsurerQuoteItem] = []
        coverage_names = {c["code"]: c["name"] for c in STANDARD_COVERAGES}
        req_renewal_map = {item.code: getattr(item, "renewal_type", "non_renewable") or "non_renewable" for item in coverages}

        # [규정 준수] 유사암 진단비 20% 한도 자동 연동 (일반암 + 통합암 합산 기준)
        gen_amt = sum(item.amount for item in coverages if item.code == "cov_cancer_gen")
        group_amt = sum(item.amount for item in coverages if item.code == "cov_cancer_group_multi")
        base_cancer_amt = gen_amt + group_amt
        max_sim_limit = int(round(base_cancer_amt * 0.20))

        for item in coverages:
            if item.code == "cov_cancer_sim":
                if base_cancer_amt <= 0:
                    item.amount = 0
                elif item.amount > max_sim_limit:
                    item.amount = max_sim_limit

        for ins in INSURERS:
            cov_breakdown: Dict[str, int] = {}
            total_premium = 0
            std_total_premium = 0

            # 상품명 결정 (10년 무사고 할인형 vs 표준체 vs 간편건강)
            if health_type in ["healthy_10yr", "no_accident_10yr"]:
                product_name = ins.get("healthy_10yr_product", ins["standard_product"] + " (10년 무사고 고지형)")
            elif "simple" in health_type:
                product_name = ins.get("simple_product", ins["standard_product"])
            else:
                product_name = ins["standard_product"]

            for item in coverages:
                prem = cls.calculate_coverage_premium(
                    cov_code=item.code,
                    amount_manwon=item.amount,
                    age=age,
                    gender=gender,
                    job_grade=job_grade,
                    health_type=health_type,
                    payment_period=payment_period,
                    expiry_period=expiry_period,
                    insurer=ins,
                    renewal_type=req_renewal_map.get(item.code, "non_renewable")
                )
                cov_breakdown[item.code] = prem
                total_premium += prem

                # 표준체 기준 산출 (할인금액 비교 제시용)
                std_prem = cls.calculate_coverage_premium(
                    cov_code=item.code,
                    amount_manwon=item.amount,
                    age=age,
                    gender=gender,
                    job_grade=job_grade,
                    health_type="standard",
                    payment_period=payment_period,
                    expiry_period=expiry_period,
                    insurer=ins,
                    renewal_type=req_renewal_map.get(item.code, "non_renewable")
                )
                std_total_premium += std_prem

            # 표준체 대비 할인 금액 및 할인율 산출
            discount_amt = max(0, std_total_premium - total_premium)
            discount_rt = round((discount_amt / std_total_premium) * 100, 1) if std_total_premium > 0 else 0.0
            discount_desc = f"표준체 대비 월 {discount_amt:,}원 할인 (-{discount_rt}%)" if discount_amt > 0 else ""

            # 설계사 수당 및 시책 계산
            comm_pct = ins.get("commission_percent", 1100)
            total_comm = int(round(total_premium * (comm_pct / 100.0)))
            immediate_payout = int(round(total_comm * ins.get("immediate_rate", 0.40)))
            year1_payout = int(round(total_comm * ins.get("year1_rate", 0.72)))
            year2_payout = max(0, total_comm - year1_payout)
            net_payout = int(round(total_comm * (1.0 - 0.033))) # 3.3% 사업소득세 공제

            quotes.append(InsurerQuoteItem(
                insurer_id=ins["id"],
                insurer_name=ins["name"],
                insurer_code=ins["code"],
                theme_color=ins["theme_color"],
                badge_color=ins["badge_color"],
                product_name=product_name,
                total_monthly_premium=total_premium,
                strengths=ins["strengths"],
                coverage_breakdown=cov_breakdown,
                commission_est=ins.get("commission_rate", "1,100%"),
                commission_total=total_comm,
                commission_immediate=immediate_payout,
                commission_year1=year1_payout,
                commission_year2=year2_payout,
                commission_net=net_payout,
                standard_monthly_premium=std_total_premium,
                discount_amount=discount_amt,
                discount_rate=discount_rt,
                discount_desc=discount_desc
            ))

        # 보험료 낮은 순으로 정렬
        quotes.sort(key=lambda x: x.total_monthly_premium)

        # 랭킹 부여 및 최저가 표시
        for i, q in enumerate(quotes):
            q.rank = i + 1
            if i == 0:
                q.is_cheapest = True

        # 추천 보험사 선정 로직 (최저가 + 회사 신뢰도 + 10년무사고 특화 영역 종합 판단)
        lowest_id = quotes[0].insurer_id
        recommended_id = lowest_id

        # 10년 무사고 고지 할인형인 경우: 5.10.10 파격 할인(23%) 선도사인 KB가 상위권이면 우선 추천
        if health_type in ["healthy_10yr", "no_accident_10yr"]:
            kb_quote = next((q for q in quotes if q.insurer_id == "kb"), None)
            if kb_quote and kb_quote.rank <= 2:
                recommended_id = "kb"
            else:
                recommended_id = lowest_id
        else:
            for q in quotes:
                if gender.upper() == "F" and q.insurer_id == "hanwha" and q.rank <= 3:
                    recommended_id = "hanwha"
                    break
                elif q.insurer_id == "db" and q.rank <= 2:
                    recommended_id = "db"
                    break

        for q in quotes:
            if q.insurer_id == recommended_id:
                q.is_recommended = True

        customer_summary = {
            "customer_id": customer_id,
            "name": customer_name,
            "age": age,
            "gender": "남성" if gender.upper() == "M" else "여성",
            "job_grade": f"{job_grade}급",
            "health_type": "10년 무사고 고지 할인형 (5.10.10 초건강체)" if health_type in ["healthy_10yr", "no_accident_10yr"] else ("표준체 (건강체)" if health_type == "standard" else ("간편 3.5.5" if health_type == "simple_355" else "간편 3.3.5")),
            "payment_period": payment_period,
            "expiry_period": expiry_period
        }

        # 특약별 갱신형/비갱신형 상세 안내 및 선택 정보
        coverage_renewal_info = {
            c["code"]: {
                "code": c["code"],
                "name": c["name"],
                "renewal_type": c.get("renewal_type", "selectable"),
                "is_renewable_only": c.get("is_renewable_only", False),
                "renewal_cycle": c.get("renewal_cycle", "비갱신 또는 10/20년 갱신"),
                "renewal_desc": c.get("renewal_desc", ""),
                "selected_renewal": "renewable" if c.get("is_renewable_only") else req_renewal_map.get(c["code"], "non_renewable")
            }
            for c in STANDARD_COVERAGES
        }

        max_disc_quote = max(quotes, key=lambda x: x.discount_amount or 0) if quotes else None
        max_disc_amt = max_disc_quote.discount_amount if max_disc_quote else 0
        max_disc_rt = max_disc_quote.discount_rate if max_disc_quote else 0.0

        return MultiQuoteResponse(
            customer_summary=customer_summary,
            quotes=quotes,
            lowest_premium_insurer=quotes[0].insurer_name,
            recommended_insurer=next(q.insurer_name for q in quotes if q.is_recommended),
            coverage_names=coverage_names,
            coverage_renewal_info=coverage_renewal_info,
            max_discount_amount=max_disc_amt,
            max_discount_rate=max_disc_rt,
            has_discount=max_disc_amt > 0
        )

    @classmethod
    def calculate_caregiver_multi_quote(
        cls,
        age: int,
        gender: str,
        job_grade: int,
        health_type: str,
        payment_period: str,
        expiry_period: str,
        coverages: List[CoverageRequestItem],
        customer_id: int = None,
        customer_name: str = "고객"
    ) -> MultiQuoteResponse:
        """8대 손보사 간병보험(간병인 사용일당·장기요양·치매) 실시간 비교 견적 산출"""
        cov_catalog = {c["code"]: c for c in CAREGIVER_COVERAGES}
        req_cov_map = {item.code: item.amount for item in coverages}
        req_renewal_map = {item.code: item.renewal_type for item in coverages}

        # 담보별 한글 명칭 매핑
        coverage_names = {c["code"]: c["name"] for c in CAREGIVER_COVERAGES if c["code"] in req_cov_map and req_cov_map[c["code"]] > 0}

        quotes: List[InsurerQuoteItem] = []

        is_female = (gender.upper() == "F")

        # 건강상태 할증 계수
        health_factors = {
            "healthy_10yr": 0.85, # 10년 무사고 고지 초건강체 15% 할인
            "no_accident_10yr": 0.85,
            "standard": 1.0,
            "simple_355": 1.15,
            "simple_335": 1.25,
            "simple_325": 1.35,
            "simple_315": 1.45
        }
        health_factor = health_factors.get(health_type, 1.0)

        # 만기 계수 (90세 vs 100세)
        expiry_factor = 1.18 if "100" in expiry_period else 1.0

        for ins in CAREGIVER_INSURERS:
            ins_id = ins["id"]
            ins_factor = ins.get("caregiver_factor", 1.0)
            breakdown: Dict[str, int] = {}
            total_premium = 0

            for code, amount in req_cov_map.items():
                if amount <= 0 or code not in cov_catalog:
                    continue

                cov_def = cov_catalog[code]
                base_rate = cov_def["base_rate_per_1000"]
                group = cov_def.get("group", "")

                # 1. 간병보험 연령 계수 산출 (40세 기준 곡선)
                if "간병인" in group:
                    # 간병인 사용일당: 50~60대에서 가파르게 증가
                    age_factor = max(0.4, round(math.pow(age / 40.0, 1.65), 3))
                elif "장기요양" in group:
                    # 장기요양 판정: 고연령에서 급증
                    age_factor = max(0.35, round(math.pow(age / 40.0, 2.15), 3))
                elif "재가" in group or "시설" in group:
                    # 재가/시설급여: 지속 케어 비용
                    age_factor = max(0.35, round(math.pow(age / 40.0, 1.95), 3))
                elif "치매" in group:
                    # 치매: 60대 이후 지수 곡선으로 폭증
                    age_factor = max(0.3, round(math.pow(age / 40.0, 2.45), 3))
                else:
                    age_factor = max(0.4, round(math.pow(age / 40.0, 1.5), 3))

                # 2. 성별 계수 (여성이 치매/장기요양/간병인 위험률 다소 높음)
                if "치매" in group or "장기요양" in group:
                    gender_factor = 1.18 if is_female else 0.88
                elif "간병인" in group:
                    gender_factor = 1.10 if is_female else 0.92
                else:
                    gender_factor = 1.0

                # 3. 갱신/비갱신 할인율
                is_renew_only = cov_def.get("is_renewable_only", False)
                chosen_renew = req_renewal_map.get(code, "non_renewable")
                if is_renew_only or chosen_renew == "renewable":
                    renewal_factor = 0.48 # 갱신형은 초기 보험료 약 52% 저렴
                else:
                    renewal_factor = 1.0

                # 기본 보험료 계산 (단위별 정확한 요율 반영)
                unit = cov_def.get("unit", "만원")
                if "만원/일" in unit:
                    # 일당 담보 (가입금액 15만원 = 15): 1만원당 월요율 기준
                    # base_rate_per_1000에 1만원당 요율(예: 1,600원)을 저장하여 곱함
                    rate_per_unit = base_rate / 100.0
                    item_prem = amount * rate_per_unit * age_factor * gender_factor * health_factor * expiry_factor * renewal_factor * ins_factor
                elif "만원/월" in unit:
                    # 매월 생활비/급여 담보 (가입금액 50만원 = 50): 10만원당 요율 기준
                    rate_per_unit = base_rate / 100.0
                    item_prem = (amount / 10.0) * rate_per_unit * age_factor * gender_factor * health_factor * expiry_factor * renewal_factor * ins_factor
                elif unit == "구좌":
                    # 구좌형 (1구좌)
                    item_prem = amount * base_rate * age_factor * gender_factor * health_factor * expiry_factor * renewal_factor * ins_factor
                else:
                    # 일시금 진단비 (1,000만원 = 1000): 1천만원당 기준요율
                    item_prem = (amount / 1000.0) * base_rate * age_factor * gender_factor * health_factor * expiry_factor * renewal_factor * ins_factor

                # 10원 단위 반올림
                item_prem_rounded = int(round(item_prem / 10.0) * 10)
                breakdown[code] = max(100, item_prem_rounded)
                total_premium += breakdown[code]

            # 최소 보험료 보정 (간병보험 최저 15,000원)
            if total_premium > 0:
                total_premium = max(15000, total_premium)

            # 설계사 수당 및 시책금 계산
            comm_pct = ins.get("commission_percent", 1200)
            total_comm = int(total_premium * (comm_pct / 100.0))
            immediate_comm = int(total_comm * ins.get("immediate_rate", 0.42))
            year1_comm = int(total_comm * ins.get("year1_rate", 0.74))
            year2_comm = int(total_comm * ins.get("year2_rate", 0.26))
            net_comm = int(total_comm * 0.967) # 3.3% 원천징수 후 실지급액

            # 표준체 기준 산출 (10년 무사고 할인 제시용)
            std_factor_val = 1.0 / (health_factor if health_factor > 0 else 1.0)
            std_total_premium = int(round(total_premium * std_factor_val / 10.0) * 10) if health_factor < 1.0 else total_premium
            cg_disc_amt = max(0, std_total_premium - total_premium)
            cg_disc_rt = round((cg_disc_amt / std_total_premium) * 100, 1) if std_total_premium > 0 else 0.0
            cg_disc_desc = f"표준체 대비 월 {cg_disc_amt:,}원 할인 (-{cg_disc_rt}%)" if cg_disc_amt > 0 else ""

            quotes.append(InsurerQuoteItem(
                insurer_id=ins["id"],
                insurer_name=ins["name"],
                insurer_code=ins["code"],
                theme_color=ins["theme_color"],
                badge_color=ins["badge_color"],
                product_name=ins["caregiver_product"],
                total_monthly_premium=total_premium,
                strengths=ins["strengths"],
                coverage_breakdown=breakdown,
                commission_est=f"월납의 약 {comm_pct}% ({total_comm:,}원)",
                commission_total=total_comm,
                commission_immediate=immediate_comm,
                commission_year1=year1_comm,
                commission_year2=year2_comm,
                commission_net=net_comm,
                standard_monthly_premium=std_total_premium,
                discount_amount=cg_disc_amt,
                discount_rate=cg_disc_rt,
                discount_desc=cg_disc_desc
            ))

        # 보험료 오름차순 정렬
        quotes.sort(key=lambda x: x.total_monthly_premium)

        # 순위 부여 및 최저가 마킹
        for rank, q in enumerate(quotes, 1):
            q.rank = rank
            if rank == 1:
                q.is_cheapest = True

        # 추천 보험사 선정 로직 (간병 명가 메리츠/DB 또는 여성 시 한화)
        lowest_id = quotes[0].insurer_id
        recommended_id = lowest_id
        for q in quotes:
            if is_female and q.insurer_id == "hanwha" and q.rank <= 3:
                recommended_id = "hanwha"
                break
            elif q.insurer_id in ("meritz", "db") and q.rank <= 3:
                recommended_id = q.insurer_id
                break

        for q in quotes:
            if q.insurer_id == recommended_id:
                q.is_recommended = True

        customer_summary = {
            "customer_id": customer_id,
            "name": customer_name,
            "age": age,
            "gender": "여성" if is_female else "남성",
            "job_grade": f"{job_grade}급",
            "health_type": "표준체 (건강체)" if health_type == "standard" else (
                "간편 3.5.5" if health_type == "simple_355" else (
                    "간편 3.3.5" if health_type == "simple_335" else "간편 3.2.5"
                )
            ),
            "payment_period": payment_period,
            "expiry_period": expiry_period
        }

        # 간병 특약 갱신 정보
        coverage_renewal_info = {
            c["code"]: {
                "code": c["code"],
                "name": c["name"],
                "renewal_type": c.get("renewal_type", "selectable"),
                "is_renewable_only": c.get("is_renewable_only", False),
                "renewal_cycle": c.get("renewal_cycle", "비갱신 또는 10/20년 갱신"),
                "renewal_desc": c.get("description", ""),
                "selected_renewal": "renewable" if c.get("is_renewable_only") else req_renewal_map.get(c["code"], "non_renewable")
            }
            for c in CAREGIVER_COVERAGES
        }

        max_disc_quote = max(quotes, key=lambda x: x.discount_amount or 0) if quotes else None
        max_disc_amt = max_disc_quote.discount_amount if max_disc_quote else 0
        max_disc_rt = max_disc_quote.discount_rate if max_disc_quote else 0.0

        return MultiQuoteResponse(
            customer_summary=customer_summary,
            quotes=quotes,
            lowest_premium_insurer=quotes[0].insurer_name,
            recommended_insurer=next(q.insurer_name for q in quotes if q.is_recommended),
            coverage_names=coverage_names,
            coverage_renewal_info=coverage_renewal_info,
            max_discount_amount=max_disc_amt,
            max_discount_rate=max_disc_rt,
            has_discount=max_disc_amt > 0
        )
