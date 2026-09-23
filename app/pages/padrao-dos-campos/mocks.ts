/**
 * O dado desta tela. Fictício, escrito à mão, tipado pelo schema real.
 *
 * A ESTRUTURA vem do develop: o item é o `Item` do `@be-enlighten/enspace-sdk-schemas`,
 * com `reference`, `created_at`, `updated_at`, `status` e o saco de valores em
 * `data`, chaveado pelo `refId` de cada campo. As FORMAS dos valores dentro de
 * `data` foram observadas em itens reais de develop, olhando só o formato.
 *
 * Os VALORES são inventados. Nortelux, Vega Predial, Marina Toledo e o resto
 * não existem. Nenhum dado de cliente entra aqui: o repositório é público.
 *
 * Casos de canto de propósito, porque é neles que o desenho quebra:
 * o item 3 tem quase tudo vazio, o item 4 tem nome que estoura a coluna, o
 * item 5 tem lista longa demais para a célula e data antiga.
 */
import { reactive } from 'vue'
import type { Item } from '@be-enlighten/enspace-sdk-schemas'

/**
 * A categoria de vitrine. No develop ela seria uma categoria como outra
 * qualquer: o que ela tem de diferente é um campo de cada tipo.
 */
export const categoria = {
  nome: 'Vitrine de campos',
  slug: 'vitrine-de-campos',
  icone: 'i-lucide-layout-grid',
  /** O total que o rodapé da tabela mostra. A tabela renderiza os 6 do mock. */
  totalDeItens: 248,
}

export const workspace = { nome: 'teste ux 2', slug: 'teste-ux' }

/**
 * As opções das listas, do jeito que a API devolve em `Field.options[]`:
 * `value` é o que vai gravado, `label` é o que a pessoa lê.
 */
/*
 * As opções são REATIVAS de propósito.
 *
 * Renomear uma opção a partir da célula (decidido na rodada 9) muda o rótulo em
 * todos os registros que a usam, e o protótipo só prova isso se a tabela
 * inteira reagir. Num back-end de verdade isto é um PATCH na configuração do
 * campo; aqui é o objeto em memória.
 */
export const opcoes = reactive({
  selecao_unica: [
    { value: 'triagem', label: 'Em triagem', cor: 'neutral' },
    { value: 'em_analise', label: 'Em análise', cor: 'info' },
    { value: 'aprovado', label: 'Aprovado', cor: 'success' },
    { value: 'reprovado', label: 'Reprovado', cor: 'error' },
    { value: 'suspenso', label: 'Suspenso por falta de verba', cor: 'warning' },
  ],
  /*
   * Botões de seleção única: as opções NÃO são "Sim" e "Não". Um radio de duas
   * opções encostado na Alternativa Binária embaralha os dois tipos, e ela
   * pediu justamente a separação: binário é um controle sem rótulo, radio é
   * uma escolha entre opções nomeadas.
   */
  selecao_radio: [
    { value: 'sim', label: 'Equipe interna', cor: 'success' },
    { value: 'nao', label: 'Terceirizado', cor: 'neutral' },
  ],
  selecao_multipla: [
    { value: 'eletrica', label: 'Elétrica', cor: 'warning' },
    { value: 'hidraulica', label: 'Hidráulica', cor: 'info' },
    { value: 'civil', label: 'Civil', cor: 'neutral' },
    { value: 'climatizacao', label: 'Climatização', cor: 'primary' },
    { value: 'seguranca', label: 'Segurança', cor: 'error' },
  ],
  caixas: [
    { value: 'termo', label: 'Li e aceito o termo de responsabilidade', cor: 'neutral' },
    { value: 'visita', label: 'Autorizo visita técnica sem aviso prévio', cor: 'neutral' },
  ],
  caixas_legado: [
    { value: 'a', label: 'Opção A', cor: 'neutral' },
    { value: 'b', label: 'Opção B', cor: 'neutral' },
  ],
  arvore: [
    {
      value: 'predial',
      label: 'Predial',
      children: [
        { value: 'predial.eletrica', label: 'Elétrica' },
        { value: 'predial.hidraulica', label: 'Hidráulica' },
      ],
    },
    {
      value: 'frota',
      label: 'Frota',
      children: [{ value: 'frota.preventiva', label: 'Preventiva' }],
    },
  ],
})

/**
 * Os itens. `data` é `z.any()` no schema, então o tipo aqui é o do produto e o
 * conteúdo de `data` é o que o catálogo de campos descreve.
 */
export const itens: Item[] = [
  {
    id: 47617,
    reference: 'VITR8326AF86DA64A17970C175182DAF',
    created_at: new Date('2026-09-14T21:32:11.000Z'),
    updated_at: new Date('2026-09-19T11:04:52.000Z'),
    deleted_at: null,
    status: 'active',
    request_email: 'compras@nortelux.com.br',
    data: {
      texto_curto: 'Troca das luminárias do 3º andar',
      texto_longo:
        'A manutenção pediu a troca completa das luminárias do corredor central. O modelo atual saiu de linha e a reposição está levando quarenta dias, então vale trocar tudo de uma vez.',
      texto_rico:
        '<p>Laudo com <strong>ressalva</strong>: o quadro de distribuição precisa ser reavaliado antes da troca.</p>',
      anotacoes: [
        { author: 'Marina Toledo', at: '2026-09-17T14:20:00.000Z', text: 'Cliente pediu retorno na sexta, antes das 11h.' },
        { author: 'Rafael Pimenta', at: '2026-09-17T16:02:00.000Z', text: 'Retorno agendado. Confirmei por e-mail.' },
      ],
      mascara: '12.345.678/0001-90',
      email: 'compras@nortelux.com.br',
      codigo: 'OS-2026-0481',
      numero: 1480.5,
      moeda: { currency: 'BRL', value: 18400, originalValue: 18400 },
      selecao_unica: 'em_analise',
      selecao_radio: 'sim',
      selecao_multipla: ['eletrica', 'civil'],
      caixas: ['termo'],
      caixas_legado: ['a'],
      tags: ['urgente', 'predial'],
      arvore: 'predial.eletrica',
      binario: true,
      data: '2026-10-03T12:00:00.000Z',
      relacao_simples: { id: 43887, display: 'Nortelux Elétrica', reference: 'FORNC55D9212D9' },
      relacao_multipla: [
        { id: 43891, display: 'OS 2026-0481', reference: 'OSC1F0A2B4' },
        { id: 43892, display: 'OS 2026-0502', reference: 'OSC1F0A2B7' },
      ],
      pessoa: { name: 'Marina Toledo', email: 'marina.toledo@nortelux.com.br', cpf: '000.000.000-00' },
      endereco: {
        street: 'Av. Paulista',
        number: '1000',
        complement: 'Conj. 142',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zip: '01310-100',
        country: 'BRA',
      },
      arquivo: [
        {
          url: 'https://exemplo.invalido/laudo-eletrico.pdf',
          filename: 'laudo-eletrico.pdf',
          mime: 'application/pdf',
          mimeType: 'application/pdf',
          size: 45000,
        },
        {
          url: 'https://exemplo.invalido/orcamento-luminarias.xlsx',
          filename: 'orcamento-luminarias.xlsx',
          mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 21800,
        },
        {
          url: 'https://exemplo.invalido/foto-corredor.jpg',
          filename: 'foto-corredor.jpg',
          mime: 'image/jpeg',
          size: 512000,
        },
      ],
      imagem: [{
        url: 'https://exemplo.invalido/quadro-distribuicao.jpg',
        filename: 'quadro-distribuicao.jpg',
        mime: 'image/jpeg',
        mimeType: 'image/jpeg',
        size: 220400,
      }],
      pdf: [{
        url: 'https://exemplo.invalido/contrato-nortelux.pdf',
        filename: 'contrato-nortelux.pdf',
        mime: 'application/pdf',
        mimeType: 'application/pdf',
        size: 812300,
      }],
      documento: [{
        url: 'https://exemplo.invalido/proposta-nortelux.docx',
        filename: 'proposta-nortelux.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 64200,
      }],
      assinatura: { signer: 'Marina Toledo', signedAt: '2026-09-18T13:10:00.000Z', url: 'https://exemplo.invalido/assinatura.png' },
      repetidor: [
        { item: 'Luminária LED 36W', quantidade: 12 },
        { item: 'Reator eletrônico', quantidade: 12 },
        { item: 'Cabo flexível 2,5mm', quantidade: 80 },
      ],
      grupo: { login: 'nortelux', telefone: '+55 11 5555-0100' },
      duracao: '2 semanas',
      valor_dinamico: 'Prazo em 11 dias',
      chat: [
        { author: 'Marina Toledo', at: '2026-09-18T09:12:00.000Z', text: 'Consigo a visita na quinta?' },
        { author: 'Rafael Pimenta', at: '2026-09-18T09:40:00.000Z', text: 'Quinta de manhã está livre.' },
      ],
    },
  },
  {
    id: 47618,
    reference: 'VITRF62553436E084A69B6FC9925BE153',
    created_at: new Date('2026-09-15T14:02:00.000Z'),
    updated_at: new Date('2026-09-21T16:48:10.000Z'),
    deleted_at: null,
    status: 'active',
    request_email: 'manutencao@vegapredial.com.br',
    data: {
      texto_curto: 'Revisão do sistema de climatização',
      texto_longo: 'Revisão semestral dos quatro splits do andar administrativo.',
      texto_rico: '<p>Sem ressalvas. Equipamento dentro do prazo de garantia.</p>',
      anotacoes: [],
      mascara: '987.654.321-00',
      email: 'manutencao@vegapredial.com.br',
      codigo: 'OS-2026-0502',
      numero: 620,
      moeda: { currency: 'USD', value: 7250.9, originalValue: 7250.9 },
      selecao_unica: 'aprovado',
      selecao_radio: 'nao',
      selecao_multipla: ['climatizacao'],
      caixas: ['termo', 'visita'],
      caixas_legado: ['a', 'b'],
      tags: ['preventiva'],
      arvore: 'frota.preventiva',
      binario: false,
      data: '2026-09-30T12:00:00.000Z',
      relacao_simples: { id: 43888, display: 'Vega Predial', reference: 'FORNA11B2C3D4' },
      relacao_multipla: [{ id: 43893, display: 'OS 2026-0511', reference: 'OSC1F0A2C1' }],
      pessoa: { name: 'Rafael Pimenta', email: 'rafael.pimenta@vegapredial.com.br', cpf: '111.111.111-11' },
      endereco: {
        street: 'Rua Doutor Renato Paes de Barros',
        number: '750',
        complement: '',
        neighborhood: 'Itaim Bibi',
        city: 'São Paulo',
        state: 'SP',
        zip: '04530-001',
        country: 'BRA',
      },
      arquivo: [{
        url: 'https://exemplo.invalido/checklist-climatizacao.xlsx',
        filename: 'checklist-climatizacao.xlsx',
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 18200,
      }],
      imagem: [],
      pdf: [],
      documento: [],
      assinatura: null,
      repetidor: [{ item: 'Filtro de ar', quantidade: 4 }],
      grupo: { login: 'vega.pred', telefone: '+55 11 5555-0240' },
      duracao: '2 semanas',
      valor_dinamico: 'Prazo em 8 dias',
      chat: [],
    },
  },
  {
    /* O item quase vazio. É aqui que o estado vazio de cada formato se prova. */
    id: 47619,
    reference: 'VITR96855CB6E214A3689322FC6FBABB',
    created_at: new Date('2026-09-22T08:15:00.000Z'),
    updated_at: new Date('2026-09-22T08:15:00.000Z'),
    deleted_at: null,
    status: 'active',
    isDraft: true,
    data: {
      texto_curto: 'Rascunho sem título definido',
      texto_longo: '',
      texto_rico: '',
      anotacoes: [],
      mascara: '',
      email: '',
      codigo: 'OS-2026-0519',
      numero: null,
      moeda: null,
      selecao_unica: '',
      selecao_radio: '',
      selecao_multipla: [],
      caixas: [],
      caixas_legado: [],
      tags: [],
      arvore: '',
      binario: false,
      data: null,
      relacao_simples: null,
      relacao_multipla: [],
      pessoa: null,
      endereco: null,
      arquivo: [],
      imagem: [],
      pdf: [],
      documento: [],
      assinatura: null,
      repetidor: [],
      grupo: null,
      duracao: '',
      valor_dinamico: '',
      chat: [],
    },
  },
  {
    /* O nome que estoura a coluna, e a relação que voltou com display vazio. */
    id: 47620,
    reference: 'VITR1D0C4A77B3E14E2F8A55C0117D9EE',
    created_at: new Date('2026-08-02T10:40:00.000Z'),
    updated_at: new Date('2026-09-20T09:22:31.000Z'),
    deleted_at: null,
    status: 'active',
    request_email: 'fiscal@construtorasaomateus.com.br',
    data: {
      texto_curto:
        'Adequação da subestação e do quadro geral de baixa tensão do bloco B às normas da concessionária',
      texto_longo:
        'A concessionária apontou seis não conformidades na última vistoria. O prazo para regularizar vence no fim do trimestre e a multa é diária.',
      texto_rico: '<p>Prazo <em>improrrogável</em>. A multa é diária a partir do vencimento.</p>',
      anotacoes: [
        { author: 'Eduardo Bastos', at: '2026-09-19T08:40:00.000Z', text: 'Confirmar se o engenheiro responsável assina a ART antes da visita.' },
      ],
      mascara: '45.678.901/0001-23',
      email: 'fiscal@construtorasaomateus.com.br',
      codigo: 'OS-2026-0333',
      numero: 128940.75,
      moeda: { currency: 'BRL', value: 134187.38, originalValue: 128940.75 },
      selecao_unica: 'suspenso',
      selecao_radio: 'sim',
      selecao_multipla: ['eletrica', 'civil', 'seguranca', 'climatizacao'],
      caixas: ['termo', 'visita'],
      caixas_legado: ['b'],
      tags: ['urgente', 'multa', 'concessionaria', 'bloco-b', 'vistoria'],
      arvore: 'predial.hidraulica',
      binario: true,
      data: '2026-12-31T12:00:00.000Z',
      /* display veio vazio da API. Acontece quando o displayString aponta para
         um campo que o item relacionado não preencheu. Ver BRIEFING.md. */
      relacao_simples: { id: 43889, display: '', reference: 'FORN77C0D1E2F3' },
      relacao_multipla: [
        { id: 43894, display: 'OS 2026-0333', reference: 'OSC1F0A2D9' },
        { id: 43895, display: 'OS 2026-0334', reference: 'OSC1F0A2E0' },
        { id: 43896, display: 'OS 2026-0335', reference: 'OSC1F0A2E1' },
        { id: 43897, display: 'OS 2026-0340', reference: 'OSC1F0A2E2' },
      ],
      pessoa: { name: 'Eduardo Bastos Marinho Vasconcelos', email: 'eduardo@construtorasaomateus.com.br', cpf: '222.222.222-22' },
      endereco: {
        street: 'Rodovia Anhanguera, km 42',
        number: 's/n',
        complement: 'Galpão 7',
        neighborhood: 'Distrito Industrial',
        city: 'Jundiaí',
        state: 'SP',
        zip: '13213-000',
        country: 'BRA',
      },
      arquivo: [{
        url: 'https://exemplo.invalido/notificacao-concessionaria.pdf',
        filename: 'notificacao-concessionaria-bloco-b-2026.pdf',
        mime: 'application/pdf',
        mimeType: 'application/pdf',
        size: 3120500,
      }],
      imagem: [{
        url: 'https://exemplo.invalido/subestacao.jpg',
        filename: 'subestacao.jpg',
        mime: 'image/jpeg',
        mimeType: 'image/jpeg',
        size: 1840000,
      }],
      pdf: [{
        url: 'https://exemplo.invalido/art-assinada.pdf',
        filename: 'art-assinada.pdf',
        mime: 'application/pdf',
        mimeType: 'application/pdf',
        size: 210400,
      }],
      documento: [{
        url: 'https://exemplo.invalido/plano-de-adequacao.docx',
        filename: 'plano-de-adequacao.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 128900,
      }],
      assinatura: { signer: 'Eduardo Bastos', signedAt: '2026-09-20T08:55:00.000Z', url: 'https://exemplo.invalido/art.png' },
      repetidor: [
        { item: 'Disjuntor tripolar 100A', quantidade: 6 },
        { item: 'Barramento de cobre', quantidade: 3 },
        { item: 'Malha de aterramento', quantidade: 1 },
        { item: 'Sinalização de segurança', quantidade: 14 },
      ],
      grupo: { login: 'saomateus.fiscal', telefone: '+55 11 5555-0777' },
      duracao: '2 semanas',
      valor_dinamico: 'Prazo em 100 dias',
      chat: [
        { author: 'Eduardo Bastos', at: '2026-09-20T08:10:00.000Z', text: 'A ART já está assinada.' },
      ],
    },
  },
  {
    /* Item antigo e inativo: prova o selo de status e a data em formato longo. */
    id: 47621,
    reference: 'VITR55A9E0B1C2D34F5061728394A5B6',
    created_at: new Date('2024-02-11T13:05:00.000Z'),
    updated_at: new Date('2024-03-01T17:30:00.000Z'),
    deleted_at: null,
    status: 'inactive',
    request_email: 'arquivo@nortelux.com.br',
    data: {
      texto_curto: 'Contrato encerrado em 2024',
      texto_longo: 'Mantido apenas para consulta. Não gerar nova ordem a partir deste item.',
      texto_rico: '<p>Arquivado.</p>',
      anotacoes: [],
      mascara: '12.345.678/0001-90',
      email: 'arquivo@nortelux.com.br',
      codigo: 'OS-2024-0012',
      numero: 0,
      moeda: { currency: 'BRL', value: 0, originalValue: 0 },
      selecao_unica: 'reprovado',
      selecao_radio: 'nao',
      selecao_multipla: ['civil'],
      caixas: [],
      caixas_legado: [],
      tags: ['arquivado'],
      arvore: 'predial',
      binario: false,
      data: '2024-03-01T12:00:00.000Z',
      relacao_simples: { id: 43887, display: 'Nortelux Elétrica', reference: 'FORNC55D9212D9' },
      relacao_multipla: [],
      pessoa: { name: 'Marina Toledo', email: 'marina.toledo@nortelux.com.br', cpf: '000.000.000-00' },
      endereco: null,
      arquivo: [],
      imagem: [],
      pdf: [],
      documento: [],
      assinatura: null,
      repetidor: [],
      grupo: null,
      duracao: '2 semanas',
      valor_dinamico: 'Encerrado',
      chat: [],
    },
  },
  {
    id: 47622,
    reference: 'VITR0E1F2A3B4C5D6E7F8091A2B3C4D5',
    created_at: new Date('2026-09-21T19:55:00.000Z'),
    updated_at: new Date('2026-09-22T07:10:00.000Z'),
    deleted_at: null,
    status: 'active',
    request_email: 'obras@vegapredial.com.br',
    data: {
      texto_curto: 'Laudo de estanqueidade da cobertura',
      texto_longo: 'Infiltração recorrente na laje técnica. Já houve duas tentativas de reparo.',
      texto_rico: '<p>Terceira ocorrência no mesmo ponto.</p>',
      anotacoes: [
        { author: 'Rafael Pimenta', at: '2026-09-21T20:10:00.000Z', text: 'Anexar as fotos da última chuva.' },
      ],
      mascara: '987.654.321-00',
      email: 'obras@vegapredial.com.br',
      codigo: 'OS-2026-0527',
      numero: 9820,
      moeda: { currency: 'EUR', value: 9820, originalValue: 9820 },
      selecao_unica: 'triagem',
      selecao_radio: 'sim',
      selecao_multipla: ['civil', 'hidraulica'],
      caixas: ['visita'],
      caixas_legado: [],
      tags: ['infiltracao', 'cobertura'],
      arvore: 'predial.hidraulica',
      binario: true,
      data: '2026-10-15T12:00:00.000Z',
      relacao_simples: { id: 43888, display: 'Vega Predial', reference: 'FORNA11B2C3D4' },
      relacao_multipla: [{ id: 43898, display: 'OS 2026-0527', reference: 'OSC1F0A2F5' }],
      pessoa: { name: 'Rafael Pimenta', email: 'rafael.pimenta@vegapredial.com.br', cpf: '111.111.111-11' },
      endereco: {
        street: 'Rua das Palmeiras',
        number: '42',
        complement: '',
        neighborhood: 'Centro',
        city: 'Campinas',
        state: 'SP',
        zip: '13010-200',
        country: 'BRA',
      },
      arquivo: [{
        url: 'https://exemplo.invalido/laudo-estanqueidade.pdf',
        filename: 'laudo-estanqueidade.pdf',
        mime: 'application/pdf',
        mimeType: 'application/pdf',
        size: 92400,
      }],
      imagem: [{
        url: 'https://exemplo.invalido/laje-tecnica.jpg',
        filename: 'laje-tecnica.jpg',
        mime: 'image/jpeg',
        mimeType: 'image/jpeg',
        size: 410800,
      }],
      pdf: [],
      documento: [],
      assinatura: null,
      repetidor: [
        { item: 'Manta asfáltica', quantidade: 30 },
        { item: 'Primer', quantidade: 6 },
      ],
      grupo: { login: 'vega.obras', telefone: '+55 11 5555-0241' },
      duracao: '2 semanas',
      valor_dinamico: 'Prazo em 23 dias',
      chat: [],
    },
  },
]

/**
 * As moedas que o seletor oferece. No develop são **179**, em ordem de país,
 * mostrando só o código ISO 4217 e com caixa de busca no topo (medido em
 * 22/09/2026). Aqui vai um recorte, o suficiente para o seletor se provar.
 */
export const moedas = [
  { codigo: 'BRL', nome: 'Real brasileiro', simbolo: 'R$' },
  { codigo: 'USD', nome: 'Dólar americano', simbolo: 'US$' },
  { codigo: 'EUR', nome: 'Euro', simbolo: '€' },
  { codigo: 'GBP', nome: 'Libra esterlina', simbolo: '£' },
  { codigo: 'ARS', nome: 'Peso argentino', simbolo: '$' },
  { codigo: 'CLP', nome: 'Peso chileno', simbolo: '$' },
  { codigo: 'MXN', nome: 'Peso mexicano', simbolo: '$' },
  { codigo: 'JPY', nome: 'Iene', simbolo: '¥' },
  { codigo: 'CHF', nome: 'Franco suíço', simbolo: 'CHF' },
  { codigo: 'XAU', nome: 'Ouro', simbolo: 'XAU' },
]

/**
 * Os índices de correção monetária que o develop oferece no modal da
 * calculadora. São globais, não do workspace.
 */
export const indicesDeCorrecao = [
  'SELIC', 'CDI', 'IPCA', 'IPCA-15', 'IPCA-E', 'INPC',
  'TJDF (não expurgada)', 'TJSC', 'TJAC', 'TJMA', 'TJSE', 'TJRS', 'TJCE', 'TJTO',
]

/** Os membros que o seletor de pessoa oferece no formulário. */
export const membros = [
  { nome: 'Marina Toledo', email: 'marina.toledo@nortelux.com.br', iniciais: 'MT' },
  { nome: 'Rafael Pimenta', email: 'rafael.pimenta@vegapredial.com.br', iniciais: 'RP' },
  { nome: 'Eduardo Bastos', email: 'eduardo@construtorasaomateus.com.br', iniciais: 'EB' },
]

/** Os itens que o seletor de relação oferece no formulário. */
export const itensRelacionaveis = [
  { id: 43887, display: 'Nortelux Elétrica', reference: 'FORNC55D9212D9' },
  { id: 43888, display: 'Vega Predial', reference: 'FORNA11B2C3D4' },
  { id: 43889, display: '', reference: 'FORN77C0D1E2F3' },
  { id: 43891, display: 'OS 2026-0481', reference: 'OSC1F0A2B4' },
  { id: 43892, display: 'OS 2026-0502', reference: 'OSC1F0A2B7' },
]
