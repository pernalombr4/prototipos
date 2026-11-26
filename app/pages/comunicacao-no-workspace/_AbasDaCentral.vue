<script setup lang="ts">
/**
 * PROPOSTA (rodada 7). As abas de configuração da central "E-mails", que
 * trazem para dentro dela as telas de Configurações › E-mails de hoje:
 *
 *  - Modelos: Modelos de E-mail (Nome, Assunto, Usar Remetente por Domínio),
 *    com a permissão `settings::emails::templates` de hoje;
 *  - Caixas de E-mail: Nome, E-mail e Provedor, com `settings::emails::boxes`;
 *  - Configurações: a conta de envio da pessoa (todo perfil) e, para quem
 *    administra, o domínio de envio, o contato do item e, na Fase 2, as
 *    caixas que entram no "De".
 *
 * Rodada 8: a tela E-mails Enviados virou o filtro "Do sistema" da aba
 * Mensagens. As tabelas usam o `_TabelaDoEnspace.vue` (a tabela do develop:
 * Ações primeiro, 1 botão ⋮ com o menu, clique direito), com busca e
 * paginador. Workspace novo: as tabelas mostram o vazio com o próximo passo.
 *
 * Lido no código do develop em 24/11/2026. Hoje as 3 telas usam a tabela
 * antiga; aqui elas ganham a tabela nova, como as outras telas do protótipo.
 *
 * Fase 4 (rodada 14): Modelos ganha os modelos de WhatsApp aprovados pela Meta
 * (nome, idioma, categoria, status na Meta), e Configurações ganha "Canais de
 * envio do workspace": o e-mail do sistema (SendGrid), o SMS e o WhatsApp
 * (Twilio), cada um com o estado da integração.
 */
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import { type CaixaDeEmail, type ModeloDeEmail, type ModeloDeWhatsApp, DOMINIO_DA_EMPRESA, DOMINIO_DAS_CAIXAS, EU, NUMERO_SMS_DO_WORKSPACE, NUMERO_WHATSAPP_DO_WORKSPACE, modelosDeWhatsApp, variaveisDoModelo } from './mocks'
import { textosDeCanais } from './textosDeCanais'
import { type AbaDaCentral, useComunicacao, useMarcaDeProposta } from './estado'
import { useAppExterno } from './simulador'
import TabelaDoEnspace from './_TabelaDoEnspace.vue'
import Paginador from './_Paginador.vue'

const props = defineProps<{ t: Textos, aba: Exclude<AbaDaCentral, 'mensagens'> }>()

const { fase, ehAdmin, outlookIntegrado, caixasNoDe, ir, abrirCompositor, modelosDoWorkspace, caixasDoWorkspace, twilioLigado, dados } = useComunicacao()
const tk = useTextos(textosDeCanais)
const todosOsCanais = computed(() => fase.value >= 4)
const { abrirApp } = useAppExterno()
const marca = useMarcaDeProposta()
const toast = useToast()

const tc = computed(() => props.t.central)

function maquete() {
  toast.add({ title: tc.value.maquete, icon: 'i-lucide-info', color: 'neutral' })
}

/** Busca e página de cada tabela. A troca de aba zera os dois. */
const busca = ref('')
const pagina = ref(1)
const porPagina = ref(25)
watch(() => props.aba, () => { busca.value = ''; pagina.value = 1 })
watch(busca, () => { pagina.value = 1 })

function daBusca<T extends Record<string, any>>(lista: T[], campos: (keyof T)[]) {
  const q = busca.value.trim().toLowerCase()
  return q ? lista.filter(x => campos.some(c => String(x[c] ?? '').toLowerCase().includes(q))) : lista
}
function daPagina<T>(lista: T[]) {
  return lista.slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value)
}

/* ---------- Modelos ---------- */

const modelosFiltrados = computed(() => daBusca(modelosDoWorkspace.value, ['nome', 'assunto']))
const colunasDeModelos = computed<TableColumn<ModeloDeEmail>[]>(() => [
  { accessorKey: 'nome', header: tc.value.col.nome },
  { accessorKey: 'assunto', header: tc.value.col.assunto },
  { id: 'remetente', header: tc.value.col.remetentePorDominio, meta: { style: { th: { width: '220px' }, td: { width: '220px' } } } },
])
function acoesDoModelo(m: ModeloDeEmail): DropdownMenuItem[][] {
  return [
    [
      { label: tc.value.usar, icon: 'i-lucide-mail-plus', onSelect: () => abrirCompositor({ origem: 'emails', modelo: m.id }) },
      { label: tc.value.editar, icon: 'i-lucide-pencil', onSelect: maquete },
    ],
    [{ label: tc.value.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: maquete }],
  ]
}

/* ---------- Fase 4: modelos de WhatsApp ---------- */

const tipoDeModelo = ref<'email' | 'whatsapp'>('email')
watch(todosOsCanais, (v) => { if (!v) tipoDeModelo.value = 'email' })
watch(tipoDeModelo, () => { busca.value = ''; pagina.value = 1 })
const opcoesDeTipoDeModelo = computed(() => [
  { value: 'email', label: tk.value.modelosDeEmail, icon: 'i-lucide-mail' },
  { value: 'whatsapp', label: tk.value.modelosDeWhatsApp, icon: 'i-simple-icons-whatsapp' },
])
const modelosWhatsAppDoWorkspace = computed(() => dados.value === 'novo' || !twilioLigado.value ? [] : modelosDeWhatsApp)
const modelosWhatsAppFiltrados = computed(() => daBusca(modelosWhatsAppDoWorkspace.value, ['nome', 'corpo']))
const colunasDeModelosWhatsApp = computed<TableColumn<ModeloDeWhatsApp>[]>(() => [
  { accessorKey: 'nome', header: tk.value.colModelo.nome },
  { accessorKey: 'corpo', header: tk.value.previaDoModelo },
  { id: 'categoria', header: tk.value.colModelo.categoria, meta: { style: { th: { width: '130px' }, td: { width: '130px' } } } },
  { accessorKey: 'idioma', header: tk.value.colModelo.idioma, meta: { style: { th: { width: '100px' }, td: { width: '100px' } } } },
  { id: 'variaveis', header: tk.value.colModelo.variaveis, meta: { style: { th: { width: '110px' }, td: { width: '110px' } } } },
  { id: 'statusMeta', header: tk.value.colModelo.statusMeta, meta: { style: { th: { width: '150px' }, td: { width: '150px' } } } },
])
const COR_DO_STATUS_META = { aprovado: 'success', emAnalise: 'warning', recusado: 'error' } as const
const ICONE_DO_STATUS_META = { aprovado: 'i-lucide-badge-check', emAnalise: 'i-lucide-hourglass', recusado: 'i-lucide-circle-x' } as const
function novoModeloWhatsApp() {
  toast.add({ title: tk.value.novoModeloWhatsApp, description: tk.value.modeloEnviadoParaAprovacao, icon: 'i-lucide-info', color: 'neutral' })
}
function acoesDoModeloWhatsApp(m: ModeloDeWhatsApp): DropdownMenuItem[][] {
  return [
    [
      { label: tk.value.usarNoFluxo, icon: 'i-lucide-git-fork', disabled: m.status !== 'aprovado', onSelect: () => ir('spaceflow') },
      { label: tc.value.editar, icon: 'i-lucide-pencil', onSelect: maquete },
    ],
    [{ label: tc.value.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: maquete }],
  ]
}
const modelosAprovados = computed(() => modelosWhatsAppDoWorkspace.value.filter(m => m.status === 'aprovado').length)

/* ---------- Caixas ---------- */

const caixasFiltradas = computed(() => daBusca(caixasDoWorkspace.value, ['nome', 'email']))
const colunasDeCaixas = computed<TableColumn<CaixaDeEmail>[]>(() => [
  { accessorKey: 'nome', header: tc.value.col.nome },
  { accessorKey: 'email', header: tc.value.col.email },
  { id: 'provedor', header: tc.value.col.provedor, meta: { style: { th: { width: '200px' }, td: { width: '200px' } } } },
])
function acoesDaCaixa(): DropdownMenuItem[][] {
  return [
    [{ label: tc.value.editar, icon: 'i-lucide-pencil', onSelect: maquete }],
    [{ label: tc.value.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: maquete }],
  ]
}

/* ---------- Configurações ---------- */

/** Fase 2: as caixas que aparecem no "De". Hoje a caixa só recebe. */
const noDe = ref<Record<string, boolean>>({ ...caixasNoDe.value })
const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  caixasNoDe.value = { ...noDe.value }
  toast.add({ title: tc.value.config.salvo, icon: 'i-lucide-check', color: 'success' })
}

/** Fase 4: os 3 canais do workspace e o estado de cada integração. */
const canais = computed(() => [
  { chave: 'email', icone: 'i-lucide-mail', titulo: tk.value.canalEmail, descricao: tk.value.canalEmailDescricao, ligado: true, status: tk.value.canalEmailStatus(DOMINIO_DA_EMPRESA) },
  { chave: 'sms', icone: 'i-lucide-message-square-text', titulo: tk.value.canalSms, descricao: tk.value.canalSmsDescricao, ligado: twilioLigado.value, status: twilioLigado.value ? tk.value.canalSmsStatus(NUMERO_SMS_DO_WORKSPACE) : tk.value.spaceflow.semIntegracao },
  { chave: 'whatsapp', icone: 'i-simple-icons-whatsapp', titulo: tk.value.canalWhatsApp, descricao: tk.value.canalWhatsAppDescricao, ligado: twilioLigado.value, status: twilioLigado.value ? tk.value.canalWhatsAppStatus(NUMERO_WHATSAPP_DO_WORKSPACE, modelosAprovados.value) : tk.value.spaceflow.semIntegracao },
])
function verModelosWhatsApp() {
  tipoDeModelo.value = 'whatsapp'
  ir('emails', { central: 'modelos' })
}

function integrar() {
  abrirApp({ tipo: 'outlook', url: 'https://app.enspace.io/profile?tab=integrations' })
}
</script>

<template>
  <div class="animate-[entrada_.25s_ease-out]" :class="marca">
    <!-- ===== Modelos e Caixas: barra, tabela e paginador do develop ===== -->
    <div v-if="aba === 'modelos' || aba === 'caixas'" class="flex min-h-0 flex-col">
      <div class="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4">
        <!-- PROPOSTA (Fase 4): os modelos de e-mail e os de WhatsApp -->
        <UTabs
          v-if="aba === 'modelos' && todosOsCanais"
          v-model="tipoDeModelo"
          :items="opcoesDeTipoDeModelo"
          :content="false"
          variant="pill"
          size="xs"
          :class="marca"
        />
        <UInput
          v-model="busca"
          :placeholder="aba === 'modelos' ? (tipoDeModelo === 'whatsapp' ? tk.pesquisarModelosWhatsApp : tc.pesquisarModelos) : tc.pesquisarCaixas"
          icon="i-lucide-search"
          size="sm"
          variant="soft"
          class="w-56"
          :aria-label="aba === 'modelos' ? (tipoDeModelo === 'whatsapp' ? tk.pesquisarModelosWhatsApp : tc.pesquisarModelos) : tc.pesquisarCaixas"
        />
        <UButton
          v-if="aba === 'modelos' && tipoDeModelo === 'whatsapp'"
          :label="tk.novoModeloWhatsApp"
          icon="i-lucide-plus"
          size="sm"
          class="ml-auto"
          :disabled="!twilioLigado"
          @click="novoModeloWhatsApp"
        />
        <UButton v-else :label="aba === 'modelos' ? tc.novoModelo : tc.novaCaixa" icon="i-lucide-plus" size="sm" class="ml-auto" @click="maquete" />
      </div>

      <div class="min-h-0 flex-1 overflow-auto">
        <!-- Fase 4: modelos de WhatsApp -->
        <TabelaDoEnspace
          v-if="aba === 'modelos' && tipoDeModelo === 'whatsapp'"
          :data="daPagina(modelosWhatsAppFiltrados)"
          :columns="colunasDeModelosWhatsApp"
          :acoes="acoesDoModeloWhatsApp"
          :rotulo-acoes="tc.col.acoes"
          :get-row-id="(m: ModeloDeWhatsApp) => m.id"
          @select="maquete"
        >
          <template #nome-cell="{ row }">
            <span class="block truncate font-mono text-xs text-highlighted" :title="row.original.nome">{{ row.original.nome }}</span>
          </template>
          <template #corpo-cell="{ row }">
            <span class="block truncate text-default" :title="row.original.corpo">{{ row.original.corpo }}</span>
          </template>
          <template #categoria-cell="{ row }">
            <span class="text-default">{{ tk.categoriaMeta[row.original.categoria] }}</span>
          </template>
          <template #idioma-cell="{ row }">
            <span class="font-mono text-xs text-muted">{{ row.original.idioma }}</span>
          </template>
          <template #variaveis-cell="{ row }">
            <span class="tabular-nums text-default">{{ variaveisDoModelo(row.original) }}</span>
          </template>
          <template #statusMeta-cell="{ row }">
            <UBadge :label="tk.statusMeta[row.original.status]" :icon="ICONE_DO_STATUS_META[row.original.status]" :color="COR_DO_STATUS_META[row.original.status]" variant="subtle" size="sm" />
          </template>
          <template #empty>
            <UEmpty
              variant="naked"
              icon="i-simple-icons-whatsapp"
              :title="twilioLigado ? tk.semModelosWhatsAppTitulo : tk.spaceflow.modal.semIntegracaoTitulo"
              :description="twilioLigado ? tk.semModelosWhatsAppDescricao : tk.spaceflow.modal.semIntegracaoDescricao"
              :actions="twilioLigado ? [{ label: tk.novoModeloWhatsApp, icon: 'i-lucide-plus', onClick: novoModeloWhatsApp }] : [{ label: tk.abrirIntegracoes, icon: 'i-lucide-blocks', color: 'neutral', variant: 'outline', onClick: maquete }]"
              class="py-12"
              :class="marca"
            />
          </template>
        </TabelaDoEnspace>

        <TabelaDoEnspace
          v-else-if="aba === 'modelos'"
          :data="daPagina(modelosFiltrados)"
          :columns="colunasDeModelos"
          :acoes="acoesDoModelo"
          :rotulo-acoes="tc.col.acoes"
          :get-row-id="(m: ModeloDeEmail) => m.id"
          @select="maquete"
        >
          <template #nome-cell="{ row }">
            <span class="block truncate text-highlighted" :title="row.original.nome">{{ row.original.nome }}</span>
          </template>
          <template #assunto-cell="{ row }">
            <span class="block truncate text-default" :title="row.original.assunto">{{ row.original.assunto }}</span>
          </template>
          <template #remetente-cell="{ row }">
            <UBadge :label="row.original.remetentePorDominio ? tc.sim : tc.nao" :color="row.original.remetentePorDominio ? 'success' : 'neutral'" variant="subtle" size="sm" />
          </template>
          <template #empty>
            <UEmpty
              v-if="!modelosDoWorkspace.length"
              variant="naked"
              icon="i-lucide-file-text"
              :title="tc.vazio.modelosTitulo"
              :description="tc.vazio.modelosDescricao"
              :actions="[{ label: tc.novoModelo, icon: 'i-lucide-plus', onClick: maquete }]"
              class="py-12"
              :class="marca"
            />
            <div v-else class="flex flex-col items-center justify-center py-12 text-muted">
              <UIcon name="i-lucide-file-text" class="mb-3 h-12 w-12" />
              <p class="text-sm">
                {{ t.emails.vazioDescricao }}
              </p>
            </div>
          </template>
        </TabelaDoEnspace>

        <TabelaDoEnspace
          v-else
          :data="daPagina(caixasFiltradas)"
          :columns="colunasDeCaixas"
          :acoes="acoesDaCaixa"
          :rotulo-acoes="tc.col.acoes"
          :get-row-id="(c: CaixaDeEmail) => c.id"
          @select="maquete"
        >
          <template #nome-cell="{ row }">
            <span class="block truncate text-highlighted">{{ row.original.nome }}</span>
          </template>
          <template #email-cell="{ row }">
            <span class="block truncate font-mono text-xs text-default" :title="row.original.email">{{ row.original.email }}</span>
          </template>
          <template #provedor-cell>
            <span class="font-mono text-xs text-muted">{{ DOMINIO_DAS_CAIXAS }}</span>
          </template>
          <template #empty>
            <UEmpty
              v-if="!caixasDoWorkspace.length"
              variant="naked"
              icon="i-lucide-mailbox"
              :title="tc.vazio.caixasTitulo"
              :description="tc.vazio.caixasDescricao"
              :actions="[{ label: tc.novaCaixa, icon: 'i-lucide-plus', onClick: maquete }]"
              class="py-12"
              :class="marca"
            />
            <div v-else class="flex flex-col items-center justify-center py-12 text-muted">
              <UIcon name="i-lucide-mailbox" class="mb-3 h-12 w-12" />
              <p class="text-sm">
                {{ t.emails.vazioDescricao }}
              </p>
            </div>
          </template>
        </TabelaDoEnspace>
      </div>

      <Paginador
        v-model:pagina="pagina"
        v-model:por-pagina="porPagina"
        :t="t"
        :total="aba === 'modelos' ? (tipoDeModelo === 'whatsapp' ? modelosWhatsAppFiltrados.length : modelosFiltrados.length) : caixasFiltradas.length"
      />
    </div>

    <!-- ===== Configurações: o padrão das telas de configuração do develop
         (Integrações › Webhooks): cabeçalho da seção num UPageCard naked e o
         conteúdo num UPageCard subtle, em largura total. Dentro, cada regra é
         uma linha (rótulo e explicação à esquerda, ação à direita), separadas
         por USeparator, como no modelo de configurações do Nuxt UI. ===== -->
    <div v-else class="flex flex-col gap-8 p-4 sm:p-6">
      <!-- Todo perfil: a conta de envio da pessoa -->
      <section>
        <UPageCard :description="tc.config.contaDescricao" variant="naked" orientation="horizontal" class="mb-4" :ui="{ description: 'ps-6' }">
          <template #title>
            <span class="flex items-center gap-2"><UIcon name="i-lucide-user-round" class="size-4 shrink-0 text-muted" />{{ tc.config.contaTitulo }}</span>
          </template>
        </UPageCard>
        <UPageCard variant="subtle" :ui="{ container: 'p-4 sm:p-6' }">
          <!-- A conta é uma linha como as regras: nome, status na descrição, ação à direita -->
          <UFormField
            class="flex items-start justify-between gap-4 max-sm:flex-col"
            :ui="{ wrapper: 'max-w-2xl', description: 'mt-1', container: 'shrink-0' }"
          >
            <template #label>
              <span class="flex items-center gap-2 text-base font-semibold text-highlighted"><UIcon name="i-lucide-mail" class="size-4 shrink-0 text-muted" />{{ tc.config.outlookTitulo }}</span>
            </template>
            <template #description>
              <!-- O ícone do status fica na coluna do ícone do título, e o texto na coluna do nome -->
              <span class="flex items-center gap-2">
                <UIcon
                  :name="outlookIntegrado ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'"
                  class="size-4 shrink-0"
                  :class="outlookIntegrado ? 'text-success' : 'text-warning'"
                />
                {{ outlookIntegrado ? tc.config.contaConectada(EU.email ?? '') : tc.config.contaSem }}
              </span>
            </template>
            <UButton
              :label="outlookIntegrado ? tc.config.gerenciar : tc.config.integrar"
              icon="i-lucide-plug"
              color="neutral"
              variant="outline"
              size="sm"
              @click="integrar"
            />
          </UFormField>
        </UPageCard>
      </section>

      <!-- Quem administra: as regras do workspace -->
      <section v-if="ehAdmin">
        <UPageCard :description="tc.config.regrasDescricao" variant="naked" orientation="horizontal" class="mb-4" :ui="{ description: 'ps-6' }">
          <template #title>
            <span class="flex items-center gap-2"><UIcon name="i-lucide-shield" class="size-4 shrink-0 text-muted" />{{ tc.config.regrasTitulo }}</span>
          </template>
        </UPageCard>
        <UPageCard variant="subtle" :ui="{ container: 'p-4 sm:p-6 gap-y-4' }">
          <!-- O contato do item -->
          <UFormField
            :description="fase >= 2 ? tc.config.contatoNaCategoria : tc.config.contatoPelosCampos"
            class="flex items-start justify-between gap-4 max-sm:flex-col"
            :ui="{ wrapper: 'max-w-2xl', description: 'ps-6', container: 'shrink-0' }"
          >
            <template #label>
              <span class="flex items-center gap-2 text-base font-semibold text-highlighted"><UIcon name="i-lucide-contact" class="size-4 shrink-0 text-muted" />{{ tc.config.contatoTitulo }}</span>
            </template>
            <UButton
              v-if="fase >= 2"
              :label="tc.config.irParaCategorias"
              trailing-icon="i-lucide-arrow-right"
              color="neutral"
              variant="outline"
              size="sm"
              @click="ir('categoria', { categoria: 'contratos', vista: 'atalhos' })"
            />
          </UFormField>

          <!-- Fase 2: caixas no "De" -->
          <template v-if="fase >= 2">
            <USeparator />
            <UFormField
              :description="tc.config.remetentesDescricao"
              :ui="{ wrapper: 'max-w-2xl', description: 'ps-6', container: 'mt-3 ps-6' }"
            >
              <template #label>
                <span class="flex items-center gap-2 text-base font-semibold text-highlighted"><UIcon name="i-lucide-inbox" class="size-4 shrink-0 text-muted" />{{ tc.config.remetentesTitulo }}</span>
              </template>
              <p v-if="!caixasDoWorkspace.length" class="text-sm text-muted">
                {{ tc.vazio.caixasTitulo }}
              </p>
              <div v-else class="flex flex-col divide-y divide-default rounded-md border border-default bg-default">
                <div v-for="c in caixasDoWorkspace" :key="c.id" class="flex flex-wrap items-center gap-3 px-3 py-2.5">
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-highlighted">
                      {{ c.nome }}
                    </p>
                    <p class="truncate font-mono text-xs text-muted">
                      {{ c.email }}
                    </p>
                  </div>
                  <USwitch v-model="noDe[c.id]" :label="tc.config.disponivelNoDe" size="sm" class="ml-auto" />
                </div>
              </div>
              <div v-if="caixasDoWorkspace.length" class="mt-3 flex justify-end">
                <UButton :label="tc.config.salvar" :loading="salvando" size="sm" @click="salvar" />
              </div>
            </UFormField>
          </template>

          <USeparator v-if="!todosOsCanais" />

          <!-- O domínio de envio (integração SendGrid de hoje). Na Fase 4, vai para "Canais de envio". -->
          <UFormField
            v-if="!todosOsCanais"
            :description="tc.config.dominioDescricao"
            class="flex items-start justify-between gap-4 max-sm:flex-col"
            :ui="{ wrapper: 'max-w-2xl', description: 'ps-6', container: 'shrink-0' }"
          >
            <template #label>
              <span class="flex items-center gap-2 text-base font-semibold text-highlighted"><UIcon name="i-lucide-globe" class="size-4 shrink-0 text-muted" />{{ tc.config.dominioTitulo }}</span>
            </template>
            <UButton :label="tc.config.abrirIntegracoes" icon="i-lucide-blocks" color="neutral" variant="outline" size="sm" @click="maquete" />
          </UFormField>
        </UPageCard>
      </section>

      <!-- PROPOSTA (Fase 4): os canais por onde o ENSPACE envia -->
      <section v-if="ehAdmin && todosOsCanais" :class="marca">
        <UPageCard :description="tk.canaisDescricao" variant="naked" orientation="horizontal" class="mb-4" :ui="{ description: 'ps-6' }">
          <template #title>
            <span class="flex items-center gap-2"><UIcon name="i-lucide-radio-tower" class="size-4 shrink-0 text-muted" />{{ tk.canaisTitulo }}</span>
          </template>
        </UPageCard>
        <UPageCard variant="subtle" :ui="{ container: 'p-4 sm:p-6 gap-y-4' }">
          <template v-for="(c, i) in canais" :key="c.chave">
            <USeparator v-if="i > 0" />
            <UFormField
              class="flex items-start justify-between gap-4 max-sm:flex-col"
              :ui="{ wrapper: 'max-w-2xl', description: 'mt-1 ps-6', container: 'flex shrink-0 gap-2' }"
            >
              <template #label>
                <span class="flex items-center gap-2 text-base font-semibold text-highlighted"><UIcon :name="c.icone" class="size-4 shrink-0 text-muted" />{{ c.titulo }}</span>
              </template>
              <template #description>
                <span class="block">{{ c.descricao }}</span>
                <span class="mt-1.5 flex items-center gap-1.5 text-sm" :class="c.ligado ? 'text-success' : 'text-warning'">
                  <UIcon :name="c.ligado ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'" class="size-4 shrink-0" />{{ c.status }}
                </span>
              </template>
              <UButton v-if="c.chave === 'whatsapp' && c.ligado" :label="tk.abrirModelos" icon="i-lucide-file-text" color="neutral" variant="outline" size="sm" @click="verModelosWhatsApp" />
              <UButton :label="tk.abrirIntegracoes" icon="i-lucide-blocks" color="neutral" variant="outline" size="sm" @click="maquete" />
            </UFormField>
          </template>
        </UPageCard>
      </section>
    </div>
  </div>
</template>
