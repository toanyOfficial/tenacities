# Tenacities 웹사이트 로컬 실행 가이드

이 저장소는 `examples/`를 **참고 소스**로 사용해 재구성한 정적 멀티페이지 사이트입니다.

- 메인 페이지: `index.html`
- CI 페이지: `ci/index.html`
- 히스토리 인덱스: `history/index.html`
- 히스토리 상세/하위 페이지: `history/**`
- 전역 스타일: `styles/site.css`
- 전역 내비게이션 스크립트: `scripts/navigation.js`

---

## 1) 가장 간단한 실행 방법 (권장)

프로젝트 루트에서 아래 명령으로 정적 서버를 실행하세요.

```bash
python -m http.server 8000
```

실행 후 브라우저 접속:

- 홈: http://127.0.0.1:8000/index.html
- CI: http://127.0.0.1:8000/ci/index.html
- History: http://127.0.0.1:8000/history/index.html

서버 종료: `Ctrl + C`

---

## 2) 다른 포트로 실행

```bash
python -m http.server 5173
```

예: http://127.0.0.1:5173/index.html

---

## 3) 빠른 점검 체크리스트

- 홈 5개 섹션(Hero/Background/Brand Philosophy/CI/History)이 순서대로 보이는지
- 스크롤 진행 바가 동작하는지
- 헤더 내 섹션 링크 활성 상태가 스크롤 위치에 따라 바뀌는지
- History 인덱스 타임라인 항목 클릭 시 상세 페이지로 이동되는지
- 상세 페이지에서 이미지/외부 링크가 정상 동작하는지

---

## 4) 참고: `examples/` 폴더의 역할

`examples/`는 최종 UI가 아니라 **원본 콘텐츠/미디어 참조용**입니다.

- 직접 배포 대상: `index.html`, `ci/`, `history/`, `styles/`, `scripts/`
- 원본 참조 자산: `examples/*`

---

## 5) (선택) 링크/자산 무결성 점검 스크립트

아래 명령은 로컬 파일 기준으로 내부 링크/이미지 참조가 깨지지 않았는지 빠르게 확인할 때 사용할 수 있습니다.

```bash
python - <<'PY'
from pathlib import Path
import re
files=[Path('index.html'),*Path('ci').glob('**/*.html'),*Path('history').glob('**/*.html')]
href_err=[];src_err=[]
for f in files:
    t=f.read_text(encoding='utf-8')
    for h in re.findall(r'href="([^"]+)"',t):
        if h.startswith(('http://','https://','mailto:')): continue
        p=h.split('#')[0]
        if p and not (f.parent/p).exists(): href_err.append((str(f),h))
    for s in re.findall(r'src="([^"]+)"',t):
        if s.startswith(('http://','https://','data:')): continue
        if not (f.parent/s).exists(): src_err.append((str(f),s))
print('href errors:', len(href_err))
print('src errors:', len(src_err))
PY
```
