/* ==========================================
   에이블세무회계 (ABLE TAX) - Interactive JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initReviewSlider();
    initScrollReveal();
    initHeaderSearch(); // 실시간 연동 검색창 초기화
    initScrollspy();    // 좌측 스크롤스파이 초기화
    initHeroAutoSlide(); // 홈 섹션 자동 슬라이드 초기화
    
    // 스마트 세무 도구 초기화
    renderCalendar();
    calculateVAT();
    calculateCorpSavings();
    calculateNetSalaryBurden();
    calculateDrawerNetSalaryBurden();
    calculateDrawerVAT();
    calculateDrawerCorpSavings();
});

// 1. 헤더 스크롤 효과
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 스크롤 위치에 따른 내비게이션 활성화
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        // 모바일 주소 매칭 (./index.html#section 혹은 #section 형태 지원)
        const href = link.getAttribute('href');
        if (href && (href === `#${currentSectionId}` || href.endsWith(`#${currentSectionId}`))) {
            link.classList.add('active');
        }
    });
}

// 2. 모바일 메뉴 제어 (글래스모피즘 어두운 오버레이 동적 생성 및 트랜지션 연동)
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!toggleBtn || !mobileMenu) return;

    // 모바일 네비 오버레이가 없으면 바디에 자동 동적 생성
    let overlay = document.getElementById('mobile-nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mobile-nav-overlay';
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);
    }

    const links = mobileMenu.querySelectorAll('a');
    
    // 모바일 메뉴 닫기 공통 처리 함수
    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        toggleBtn.classList.remove('active');
        overlay.classList.remove('open');
        document.body.style.overflow = ''; // 스크롤 잠금 해제
        
        const spans = toggleBtn.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    };

    toggleBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        toggleBtn.classList.toggle('active');
        overlay.classList.toggle('open', isOpen);
        
        // 메뉴 열렸을 때 뒷배경 스크롤 잠금 방지/활성화
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        // 햄버거 아이콘 X자 변환 애니메이션
        const spans = toggleBtn.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // 배경 어두운 부분을 누르면 닫히도록 연동
    overlay.addEventListener('click', closeMenu);
    
    // 메뉴 링크 클릭 시 서랍 닫히도록 연동
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// 3. 특화 서비스 탭 전환
function switchTab(event, tabId) {
    // 탭 버튼 비활성화 및 클릭 타겟 활성화
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // 탭 콘텐츠 토글
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    const targetContent = document.getElementById(tabId);
    targetContent.classList.add('active');
}

// 3.1 자주찾는 메뉴 클릭 연동을 위한 프로그래밍 탭 전환
function switchTabTo(tabId) {
    const btnId = tabId === 'clinic-tab' ? 'btn-clinic-tab' : (tabId === 'creator-tab' ? 'btn-creator-tab' : 'btn-startup-tab');
    const btn = document.getElementById(btnId);
    if (btn) {
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => content.classList.remove('active'));
        
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }
}

// 3.15 홈 섹션 영웅 카드 대상 세그먼트 전환 함수
const HERO_SEGMENTS = {
    medical: {
        badge: '전국 300+ 병의원 전담 메디컬 세무 서비스',
        title: '병원 진료에만 전념하세요<br>골치 아픈 세무 리스크는<br><span class="blue-highlight" style="color: var(--hometax-blue);">해결(ABLE)</span>해 드립니다',
        desc: '의사 면허의 무게를 압니다. <strong>비급여 현금매출 리스크, 페이닥터 4대보험, 고가 의료장비 세액공제, MSO/의료법인 전환 시뮬레이션까지.</strong><br>빅4 대형회계법인 TAX 본부 출신의 고혜진 대표회계사가 원장님의 가장 든든한 세무 방패가 되겠습니다.',
        primaryBtnText: '우리 병원 3분 세무 자가 진단',
        primaryBtnHref: '#quiz',
        outlineBtnText: '개원 세무 체크리스트 PDF 받기',
        outlineBtnHref: '#lead-magnet-section',
        stats: [
            { val: '24 건', lbl: '세무조사 방어 성공' },
            { val: '32 %', lbl: '평균 세액 절감율' },
            { val: '99.8 %', lbl: '성실신고 무사고율' }
        ],
        cardTitle: 'ABLE 메디컬 스마트 세무인증',
        cardSubtitle: '에이블 전담 병의원 밀착 기장 케어 시스템',
        cardIcon: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
        cardMocks: [
            { label: '2:1 케어', text: '메디컬 전문 기장팀 더블 매칭 시스템', bg: '#1e40af' },
            { label: '소명 대응', text: '의료장비 투자세액공제 & 비급여 소명 방어', bg: '#065f46' },
            { label: '세무 진단', text: '성실신고확인대상 대비 연 2회 모의조사', bg: '#b91c1c' }
        ],
        cardStatus: '현재 병의원 성실신고 및 상반기 가결산 분석 기간입니다. 원장님 전담 분석 리포트 대기 중.',
        cardBtnText: '개원 및 수임 무료 상담신청',
        themeColor: '#10b981'
    },
    corporate: {
        badge: '대·중·소기업 및 스타트업 맞춤 절세 파트너',
        title: '본업의 성장과 혁신에만 전념하세요<br>세금과 자금 관리 리스크는<br><span class="blue-highlight" style="color: var(--hometax-blue);">해결(ABLE)</span>해 드립니다',
        desc: '스타트업 및 법인의 설립부터 R&D 연구개발비 세액공제 사전 심사 100% 방어, 노무·급여 대장 자동화, 그리고 외부 감사 대비 투명 장부 관리까지. 에이블의 완결형 시스템이 기업의 경영 리스크를 완벽히 통제합니다.',
        primaryBtnText: '우리 기업 3분 세무 자가 진단',
        primaryBtnHref: '#contact',
        outlineBtnText: '스타트업 세무/노무 가이드 받기',
        outlineBtnHref: '#contact',
        stats: [
            { val: '300+ 사', lbl: '기업 고객 파트너십' },
            { val: '99 %', lbl: '기장 고객 재계약율' },
            { val: '120 억+', lbl: '누적 절세 환급액' }
        ],
        cardTitle: 'ABLE 기업/스타트업 스마트 세무인증',
        cardSubtitle: '대·중·소기업 및 스타트업 맞춤 절세 시스템',
        cardIcon: '<path d="M2 20h20M4 20V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M9 6h6M9 10h6M9 14h6"/>',
        cardMocks: [
            { label: 'R&D 공제', text: '연구인력 개발비 세액공제 사전심사 완벽 대응', bg: '#2563eb' },
            { label: '경리 아웃소싱', text: '인사·노무 대행부터 매월 손익/자금 보고서 발행', bg: '#0d9488' },
            { label: '외감 대비', text: '외부 회계감사 대비 표준 재무제표 정밀 관리', bg: '#475569' }
        ],
        cardStatus: '현재 법인세 결산 시뮬레이션 및 연구개발비 세액공제 감면 신청 기간입니다.',
        cardBtnText: '법인 및 스타트업 무료 상담신청',
        themeColor: '#3b82f6'
    },
    creator: {
        badge: '크리에이터 & 1인 미디어 전속 세무 케어',
        title: '콘텐츠 제작에만 전념하세요<br>복잡한 정산과 세무 리스크는<br><span class="blue-highlight" style="color: var(--hometax-blue);">해결(ABLE)</span>해 드립니다',
        desc: '유튜브 애드센스 달러 정산부터 해외 MCN 계약 검토, 더클코리아스튜디오 등 대형 에이전시 전속 세무 자문까지. 크리에이터 맞춤 소득세 최대 100% 감면과 1:1 전속 회계사 매칭으로 채널의 소득을 완벽히 수호합니다.',
        primaryBtnText: '크리에이터 3분 세무 자가 진단',
        primaryBtnHref: '#contact',
        outlineBtnText: '1인 미디어 세무 가이드 받기',
        outlineBtnHref: '#contact',
        stats: [
            { val: '더클코리아', lbl: '공식 전속 회계세무 파트너' },
            { val: '최대 100%', lbl: '크리에이터 소득세 감면율' },
            { val: '1:1 매칭', lbl: '전담 회계사 전속 밀착 케어' }
        ],
        cardTitle: 'ABLE 크리에이터 스마트 세무인증',
        cardSubtitle: '크리에이터 & 1인 미디어 전속 세무 케어 시스템',
        cardIcon: '<path d="M23 7a2 2 0 0 0-2.45-1.45L12 8 3 5.45A2 2 0 0 0 0.5 7.4v9.2a2 2 0 0 0 1.45 1.95L12 21.1l10.05-2.55A2 2 0 0 0 23.5 16.6V7z"/><polygon points="12 8 12 21.1 12 8"/>',
        cardMocks: [
            { label: '전속 세무사', text: '크리에이터 전담 세무 대리인 (1:1 톡 채널 개설)', bg: '#db2777' },
            { label: '외화 정산', text: '애드센스 외화 소득 신고 및 영세율 적용 부가세 환급', bg: '#7c3aed' },
            { label: 'MCN 제휴', text: '더클코리아스튜디오 등 에이전시 제휴 전속 세무', bg: '#ea580c' }
        ],
        cardStatus: '현재 크리에이터 종합소득세 감면 대상 분석 및 플랫폼 외화 정산 검토 기간입니다.',
        cardBtnText: '크리에이터 및 MCN 상담신청',
        themeColor: '#ec4899'
    }
};

let heroAutoSlideInterval = null;
let currentHeroSegmentIndex = 0;
const segmentKeys = ['medical', 'corporate', 'creator'];

function initHeroAutoSlide() {
    startHeroAutoSlide();
}

function startHeroAutoSlide() {
    stopHeroAutoSlide();
    heroAutoSlideInterval = setInterval(() => {
        currentHeroSegmentIndex = (currentHeroSegmentIndex + 1) % segmentKeys.length;
        const nextSegment = segmentKeys[currentHeroSegmentIndex];
        
        // Find corresponding tab button
        const tabs = document.querySelectorAll('.hero-segment-btn');
        let targetTabBtn = null;
        tabs.forEach(tab => {
            const onclickAttr = tab.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes(nextSegment)) {
                targetTabBtn = tab;
            }
        });
        
        if (targetTabBtn) {
            switchHeroSegment(nextSegment, targetTabBtn, true);
        }
    }, 6000); // 6초 간격 전환
}

function stopHeroAutoSlide() {
    if (heroAutoSlideInterval) {
        clearInterval(heroAutoSlideInterval);
        heroAutoSlideInterval = null;
    }
}

function switchHeroSegment(segmentType, btnElement, isAuto = false) {
    // 사용자가 직접 클릭한 경우 자동 롤링을 멈춤
    if (!isAuto) {
        stopHeroAutoSlide();
    }
    
    // 현재 세그먼트 인덱스 동기화
    currentHeroSegmentIndex = segmentKeys.indexOf(segmentType);

    const data = HERO_SEGMENTS[segmentType];
    if (!data) return;

    // 1. 탭 버튼의 활성화 상태 업데이트 (CSS가 색상 및 활성화 처리를 전담하도록 간소화)
    const tabs = document.querySelectorAll('.hero-segment-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    btnElement.classList.add('active');

    // 2. 백그라운드 이미지 크로스페이드 (슬라이드)
    const slides = document.querySelectorAll('.hero-slide');
    slides.forEach(slide => {
        slide.style.opacity = '0';
    });
    const activeSlide = document.getElementById(`slide-${segmentType}`);
    if (activeSlide) {
        activeSlide.style.opacity = '1';
    }

    // 3. 왼쪽 영역 내용 및 지표 동적 교체
    const badgeText = document.getElementById('hero-badge-text');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.getElementById('hero-desc');
    const btnPrimary = document.getElementById('hero-btn-primary');
    const btnOutline = document.getElementById('hero-btn-outline');
    
    if (badgeText) badgeText.innerText = data.badge;
    if (heroTitle) heroTitle.innerHTML = data.title;
    if (heroDesc) heroDesc.innerHTML = data.desc;
    if (btnPrimary) {
        btnPrimary.innerText = data.primaryBtnText;
        btnPrimary.href = data.primaryBtnHref;
    }
    if (btnOutline) {
        btnOutline.innerText = data.outlineBtnText;
        btnOutline.href = data.outlineBtnHref;
    }

    // 통계 수치 업데이트
    const stat1Val = document.getElementById('hero-rating-1-val');
    const stat1Lbl = document.getElementById('hero-rating-1-lbl');
    const stat2Val = document.getElementById('hero-rating-2-val');
    const stat2Lbl = document.getElementById('hero-rating-2-lbl');
    const stat3Val = document.getElementById('hero-rating-3-val');
    const stat3Lbl = document.getElementById('hero-rating-3-lbl');

    if (stat1Val && stat1Lbl) {
        stat1Val.innerText = data.stats[0].val;
        stat1Lbl.innerText = data.stats[0].lbl;
    }
    if (stat2Val && stat2Lbl) {
        stat2Val.innerText = data.stats[1].val;
        stat2Lbl.innerText = data.stats[1].lbl;
    }
    if (stat3Val && stat3Lbl) {
        stat3Val.innerText = data.stats[2].val;
        stat3Lbl.innerText = data.stats[2].lbl;
    }

    // 4. 오른쪽 실버 카드 내용 교체
    const cardTitleText = document.getElementById('hero-card-title-text');
    const cardSubtitle = document.getElementById('hero-card-subtitle');
    const cardIcon = document.getElementById('hero-card-icon');
    const cardMocksContainer = document.getElementById('hero-card-mocks');
    const cardStatusText = document.getElementById('hero-card-status-text');
    const cardBtn = document.getElementById('hero-card-btn');

    if (cardTitleText) cardTitleText.innerText = data.cardTitle;
    if (cardSubtitle) cardSubtitle.innerText = data.cardSubtitle;
    if (cardIcon) {
        cardIcon.innerHTML = data.cardIcon;
        cardIcon.setAttribute('stroke', '#0f172a');
    }
    if (cardStatusText) cardStatusText.innerText = data.cardStatus;
    if (cardBtn) {
        cardBtn.innerText = data.cardBtnText;
    }

    if (cardMocksContainer) {
        cardMocksContainer.innerHTML = data.cardMocks.map(mock => `
            <div class="portal-input-mock">
                <span class="mock-label" style="background: ${mock.bg}; color: #ffffff; font-weight: 700; border-radius: 4px; padding: 2px 6px; font-size: 0.72rem;">${mock.label}</span>
                <span>${mock.text}</span>
            </div>
        `).join('');
    }
}

// 3.2 병의원 특화 솔루션 아코디언 제어
function toggleAccordion(element) {
    const parentList = element.parentElement;
    const cards = parentList.querySelectorAll('.accordion-card');
    const isActive = element.classList.contains('active');
    
    // 다른 모든 아코디언 카드 닫기
    cards.forEach(card => card.classList.remove('active'));
    
    // 클릭한 아코디언 카드가 닫혀있었다면 열기
    if (!isActive) {
        element.classList.add('active');
    }
}

// 4. 자가 진단 퀴즈 위젯 로직
let quizAnswers = { q1: null, q2: null, q3: null };

function setQuizAnswer(step, value) {
    quizAnswers[`q${step}`] = value;
    
    // 현재 단계 옵션들의 디자인 업데이트
    const stepEl = document.getElementById(`step-${step}`);
    const optionCards = stepEl.querySelectorAll('.quiz-option-card');
    
    optionCards.forEach((card, idx) => {
        // q1: nonpay(0) / insurance(1), q2: single(0) / group(1), q3: stable(0) / invest(1)
        const isSelected = (idx === 0 && (value === 'nonpay' || value === 'single' || value === 'stable')) ||
                           (idx === 1 && (value === 'insurance' || value === 'group' || value === 'invest'));
        
        if (isSelected) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // 다음 단계로 버튼 활성화
    const nextBtn = document.getElementById(`next-btn-${step}`);
    nextBtn.removeAttribute('disabled');
}

function nextQuizStep(nextStepNum) {
    // 이전 단계 숨기기
    const currentStepNum = nextStepNum - 1;
    document.getElementById(`step-${currentStepNum}`).classList.remove('active');
    
    // 다음 단계 노출
    const nextStep = document.getElementById(`step-${nextStepNum}`);
    nextStep.classList.add('active');
    
    // 프로그레스 바 너비 업데이트
    const progress = document.getElementById('quiz-progress');
    const widthPercentage = nextStepNum === 2 ? '66.6%' : '100%';
    progress.style.width = widthPercentage;
}

function prevQuizStep(prevStepNum) {
    // 현재 단계 숨기기
    const currentStepNum = prevStepNum + 1;
    document.getElementById(`step-${currentStepNum}`).classList.remove('active');
    
    // 이전 단계 노출
    const prevStep = document.getElementById(`step-${prevStepNum}`);
    prevStep.classList.add('active');
    
    // 프로그레스 바 너비 업데이트
    const progress = document.getElementById('quiz-progress');
    const widthPercentage = prevStepNum === 1 ? '33.3%' : '66.6%';
    progress.style.width = widthPercentage;
}

function evaluateQuiz() {
    // 퀴즈 결과 분석
    const { q1, q2, q3 } = quizAnswers;
    let recommendedPlan = '';
    let description = '';
    let features = [];
    
    if (q2 === 'group') {
        recommendedPlan = '메디컬 VIP MSO / 공동개원 케어 솔루션';
        description = '공동개원(동업) 지분 비율 분배 및 영업권 평가, 혹은 MSO 법인을 통한 고소득 분산 설계가 시급합니다. 에이블의 2:1 전담 세무 세출 시스템과 국세청 출신 전문가 그룹이 결합하여 세무조사 방어와 감면세액을 밀착 케어합니다.';
        features = [
            '공동개원 동업 계약서 지분율 및 출자 자금조달 세무조사 설계',
            'MSO 용역수수료 정산 및 세무조사 부당행위계산부인 차단 증빙 이력화',
            '봉직의 페이닥터 Net 계약 세후 급여 양성화 및 근로계약서 커스텀',
            '성실신고확인대상을 대비한 연 2회 국세청 조사국 관점 자체 모의조사'
        ];
    } else if (q1 === 'nonpay') {
        recommendedPlan = '메디컬 비급여 리스크 방어 기장 플랜';
        description = '피부과/성형외과 등 비급여 시술 및 패키지 할인 현금 매출 비율이 높아 관할 세무서 소명 요구에 매우 크게 노출된 상태입니다. 매출 시점 분석 및 고가 레이저 장비 투자세액공제 혜택에 집중합니다.';
        features = [
            '비급여 시술 및 고액 패키지 선수금 매출 인식 세무조사 가이드 조율',
            '고가 의료장비 감가상각 최적 비율 설계 및 부가세 조기환급 대행',
            '신용카드 대 현금 매출 소득률 통합 점검 및 PCI 전산 상시 분석',
            'TIPS 투자 유치 및 중대형 병원 규모 확대 시 MSO 전환 시뮬레이션'
        ];
    } else {
        recommendedPlan = '메디컬 일반 세무기장 플랜';
        description = '단독 원장 운영 및 기존 장비를 유지하는 형태로, 복잡한 노무 분쟁이나 투자 이슈는 적지만 성실신고확인대상 방어와 가결산을 통한 세액 예측에 집중해야 하는 기본 메디컬 케어입니다.';
        features = [
            '종합소득세 및 성실신고확인서 무사고 100% 대응 기장 장부 작성',
            '분기별 사전 가결산을 통한 종소세 예측 리포트 및 절세 전략 제공',
            '페이닥터 4대보험 취득·상실 및 원천세 밀착 신고 대행',
            '빅4 회계법인 TAX 출신 고혜진 대표 회계사 1:1 절세 조율 상담'
        ];
    }
    
    // 결과 화면 렌더링
    document.getElementById('step-3').classList.remove('active');
    const resultEl = document.getElementById('quiz-result');
    resultEl.style.display = 'block';
    
    document.getElementById('result-plan-name').innerText = recommendedPlan;
    document.getElementById('result-plan-desc').innerText = description;
    
    const featuresContainer = document.getElementById('result-features');
    featuresContainer.innerHTML = '';
    
    features.forEach(feat => {
        const row = document.createElement('div');
        row.className = 'result-feat-row';
        row.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
            <span>${feat}</span>
        `;
        featuresContainer.appendChild(row);
    });
}

function applyQuizResult() {
    const recommendedPlan = document.getElementById('result-plan-name').innerText;
    const selectEl = document.getElementById('preferred-plan');
    
    // 드롭다운에 매핑
    if (recommendedPlan.includes('VIP') || recommendedPlan.includes('공동개원')) {
        selectEl.value = 'VIP 경리아웃소싱 플랜';
    } else if (recommendedPlan.includes('비급여') || recommendedPlan.includes('방어')) {
        selectEl.value = '프리미엄 세무자동화 플랜';
    } else {
        selectEl.value = '일반 세무기장 플랜';
    }
    
    // 문의 필드에 내용 추가
    const messageEl = document.getElementById('client-message');
    messageEl.value = `[메디컬 자가진단 매칭 추천] ${recommendedPlan} 상세 수임 및 절세 상담을 신청합니다.`;
}

function restartQuiz() {
    quizAnswers = { q1: null, q2: null, q3: null };
    
    // 리셋 카드 디자인
    const optionCards = document.querySelectorAll('.quiz-option-card');
    optionCards.forEach(card => card.classList.remove('selected'));
    
    // 버튼 비활성화
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`next-btn-${i}`).setAttribute('disabled', 'true');
    }
    
    // 프로그레스 바 초기화
    document.getElementById('quiz-progress').style.width = '33.3%';
    
    // 결과 숨기기 및 스텝1 노출
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('step-1').classList.add('active');
}

// 5. 고객 후기 슬라이더 (Carousel)
let currentReviewIndex = 0;

function initReviewSlider() {
    const track = document.getElementById('reviews-track');
    const slides = track.querySelectorAll('.review-slide');
    const dotsContainer = document.getElementById('reviews-dots');
    
    // 점 생성
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => gotoReviewSlide(idx));
        dotsContainer.appendChild(dot);
    });
    
    // 자동 슬라이더 가동 (6초마다)
    setInterval(() => {
        moveReviewSlide(1);
    }, 6000);
}

function moveReviewSlide(direction) {
    const track = document.getElementById('reviews-track');
    const slides = track.querySelectorAll('.review-slide');
    const totalSlides = slides.length;
    
    currentReviewIndex += direction;
    
    if (currentReviewIndex >= totalSlides) {
        currentReviewIndex = 0;
    } else if (currentReviewIndex < 0) {
        currentReviewIndex = totalSlides - 1;
    }
    
    updateSliderPosition();
}

function gotoReviewSlide(index) {
    currentReviewIndex = index;
    updateSliderPosition();
}

function updateSliderPosition() {
    const track = document.getElementById('reviews-track');
    track.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
    
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, idx) => {
        if (idx === currentReviewIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 6. 가격 카드에서 직접 플랜 선택
function selectPlan(planName) {
    const selectEl = document.getElementById('preferred-plan');
    
    if (planName.includes('일반')) {
        selectEl.value = '일반 세무기장 플랜';
    } else if (planName.includes('프리미엄')) {
        selectEl.value = '프리미엄 세무자동화 플랜';
    } else if (planName.includes('VIP')) {
        selectEl.value = 'VIP 경리아웃소싱 플랜';
    }
    
    const messageEl = document.getElementById('client-message');
    messageEl.value = `[선택 플랜] ${planName} 상담을 신청합니다.`;
}

// 7. 상담 폼 제출 (구글 스프레드시트 및 Formspree 연동 지원)
// 💡 구글 시트 연동 시: 아래 변수에 배포된 Apps Script 웹앱 URL을 입력하세요.
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzpC1PrXT01oLrbmH85iYAPs-THFd_uW_Vrcp2AID6vH6LxGhVi0YERjqoLx1zrGinJ/exec";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/placeholder_id"; // 실제 Formspree 폼 ID로 교체하여 사용 가능

function handleFormSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const type = document.getElementById('business-type').value;
    const plan = document.getElementById('preferred-plan').value;
    const msg = document.getElementById('client-message').value;
    const form = document.getElementById('consultation-form');
    
    const formData = {
        name: name,
        phone: phone,
        type: type,
        plan: plan,
        message: msg
    };

    console.log('상담 신청 데이터 전송 시도:', formData);
    
    // 1. 구글 스프레드시트 연동이 활성화된 경우 우선 처리
    if (GOOGLE_SHEET_WEB_APP_URL && !GOOGLE_SHEET_WEB_APP_URL.includes("여기에_구글")) {
        fetch(GOOGLE_SHEET_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // CORS 제한 우회 (구글 스크립트 실행 보장)
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            alert(`감사합니다, ${name} 대표님!\n신청하신 [${plan}] 관련 무료 사전 세무 진단 접수가 성공적으로 완료되었습니다.\n\n확인을 누르시면 즉시 회계사 1:1 카카오톡 실시간 상담방으로 연결됩니다.`);
            window.open('http://pf.kakao.com/_ixhxdRG/chat', '_blank');
            form.reset();
        })
        .catch(error => {
            console.error('Google Sheet submit error:', error);
            alert('상담 신청 전송 중 네트워크 오류가 발생했습니다. 카카오톡 직접 문의 또는 대표 번호로 연락 부탁드립니다.');
        });
        return;
    }

    // 2. 이메일 API 연동이 되어있지 않은 경우 (데모용 로컬 가이드)
    if (FORMSPREE_ENDPOINT.includes("placeholder_id")) {
        alert(`[데모 안내] 무료 사전 세무 진단 신청이 성공적으로 접수되었습니다. (로컬 데이터 접수 완료)

■ 신청자명: ${name}
■ 연락처: ${phone}
■ 관심 플랜: ${plan}

※ 현재 실시간 구글 시트 및 이메일 전송 API가 비활성화(Placeholder) 상태입니다. 실제로 수신받으시려면 'script.js' 파일 상단의 GOOGLE_SHEET_WEB_APP_URL 변수에 구글 앱스 스크립트 웹앱 URL을 설정해 주세요.`);
        form.reset();
        return;
    }

    // 3. Formspree API 연동
    fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            alert(`감사합니다, ${name} 대표님!\n신청하신 [${plan}] 관련 무료 사전 세무 진단 접수가 완료되었습니다.\n\n적어주신 연락처(${phone})로 영업일 기준 3시간 이내에 담당 공인회계사가 연락드리겠습니다.`);
            form.reset();
        } else {
            throw new Error('전송 실패');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        alert('상담 신청 전송 중 네트워크 오류가 발생했습니다. 1:1 카카오톡 직접 문의 또는 대표 번호로 연락 부탁드립니다.');
    });
}

// 8. 스크롤 인터랙션 (Scroll Reveal)
function initScrollReveal() {
    const reveals = document.querySelectorAll('.corporate-card, .profile-visual-box, .profile-content, .pricing-card');
    
    const revealOnScroll = () => {
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 80;
            
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].style.opacity = '1';
                reveals[i].style.transform = 'translateY(0)';
            }
        }
    };
    
    reveals.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
}

// 9. 유튜브 동적 로드 재생 함수
function playVideo(element, videoId, title) {
    const parent = element.parentElement;
    parent.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

// 10. 스마트 계산기 탭 전환
function switchCalcTab(tabId) {
    const contents = document.querySelectorAll('.calc-content');
    contents.forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    const buttons = document.querySelectorAll('.calc-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// 10.1 부가세 실시간 계산 (과세 매출 비중 슬라이더 연동형)
function calculateVAT() {
    const salesRange = document.getElementById('vat-sales');
    const purchasesRange = document.getElementById('vat-purchases');
    const ratioRange = document.getElementById('vat-taxable-ratio');
    if (!salesRange || !purchasesRange || !ratioRange) return;

    const sales = parseInt(salesRange.value);
    const purchases = parseInt(purchasesRange.value);
    const ratio = parseInt(ratioRange.value);

    // Sync input fields
    const salesInput = document.getElementById('vat-sales-input');
    if (salesInput) salesInput.value = sales;
    const purchasesInput = document.getElementById('vat-purchases-input');
    if (purchasesInput) purchasesInput.value = purchases;
    const ratioInput = document.getElementById('vat-taxable-ratio-input');
    if (ratioInput) ratioInput.value = ratio;

    const salesVal = document.getElementById('vat-sales-val');
    if (salesVal) salesVal.innerText = sales.toLocaleString();
    const purchasesVal = document.getElementById('vat-purchases-val');
    if (purchasesVal) purchasesVal.innerText = purchases.toLocaleString();
    const ratioVal = document.getElementById('vat-taxable-ratio-val');
    if (ratioVal) ratioVal.innerText = ratio.toString();

    // 부가세 매출세액 = 과세매출 * 10%
    const taxableSales = sales * (ratio / 100);
    const salesVat = taxableSales * 0.1;

    // 부가세 매입세액 = 과세관련매입 * 10% (안분계산 적용: 매출의 과세비율만큼 매입세액공제 가능)
    const taxablePurchases = purchases * (ratio / 100);
    const purchasesVat = taxablePurchases * 0.1;

    let vat = Math.round(salesVat - purchasesVat);
    if (vat < 0) vat = 0; 

    document.getElementById('vat-result').innerText = vat.toLocaleString() + ' 만 원';
}

// 10.2 법인전환 절세 실시간 계산 (2026 개정 누진세율 및 지방소득세 10% 통합 반영)
function calculateCorpSavings() {
    const incomeRange = document.getElementById('corp-income');
    if (!incomeRange) return;

    const income = parseInt(incomeRange.value);

    // Sync input field
    const incomeInput = document.getElementById('corp-income-input');
    if (incomeInput) incomeInput.value = income;

    const incomeVal = document.getElementById('corp-income-val');
    if (incomeVal) incomeVal.innerText = income.toLocaleString();

    // 개인소득세 간이 계산 (2026 누진세율 적용)
    let personalTax = 0;
    if (income <= 1400) {
        personalTax = income * 0.06;
    } else if (income <= 5000) {
        personalTax = income * 0.15 - 126;
    } else if (income <= 8800) {
        personalTax = income * 0.24 - 576;
    } else if (income <= 15000) {
        personalTax = income * 0.35 - 1544;
    } else if (income <= 30000) {
        personalTax = income * 0.38 - 1994;
    } else if (income <= 50000) {
        personalTax = income * 0.40 - 2594;
    } else if (income <= 100000) {
        personalTax = income * 0.42 - 3594;
    } else {
        personalTax = income * 0.45 - 6594;
    }
    personalTax = Math.round(Math.max(0, personalTax));
    personalTax = Math.round(personalTax * 1.1); // 지방소득세 10% 합산

    // 법인세 간이 계산 (2억 이하 9% 적용, 초과분 19% 적용)
    let corpTax = 0;
    if (income <= 20000) {
        corpTax = income * 0.09;
    } else {
        corpTax = 20000 * 0.09 + (income - 20000) * 0.19;
    }
    corpTax = Math.round(corpTax * 1.1); // 지방소득세 10% 합산

    // 절세액
    let savings = personalTax - corpTax;
    if (savings < 0) savings = 0;

    document.getElementById('calc-personal-tax').innerText = personalTax.toLocaleString() + ' 만 원';
    document.getElementById('calc-corp-tax').innerText = corpTax.toLocaleString() + ' 만 원';
    document.getElementById('corp-result').innerText = savings.toLocaleString() + ' 만 원';
}

// 10.3 계산기 결과를 상담 폼 메시지에 입력
function applyCalcResult(type) {
    let messageText = '';
    if (type === '부가세') {
        const sales = document.getElementById('vat-sales').value;
        const purchases = document.getElementById('vat-purchases').value;
        const ratio = document.getElementById('vat-taxable-ratio').value;
        const result = document.getElementById('vat-result').innerText;
        messageText = `[부가세 모의 계산 상담 신청] 분기 매출: ${sales}만 원 / 매입: ${purchases}만 원 / 비급여(과세) 매출 비중: ${ratio}% (예상 부가세: ${result}). 대조 및 최적화 절세 방안 조율을 의뢰합니다.`;
    } else if (type === '법인전환') {
        const income = document.getElementById('corp-income').value;
        const result = document.getElementById('corp-result').innerText;
        messageText = `[법인전환 절세 상담 신청] 개인 순이익: ${income}만 원 (예상 연간 절세액: ${result}). 조세 감면 법인전환 정밀 타당성 분석 및 임원 정관 정비를 의뢰합니다.`;
    } else if (type === '네트제') {
        const net = document.getElementById('net-salary').value;
        const gross = document.getElementById('net-gross-result').innerText;
        const total = document.getElementById('net-employer-total').innerText;
        const ratio = document.getElementById('net-burden-ratio').innerText;
        const sev = document.getElementById('net-severance-check').checked ? '포함' : '미포함';
        messageText = `[네트제 세후급여 역산 상담 신청] 세후 실수령액: ${net}만 원 / 역산 세전 기본급: ${gross} / 원장님 실제 총 지출액: ${total} (추가 부담 비율: ${ratio}, 퇴직금 ${sev} 적립). 네트제 급여 설계 및 세무 신고 지원을 의뢰합니다.`;
    }
    
    const messageEl = document.getElementById('client-message');
    const planEl = document.getElementById('preferred-plan');
    if (messageEl) messageEl.value = messageText;
    if (planEl) planEl.value = type === '부가세' ? '프리미엄 세무자동화 플랜' : 'VIP 경리아웃소싱 플랜';

    // 상담 신청 폼으로 스무스 스크롤
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 11. 세무 캘린더 데이터 및 렌더링
const calendarEvents = [
    { date: '2026-07-25', title: '1기 부가가치세 확정 신고·납부', desc: '개인/법인 일반과세자 대상 1월~6월 실적에 대한 신고 마감', category: ['individual', 'corp'] },
    { date: '2026-08-10', title: '7월 귀속 원천세 신고·납부', desc: '직원 급여 원천징수분 및 프리랜서(3.3%) 원천세 신고 마감', category: ['individual', 'corp', 'freelancer'] },
    { date: '2026-08-31', title: '법인세 중간예납 신고·납부', desc: '12월 결산 법인의 당해 연도 상반기 분에 대한 법인세 신고 마감', category: ['corp'] },
    { date: '2026-09-10', title: '8월 귀속 원천세 신고·납부', desc: '직원 급여 원천징수분 원천세 신고 및 납부 마감', category: ['individual', 'corp', 'freelancer'] },
    { date: '2026-10-25', title: '2기 부가가치세 예정 고지·신고', desc: '법인사업자 2기 예정 신고 및 개인사업자 예정고지 납부 마감', category: ['individual', 'corp'] },
    { date: '2026-11-10', title: '10월 귀속 원천세 신고·납부', desc: '지급 급여에 대한 원천징수세액 신고 납부 마감', category: ['individual', 'corp', 'freelancer'] },
    { date: '2026-11-30', title: '종합소득세 중간예납 납부', desc: '개인사업자 작년 소득 기준 중간예납세액 납부 마감', category: ['individual'] },
    { date: '2026-12-10', title: '11월 귀속 원천세 신고·납부', desc: '임직원 및 프리랜서 원천세 신고 기한', category: ['individual', 'corp', 'freelancer'] }
];

function renderCalendar(filterType = 'all') {
    const listEl = document.getElementById('calendar-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const today = new Date();
    
    let renderedCount = 0;
    
    calendarEvents.forEach(evt => {
        if (filterType !== 'all' && !evt.category.includes(filterType)) return;

        const evtDate = new Date(evt.date);
        
        // D-day 계산
        const timeDiff = evtDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let ddayText = '';
        let badgeClass = 'normal';
        
        if (diffDays === 0) {
            ddayText = 'D-Day';
            badgeClass = 'urgent';
        } else if (diffDays > 0) {
            ddayText = `D-${diffDays}`;
            if (diffDays <= 7) badgeClass = 'urgent';
        } else {
            ddayText = `완료`;
        }

        const dateParts = evt.date.split('-');
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);

        const item = document.createElement('div');
        item.className = 'calendar-item';
        item.innerHTML = `
            <div class="calendar-date-box">
                <span class="month">${month}월</span>
                <span class="day">${day}</span>
            </div>
            <div class="calendar-info">
                <h4>${evt.title}</h4>
                <p>${evt.desc}</p>
            </div>
            <span class="dday-badge ${badgeClass}">${ddayText}</span>
        `;
        listEl.appendChild(item);
        renderedCount++;
    });

    if (renderedCount === 0) {
        listEl.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:20px;font-size:0.9rem;">해당 조건의 일정이 없습니다.</div>';
    }
}

function filterCalendar(type) {
    const buttons = document.querySelectorAll('.cal-filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    renderCalendar(type);
}

// 12. 챗봇 위젯 제어
function toggleChatbot() {
    const widget = document.getElementById('chatbot-widget');
    if (!widget) return;
    
    const badge = widget.querySelector('.chat-badge');
    if (badge) badge.style.display = 'none';

    const isOpen = widget.classList.toggle('open');
    
    const chatIcon = widget.querySelector('.chat-icon');
    const closeIcon = widget.querySelector('.close-icon');
    
    if (isOpen) {
        chatIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        chatIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

function handleChatOption(option) {
    const body = document.getElementById('chatbot-body');
    const container = document.getElementById('chat-options-container');
    if (!body || !container) return;
    
    let userMsgText = '';
    let botMsgText = '';
    
    if (option === 'clinic') {
        userMsgText = '🙋 병의원 특화 세무 상담에 대해 알려주세요.';
        botMsgText = `<strong>[병의원 세무상담 매뉴얼]</strong><br><br>
        에이블세무회계는 병원 개원 자금 출처 소명부터 세출 설계, 그리고 국세청 모의 세무조사를 기반으로 병의원 특화 세무 리스크 관리를 제공합니다.<br><br>
        • <strong>개원자금조달:</strong> 공동인증서 확인 및 자금 출처 해명 자문<br>
        • <strong>조사 대응:</strong> 국세청 출신 세무사 전담 모의 조사 대응<br><br>
        하단 링크를 통해 즉시 담당 회계사와 1:1 카카오톡 상담이 가능합니다.`;
    } else if (option === 'startup') {
        userMsgText = '🚀 스타트업 설립 & 법인 전환이 고민입니다.';
        botMsgText = `<strong>[스타트업 & 법인전환 솔루션]</strong><br><br>
        스타트업 설립 초기 지분 설계부터 벤처기업 인증 혜택 조율, 그리고 영업권 평가를 통한 법인자금 세금 부담 없는 회수를 대행합니다.<br><br>
        • <strong>조세 감면:</strong> 취득세 면제 및 양도소득세 이월과세 설계<br>
        • <strong>정관 정비:</strong> 퇴직금 지급 배수 규정 정비<br><br>
        상세 모의 세액 계산은 홈페이지의 '실시간 절세 계산기'를 통해서도 즉시 확인 가능합니다.`;
    } else if (option === 'plans') {
        userMsgText = '📊 세무 기장 요금제가 궁금합니다.';
        botMsgText = `<strong>[에이블 기장 서비스 라인업]</strong><br><br>
        에이블은 기장 자동화 비율에 따라 합리적인 3단계 요금제를 운영합니다.<br><br>
        • <strong>일반 기장 플랜:</strong> 기본 신고 대행 및 4대보험<br>
        • <strong>프리미엄 세무자동화:</strong> 세금계산서 대조 매칭 관리<br>
        • <strong>VIP 경리아웃소싱:</strong> 급여 이체 대행 및 손익보고서 작성<br><br>
        자세한 견적과 맞춤형 플랜 선택은 '세무 자가 진단' 퀴즈를 통해서 설계받으실 수 있습니다.`;
    } else if (option === 'documents') {
        userMsgText = '📄 기장 수임 시 필요 서류가 무엇인가요?';
        botMsgText = `<strong>[세무기장 대리 위임 필요서류]</strong><br><br>
        에이블세무회계와 수임 협약 시 필요한 기본 준비 서류입니다:<br><br>
        1. 사업자등록증 사본<br>
        2. 대표자 신분증 사본<br>
        3. 홈택스 수임동의서 (또는 공동인증서 등록)<br>
        4. 임대차계약서 사본<br>
        5. 전임 기장 대리인의 이전 결산 자료 (기존 사업자인 경우)<br><br>
        카카오톡이나 상담 신청에 사업자 등록증을 첨부해주시면 신속히 수임 동의를 진행해 드립니다.`;
    }

    // 유저 메시지 렌더링
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `<p>${userMsgText}</p>`;
    body.insertBefore(userMsg, container);
    
    // 봇 메시지 렌더링 (0.45초 딜레이)
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerHTML = `<p>${botMsgText}</p>`;
        body.insertBefore(botMsg, container);
        body.scrollTop = body.scrollHeight; 
    }, 450);

    body.scrollTop = body.scrollHeight;
}

// 13. 헤더 실시간 검색창 고도화 (자주찾는 세무 검색 및 해당 섹션/아코디언 이동)
const searchKeywords = [
    { key: '부가세 신고', synonyms: ['부가세', '부가가치세', '신고', '부가세신고'], target: '#youtube-insights', action: 'play-video', videoId: 'IAwuzMo2m5U', title: '초보 사업자를 위한 부가세 신고 완벽 정리' },
    { key: '법인 전환 시점', synonyms: ['법인', '법인전환', '개인사업자', '법인전환 시점'], target: '#youtube-insights', action: 'play-video', videoId: 'uBKUbQ66-NQ', title: '법인전환 언제 해야할까?' },
    { key: '창업 세금 폭탄 방지', synonyms: ['창업', '사업자등록', '주의할점', '세금폭탄'], target: '#youtube-insights', action: 'play-video', videoId: 'wKtiQSFmPXU', title: '모르고 창업하면 세금 폭탄 맞습니다!' },
    { key: '개원 및 자금 설계', synonyms: ['개원', '병원개원', '동업', '닥터론', '자금조달'], target: '#services', action: 'open-accordion', accordionIdx: 0, tab: 'clinic-tab' },
    { key: '봉직의 네트 계약', synonyms: ['봉직의', '페이닥터', '네트', '넷계약', 'net'], target: '#services', action: 'open-accordion', accordionIdx: 1, tab: 'clinic-tab' },
    { key: '의료 장비 조기 환급', synonyms: ['리스', '의료장비', '장비리스', '인테리어', '조기환급'], target: '#services', action: 'open-accordion', accordionIdx: 2, tab: 'clinic-tab' },
    { key: 'MSO 설립 지분 설계', synonyms: ['mso', '병원경영', '소득분산', '우회'], target: '#services', action: 'open-accordion', accordionIdx: 3, tab: 'clinic-tab' },
    { key: '세무조사 사전 차단', synonyms: ['세무조사', '조사', '조사국', '모의진단'], target: '#services', action: 'open-accordion', accordionIdx: 4, tab: 'clinic-tab' },
    { key: '세무 기장 요금제', synonyms: ['기장', '기장료', '수임', '비용', '요금제', '수수료'], target: '#plans', action: 'scroll-only' },
    { key: '세무 자가 진단', synonyms: ['자가진단', '진단', '퀴즈', '테스트'], target: '#quiz', action: 'scroll-only' },
    { key: '간편 세무 상담', synonyms: ['상담', '신청', '문의', '전화', '카톡'], target: '#contact', action: 'focus-input' }
];

function initHeaderSearch() {
    const searchContainer = document.getElementById('header-search-container');
    const searchInput = document.getElementById('header-search-input');
    const searchBtn = document.getElementById('header-search-btn');
    const suggestionsBox = document.getElementById('search-suggestions');
    const suggestionsList = document.getElementById('suggestions-list');

    if (!searchInput || !suggestionsBox || !suggestionsList) return;

    // 초기 상태 렌더링
    renderSuggestions('');

    // 인풋 포커스 시 추천 검색어 상자 열기
    searchInput.addEventListener('focus', () => {
        suggestionsBox.classList.add('active');
        renderSuggestions(searchInput.value.trim());
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            suggestionsBox.classList.remove('active');
        }
    });

    // 검색어 입력 이벤트
    searchInput.addEventListener('input', () => {
        renderSuggestions(searchInput.value.trim());
    });

    // 엔터키 또는 검색 버튼 클릭 시
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeSearch(searchInput.value.trim());
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            executeSearch(searchInput.value.trim());
        });
    }

    // 검색어 추천 렌더링 함수
    function renderSuggestions(query) {
        suggestionsList.innerHTML = '';
        const lowercaseQuery = query.toLowerCase();

        // 검색어가 비어 있으면 기본 추천 5개 노출
        let filtered = [];
        if (!query) {
            filtered = searchKeywords.slice(0, 5);
        } else {
            filtered = searchKeywords.filter(item => {
                return item.key.toLowerCase().includes(lowercaseQuery) || 
                       item.synonyms.some(syn => syn.toLowerCase().includes(lowercaseQuery));
            });
        }

        if (filtered.length === 0) {
            suggestionsList.innerHTML = `
                <div class="no-results-msg">
                    <strong>'${query}'</strong>에 대한 메뉴를 찾지 못했습니다.<br>
                    <span style="font-size:0.75rem; color:var(--text-muted);">자가진단이나 카카오톡 실시간 상담을 이용해 보세요!</span>
                </div>
            `;
            return;
        }

        filtered.forEach(item => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            
            // 검색어 하이라이트 처리
            let displayName = item.key;
            if (query) {
                const idx = item.key.toLowerCase().indexOf(lowercaseQuery);
                if (idx !== -1) {
                    displayName = item.key.substring(0, idx) + 
                                  `<span class="suggestion-item-highlight">${item.key.substring(idx, idx + query.length)}</span>` + 
                                  item.key.substring(idx + query.length);
                }
            }

            div.innerHTML = `
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span>${displayName}</span>
            `;
            
            div.addEventListener('click', () => {
                searchInput.value = item.key;
                suggestionsBox.classList.remove('active');
                navigateToTarget(item);
            });

            suggestionsList.appendChild(div);
        });
    }

    // 검색 실행 (첫 번째 매칭되는 키워드 실행)
    function executeSearch(query) {
        if (!query) return;
        const lowercaseQuery = query.toLowerCase();
        
        // 완전 매칭 우선, 그다음 부분 매칭
        let matched = searchKeywords.find(item => item.key.toLowerCase() === lowercaseQuery) ||
                      searchKeywords.find(item => item.key.toLowerCase().includes(lowercaseQuery) || item.synonyms.some(syn => syn.toLowerCase().includes(lowercaseQuery)));

        if (matched) {
            suggestionsBox.classList.remove('active');
            navigateToTarget(matched);
        } else {
            // 매칭되는 결과가 없으면 contact로 이동하여 인풋에 검색어 주입
            suggestionsBox.classList.remove('active');
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                const msgInput = document.getElementById('client-message');
                if (msgInput) {
                    msgInput.value = `[세무 검색 문의] '${query}' 관련 상세 세무 자문 및 기장 대행 조건이 궁금합니다.`;
                }
            }
        }
    }

    // 해당 영역으로 스마트 이동 및 액션 실행
    function navigateToTarget(item) {
        const targetEl = document.querySelector(item.target);
        if (!targetEl) return;

        // 1. 해당 탭 전환 (특화 서비스 탭의 경우)
        if (item.tab) {
            switchTabTo(item.tab);
        }

        // 2. 부드럽게 스크롤
        targetEl.scrollIntoView({ behavior: 'smooth' });

        // 3. 액션 수행 (비디오 자동 재생 또는 아코디언 오픈)
        setTimeout(() => {
            if (item.action === 'play-video') {
                // 새 라이트박스 오픈 함수 호출
                openYoutubeLightbox(item.videoId);
            } else if (item.action === 'open-accordion') {
                const accordionContainer = targetEl.querySelector('.accordion-list');
                if (accordionContainer) {
                    const cards = accordionContainer.querySelectorAll('.accordion-card');
                    if (cards[item.accordionIdx]) {
                        toggleAccordion(cards[item.accordionIdx]);
                    }
                }
            } else if (item.action === 'focus-input') {
                const nameInput = document.getElementById('client-name');
                if (nameInput) nameInput.focus();
            }
        }, 800); // 스크롤이 끝난 후에 실행되도록 지연
    }
}

/* =========================================================================
   Hybrid Map Initialization (Naver Map Loader)
   ========================================================================= */
// 네이버 클라우드 플랫폼에서 발급받은 Web Dynamic Map Client ID를 아래 입력하세요.
// 실서버 배포 시 NCP 콘솔에서 실제 서비스 도메인을 화이트리스트(Web 서비스 URL)에 추가해야 작동합니다.
const NAVER_MAPS_CLIENT_ID = "e83muxbqm0"; 

window.addEventListener('DOMContentLoaded', () => {
    const naverMapEl = document.getElementById('naver-map');
    const placeholder = document.getElementById('naver-map-placeholder');
    
    if (naverMapEl && NAVER_MAPS_CLIENT_ID && !NAVER_MAPS_CLIENT_ID.startsWith("YOUR_")) {
        console.log("Loading Naver Maps API dynamically...");
        
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAPS_CLIENT_ID}`;
        
        script.onload = () => {
            console.log("Naver Maps API loaded successfully.");
            if (placeholder) placeholder.style.display = 'none';
            naverMapEl.style.display = 'block';
            
            try {
                const mapOptions = {
                    center: new naver.maps.LatLng(37.49583, 127.01490),
                    zoom: 16,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: naver.maps.Position.TOP_RIGHT
                    }
                };

                const map = new naver.maps.Map('naver-map', mapOptions);

                const marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(37.49583, 127.01490),
                    map: map
                });

                const infoWindow = new naver.maps.InfoWindow({
                    content: `
                        <div style="padding: 12px; min-width: 150px; line-height: 150%; text-align: center; font-family: sans-serif; background: #ffffff;">
                            <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #1e293b !important; border: none; background: transparent; padding: 0;">에이블세무회계</h4>
                            <p style="margin: 5px 0 0; font-size: 11px; color: #4b5563 !important; font-weight: 500; padding: 0;">도성빌딩 6층</p>
                        </div>
                    `
                });

                infoWindow.open(map, marker);
            } catch (err) {
                console.error("Error initializing Naver Map:", err);
                if (placeholder) placeholder.style.display = 'flex';
                naverMapEl.style.display = 'none';
            }
        };
        
        script.onerror = () => {
            console.error("Failed to load Naver Maps API script.");
            if (placeholder) placeholder.style.display = 'flex';
            naverMapEl.style.display = 'none';
        };
        
        document.head.appendChild(script);
    } else {
        // API Client ID가 아직 입력되지 않은 상태에서는 대기용 플레이스홀더 노출 유지
        if (naverMapEl) naverMapEl.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
    }
});


// 10. 리드 마그넷 지원 센터 관련 인터랙션 함수 (PDF 다운로드 비동기 API 연동 지원)
function handlePdfDownload(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const tel = form.querySelector('input[type="tel"]') ? form.querySelector('input[type="tel"]').value : '';
    const email = form.querySelector('input[type="email"]').value;
    
    const formData = {
        resource: "병의원 개원 필수 세무 체크리스트 PDF",
        name: name,
        phone: tel,
        email: email
    };

    console.log('PDF 신청 데이터 전송 시도:', formData);

    // 1. 구글 스프레드시트 연동이 활성화된 경우
    if (GOOGLE_SHEET_WEB_APP_URL && !GOOGLE_SHEET_WEB_APP_URL.includes("여기에_구글")) {
        fetch(GOOGLE_SHEET_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // CORS 제한 우회 (구글 스크립트 실행 보장)
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            alert(`[접수 완료] ${name} 원장님, 신청 정보가 구글 스프레드시트에 성공적으로 기록되었습니다. 다운로드 페이지로 이동합니다.`);
            window.open('./개원_세무_체크리스트.pdf', '_blank'); // 브라우저 다운로드 실행
            form.reset();
        })
        .catch(error => {
            console.error('Google Sheet PDF submit error:', error);
            window.open('./개원_세무_체크리스트.pdf', '_blank'); // 네트워크 오류 시에도 다운로드는 동작
        });
        return;
    }

    // 2. 이메일 API 연동이 되어있지 않은 경우 (데모용 로컬 가이드)
    if (FORMSPREE_ENDPOINT.includes("placeholder_id")) {
        alert(`[데모 안내] ${name} 원장님, '병의원 개원 필수 세무 체크리스트 PDF' 신청 정보가 접수되었습니다. (로컬 다운로드 페이지로 이동합니다.)

※ 실제 구글 시트 저장을 활성화하려면 'script.js' 파일 상단의 GOOGLE_SHEET_WEB_APP_URL 변수에 배포된 웹앱 URL을 입력해 주세요.`);
        window.open('./개원_세무_체크리스트.pdf', '_blank'); // 데모 환경에서도 즉시 PDF 열기 실행
        form.reset();
        return;
    }

    // 3. Formspree API 연동
    fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            alert(`[신청 완료] ${name} 원장님, 입력하신 이메일(${email})로 가이드북 PDF가 성공적으로 전송되었습니다.`);
            window.open('./개원_세무_체크리스트.pdf', '_blank');
            form.reset();
        } else {
            throw new Error('전송 실패');
        }
    })
    .catch(error => {
        console.error('Error submitting PDF request:', error);
        alert('신청 중 오류가 발생했습니다. 1:1 카카오톡 직접 문의 또는 대표 번호로 연락 부탁드립니다.');
    });
}

function requestSecondOpinion() {
    const selectEl = document.getElementById('preferred-plan');
    if (selectEl) {
        selectEl.value = '프리미엄 세무자동화 플랜';
    }
    
    const messageEl = document.getElementById('client-message');
    if (messageEl) {
        messageEl.value = `[세컨드 오피니언 무료 진단 신청] 기존 기장 리포트 2차 세무 검토 및 절세 타당성 분석을 신청합니다.`;
    }
    
    // Focus the first input field of the contact section
    const contactForm = document.getElementById('contact');
    if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// 11. 커스텀 마우스 커서 팔로워 구현 (병의원 테마 인터랙티브 이펙트)
document.addEventListener('DOMContentLoaded', () => {
    // 마우스 사용 기기(PC)에서만 커서 생성
    if (window.matchMedia('(pointer: fine)').matches) {
        const follower = document.createElement('div');
        follower.className = 'custom-cursor-follower';
        document.body.appendChild(follower);
        
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        let isMoving = false;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                follower.classList.add('active');
                isMoving = true;
            }
        });
        
        // 딜레이를 주는 부드러운 애니메이션 트래킹 (lerp 적용)
        function updateFollower() {
            const delay = 0.15; // 반응속도 딜레이 비율
            followerX += (mouseX - followerX) * delay;
            followerY += (mouseY - followerY) * delay;
            
            follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
            requestAnimationFrame(updateFollower);
        }
        updateFollower();
        
        // 마우스가 화면 밖으로 나갈 때 숨김
        document.addEventListener('mouseleave', () => {
            follower.classList.remove('active');
            isMoving = false;
        });
        
        // 호버 대상 클래스 조율
        const addCursorHover = (elements, className) => {
            elements.forEach(el => {
                el.addEventListener('mouseenter', () => follower.classList.add(className));
                el.addEventListener('mouseleave', () => follower.classList.remove(className));
            });
        };
        
        // 일반 링크/버튼 호버
        const normalTargets = document.querySelectorAll('a, button, input[type="submit"], .tab-btn');
        addCursorHover(normalTargets, 'hover-link');
        
        // 병의원 특화 카드/아이템 호버 -> 메디컬 세이지 커서 형상 변환
        const medicalTargets = document.querySelectorAll('.department-card, .accordion-card, .portal-login-card, .rating-item, .quiz-option-card, .special-summary-card, .blog-card');
        addCursorHover(medicalTargets, 'medical-hover');
    }
});

// 12. 좌측 고정 스크롤스파이(Scrollspy) 기능 구현
function initScrollspy() {
    const navItems = document.querySelectorAll('.left-nav-item');
    const sections = Array.from(navItems).map(item => {
        const id = item.getAttribute('data-section');
        return document.getElementById(id);
    }).filter(sec => sec !== null);
    
    if (navItems.length === 0 || sections.length === 0) return;
    
    const handleScrollspy = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + window.innerHeight / 3; // 뷰포트 상단 1/3 지점 기준 판별
        
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });
        
        // 마지막 섹션 처리 예외 (상담 폼이 짧아서 스크롤이 끝에 닿았을 때 강제 활성화)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 80) {
            currentSectionId = 'contact';
        }
        
        if (currentSectionId) {
            navItems.forEach(item => {
                if (item.getAttribute('data-section') === currentSectionId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    };
    
    window.addEventListener('scroll', handleScrollspy);
    handleScrollspy(); // 초기 실행
}

// 13. 우측 세무 퀵 헬퍼 패널(Drawer) 제어 및 연산 기능
function toggleQuickPanel() {
    const drawer = document.getElementById('quick-tax-drawer');
    const overlay = document.getElementById('quick-tax-drawer-overlay');
    if (!drawer || !overlay) return;
    
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        drawer.classList.add('open');
        overlay.classList.add('open');
        
        // 오픈 시 최신 값 기반 계산 및 캘린더 초기 로딩
        calculateDrawerVAT();
        calculateDrawerCorpSavings();
        renderDrawerCalendar('all');
    }
}

function switchDrawerTab(tabId) {
    const panes = document.querySelectorAll('.drawer-tab-pane');
    panes.forEach(pane => pane.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    const buttons = document.querySelectorAll('.drawer-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 이벤트 소스로 탭 버튼 액티브 처리
    if (tabId === 'drawer-calc-content') {
        document.getElementById('btn-drawer-calc').classList.add('active');
    } else {
        document.getElementById('btn-drawer-cal').classList.add('active');
    }
}

function calculateDrawerVAT() {
    const salesRange = document.getElementById('d-vat-sales');
    const purchasesRange = document.getElementById('d-vat-purchases');
    const ratioRange = document.getElementById('d-vat-taxable-ratio');
    if (!salesRange || !purchasesRange || !ratioRange) return;

    const sales = parseInt(salesRange.value);
    const purchases = parseInt(purchasesRange.value);
    const ratio = parseInt(ratioRange.value);

    // Sync input fields
    const salesInput = document.getElementById('d-vat-sales-input');
    if (salesInput) salesInput.value = sales;
    const purchasesInput = document.getElementById('d-vat-purchases-input');
    if (purchasesInput) purchasesInput.value = purchases;
    const ratioInput = document.getElementById('d-vat-taxable-ratio-input');
    if (ratioInput) ratioInput.value = ratio;

    const salesVal = document.getElementById('d-vat-sales-val');
    if (salesVal) salesVal.innerText = sales.toLocaleString();
    const purchasesVal = document.getElementById('d-vat-purchases-val');
    if (purchasesVal) purchasesVal.innerText = purchases.toLocaleString();
    const ratioVal = document.getElementById('d-vat-taxable-ratio-val');
    if (ratioVal) ratioVal.innerText = ratio.toString();

    // 부가세 계산
    const taxableSales = sales * (ratio / 100);
    const salesVat = taxableSales * 0.1;

    const taxablePurchases = purchases * (ratio / 100);
    const purchasesVat = taxablePurchases * 0.1;

    let vat = Math.round(salesVat - purchasesVat);
    if (vat < 0) vat = 0; 

    document.getElementById('d-vat-result').innerText = vat.toLocaleString() + ' 만 원';
}

function calculateDrawerCorpSavings() {
    const incomeRange = document.getElementById('d-corp-income');
    if (!incomeRange) return;

    const income = parseInt(incomeRange.value);

    // Sync input field
    const incomeInput = document.getElementById('d-corp-income-input');
    if (incomeInput) incomeInput.value = income;

    const incomeVal = document.getElementById('d-corp-income-val');
    if (incomeVal) incomeVal.innerText = income.toLocaleString();

    // 소득세 산정 (2026 누진세율 적용)
    let personalTax = 0;
    if (income <= 1400) {
        personalTax = income * 0.06;
    } else if (income <= 5000) {
        personalTax = income * 0.15 - 126;
    } else if (income <= 8800) {
        personalTax = income * 0.24 - 576;
    } else if (income <= 15000) {
        personalTax = income * 0.35 - 1544;
    } else if (income <= 30000) {
        personalTax = income * 0.38 - 1994;
    } else if (income <= 50000) {
        personalTax = income * 0.40 - 2594;
    } else if (income <= 100000) {
        personalTax = income * 0.42 - 3594;
    } else {
        personalTax = income * 0.45 - 6594;
    }
    personalTax = Math.round(Math.max(0, personalTax));
    personalTax = Math.round(personalTax * 1.1); // 지방소득세 10% 합산

    // 법인세 산정
    let corpTax = 0;
    if (income <= 20000) {
        corpTax = income * 0.09;
    } else {
        corpTax = 20000 * 0.09 + (income - 20000) * 0.19;
    }
    corpTax = Math.round(corpTax * 1.1); // 지방소득세 10% 합산

    let savings = personalTax - corpTax;
    if (savings < 0) savings = 0;

    document.getElementById('d-calc-personal-tax').innerText = personalTax.toLocaleString() + ' 만 원';
    document.getElementById('d-calc-corp-tax').innerText = corpTax.toLocaleString() + ' 만 원';
    document.getElementById('d-corp-result').innerText = savings.toLocaleString() + ' 만 원';
}

function applyDrawerCalcResult(type) {
    let messageText = '';
    const planEl = document.getElementById('preferred-plan');
    const messageEl = document.getElementById('client-message');
    
    if (type === '부가세') {
        const sales = document.getElementById('d-vat-sales').value;
        const purchases = document.getElementById('d-vat-purchases').value;
        const ratio = document.getElementById('d-vat-taxable-ratio').value;
        const result = document.getElementById('d-vat-result').innerText;
        messageText = `[부가세 모의 계산 상담 신청] 분기 매출: ${sales}만 원 / 매입: ${purchases}만 원 / 비급여(과세) 매출 비중: ${ratio}% (예상 부가세: ${result}). 대조 및 최적화 절세 방안 조율을 의뢰합니다.`;
        if (planEl) planEl.value = '프리미엄 세무자동화 플랜';
    } else if (type === '법인전환') {
        const income = document.getElementById('d-corp-income').value;
        const result = document.getElementById('d-corp-result').innerText;
        messageText = `[법인전환 절세 상담 신청] 개인 순이익: ${income}만 원 (예상 연간 절세액: ${result}). 조세 감면 법인전환 정밀 타당성 분석 및 임원 정관 정비를 의뢰합니다.`;
        if (planEl) planEl.value = 'VIP 경리아웃소싱 플랜';
    } else if (type === '네트제') {
        const net = document.getElementById('d-net-salary').value;
        const gross = document.getElementById('d-net-gross-result').innerText;
        const total = document.getElementById('d-net-employer-total').innerText;
        const ratio = document.getElementById('d-net-burden-ratio').innerText;
        const sev = document.getElementById('d-net-severance-check').checked ? '포함' : '미포함';
        messageText = `[네트제 세후급여 역산 상담 신청] 세후 실수령액: ${net}만 원 / 역산 세전 기본급: ${gross} / 원장님 실제 총 지출액: ${total} (추가 부담 비율: ${ratio}, 퇴직금 ${sev} 적립). 네트제 급여 설계 및 세무 신고 지원을 의뢰합니다.`;
        if (planEl) planEl.value = 'VIP 경리아웃소싱 플랜';
    }
    
    if (messageEl) messageEl.value = messageText;
    
    // 서랍 닫기
    toggleQuickPanel();

    // 상담 신청 폼으로 스무스 스크롤
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function renderDrawerCalendar(filterType = 'all') {
    const listEl = document.getElementById('drawer-calendar-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    const today = new Date();
    let renderedCount = 0;
    
    // calendarEvents 배열은 전역에 이미 존재하므로 그대로 참조
    calendarEvents.forEach(evt => {
        if (filterType !== 'all' && !evt.category.includes(filterType)) return;

        const evtDate = new Date(evt.date);
        const timeDiff = evtDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        let ddayText = '';
        let badgeClass = 'normal';
        
        if (diffDays === 0) {
            ddayText = 'D-Day';
            badgeClass = 'urgent';
        } else if (diffDays > 0) {
            ddayText = `D-${diffDays}`;
            if (diffDays <= 7) badgeClass = 'urgent';
        } else {
            ddayText = `완료`;
        }

        const dateParts = evt.date.split('-');
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[2]);

        const item = document.createElement('div');
        item.className = 'calendar-item';
        item.style.padding = '10px';
        item.style.marginBottom = '8px';
        item.style.background = 'rgba(255,255,255,0.02)';
        item.style.border = '1px solid var(--border-color)';
        item.style.borderRadius = '8px';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="calendar-date-box" style="width: 42px; height: 42px; padding: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 6px;">
                    <span style="font-size: 0.65rem; color: var(--text-muted); line-height: 1.2;">${month}월</span>
                    <span style="font-size: 0.95rem; font-weight: 800; color: #fff; line-height: 1.2;">${day}</span>
                </div>
                <div style="max-width: 220px;">
                    <h5 style="margin: 0 0 3px; font-size: 0.78rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${evt.title}</h5>
                    <p style="margin: 0; font-size: 0.68rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${evt.desc}</p>
                </div>
            </div>
            <span class="dday-badge ${badgeClass}" style="font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 700; height: fit-content; text-align: center;">${ddayText}</span>
        `;
        listEl.appendChild(item);
        renderedCount++;
    });

    if (renderedCount === 0) {
        listEl.innerHTML = '<div style="text-align:center;color:var(--text-secondary);padding:20px;font-size:0.75rem;">일정이 없습니다.</div>';
    }
}

function filterDrawerCalendar(type) {
    const buttons = document.querySelectorAll('.d-cal-filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = 'var(--text-secondary)';
    });
    
    // 클릭된 버튼 스타일 제어
    event.currentTarget.classList.add('active');
    event.currentTarget.style.color = '#fff';
    
    renderDrawerCalendar(type);
}

// =========================================================================
// YouTube Lightbox 및 비디오 데이터 정의 (Feedback 추가 반영)
// =========================================================================

const YOUTUBE_VIDEOS = [
    {
        id: 'wKtiQSFmPXU',
        title: '사업자 등록 시 세금 폭탄 안 맞는 법',
        duration: '11:03',
        views: '1.5만회',
        date: '6개월 전',
        desc: '창업 지역과 업종 분류 코드 설정 하나만으로도 수천만 원의 세금 차이가 발생할 수 있습니다. 등록 전 3가지 핵심 사항을 반드시 확인하세요.',
        checkpoints: [
            { title: '창업 지역 선택 (수도권과밀억제권역 외 100% 감면)', detail: '만 34세 이하 청년 창업 또는 일반 신규 창업의 경우, 수도권 과밀억제권역 외(경기도 일부, 지방 등)에서 첫 등록 시 소득세/법인세 5년간 50% ~ 최대 100% 전액 감면이 결정됩니다.' },
            { title: '간이과세자 vs 일반과세자 판단', detail: 'B2B 거래 비율이 높은지, 초기 인테리어 및 장비 설비 투자가 수천만 원 이상 들어가 환급을 받아야 하는지에 따라 유리한 과세 유형이 나뉩니다. 무조건 간이가 정답은 아닙니다.' },
            { title: '업종 분류 코드 정밀 기입', detail: '한 번 잘못 적은 업종 코드는 정부과제 심사 탈락, 벤처기업 인증 제외, 소득세 혜택 박탈 등으로 이어집니다. 본인의 실제 비즈니스에 부합하도록 정확한 코드를 조회 매핑해야 합니다.' }
        ]
    },
    {
        id: 'IAwuzMo2m5U',
        title: '부가세 신고 완벽 정리 (기초/실전)',
        duration: '14:25',
        views: '9,200회',
        date: '3개월 전',
        desc: '개인은 연 2회, 법인은 연 4회 진행하는 부가가치세 신고. 홈택스 자동 집계에만 의존하다 누락되어 가산세 폭탄을 맞는 사례를 피하는 방법을 설명합니다.',
        checkpoints: [
            { title: '홈택스 미집계 매출 수동 취합', detail: '배달앱(배민/요기요), 소셜커머스/오픈마켓(쿠팡, 스마트스토어 등) 정산 내역 및 수출 영세율 매출은 홈택스에서 자동으로 정확하게 긁어가지 못하므로, 정산 메뉴를 통해 수동 합산 신고해야 합니다.' },
            { title: '적격증빙 확보와 불공제 매입세액 판정', detail: '매입 시 무조건 세금계산서, 신용카드, 현금영수증의 3대 증빙을 챙겨야 10%를 공제받습니다. 단, 사업용이라도 접대 비용이나 비영업용 소형 승용차 유지 비용 등은 불공제 대상입니다.' },
            { title: '조기환급 제도 활용', detail: '수출을 많이 하거나 감가상각 대상인 건물, 기계장치, 대형 인테리어 설비 신규 구축 시 신고 기한 후 15일 이내에 매입 부가세를 먼저 돌려받는 \'조기환급\'을 적극 신청하여 현금 흐름을 확보하세요.' }
        ]
    },
    {
        id: '1TMjf_q1A2o',
        title: '개인 vs 법인사업자, 처음 시작할 때 뭐가 유리할까?',
        duration: '10:15',
        views: '1.2만회',
        date: '5개월 전',
        desc: '사업체의 형태 선택은 장기적인 절세 설계와 자금 유치의 기초가 됩니다. 무조건적인 세율 비교 대신, 자금 출처의 유연성과 책임 귀속 방식을 따져야 합니다.',
        checkpoints: [
            { title: '소득 수준별 세율 차이 극복', detail: '개인종합소득세는 과세표준에 따라 6%에서 최고 45% 누진 구조입니다. 반면 법인세율은 9%~19%로 한계세율이 크게 낮아집니다. 통상 연 순이익이 7천만 원 이상으로 올라가는 시점부터 전환을 고민해야 합니다.' },
            { title: '자금 집행의 법적 통제 비교', detail: '개인사업은 수익금을 통장에서 자유롭게 유용할 수 있지만, 법인 계좌의 돈은 법적인 별도 인격체의 소유입니다. 급여(근로소득), 상여금, 배당 등의 적법한 원천징수 명목 없이 인출하면 가혹한 가지급금 이자 및 가산세 추징 대상이 됩니다.' },
            { title: '투자 및 대외 공신력', detail: '벤처캐피탈(VC)의 자금 수혈이나 기관의 R&D 연구자금 조달, 금융권의 한도 우대 대출 심사 시에는 지분이 투명하게 조율되는 주식회사(법인)가 압도적인 신뢰 우위를 갖습니다.' }
        ]
    },
    {
        id: 'uBKUbQ66-NQ',
        title: '법인전환 시 놓치면 안 되는 3가지 핵심',
        duration: '12:40',
        views: '8,400회',
        date: '2개월 전',
        desc: '기존 개인사업장에서 법인으로 옷을 갈아입는 것은 단지 이름만 바꾸는 과정이 아닙니다. 전환 시점의 세제 혜택과 법적 규정 설계에 따라 수억 원의 절세 효과가 갈립니다.',
        checkpoints: [
            { title: '영업권(Goodwill) 평가를 통한 법인 자금 법적 회수', detail: '개인사업자가 가진 고유의 인지도, 매출처 등의 가치를 감정평가하여 법인설립 시 \'영업권\' 명목으로 이전합니다. 개인은 기타소득으로 저율 과세되고, 법인은 감가상각비로 매년 비용 처리해 수억 원의 자금을 세금 부담 없이 합법 인출할 수 있습니다.' },
            { title: '조세감면 사업양수도 (취득세 감면 및 양도세 이월과세)', detail: '개인 명의의 사업용 공장, 상가 등의 부동산을 포괄양수도 방식으로 넘길 때, 취득세 감면(최대 75%) 혜택 및 법인 매각 시점까지 개인의 양도소득세를 미뤄주는 조세특례법상 이월과세 혜택 적용 가능 여부를 정밀 사전 설계합니다.' },
            { title: '정관 정비와 퇴직금/상여 규정 세팅', detail: '설립 시점에 법인 정관에 임원 보수, 성과급 지급 기준, 임원 퇴직금 지급 배수 조항 등을 명확히 정비해 두어야 합니다. 규정 없이 지급한 거액의 퇴직금 등은 국세청 세무조사 시 비용으로 인정되지 않고 세금으로 추징당합니다.' }
        ]
    }
];

function openYoutubeLightbox(videoId, index) {
    let video = YOUTUBE_VIDEOS[index];
    if (!video) {
        video = YOUTUBE_VIDEOS.find(v => v.id === videoId);
    }
    if (!video) return;

    // Create modal if it doesn't exist
    let modal = document.getElementById('youtube-lightbox-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'youtube-lightbox-modal';
        modal.className = 'youtube-lightbox-modal';
        document.body.appendChild(modal);
    }

    // Modal structure with description
    let checkpointHtml = '';
    video.checkpoints.forEach(cp => {
        checkpointHtml += `
            <div style="margin-bottom: 16px;">
                <h5 style="margin: 0 0 6px 0; font-size: 0.92rem; color: #fff; font-weight: 700; display: flex; align-items: flex-start; gap: 8px;">
                    <span style="color: #ff0000; font-size: 1.1rem; line-height: 1;">•</span>
                    <span>${cp.title}</span>
                </h5>
                <p style="margin: 0; font-size: 0.8rem; color: #94a3b8; line-height: 1.6; padding-left: 15px;">${cp.detail}</p>
            </div>
        `;
    });

    modal.innerHTML = `
        <div class="youtube-lightbox-overlay" onclick="closeYoutubeLightbox()"></div>
        <button class="youtube-lightbox-close" onclick="closeYoutubeLightbox()" aria-label="닫기">&times;</button>
        <div class="youtube-lightbox-dialog">
            <div class="youtube-lightbox-player">
                <iframe src="https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="youtube-lightbox-details">
                <h4 style="margin: 0 0 12px 0; font-size: 1.15rem; font-weight: 800; color: #fff; line-height: 1.4; word-break: keep-all;">${video.title}</h4>
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                            <img src="https://yt3.googleusercontent.com/ECjSYGS6GpkMB6Xb0ShY20ouRdrDcjHim9PrnEFFOxG_-g5Ybjgk3eRonDwO_Nyw6Y1cDOX3-w=s900-c-k-c0x00ffffff-no-rj" alt="채널아이콘" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect width=%2232%22 height=%2232%22 fill=%22%23ff0000%22/><text x=%2250%25%22 y=%2262%25%22 font-size=%228%22 text-anchor=%22middle%22 fill=%22white%22 font-weight=%22bold%22>일단고</text></svg>'">
                        </div>
                        <div>
                            <span style="font-size: 0.8rem; font-weight: 700; color: #fff; display: block;">일단고! 회계사ㅣ스타트업, 병의원 세무회계</span>
                        </div>
                    </div>
                    <a href="https://www.youtube.com/@%EC%9D%BC%EB%8B%A8%EA%B3%A0%ED%9A%8C%EA%B3%84%EC%82%AC?sub_confirmation=1" target="_blank" class="btn-youtube-subscribe-modal" style="background: #fff; color: #000; border: none; padding: 6px 14px; border-radius: 15px; font-weight: 700; font-size: 0.76rem; text-decoration: none; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center;">구독하러가기</a>
                </div>
                <div style="background: rgba(255,255,255,0.04); border-radius: 8px; padding: 15px; flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column;">
                    <p style="margin: 0 0 16px 0; font-size: 0.82rem; color: #cbd5e1; line-height: 1.5; border-bottom: 1px dashed rgba(255,255,255,0.06); padding-bottom: 12px;">${video.desc}</p>
                    
                    <h5 style="margin: 0 0 12px 0; font-size: 0.88rem; font-weight: 800; color: #ff0000; text-transform: uppercase; letter-spacing: 0.05em;">실무 핵심 체크포인트</h5>
                    <div style="flex-grow: 1; overflow-y: auto;">
                        ${checkpointHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // prevent page scrolling
}

function closeYoutubeLightbox() {
    const modal = document.getElementById('youtube-lightbox-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.innerHTML = ''; // clear iframe
    }
    document.body.style.overflow = '';
}

function toggleSubscribe(btn) {
    if (btn.innerText === '구독') {
        btn.innerText = '구독중';
        btn.style.background = 'rgba(255,255,255,0.15)';
        btn.style.color = '#fff';
    } else {
        btn.innerText = '구독';
        if (btn.classList.contains('btn-youtube-subscribe')) {
            btn.style.background = '#ff0000';
            btn.style.color = '#fff';
        } else {
            btn.style.background = '#fff';
            btn.style.color = '#000';
        }
    }
}

const YOUTUBE_SHORTS = [
    {
        id: 'dByCiGnEPVk',
        title: 'OOO 경비 처리 가능? 불가능?',
        desc: '대표님들이 가장 많이 헷갈리는 경비 처리 가능 여부! 세무사도 모르는 경비 인정 기준과 불인정 사례를 회계사가 직접 쉽고 빠르게 알려드립니다. 지금 바로 확인하고 세금 절세 전략을 세워보세요.',
        checkpoints: [
            { title: '경비 처리 가능한 항목', detail: '사업과 직접 관련된 지출은 경비로 인정받을 수 있습니다. 접대비, 업무용 차량 유지비, 사무용품비 등이 대표적이며 증빙 서류를 반드시 챙겨두어야 합니다.' },
            { title: '경비 처리 불가능한 항목', detail: '개인적 성격의 지출이나 업무와 무관한 비용은 경비로 인정받기 어렵습니다. 세무조사 시 소명 불가 항목은 가산세 대상이 될 수 있으니 주의하세요.' }
        ]
    },
    {
        id: 'pFF8WwpRUQo',
        title: '법인 돈을 안 갚아도 된다고?',
        desc: '법인 자금을 대표자가 가져가는 경우 가지급금 문제가 발생합니다. 하지만 합법적인 방법으로 법인 돈을 갚지 않아도 되는 구조가 있습니다! 빅4 출신 회계사가 핵심만 콕 집어 설명해 드립니다.',
        checkpoints: [
            { title: '가지급금이란?', detail: '대표이사가 법인 자금을 개인적으로 사용할 때 발생하는 세법상 채권입니다. 미상환 시 인정이자가 부과되고 장기 지속 시 상여로 처분되어 과세됩니다.' },
            { title: '합법적 자금 처리 방법', detail: '임원 보수 정관 정비, 배당 설계, 감자, 영업권 양수도 등의 방법을 전략적으로 활용하면 법인 자금을 합법적으로 정리할 수 있습니다.' }
        ]
    },
    {
        id: 'mro-bVPE7Bg',
        title: '어떻게 해서 회계사까지 되었나?',
        desc: '대형 회계법인 빅4 출신의 고혜진 회계사가 어떤 과정을 거쳐 공인회계사가 되었는지 솔직하게 이야기합니다. 회계사를 꿈꾸는 분들, 그리고 에이블세무회계를 더 알고 싶은 분들께 추천합니다.',
        checkpoints: [
            { title: '회계사 시험 준비 과정', detail: '공인회계사(CPA) 시험은 1차 객관식과 2차 주관식으로 나뉩니다. 평균 합격까지 2~4년이 소요되며 철저한 계획과 꾸준한 학습이 필요합니다.' },
            { title: '빅4 회계법인 경험', detail: '대형 회계법인에서의 실무 경험은 다양한 업종의 세무·회계 이슈를 접하게 해주며, 이를 통해 사업자에게 최적화된 절세 전략을 수립할 수 있습니다.' }
        ]
    },
    {
        id: 'Au30KT4lLiM',
        title: '일단 고! 회계사 특징 3가지',
        desc: '에이블세무회계 고혜진 회계사만의 차별화된 특징 3가지를 공개합니다! 단순 기장이 아닌 절세 구조 설계, 리스크 컨설팅, 재무 전문까지 목적에 맞는 기능(ABLE)을 제공하는 파트너를 만나보세요.',
        checkpoints: [
            { title: '빅4 출신의 전문성', detail: '단순 세금 신고를 넘어 기업의 세무 리스크를 미리 파악하고 절세 구조를 설계하는 컨설팅 중심의 세무 서비스를 제공합니다.' },
            { title: '1:1 맞춤 파트너십', detail: '담당 회계사가 직접 소통하고 관리하는 2:1 전담 파트너 시스템으로 대표님의 사업 상황에 최적화된 세무 서비스를 경험하실 수 있습니다.' }
        ]
    }
];


// 유튜브 탭 전환 함수
function switchYoutubeTab(tabType, element) {
    const grid = document.getElementById('youtube-video-grid');
    if (!grid) return;

    // 탭 활성화 클래스 제어
    const tabs = document.querySelectorAll('.youtube-channel-tabs span');
    tabs.forEach(tab => {
        tab.style.color = 'var(--text-muted)';
        tab.style.fontWeight = '600';
        tab.style.borderBottom = 'none';
        tab.classList.remove('active');
    });
    element.style.color = '#fff';
    element.style.fontWeight = '700';
    element.style.borderBottom = '3px solid #ff0000';
    element.classList.add('active');

    if (tabType === 'featured' || tabType === 'latest') {
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        grid.innerHTML = YOUTUBE_VIDEOS.map((video, idx) => `
            <div class="youtube-video-card" onclick="openYoutubeLightbox('${video.id}', ${idx})" style="cursor: pointer; display: flex; flex-direction: column; gap: 12px; transition: all 0.3s ease;">
                <div class="yt-thumb-wrapper" style="position: relative; aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; background: #000; border: 1px solid var(--border-color);">
                    <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" alt="${video.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" class="yt-thumbnail" onerror="this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg'">
                    <div class="yt-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.25s ease;">
                        <div style="width: 48px; height: 48px; background: #ff0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(255,0,0,0.55);">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" style="margin-left: 2px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                    </div>
                    <span style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.85); color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; font-family: sans-serif;">${video.duration}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 1px solid var(--border-color);">
                        <img src="https://yt3.googleusercontent.com/ECjSYGS6GpkMB6Xb0ShY20ouRdrDcjHim9PrnEFFOxG_-g5Ybjgk3eRonDwO_Nyw6Y1cDOX3-w=s900-c-k-c0x00ffffff-no-rj" alt="채널아이콘" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2236%22 height=%2236%22><rect width=%2236%22 height=%2236%22 fill=%22%23ff0000%22/><text x=%2250%25%22 y=%2262%25%22 font-size=%229%22 text-anchor=%22middle%22 fill=%22white%22 font-weight=%22bold%22>일단고</text></svg>'">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <h4 style="margin: 0; font-size: 0.9rem; font-weight: 700; color: #fff; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: keep-all;" class="yt-video-title">${video.title}</h4>
                        <p style="margin: 0; font-size: 0.78rem; color: var(--text-secondary);" class="yt-channel-title">일단고! 회계사</p>
                    </div>
                </div>
            </div>
        `).join('');
    } else if (tabType === 'shorts') {
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        grid.innerHTML = YOUTUBE_SHORTS.map((short, idx) => `
            <div class="youtube-video-card" onclick="openYoutubeShortsLightbox('${short.id}', ${idx})" style="cursor: pointer; display: flex; flex-direction: column; gap: 12px; transition: all 0.3s ease;">
                <div class="yt-thumb-wrapper" style="position: relative; aspect-ratio: 9/16; border-radius: 12px; overflow: hidden; background: #000; border: 1px solid var(--border-color);">
                    <img src="https://img.youtube.com/vi/${short.id}/hqdefault.jpg" alt="${short.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" class="yt-thumbnail">
                    <div class="yt-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: all 0.25s ease;">
                        <div style="width: 48px; height: 48px; background: #ff0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(255,0,0,0.55); margin-bottom: 8px;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff" style="margin-left: 2px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                        <span style="background: rgba(255, 0, 0, 0.95); color: #fff; padding: 4px 10px; border-radius: 14px; font-size: 0.68rem; font-weight: 850; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 3px; box-shadow: 0 2px 8px rgba(255, 0, 0, 0.45);">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="#fff"><path d="M17.743 14.077c.57-.57 1.226-1.393 1.226-2.584 0-1.785-1.453-3.237-3.237-3.237-.777 0-1.488.275-2.046.735v-5.263l-8.52 7.743c-.57.57-1.226 1.393-1.226 2.584 0 1.785 1.453 3.237 3.237 3.237.777 0 1.488-.275 2.046-.735v5.263l8.52-7.743z"/></svg> Shorts
                        </span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 1px solid var(--border-color);">
                        <img src="https://yt3.googleusercontent.com/ECjSYGS6GpkMB6Xb0ShY20ouRdrDcjHim9PrnEFFOxG_-g5Ybjgk3eRonDwO_Nyw6Y1cDOX3-w=s900-c-k-c0x00ffffff-no-rj" alt="채널아이콘" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect width=%2232%22 height=%2232%22 fill=%22%23ff0000%22/><text x=%2250%25%22 y=%2262%25%22 font-size=%228%22 text-anchor=%22middle%22 fill=%22white%22 font-weight=%22bold%22>일단고</text></svg>'">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                        <h4 style="margin: 0; font-size: 0.85rem; font-weight: 700; color: #fff; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: keep-all;" class="yt-video-title">${short.title}</h4>
                        <p style="margin: 0; font-size: 0.74rem; color: var(--text-secondary);" class="yt-channel-title">일단고! 회계사</p>
                    </div>
                </div>
            </div>
        `).join('');
    } else if (tabType === 'playlist') {
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        grid.innerHTML = `
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; text-align: center;">
                <h4 style="margin: 0 0 8px 0; color: #fff; font-size: 1rem; font-weight: 700;">📂 스타트업 세무실무 완전정복</h4>
                <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">개인사업자 등록부터 법인전환, 벤처인증까지 한 번에</p>
                <a href="https://www.youtube.com/@%EC%9D%BC%EB%8B%A8%EA%B3%A0%ED%9A%8C%EA%B3%84%EC%82%AC" target="_blank" class="btn btn-outline btn-sm" style="margin-top: 16px; font-size: 0.72rem; padding: 8px 14px; text-decoration: none; border-radius: 15px; display: inline-block;">재생목록 보기</a>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; text-align: center;">
                <h4 style="margin: 0 0 8px 0; color: #fff; font-size: 1rem; font-weight: 700;">📂 병의원 전문 밀착 기장</h4>
                <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">비급여 소명 대응, 닥터론 자금 설계, 동업 계약 자문</p>
                <a href="https://www.youtube.com/@%EC%9D%BC%EB%8B%A8%EA%B3%A0%ED%9A%8C%EA%B3%84%EC%82%AC" target="_blank" class="btn btn-outline btn-sm" style="margin-top: 16px; font-size: 0.72rem; padding: 8px 14px; text-decoration: none; border-radius: 15px; display: inline-block;">재생목록 보기</a>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; text-align: center;">
                <h4 style="margin: 0 0 8px 0; color: #fff; font-size: 1rem; font-weight: 700;">📂 고회계사의 실전 절세 과외</h4>
                <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">초보 사장님들을 위한 기초 세금 꿀팁 숏폼 총집합</p>
                <a href="https://www.youtube.com/@%EC%9D%BC%EB%8B%A8%EA%B3%A0%ED%9A%8C%EA%B3%84%EC%82%AC" target="_blank" class="btn btn-outline btn-sm" style="margin-top: 16px; font-size: 0.72rem; padding: 8px 14px; text-decoration: none; border-radius: 15px; display: inline-block;">재생목록 보기</a>
            </div>
        `;
    }
}

function openYoutubeShortsLightbox(shortsId, index) {
    const short = YOUTUBE_SHORTS[index];
    if (!short) return;

    let modal = document.getElementById('youtube-lightbox-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'youtube-lightbox-modal';
        modal.className = 'youtube-lightbox-modal';
        document.body.appendChild(modal);
    }

    let checkpointHtml = '';
    short.checkpoints.forEach(cp => {
        checkpointHtml += `
            <div style="margin-bottom: 16px;">
                <h5 style="margin: 0 0 6px 0; font-size: 0.92rem; color: #fff; font-weight: 700; display: flex; align-items: flex-start; gap: 8px;">
                    <span style="color: #ff0000; font-size: 1.1rem; line-height: 1;">•</span>
                    <span>${cp.title}</span>
                </h5>
                <p style="margin: 0; font-size: 0.8rem; color: #94a3b8; line-height: 1.6; padding-left: 15px;">${cp.detail}</p>
            </div>
        `;
    });

    modal.innerHTML = `
        <div class="youtube-lightbox-overlay" onclick="closeYoutubeLightbox()"></div>
        <button class="youtube-lightbox-close" onclick="closeYoutubeLightbox()" aria-label="닫기">&times;</button>
        <div class="youtube-lightbox-dialog">
            <div class="youtube-lightbox-player">
                <iframe src="https://www.youtube-nocookie.com/embed/${short.id}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="youtube-lightbox-details">
                <h4 style="margin: 0 0 12px 0; font-size: 1.15rem; font-weight: 800; color: #fff; line-height: 1.4; word-break: keep-all;">${short.title}</h4>
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                            <img src="https://yt3.googleusercontent.com/ECjSYGS6GpkMB6Xb0ShY20ouRdrDcjHim9PrnEFFOxG_-g5Ybjgk3eRonDwO_Nyw6Y1cDOX3-w=s900-c-k-c0x00ffffff-no-rj" alt="채널아이콘" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2232%22 height=%2232%22><rect width=%2232%22 height=%2232%22 fill=%22%23ff0000%22/><text x=%2250%25%22 y=%2262%25%22 font-size=%228%22 text-anchor=%22middle%22 fill=%22white%22 font-weight=%22bold%22>일단고</text></svg>'">
                        </div>
                        <div>
                            <span style="font-size: 0.8rem; font-weight: 700; color: #fff; display: block;">일단고! 회계사ㅣ스타트업, 병의원 세무회계</span>
                        </div>
                    </div>
                    <a href="https://www.youtube.com/@%EC%9D%BC%EB%8B%A8%EA%B3%A0%ED%9A%8C%EA%B3%84%EC%82%AC?sub_confirmation=1" target="_blank" class="btn-youtube-subscribe-modal" style="background: #fff; color: #000; border: none; padding: 6px 14px; border-radius: 15px; font-weight: 700; font-size: 0.76rem; text-decoration: none; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center;">구독하러가기</a>
                </div>
                <div style="background: rgba(255,255,255,0.04); border-radius: 8px; padding: 15px; flex-grow: 1; overflow-y: auto; display: flex; flex-direction: column;">
                    <p style="margin: 0 0 16px 0; font-size: 0.82rem; color: #cbd5e1; line-height: 1.5; border-bottom: 1px dashed rgba(255,255,255,0.06); padding-bottom: 12px;">${short.desc}</p>
                    <h5 style="margin: 0 0 12px 0; font-size: 0.88rem; font-weight: 800; color: #ff0000; text-transform: uppercase; letter-spacing: 0.05em;">실무 핵심 체크포인트</h5>
                    <div style="flex-grow: 1; overflow-y: auto;">
                        ${checkpointHtml}
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}






// ==========================================
// 2026 네트제(세후)급여 실제 원장 부담액 역산 계산기 엔진
// ==========================================

const NET_TAX_TABLE = [[770000,775000,0],[775000,780000,0],[780000,785000,0],[785000,790000,0],[790000,795000,0],[795000,800000,0],[800000,805000,0],[805000,810000,0],[810000,815000,0],[815000,820000,0],[820000,825000,0],[825000,830000,0],[830000,835000,0],[835000,840000,0],[840000,845000,0],[845000,850000,0],[850000,855000,0],[855000,860000,0],[860000,865000,0],[865000,870000,0],[870000,875000,0],[875000,880000,0],[880000,885000,0],[885000,890000,0],[890000,895000,0],[895000,900000,0],[900000,905000,0],[905000,910000,0],[910000,915000,0],[915000,920000,0],[920000,925000,0],[925000,930000,0],[930000,935000,0],[935000,940000,0],[940000,945000,0],[945000,950000,0],[950000,955000,0],[955000,960000,0],[960000,965000,0],[965000,970000,0],[970000,975000,0],[975000,980000,0],[980000,985000,0],[985000,990000,0],[990000,995000,0],[995000,1000000,0],[1000000,1005000,0],[1005000,1010000,0],[1010000,1015000,0],[1015000,1020000,0],[1020000,1025000,0],[1025000,1030000,0],[1030000,1035000,0],[1035000,1040000,0],[1040000,1045000,0],[1045000,1050000,0],[1050000,1055000,0],[1055000,1060000,0],[1060000,1065000,1040],[1065000,1070000,1110],[1070000,1075000,1180],[1075000,1080000,1250],[1080000,1085000,1320],[1085000,1090000,1390],[1090000,1095000,1460],[1095000,1100000,1530],[1100000,1105000,1600],[1105000,1110000,1670],[1110000,1115000,1740],[1115000,1120000,1810],[1120000,1125000,1880],[1125000,1130000,1950],[1130000,1135000,2020],[1135000,1140000,2090],[1140000,1145000,2160],[1145000,1150000,2230],[1150000,1155000,2300],[1155000,1160000,2370],[1160000,1165000,2440],[1165000,1170000,2500],[1170000,1175000,2570],[1175000,1180000,2640],[1180000,1185000,2710],[1185000,1190000,2780],[1190000,1195000,2850],[1195000,1200000,2920],[1200000,1205000,2990],[1205000,1210000,3060],[1210000,1215000,3130],[1215000,1220000,3200],[1220000,1225000,3270],[1225000,1230000,3340],[1230000,1235000,3410],[1235000,1240000,3480],[1240000,1245000,3550],[1245000,1250000,3620],[1250000,1255000,3700],[1255000,1260000,3810],[1260000,1265000,3910],[1265000,1270000,4010],[1270000,1275000,4120],[1275000,1280000,4220],[1280000,1285000,4320],[1285000,1290000,4430],[1290000,1295000,4530],[1295000,1300000,4630],[1300000,1305000,4740],[1305000,1310000,4840],[1310000,1315000,4940],[1315000,1320000,5050],[1320000,1325000,5150],[1325000,1330000,5250],[1330000,1335000,5360],[1335000,1340000,5460],[1340000,1345000,5560],[1345000,1350000,5670],[1350000,1355000,5770],[1355000,1360000,5870],[1360000,1365000,5980],[1365000,1370000,6080],[1370000,1375000,6180],[1375000,1380000,6290],[1380000,1385000,6390],[1385000,1390000,6490],[1390000,1395000,6600],[1395000,1400000,6700],[1400000,1405000,6800],[1405000,1410000,6910],[1410000,1415000,7010],[1415000,1420000,7110],[1420000,1425000,7210],[1425000,1430000,7320],[1430000,1435000,7420],[1435000,1440000,7520],[1440000,1445000,7630],[1445000,1450000,7730],[1450000,1455000,7830],[1455000,1460000,7940],[1460000,1465000,8040],[1465000,1470000,8140],[1470000,1475000,8250],[1475000,1480000,8350],[1480000,1485000,8450],[1485000,1490000,8560],[1490000,1495000,8660],[1495000,1500000,8760],[1500000,1510000,8920],[1510000,1520000,9120],[1520000,1530000,9330],[1530000,1540000,9540],[1540000,1550000,9740],[1550000,1560000,9950],[1560000,1570000,10160],[1570000,1580000,10360],[1580000,1590000,10570],[1590000,1600000,10780],[1600000,1610000,10980],[1610000,1620000,11190],[1620000,1630000,11400],[1630000,1640000,11600],[1640000,1650000,11810],[1650000,1660000,12020],[1660000,1670000,12220],[1670000,1680000,12430],[1680000,1690000,12640],[1690000,1700000,12840],[1700000,1710000,13050],[1710000,1720000,13260],[1720000,1730000,13460],[1730000,1740000,13670],[1740000,1750000,13880],[1750000,1760000,14080],[1760000,1770000,14290],[1770000,1780000,14500],[1780000,1790000,14700],[1790000,1800000,14910],[1800000,1810000,15110],[1810000,1820000,15320],[1820000,1830000,15530],[1830000,1840000,15730],[1840000,1850000,15940],[1850000,1860000,16150],[1860000,1870000,16350],[1870000,1880000,16560],[1880000,1890000,16770],[1890000,1900000,16970],[1900000,1910000,17180],[1910000,1920000,17390],[1920000,1930000,17590],[1930000,1940000,17800],[1940000,1950000,18010],[1950000,1960000,18210],[1960000,1970000,18420],[1970000,1980000,18630],[1980000,1990000,18880],[1990000,2000000,19200],[2000000,2010000,19520],[2010000,2020000,19850],[2020000,2030000,20170],[2030000,2040000,20490],[2040000,2050000,20810],[2050000,2060000,21130],[2060000,2070000,21450],[2070000,2080000,21770],[2080000,2090000,22090],[2090000,2100000,22420],[2100000,2110000,22740],[2110000,2120000,23060],[2120000,2130000,23380],[2130000,2140000,23700],[2140000,2150000,24020],[2150000,2160000,24340],[2160000,2170000,24660],[2170000,2180000,24990],[2180000,2190000,25310],[2190000,2200000,25630],[2200000,2210000,25950],[2210000,2220000,26270],[2220000,2230000,26590],[2230000,2240000,26910],[2240000,2250000,27240],[2250000,2260000,27560],[2260000,2270000,27880],[2270000,2280000,28200],[2280000,2290000,28520],[2290000,2300000,28840],[2300000,2310000,29160],[2310000,2320000,29480],[2320000,2330000,29810],[2330000,2340000,30130],[2340000,2350000,30450],[2350000,2360000,30770],[2360000,2370000,31090],[2370000,2380000,31410],[2380000,2390000,31730],[2390000,2400000,32050],[2400000,2410000,32380],[2410000,2420000,32700],[2420000,2430000,33020],[2430000,2440000,33340],[2440000,2450000,33660],[2450000,2460000,33980],[2460000,2470000,34300],[2470000,2480000,34630],[2480000,2490000,34950],[2490000,2500000,35270],[2500000,2510000,35600],[2510000,2520000,35940],[2520000,2530000,36280],[2530000,2540000,36630],[2540000,2550000,36970],[2550000,2560000,37310],[2560000,2570000,37650],[2570000,2580000,38000],[2580000,2590000,38340],[2590000,2600000,38830],[2600000,2610000,39690],[2610000,2620000,40540],[2620000,2630000,41400],[2630000,2640000,42260],[2640000,2650000,43110],[2650000,2660000,43970],[2660000,2670000,44820],[2670000,2680000,45680],[2680000,2690000,46540],[2690000,2700000,47390],[2700000,2710000,48250],[2710000,2720000,49100],[2720000,2730000,49960],[2730000,2740000,50810],[2740000,2750000,51670],[2750000,2760000,52530],[2760000,2770000,53380],[2770000,2780000,54240],[2780000,2790000,55090],[2790000,2800000,55950],[2800000,2810000,56800],[2810000,2820000,57660],[2820000,2830000,58520],[2830000,2840000,59370],[2840000,2850000,60230],[2850000,2860000,61080],[2860000,2870000,61940],[2870000,2880000,62790],[2880000,2890000,63650],[2890000,2900000,64510],[2900000,2910000,65360],[2910000,2920000,66220],[2920000,2930000,67070],[2930000,2940000,67930],[2940000,2950000,68780],[2950000,2960000,69640],[2960000,2970000,70500],[2970000,2980000,71350],[2980000,2990000,72210],[2990000,3000000,73060],[3000000,3020000,74350],[3020000,3040000,76060],[3040000,3060000,77770],[3060000,3080000,79480],[3080000,3100000,81190],[3100000,3120000,82900],[3120000,3140000,84620],[3140000,3160000,86330],[3160000,3180000,88040],[3180000,3200000,89750],[3200000,3220000,91460],[3220000,3240000,93170],[3240000,3260000,95430],[3260000,3280000,97880],[3280000,3300000,100320],[3300000,3320000,102770],[3320000,3340000,105210],[3340000,3360000,107660],[3360000,3380000,110100],[3380000,3400000,112550],[3400000,3420000,114990],[3420000,3440000,117440],[3440000,3460000,119880],[3460000,3480000,122330],[3480000,3500000,124770],[3500000,3520000,127220],[3520000,3540000,129660],[3540000,3560000,132110],[3560000,3580000,134550],[3580000,3600000,137000],[3600000,3620000,139440],[3620000,3640000,141890],[3640000,3660000,144330],[3660000,3680000,146780],[3680000,3700000,149220],[3700000,3720000,151670],[3720000,3740000,154110],[3740000,3760000,156560],[3760000,3780000,163920],[3780000,3800000,166590],[3800000,3820000,169260],[3820000,3840000,171930],[3840000,3860000,174600],[3860000,3880000,177270],[3880000,3900000,179940],[3900000,3920000,182610],[3920000,3940000,185280],[3940000,3960000,187950],[3960000,3980000,190620],[3980000,4000000,193290],[4000000,4020000,195960],[4020000,4040000,198630],[4040000,4060000,201300],[4060000,4080000,203970],[4080000,4100000,206640],[4100000,4120000,209310],[4120000,4140000,211980],[4140000,4160000,214650],[4160000,4180000,217320],[4180000,4200000,219990],[4200000,4220000,222660],[4220000,4240000,225330],[4240000,4260000,228000],[4260000,4280000,230670],[4280000,4300000,233340],[4300000,4320000,236010],[4320000,4340000,238680],[4340000,4360000,241350],[4360000,4380000,244020],[4380000,4400000,246690],[4400000,4420000,249360],[4420000,4440000,252030],[4440000,4460000,254700],[4460000,4480000,257370],[4480000,4500000,260040],[4500000,4520000,262840],[4520000,4540000,265650],[4540000,4560000,268450],[4560000,4580000,271260],[4580000,4600000,276560],[4600000,4620000,279370],[4620000,4640000,282170],[4640000,4660000,284980],[4660000,4680000,287780],[4680000,4700000,290590],[4700000,4720000,293390],[4720000,4740000,296200],[4740000,4760000,299000],[4760000,4780000,301810],[4780000,4800000,304610],[4800000,4820000,307420],[4820000,4840000,310220],[4840000,4860000,313030],[4860000,4880000,315830],[4880000,4900000,318640],[4900000,4920000,321440],[4920000,4940000,324250],[4940000,4960000,327050],[4960000,4980000,329860],[4980000,5000000,332660],[5000000,5020000,335470],[5020000,5040000,338270],[5040000,5060000,341080],[5060000,5080000,343880],[5080000,5100000,346690],[5100000,5120000,349490],[5120000,5140000,352300],[5140000,5160000,355100],[5160000,5180000,357910],[5180000,5200000,360710],[5200000,5220000,363520],[5220000,5240000,366320],[5240000,5260000,369130],[5260000,5280000,371930],[5280000,5300000,374740],[5300000,5320000,377540],[5320000,5340000,380350],[5340000,5360000,383150],[5360000,5380000,385960],[5380000,5400000,388760],[5400000,5420000,391570],[5420000,5440000,394370],[5440000,5460000,397180],[5460000,5480000,399980],[5480000,5500000,402790],[5500000,5520000,405590],[5520000,5540000,408400],[5540000,5560000,411200],[5560000,5580000,414010],[5580000,5600000,416810],[5600000,5620000,419620],[5620000,5640000,422420],[5640000,5660000,425230],[5660000,5680000,428030],[5680000,5700000,430840],[5700000,5720000,433640],[5720000,5740000,436450],[5740000,5760000,439250],[5760000,5780000,442060],[5780000,5800000,444860],[5800000,5820000,447670],[5820000,5840000,450470],[5840000,5860000,470380],[5860000,5880000,475720],[5880000,5900000,478690],[5900000,5920000,483220],[5920000,5940000,487760],[5940000,5960000,492300],[5960000,5980000,496830],[5980000,6000000,501370],[6000000,6020000,505900],[6020000,6040000,510440],[6040000,6060000,514980],[6060000,6080000,519510],[6080000,6100000,524050],[6100000,6120000,528580],[6120000,6140000,533120],[6140000,6160000,537660],[6160000,6180000,542190],[6180000,6200000,546730],[6200000,6220000,551260],[6220000,6240000,555800],[6240000,6260000,560340],[6260000,6280000,564870],[6280000,6300000,569410],[6300000,6320000,573940],[6320000,6340000,578480],[6340000,6360000,583020],[6360000,6380000,587550],[6380000,6400000,592090],[6400000,6420000,596620],[6420000,6440000,601160],[6440000,6460000,605700],[6460000,6480000,610230],[6480000,6500000,614770],[6500000,6520000,619300],[6520000,6540000,623840],[6540000,6560000,628380],[6560000,6580000,632910],[6580000,6600000,637450],[6600000,6620000,641980],[6620000,6640000,646520],[6640000,6660000,651060],[6660000,6680000,655590],[6680000,6700000,660130],[6700000,6720000,664660],[6720000,6740000,669200],[6740000,6760000,673740],[6760000,6780000,678270],[6780000,6800000,682810],[6800000,6820000,687340],[6820000,6840000,691880],[6840000,6860000,696420],[6860000,6880000,700950],[6880000,6900000,705490],[6900000,6920000,710020],[6920000,6940000,714560],[6940000,6960000,719100],[6960000,6980000,723630],[6980000,7000000,728170],[7000000,7020000,732700],[7020000,7040000,737240],[7040000,7060000,741780],[7060000,7080000,746310],[7080000,7100000,750850],[7100000,7120000,755380],[7120000,7140000,759920],[7140000,7160000,764460],[7160000,7180000,768990],[7180000,7200000,773530],[7200000,7220000,778060],[7220000,7240000,782600],[7240000,7260000,787140],[7260000,7280000,791670],[7280000,7300000,796210],[7300000,7320000,800740],[7320000,7340000,805280],[7340000,7360000,809820],[7360000,7380000,814350],[7380000,7400000,818890],[7400000,7420000,823420],[7420000,7440000,827960],[7440000,7460000,832500],[7460000,7480000,837030],[7480000,7500000,841570],[7500000,7520000,846100],[7520000,7540000,850640],[7540000,7560000,855180],[7560000,7580000,859710],[7580000,7600000,864250],[7600000,7620000,868780],[7620000,7640000,873320],[7640000,7660000,877860],[7660000,7680000,882390],[7680000,7700000,886930],[7700000,7720000,891460],[7720000,7740000,896000],[7740000,7760000,900540],[7760000,7780000,905070],[7780000,7800000,909610],[7800000,7820000,914140],[7820000,7840000,918680],[7840000,7860000,923220],[7860000,7880000,927750],[7880000,7900000,932290],[7900000,7920000,936820],[7920000,7940000,941360],[7940000,7960000,945900],[7960000,7980000,950430],[7980000,8000000,954970],[8000000,8020000,959500],[8020000,8040000,964040],[8040000,8060000,968580],[8060000,8080000,973110],[8080000,8100000,977650],[8100000,8120000,982180],[8120000,8140000,986720],[8140000,8160000,991260],[8160000,8180000,995790],[8180000,8200000,1000330],[8200000,8220000,1004860],[8220000,8240000,1009400],[8240000,8260000,1013940],[8260000,8280000,1018470],[8280000,8300000,1023010],[8300000,8320000,1027540],[8320000,8340000,1032080],[8340000,8360000,1036740],[8360000,8380000,1041420],[8380000,8400000,1046100],[8400000,8420000,1050780],[8420000,8440000,1055460],[8440000,8460000,1060140],[8460000,8480000,1064820],[8480000,8500000,1069500],[8500000,8520000,1074180],[8520000,8540000,1078860],[8540000,8560000,1083540],[8560000,8580000,1088220],[8580000,8600000,1092900],[8600000,8620000,1097580],[8620000,8640000,1102260],[8640000,8660000,1106940],[8660000,8680000,1111620],[8680000,8700000,1116300],[8700000,8720000,1120980],[8720000,8740000,1125660],[8740000,8760000,1130340],[8760000,8780000,1135020],[8780000,8800000,1139700],[8800000,8820000,1144380],[8820000,8840000,1149060],[8840000,8860000,1153740],[8860000,8880000,1158420],[8880000,8900000,1163100],[8900000,8920000,1167780],[8920000,8940000,1172460],[8940000,8960000,1177140],[8960000,8980000,1181820],[8980000,9000000,1186500],[9000000,9020000,1191180],[9020000,9040000,1195860],[9040000,9060000,1200540],[9060000,9080000,1205220],[9080000,9100000,1209900],[9100000,9120000,1214580],[9120000,9140000,1219260],[9140000,9160000,1223940],[9160000,9180000,1228620],[9180000,9200000,1233300],[9200000,9220000,1237980],[9220000,9240000,1244640],[9240000,9260000,1251470],[9260000,9280000,1258290],[9280000,9300000,1265120],[9300000,9320000,1271940],[9320000,9340000,1278770],[9340000,9360000,1285590],[9360000,9380000,1292420],[9380000,9400000,1299240],[9400000,9420000,1306070],[9420000,9440000,1312890],[9440000,9460000,1319720],[9460000,9480000,1326540],[9480000,9500000,1333370],[9500000,9520000,1340190],[9520000,9540000,1347020],[9540000,9560000,1353840],[9560000,9580000,1360670],[9580000,9600000,1367490],[9600000,9620000,1374320],[9620000,9640000,1381140],[9640000,9660000,1387970],[9660000,9680000,1394790],[9680000,9700000,1401620],[9700000,9720000,1408440],[9720000,9740000,1415270],[9740000,9760000,1422090],[9760000,9780000,1428920],[9780000,9800000,1435740],[9800000,9820000,1442570],[9820000,9840000,1449390],[9840000,9860000,1456220],[9860000,9880000,1463040],[9880000,9900000,1469870],[9900000,9920000,1476690],[9920000,9940000,1483520],[9940000,9960000,1490340],[9960000,9980000,1497170],[9980000,10000000,1503990]];

function getIncomeTax(gross) {
    if (gross < 770000) return 0;
    if (gross <= 10000000) {
        for (let i = 0; i < NET_TAX_TABLE.length; i++) {
            const [min, max, tax] = NET_TAX_TABLE[i];
            if (gross >= min && gross < max) {
                return tax;
            }
        }
        return 1503990;
    }
    if (gross <= 14000000) {
        return Math.round((gross * 0.343 - 1897600) / 10) * 10;
    } else if (gross <= 28000000) {
        return Math.round((gross * 0.3724 - 2309200) / 10) * 10;
    } else if (gross <= 30000000) {
        return Math.round((gross * 0.392 - 2858000) / 10) * 10;
    } else {
        return Math.round((gross * 0.4 - 3098000) / 10) * 10;
    }
}

function getNetFromGross(gross) {
    const pension = Math.min(313020, Math.round((gross * 0.0475) / 10) * 10);
    const health = Math.round((gross * 0.03595) / 10) * 10;
    const ltc = Math.round((gross * 0.0047) / 10) * 10;
    const employment = Math.round((gross * 0.009) / 10) * 10;
    const tax = getIncomeTax(gross);
    const localTax = Math.round(tax * 0.1);
    const deductions = pension + health + ltc + employment + tax + localTax;
    return gross - deductions;
}

function reverseNetToGross(net) {
    if (net < 700000) return net;
    let candidateGross = null;
    
    // 1. Search brackets <= 10M
    for (let i = 0; i < NET_TAX_TABLE.length; i++) {
        const [min, max, tax] = NET_TAX_TABLE[i];
        
        // Candidate 1: Pension cap not reached
        const g1 = (net + 1.1 * tax) / 0.90285;
        if (g1 >= min && g1 < max && g1 <= 6589894.73) {
            candidateGross = g1;
            break;
        }
        
        // Candidate 2: Pension cap reached
        const g2 = (net + 313020 + 1.1 * tax) / 0.95035;
        if (g2 >= min && g2 < max && g2 > 6589894.73) {
            candidateGross = g2;
            break;
        }
    }
    
    // 2. Search brackets > 10M
    if (!candidateGross) {
        const highBrackets = [
            { min: 10000001, max: 14000000, coef: 0.343, intercept: -1897600 },
            { min: 14000001, max: 28000000, coef: 0.3724, intercept: -2309200 },
            { min: 28000001, max: 30000000, coef: 0.392, intercept: -2858000 },
            { min: 30000001, max: 45000000, coef: 0.40, intercept: -3098000 }
        ];
        
        for (let b of highBrackets) {
            const denom = 0.95035 - 1.1 * b.coef;
            const g = (net + 313020 + 1.1 * b.intercept) / denom;
            if (g >= b.min && g <= b.max) {
                candidateGross = g;
                break;
            }
        }
    }
    
    if (!candidateGross) return net;
    
    // 3. Local search ±500 won for exact match after rounding
    const startGross = Math.round(candidateGross);
    let bestGross = startGross;
    let minDiff = Infinity;
    
    for (let g = startGross - 500; g <= startGross + 500; g++) {
        const calculatedNet = getNetFromGross(g);
        const diff = Math.abs(calculatedNet - net);
        if (diff < minDiff) {
            minDiff = diff;
            bestGross = g;
        }
    }
    
    return bestGross;
}

// 10.4 네트제 급여 실시간 계산 (메인 페이지용)
function calculateNetSalaryBurden() {
    const netRange = document.getElementById('net-salary');
    const severanceCheck = document.getElementById('net-severance-check');
    if (!netRange) return;

    const net = parseInt(netRange.value) * 10000; // slider is in ten-thousands
    
    // Sync input field & KRW label
    const netInput = document.getElementById('net-salary-input');
    if (netInput) netInput.value = parseInt(netRange.value);
    const krwEl = document.getElementById('net-salary-krw');
    if (krwEl) krwEl.innerText = '(' + net.toLocaleString() + ' 원)';

    const netVal = document.getElementById('net-salary-val');
    if (netVal) netVal.innerText = (net / 10000).toLocaleString() + '만 원 (' + net.toLocaleString() + '원)';

    // 역산
    const gross = reverseNetToGross(net);

    // 공제금액 상세 산출 (근로자 부담)
    const pensionEmp = Math.min(313020, Math.round((gross * 0.0475) / 10) * 10);
    const healthEmp = Math.round((gross * 0.03595) / 10) * 10;
    const ltcEmp = Math.round((gross * 0.0047) / 10) * 10;
    const employmentEmp = Math.round((gross * 0.009) / 10) * 10;
    const taxEmp = getIncomeTax(gross);
    const localTaxEmp = Math.round(taxEmp * 0.1);
    const deductionsTotal = pensionEmp + healthEmp + ltcEmp + employmentEmp + taxEmp + localTaxEmp;

    // 회사 부담 4대보험
    const pensionComp = pensionEmp;
    const healthComp = healthEmp;
    const ltcComp = ltcEmp;
    const employmentComp = Math.floor((employmentEmp / 0.009) * 0.0115 / 10) * 10; // TRUNC(..., -1)
    const insuranceCompTotal = pensionComp + healthComp + ltcComp + employmentComp;

    // 퇴직금
    const isSeverance = severanceCheck ? severanceCheck.checked : true;
    const severancePay = isSeverance ? Math.round((gross / 12) / 10) * 10 : 0;

    // 원장님 실제 총지출액 = Gross + 회사부담4대보험 + 퇴직급여
    const employerCost = gross + insuranceCompTotal + severancePay;

    // 세후 급여 대비 추가 지출 비율
    const addBurdenRatio = ((employerCost - net) / net * 100).toFixed(1);

    // UI 바인딩 (3개 슬라이더 인터랙션 추가)
    const grossValEl = document.getElementById('net-gross-val');
    const grossSliderEl = document.getElementById('net-gross-slider');
    const totalValEl = document.getElementById('net-total-val');
    const totalSliderEl = document.getElementById('net-total-slider');
    
    if (grossValEl) grossValEl.innerText = (gross / 10000).toLocaleString(undefined, {maximumFractionDigits: 1}) + '만 원 (' + gross.toLocaleString() + '원)';
    if (grossSliderEl) grossSliderEl.value = Math.round(gross / 10000);
    if (totalValEl) totalValEl.innerText = (employerCost / 10000).toLocaleString(undefined, {maximumFractionDigits: 1}) + '만 원 (' + employerCost.toLocaleString() + '원)';
    if (totalSliderEl) totalSliderEl.value = Math.round(employerCost / 10000);

    document.getElementById('net-gross-result').innerText = gross.toLocaleString() + ' 원';
    document.getElementById('net-employer-total').innerText = employerCost.toLocaleString() + ' 원';
    document.getElementById('net-burden-ratio').innerText = addBurdenRatio + '%';

    // 상세 분석 바인딩
    document.getElementById('net-total-deductions').innerText = deductionsTotal.toLocaleString() + ' 원';
    document.getElementById('net-pension-employee').innerText = pensionEmp.toLocaleString() + ' 원';
    document.getElementById('net-pension-employer').innerText = pensionComp.toLocaleString() + ' 원';
    document.getElementById('net-health-employee').innerText = healthEmp.toLocaleString() + ' 원';
    document.getElementById('net-health-employer').innerText = healthComp.toLocaleString() + ' 원';
    document.getElementById('net-ltc-employee').innerText = ltcEmp.toLocaleString() + ' 원';
    document.getElementById('net-ltc-employer').innerText = ltcComp.toLocaleString() + ' 원';
    document.getElementById('net-employment-employee').innerText = employmentEmp.toLocaleString() + ' 원';
    document.getElementById('net-employment-employer').innerText = employmentComp.toLocaleString() + ' 원';
    document.getElementById('net-tax-employee').innerText = taxEmp.toLocaleString() + ' 원';
    document.getElementById('net-localtax-employee').innerText = localTaxEmp.toLocaleString() + ' 원';
    document.getElementById('net-severance').innerText = severancePay.toLocaleString() + ' 원';
    
    // Breakdown panel height update if active
    const panel = document.getElementById('net-breakdown-panel');
    if (panel && panel.style.maxHeight) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
    }
}

// 10.5 네트제 급여 실시간 계산 (우측 드로어용)
function calculateDrawerNetSalaryBurden() {
    const netRange = document.getElementById('d-net-salary');
    const severanceCheck = document.getElementById('d-net-severance-check');
    if (!netRange) return;

    const net = parseInt(netRange.value) * 10000;

    // Sync input field & KRW label
    const netInput = document.getElementById('d-net-salary-input');
    if (netInput) netInput.value = parseInt(netRange.value);
    const krwEl = document.getElementById('d-net-salary-krw');
    if (krwEl) krwEl.innerText = '(' + net.toLocaleString() + ' 원)';

    const netVal = document.getElementById('d-net-salary-val');
    if (netVal) netVal.innerText = (net / 10000).toLocaleString() + '만 원 (' + net.toLocaleString() + '원)';

    // 역산
    const gross = reverseNetToGross(net);

    // 공제금액 상세 산출
    const pensionEmp = Math.min(313020, Math.round((gross * 0.0475) / 10) * 10);
    const healthEmp = Math.round((gross * 0.03595) / 10) * 10;
    const ltcEmp = Math.round((gross * 0.0047) / 10) * 10;
    const employmentEmp = Math.round((gross * 0.009) / 10) * 10;
    const taxEmp = getIncomeTax(gross);
    const localTaxEmp = Math.round(taxEmp * 0.1);

    const pensionComp = pensionEmp;
    const healthComp = healthEmp;
    const ltcComp = ltcEmp;
    const employmentComp = Math.floor((employmentEmp / 0.009) * 0.0115 / 10) * 10;
    const insuranceCompTotal = pensionComp + healthComp + ltcComp + employmentComp;

    const isSeverance = severanceCheck ? severanceCheck.checked : true;
    const severancePay = isSeverance ? Math.round((gross / 12) / 10) * 10 : 0;
    const employerCost = gross + insuranceCompTotal + severancePay;
    const addBurdenRatio = ((employerCost - net) / net * 100).toFixed(1);

    // UI 바인딩 (3개 슬라이더 인터랙션 추가)
    const dGrossValEl = document.getElementById('d-net-gross-val');
    const dGrossSliderEl = document.getElementById('d-net-gross-slider');
    const dTotalValEl = document.getElementById('d-net-total-val');
    const dTotalSliderEl = document.getElementById('d-net-total-slider');
    
    if (dGrossValEl) dGrossValEl.innerText = (gross / 10000).toLocaleString(undefined, {maximumFractionDigits: 1}) + '만 원 (' + gross.toLocaleString() + '원)';
    if (dGrossSliderEl) dGrossSliderEl.value = Math.round(gross / 10000);
    if (dTotalValEl) dTotalValEl.innerText = (employerCost / 10000).toLocaleString(undefined, {maximumFractionDigits: 1}) + '만 원 (' + employerCost.toLocaleString() + '원)';
    if (dTotalSliderEl) dTotalSliderEl.value = Math.round(employerCost / 10000);

    document.getElementById('d-net-gross-result').innerText = gross.toLocaleString() + ' 원';
    document.getElementById('d-net-employer-total').innerText = employerCost.toLocaleString() + ' 원';
    document.getElementById('d-net-burden-ratio').innerText = addBurdenRatio + '%';

    // 상세 분석 바인딩
    document.getElementById('d-net-pension-employee').innerText = pensionEmp.toLocaleString() + ' 원';
    document.getElementById('d-net-pension-employer').innerText = pensionComp.toLocaleString() + ' 원';
    document.getElementById('d-net-health-employee').innerText = healthEmp.toLocaleString() + ' 원';
    document.getElementById('d-net-health-employer').innerText = healthComp.toLocaleString() + ' 원';
    document.getElementById('d-net-ltc-employee').innerText = ltcEmp.toLocaleString() + ' 원';
    document.getElementById('d-net-ltc-employer').innerText = ltcComp.toLocaleString() + ' 원';
    document.getElementById('d-net-employment-employee').innerText = employmentEmp.toLocaleString() + ' 원';
    document.getElementById('d-net-employment-employer').innerText = employmentComp.toLocaleString() + ' 원';
    document.getElementById('d-net-tax-employee').innerText = taxEmp.toLocaleString() + ' 원';
    document.getElementById('d-net-localtax-employee').innerText = localTaxEmp.toLocaleString() + ' 원';
    document.getElementById('d-net-severance').innerText = severancePay.toLocaleString() + ' 원';

    // Breakdown panel height update if active
    const panel = document.getElementById('d-net-breakdown-panel');
    if (panel && panel.style.maxHeight) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
    }
}

function toggleNetBreakdown() {
    const panel = document.getElementById('net-breakdown-panel');
    const arrow = document.getElementById('net-breakdown-arrow');
    if (!panel) return;
    
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        arrow.style.transform = 'rotate(0deg)';
    } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        arrow.style.transform = 'rotate(180deg)';
    }
}

function toggleDrawerNetBreakdown() {
    const panel = document.getElementById('d-net-breakdown-panel');
    const arrow = document.getElementById('d-net-breakdown-arrow');
    if (!panel) return;
    
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        arrow.style.transform = 'rotate(0deg)';
    } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        arrow.style.transform = 'rotate(180deg)';
    }
}

// ==========================================
// 실시간 계산기 값 동기화 및 퀵 조절 헬퍼 함수
// ==========================================

// 메인 부가세 계산기
function syncVATSalesFromSlider(val) {
    const input = document.getElementById('vat-sales-input');
    if (input) input.value = val;
    calculateVAT();
}
function syncVATSalesFromInput(val) {
    const slider = document.getElementById('vat-sales');
    let numVal = parseInt(val) || 0;
    if (numVal < 100) numVal = 100;
    if (numVal > 30000) numVal = 30000;
    if (slider) slider.value = numVal;
    calculateVAT();
}
function adjustVATSales(amount) {
    const slider = document.getElementById('vat-sales');
    if (slider) {
        let current = parseInt(slider.value) || 5000;
        let next = current + amount;
        if (next < 100) next = 100;
        if (next > 30000) next = 30000;
        slider.value = next;
        syncVATSalesFromSlider(next);
    }
}

function syncVATPurchasesFromSlider(val) {
    const input = document.getElementById('vat-purchases-input');
    if (input) input.value = val;
    calculateVAT();
}
function syncVATPurchasesFromInput(val) {
    const slider = document.getElementById('vat-purchases');
    let numVal = parseInt(val) || 0;
    if (numVal < 0) numVal = 0;
    if (numVal > 30000) numVal = 30000;
    if (slider) slider.value = numVal;
    calculateVAT();
}
function adjustVATPurchases(amount) {
    const slider = document.getElementById('vat-purchases');
    if (slider) {
        let current = parseInt(slider.value) || 3000;
        let next = current + amount;
        if (next < 0) next = 0;
        if (next > 30000) next = 30000;
        slider.value = next;
        syncVATPurchasesFromSlider(next);
    }
}

function syncVATRatioFromSlider(val) {
    const input = document.getElementById('vat-taxable-ratio-input');
    if (input) input.value = val;
    calculateVAT();
}
function syncVATRatioFromInput(val) {
    const slider = document.getElementById('vat-taxable-ratio');
    let numVal = parseInt(val) || 0;
    if (numVal < 0) numVal = 0;
    if (numVal > 100) numVal = 100;
    if (slider) slider.value = numVal;
    calculateVAT();
}
function adjustVATRatio(amount) {
    const slider = document.getElementById('vat-taxable-ratio');
    if (slider) {
        let current = parseInt(slider.value) || 50;
        let next = current + amount;
        if (next < 0) next = 0;
        if (next > 100) next = 100;
        slider.value = next;
        syncVATRatioFromSlider(next);
    }
}

// 메인 법인전환 계산기
function syncCorpIncomeFromSlider(val) {
    const input = document.getElementById('corp-income-input');
    if (input) input.value = val;
    calculateCorpSavings();
}
function syncCorpIncomeFromInput(val) {
    const slider = document.getElementById('corp-income');
    let numVal = parseInt(val) || 0;
    if (numVal < 1000) numVal = 1000;
    if (numVal > 50000) numVal = 50000;
    if (slider) slider.value = numVal;
    calculateCorpSavings();
}
function adjustCorpIncome(amount) {
    const slider = document.getElementById('corp-income');
    if (slider) {
        let current = parseInt(slider.value) || 8000;
        let next = current + amount;
        if (next < 1000) next = 1000;
        if (next > 50000) next = 50000;
        slider.value = next;
        syncCorpIncomeFromSlider(next);
    }
}

// 메인 네트제 계산기
function syncNetSalaryFromSlider(val) {
    const input = document.getElementById('net-salary-input');
    if (input) input.value = val;
    calculateNetSalaryBurden();
}
function syncNetSalaryFromInput(val) {
    const slider = document.getElementById('net-salary');
    let numVal = parseInt(val) || 0;
    if (numVal < 100) numVal = 100;
    if (numVal > 2600) numVal = 2600;
    if (slider) slider.value = numVal;
    calculateNetSalaryBurden();
}
function adjustNetSalary(amount) {
    const slider = document.getElementById('net-salary');
    if (slider) {
        let current = parseInt(slider.value) || 1000;
        let next = current + amount;
        if (next < 100) next = 100;
        if (next > 2600) next = 2600;
        slider.value = next;
        syncNetSalaryFromSlider(next);
    }
}

// 우측 드로어 네트제 계산기
function syncDrawerNetSalaryFromSlider(val) {
    const input = document.getElementById('d-net-salary-input');
    if (input) input.value = val;
    calculateDrawerNetSalaryBurden();
}
function syncDrawerNetSalaryFromInput(val) {
    const slider = document.getElementById('d-net-salary');
    let numVal = parseInt(val) || 0;
    if (numVal < 100) numVal = 100;
    if (numVal > 2600) numVal = 2600;
    if (slider) slider.value = numVal;
    calculateDrawerNetSalaryBurden();
}
function adjustDrawerNetSalary(amount) {
    const slider = document.getElementById('d-net-salary');
    if (slider) {
        let current = parseInt(slider.value) || 1000;
        let next = current + amount;
        if (next < 100) next = 100;
        if (next > 2600) next = 2600;
        slider.value = next;
        syncDrawerNetSalaryFromSlider(next);
    }
}

// 우측 드로어 부가세 계산기
function syncDrawerVATSalesFromSlider(val) {
    const input = document.getElementById('d-vat-sales-input');
    if (input) input.value = val;
    calculateDrawerVAT();
}
function syncDrawerVATSalesFromInput(val) {
    const slider = document.getElementById('d-vat-sales');
    let numVal = parseInt(val) || 0;
    if (numVal < 100) numVal = 100;
    if (numVal > 30000) numVal = 30000;
    if (slider) slider.value = numVal;
    calculateDrawerVAT();
}
function adjustDrawerVATSales(amount) {
    const slider = document.getElementById('d-vat-sales');
    if (slider) {
        let current = parseInt(slider.value) || 5000;
        let next = current + amount;
        if (next < 100) next = 100;
        if (next > 30000) next = 30000;
        slider.value = next;
        syncDrawerVATSalesFromSlider(next);
    }
}

function syncDrawerVATPurchasesFromSlider(val) {
    const input = document.getElementById('d-vat-purchases-input');
    if (input) input.value = val;
    calculateDrawerVAT();
}
function syncDrawerVATPurchasesFromInput(val) {
    const slider = document.getElementById('d-vat-purchases');
    let numVal = parseInt(val) || 0;
    if (numVal < 0) numVal = 0;
    if (numVal > 30000) numVal = 30000;
    if (slider) slider.value = numVal;
    calculateDrawerVAT();
}
function adjustDrawerVATPurchases(amount) {
    const slider = document.getElementById('d-vat-purchases');
    if (slider) {
        let current = parseInt(slider.value) || 3000;
        let next = current + amount;
        if (next < 0) next = 0;
        if (next > 30000) next = 30000;
        slider.value = next;
        syncDrawerVATPurchasesFromSlider(next);
    }
}

function syncDrawerVATRatioFromSlider(val) {
    const input = document.getElementById('d-vat-taxable-ratio-input');
    if (input) input.value = val;
    calculateDrawerVAT();
}
function syncDrawerVATRatioFromInput(val) {
    const slider = document.getElementById('d-vat-taxable-ratio');
    let numVal = parseInt(val) || 0;
    if (numVal < 0) numVal = 0;
    if (numVal > 100) numVal = 100;
    if (slider) slider.value = numVal;
    calculateDrawerVAT();
}
function adjustDrawerVATRatio(amount) {
    const slider = document.getElementById('d-vat-taxable-ratio');
    if (slider) {
        let current = parseInt(slider.value) || 50;
        let next = current + amount;
        if (next < 0) next = 0;
        if (next > 100) next = 100;
        slider.value = next;
        syncDrawerVATRatioFromSlider(next);
    }
}

// 우측 드로어 법인전환 계산기
function syncDrawerCorpIncomeFromSlider(val) {
    const input = document.getElementById('d-corp-income-input');
    if (input) input.value = val;
    calculateDrawerCorpSavings();
}
function syncDrawerCorpIncomeFromInput(val) {
    const slider = document.getElementById('d-corp-income');
    let numVal = parseInt(val) || 0;
    if (numVal < 1000) numVal = 1000;
    if (numVal > 100000) numVal = 100000;
    if (slider) slider.value = numVal;
    calculateDrawerCorpSavings();
}
function adjustDrawerCorpIncome(amount) {
    const slider = document.getElementById('d-corp-income');
    if (slider) {
        let current = parseInt(slider.value) || 12000;
        let next = current + amount;
        if (next < 1000) next = 1000;
        if (next > 100000) next = 100000;
        slider.value = next;
        syncDrawerCorpIncomeFromSlider(next);
    }
}

