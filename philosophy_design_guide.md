# Brand Philosophy 배경 곡선 디자인 가이드 (SVG 재구성용 명세)

## 0) 문서 목적 / 범위
이 문서는 현재 랜딩페이지 `#philosophy` 섹션의 **배경 곡선 디자인을 SVG로 재구성하기 위한 실무 명세서**다. 구현 변경이 아니라 분석 문서이며, 대상은 배경 곡선(구조 레이어)만이다.

- 분석 기준 CSS: `styles/site.css` (현재 적용)
- 참고 CSS: `styles/site_previous.css` (`philosophy-layer-signal` 등 과거 요소 비교용)
- 비분석 대상: 텍스트 콘텐츠, 페이드인 로직, 다른 섹션

---

## 1) 곡선 인상을 만드는 CSS 요소 식별

### 1-1. 관련 selector 목록 (핵심)
- 컨테이너/레이어
  - `#philosophy`
  - `#philosophy .philosophy-decor`
  - `#philosophy .philosophy-layer`
  - `#philosophy .philosophy-layer-base`
  - `#philosophy .philosophy-layer-structure`
  - `#philosophy .philosophy-layer-accent`
- 움직임/동기
  - `@keyframes philosophyGridDrift`
  - `@keyframes philosophyArcFlow`
  - `@keyframes philosophyAccentShift`

### 1-2. 각 레이어 역할
1. `philosophy-layer-structure` (**메인 곡선 레이어**)
   - 3개의 `radial-gradient(...)`가 실제 arc band를 만든다.
   - 시각적으로 “브랜드철학 곡선 배경”의 핵심 구조는 여기서 결정된다.

2. `philosophy-layer-base` (보조 격자 레이어)
   - 수평/수직 1px grid.
   - 곡선을 직접 만들지는 않지만 “구조적 질감(technical editorial tone)”을 제공한다.

3. `philosophy-layer-accent` (보조 선형 하이라이트)
   - 얇은 사선/수평 accent를 더해 리듬을 만든다.
   - 메인 arc를 방해하지 않는 정도로 낮은 opacity.

4. `philosophy-overlay`/`philosophy-motion-guide`
   - 현재는 광원 이동용 오버레이. 곡선의 본체는 아님.

### 1-3. 혼잡 요소 / 제거 후보
- 과거 `site_previous.css`의 `philosophy-layer-signal`은 강한 직선형 흐름(선형 gradient + background-position 애니메이션)이라 메인 arc 인상을 흐릴 수 있음.
- 현재 `site.css`에는 signal 레이어가 제거되어 구조적 arc 읽기가 더 명확함.

---

## 2) 전체 시각 구조(컴포지션) 해석

### 2-1. 화면 내 배치
메인 곡선은 총 3개(모두 structure 레이어의 radial band):

- **Arc A (가장 지배적):** 우상단 중심 대형 타원환의 일부
- **Arc B (두 번째):** 좌하단 중심 대형 타원환의 일부
- **Arc C (세 번째):** 우중하단 중심 타원환의 일부

즉, 중심점이 서로 다른 3개 타원환이 화면 내부에서 “부분 노출”되며, 좌↔우/상↔하 균형을 만든다.

### 2-2. 리듬/균형
- A가 상단-우측 장력을 형성
- B가 하단-좌측 반대 장력을 형성
- C가 우측 중하단을 보강해 시선이 한쪽으로 쏠리지 않게 함
- base grid + accent가 arc 사이의 빈 공간을 채워 “구조적이지만 과밀하지 않은” 인상을 만듦

### 2-3. 왜 우아하게 보이는가 (구조적 원인)
- 곡선 자체는 얇고 절제된 band(0.5~0.7% 폭)
- 불투명도가 낮고(레이어/밴드 모두 0.075~0.11대), 미세 blur(0.15px)로 가장자리 경계가 부드러움
- 레이어 전체가 매우 작은 범위로 부유(`philosophyArcFlow`)하여 정적인 직선 느낌을 피함

---

## 3) 곡선별 기하학 명세 (SVG 재구성 직결)

> 표기 기준: 섹션 크기를 `(W, H)`라 둔다.
> 현재 기본 데스크톱에서 `.philosophy-layer`는 `inset: -6% -4%`이므로,
> - layer 크기: `Wl = 1.08W`, `Hl = 1.12H`
> - layer 원점: `xl = -0.04W`, `yl = -0.06H`

`philosophy-layer-structure`의 3개 radial-gradient를 각각 Arc A/B/C로 정의한다.

---

### Arc A (우상단 메인)
- CSS 원문
  - `radial-gradient(120% 130% at 90% 8%, transparent 0 53%, color 53.4% 54.1%, transparent 54.7%)`
- 중심(데스크톱 기준)
  - `cx = xl + 0.90*Wl = 0.932W`
  - `cy = yl + 0.08*Hl = 0.0296H`
- 타원 반경(중심선 반경)
  - 중심선 반경 계수 `r = (53.4 + 54.1)/2 = 53.75%`
  - `rx = Wl*(120%/2)*0.5375 ≈ 0.348W`
  - `ry = Hl*(130%/2)*0.5375 ≈ 0.391H`
- 밴드 두께
  - ring 폭: `54.1 - 53.4 = 0.7%` (3개 중 가장 큼)
- 시각 방향
  - 화면 우상단 바깥 중심에서 시작된 큰 환의 일부가 화면 안으로 들어오는 형태
  - 곡률은 완만하고 대형 sweep 느낌

### Arc B (좌하단 보조-메인)
- CSS 원문
  - `radial-gradient(110% 120% at 14% 82%, transparent 0 49%, color 49.2% 49.8%, transparent 50.3%)`
- 중심(데스크톱 기준)
  - `cx = xl + 0.14*Wl = 0.1112W`
  - `cy = yl + 0.82*Hl = 0.8584H`
- 타원 반경(중심선 반경)
  - `r = (49.2 + 49.8)/2 = 49.5%`
  - `rx ≈ Wl*(110%/2)*0.495 ≈ 0.294W`
  - `ry ≈ Hl*(120%/2)*0.495 ≈ 0.333H`
- 밴드 두께
  - ring 폭: `0.6%`
- 시각 방향
  - 좌하단 중심의 타원환 일부가 중간 영역으로 올라오는 흐름
  - Arc A와 대각 균형을 이룸

### Arc C (우중하단 보강)
- CSS 원문
  - `radial-gradient(90% 95% at 82% 72%, transparent 0 60%, color 60.4% 60.9%, transparent 61.4%)`
- 중심(데스크톱 기준)
  - `cx = xl + 0.82*Wl = 0.8456W`
  - `cy = yl + 0.72*Hl = 0.7464H`
- 타원 반경(중심선 반경)
  - `r = (60.4 + 60.9)/2 = 60.65%`
  - `rx ≈ Wl*(90%/2)*0.6065 ≈ 0.295W`
  - `ry ≈ Hl*(95%/2)*0.6065 ≈ 0.322H`
- 밴드 두께
  - ring 폭: `0.5%` (3개 중 가장 얇음)
- 시각 방향
  - 우측 중하단에서 상향/내향 곡률로 보강되는 느낌

---

## 4) 레이어 조합 방식 (무엇이 형상을 만들고 무엇이 보조인지)

### 4-1. 곡선 형상 기여도
- 직접 형상 생성: `philosophy-layer-structure` (100% 핵심)
- 분위기/질감 보조: `philosophy-layer-base`, `philosophy-layer-accent`
- 곡선 형상과 무관/제거 후보: 과거 `philosophy-layer-signal`

### 4-2. 실제 인상은 단일 레이어가 아닌 “겹침 결과”
- 곡선 자체는 structure에서 만들어지지만,
- base의 grid가 대비 기준을 제공해 arc를 더 선명하게 읽게 하고,
- accent의 희미한 사선/수평선이 arc 흐름을 끊지 않으면서 시선 이동을 돕는다.

### 4-3. SVG 재구성 시 유지/단순화 우선순위
- 반드시 유지: structure 3개 arc band의 중심/두께/opacity 관계
- 유지 권장: 미세 blur 인상(극저강도)
- 단순화 가능: base grid 밀도, accent 선 수량(단, 톤은 유지)
- 제거 권장: signal 계열 직선 주행 효과

---

## 5) Thickness hierarchy (육안 기준 상위 3개)

### 상위 3개 곡선 지정
1. **1위 Arc A**
   - 이유: band 폭 0.7%(최대), alpha 0.11(최대), 큰 스케일(120/130)
2. **2위 Arc B**
   - 이유: band 폭 0.6%, alpha 0.09, 충분한 반경으로 가시성이 높음
3. **3위 Arc C**
   - 이유: band 폭 0.5%, alpha 0.075로 가장 얇고 은은하나, 우측 보강 리듬에서 중요

### “두께”를 결정하는 실제 요인
- band 폭(%), 컬러 alpha, 레이어 전체 opacity(.42), 미세 blur(0.15px), 배경 대비(base/accent)의 합성 결과

### SVG 구현 우선 복원 순서
- 1순위 Arc A → 2순위 Arc B → 3순위 Arc C

---

## 6) Responsive behavior 분석

### 6-1. 브레이크포인트별 변화

#### Desktop (기본)
- `.philosophy-layer`: `inset: -6% -4%`
- base grid: `136px`
- structure opacity: `.42`

#### Tablet (`max-width: 1024px`)
- `.philosophy-layer`: `inset: -5% -7%`
  - 수평 확장 증가(좌우 -7%) → arc가 좌우로 더 들어옴
- base grid: `118px`로 조밀화
- structure opacity: `.37`로 감소

#### Mobile (`max-width: 767px`)
- `.philosophy-layer`: `inset: -3% -11%`
  - 좌우 확장 크게 증가, 상하 확장은 완화
- base grid: `92px`로 더 조밀
- structure opacity: `.31`로 추가 감소

### 6-2. 인상 변화의 핵심
- 단순 스케일 다운이 아니라 **레이어 영역 확장 비율이 축마다 다르게 바뀜**
- 특히 모바일에서 좌우 확장이 커져, 같은 중심점 %라도 화면 내 arc 노출 구간이 달라짐

### 6-3. SVG 반응형 제안(중요)
- 고정 path 금지
- 아래 값은 비율 기반으로 계산
  - section 크기 `(W,H)`
  - layer inset(브레이크포인트별)
  - 각 arc의 `(cx%, cy%, sizeX%, sizeY%, ringStart, ringEnd)`
- 즉, **center/radius는 항상 “확장된 layer 좌표계” 기준으로 계산 후 section 좌표로 투영**해야 일치한다.

---

## 7) SVG 재구성 제안 (직접 구현 지침)

## 7-1. 권장 렌더링 방식
### 방식 A (가장 근접)
- 각 arc를 **타원 중심선 1개 + stroke**로 구현
- stroke 스타일
  - Arc A/B/C 두께 비율: `0.7 : 0.6 : 0.5`
  - 색상 alpha: `0.11 / 0.09 / 0.075`
  - blur: 매우 약하게(`feGaussianBlur` 0.15px 전후, 과하면 번짐)
- 보여줄 구간은 clip 또는 path trim으로 section 내부 주요 fragment만 노출

### 방식 B (CSS 재현형)
- SVG `<radialGradient>` + mask를 이용해 ring band를 직접 합성
- CSS의 “투명-밴드-투명” 스탑 구조를 그대로 재현 가능

실무 난이도/유지보수 관점에서는 **방식 A(ellipse/path + stroke)**를 권장.

## 7-2. 반드시 재현할 요소
1. Arc A/B/C의 상대 중심 위치
2. Arc A > B > C 두께/강도 계층
3. 미세한 soft edge(과한 glow 금지)
4. 섹션 반응형 시 노출 구간 변화

## 7-3. 단순화 가능한 요소
- base grid의 정확한 픽셀 크기(136/118/92)는 비슷한 밀도로 근사 가능
- accent 라인 개수/각도는 일부 축소 가능(곡선 읽기 방해 없도록)

## 7-4. 향후 광원(path) 기준선 제안
광원 기준 path는 아래 3개 중심선으로 고정:
- `guide-arc-a`: Arc A 중심선
- `guide-arc-b`: Arc B 중심선
- `guide-arc-c`: Arc C 중심선

광원은 이 3개 외 보조선/accent에는 배치하지 않는 것이 시각적 명료성에 유리.

---

## 8) 구현 체크리스트 (다음 단계용)
- [ ] Arc A/B/C 중심점이 layer-inset 반영 좌표계에서 계산되는가?
- [ ] 두께 계층(A>B>C)이 육안으로 재현되는가?
- [ ] blur가 “경계 완화” 수준에 머무는가?
- [ ] 모바일/태블릿/데스크톱에서 노출 구간이 CSS와 유사한가?
- [ ] 광원 path가 3개 중심선과 오차 없이 일치하는가?

---

## 9) 참고 코드 위치
- 현재 구조/레이어: `styles/site.css`의 `#philosophy` 블록
- 반응형 변화: `styles/site.css`의 `@media (max-width:1024px)`, `@media (max-width:767px)` 내 philosophy layer 설정
- 과거 signal 비교: `styles/site_previous.css`의 `#philosophy .philosophy-layer-signal`
