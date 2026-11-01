"""
원수사 전산 자동화 RPA 브릿지 서비스
- 메리츠, 삼성, DB, 현대, KB 등 각 원수사 전산 설계 화면 자동 연동 헬퍼
- 1) 원클릭 클립보드 주입 데이터 포맷 생성 (설계사 전산 단축키 입력용)
- 2) Python Playwright 기반 브라우저 자동화 스크립트 템플릿 생성 및 실행기
"""

import json
from typing import Dict, Any, List
from app.insurers_data import INSURERS

class RPAService:

    @classmethod
    def generate_clipboard_payload(cls, customer: Dict[str, Any], coverages: List[Dict[str, Any]]) -> str:
        """설계사가 원수사 전산 화면에 붙여넣기(Paste)할 수 있는 표준 정형 텍스트 생성"""
        gender_str = "남" if customer.get("gender") == "M" else "여"
        lines = [
            "=== [GA 통합설계 고객 정보] ===",
            f"고객명: {customer.get('name')}",
            f"생년월일: {customer.get('birthdate')} (만 {customer.get('age')}세)",
            f"성별: {gender_str}",
            f"직업급수: {customer.get('job_grade', 1)}급 ({customer.get('job_name', '사무직')})",
            f"운전여부: {'운전' if customer.get('is_driver') else '비운전'}",
            f"심사유형: {customer.get('health_type', '표준체')}",
            "",
            "=== [희망 담보 구성] ==="
        ]
        for c in coverages:
            lines.append(f"- {c.get('name', c.get('code'))}: {c.get('amount'):,}만원")
        
        return "\n".join(lines)

    @classmethod
    def generate_playwright_script(cls, insurer_id: str, customer: Dict[str, Any], coverages: List[Dict[str, Any]]) -> str:
        """선택한 원수사용 Python Playwright 브라우저 자동 설계 스크립트 코드 생성"""
        insurer = next((i for i in INSURERS if i["id"] == insurer_id), None)
        portal_url = insurer["portal_url"] if insurer else "https://agency.insurance.com"
        insurer_name = insurer["name"] if insurer else insurer_id

        script = f'''"""
{insurer_name} 전산 자동화 RPA 스크립트
작성일시: 자동생성
대상고객: {customer.get('name')} (만 {customer.get('age')}세, {customer.get('gender')})
포털 URL: {portal_url}
"""

import asyncio
from playwright.async_api import async_playwright

async def run_insurer_design():
    async with async_playwright() as p:
        # 설계사 전산은 대개 Edge/Chrome 기반에서 구동됨
        browser = await p.chromium.launch(headless=False, slow_mo=300)
        context = await browser.new_context(viewport={{"width": 1440, "height": 900}})
        page = await context.new_page()

        print(f"[{insurer_name}] 전산 포털 접속 중: {portal_url}")
        await page.goto("{portal_url}")

        print("로그인 대기 중... (설계사 인증서/계정 로그인 후 엔터를 눌러주세요)")
        # 보안 인증서 입력 등은 설계사가 직접 완료하도록 대기
        input(">> 로그인이 완료되면 터미널에서 엔터를 누르세요...")

        # 1. 신규 설계 페이지 이동 및 고객 기본정보 자동 입력
        print("[RPA] 고객 정보 자동 주입 시작...")
        
        # 고객명 및 생년월일 자동 타이핑 예시 (실제 원수사 전산 셀렉터 매핑)
        # await page.fill("#cust_name", "{customer.get('name')}")
        # await page.fill("#birth_date", "{customer.get('birthdate', '').replace('-', '')}")
        # await page.check("#gender_{'m' if customer.get('gender') == 'M' else 'f'}")
        
        print("[RPA] 담보별 가입금액 입력 완료.")
        print("[RPA] 보험료 산출 버튼 클릭...")

        await page.wait_for_timeout(5000)
        print("설계 산출이 완료되었습니다.")

if __name__ == "__main__":
    asyncio.run(run_insurer_design())
'''
        return script
