# Fontes oficiais de comunicação judicial e regras de data para a captura (2025-2026)

Todos os acessos em 2026-10-26. "(secundária)" marca fonte que não é o órgão emissor nem o texto da norma. "(medido)" marca o que esta pesquisa observou chamando a API pública do DJEN em 2026-10-26, sem login. Nomes de partes e advogados vistos na API ficam fora destas notas.

## 1. DJEN: o que publica, datas, campos, API, atualização e falhas

### Takeaway
O DJEN (comunica.pje.jus.br) é o meio oficial das intimações não pessoais dirigidas a advogados e dos editais desde 16/05/2025. A data de publicação é o 1º dia útil após a disponibilização, e o prazo começa no 1º dia útil após a publicação. A API pública de consulta (comunicaapi.pje.jus.br) responde sem login, com limite de 20 chamadas, teto de 10.000 no contador e um caderno diário em ZIP por tribunal: é a fonte primária que a captura deve ler.

### Cited Findings
**O que publica**
- O art. 11, § 2º, da Res. CNJ 455/2022 faz do DJEN o meio oficial das intimações não pessoais e substitui qualquer outro meio oficial; a concomitância por outros meios tem "valor meramente informativo". No TJMG, desde 27/01/2025, a advocacia privada deixou de ser intimada pelo PJe e passou a ser intimada só pelo DJEN — [TJMG, Protocolo DJEN e Domicílio, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf)
- Vão ao DJEN só as intimações a advogados privados, mesmo sem prazo, e os editais. Ficam fora: pessoas jurídicas de direito público, Defensoria, MP, procuradorias, advogados dativos, auxiliares da justiça (peritos, leiloeiros), cartórios extrajudiciais, núcleos de prática jurídica e quem atua com jus postulandi; esses seguem intimados pelo "Sistema" (portal) — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf)
- Res. CNJ 569/2024: todos os tribunais deveriam integrar-se até 15/05/2025; a partir de 16/05/2025 os prazos contam só pelo DJEN ou pelo Domicílio; o método de 10 dias de consulta no portal (Lei 11.419/2006) deixa de valer para advogados — [AASP, comunicado de 21/05/2025](https://www.aasp.org.br/comunicado/atencao-as-novas-regras-sobre-contagem-de-prazos-processuais/) (secundária)
- O prazo para os tribunais regularizarem a contagem pelo DJEN foi antes prorrogado até 16/03/2025 — [Judit, Eproc vs DJEN](https://judit.io/blog/gestao-juridica-legal-operations/intimacao-eletronica-eproc-vs-djen-o-que-diz-o-stj/) (secundária)

**Datas**
- Fluxo oficial com exemplo: envio no PJe em 27/01/2025 → disponibilização em 28/01 ("geralmente, 1º dia útil seguinte ao envio") → publicação em 29/01 (CPC art. 224, § 2º) → início do prazo em 30/01 (CPC art. 224, § 3º) → fim de prazo de 5 dias úteis em 05/02/2025 — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf)
- A certidão emitida pelo próprio DJEN traz o texto: "considera-se como data da publicação o primeiro dia útil seguinte ao da disponibilização da informação. A contagem do prazo terá início no primeiro dia útil que seguir ao da publicação", com base no art. 4º, § 3º, da Lei 11.419/2006 e no art. 224 do CPC — [certidão de 1 comunicação TJMG de 23/10/2026, API DJEN](https://comunicaapi.pje.jus.br/api/v1/comunicacao/r2nqe4VJb6agIahzTn1ddrYKk7AgOM/certidao) (medido)
- CPC art. 224: § 2º "Considera-se como data de publicação o primeiro dia útil seguinte ao da disponibilização"; § 3º "A contagem do prazo terá início no primeiro dia útil que seguir ao da publicação"; § 1º prorroga começo e vencimento que caiam em dia sem expediente — [Planalto, CPC](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm)
- A disponibilização ocorre de segunda a sexta a partir de 0h, fora os feriados nacionais e regionais cadastrados no sistema processual (art. 12 da Res. 455/2022) — [TRT4, aviso](https://www.trt4.jus.br/portais/trt4/modulos/noticias/666382) (resumo do buscador; página não aberta)
- Horário de corte local: no TJMT, documento enviado até 22:59 entra no DJEN no 1º dia útil seguinte (regra de 2022, só do TJMT) — [TJMT, Resolução OE 5/2022](https://www.tjmt.jus.br/intranet.arq/cms/grupopaginas/100/820/Resolucao_OE_52022_-_Dje_Nacional.pdf) (resumo do buscador)
- No PJe do TJMG, a intimação publicada no DJEN aparece na aba "Expedientes" do advogado na data da publicação, "com a ciência já registrada pelo sistema" — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf)
- CPC art. 272, § 2º: sob pena de nulidade, a publicação deve conter os nomes das partes e de seus advogados (com OAB) — [Planalto, CPC](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm)

**Campos de uma comunicação (API, medido)**
- `GET https://comunicaapi.pje.jus.br/api/v1/comunicacao` devolveu, por item: `id`, `data_disponibilizacao` (AAAA-MM-DD) e `datadisponibilizacao` (DD/MM/AAAA), `dataenvio` (só em parte dos itens), `siglaTribunal`, `nomeOrgao`, `idOrgao`, `tipoComunicacao` (vistos: Intimação, Citação, Edital, Lista de distribuição), `tipoDocumento` (Despacho, Decisão, Sentença, Acórdão, Ato ordinatório, Intimação de pauta etc.; às vezes um código numérico como "80"), `meio` (D = Diário, E = Edital) e `meiocompleto`, `numero_processo` e `numeroprocessocommascara` (CNJ), `nomeClasse`, `codigoClasse`, `numeroComunicacao`, `texto` (texto puro ou HTML completo), `link` (inteiro teor no tribunal), `hash` (= código da certidão), `status` (visto: "P"), `ativo`, `motivo_cancelamento`, `data_cancelamento`, `destinatarios[]` (nome, polo A/P) e `destinatarioadvogados[]` (nome, `numero_oab`, `uf_oab`) — [API DJEN, consulta TJMG 23/10/2026](https://comunicaapi.pje.jus.br/api/v1/comunicacao?siglaTribunal=TJMG&dataDisponibilizacaoInicio=2026-10-23&dataDisponibilizacaoFim=2026-10-23&itensPorPagina=5&pagina=1) (medido)
- Numa amostra de 1.000 itens do TJMG de 23/10/2026: 562 intimações, 437 editais, 1 citação; 182 sem advogado vinculado; 320 com texto em HTML — [API DJEN](https://comunicaapi.pje.jus.br/api/v1/comunicacao?siglaTribunal=TJMG&dataDisponibilizacaoInicio=2026-10-23&dataDisponibilizacaoFim=2026-10-23&itensPorPagina=1000&pagina=1) (medido)
- `GET /api/v1/comunicacao/{hash}/certidao` devolve a certidão em PDF (tribunal, órgão, data de disponibilização, destinatários, advogados com OAB, teor, regra de contagem e o código) — [API DJEN, certidão](https://comunicaapi.pje.jus.br/api/v1/comunicacao/r2nqe4VJb6agIahzTn1ddrYKk7AgOM/certidao) (medido)

**API: filtros, limites e caderno**
- Filtros aceitos (medido): `siglaTribunal`, `numeroOab` + `ufOab`, `dataDisponibilizacaoInicio` e `dataDisponibilizacaoFim`, `itensPorPagina` (padrão 100; 1.000 aceito), `pagina`. Uma consulta por OAB trouxe comunicações de TJMG, TJSP, TJBA, TRF6, TRT3, STJ e TST — [API DJEN, consulta por OAB](https://comunicaapi.pje.jus.br/api/v1/comunicacao?numeroOab=95004&ufOab=MG&dataDisponibilizacaoInicio=2026-10-01&dataDisponibilizacaoFim=2026-10-23) (medido)
- A tela pública filtra por tribunal, órgão julgador, meio, data inicial e final, número do processo, nome da parte, nome do advogado, número da OAB e UF da OAB — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf); o número da OAB tem até 7 dígitos e aceita o formato "SC12345" — [TJSC, consulta no DJEN](https://www.tjsc.jus.br/web/processo-eletronico-eproc/-/consulta-de-publicacoes-no-diario-de-justica-eletronico-nacional-djen) (resumo do buscador)
- Limites (medido): cabeçalho `X-RateLimit-Limit: 20`; o campo `count` para em 10.000 nas consultas por tribunal e dia; `Cache-Control: max-age=120`; sob carga, a API devolve `{"status":"error","message":"O sistema está muito ocupado. Tente novamente mais tarde."}` — [API DJEN](https://comunicaapi.pje.jus.br/api/v1/comunicacao?siglaTribunal=TJMG&dataDisponibilizacaoInicio=2026-10-23&dataDisponibilizacaoFim=2026-10-23&itensPorPagina=5&pagina=1) (medido)
- `GET /api/v1/caderno/{sigla}/{data}/{meio}` devolve o caderno do dia: status ("Processado" ou "Sem comunicações"), `versao`, `total_comunicacoes`, `numero_paginas`, `hash` SHA-256 e uma URL de ZIP assinada com validade de 300 s. TJMG em 23/10/2026: 122.044 comunicações, 73,8 MB; TJSP no mesmo dia: 229.351 — [API DJEN, caderno TJMG](https://comunicaapi.pje.jus.br/api/v1/caderno/TJMG/2026-10-23/D) (medido)
- O Swagger em comunicaapi.pje.jus.br/swagger/index.html devolveu 404/403 nesta pesquisa. O CNJ lista homologação (hcomunicaapi.cnj.jus.br) e produção (comunicaapi.pje.jus.br/api/v1) e exige login no "Corporativo" do CNJ para o envio pelos tribunais — [CNJ, Comunicações Processuais](https://www.cnj.jus.br/programas-e-acoes/processo-judicial-eletronico-pje/comunicacoes-processuais/) (resumo do buscador; página deu 403)

**Falhas conhecidas**
- Certidão do CNJ: atraso na disponibilização de parte das comunicações enviadas em 7 e 8/10/2026, por falha no motor de busca, com intermitência em 8 e 9/10/2026 até 12h30 do dia 9 — [CNJ, certidão SEI 2811492](https://www.cnj.jus.br/wp-content/uploads/2026/10/sei-2811492-certidao.pdf) (resumo do buscador; PDF deu 403)
- O TJMSP avisou que o CNJ reconheceu a instabilidade de 7 a 9/10/2026 e que os prazos dos feitos afetados ficariam suspensos até a regularização — [TJMSP, aviso de 09/10/2026](https://www.tjmsp.jus.br/2026/10/09/aviso-importante-instabilidade-do-diario-da-justica-nacional-eletronico-djen/) (resumo do buscador; página deu 403)
- Em 2025, OAB-MG e OAB-RS cobraram o CNJ por falhas do DJEN; a OAB-MG pediu suspensão de prazos entre 27/01/2025 e 10/02/2025 — [OAB-MG](https://www.oabmg.org.br/Noticias/Detalhe/12614/OAB-MG_pede_providencias_ao_CNJ_em_relacao_ao_DJEN_em_Minas_Gerais); [OAB-RS](https://www2.oabrs.org.br/jornalDaOrdem/oab-rs-oficia-cnj-e-tjrs-sobre-instabilidade-no-djen-e-no-eproc/51441) (resumo do buscador)
- O registro oficial de indisponibilidade fica na página "Relatórios de Indisponibilidade" do CNJ; o problema mais comum é atraso de disponibilização, não queda total — [Contrate Agentes, DJEN fora do ar](https://contrateagentes.com.br/artigos/djen-fora-do-ar) (secundária)

### Inferences
- Data que a tela mostra para cada comunicação: disponibilização (vem da API), publicação (calculada: 1º dia útil após a disponibilização, pelo calendário do tribunal), início do prazo (1º dia útil após a publicação) e envio (`dataenvio`, quando vier). Exemplo do TJMG: disponibilizada 28/01/2025 → publicada 29/01 → prazo começa 30/01.
- O `hash` é a chave estável para deduplicar e o link da certidão é a evidência oficial que o produto pode anexar ao item capturado.
- Por OAB, a API cobre todos os tribunais numa chamada. Por tribunal e dia, o contador para em 10.000 e o TJMG passa de 120 mil comunicações num dia: para varredura completa, o caminho é o caderno diário em ZIP, não a paginação.
- Com limite de 20 chamadas e erro "muito ocupado" sob carga, a captura precisa de fila com nova tentativa e de um estado "fonte instável" na tela, separado de "sem publicação".
- `motivo_cancelamento` e `data_cancelamento` indicam que uma comunicação pode ser cancelada depois de capturada: a tela precisa de estado "cancelada na fonte".

### Gaps
- Texto literal dos arts. 11 e 12 da Res. 455/2022 com a redação da Res. 569/2024: atos.cnj.jus.br deu 403. O texto do § 2º do art. 11 vem pela citação do TJMG.
- Contrato oficial da API (Swagger): indisponível; nomes de filtros além dos testados (órgão, parte, número do processo, meio) não foram confirmados por documentação.
- Janela do limite de 20 chamadas (por minuto?) e se o contador de 10.000 também limita a paginação: não confirmado.
- Frequência de atualização ao longo do dia: não há fonte oficial. A disponibilização é diária, a partir de 0h, em dia útil.

## 2. Domicílio Judicial Eletrônico: citação, intimação pessoal, cadastro, API, estados e perfis

### Takeaway
O Domicílio recebe só citações e intimações pessoais. Citação de pessoa jurídica de direito privado: 3 dias úteis para consulta; se ela não acontece, a citação segue por outro meio e cabe multa de até 5% do valor da causa sem justa causa. Consultada a citação, o 5º dia útil seguinte à confirmação é o "dia do começo" e o prazo corre no dia útil seguinte. Intimação pessoal: 10 dias corridos e depois ciência automática. Ponto crítico para a captura: pelo art. 20 da Res. 455/2022, abrir o conteúdo pela API conta como ciência.

### Cited Findings
**Regras (Res. 455/2022, art. 20, citado pelo CNJ)**
- Art. 20, caput: "O aperfeiçoamento da comunicação processual por meio eletrônico, com a correspondente abertura de prazo, se houver, ocorrerá no momento em que o destinatário, por meio do Portal de Serviços, ou por integração automatizada via consumo de API, obtiver acesso ao conteúdo da comunicação." — [CNJ, Consulta 0008391-94.2025.2.00.0000, cópia TRT12](https://portal.trt12.jus.br/sites/default/files/2026-01/Acordao-CNJ-DJE.pdf)
- § 3º: citação sem aperfeiçoamento em 3 dias úteis contados do envio → o sistema gera a informação de ausência de citação (CPC art. 246, § 1º-A). § 3º-A (Res. 569/2024): pessoa jurídica de direito público sem consulta em 10 dias corridos → citada automaticamente no último dia, sem o art. 219 do CPC. § 4º (Res. 569/2024): demais intimações pessoais sem aperfeiçoamento em 10 dias corridos → realizadas automaticamente no último dia (Lei 11.419/2006, art. 5º, § 3º) — [CNJ, Consulta 0008391-94.2025, cópia TRT12](https://portal.trt12.jus.br/sites/default/files/2026-01/Acordao-CNJ-DJE.pdf)
- Tese do CNJ (Plenário Virtual, 18/12/2025, rel. Cons. Renata Gil, unânime): (1) o dia do envio ao Domicílio é excluído e o prazo de consulta corre do dia seguinte (CPC art. 224; Res. 185/2013, art. 21, I); (2) o prazo de 3 dias úteis começa no 1º dia útil após o envio; (3) consultada a citação dentro do prazo, o 5º dia útil seguinte à confirmação é o "dia do começo do prazo" do art. 231, IX, do CPC, excluído da contagem, e o prazo corre no dia útil seguinte; (4) transição de 90 dias para os tribunais ajustarem os sistemas, com validade das contagens antigas nesse período — [CNJ, acórdão, cópia TRT12, juntado em 08/01/2026](https://portal.trt12.jus.br/sites/default/files/2026-01/Acordao-CNJ-DJE.pdf); [TJRJ, Boletim do Conhecimento 04/2026 (Aviso TJ 27/2026)](https://portaltj.tjrj.jus.br/documents/d/portal-conhecimento/boletimdoconhecimento04-1)
- Quadro do TJMG: citação de PF ou PJ privada, 3 dias úteis para ciência, prazo 5 dias úteis após a ciência, sem ciência automática (a vara cita por meio ordinário); citação de PJ pública, 10 dias corridos e ciência automática; intimação pessoal, 10 dias corridos, prazo no dia útil seguinte à ciência, ciência automática — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf)
- CPC art. 246: citação preferencialmente eletrônica em até 2 dias úteis; § 1º-A: sem confirmação em 3 dias úteis, cita-se pelo correio, oficial, escrivão ou edital; § 1º-B: o réu deve dar justa causa na primeira oportunidade; § 1º-C: ato atentatório, multa de até 5% do valor da causa (Lei 14.195/2021). Art. 231, IX: começo do prazo no "quinto dia útil seguinte à confirmação" — [Planalto, CPC](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm)
- Comunicação "distinta da citação" confirmada: prazo começa na data da confirmação, ou no dia útil seguinte se a confirmação cair em dia não útil — [AASP, 21/05/2025](https://www.aasp.org.br/comunicado/atencao-as-novas-regras-sobre-contagem-de-prazos-processuais/) (secundária)

**Quem se cadastra e quem lê**
- Cadastro obrigatório para pessoas jurídicas de direito público e privado, pelo cronograma da Portaria CNJ 46/2024, sob pena de cadastro compulsório pelo CNJ; facultativo para pessoa física — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf). ME e EPP com cadastro na Redesim ficam fora da obrigação — [AASP](https://www.aasp.org.br/comunicado/atencao-as-novas-regras-sobre-contagem-de-prazos-processuais/) (secundária)
- Sem cadastro no Domicílio, a citação de PJ vai pelo módulo procuradoria do PJe (se ela já usava) ou por correio e oficial. Intimação pessoal por "Sistema" vai ao painel do representante no PJe e uma cópia ao Domicílio. A resposta ao expediente é sempre no sistema do tribunal (PJe), nunca no Domicílio — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf)
- Perfis de pessoa jurídica: Administrador (gere usuários), Gestor de Cadastro e Preposto (só lê as comunicações dos CNPJs que o representante liberar); 1 perfil por CPF por instituição. Pessoa física: "Minhas comunicações" e "Meus representados". Advogados e representantes ativos nos autos veem as comunicações do CNPJ por "Meus representados", com certificado ou gov.br, sem cadastro prévio pela empresa — [CNJ, Manual do Usuário do Domicílio, 3ª ed., 2025](https://www.cnj.jus.br/wp-content/uploads/2025/02/manual-domicilio-ed3-2025-1.pdf) (resumo do buscador; PDF não aberto)
- A AASP não acessa o Domicílio e diz que ele não serve para intimar advogados — [AASP](https://www.aasp.org.br/comunicado/atencao-as-novas-regras-sobre-contagem-de-prazos-processuais/) (secundária)

**API e estados**
- 2 grupos de API: "Domicílio Eletrônico" (destinatário lê e registra ciência) e "Comunicações Processuais" (tribunal envia). Credencial gerada na tela ("Gerenciar credenciais API") por titular do CNPJ com certificado; token no SSO do CNJ com `client_id`, `client_secret` e `grant_type=client_credentials`; todo pedido leva o cabeçalho `On-behalf-Of` com o CPF do usuário, para auditoria — [PDPJ, docs do Domicílio](https://docs.pdpj.jus.br/servicos-negociais/domicilio-judicial-eletronico/)
- Endpoints do destinatário: `GET api/v1/eu` (tenantId); `GET /comunicações` com `dataInicio`/`dataFim` (janela de até 7 dias) ou `numeroProcesso`, paginado; `PUT /processos/{numeroProcesso}/comunicações/{numeroComunicacao}` devolve o conteúdo integral; `GET /processos/{numeroProcesso}/logs` — [PDPJ, docs](https://docs.pdpj.jus.br/servicos-negociais/domicilio-judicial-eletronico/)
- Estados documentados: "em curso" (janela de leitura aberta), "ciente", "expirado" (citação com prazo vencido) e "cancelado" (retirada pelo tribunal, só antes da ciência). Webhook "DomicilioJudicialEletronico" com eventos `comunicacaoAberta` (ciência por abertura ou tácita) e `citacaoExpirada`, assinado com HMAC-SHA256 no cabeçalho `X-PDPJ-Webhook-Signature`. O tribunal roda os jobs de ciência tácita (não citações) e de expiração (citações) — [PDPJ, docs](https://docs.pdpj.jus.br/servicos-negociais/domicilio-judicial-eletronico/)
- Novo modelo de credencial da API: obrigatório até 31/03/2026 para todo sistema com conexão automatizada; quem não gerou nova credencial fica impedido de receber e acompanhar as comunicações — [Migalhas, 18/03/2026, citando o CNJ](https://www.migalhas.com.br/quentes/452143/empresas-devem-regularizar-acesso-ao-dje-ate-31-de-marco) (secundária); [CNJ, notícia](https://www.cnj.jus.br/empresas-tem-ate-31-de-marco-para-regularizar-acesso-ao-domicilio-judicial-eletronico/) (resumo do buscador)

### Inferences
- Exemplo pela tese do CNJ (sem feriado local): citação de empresa enviada na terça 04/08/2026. Janela de 3 dias úteis: 05, 06 e 07/08. Consultada na quarta 05/08: 5º dia útil seguinte = 12/08 ("dia do começo", excluído); a contestação de 15 dias úteis corre de 13/08 e vence em 02/09/2026.
- A leitura do conteúdo pela API (o `PUT` que devolve o conteúdo) tende a disparar a ciência pelo art. 20. A captura deve separar "listar" (metadados, sem ciência) de "abrir o teor" (gera ciência e começa prazo). A tela precisa avisar antes de abrir e registrar quem abriu (CPF do `On-behalf-Of`).
- Estados que a tela pode usar: Aguardando ciência (em curso, com contagem regressiva de 3 dias úteis ou 10 corridos), Ciente (data e quem), Ciência automática (10 dias corridos vencidos), Citação expirada (vai por outro meio; risco de multa de 5% sem justa causa) e Cancelada.
- O Domicílio não serve para responder: a resposta é no sistema do tribunal. A captura só lê; a ação nasce em outro lugar.

### Gaps
- Se a listagem `GET /comunicações` já devolve teor ou só metadados, e se ela registra ciência: a documentação do PDPJ é ambígua (diz que a ciência ocorre ao abrir a URL e também que o tribunal registra a ciência).
- Mecanismo exato do modelo de credencial de 2026 (mudanças em relação a `client_credentials`): não descrito nas fontes abertas.
- Data de publicação do acórdão do CNJ e, portanto, o fim exato da transição de 90 dias (o acórdão foi juntado ao PROAD do TRT12 em 08/01/2026; o fim fica perto de abril de 2026 por inferência).
- Status "pendente de ciência" e "ciência tácita" como rótulos literais: não aparecem na documentação; os rótulos oficiais são em curso, ciente, expirado e cancelado.

## 3. Diários estaduais, tribunais fora do DJEN e diários administrativos

### Takeaway
Em 2026 quase todos os tribunais publicam no DJEN. As exceções são o STF (a Res. 455/2022 não o alcança, e ele mantém DJe próprio) e, pelo que a API mostra, a Justiça Eleitoral, que só põe editais no DJEN. Diários de órgãos administrativos (TCU, INPI, Receita) seguem fora do DJEN, cada um com sua regra de data.

### Cited Findings
- Res. 455/2022: suas normas "não alcançam o Supremo Tribunal Federal, que pode integrar-se voluntariamente"; o DJEN é obrigatório para as demais cortes, inclusive as superiores — [Conjur, 16/05/2025](https://conjur.com.br/2025-mai-16/saiba-o-que-muda-com-a-nova-sistematica-para-comunicacoes-e-prazos-judiciais-2/) (secundária, resumo do buscador)
- O DJe do STF segue a Res. STF 700/2020, em HTML, de segunda a sexta a partir das 19h — [Res. STF 700/2020, cópia TSE](https://sintse.tse.jus.br/documentos/2020/Ago/14/diario-da-justica-eletronico-stf-edicao-extra/resolucao-no-700-de-13-de-agosto-de-2020-altera-o-formato-do-diario-de-justica-eletronico-do-supremo) (resumo do buscador)
- O caderno do STF no DJEN em 23/10/2026 tem status "Sem comunicações", total 0 — [API DJEN, caderno STF](https://comunicaapi.pje.jus.br/api/v1/caderno/STF/2026-10-23/D) (medido)
- Em 23/10/2026, TJSP, TJRJ, TRF3, TRT2, TJDFT, TJPR, TJAM e TJMG chegaram ao teto de 10.000 no contador; o STM teve 40. TSE e TRE-SP tiveram só editais em outubro de 2026 (5 e 4 no mês) — [API DJEN](https://comunicaapi.pje.jus.br/api/v1/comunicacao?siglaTribunal=TSE&dataDisponibilizacaoInicio=2026-10-01&dataDisponibilizacaoFim=2026-10-23&itensPorPagina=1) (medido)
- Tribunal não integrado mantém diário próprio, e o advogado vigia 2 canais — [AdvogaFlow, glossário](https://advogaflow.com/glossario/djen/) (secundária, comercial)
- TCU: o Diário Eletrônico do TCU passou a ser o meio oficial de notificação de acórdãos a advogados privados (Res. TCU 360/2023), com ciência na data da publicação; citações, audiências, oitivas e diligências seguem por ofício, e as respostas vão pelo Conecta-TCU — [TCU, notícia](https://portal.tcu.gov.br/imprensa/noticias/tcu-vai-utilizar-diario-eletronico-para-notificacoes-processuais-a-partir-de-agosto) (resumo do buscador; o ano de início não aparece no trecho)
- INPI: a Revista da Propriedade Industrial (RPI) sai toda terça-feira (feriado: 1º dia útil seguinte); os prazos começam no 1º dia útil após a publicação e correm em dias corridos; o TXT da RPI não é meio oficial; vigiar a RPI é dever do depositante — [INPI, minuta do manual de DI](https://www.gov.br/inpi/pt-br/assuntos/desenhos-industriais/arquivos/MinutaManualDI_cap01.pdf/@@download/file); [INPI, card de acompanhamento](https://www.gov.br/inpi/pt-br/uso-estrategico-da-pi/inpi-para-empreender-e-inovar/pdfs-pi-em-novos-formatos/card-como-acompanhar-o-seu-pedido-no-inpi.pdf) (resumo do buscador; minuta em consulta pública)
- Receita Federal (processo administrativo fiscal): Decreto 70.235/1972, art. 23, § 2º, III — intimação no domicílio tributário eletrônico se dá em 15 dias da data registrada no comprovante de entrega, ou antes, na data em que o contribuinte consultar a caixa postal; o domicílio eletrônico depende de opção do contribuinte — [Legjur, art. 23 do Decreto 70.235](https://www.legjur.com/legislacao/art/dec_00702351972-23) (secundária, reproduz a norma); [IN SRF 664/2006, Legisweb](https://www.legisweb.com.br/legislacao/?id=76756) (secundária)

### Inferences
- A tela de fontes da captura pode ter 3 grupos: DJEN (todos os tribunais exceto STF e parte da Eleitoral), Domicílio (citação e intimação pessoal da empresa) e fontes avulsas (DJe do STF, DJe eleitoral, Diário do TCU, RPI do INPI, caixa postal da Receita), cada uma com a própria regra de data.
- No INPI e na Receita a contagem é em dias corridos; o produto não pode aplicar o calendário de dias úteis do CPC a essas fontes.

### Gaps
- Lista oficial e atual dos tribunais integrados ao DJEN: o portal jus.br a publica, mas não foi aberto; o PDF do CNJ "Prazos Integração DJE e DJEN" deu 403.
- DOU, diários estaduais e municipais (licitação, Procon, agências), CARF e Procon: nenhuma fonte primária reunida nesta rodada sobre regra de intimação e data.
- Se o TSE e os TREs mantêm DJe próprio para intimações (a API mostra só editais, mas a norma eleitoral não foi conferida).

## 4. Intimação nos portais dos tribunais (PJe, eproc, eSAJ, Projudi) e ciência tácita

### Takeaway
A intimação em portal (Lei 11.419/2006, art. 5º) vale hoje para quem tem intimação pessoal (Fazenda, MP, Defensoria, procuradorias, auxiliares, jus postulandi). Para advogado privado, desde 2025 o portal é só informativo. A consulta tem 10 dias corridos; sem ela, a intimação se considera feita no último dia.

### Cited Findings
- Lei 11.419/2006, art. 5º, § 3º: "A consulta referida nos §§ 1º e 2º deste artigo deverá ser feita em até 10 (dez) dias corridos contados da data do envio da intimação, sob pena de considerar-se a intimação automaticamente realizada na data do término desse prazo" — [CNJ, Consulta 0008391-94.2025, cópia TRT12](https://portal.trt12.jus.br/sites/default/files/2026-01/Acordao-CNJ-DJE.pdf)
- Res. CNJ 185/2013, art. 21, I: no PJe, o dia inicial dos 10 dias é o dia seguinte ao da disponibilização, haja ou não expediente — [CNJ, Consulta 0008391-94.2025, cópia TRT12](https://portal.trt12.jus.br/sites/default/files/2026-01/Acordao-CNJ-DJE.pdf)
- STJ, 5ª Turma, AREsp 2.492.606 (rel. Min. Messod Azulay Neto; notícia de 10/10/2025): os 10 dias corridos contam da data do envio, correm em feriado e dia não útil e não se adiam para o dia útil seguinte; no caso, envio em 04/04/2023 → intimação automática em 13/04/2023 — [STJ, notícia](https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/10102025-Prazo-de-dez-dias-corridos-para-consulta-eletronica-de-intimacao-e-contado-da-data-do-seu-envio-.aspx)
- Advocacia privada deixou de ser intimada pelo PJe no TJMG; seguem pelo "Sistema" Fazenda, MP, Defensoria, AGE, procuradorias, Polícia Civil, auxiliares, cartórios, NPJ e jus postulandi sem cadastro no Domicílio — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf)
- O método de 10 dias no portal não se aplica mais à intimação de advogado — [AASP](https://www.aasp.org.br/comunicado/atencao-as-novas-regras-sobre-contagem-de-prazos-processuais/) (secundária)

### Inferences
- O AREsp 2.492.606 conta o dia do envio (04/04 → 13/04), e a tese do CNJ de 18/12/2025 manda excluir o dia do envio. A diferença é de 1 dia. Até o tema se pacificar, o produto deve calcular pela regra mais curta e mostrar a outra como referência.
- Para a empresa, o portal só importa quando ela não tem cadastro no Domicílio e recebe pelo módulo procuradoria do PJe; para o escritório, o portal é aviso, e o prazo vem do DJEN.

### Gaps
- Como ferramentas de captura leem portais com certificado A1 ou procuração eletrônica (modelo técnico e limites de cada sistema: PJe, eproc, eSAJ, Projudi): nenhuma fonte confiável reunida.
- Regras próprias do eSAJ (TJSP) e do Projudi sobre ciência no portal após 2025: não conferidas.

## 5. Conflito entre meios: qual data vale

### Takeaway
A regra normativa em 2026 é a da Res. 455/2022 com a Res. 569/2024: o DJEN vale, e o outro meio tem valor informativo. O STJ ainda não fechou o Tema 1.180 (marco do prazo com intimação dupla). O precedente de 2021 dava prevalência ao portal, e o voto do relator em 2025 conta pela data do acesso ao portal quando ele vem antes. Para quem tem intimação pessoal (Defensoria), o STJ manda contar pela intimação pessoal.

### Cited Findings
- Res. 455/2022, art. 11, § 2º (Res. 569/2024): o DJEN substitui qualquer outro meio oficial; outros meios têm valor "meramente informativo" — [TJMG, Protocolo, ago/2025](https://tjmg.jus.br/data/files/D4/44/4E/4A/FB82B91042A101B99128CCA8/Protocolo%20DJEN%20e%20Domicilio%20Judicial%20Eletronico%20_externos_%20-%20Ago%2025.pdf)
- STJ, Corte Especial, EAREsp 1.663.952/RJ (2021, regra anterior ao DJEN): com intimação válida no portal e no DJe, prevalece o portal — [STJ, notícia de 21/05/2021](https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/21052021-Corte-Especial-no-caso-de-duplicidade-de-intimacoes-validas--prevalece-aquela-realizada-no-portal-eletronico--.aspx) (resumo do buscador)
- Tema 1.180 (REsp 1.995.908/DF e REsp 2.004.485/SP, afetados em 24/02/2023): "Definir o marco inicial do prazo recursal nos casos de intimação eletrônica e de publicação no Diário da Justiça eletrônico"; situação "Em julgamento", sem tese, página atualizada em 06/04/2026 — [STJ, Tema 1.180](https://processo.stj.jus.br/repetitivos/temas_repetitivos/pesquisa.jsp?novaConsulta=true&tipo_pesquisa=T&cod_tema_inicial=1180&cod_tema_final=1180)
- Em 20/08/2025, o relator, Min. João Otávio de Noronha, votou por contar o prazo da data do acesso ao portal quando ele ocorrer antes da publicação no DJe, dizendo que a proposta condiz com as Res. 455/2022 e 569/2024; pedido de vista do Min. Sebastião Reis Júnior — [Conjur, 25/08/2025](https://conjur.com.br/2025-ago-25/stj-avalia-inicio-do-prazo-recursal-em-caso-de-dupla-intimacao-eletronica/) (secundária, resumo do buscador; página deu 403)
- STJ, 3ª Seção, EREsp 1.803.891 (rel. Min. Rogerio Schietti; notícia de 06/11/2025): com intimação dupla da Defensoria, prevalece a intimação eletrônica pessoal sobre o DJe (Lei 11.419/2006, art. 4º, § 2º, que ressalva os casos de intimação pessoal) — [STJ, notícia](https://www.stj.jus.br/sites/portalp/Paginas/Comunicacao/Noticias/2025/06112025-Data-da-intimacao-eletronica-pessoal-da-Defensoria-Publica-prevalece-para-contagem-de-prazo.aspx)
- TJPA, TJRJ e uma ementa de recurso de revista do TST aplicam o art. 11 da Res. 455/2022: a intimação pelo PJe é informativa e não muda o prazo; o TJRJ diz que a duplicidade não é justa causa para alterar o prazo — [Jusbrasil, busca "intimação publicada no DJEN"](https://www.jusbrasil.com.br/jurisprudencia/busca?q=intima%C3%A7%C3%A3o+publicada+no+djen) (secundária; números dos acórdãos não confirmados)
- A OAB-RS questionou a Res. 569/2024 por possível conflito com o art. 5º da Lei 11.419/2006 — [Judit, Eproc vs DJEN](https://judit.io/blog/gestao-juridica-legal-operations/intimacao-eletronica-eproc-vs-djen-o-que-diz-o-stj/) (secundária)

### Inferences
- Regra para o produto: a data oficial é a do meio que a norma manda (DJEN para advogado; Domicílio ou portal para intimação pessoal), e a data de alerta é a mais cedo entre todos os meios capturados. A tela mostra as 2 e destaca quando divergem ("o portal registrou ciência antes do DJEN"). Se o Tema 1.180 adotar o voto do relator, a data mais cedo vira a oficial em parte dos casos, e o campo já existe.
- Deduplicação entre meios por número CNJ, órgão e data aproximada; o `hash` do DJEN e o `numeroComunicacao` do Domicílio são ids de cada fonte, não do ato.

### Gaps
- Resultado do Tema 1.180 após 06/04/2026: sem fonte.
- Acórdãos do TST e do STJ de 2025-2026 que apliquem o "valor meramente informativo" do art. 11 com número e data: não confirmados em fonte primária.

## 6. DataJud, PDPJ-Br e portal jus.br

### Takeaway
O DataJud tem uma API pública de metadados (classe, assuntos e movimentos pela TPU) com chave pública, um endpoint por tribunal e exclusão de processos sigilosos. Ele não traz o teor da comunicação nem os destinatários, então não serve para iniciar prazo. O jus.br (Portal de Serviços) reúne consulta processual e "Minhas Comunicações" (DJEN e Domicílio) para advogados.

### Cited Findings
- Endpoint por tribunal `api_publica_<alias>/_search` (ex.: `api_publica_tjpe`, `api_publica_trt4`) — [TJPE, dados abertos](https://portal.tjpe.jus.br/web/transparencia/tic/dados-abertos); [TRT4](https://www.trt4.jus.br/portais/trt4/relatorios-em-formatos-abertos) (resumo do buscador)
- Autenticação por chave pública do CNJ no cabeçalho `Authorization: APIKey`; o CNJ pode trocar a chave a qualquer momento; referência na wiki do DataJud — [TRT3, DataJud](https://portal.trt3.jus.br/internet/transparencia/tecnologia-da-informacao/dados-api/datajud) (resumo do buscador); [wiki DataJud](https://datajud-wiki.cnj.jus.br/api-publica/) (deu 403)
- Portaria do CNJ de 2026 manda a API fornecer classe e assuntos pela TPU e movimentos pela TPU quando parametrizados — [CNJ, ato de 2026](https://atos.cnj.jus.br/files/original144713202608196a85c1f168ce3.pdf) (resumo do buscador; PDF não aberto)
- A API protege processos sigilosos e dados das partes — [CNJ, API Pública](https://www.cnj.jus.br/sistemas/datajud/api-publica/) (resumo do buscador)
- Portal de Serviços do Poder Judiciário (jus.br), instituído pela Res. 455/2022: consulta unificada, peticionamento intercorrente e comunicações com login único; no ar desde 02/12/2024 — [PNUD](https://www.undp.org/pt/node/497421) (secundária). Para advogados, acesso por gov.br ouro ou certificado, com "Minhas Comunicações" (DJEN e Domicílio) — [CNJ, folder jus.br OAB 2025](https://cnj.jus.br/wp-content/uploads/2025/03/folder-jus-br-oab-2025-ajustado.pdf) (resumo do buscador). A Res. CNJ 624/2025 ampliou o portal a usuários externos e internos — [CNJ, Res. 455 compilada](https://atos.cnj.jus.br/files/compilado18070620250603683f39ca8ca16.pdf) (resumo do buscador)

### Inferences
- DataJud serve para enriquecer o processo (classe, assunto, último movimento) e para avisar "houve movimento", nunca para fixar data de prazo.
- O jus.br é a tela que a empresa e o advogado já usam para ver DJEN e Domicílio juntos; a captura compete com ele em consolidação, alerta e cálculo de prazo.

### Gaps
- Defasagem do DataJud em relação ao tribunal: sem fonte oficial.
- Paginação (`search_after`, tamanho máximo) e lista completa de aliases: a wiki deu 403.
- Acesso da empresa (não advogado) ao jus.br e APIs do PDPJ além do Domicílio: sem fonte.

## 7. Regras que mudam a data

### Takeaway
O cálculo usa dias úteis no CPC, na CLT e nos Juizados, e dias corridos no CPP, no INPI e na Receita. Ele soma o prazo em dobro de MP, Fazenda e Defensoria (e de litisconsortes só em autos físicos), suspende de 20/12 a 20/01, desconta feriados locais e indisponibilidades do sistema e, desde 2024, aceita comprovar o feriado local depois.

### Cited Findings
- CPC art. 219: só dias úteis, só para prazos processuais. Art. 220: suspensão de 20/12 a 20/01, inclusive, sem audiências nem sessões. Art. 224: exclui o dia do começo e inclui o do vencimento; prorroga se cair em dia sem expediente ou com expediente encerrado antes ou iniciado depois do normal ou com indisponibilidade da comunicação eletrônica — [Planalto, CPC](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm)
- Prazo em dobro: MP (art. 180), Fazenda Pública (art. 183, com intimação pessoal por carga, remessa ou meio eletrônico), Defensoria (art. 186, contado da intimação pessoal do defensor); não vale quando a lei fixa prazo próprio. Litisconsortes com advogados diferentes de escritórios distintos (art. 229), mas o § 2º exclui os autos eletrônicos e o § 1º faz cessar o dobro se, com 2 réus, só 1 se defende — [Planalto, CPC](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm)
- CPC art. 231: começo do prazo por meio (I correio: juntada do AR; II oficial: juntada do mandado; IV edital: dia útil após a dilação; V eletrônico: dia útil seguinte à consulta ou ao fim do prazo de consulta; VII Diário: data de publicação; IX citação eletrônica: 5º dia útil após a confirmação). § 2º: com mais de um intimado, prazo individual — [Planalto, CPC](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm)
- Indisponibilidade: Res. CNJ 185/2013, art. 11 — prazo que vence no dia é prorrogado ao dia útil seguinte se a indisponibilidade passar de 60 minutos (seguidos ou não) entre 6h e 23h, ou se ocorrer entre 23h e 24h; Lei 11.419/2006, art. 10, § 2º. Não prorroga: falha em fim de semana, feriado ou entre 0h e 6h, nem problema do equipamento do usuário — [TRT2, notícia](https://ww2.trt2.jus.br/noticias/noticias/noticia/saiba-quando-a-indisponibilidade-no-pje-resulta-em-prorrogacao-de-prazos-processuais) (resumo do buscador); [AASP, TJDFT prorroga prazos](https://www.aasp.org.br/?p=32109) (secundária). A prorrogação depende de prova técnica; aviso genérico de manutenção não basta (TJBA) — [Legjur, TJBA](https://www.legjur.com/jurisprudencia/eme/829.3804.5197.7945) (secundária)
- Feriado local: a Lei 14.939/2024 (30/07/2024) alterou o art. 1.003, § 6º, do CPC: sem prova do feriado local na interposição, o tribunal manda corrigir ou desconsidera a falta se a informação já constar dos autos eletrônicos — [Conjur, 2024](https://www.conjur.com.br/?p=808270) (secundária). A Corte Especial do STJ, por 7 a 6, aplicou a lei a recursos anteriores (Informativo 841) — [Conjur, fev/2025](https://www.conjur.com.br/?p=834971); [Damásio, Inf. 841](https://juris.damasio.com.br/jurisprudencia/julgado/841/comprovacao-de-feriado-local-e-aplicacao-temporal-da-lei-14-939-2024-a-recursos-anteriores) (secundárias)
- CLT art. 775 (Lei 13.467/2017): prazos em dias úteis, excluído o dia do começo. CPP art. 798: prazos contínuos e peremptórios, que não se interrompem em férias, domingo ou feriado. Lei 9.099/1995, art. 12-A (Lei 13.728/2018): Juizados contam só dias úteis, inclusive para recurso; a aplicação ao Juizado criminal é debatida — [Dizer o Direito, 01/11/2018](https://www.dizerodireito.com.br/2018/11/comentarios-ao-novo-art-12-da-lei.html); [Empório do Direito](https://emporiododireito.com.br/leitura/a-contagem-dos-prazos-no-processo-penal-a-alteracao-na-lei-n-9-099-95) (secundárias)
- Mudanças de lei em 2025-2026 que tocam a data: a única alteração recente do CPC achada, a Lei 15.479/2026, trata de transferência automática de pensão alimentícia (arts. 196, 529-A e 913) e vigora em 31/07/2027 — [Senado, Lei 15.479/2026](https://legis.senado.leg.br/norma/43611689); [Legjur](https://www.legjur.com/legislacao/htm/lei_00154792026) (resumo do buscador)

### Inferences
- O motor de data precisa, por processo: rito (CPC, CLT, CPP, Juizado, administrativo), calendário do tribunal (feriados nacionais, estaduais, municipais e da comarca), suspensões (20/12 a 20/01 e portarias do tribunal), indisponibilidades certificadas e o tipo de destinatário (para o dobro).
- O dobro do art. 229 não se aplica a processo eletrônico, que é quase todo o acervo de 2026; o campo "autos físicos" decide.
- Indisponibilidade só prorroga o prazo que vence no dia da falha: o produto marca o dia e recalcula só os prazos que vencem nele.

### Gaps
- Texto literal do art. 1.003, § 6º, com a redação da Lei 14.939/2024: não aberto no Planalto.
- Calendários oficiais de feriados por tribunal em formato de máquina: sem fonte nacional; o DJEN usa "feriados cadastrados no sistema processual", que não é público pela API.
- A busca mencionou suspensão de prazos "do CNJ" de 20/12/2025 a 31/01/2026 e de 2 a 31/07/2026; parece valer só para os processos do próprio CNJ e não foi conferida.

## 8. Responsabilidade quando a captura perde uma publicação

### Takeaway
Para o STJ, a falha de quem acompanha o processo não devolve o prazo: o advogado responde pela intimação oficial. Só a informação errada publicada pelo próprio tribunal pode ser justa causa. Não foi achado precedente específico sobre fornecedor de captura; os análogos (Correios) mostram que o prestador pode responder ao cliente, mas o prazo perdido não volta.

### Cited Findings
- STJ: atraso ou omissão do andamento no site do tribunal não é justa causa para devolver o prazo; informação errada no site, que induz a parte a erro, é justa causa (Corte Especial, REsp 1.324.432/SC, rel. Min. Herman Benjamin, 17/12/2012) — [Dizer o Direito](https://www.dizerodireito.com.br/2020/05/e-possivel-afastar-intempestividade-do.html) (secundária)
- STJ, Corte Especial (2019): erro de cálculo do prazo pelo próprio PJe afastou a intempestividade, como "erro judiciário" — [Wagner Advogados](https://wagner.adv.br/?p=47424) (secundária)
- TJRJ: a duplicidade de intimações não é justa causa para alterar o prazo recursal — [Jusbrasil, busca](https://www.jusbrasil.com.br/jurisprudencia/busca?q=intima%C3%A7%C3%A3o+publicada+no+djen) (secundária)
- STJ, 4ª Turma: os Correios indenizaram advogado que perdeu prazo por atraso na entrega de Sedex; a responsabilidade do advogado pelo prazo não afasta a do prestador pelo serviço defeituoso — [Migalhas](https://www.migalhas.com.br/quentes/165906/correios-indenizarao-advogado-que-perdeu-prazo-por-atraso-em-postagem) (secundária)
- TJRS condenou advogados a indenizar cliente por perda de prazo de apelação (perda de uma chance) — [Migalhas](https://www.migalhas.com.br/quentes/36242/perda-de-prazo-processual-leva-a-condenacao-de-advogados--decide-tj-rs) (secundária)
- INPI: vigiar publicações e prazos é responsabilidade do depositante — [INPI, minuta do manual de DI](https://www.gov.br/inpi/pt-br/assuntos/desenhos-industriais/arquivos/MinutaManualDI_cap01.pdf/@@download/file) (resumo do buscador)

### Inferences
- A captura é ferramenta de apoio; a fonte oficial manda. A tela deve mostrar de onde veio cada item (DJEN, Domicílio, portal), quando foi a última leitura bem-sucedida de cada fonte e o que falhou, para o usuário saber que precisa conferir por outro caminho.
- O link da certidão do DJEN e o log de ciência do Domicílio são as evidências que o cliente usa se precisar provar a data.

### Gaps
- Nenhum acórdão sobre responsabilidade de fornecedor de captura ou recorte de publicações por perda de prazo foi achado.
- Se a falha do DJEN certificada pelo CNJ (outubro de 2026) gerou devolução de prazo em tribunal além do TJMSP: sem fonte.
