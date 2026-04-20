# Source Analysis & Content Map (from `examples/`)

## 1) Scope and method
- This document maps source content from `examples/` for a full rebuild.
- It treats exported HTML/CSV/media as reference-only source material.
- It preserves original meaning and content scope while defining a new IA split into:
  - Main page
  - History index page
  - History detail pages
  - Deeper linked detail pages

## 2) Primary source inventory

### Main source page
- `examples/home.html`
  - Contains brand/context narrative, CI entry point, org chart entry point, and timeline links.

### CI and logo-related sources
- `examples/Logo 34611511877d813580ccc2fb0d605e7e.html`
- Related logo/brand image assets referenced in home and logo pages:
  - `examples/Tenacities.png`
  - `examples/Tenacities 1.png`
  - `examples/Tenacities 2.png`
  - `examples/엠블럼.png`
  - `examples/square_logo.png`
  - `examples/Concierge_logo_C2.png`
  - `examples/favicon-removebg-preview.png`

### Organization chart source
- `examples/조직도 34611511877d812cbe61fa873c26cc04.html`
- Embedded org chart image: `examples/image.png`

### Timeline/year-event sources (2022–2024)
- `examples/2022 03 (주)테너시티즈 설립 및 사업개시 34611511877d817abd8cdae59c0d098f.html`
- `examples/2022 05 기술보증기금 2억원 기술심사 승인 34611511877d81cd8865c5a2717f660f.html`
- `examples/2022 08 Social Metaverse Toany 론칭 34611511877d815e8516db42b3b64acd.html`
- `examples/2023 05 NIPA_메타버스초기기업 인프라 지원사업 최종선발 34611511877d811b88dec64c687603ec.html`
- `examples/2023 06 Kpop rhythm game Duet tae-bo 34611511877d812cb5ead719e93355c4.html`
- `examples/2023 12 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭 34611511877d81f2933ff8619fd56214.html`
- `examples/2024 06 단기임대통합관리서비스 Concierge Gangnam 34611511877d816fbc0bc089bfe266b4.html`
- `examples/2024 12 컨시어지+외식업 연매출 13억 달성 34611511877d81b6af11c920806634af.html`

### Linked lower-level detail sources
- From 2022.08 page:
  - `examples/Application Capture 34611511877d817db840d4ed7256bd43.html`
  - `examples/Metaverse Events 34611511877d81269921e3abbd1856d2.html`
  - CSV reference: `examples/Service Info 34611511877d81708e0ad93908025baf.csv`
- From 2023.05 page:
  - `examples/협약서 34611511877d81bda94cca8dbe27775e.html`
  - CSV reference: `examples/협약서 34611511877d81a98bf4e0f511537d84.csv`
- From 2023.06 page:
  - `examples/Application Capture 34611511877d81be941ad7f252705be4.html`
  - `examples/NFT 홍보룸 구축 34611511877d816a9f8bc5a19d39810b.html`
  - CSV reference: `examples/Service Info 34611511877d810bb585e80070a3f7dd.csv`
- From 2023.12 page:
  - `examples/Application Capture 34611511877d81d7bed7c25861ee6715.html`
  - CSV reference: `examples/Service info 34611511877d81c3b0d2f545ae4c8174.csv`

## 3) Extracted information architecture (source-truth)

## A. Main page (Home)
### A1. Brand/context hero block
- Title: “Tenacities (1)”
- Key phrase: “Tena + cities: 의지를 가진 사람들이 만들어갈 Seamless world”
- Founder/company narrative introducing:
  - Establishment timing (2022.03)
  - Motivation to build “one world”
  - Repeated experimentation/failure/growth
  - Metaverse as a decisive keyword
  - Value lens: “修身 齊家 治社 愛天下”

### A2. Context section (“⚖️ 治社”)
- Must be sourced from `home.html` text blocks:
  1) Metaverse misconceptions vs essence
  2) Definition of Seamless world
  3) Tenacities’ Seamless world: core triad = “주거, 식음, 노동”
  4) Tenacities and Seamless world (section heading exists in home)

### A3. CI section
- Section heading: “🎨 CI”
- Entry link to dedicated Logo page.

### A4. Organization section
- Entry link: “🏢조직도” to dedicated org chart page.

### A5. History teaser/index block
- Section heading: “📜 연혁”
- Timeline list linking to year/month detail pages (2022.03 → 2024.12).

## B. CI / Logo page
### B1. Core color identity
- Crimson Red / 진홍색
- Meaning: passion + long-term will; color code #E71D36.

### B2. Emblem concept set (01–05)
1. TENACITIES letter abstraction
2. From seed to fruit, tied to “修身 齊家 治社 愛天下” worldview
3. Steady flame metaphor (persistence over short-term speed)
4. Clasped hands (ecosystemic mutual growth among customers/staff)
5. Additional concepts:
   - Symmetric butterfly wing (go farther, not merely faster)
   - Pyramid/funnel duality (more authority, more responsibility)

### B3. Logo assets for presentation
- Primary logo artwork from `Tenacities 1.png` and related brand images.

## C. Organization chart page
### C1. Page content
- Title: “조직도”
- Primary artifact: org chart image `image.png`.

## D. History index page (separate in redesigned IA)
- Canonical event list from home timeline:
  1. 2022.03. (주)테너시티즈 설립 및 사업개시
  2. 2022.05. 기술보증기금 2억원 기술심사 승인
  3. 2022.08. Social Metaverse Toany 론칭
  4. 2023.05. NIPA_메타버스초기기업 인프라 지원사업 최종선발
  5. 2023.06. Kpop rhythm game Duet tae-bo
  6. 2023.12. 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭
  7. 2024.06. 단기임대통합관리서비스 Concierge Gangnam
  8. 2024.12. 컨시어지+외식업 연매출 13억 달성

## E. History detail pages (one per event)

### E1. 2022.03 설립/사업개시
- Title + representative image(s): includes `image 1.png`.

### E2. 2022.05 기술보증기금 심사 승인
- Title-based milestone page (minimal additional text in source).

### E3. 2022.08 Social Metaverse Toany 론칭
- Contains “Service Info” table/list with points:
  - F&B delivery integration inside metaverse
  - NFT good provision via “땡겨요” order flow
  - Investor/pre-registered users/media/streamer attendance notes
  - 40억 Value investment negotiation mention
  - Multiple metaverse event participation counts
  - Product-learning conclusion about active-user/content loop
- Outbound links:
  - investnews article URL
  - YouTube channel URL
- Internal linked subpages:
  - Application Capture
  - Metaverse Events

### E4. 2023.05 NIPA 인프라 지원사업 최종선발
- Main title milestone.
- Linked subpage: 협약서.

### E5. 2023.06 Kpop rhythm game Duet tae-bo
- “Service Info” points include:
  - VR appstore ecosystem misunderstanding and optimization failure
  - Release abandonment due to prolonged schedule/resource constraints
- Linked subpages:
  - Application Capture
  - NFT 홍보룸 구축
- Outbound link:
  - YouTube video URL

### E6. 2023.12 나래하우스 외주개발/런칭
- Main title milestone.
- Linked subpage: Application Capture.

### E7. 2024.06 Concierge Gangnam
- Main title milestone with concierge logo image.

### E8. 2024.12 컨시어지+외식업 연매출 13억 달성
- Main title milestone with supporting images `image 2.png`, `image 3.png`.

## F. Deeper linked detail pages (history children)

### F1. Application Capture pages (multiple)
- `Application Capture ...bd43.html` (for 2022.08): image set `image 9.png`~`image 18.png`
- `Application Capture ...be4.html` (for 2023.06): `image 27.png`~`image 29.png`
- `Application Capture ...6715.html` (for 2023.12): `image 30.png`~`image 33.png`

### F2. Metaverse Events page (child of 2022.08)
- Image set `image 4.png`~`image 8.png`.

### F3. NFT 홍보룸 구축 page (child of 2023.06)
- Image set `image 19.png`~`image 26.png`.

### F4. 협약서 page (child of 2023.05)
- Agreement image document set:
  - `D0210-23-1002협약서-images-0.jpg`~`...-4.jpg`

## 4) Recommended rebuilt sitemap (content-preserving redesign)

- `/` (Main)
  - Brand/context narrative (from `home.html`)
  - “⚖️ 治社” context block (all subsections from `home.html`)
  - CI intro + CTA to `/ci`
  - Org chart preview + CTA to `/organization`
  - History preview (chronological cards) + CTA to `/history`

- `/ci`
  - Color identity
  - Emblem 01–05 narrative
  - Logo asset gallery

- `/organization`
  - Organization title and full org chart media

- `/history`
  - 2022–2024 timeline index (all 8 milestones)

- `/history/2022-03`
- `/history/2022-05`
- `/history/2022-08`
  - children:
    - `/history/2022-08/application-capture`
    - `/history/2022-08/metaverse-events`
- `/history/2023-05`
  - child:
    - `/history/2023-05/agreement`
- `/history/2023-06`
  - children:
    - `/history/2023-06/application-capture`
    - `/history/2023-06/nft-promo-room`
- `/history/2023-12`
  - child:
    - `/history/2023-12/application-capture`
- `/history/2024-06`
- `/history/2024-12`

## 5) Content-preservation constraints for implementation
- Keep the source meaning and event scope intact.
- Keep chronology and parent/child page relationships intact.
- Preserve external references (investnews and YouTube links) where they appeared.
- Preserve media sets per detail page instead of flattening all images into one page.
- Keep context section text grounded specifically in `examples/home.html`.
