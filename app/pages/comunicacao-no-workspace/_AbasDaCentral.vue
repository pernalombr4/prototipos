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
 */
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import { type CaixaDeEmail, type ModeloDeEmail, DOMINIO_DAS_CAIXAS, EU } from './mocks'
import { type AbaDaCentral, useComunicacao, useMarcaDeProposta } from './estado'
import { useAppExterno } from './simulador'
import TabelaDoEnspace from './_TabelaDoEnspace.vue'
import Paginador from './_Paginador.vue'

const props = defineProps<{ t: Textos, aba: Exclude<AbaDaCentral, 'mensagens'> }>()

const { fase, ehAdmin, outlookIntegrado, caixasNoDe, ir, abrirCompositor, modelosDoWorkspace, caixasDoWorkspace } = useComunicacao()
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

function integrar() {
  abrirApp({ tipo: 'outlook', url: 'https://app.enspace.io/profile?tab=integrations' })
}
</script>

<template>
  <div class="animate-[entrada_.25s_ease-out]" :class="marca">
    <!-- ===== Modelos e Caixas: barra, tabela e paginador do develop ===== -->
    <div v-if="aba === 'modelos' || aba === 'caixas'" class="flex min-h-0 flex-col">
      <div class="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4">
        <UInput
          v-model="busca"
          :placeholder="aba === 'modelos' ? tc.pesquisarModelos : tc.pesquisarCaixas"
          icon="i-lucide-search"
          size="sm"
          variant="soft"
          class="w-56"
          :aria-label="aba === 'modelos' ? tc.pesquisarModelos : tc.pesquisarCaixas"
        />
        <UButton :label="aba === 'modelos' ? tc.novoModelo : tc.novaCaixa" icon="i-lucide-plus" size="sm" class="ml-auto" @click="maquete" />
      </div>

      <div class="min-h-0 flex-1 overflow-auto">
        <TabelaDoEnspace
          v-if="aba === 'modelos'"
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
        :total="aba === 'modelos' ? modelosFiltrados.length : caixasFiltradas.length"
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
          <div class="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
            <UBadge
              :label="outlookIntegrado ? tc.config.contaConectada(EU.email ?? '') : tc.config.contaSem"
              :icon="outlookIntegrado ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'"
              :color="outlookIntegrado ? 'success' : 'warning'"
              variant="subtle"
              class="max-w-full"
              :ui="{ label: 'whitespace-normal text-left' }"
            />
            <UButton
              :label="outlookIntegrado ? tc.config.gerenciar : tc.config.integrar"
              icon="i-lucide-plug"
              color="neutral"
              variant="outline"
              size="sm"
              class="shrink-0"
              @click="integrar"
            />
          </div>
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

          <USeparator />

          <!-- O domínio de envio (integração SendGrid de hoje) -->
          <UFormField
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
    </div>
  </div>
</template>
