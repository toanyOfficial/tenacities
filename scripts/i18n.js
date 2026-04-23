(function (global) {
  const STORAGE_KEY = 'siteLanguage';
  const DEFAULT_LANGUAGE = 'ko';
  const SUPPORTED_LANGUAGES = ['ko', 'ja', 'en', 'zh'];
  const LANGUAGE_META = {
    ko: { label: '한국어', flagAsset: 'ko.svg' },
    ja: { label: '日本語', flagAsset: 'ja.svg' },
    en: { label: 'English', flagAsset: 'en.svg' },
    zh: { label: '中文', flagAsset: 'zh-CN.svg' }
  };
  const SWITCHER_ROOT_ID = 'language-switcher';
  const EMBEDDED_LOCALES = {"ko":{"common":{"language":{"ko":"한국어","ja":"日本語","en":"English","zh":"简体中文"},"backToMain":"메인으로 돌아가기"},"index":{"nav":{"hero":"Hero","background":"Background","philosophy":"Philosophy","ci":"CI","history":"History"},"hero":{"companyName":"(주)테너시티즈","logoAlt":"Tenacities 로고","concept1Title":"💡 Tenacity + ies","concept1Body":": 의지를 가진 사람들","concept2Title":"💡 Tena + cities","concept2Body":": 의지를 가진 사람들이 만들어갈 Seamless world"},"background":{"p1":"저희 Tenacities는 22년 03월, Metaverse를 목표로 설립된 회사입니다.","p2":"저는 어렸을 때 부터 하나의 ‘세상’을 만들고 싶었습니다. 사업체, 즉 회사도 ‘하나의 세상’이기 때문에 자연스럽게 창업의 길을 걷게 되었던 것 같습니다.","p3":"다양한 시도와 실패, 경험과 성장을 반복하던 중 ‘메타버스’라는 키워드가 찾아왔습니다. 메타버스에 대해 자세히 알지 못했지만 운명적인 키워드로 다가왔습니다. 메타버스는 그 자체로 ‘하나의 세상’이기 때문입니다.","p4":"고리타분한 격언이지만 저는 ‘수신제가치국평천하’라는 렌즈를 통해 세상을 바라봅니다.","p5":"나 자신이 하나의 세상이듯 내 가정도 하나의 세상이고 더 나아가 회사도 하나의 세상이기 때문입니다.","p6":"하지만 저는 다스릴 나라도 없고 천하를 평정할 생각 역시 없기 때문에","p7":"제 식대로 조금은 변형한, ‘修身 齊家 治社 愛天下’라는 가치관을 바탕으로 제 인식과 외연을 확장해나갑니다."},"philosophy":{"sectionTitle":"Philosophy","note":"※ 저희 Tenacities는 Metaverse를 목표로 하지만 학계에서 논의되는 Metaverse와는 견해가 많이 다를 수 있습니다.","topic1":{"title":"1️⃣ Metaverse에 대한 오해와 본질","p1":"많은 사람들이 Metaverse, 3D World, 가상현실을 혼동하곤 합니다. 저희 Tenacities 역시 시작은 그러하였습니다.","p2":"하지만 탐구를 거듭한 결과 저희는 Seamless world가 Metaverse의 본질이라고 해석하였습니다."},"topic2":{"title":"2️⃣ Seamless world란","p1":"‘나’라는 존재는 언제 어느곳에서든 연속된 상태로, Seamless한 상태로 존재합니다.","p2":"내가 초등학교를 졸업하고 중학교에 입학했을 때, 나는 중학교라는 사회에서의 구성원으로 활동 할 수 없습니다. 해당 학교의 관리시스템에 내 인적사항을 등록하고 학번을 발급받기 전까지는요. 나는 Seamless하지만 World가 Seamless하지 못합니다. 중앙화 된 관리 시스템 때문이지요.","p3":"내가 한국에서 미국으로 넘어갔을 때도 마찬가지입니다. 미국의 관리시스템에 ‘나’라는 사람의 인적정보가 등록되지 않으면 나는 구성원으로서 존재 할 수 없습니다.","p4":"‘Metaverse’와 ‘탈중앙화’가 불가분의 관계인 것은 정치적인 관점이 아니라 Seamless한 생존을 염원하는 인간 본성 관점의 이야기입니다. Coin, NFT, Block chain등이 함께 거론되는 것도 마찬가지이지요."},"topic3":{"title":"3️⃣ Tenacities의 Seamless World","p1":"저희 Tenacities는, Seamless world 구축에 있어 가장 중요한 세가지 본질을 ‘주거, 식음, 노동’으로 규정하였습니다.","p2":"많은 일자리가 AI로 대체되고있는 현재와 미래일지라도 노동의 본질을 영위하고, 그 본질을 영위 할 수 있는 주거와 식음의 Eco system이 갖춰진다면 인간은 삶의 의지를 이어나갈 수 있을 것입니다.","p3":"저희는 전 세계 어디를 가더라도. 심지어 화성으로 인류가 이주하게 되더라도 위 세가지 관점에서의 자급자족이 이루어지는 Seamless world 구축을 목표로 합니다."},"topic4":{"title":"4️⃣ Tenacities와 Seamless World","p1":"저희 Tenacities는 ‘의지를 가진 사람에게 보다 많은 기회가 제공되는 세상’을 염원합니다.","p2":"보다 나은 삶을 가꾸어나갈 의지가 있는 사람들이 모인 집단 Tenacities.","p3":"우리 Tenacities는 의지를 가진 사람들이 자유롭게 삶을 영위하는 Metaverse를 목표로 합니다."}},"ci":{"sectionTitle":"CI","logoSet":"로고 및 컬러셋","orgChart":"조직도","logoSetAria":"로고 및 컬러셋 상세 보기","orgChartAria":"조직도 상세 보기"},"history":{"sectionTitle":"History","entry1":"2022.03. (주)테너시티즈 설립 및 사업개시","entry2":"2022.05. 기술보증기금 2억원 기술심사 승인","entry3":"2022.08. Social Metaverse Toany 론칭","entry4":"2023.05. NIPA_메타버스초기기업 인프라 지원사업 최종선발","entry5":"2023.06. Kpop rhythm game Duet tae-bo","entry6":"2023.12. 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","entry7":"2024.06. 단기임대통합관리서비스 Concierge Gangnam","entry8":"2024.12. 컨시어지+외식업 연매출 13억 달성","archiveCta":"연혁 전체 아카이브 보기 →"},"footer":{"description":"Built from source material in assets/images/, rebuilt as a refined multi-depth brand website."}},"history":{"archive":{"title":"History Archive (2022–2024)","intro":"세로형 타임라인에서 각 연혁 항목을 열람할 수 있습니다. 각 항목은 별도 상세 페이지와 필요 시 하위 자료 페이지로 연결됩니다.","entry1":"<strong>2022.03</strong> (주)테너시티즈 설립 및 사업개시","entry2":"<strong>2022.05</strong> 기술보증기금 2억원 기술심사 승인","entry3":"<strong>2022.08</strong> Social Metaverse Toany 론칭","entry4":"<strong>2023.05</strong> NIPA_메타버스초기기업 인프라 지원사업 최종선발","entry5":"<strong>2023.06</strong> Kpop rhythm game Duet tae-bo","entry6":"<strong>2023.12</strong> 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","entry7":"<strong>2024.06</strong> 단기임대통합관리서비스 Concierge Gangnam","entry8":"<strong>2024.12</strong> 컨시어지+외식업 연매출 13억 달성","button":{"backToMain":"메인으로"}},"detail":{"eyebrow":"History Detail","subpageEyebrow":"History Subpage","backToHistory":"← 연혁보기","backToMain":"메인으로","footer":"Tenacities history archive detail.","page202203":{"title":"2022.03. (주)테너시티즈 설립 및 사업개시"},"page202205":{"title":"2022.05. 기술보증기금 2억원 기술심사 승인"},"page202208":{"title":"2022.08. Social Metaverse Toany 론칭","serviceInfo":"Service Info","item1":"Metaverse 내부에서 F&B 배달을 위한 서비스 연동.","item2":"Toany를 통해 땡겨요 F&B 주문 시 NFT good 제공","item3":"3개 투자사(1 ac, 2 vc)사전신청 유저 10인 트위치 스트리머 1인 인베스트뉴스 기자 1인 참석","item4":"블리스바인 벤처스와 40억 Value 투자협상 진행","item5":"메타버스 버스킹 버스커 4인, 청중 16인 참가","item6":"메타버스 단체 소개팅 남성 4인, 여성 4인 참가","item7":"메타버스 단체 미팅 남녀 4팀 참가(2인 1팀)","item8":"우리집 포트럭 파티 남성 3팀, 남녀 1인 참가(2인 1팀)","item9":"대규모 상시 접속 인원이 보장되지 않으면 즐길 콘텐츠가 없다.","item10":"즐길 콘텐츠가 없으면 상시 접속할 이유가 없다.","linkedSubpages":"Linked Subpages","applicationCapture":"Application Capture","metaverseEvents":"Metaverse Events","externalReferences":"External References"},"page202305":{"title":"2023.05. NIPA_메타버스초기기업 인프라 지원사업 최종선발","agreement":"협약서"},"page202306":{"title":"2023.06. Kpop rhythm game Duet tae-bo","serviceInfo":"Service Info","item1":"VR appstore 생태계 이해 및 VR 최적화에 실패.","item2":"출시는 길어지는데 개발자, 디자이너 등을 유지할 수 없는 관계로 출시 포기","linkedSubpages":"Linked Subpages","applicationCapture":"Application Capture","nftPromoRoom":"NFT 홍보룸 구축","externalReference":"External Reference"},"page202312":{"title":"2023.12. 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","applicationCapture":"Application Capture"},"page202406":{"title":"2024.06. 단기임대통합관리서비스 Concierge Gangnam"},"page202412":{"title":"2024.12. 컨시어지+외식업 연매출 13억 달성"},"page202208Application":{"title":"Application Capture"},"page202208Events":{"title":"Metaverse Events"},"page202305Agreement":{"title":"협약서"},"page202306Application":{"title":"Application Capture"},"page202306Nft":{"title":"NFT 홍보룸 구축"},"page202312Application":{"title":"Application Capture"}}},"ci":{"detail":{"title":"CI — Brand Identity System","logoSystemTitle":"Logo System","primaryColorLabel":"Primary Color","primaryColorName":"Crimson Red · #E71D36","primaryColorDescription":"‘열정’을 상징하되, 단기 집중형 감정이 아닌 장기간에 걸친 ‘의지’를 드러내기 위해 채도를 조정하고 깊이를 더한 색으로 정의됩니다.","brandMarkLabel":"Brand Mark","brandMarkName":"Tenacities Emblem","emblemStructureTitle":"Emblem 의미 구조","emblemItem1":"<strong>TENACITIES</strong>: 사명 Tenacities의 각 글자를 추상적으로 형상화.","emblemItem2":"<strong>씨앗부터 열매까지</strong>: 하단 반원(씨앗)–중단 덩굴(줄기)–상단 반원(열매)로 연결되며, ‘修身 齊家 治社 愛天下’ 가치관의 연속성을 상징.","emblemItem3":"<strong>우직하게 타오르는 불꽃</strong>: 성화의 grip과 불꽃 형상으로, 급격한 성공보다 지속적 정진의 Tenacity를 표현.","emblemItem4":"<strong>맞잡은 두 손</strong>: 고객과 임직원을 동일한 생태계 구성원으로 보며, 순환적 상생을 지향.","emblemItem5":"<strong>기타 상징</strong>: 대칭적 butterfly wing, 피라미드/깔대기의 상하 대칭 관념을 통해 책임과 권한의 균형을 표현.","orgChartTitle":"Organization Chart","backToMain":"메인으로","footer":"CI section designed as a structured brand identity area."}}},"ja":{"common":{"language":{"ko":"韓国語","ja":"日本語","en":"English","zh":"簡体字中国語"},"backToMain":"メインに戻る"},"index":{"nav":{"hero":"Hero","background":"Background","philosophy":"Philosophy","ci":"CI","history":"History"},"hero":{"companyName":"株式会社テナシティーズ","logoAlt":"Tenacities ロゴ","concept1Title":"💡 Tenacity + ies","concept1Body":": 意志を持つ人々","concept2Title":"💡 Tena + cities","concept2Body":": 意志を持つ人々がつくる Seamless world"},"background":{"p1":"Tenacitiesは2022年3月、Metaverseを目標に設立された会社です。","p2":"私は幼い頃から一つの「世界」をつくりたいと思っていました。事業体、つまり会社も「一つの世界」なので、自然に起業の道を歩むようになりました。","p3":"さまざまな挑戦と失敗、経験と成長を繰り返す中で、「メタバース」というキーワードに出会いました。最初は詳しく知りませんでしたが、運命的な言葉に感じました。メタバースそのものが「一つの世界」だからです。","p4":"古風な格言ですが、私は「修身斉家治国平天下」というレンズで世界を見ています。","p5":"自分自身が一つの世界であるように、家庭も一つの世界であり、さらに会社も一つの世界だからです。","p6":"しかし私には治める国もなく、天下を平定するつもりもありません。","p7":"そこで私は少し言い換えた「修身 斉家 治社 愛天下」という価値観をもとに、認識と外延を広げ続けています。"},"philosophy":{"sectionTitle":"Philosophy","note":"※ TenacitiesはMetaverseを目指していますが、学界で議論されるMetaverseとは見解が大きく異なる場合があります。","topic1":{"title":"1️⃣ Metaverseに対する誤解と本質","p1":"多くの人はMetaverse、3D World、仮想現実を混同しがちです。Tenacitiesも最初は同じでした。","p2":"しかし探究を重ねた結果、私たちはSeamless worldこそMetaverseの本質だと解釈しました。"},"topic2":{"title":"2️⃣ Seamless worldとは","p1":"「私」という存在は、いつどこでも連続した、Seamlessな状態で存在します。","p2":"小学校を卒業して中学校に入学しても、管理システムに個人情報が登録され学籍番号が発行されるまでは、その社会の構成員として活動できません。私はSeamlessでも、WorldはSeamlessではありません。中央集権的な管理システムのためです。","p3":"韓国からアメリカへ移る時も同じです。管理システムに「私」の情報が登録されなければ、構成員として存在できません。","p4":"Metaverseと分散化が不可分なのは政治的な理由ではなく、Seamlessな生存を願う人間の本性に関わる話です。Coin、NFT、Block chainが一緒に語られるのも同じ理由です。"},"topic3":{"title":"3️⃣ TenacitiesのSeamless World","p1":"TenacitiesはSeamless world構築における最重要の三つの本質を「住居・食飲・労働」と定義しました。","p2":"多くの仕事がAIに代替される現在と未来でも、労働の本質を営み、それを支える住居と食飲のエコシステムが整えば、人間は生きる意志を持ち続けられます。","p3":"私たちは世界のどこへ行っても、さらには人類が火星へ移住しても、この三つの観点で自給自足が実現するSeamless worldの構築を目指します。"},"topic4":{"title":"4️⃣ TenacitiesとSeamless World","p1":"Tenacitiesは「意志を持つ人により多くの機会が与えられる世界」を願っています。","p2":"より良い人生を築く意志を持つ人々が集まった集団、それがTenacitiesです。","p3":"私たちTenacitiesは、意志を持つ人々が自由に生きられるMetaverseを目指します。"}},"ci":{"sectionTitle":"CI","logoSet":"ロゴとカラーセット","orgChart":"組織図","logoSetAria":"ロゴとカラーセットの詳細を見る","orgChartAria":"組織図の詳細を見る"},"history":{"sectionTitle":"History","entry1":"2022.03. 株式会社テナシティーズ設立・事業開始","entry2":"2022.05. 技術保証基金2億ウォン 技術審査承認","entry3":"2022.08. Social Metaverse Toany ローンチ","entry4":"2023.05. NIPAメタバース初期企業インフラ支援事業 最終選抜","entry5":"2023.06. Kpop rhythm game Duet tae-bo","entry6":"2023.12. 短期賃貸仲介プラットフォーム Narae House 受託開発・ローンチ","entry7":"2024.06. 短期賃貸統合管理サービス Concierge Gangnam","entry8":"2024.12. コンシェルジュ＋外食業 年売上13億ウォン達成","archiveCta":"沿革アーカイブをすべて見る →"},"footer":{"description":"assets/images/ のソース素材を基に、洗練された多層ブランドサイトとして再構築しました。"}},"history":{"archive":{"title":"History Archive (2022–2024)","intro":"縦型タイムラインで各沿革項目を閲覧できます。各項目は詳細ページと必要に応じて下位資料ページへつながります。","entry1":"<strong>2022.03</strong> (주)테너시티즈 설립 및 사업개시","entry2":"<strong>2022.05</strong> 기술보증기금 2억원 기술심사 승인","entry3":"<strong>2022.08</strong> Social Metaverse Toany 론칭","entry4":"<strong>2023.05</strong> NIPA_메타버스초기기업 인프라 지원사업 최종선발","entry5":"<strong>2023.06</strong> Kpop rhythm game Duet tae-bo","entry6":"<strong>2023.12</strong> 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","entry7":"<strong>2024.06</strong> 단기임대통합관리서비스 Concierge Gangnam","entry8":"<strong>2024.12</strong> 컨시어지+외식업 연매출 13억 달성","button":{"backToMain":"メインへ"}},"detail":{"eyebrow":"History Detail","subpageEyebrow":"History Subpage","backToHistory":"← 沿革を見る","backToMain":"メインへ","footer":"Tenacities history archive detail.","page202203":{"title":"2022.03. (주)테너시티즈 설립 및 사업개시"},"page202205":{"title":"2022.05. 기술보증기금 2억원 기술심사 승인"},"page202208":{"title":"2022.08. Social Metaverse Toany 론칭","serviceInfo":"Service Info","item1":"Metaverse 내부에서 F&B 배달을 위한 서비스 연동.","item2":"Toany를 통해 땡겨요 F&B 주문 시 NFT good 제공","item3":"3개 투자사(1 ac, 2 vc)사전신청 유저 10인 트위치 스트리머 1인 인베스트뉴스 기자 1인 참석","item4":"블리스바인 벤처스와 40억 Value 투자협상 진행","item5":"메타버스 버스킹 버스커 4인, 청중 16인 참가","item6":"메타버스 단체 소개팅 남성 4인, 여성 4인 참가","item7":"메타버스 단체 미팅 남녀 4팀 참가(2인 1팀)","item8":"우리집 포트럭 파티 남성 3팀, 남녀 1인 참가(2인 1팀)","item9":"대규모 상시 접속 인원이 보장되지 않으면 즐길 콘텐츠가 없다.","item10":"즐길 콘텐츠가 없으면 상시 접속할 이유가 없다.","linkedSubpages":"Linked Subpages","applicationCapture":"Application Capture","metaverseEvents":"Metaverse Events","externalReferences":"External References"},"page202305":{"title":"2023.05. NIPA_메타버스초기기업 인프라 지원사업 최종선발","agreement":"協約書"},"page202306":{"title":"2023.06. Kpop rhythm game Duet tae-bo","serviceInfo":"Service Info","item1":"VR appstore 생태계 이해 및 VR 최적화에 실패.","item2":"출시는 길어지는데 개발자, 디자이너 등을 유지할 수 없는 관계로 출시 포기","linkedSubpages":"Linked Subpages","applicationCapture":"Application Capture","nftPromoRoom":"NFTプロモーションルーム構築","externalReference":"External Reference"},"page202312":{"title":"2023.12. 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","applicationCapture":"Application Capture"},"page202406":{"title":"2024.06. 단기임대통합관리서비스 Concierge Gangnam"},"page202412":{"title":"2024.12. 컨시어지+외식업 연매출 13억 달성"},"page202208Application":{"title":"Application Capture"},"page202208Events":{"title":"Metaverse Events"},"page202305Agreement":{"title":"協約書"},"page202306Application":{"title":"Application Capture"},"page202306Nft":{"title":"NFTプロモーションルーム構築"},"page202312Application":{"title":"Application Capture"}}},"ci":{"detail":{"title":"CI — Brand Identity System","logoSystemTitle":"Logo System","primaryColorLabel":"Primary Color","primaryColorName":"Crimson Red · #E71D36","primaryColorDescription":"‘열정’을 상징하되, 단기 집중형 감정이 아닌 장기간에 걸친 ‘의지’를 드러내기 위해 채도를 조정하고 깊이를 더한 색으로 정의됩니다.","brandMarkLabel":"Brand Mark","brandMarkName":"Tenacities Emblem","emblemStructureTitle":"Emblem 意味構造","emblemItem1":"<strong>TENACITIES</strong>: 社名Tenacitiesの各文字を抽象的に可視化。","emblemItem2":"<strong>種から実まで</strong>: 下部半円(種)・中部つる(茎)・上部半円(実)でつながり、修身 齊家 治社 愛天下の価値観の連続性を象徴。","emblemItem3":"<strong>愚直に燃える炎</strong>: 聖火のグリップと炎の形で、急激な成功より持続的なTenacityを表現。","emblemItem4":"<strong>握り合う二つの手</strong>: 顧客と構成員を同じ生態系の仲間と捉え、循環型の共生を志向。","emblemItem5":"<strong>その他の象徴</strong>: 対称的なbutterfly wingと上下対称の観念で、責任と権限の均衡を表現。","orgChartTitle":"Organization Chart","backToMain":"メインへ","footer":"CI section designed as a structured brand identity area."}}},"en":{"common":{"language":{"ko":"Korean","ja":"Japanese","en":"English","zh":"Simplified Chinese"},"backToMain":"Back to Main"},"index":{"nav":{"hero":"Hero","background":"Background","philosophy":"Philosophy","ci":"CI","history":"History"},"hero":{"companyName":"Tenacities Co., Ltd.","logoAlt":"Tenacities logo","concept1Title":"💡 Tenacity + ies","concept1Body":": People with tenacity","concept2Title":"💡 Tena + cities","concept2Body":": A Seamless world shaped by people with tenacity"},"background":{"p1":"Tenacities was founded in March 2022 with Metaverse as its goal.","p2":"Since I was young, I wanted to build a single world. A business, a company itself, is also one world, so I naturally walked the path of entrepreneurship.","p3":"While repeating attempts and failures, experience and growth, the keyword Metaverse came to me. I did not know it deeply at first, but it felt like a destined keyword. Metaverse itself is one world.","p4":"Though it may sound old-fashioned, I view the world through the lens of self-cultivation, family order, governance, and peace under heaven.","p5":"Just as I am one world, my family is one world, and beyond that, a company is also one world.","p6":"But I have no country to rule and no ambition to conquer all under heaven.","p7":"So, with my own adaptation — Self-cultivation, Family, Company, Love for the World — I continue expanding my awareness and reach."},"philosophy":{"sectionTitle":"Philosophy","note":"※ Tenacities aims for Metaverse, but our view may differ significantly from the Metaverse discussed in academia.","topic1":{"title":"1️⃣ Misunderstandings about Metaverse and its essence","p1":"Many people confuse Metaverse, 3D World, and virtual reality. Tenacities also started that way.","p2":"After repeated exploration, we interpreted Seamless world as the essence of Metaverse."},"topic2":{"title":"2️⃣ What Seamless world means","p1":"The self exists as a continuous being, in a Seamless state, wherever and whenever.","p2":"When I graduate from elementary school and enter middle school, I cannot function as a member there until my profile is registered and a student number is issued. I am Seamless, but the World is not Seamless because of centralized management systems.","p3":"The same is true when moving from Korea to the U.S. Without registration in that system, I cannot exist as a member of that society.","p4":"The inseparable relation between Metaverse and decentralization is not merely political. It reflects human nature that seeks Seamless survival. That is why Coin, NFT, and Block chain are discussed together."},"topic3":{"title":"3️⃣ Tenacities' Seamless World","p1":"For building a Seamless world, Tenacities defines the three essential foundations as housing, food, and labor.","p2":"Even in a present and future where many jobs are replaced by AI, if people can sustain the essence of labor and have housing and food ecosystems that support it, they can continue their will to live.","p3":"Wherever in the world we go, even if humanity migrates to Mars, we aim to build a Seamless world where self-sufficiency in these three dimensions is possible."},"topic4":{"title":"4️⃣ Tenacities and Seamless World","p1":"Tenacities aspires to a world where people with will are given more opportunities.","p2":"Tenacities is a collective of people with the will to build better lives.","p3":"We aim for a Metaverse where people with will can live freely."}},"ci":{"sectionTitle":"CI","logoSet":"Logo & Color Set","orgChart":"Organization Chart","logoSetAria":"View logo and color set details","orgChartAria":"View organization chart details"},"history":{"sectionTitle":"History","entry1":"2022.03. Tenacities founded and business operations launched","entry2":"2022.05. Technology guarantee fund KRW 200M technical review approved","entry3":"2022.08. Social Metaverse Toany launched","entry4":"2023.05. Final selection for NIPA Metaverse startup infrastructure support program","entry5":"2023.06. Kpop rhythm game Duet tae-bo","entry6":"2023.12. Narae House short-term rental brokerage platform outsourced development and launch","entry7":"2024.06. Concierge Gangnam short-term rental integrated management service","entry8":"2024.12. Concierge + food service annual sales reached KRW 1.3B","archiveCta":"View full history archive →"},"footer":{"description":"Built from source material in assets/images/, rebuilt as a refined multi-depth brand website."}},"history":{"archive":{"title":"History Archive (2022–2024)","intro":"You can browse each milestone in the vertical timeline. Each item links to a detail page and related subpages when available.","entry1":"<strong>2022.03</strong> (주)테너시티즈 설립 및 사업개시","entry2":"<strong>2022.05</strong> 기술보증기금 2억원 기술심사 승인","entry3":"<strong>2022.08</strong> Social Metaverse Toany 론칭","entry4":"<strong>2023.05</strong> NIPA_메타버스초기기업 인프라 지원사업 최종선발","entry5":"<strong>2023.06</strong> Kpop rhythm game Duet tae-bo","entry6":"<strong>2023.12</strong> 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","entry7":"<strong>2024.06</strong> 단기임대통합관리서비스 Concierge Gangnam","entry8":"<strong>2024.12</strong> 컨시어지+외식업 연매출 13억 달성","button":{"backToMain":"Back to Main"}},"detail":{"eyebrow":"History Detail","subpageEyebrow":"History Subpage","backToHistory":"← Back to History","backToMain":"Back to Main","footer":"Tenacities history archive detail.","page202203":{"title":"2022.03. (주)테너시티즈 설립 및 사업개시"},"page202205":{"title":"2022.05. 기술보증기금 2억원 기술심사 승인"},"page202208":{"title":"2022.08. Social Metaverse Toany 론칭","serviceInfo":"Service Info","item1":"Metaverse 내부에서 F&B 배달을 위한 서비스 연동.","item2":"Toany를 통해 땡겨요 F&B 주문 시 NFT good 제공","item3":"3개 투자사(1 ac, 2 vc)사전신청 유저 10인 트위치 스트리머 1인 인베스트뉴스 기자 1인 참석","item4":"블리스바인 벤처스와 40억 Value 투자협상 진행","item5":"메타버스 버스킹 버스커 4인, 청중 16인 참가","item6":"메타버스 단체 소개팅 남성 4인, 여성 4인 참가","item7":"메타버스 단체 미팅 남녀 4팀 참가(2인 1팀)","item8":"우리집 포트럭 파티 남성 3팀, 남녀 1인 참가(2인 1팀)","item9":"대규모 상시 접속 인원이 보장되지 않으면 즐길 콘텐츠가 없다.","item10":"즐길 콘텐츠가 없으면 상시 접속할 이유가 없다.","linkedSubpages":"Linked Subpages","applicationCapture":"Application Capture","metaverseEvents":"Metaverse Events","externalReferences":"External References"},"page202305":{"title":"2023.05. NIPA_메타버스초기기업 인프라 지원사업 최종선발","agreement":"Agreement"},"page202306":{"title":"2023.06. Kpop rhythm game Duet tae-bo","serviceInfo":"Service Info","item1":"VR appstore 생태계 이해 및 VR 최적화에 실패.","item2":"출시는 길어지는데 개발자, 디자이너 등을 유지할 수 없는 관계로 출시 포기","linkedSubpages":"Linked Subpages","applicationCapture":"Application Capture","nftPromoRoom":"NFT Promo Room Build","externalReference":"External Reference"},"page202312":{"title":"2023.12. 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","applicationCapture":"Application Capture"},"page202406":{"title":"2024.06. 단기임대통합관리서비스 Concierge Gangnam"},"page202412":{"title":"2024.12. 컨시어지+외식업 연매출 13억 달성"},"page202208Application":{"title":"Application Capture"},"page202208Events":{"title":"Metaverse Events"},"page202305Agreement":{"title":"Agreement"},"page202306Application":{"title":"Application Capture"},"page202306Nft":{"title":"NFT Promo Room Build"},"page202312Application":{"title":"Application Capture"}}},"ci":{"detail":{"title":"CI — Brand Identity System","logoSystemTitle":"Logo System","primaryColorLabel":"Primary Color","primaryColorName":"Crimson Red · #E71D36","primaryColorDescription":"‘열정’을 상징하되, 단기 집중형 감정이 아닌 장기간에 걸친 ‘의지’를 드러내기 위해 채도를 조정하고 깊이를 더한 색으로 정의됩니다.","brandMarkLabel":"Brand Mark","brandMarkName":"Tenacities Emblem","emblemStructureTitle":"Emblem Meaning Structure","emblemItem1":"<strong>TENACITIES</strong>: Abstractly visualizes each letter of the Tenacities name.","emblemItem2":"<strong>From seed to fruit</strong>: The lower semicircle (seed), middle vine (stem), and upper semicircle (fruit) symbolize continuity in the value of 修身 齊家 治社 愛天下.","emblemItem3":"<strong>Steady burning flame</strong>: Through the torch grip and flame form, it represents sustained Tenacity over rapid short-term success.","emblemItem4":"<strong>Two joined hands</strong>: Views customers and team members as equal ecosystem participants, aiming for cyclical co-growth.","emblemItem5":"<strong>Other symbols</strong>: Expresses balance of responsibility and authority through symmetric butterfly-wing and top-bottom symmetry motifs.","orgChartTitle":"Organization Chart","backToMain":"Back to Main","footer":"CI section designed as a structured brand identity area."}}},"zh":{"common":{"language":{"ko":"韩语","ja":"日语","en":"英语","zh":"简体中文"},"backToMain":"返回主页"},"index":{"nav":{"hero":"Hero","background":"Background","philosophy":"Philosophy","ci":"CI","history":"History"},"hero":{"companyName":"腾纳思提兹株式会社","logoAlt":"Tenacities 标志","concept1Title":"💡 Tenacity + ies","concept1Body":": 拥有意志的人们","concept2Title":"💡 Tena + cities","concept2Body":": 由拥有意志的人们共同打造的 Seamless world"},"background":{"p1":"Tenacities 于 2022 年 3 月成立，以 Metaverse 为目标。","p2":"我从小就想创造一个“世界”。企业，也就是公司，本身也是“一个世界”，因此我自然而然走上了创业之路。","p3":"在不断经历尝试与失败、经验与成长的过程中，“元宇宙”这个关键词来到我面前。虽然起初并不了解它，但它像命运般吸引我。因为 Metaverse 本身就是“一个世界”。","p4":"虽然这句格言有些古典，但我始终通过“修身齐家治国平天下”这副视角看世界。","p5":"正如我自己是一个世界，我的家庭也是一个世界，进一步说，公司同样是一个世界。","p6":"但我并没有可以治理的国家，也无意平定天下。","p7":"因此我以稍作变形的“修身 齐家 治社 爱天下”为价值观，不断扩展自己的认知与边界。"},"philosophy":{"sectionTitle":"Philosophy","note":"※ Tenacities 以 Metaverse 为目标，但我们的观点可能与学界讨论的 Metaverse 存在较大差异。","topic1":{"title":"1️⃣ 关于 Metaverse 的误解与本质","p1":"很多人会混淆 Metaverse、3D World 和虚拟现实。Tenacities 起初也是如此。","p2":"但经过反复探索，我们将 Seamless world 解释为 Metaverse 的本质。"},"topic2":{"title":"2️⃣ 什么是 Seamless world","p1":"“我”这一存在，无论何时何地，都以连续且 Seamless 的状态存在。","p2":"当我小学毕业进入中学时，在学校管理系统登记个人信息并获得学号之前，我无法作为该社会的成员活动。我是 Seamless 的，但 World 不是 Seamless 的，因为系统是中心化管理。","p3":"从韩国到美国时也是一样。如果美国的管理系统没有登记“我”的信息，我就无法作为成员存在。","p4":"Metaverse 与去中心化密不可分，并非政治视角，而是源于人类对 Seamless 生存的本能诉求。这也是 Coin、NFT、Block chain 经常被一同讨论的原因。"},"topic3":{"title":"3️⃣ Tenacities 的 Seamless World","p1":"Tenacities 将构建 Seamless world 的三大核心本质定义为“居住、饮食、劳动”。","p2":"即使在现在与未来许多工作被 AI 替代的时代，只要人类仍能维系劳动本质，并具备支撑这种本质的居住与饮食生态系统，就能持续保持生活意志。","p3":"无论我们走到世界任何地方，甚至未来人类迁居火星，我们都以实现这三方面自给自足的 Seamless world 为目标。"},"topic4":{"title":"4️⃣ Tenacities 与 Seamless World","p1":"Tenacities 向往“让有意志的人获得更多机会的世界”。","p2":"Tenacities 是由有意愿创造更好生活的人们组成的集体。","p3":"我们 Tenacities 以让有意志的人自由生活的 Metaverse 为目标。"}},"ci":{"sectionTitle":"CI","logoSet":"标志与配色","orgChart":"组织架构","logoSetAria":"查看标志与配色详情","orgChartAria":"查看组织架构详情"},"history":{"sectionTitle":"History","entry1":"2022.03. Tenacities 成立并启动业务","entry2":"2022.05. 技术担保基金 2 亿韩元技术评审通过","entry3":"2022.08. Social Metaverse Toany 上线","entry4":"2023.05. 入选 NIPA 元宇宙初创企业基础设施支持项目","entry5":"2023.06. Kpop rhythm game Duet tae-bo","entry6":"2023.12. 短租中介平台 Narae House 外包开发并上线","entry7":"2024.06. 短租一体化管理服务 Concierge Gangnam","entry8":"2024.12. 礼宾服务+餐饮业务年销售额达 13 亿韩元","archiveCta":"查看完整沿革档案 →"},"footer":{"description":"基于 assets/images/ 的源素材，重构为精炼的多层级品牌网站。"}},"history":{"archive":{"title":"History Archive (2022–2024)","intro":"可在纵向时间线中查看各项沿革。每个条目都会连接到详情页，并在需要时连接到子资料页。","entry1":"<strong>2022.03</strong> (주)테너시티즈 설립 및 사업개시","entry2":"<strong>2022.05</strong> 기술보증기금 2억원 기술심사 승인","entry3":"<strong>2022.08</strong> Social Metaverse Toany 론칭","entry4":"<strong>2023.05</strong> NIPA_메타버스초기기업 인프라 지원사업 최종선발","entry5":"<strong>2023.06</strong> Kpop rhythm game Duet tae-bo","entry6":"<strong>2023.12</strong> 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","entry7":"<strong>2024.06</strong> 단기임대통합관리서비스 Concierge Gangnam","entry8":"<strong>2024.12</strong> 컨시어지+외식업 연매출 13억 달성","button":{"backToMain":"返回主页"}},"detail":{"eyebrow":"History Detail","subpageEyebrow":"History Subpage","backToHistory":"← 查看沿革","backToMain":"返回主页","footer":"Tenacities history archive detail.","page202203":{"title":"2022.03. (주)테너시티즈 설립 및 사업개시"},"page202205":{"title":"2022.05. 기술보증기금 2억원 기술심사 승인"},"page202208":{"title":"2022.08. Social Metaverse Toany 론칭","serviceInfo":"Service Info","item1":"Metaverse 내부에서 F&B 배달을 위한 서비스 연동.","item2":"Toany를 통해 땡겨요 F&B 주문 시 NFT good 제공","item3":"3개 투자사(1 ac, 2 vc)사전신청 유저 10인 트위치 스트리머 1인 인베스트뉴스 기자 1인 참석","item4":"블리스바인 벤처스와 40억 Value 투자협상 진행","item5":"메타버스 버스킹 버스커 4인, 청중 16인 참가","item6":"메타버스 단체 소개팅 남성 4인, 여성 4인 참가","item7":"메타버스 단체 미팅 남녀 4팀 참가(2인 1팀)","item8":"우리집 포트럭 파티 남성 3팀, 남녀 1인 참가(2인 1팀)","item9":"대규모 상시 접속 인원이 보장되지 않으면 즐길 콘텐츠가 없다.","item10":"즐길 콘텐츠가 없으면 상시 접속할 이유가 없다.","linkedSubpages":"Linked Subpages","applicationCapture":"Application Capture","metaverseEvents":"Metaverse Events","externalReferences":"External References"},"page202305":{"title":"2023.05. NIPA_메타버스초기기업 인프라 지원사업 최종선발","agreement":"协议书"},"page202306":{"title":"2023.06. Kpop rhythm game Duet tae-bo","serviceInfo":"Service Info","item1":"VR appstore 생태계 이해 및 VR 최적화에 실패.","item2":"출시는 길어지는데 개발자, 디자이너 등을 유지할 수 없는 관계로 출시 포기","linkedSubpages":"Linked Subpages","applicationCapture":"Application Capture","nftPromoRoom":"NFT 宣传室构建","externalReference":"External Reference"},"page202312":{"title":"2023.12. 단기임대중개 플랫폼 나래하우스 외주개발 및 런칭","applicationCapture":"Application Capture"},"page202406":{"title":"2024.06. 단기임대통합관리서비스 Concierge Gangnam"},"page202412":{"title":"2024.12. 컨시어지+외식업 연매출 13억 달성"},"page202208Application":{"title":"Application Capture"},"page202208Events":{"title":"Metaverse Events"},"page202305Agreement":{"title":"协议书"},"page202306Application":{"title":"Application Capture"},"page202306Nft":{"title":"NFT 宣传室构建"},"page202312Application":{"title":"Application Capture"}}},"ci":{"detail":{"title":"CI — Brand Identity System","logoSystemTitle":"Logo System","primaryColorLabel":"Primary Color","primaryColorName":"Crimson Red · #E71D36","primaryColorDescription":"‘열정’을 상징하되, 단기 집중형 감정이 아닌 장기간에 걸친 ‘의지’를 드러내기 위해 채도를 조정하고 깊이를 더한 색으로 정의됩니다.","brandMarkLabel":"Brand Mark","brandMarkName":"Tenacities Emblem","emblemStructureTitle":"Emblem 含义结构","emblemItem1":"<strong>TENACITIES</strong>：将 Tenacities 名称中的各字母进行抽象化呈现。","emblemItem2":"<strong>从种子到果实</strong>：下半圆(种子)-中部藤蔓(茎)-上半圆(果实)相连，象征修身 齐家 治社 爱天下价值观的连续性。","emblemItem3":"<strong>执着燃烧的火焰</strong>：通过圣火握柄与火焰造型，表达比短期成功更重要的持续 Tenacity。","emblemItem4":"<strong>相握的双手</strong>：将客户与成员视为同一生态中的参与者，追求循环共生。","emblemItem5":"<strong>其他象征</strong>：通过对称的 butterfly wing 与上下对称观念，表达责任与权限的平衡。","orgChartTitle":"Organization Chart","backToMain":"返回主页","footer":"CI section designed as a structured brand identity area."}}}};
  function getLocalesPath() {
    const script = global.document.currentScript || global.document.querySelector('script[src*="scripts/i18n.js"]');
    const src = script && script.src ? script.src : '';
    if (!src) {
      return 'locales';
    }
    const scriptUrl = new URL(src, global.location.href);
    const localesUrl = new URL('../locales/', scriptUrl);
    return localesUrl.href.replace(/\/$/, '');
  }

  function getFlagAssetUrl(lang) {
    const meta = LANGUAGE_META[lang] || LANGUAGE_META[DEFAULT_LANGUAGE];
    const script = global.document.currentScript || global.document.querySelector('script[src*="scripts/i18n.js"]');
    const src = script && script.src ? script.src : '';

    if (!src) {
      return `assets/icons/flags/${meta.flagAsset}`;
    }

    const scriptUrl = new URL(src, global.location.href);
    return new URL(`../assets/icons/flags/${meta.flagAsset}`, scriptUrl).href;
  }

  let currentLanguage = DEFAULT_LANGUAGE;
  let currentDictionary = {};

  function normalizeLanguage(lang) {
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
  }

  function getSavedLanguage() {
    try {
      const saved = global.localStorage.getItem(STORAGE_KEY);
      return normalizeLanguage(saved);
    } catch (_error) {
      return DEFAULT_LANGUAGE;
    }
  }

  function setSavedLanguage(lang) {
    try {
      global.localStorage.setItem(STORAGE_KEY, normalizeLanguage(lang));
    } catch (_error) {
      // no-op in restricted storage environments
    }
  }

  async function loadLocale(lang) {
    const normalizedLang = normalizeLanguage(lang);
    if (global.location.protocol === 'file:') {
      const embedded = EMBEDDED_LOCALES[normalizedLang];
      if (embedded) {
        return embedded;
      }
    }
    const localesPath = getLocalesPath();
    const response = await fetch(`${localesPath}/${normalizedLang}.json`, {
      cache: 'no-cache'
    });

    if (!response.ok) {
      throw new Error(`Failed to load locale: ${normalizedLang}`);
    }

    return response.json();
  }

  function getNestedValue(obj, keyPath) {
    return keyPath.split('.').reduce(function (acc, key) {
      return acc && Object.prototype.hasOwnProperty.call(acc, key) ? acc[key] : undefined;
    }, obj);
  }

  function applyTranslations(dict, root) {
    const base = root || global.document;
    const textNodes = base.querySelectorAll('[data-i18n]');
    const htmlNodes = base.querySelectorAll('[data-i18n-html]');
    const ariaNodes = base.querySelectorAll('[data-i18n-aria-label]');
    const titleNodes = base.querySelectorAll('[data-i18n-title]');

    textNodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.textContent = translated;
      }
    });

    htmlNodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n-html');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.innerHTML = translated;
      }
    });

    ariaNodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n-aria-label');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.setAttribute('aria-label', translated);
      }
    });

    titleNodes.forEach(function (node) {
      const key = node.getAttribute('data-i18n-title');
      const translated = getNestedValue(dict, key);

      if (typeof translated === 'string') {
        node.setAttribute('title', translated);
      }
    });
  }

  function updateSwitcherUI(lang) {
    const root = global.document.getElementById(SWITCHER_ROOT_ID);
    if (!root) {
      return;
    }

    const meta = LANGUAGE_META[lang] || LANGUAGE_META[DEFAULT_LANGUAGE];
    const trigger = root.querySelector('.lang-switcher-trigger');
    const triggerFlag = root.querySelector('.lang-switcher-trigger-flag');

    if (trigger) {
      trigger.setAttribute('aria-label', `${meta.label} selected. Change language`);
    }
    if (triggerFlag) {
      triggerFlag.setAttribute('src', getFlagAssetUrl(lang));
      triggerFlag.setAttribute('alt', `${meta.label} flag`);
    }

    root.querySelectorAll('.lang-switcher-option').forEach(function (button) {
      const optionLang = button.getAttribute('data-lang');
      const isActive = optionLang === lang;
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.classList.toggle('is-active', isActive);
    });
  }

  function closeSwitcherPanel() {
    const root = global.document.getElementById(SWITCHER_ROOT_ID);
    if (!root) {
      return;
    }
    root.classList.remove('is-open');
    const trigger = root.querySelector('.lang-switcher-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  function createLanguageSwitcher() {
    if (global.document.getElementById(SWITCHER_ROOT_ID)) {
      return;
    }

    const root = global.document.createElement('div');
    root.id = SWITCHER_ROOT_ID;
    root.className = 'lang-switcher';

    const trigger = global.document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'lang-switcher-trigger';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<img class="lang-switcher-trigger-flag" src="${getFlagAssetUrl(DEFAULT_LANGUAGE)}" alt="한국어 flag" />`;

    const panel = global.document.createElement('div');
    panel.className = 'lang-switcher-panel';
    panel.setAttribute('role', 'menu');
    panel.setAttribute('aria-label', 'Language selector');

    SUPPORTED_LANGUAGES.forEach(function (lang) {
      const meta = LANGUAGE_META[lang];
      const option = global.document.createElement('button');
      option.type = 'button';
      option.className = 'lang-switcher-option';
      option.setAttribute('role', 'menuitemradio');
      option.setAttribute('data-lang', lang);
      option.innerHTML = `<img class="lang-switcher-flag" src="${getFlagAssetUrl(lang)}" alt="${meta.label} flag" /><span class="lang-switcher-label">${meta.label}</span>`;
      option.addEventListener('click', async function (event) {
        event.preventDefault();
        event.stopPropagation();
        try {
          await setLanguage(lang);
          closeSwitcherPanel();
        } catch (error) {
          console.error('[i18n] failed to switch language:', lang, error);
        }
      });
      panel.appendChild(option);
    });

    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = root.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    global.document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) {
        root.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    global.document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        root.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    root.appendChild(trigger);
    root.appendChild(panel);
    global.document.body.appendChild(root);
  }

  async function setLanguage(lang) {
    const normalizedLang = normalizeLanguage(lang);
    let resolvedLanguage = normalizedLang;
    let dict;

    try {
      dict = await loadLocale(normalizedLang);
    } catch (error) {
      console.error('[i18n] locale load failed:', normalizedLang, error);
      if (normalizedLang !== DEFAULT_LANGUAGE) {
        resolvedLanguage = DEFAULT_LANGUAGE;
        try {
          dict = await loadLocale(DEFAULT_LANGUAGE);
        } catch (fallbackError) {
          console.error('[i18n] default locale load failed:', DEFAULT_LANGUAGE, fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }

    currentLanguage = resolvedLanguage;
    currentDictionary = dict;
    setSavedLanguage(resolvedLanguage);
    applyTranslations(dict);
    updateSwitcherUI(resolvedLanguage);

    return { language: currentLanguage, dictionary: currentDictionary };
  }

  async function initializeI18n() {
    createLanguageSwitcher();
    const initialLanguage = getSavedLanguage();
    return setLanguage(initialLanguage);
  }

  global.i18n = {
    STORAGE_KEY,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    loadLocale,
    applyTranslations,
    setLanguage,
    initializeI18n,
    getCurrentLanguage: function () {
      return currentLanguage;
    },
    getCurrentDictionary: function () {
      return currentDictionary;
    }
  };
})(window);
