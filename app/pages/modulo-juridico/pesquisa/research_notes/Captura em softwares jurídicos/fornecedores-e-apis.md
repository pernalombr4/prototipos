# Fornecedores brasileiros de captura jurídica e suas APIs (2024-2026)

Acesso a todas as fontes: 2026-10-26, sem login e sem cadastro. Onde a fonte é anterior a 2024 ou mostra exemplo antigo, a linha diz.
Fontes de especificação baixadas e lidas no dia: o `openapi.json` e o `llm-ready.jsonl` das docs v1 e v2 do Escavador, a spec OpenAPI do serviço de tracking da Judit e 1 chamada à API pública do DJEN (só os nomes dos campos entram aqui; nenhum dado pessoal da resposta foi copiado).

Legenda de confiança: "doc técnica" é a documentação de API do próprio fornecedor; "site" é página comercial; "terceiro" é blog de concorrente ou resumo de busca.

## 1. O que cada fornecedor captura (DJEN/DJE, diários administrativos, Domicílio Judicial, intimações em portais, andamentos, distribuição, autos, DET)

### Takeaway
O mercado se divide em 2 grupos. As **APIs de dados** (Escavador, Judit, Jusbrasil Soluções, Codilo, BigDataCorp) entregam andamento, distribuição e publicação de diário por API e webhook. As **centrais de recorte e intimação** (Alerte, Kurier, Solucionare, iPrazos, Intelivix) entram também em portais com credencial do cliente (Domicílio Judicial, DET, PJe, eSAJ) e entregam por e-mail, portal ou API sem documentação pública. Nenhuma API pública de "dados" cobre DET nem Domicílio Judicial; só as centrais cobrem.

### Cited Findings

**Linha de base: o DJEN público (fonte oficial, sem fornecedor)**
- A API pública do DJEN (`comunicaapi.pje.jus.br/api/v1/comunicacao`) responde sem autenticação a filtros como `siglaTribunal` e `dataDisponibilizacaoInicio`/`Fim`. Cada item traz `id`, `hash`, `data_disponibilizacao`, `siglaTribunal`, `tipoComunicacao` (ex.: "Citação"), `nomeOrgao`, `idOrgao`, `texto`, `numero_processo`, `numeroprocessocommascara`, `meio` ("D"), `meiocompleto` ("Diário de Justiça Eletrônico Nacional"), `link` (para o processo no sistema do tribunal), `tipoDocumento`, `nomeClasse`, `codigoClasse`, `numeroComunicacao`, `ativo`, `status`, `motivo_cancelamento`, `data_cancelamento`, `destinatarios[]` (nome, polo) e `destinatarioadvogados[]`. Medido em 2026-10-26 com 1 chamada; o cabeçalho devolveu `X-RateLimit-Limit: 20` e o `count` veio limitado a 10000 — [API DJEN](https://comunicaapi.pje.jus.br/api/v1/comunicacao?siglaTribunal=TJSP&dataDisponibilizacaoInicio=2026-10-20&dataDisponibilizacaoFim=2026-10-20&itensPorPagina=1&pagina=1)
- A página Swagger do DJEN devolveu HTTP 403 ao WebFetch (fora do Brasil); a chamada direta da máquina local funcionou — [Swagger DJEN](https://comunicaapi.pje.jus.br/swagger/index.html)
- Empresas e órgãos que recebem o Domicílio Judicial Eletrônico por integração via API tiveram de gerar nova credencial e trocar o método de login até 31/3/2026; quem não se adequou perde o acesso à plataforma (notícia de 24/03/2026) — [TRT-2](https://ww2.trt2.jus.br/noticias/noticias/noticia/empresas-e-orgaos-publicos-tem-ate-31-de-marco-para-atualizar-acesso-ao-domicilio-judicial-eletronico)

**Escavador (doc técnica)**
- API v1: "busca e monitoramento de processos, pessoas e empresas, além de consulta e monitoramento em diários oficiais"; API v2: busca de processos com mais dados estruturados — [Escavador v2 docs](https://api.escavador.com/v2/docs/)
- v2 tem: processo por CNJ, movimentações, processos por envolvido (nome ou CPF/CNPJ), por advogado (OAB), solicitar atualização (individual e em lote), documentos públicos, autos (públicos e restritos), download de documento, certificados digitais com "autenticações" por sistema de tribunal, monitoramento de processos e monitoramento de novos processos — [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json)
- O monitoramento de processo da v2 vigia "nos tribunais e diários oficiais"; a movimentação traz `tipo` = ANDAMENTO ou PUBLICACAO e `fonte.tipo` = TRIBUNAL ou DIARIO_OFICIAL — [Escavador LLM-ready v2](https://api.escavador.com/v2/docs/llm-ready.jsonl)
- O monitoramento de novos processos procura o termo "nas capas e nos envolvidos dos processos" (distribuição por nome ou CPF/CNPJ) — [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json)
- v1 tem monitoramento de diários por `termo` ou por `processo`, lista de diários monitorados (`/monitoramentos/{id}/origens`), aparições (`/monitoramentos/{id}/aparicoes`) e download do PDF da página do diário (`/api/v1/diarios/{id}/pdf/pagina/{pagina}/baixar`) — [Escavador LLM-ready v1](https://api.escavador.com/v1/docs/llm-ready.jsonl)
- Não encontrei DET, Domicílio Judicial nem intimação de portal com certificado como produto de captura do Escavador; os endpoints de certificado servem à consulta de autos restritos — [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json)

**Judit (doc técnica)**
- Cobre Justiça Estadual, Federal, Trabalhista, Eleitoral, Militar, Superior e BNMP; serviços `requests` (consulta assíncrona), `tracking` (monitoramento), `lawsuits` (datalake síncrono) e `crawler` (Cofre de Credenciais para login em tribunais) — [Judit llms.txt](https://docs.judit.io/llms.txt)
- `search_type` do tracking aceita `cpf`, `cnpj`, `oab`, `name`, `rji`, `lawsuit_cnj`, `lawsuit_attachment`, `execution_attachment`, `custom`; `response_type` aceita `lawsuit`, `lawsuits`, `warrant`, `execution`, `entity`, `sanction` e `communication`. O item monitorado tem o campo `communication_hash` — [Judit Tracking OpenAPI](https://tracking.production.judit.io/docs/spec)
- A doc de monitoramento lista "monitoramento de comunicação" entre os tipos cobrados por item, ao lado de documento, documento público e personalizado — [Judit Monitoramento](https://docs.judit.io/tracking/tracking.md)
- Anexos (`with_attachments`) só voltam quando `search_type` é `lawsuit_cnj` — [Judit Monitoramento](https://docs.judit.io/tracking/tracking.md)
- O índice da doc não tem página própria de diários nem de "distribuição"; a distribuição aparece como filtro (`distribution_date_gte`) e como campo `distribution_date` do item monitorado — [Judit llms.txt](https://docs.judit.io/llms.txt); [Judit Tracking OpenAPI](https://tracking.production.judit.io/docs/spec)

**Jusbrasil Soluções / ex-Digesto (doc técnica de 2024 + site)**
- A doc de diários separa **recortes** (judiciais, com metadados) e **páginas inteiras** (judiciais e não judiciais, por termo); 3 módulos: Monitoramento de Processos, de Distribuições e de Termos. Rodapé "© 2024"; exemplos de 2017 e 2021 — [Jusbrasil Diários: monitoramento](https://api.jusbrasil.com.br/docs/diarios_oficiais/monitoramento.html)
- O cadastro de processo para monitoramento é hospedado em `op.digesto.com.br`, com a flag `is_monitored_diario` (padrão `true`) — [Jusbrasil Registrando processos](https://api.jusbrasil.com.br/docs/monitoramento_processos/criando_monitoramento.html) (lido pelo resumo da busca)
- Tipos de evento: 1 e 7 andamentos de tribunal; 2 publicações em diários (por parte, OAB, CPF, CNPJ ou palavras, e por processo monitorado); 3 menção de palavra em diário (trecho sem recorte); 4 processo recém-distribuído; 8 problema no monitoramento; 10 CIP do Procon; 13 atualização sob pedido; 18 processos ligados a OAB monitorada; 20 confirmação de verificação — [Jusbrasil Eventos](https://api.jusbrasil.com.br/docs/referencias/eventos.html)
- Site comercial: 96 tribunais, "550+ Diários Oficiais monitorados", distribuição "incluindo autos iniciais em alguns planos" — [Jusbrasil Soluções API](https://conteudo.jusbrasil.com.br/api)

**Codilo (doc técnica)**
- 2 APIs: Consulta (única e automática por CNJ) e Monitoramento (push). O cadastro do push aceita só `cnj`, `callbacks[]` e `ignore`; o processo é verificado "periodicamente" — [Codilo create-push](https://docs.codilo.com.br/api-monitoramento/create-push)
- A consulta automática é "exclusivo para pesquisas pelo tipo CNJ" — [Codilo consulta automática](https://docs.codilo.com.br/api-consulta/consulta-automatica/intro)
- Não encontrei na doc da Codilo diário oficial, distribuição, DET nem Domicílio Judicial — [Codilo sitemap da doc](https://docs.codilo.com.br/sitemap.xml)

**BigDataCorp (doc técnica)**
- Dataset `processes` (Processos Judiciais e Administrativos): por pessoa ou empresa, com `Lawsuits` (Number, CourtName, CourtType, Status, Value), datas (`NoticeDate`, `PublicationDate`, `LastMovementDate`, `CaptureDate`, `LastUpdate`), `Parties` e `Updates` (`Content`, `PublishDate`, `CaptureDate`). A página não oferece monitoramento nem alerta, só consulta pontual; atualizada em 2026-06-08 — [BigDataCorp Processos](https://docs.bigdatacorp.com.br/plataforma/reference/pessoas-processos-judiciais-e-administrativos)
- Há também `owners_lawsuits` (processos dos sócios) e `lawsuits_distribution_data` (contagens agregadas para triagem) — [BigDataCorp Processos dos sócios](https://docs.bigdatacorp.com.br/plataforma/reference/empresas-processos-judiciais-dos-socios); [BigDataCorp Distribuição](https://docs.bigdatacorp.com.br/plataforma/reference/empresas-dados-de-distribuicao-de-processos-judiciais) (lidos pelo resumo da busca)

**Alerte Recortes (site)**
- Produtos: clipping de diário oficial (judicial, executivo e legislativo), intimações em portais (PJe, E-Proc, E-SAJ, Projudi) não publicadas em diário, novas distribuições "antes da publicação oficial ou citação formal", andamentos, Domicílio Judicial Eletrônico, DET, automação de tarefas por robô e solução sob medida — [Alerte](https://www.alerte.com.br/)
- Cobertura declarada: "mais de 400 Diários Oficiais"; PDF de cobertura de 2023 (anterior a 2024) — [Alerte](https://www.alerte.com.br/); [Cobertura Alerte PDF](https://www.alerte.com.br/wp-content/uploads/2023/11/COBERTURA-ALERTE-1.pdf)
- Intimações em portais: PJe, E-Proc, E-SAJ, Projudi, TUCUJURIS, JPe e sistema próprio do TJRJ, com login e senha ou certificado; "com ou sem ciência, e com ou sem inteiro teor" — [Alerte Intimações](https://www.alerte.com.br/intimacoes-juridicas/)
- DET: "comunicações da caixa postal, autos de infração e notificações", com conta do Governo Federal nível Prata ou Ouro. A página não cita E-LIT nem procurações — [Alerte DET](https://www.alerte.com.br/domicilio-eletronico-trabalhista/)

**Intelix: empresa não localizada; o nome mais próximo é Intelivix (site)**
- Nenhuma busca achou empresa "Intelix" de captura jurídica; `intelix.com.br` redireciona para uma empresa de telefonia (Delgrande) — [intelix.com.br](https://www.intelix.com.br/)
- A Intelivix automatiza o Domicílio Judicial (DJE) por RPA com login e senha, faz ciência automática configurável por dia, classifica publicações e distribuições e manda o link ao advogado; clientes como Xerox, Decathlon, Petz, MetLife — [Intelivix](https://www.intelivix.com/)
- O produto Intelivix Publicações captura o DJEN, remove duplicadas e classifica por IA — [Intelivix Publicações](https://www.intelivix.com/publi/)
- O resumo de busca atribui à Intelivix DJE, DET e DJEN; as páginas lidas não citam DET, caixa postal, notificação nem E-LIT — [resumo da busca, Intelivix](https://www.intelivix.com/)

**Kurier (site)**
- Monitora distribuição (estadual, federal, trabalhista e Domicílio Judicial), andamentos, publicações, intimações e baixa; "captura de até 98% dos processos distribuídos nos sites dos Tribunais"; na 2ª instância só pega o processo nascido lá — [Kurier Monitoramento](https://www.kuriertecnologia.com.br/monitoramento-de-processos)
- Kurier DJE: captura citações e intimações do Domicílio e entrega no portal, no Kurier Meridio ou por API — [Kurier DJE (LP de 07/2024)](https://conteudo.kuriertecnologia.com.br/lp-kurier-dje-lamina-1-07-24) (lido pelo resumo da busca)

**Solucionare (site)**
- Produtos: Actos (publicações de todos os tribunais, para recortes e empresas de software), Exodus (andamentos, "sem valor legal" para prazo), Genesis (distribuições, varredura diária por nome), Big Data Judicial (DiscoveryJus e UpdateJus) e V-SAP Web. Opera desde 2008 — [Solucionare](https://www.solucionarelj.com.br/recortes_juridicos/)
- O domínio `solucionare.com.br` é de outra empresa (RH) — [solucionare.com.br](https://www.solucionare.com.br/)

**iPrazos (site)**
- Publicações e andamentos numa caixa única; DJE/DJEN; DET e CNDT; Discovery ("novas ações antes da citação"); portais DJEN, Domicílio Judicial, DET Admin, Consumidor.gov, Procon-SP e Sindec; declara "100% dos tribunais e diários" — [iPrazos](https://www.iprazos.adv.br/)

**Legalcloud (site)**
- Foco em contagem de prazo; tem "Publicações com IA" (captura do DJEN com sugestão de prazo) e monitoramento de andamentos; nenhuma API ou integração aparece na página — [Legalcloud](https://legalcloud.com.br/)

### Inferences
- O DJEN público já entrega, sem custo, o item de publicação com `hash`, `id`, tribunal, data de disponibilização, texto e destinatários. Para publicação judicial nacional, o valor do fornecedor está no casamento de termo, na deduplicação com diários estaduais ainda ativos, na cobertura de diários não judiciais e na garantia operacional.
- Domicílio Judicial, DET e intimação em portal exigem a credencial do cliente. Só as centrais (Alerte, Kurier, Intelivix, iPrazos) vendem isso. O conector da ENSPACE precisa de um cofre de credenciais ou de delegar a credencial ao fornecedor (a Judit tem o "Cofre de Credenciais"; a Alerte guarda login e senha "em portal dotado de criptografia exclusiva").
- "Intelix" pode ser a Intelivix com o nome encurtado pelo cliente. A ENSPACE deve confirmar com o cliente o site ou o CNPJ antes de desenhar o conector.

### Gaps
- Não achei documentação pública da Kurier, da Solucionare, da iPrazos, da Alerte (o "manual de integração" é enviado a pedido) nem da Intelivix.
- Não confirmei se a Judit ou o Escavador capturam o Domicílio Judicial ou o DET.
- Não achei lista de diários com data atualizada (2024-2026) de nenhum fornecedor; a da Alerte é de 2023.
- O E-LIT do DET não aparece em nenhuma página de fornecedor lida.

## 2. Modelo de monitoramento: termo, variações, exclusão, homônimos, frequência e recaptura

### Takeaway
Os modelos têm a mesma forma: 1 chave (CNJ, CPF/CNPJ, OAB, nome ou termo livre), até 2 ou 3 variações, termos auxiliares de inclusão e exclusão, recorte por tribunal ou diário, frequência e teto mensal de resultados. Homônimo é tratado por termos auxiliares e por filtro de parte; nenhum fornecedor documenta desambiguação automática. Recaptura de passado é por flag (`ignore` na Codilo) ou por filtro de data.

### Cited Findings
- Escavador v2, novos processos: `termo` (nome, CPF/CNPJ ou termo da capa), `variacoes` ("até duas variações"), `termos_auxiliares` com `CONTEM`, `NAO_CONTEM` e `CONTEM_ALGUMA`, `tribunais` (siglas; vazio = todos) e `limite_aparicoes` (padrão 10.000 por mês; ao atingir, para de capturar até o mês seguinte; aumento tem custo) — [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json)
- Escavador v2, processo: `numero`, `tribunal` (para forçar outra instância), `frequencia` `DIARIA` (segunda a sexta) ou `SEMANAL` (dia escolhido pelo Escavador), `documentos_publicos`; status PENDENTE, ENCONTRADO ou NAO_ENCONTRADO — [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json)
- Escavador v1, diários: `tipo` `termo` ou `processo`, `origens_ids` (ids dos diários), `variacoes` (máximo 3), `termos_auxiliares` e `limite_aparicoes` (padrão 200 aparições por mês, cobrança a cada 200 adicionais). Monitoramento de tribunal v1: `tipo` `UNICO` (CNJ), `NUMDOC` (CPF, CNPJ ou OAB com `estado_oab`), `NOME`, `ALTERNATIVO` (STF/STJ) — [Escavador LLM-ready v1](https://api.escavador.com/v1/docs/llm-ready.jsonl)
- Judit: `recurrence` em dias; primeira execução em até 24 h; `notification_filters.step_terms` (só notifica se o termo aparece na movimentação); `filter.side` (Passive, Active, Interested, Unknown), `party_names`, `party_documents`, `tribunals` com `not_equal`, assuntos com `contains` e `not_contains`, faixa de valor, `distribution_date_gte/lte`; `with_unique_name_search`, `should_search_as_lawyer` — [Judit Tracking OpenAPI](https://tracking.production.judit.io/docs/spec); [Judit Monitoramento](https://docs.judit.io/tracking/tracking.md)
- Judit: status do monitoramento `created`, `updating`, `updated`, `paused`, `deleted`; pausa automática por teto de consumo ou saldo, reativação manual em `/tracking/{id}/resume` — [Judit Monitoramento](https://docs.judit.io/tracking/tracking.md)
- Jusbrasil, termo em diário: `term` de 3 a 1024 caracteres, sem vírgula, "!" ou "="; `source_ids` (diários); verificação diária. A página não trata variações nem exclusão — [Jusbrasil Diários: monitoramento](https://api.jusbrasil.com.br/docs/diarios_oficiais/monitoramento.html)
- Jusbrasil: evento 8 para pessoa e advogado com motivo "Muitas variacoes de nome."; evento 20 confirma verificação diária na 1ª e 2ª instâncias e a cada 7 dias na 3ª e 4ª — [Jusbrasil Eventos](https://api.jusbrasil.com.br/docs/referencias/eventos.html)
- Codilo: `ignore: true` não envia movimentações anteriores ao cadastro — [Codilo create-push](https://docs.codilo.com.br/api-monitoramento/create-push)
- Alerte: "busca inteligente" tolera "alguns erros de digitação" do diário, com tolerância por nome para limitar falso positivo; variações (nome de solteira, nome fantasia) "precisam ser informados previamente pelo cliente"; a página não trata homônimos — [Alerte Dúvidas](https://www.alerte.com.br/principais-duvidas/)
- Solucionare Genesis: varredura diária de novos processos pelo nome de pessoa ou empresa — [Solucionare](https://www.solucionarelj.com.br/recortes_juridicos/)

### Inferences
- Um modelo comum para o conector: `chave` (tipo + valor + UF da OAB), `variacoes[]`, `incluir[]`, `excluir[]`, `alguma_de[]`, `fontes[]` (tribunais ou diários), `frequencia`, `teto_mensal`, `capturar_passado` (bool ou data inicial). Esses campos mapeiam direto para Escavador, Judit e Jusbrasil.
- O teto mensal (Escavador, Judit) faz a captura parar sem erro. O conector precisa mostrar "monitoramento pausado por teto" como estado de saúde, não como ausência de publicação.

### Gaps
- Não achei, em nenhum fornecedor, janela documentada de recaptura retroativa (backfill) em dias para diários.
- Não achei regra documentada de desambiguação de homônimo além dos termos auxiliares e do filtro por documento.

## 3. Entrega: endpoints, payload do webhook, ids de deduplicação, retentativas, status e limites

### Takeaway
Escavador, Judit, Jusbrasil e Codilo entregam por webhook com retentativa exponencial e id próprio de entrega; Codilo e Escavador têm também confirmação ou listagem de entregas. As centrais (Alerte, Kurier, Solucionare) entregam por e-mail, portal, arquivo e "API" sem contrato público. O item de publicação sempre traz número do processo, fonte (tribunal ou diário, caderno, página), data e texto; o id estável varia por fornecedor.

### Cited Findings

**Escavador**
- Callback por POST JSON; URL cadastrada no painel; token no cabeçalho `Authorization`; se falhar, "mais 10 vezes", 11 tentativas no total, intervalo de 2^n minutos — [Escavador LLM-ready v2, Detalhes dos Callbacks](https://api.escavador.com/v2/docs/llm-ready.jsonl)
- Eventos v2: `novo_processo` (monitoramento, processo), `atualizacao_processo_concluida` (status SUCESSO, NAO_ENCONTRADO ou ERRO), `nova_movimentacao` (com `movimentacao.tipo` ANDAMENTO ou PUBLICACAO e `classificacao_predita` por IA), `novo_documento` (link e chave temporários com `vencimento_link`), `processo_verificado` (`verificado_em`), `processo_encontrado`, `processo_nao_encontrado` — [Escavador LLM-ready v2](https://api.escavador.com/v2/docs/llm-ready.jsonl)
- Movimentação: `id`, `data` (YYYY-MM-DD), `tipo`, `pagina` (do diário), `tipo_publicacao` (ex.: "Intimação"), `conteudo`, `texto_categoria`, `fonte` com `processo_fonte_id`, `fonte_id`, `nome`, `tipo` (TRIBUNAL ou DIARIO_OFICIAL), `sigla`, `grau`, `caderno` e `link_web` (página do diário no site do Escavador) — [Escavador LLM-ready v2, Respostas](https://api.escavador.com/v2/docs/llm-ready.jsonl)
- Gestão de entregas: `GET /api/v2/callbacks` filtra por `data_minima`, `data_maxima`, `evento`, `item_tipo`, `item_id` e `status` (`sucesso`, `em_tentativa`, `erro`); a entrega tem `uuid`, `attempts`, `next_run_at`, `delivered_at`; `POST /callbacks/marcar-recebidos` e `POST /callbacks/{id}/reenviar` — [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json); [Escavador LLM-ready v2](https://api.escavador.com/v2/docs/llm-ready.jsonl)
- Aparição de diário (v1): `id`, `monitoramento_id`, `monitoramento_termo`, `monitoramento_variacoes`, `numero_processo`, `data_diario`, `nome_diario`, `sigla_diario`, `nome_caderno`, `pagina`, `conteudo_snippet` e `movimentacao` (com `diario_oficial_id`, `secao`, `conteudo` em HTML) — [Escavador LLM-ready v1](https://api.escavador.com/v1/docs/llm-ready.jsonl)
- Limite por minuto conforme contrato, compartilhado pela conta; excedeu, HTTP 429 com o tempo de espera na mensagem; custo de cada chamada no cabeçalho `Creditos-Utilizados` (centavos) — [Escavador v2 docs](https://api.escavador.com/v2/docs/)

**Judit**
- Envelope do webhook: `user_id`, `callback_id` (chave de idempotência; a retentativa repete o mesmo), `event_type` (sempre `response_created`), `reference_type` (`request` ou `tracking`), `reference_id`, `payload` com `response_type` (`lawsuit`, `application_info`, `application_error`), `response_data`, `tags.cached_response`, `request_id`, `response_id`, `origin`, `origin_id` — [Judit Webhook](https://docs.judit.io/webhook/callbacks.md)
- A mesma consulta pode gerar 2 entregas: primeiro `cached_response: true` (datalake), depois `false` (coleta nova, "versão definitiva") — [Judit Webhook](https://docs.judit.io/webhook/callbacks.md)
- Retentativa com backoff exponencial em 5xx ou tempo esgotado; responder 200 em menos de 10 s; endpoint fora do ar por muito tempo pode perder evento; não há assinatura documentada, a doc recomenda liberar só os IPs da Judit — [Judit Webhook](https://docs.judit.io/webhook/callbacks.md)
- No monitoramento, cada movimentação gera um webhook com o processo completo — [Judit Monitoramento](https://docs.judit.io/tracking/tracking.md)
- Item monitorado: `tracked_item_id`, `tracking_id`, `tracking_type`, `lawsuit_cnj`, `tribunal_acronym`, `lawsuit_instance`, `communication_hash`, `distribution_date`, `steps_count`, `last_step_date`, `last_step_id`, `related_response_id`, `tracked_side` — [Judit Tracking OpenAPI](https://tracking.production.judit.io/docs/spec)
- Histórico de um monitoramento: `GET /responses/tracking/{id}` com `created_at_gte/lte` — [Judit Monitoramento](https://docs.judit.io/tracking/tracking.md)
- Limite padrão: 180 req/min por API key; 429 com `Retry-After` — [Judit llms.txt](https://docs.judit.io/llms.txt)

**Jusbrasil Soluções**
- Evento: `id`, `evt_type`, `created_at`, `target_url`, `target_number`, `source_url[]`, `source_user_custom` (valores separados por `;`), `api_name` (texto fixo para conferir a origem) e `data` — [Jusbrasil Eventos](https://api.jusbrasil.com.br/docs/referencias/eventos.html)
- Recorte: `recorte_id`, `doc_id`, `processo_id`, `periodico_id`, `proc`, `proc_alt`, `proc_apens`, `partes`, `advs`, `snippet`, `texto`, `secao_diario`, `periodico_diario_slug`, `periodico_caderno_slug`, `num_pag_original`, `docurl`, `cached_docurl` (guardado 30 dias, não exibir ao cliente final), `published_at`, `detected_at`, `available_at` — [Jusbrasil Diários: monitoramento](https://api.jusbrasil.com.br/docs/diarios_oficiais/monitoramento.html)
- Entrega: sucesso só com HTTP 200 em até 10 s; até 13 retentativas, intervalo dobrando a partir de 2 min (a 13ª cai cerca de 5 dias depois); depois disso "o evento é descartado e não será re-enviado"; as chamadas ficam registradas para consulta — [Jusbrasil Webhooks: erros e falhas](https://api.jusbrasil.com.br/docs/webhooks/erros_falhas.html)

**Codilo**
- Callback: `id` (uuid), `cnj`, `ignore`, `createdAt`, `info[]` com `source`, `platform`, `search`, `query`, `lastResponse` e `data[]` com `cover`, `properties`, `people` (com `lawyers`), `steps` (`id`, `timestamp`, `title`, `description`, `index`, `confirmed`) — [Codilo callback](https://docs.codilo.com.br/api-monitoramento/callback)
- O campo `confirmed` indica se o cliente confirmou o item pelo endpoint de confirmação; há também "pendentes" (`pending-push`) e teste de callback; retentativa "até atingir o limite configurado"; cabeçalho `User-Agent: CodiloCallback/1.0` e cabeçalhos próprios do cliente por callback — [Codilo callback](https://docs.codilo.com.br/api-monitoramento/callback); [Codilo intro monitoramento](https://docs.codilo.com.br/api-monitoramento/intro); [Codilo create-push](https://docs.codilo.com.br/api-monitoramento/create-push)

**Centrais**
- Alerte: e-mail e Disco Virtual (retenção de 3 meses); API "sem custo adicional" e manual de integração enviado a pedido; arquivos em DOC, HTML, PDF, XLS, XML ou corpo do e-mail; deduplicação "sem custo adicional", exceto quando o cliente separa por pesquisa — [Alerte Dúvidas](https://www.alerte.com.br/principais-duvidas/)
- Alerte, intimações: "só são enviadas novas intimações", comparadas com envios anteriores; várias contas e portais num envio — [Alerte Intimações](https://www.alerte.com.br/intimacoes-juridicas/)
- Kurier: Portal do Cliente, API REST com JSON e e-mail diário; a página cita "documentação técnica" sem link — [Kurier Monitoramento](https://www.kuriertecnologia.com.br/monitoramento-de-processos)
- Solucionare: integração com empresas de software, e-mail ou entrega física; sem API descrita — [Solucionare](https://www.solucionarelj.com.br/recortes_juridicos/)
- iPrazos: API com Projuris, Legal One, Elaw e ElawIO; outras via programa de parceiros — [iPrazos](https://www.iprazos.adv.br/)
- Intelivix: exportação para planilha; integração opcional que lança nos sistemas web do cliente, contratada à parte — [Intelivix Publicações](https://www.intelivix.com/publi/); integra com Projuris, CPJ, ELAW, TEMIS e Espaider em cerca de 48 h — [Intelivix](https://www.intelivix.com/)

### Inferences
- Chave de deduplicação dentro do fornecedor: `callback_id` (Judit), `uuid` da entrega (Escavador), `id` do evento (Jusbrasil), `id` do callback (Codilo). Chave do item: `movimentacao.id` (Escavador), `recorte_id` (Jusbrasil), `communication_hash` (Judit), `steps[].id` (Codilo). Entre fornecedores, a única chave comum documentada é o `hash` do DJEN (que a Judit expõe como `communication_hash`); para diário estadual, sobra a regra de semelhança (CNJ + data + começo do texto).
- O conector precisa de 3 caminhos de entrada: webhook (Escavador, Judit, Jusbrasil, Codilo), puxada periódica de API ou arquivo (Alerte, Kurier, iPrazos) e e-mail ou planilha (Alerte, Intelivix). Todos convergem no mesmo item normalizado.
- Como a Jusbrasil descarta o evento depois de 13 tentativas e a Judit admite perda com endpoint fora por muito tempo, o conector precisa de reconciliação por listagem (`/callbacks`, `/responses/tracking`, `pending-push`).

### Gaps
- Os JSON de exemplo dos callbacks v2 do Escavador são arquivos referenciados (`@responseFile`) que não vieram no `llm-ready.jsonl`.
- A Jusbrasil não publica limite de requisições; a Codilo não publica número de retentativas.
- Não achei o formato da "API" da Alerte, da Kurier, da iPrazos nem da Solucionare.

## 4. Saúde e prova: SLA, status, aviso de fonte fora do ar, cobertura, comprovação e responsabilidade

### Takeaway
Os sinais de saúde documentados são eventos de "verificado" e de "problema" (Escavador, Jusbrasil), códigos de pausa (Judit), e-mail diário fixo mesmo sem resultado e relatório de extração (Alerte) e snapshot diário de log (Intelivix). Só a Jusbrasil publica SLA em percentual. Ninguém assume responsabilidade pelo valor da causa; a Alerte diz que ela se limita ao custo do serviço.

### Cited Findings
- Escavador: evento `processo_verificado` quando o robô vai ao tribunal e não acha nada novo; `processo_nao_encontrado` não cobra — [Escavador LLM-ready v2](https://api.escavador.com/v2/docs/llm-ready.jsonl); [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json)
- Escavador: download do PDF da página do diário (`/api/v1/diarios/{id}/pdf/pagina/{pagina}/baixar`) e `link_web` da página do diário — [Escavador LLM-ready v1](https://api.escavador.com/v1/docs/llm-ready.jsonl); [Escavador LLM-ready v2](https://api.escavador.com/v2/docs/llm-ready.jsonl)
- Jusbrasil: evento 8 com `data.reason` (ex.: "Mais de 24h desde último acesso.", "Processo não encontrado no tribunal"), reenviado 1 vez por dia até a atualização; evento 20 confirma verificação mesmo sem novidade — [Jusbrasil Eventos](https://api.jusbrasil.com.br/docs/referencias/eventos.html)
- Jusbrasil: "95%" dos andamentos e "75%" das distribuições entregues em até 48 h; SLA personalizado no plano sob demanda — [Jusbrasil Soluções API](https://conteudo.jusbrasil.com.br/api)
- Judit: códigos 700 a 703 (`TRACKING_PAUSED_BY_MAX_CONSUMPTION`, `..._INSUFFICIENT_CREDITS`, `..._REQUEST_LIMIT`, `..._PLAN_WITHOUT_CONFIG`) e 600 `REQUEST_COMPLETED` — [Judit Webhook](https://docs.judit.io/webhook/callbacks.md)
- Alerte: número fixo de e-mails por dia "por segurança"; e-mail mesmo sem resultado; nunca foi notificada de prazo perdido, mas depende de fonte de terceiros e "a manipulação humana é imprescindível"; responsabilidade "tem por base exclusivamente o custo do serviço" — [Alerte Dúvidas](https://www.alerte.com.br/principais-duvidas/)
- Alerte DJE e DET: relatório diário com status das senhas e horário de início e fim da extração; alerta quando a comunicação é expedida e de novo quando é aberta — [Alerte DJE](https://www.alerte.com.br/domicilio-judicial-eletronico/); [Alerte DET](https://www.alerte.com.br/domicilio-eletronico-trabalhista/)
- Intelivix: snapshot diário de log como prova técnica se o Domicílio alterar registro passado; histórico retroativo para detectar inserção tardia do tribunal; trilha de auditoria de quem fez o quê — [Intelivix](https://www.intelivix.com/); [Intelivix Publicações](https://www.intelivix.com/publi/)
- Kurier: "até 98%" dos processos distribuídos; números de eficiência "variam conforme o perfil de cada operação" — [Kurier Monitoramento](https://www.kuriertecnologia.com.br/monitoramento-de-processos)
- O Escavador expõe a lista de tribunais e sistemas cobertos por API (`GET /api/v2/tribunais`, `GET /api/v2/tribunais/sistemas`); na Judit não achei endpoint equivalente — [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json)

### Inferences
- O painel de saúde do conector pode usar 4 sinais que os fornecedores já dão: última verificação por fonte (Escavador `processo_verificado`, Jusbrasil 20), erro por fonte (Jusbrasil 8, Escavador `NAO_ENCONTRADO`), pausa por cota (Judit 700-703) e "lote do dia recebido" (Alerte manda e-mail mesmo vazio). A ausência do lote diário é o alarme mais barato.
- Para prova de captura, os mais fortes são o PDF da página do diário (Escavador v1), o `hash` do DJEN e o log diário (Intelivix, Alerte). O conector deve guardar o payload bruto de cada entrega com data de recebimento.

### Gaps
- Nenhum fornecedor lido publica página de status ou uptime.
- Nenhum publica cláusula contratual de responsabilidade por publicação perdida, além da frase da Alerte.
- Não achei certidão de publicação emitida por fornecedor; não verifiquei se o DJEN tem endpoint de certidão.

## 5. Preço

### Takeaway
Preço público é raro. Os modelos vistos: por termo e por diário (Alerte, Solucionare), por processo monitorado com mínimo mensal (Solucionare, Jusbrasil), por CNPJ com desconto por volume (Intelivix), por chamada em créditos (Escavador, Judit, BigDataCorp) e por estado na distribuição (Solucionare).

### Cited Findings
- Jusbrasil Soluções: planos Legal e Risco "a partir de R$ 1.000/mês", com faturamento mínimo e cobrança por chamada; Legal inclui até 2.000 processos monitorados — [Jusbrasil Soluções API](https://conteudo.jusbrasil.com.br/api)
- Escavador: custo em centavos no cabeçalho `Creditos-Utilizados`; tabela em `api.escavador.com/servicos` (bloqueada por desafio anti-robô no acesso); v1 cobra a cada 200 aparições além do padrão; v2 cobra aumento do teto de 10.000 — [Escavador v2 docs](https://api.escavador.com/v2/docs/); [Escavador LLM-ready v1](https://api.escavador.com/v1/docs/llm-ready.jsonl); [Escavador OpenAPI v2](https://api.escavador.com/v2/docs/openapi.json)
- Judit: na doc, só a ordem relativa (datalake mais barato, assíncrona intermediária, sob demanda mais cara) e venda por WhatsApp — [Judit docs](https://docs.judit.io/); segundo blog de concorrente, planos anuais a partir de R$ 1.000/mês, pré-pago a partir de R$ 5.000 e R$ 0,07 a R$ 6,00 por transação (preços conferidos em set/2026; fonte terceira com conflito de interesse) — [TrackJud](https://trackjud.com.br/en/blog/best-brazilian-court-data-apis)
- Mesmo blog: Vigilant a R$ 0,10 por crédito, pacotes de R$ 20 a R$ 700, monitoramento de 5 créditos por tribunal por bloco de 10 processos, webhooks assinados com HMAC-SHA256; Codilo e API Jusbrasil sem preço público; DataJud gratuito e só com metadados — [TrackJud](https://trackjud.com.br/en/blog/best-brazilian-court-data-apis)
- BigDataCorp `processes`: R$ 0,080 por consulta até 10.000/mês, caindo a R$ 0,065 entre 500.001 e 1.000.000; R$ 55.000 fixos de 1 a 5 milhões — [BigDataCorp Processos](https://docs.bigdatacorp.com.br/plataforma/reference/pessoas-processos-judiciais-e-administrativos)
- Solucionare: publicações por número de termos, sem taxa por estado; andamentos por mês e quantidade de processos, com volume mínimo; distribuições por estado, com promoção para busca nacional — [Solucionare](https://www.solucionarelj.com.br/recortes_juridicos/)
- Alerte: "cobra pela quantidade de termos/diários pesquisados"; API e e-mails adicionais sem custo; teste de 10 dias (uma página diz 15) — [Alerte Dúvidas](https://www.alerte.com.br/principais-duvidas/); [Alerte](https://www.alerte.com.br/)
- Intelivix: preço por CNPJ que cai com volume (faixas 1-10, 11-50, mais de 50), sem fidelidade e sem setup; teste de 15 dias até 5.000 publicações — [Intelivix](https://www.intelivix.com/); [Intelivix Publicações](https://www.intelivix.com/publi/)
- Kurier, iPrazos, Codilo, Legalcloud: sem valor publicado — [Kurier Monitoramento](https://www.kuriertecnologia.com.br/monitoramento-de-processos); [iPrazos](https://www.iprazos.adv.br/); [Legalcloud](https://legalcloud.com.br/)

### Inferences
- O conector deve registrar a unidade de custo de cada fornecedor (termo, processo, CNPJ, chamada) e o consumo do mês, porque o teto de consumo vira pausa silenciosa na Judit e no Escavador.

### Gaps
- Tabela de preço do Escavador não lida (página com desafio de JavaScript).
- Preço da Kurier, da Solucionare, da iPrazos e da Codilo não é público.

## 6. Padrões de integração: vários fornecedores ao mesmo tempo e marcação da origem

### Takeaway
Softwares jurídicos ligam vários fornecedores e deduplicam por semelhança (CNJ + data + começo do texto), mostrando a primeira captura como origem e as outras como versões. As APIs de dados já carregam a origem em campo próprio (fonte, diário, caderno, página, `cached_response`).

### Cited Findings
- Kurier: duplicidade surge de "uma mesma publicação em diferentes sistemas no mesmo dia ou dias subsequentes" (diário estadual, DJEN, PJe); agrupa por, "por exemplo", mesma data, mesmo número de processo e primeiros 100 caracteres iguais; a primeira captura vira a origem e as demais ficam num ícone de versões; o usuário pode desagrupar (artigo de 19/01/2026, atualizado em 17/08/2026) — [Kurier Duplicidade](https://www.kuriertecnologia.com.br/blog/duplicidade-de-publicacoes/)
- Corejur Push: consulta vários serviços de leitura (Advise, AASP, Destaque), identifica duplicidades e repete a captura 2 vezes para comparar as 3 execuções (lido só pelo resumo da busca; a página devolveu 404 no acesso direto) — [Corejur](https://www.corejur.com.br/software-para-acompanhamento-de-publicacoes-juridicas/)
- Intelivix Publicações remove duplicadas do DJEN antes da classificação — [Intelivix Publicações](https://www.intelivix.com/publi/)
- Escavador marca a origem de cada movimentação em `fonte` (TRIBUNAL ou DIARIO_OFICIAL, sigla, caderno, página, `link_web`) — [Escavador LLM-ready v2](https://api.escavador.com/v2/docs/llm-ready.jsonl)
- Jusbrasil marca diário, órgão e caderno (`periodico_diario_slug`, `periodico_orgao_slug`, `periodico_caderno_slug`) e página original — [Jusbrasil Diários: monitoramento](https://api.jusbrasil.com.br/docs/diarios_oficiais/monitoramento.html)
- Judit marca se o dado veio do datalake ou de coleta nova (`cached_response`) — [Judit Webhook](https://docs.judit.io/webhook/callbacks.md)
- Codilo marca `source`, `platform`, `search` e `query` com tags em cada bloco `info` — [Codilo callback](https://docs.codilo.com.br/api-monitoramento/callback)
- iPrazos e Intelivix integram com Projuris, Legal One, Elaw, CPJ, TEMIS e Espaider — [iPrazos](https://www.iprazos.adv.br/); [Intelivix](https://www.intelivix.com/)

### Inferences
- Item normalizado mínimo para o conector: `fornecedor`, `id_no_fornecedor`, `id_entrega`, `tipo` (publicação, intimação, andamento, distribuição, documento, comunicação DET), `numero_cnj`, `tribunal`, `fonte` (DJEN, DJE estadual, Domicílio, DET, portal, tribunal), `caderno`, `pagina`, `data_disponibilizacao`, `data_publicacao`, `texto`, `termo_casado`, `link`, `hash` (o do DJEN quando existir), `recebido_em`, `payload_bruto`. A deduplicação entre fornecedores usa `hash` do DJEN; na falta dele, CNJ + data + começo do texto, como a Kurier.
- A origem de cada captura fica visível no item e no grupo de duplicadas, com a primeira captura como principal; isso dá a prova de redundância que o cliente pede ao ligar Intelix (ou Intelivix) e Alerte juntos.

### Gaps
- Não achei documentação de como Projuris, Legal One ou eLaw marcam o fornecedor de cada publicação na tela.
- Não achei relato público de cliente que use 2 fornecedores em paralelo com métrica de quanto um pegou e o outro não.
