# 테너시티즈 예시 사이트 배포 가이드

이 저장소는 `examples/` 폴더에 있는 Notion Export 기반 멀티페이지 HTML을 **원본 구조 그대로 유지**하면서,
디자인은 런타임 CSS로 적용하도록 구성되어 있습니다.

- 엔트리 페이지(홈): `examples/home.html`
- 멀티페이지 서버 실행 파일: `serve_examples.py`
- 디자인 테마: `examples/premium-theme.css`
- 콘텐츠 보존 검증: `verify_content_lock.py`
- 최종 QA: `final_qa.py`

---

## 1) 서버 실행 없이 정적으로 브라우저에서 확인하는 방법

> 빠르게 로컬에서 내용만 확인할 때 유용합니다.

### 방법 A: 파일 탐색기에서 바로 열기

1. 프로젝트 폴더에서 `examples/home.html` 파일을 찾습니다.
2. 더블클릭해서 브라우저로 엽니다.

또는 터미널에서:

```bash
# macOS
open examples/home.html

# Linux (환경에 따라 xdg-open)
xdg-open examples/home.html

# Windows PowerShell
start examples/home.html
```

### 정적 열람 방식의 특징/주의점

- 장점
  - 가장 빠르게 확인 가능
  - 별도 서버 프로세스 불필요
- 주의
  - 이 방식은 `serve_examples.py`의 런타임 CSS 주입 로직을 거치지 않습니다.
  - 즉, 원본 HTML 스타일 위주로 보일 수 있으며, 최종 디자인(프리미엄 테마)과 다를 수 있습니다.
  - URL 라우팅(`/examples/home`) 검증도 불가합니다.

---

## 2) 로컬 서버 실행해서 정식 동작으로 확인하는 방법 (권장)

> 실제 배포 동작과 가장 유사한 방식입니다.

### 2-1. 서버 실행

프로젝트 루트에서:

```bash
python serve_examples.py
```

실행 후 아래 URL 접속:

- 홈: `http://127.0.0.1:8000/examples/home`

### 2-2. 확인 포인트

- 홈에서 하위 페이지 링크 이동이 정상인지
- 이미지/자산이 정상 로드되는지
- 디자인 테마가 전체 페이지에 일관 적용되는지
- 모바일/태블릿/데스크톱에서 반응형이 자연스러운지

### 2-3. 서버 종료

- 터미널에서 `Ctrl + C`

---

## 3) 배포 전 필수 검증

아래 두 가지는 배포 전에 반드시 통과시키는 것을 권장합니다.

### 3-1. 콘텐츠/구조 보존 검증

```bash
python verify_content_lock.py
```

검증 항목 예시:
- 엔트리/페이지 집합
- 내부 링크 관계
- 도달 가능성(reachability)
- 잠금 기준 대비 변형 여부

### 3-2. 최종 QA 자동 점검

```bash
python final_qa.py
```

검증 항목 예시:
- 홈 및 하위 페이지 라우트 응답
- 링크/에셋 참조 누락 여부
- 반응형 핵심 규칙 존재 여부

---

## 4) 서버 실행 방식으로 정식 배포하는 방법

아래는 운영 환경에서 가장 단순하고 안전한 배포 흐름입니다.

## 4-1. 서버 준비

- Python 3.10+ 권장
- 배포 경로에 저장소 코드 배치

예:

```bash
git clone <your-repo-url>
cd tenacities
```

### 4-2. 배포 전 검증 실행

```bash
python verify_content_lock.py
python final_qa.py
```

둘 다 성공해야 배포 진행 권장.

### 4-3. 서비스 실행 (직접 실행)

```bash
python serve_examples.py
```

기본 바인딩은 `127.0.0.1:8000` 입니다.
외부 공개가 필요하면 일반적으로 리버스 프록시(Nginx/Caddy) 뒤에서 운영하세요.

---

## 5) 운영 권장: 리버스 프록시 뒤에 붙이기

실서비스에서는 다음 구조를 권장합니다.

- 공개 트래픽: `https://your-domain`
- 프록시 백엔드: `http://127.0.0.1:8000`

이점:
- HTTPS 인증서/도메인 관리 용이
- 보안 헤더/캐시 정책 적용 용이
- 운영 중 롤링/재시작 관리 용이

---

## 6) systemd로 백그라운드 실행 (Linux 운영 권장)

예시: `/etc/systemd/system/tenacities.service`

```ini
[Unit]
Description=Tenacities Example Site
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/tenacities
ExecStart=/usr/bin/python3 /opt/tenacities/serve_examples.py
Restart=always
RestartSec=3
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

적용:

```bash
sudo systemctl daemon-reload
sudo systemctl enable tenacities
sudo systemctl start tenacities
sudo systemctl status tenacities
```

로그 확인:

```bash
journalctl -u tenacities -f
```

---

## 7) 자주 묻는 질문

### Q1. 왜 그냥 `examples/home.html`만 열면 최종 디자인과 다르게 보이나요?
- 최종 디자인은 `serve_examples.py`가 HTML 응답 시 `premium-theme.css`를 주입하는 방식이기 때문입니다.
- 따라서 최종 확인/배포는 서버 경유 방식이 기준입니다.

### Q2. 콘텐츠(문구/구조)가 원본과 달라졌는지 어떻게 확인하나요?
- `python verify_content_lock.py`를 실행하세요.
- 잠금 기준과 다르면 실패(exit code 1)합니다.

### Q3. 반응형/링크/에셋 상태를 한 번에 점검할 수 있나요?
- `python final_qa.py`를 실행하면 됩니다.

---

## 8) 한 줄 요약

- **빠른 확인:** `examples/home.html` 직접 열기
- **정식 확인/배포 기준:** `python serve_examples.py` 실행 후 `http://127.0.0.1:8000/examples/home` 접속
- **배포 전 필수 권장:**
  - `python verify_content_lock.py`
  - `python final_qa.py`
