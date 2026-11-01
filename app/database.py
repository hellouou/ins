"""
SQLite 데이터베이스 초기화 및 CRUD 유틸리티
- 고객(customers)
- 보장분석 내역(diagnoses)
- 비교견적 및 설계안(proposals)
- 대리점 설정(agency_settings)
"""

import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ins_ga.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 대리점 기본 정보 테이블
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agency_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agency_name TEXT NOT NULL,
        representative TEXT,
        registration_no TEXT,
        contact TEXT,
        address TEXT,
        agent_name TEXT,
        agent_contact TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 고객 테이블
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        gender TEXT NOT NULL, -- 'M' or 'F'
        birthdate TEXT NOT NULL, -- 'YYYY-MM-DD'
        age INTEGER NOT NULL,
        job_grade INTEGER DEFAULT 1, -- 1(사무), 2(영업/운전), 3(현장)
        job_name TEXT,
        phone TEXT,
        is_driver BOOLEAN DEFAULT 1,
        health_type TEXT DEFAULT 'standard', -- 'standard'(표준체), 'simple_355'(간편355), 'simple_335'(간편335)
        memo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 보장분석 내역 테이블
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS diagnoses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        existing_coverages_json TEXT,
        diagnosis_result_json TEXT,
        score INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id)
    );
    """)

    # 비교설계안/제안서 테이블
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS proposals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        title TEXT NOT NULL,
        plan_type TEXT NOT NULL, -- 'standard_health', 'simple_health', 'driver'
        payment_period TEXT DEFAULT '20년납',
        expiry_period TEXT DEFAULT '90세만기',
        coverages_json TEXT NOT NULL,
        calculated_results_json TEXT NOT NULL,
        recommended_insurer_id TEXT,
        status TEXT DEFAULT 'draft', -- 'draft', 'presented', 'contracted'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers (id)
    );
    """)

    # 홈페이지 고객 상담신청 접수 테이블
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        birthdate TEXT,
        interest_field TEXT,
        preferred_time TEXT,
        message TEXT,
        status TEXT DEFAULT '신규접수', -- '신규접수', '상담진행중', '설계완료'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 기본 대리점 설정 없으면 기본값 삽입
    cursor.execute("SELECT COUNT(*) FROM agency_settings")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO agency_settings (
            agency_name, representative, registration_no, contact, agent_name, agent_contact
        ) VALUES (
            '인슈탑 법인보험대리점(GA)', '대표이사', 'GA-2024-08912', '02-1588-0000', '수석설계사', '010-1234-5678'
        );
        """)

    # 샘플 고객이 없으면 테스트용 고객 2명 자동 등록
    cursor.execute("SELECT COUNT(*) FROM customers")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO customers (name, gender, birthdate, age, job_grade, job_name, phone, is_driver, health_type, memo)
        VALUES 
        ('홍길동', 'M', '1984-05-15', 40, 1, '일반 사무직', '010-9876-5432', 1, 'standard', '3대 질병 진단비 및 수술비 종합 리모델링 희망'),
        ('김영희', 'F', '1989-11-20', 35, 1, '교사', '010-2345-6789', 1, 'simple_355', '갑상선 결절 추적관찰 중으로 간편 3.5.5 가입 검토');
        """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
