<script setup lang="ts">
/**
 * PROPOSTA (rodada 7). As abas de configuração da central "E-mails", que
 * trazem para dentro dela as 3 telas de Configurações › E-mails de hoje:
 *
 *  - Modelos: Modelos de E-mail (Nome, Assunto, Ação, Usar Remetente por
 *    Domínio), com a permissão `settings::emails::templates` de hoje;
 *  - Caixas de E-mail: Nome, E-mail e Provedor, com `settings::emails::boxes`;
 *  - Enviados pelo sistema: E-mails Enviados (`sendmails`), com Status e
 *    "Reenviar E-mail", com `settings::emails::sent`;
 *  - Configurações: a conta de envio da pessoa (todo perfil) e, para quem
 *    administra, o domínio de envio, o contato do item e, na Fase 2, as
 *    caixas que entram no "De".
 *
 * Lido no código do develop em 24/11/2026. O conteúdo das 3 telas é o de hoje:
 * só o endereço muda (pesquisa de mercado: 1 lugar, configuração junto do uso).
 */
import type { TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import { caixas, DOMINIO_DAS_CAIXAS, EU, enviosDoSistema, modelos, type EnvioDoSistema } from './mocks'
import { type AbaDaCentral, useComunicacao, useMarcaDeProposta } from './estado'
import { useAppExterno } from './simulador'

const props = defineProps<{ t: Textos, aba: Exclude<AbaDaCentral, 'mensagens'> }>()

const { fase, ehAdmin, outlookIntegrado, caixasNoDe, ir, abrirCompositor } = useComunicacao()
const { abrirApp } = useAppExterno()
const marca = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const tc = computed(() => props.t.central)

/** As classes da tabela nova do develop (`EntityRendererManyTable`), como na aba Mensagens. */
const UI_DA_TABELA = {
  base: 'min-w-0 w-full border-separate border-spacing-0 table-fixed',
  thead: 'bg-elevated/50',
  th: 'relative border-b border-default px-4 py-2 text-left text-sm font-medium text-highlighted',
  td: 'border-b border-default py-1 px-4 h-12 max-h-12 overflow-hidden align-middle text-sm',
  empty: 'p-0',
}

function maquete() {
  toast.add({ title: tc.value.maquete, icon: 'i-lucide-info', color: 'neutral' })
}

/* ---------- Modelos ---------- */

const colunasDeModelos = computed<TableColumn<(typeof modelos)[number]>[]>(() => [
  { id: 'acoes', header: tc.value.col.acoes, meta: { style: { th: { width: '117px' } } } },
  { accessorKey: 'nome', header: tc.value.col.nome },
  { accessorKey: 'assunto', header: tc.value.col.assunto },
  { id: 'remetente', header: tc.value.col.remetentePorDominio, meta: { style: { th: { width: '220px' } } } },
])

/* ---------- Caixas ---------- */

const colunasDeCaixas = computed<TableColumn<(typeof caixas)[number]>[]>(() => [
  { id: 'acoes', header: tc.value.col.acoes, meta: { style: { th: { width: '117px' } } } },
  { accessorKey: 'nome', header: tc.value.col.nome },
  { accessorKey: 'email', header: tc.value.col.email },
  { id: 'provedor', header: tc.value.col.provedor, meta: { style: { th: { width: '200px' } } } },
])

/* ---------- Enviados pelo sistema ---------- */

const envios = ref<EnvioDoSistema[]>(structuredClone(enviosDoSistema).sort((a, b) => +b.criadoEm - +a.criadoEm))
const formato = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))
const COR_DO_STATUS: Record<EnvioDoSistema['status'], 'success' | 'info' | 'error'> = { enviado: 'success', processando: 'info', falhou: 'error' }

const colunasDeEnvios = computed<TableColumn<EnvioDoSistema>[]>(() => [
  { id: 'acoes', header: tc.value.col.acoes, meta: { style: { th: { width: '117px' } } } },
  { id: 'criadoEm', header: tc.value.col.criadoEm, meta: { style: { th: { width: '160px' } } } },
  { id: 'status', header: tc.value.col.status, meta: { style: { th: { width: '170px' } } } },
  { accessorKey: 'para', header: tc.value.col.destino },
  { id: 'cc', header: tc.value.col.copia },
  { accessorKey: 'assunto', header: tc.value.col.assunto },
  { id: 'tarefa', header: tc.value.col.tarefa, meta: { style: { th: { width: '110px' } } } },
])

function reenviar(e: EnvioDoSistema) {
  envios.value = envios.value.map(x => x.id === e.id ? { ...x, status: 'processando' } : x)
  toast.add({ title: tc.value.reenviado, icon: 'i-lucide-send', color: 'success' })
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
  <div class="animate-[entrada_.25s_ease-out] px-4 py-4 sm:px-6" :class="marca">
    <!-- ===== Modelos ===== -->
    <template v-if="aba === 'modelos'">
      <div class="mb-3 flex flex-wrap items-center gap-3">
        <p class="text-sm text-muted">
          {{ tc.dicas.modelos }}
        </p>
        <UButton :label="tc.novoModelo" icon="i-lucide-plus" size="sm" class="ml-auto" @click="maquete" />
      </div>
      <div class="overflow-hidden rounded-lg border border-default">
        <UTable :data="modelos" :columns="colunasDeModelos" :ui="UI_DA_TABELA">
          <template #acoes-cell="{ row }">
            <div class="flex items-center gap-0.5">
              <UTooltip :text="tc.usar">
                <UButton icon="i-lucide-mail-plus" color="neutral" variant="ghost" size="xs" :aria-label="tc.usar" @click="abrirCompositor({ origem: 'emails', modelo: row.original.id })" />
              </UTooltip>
              <UTooltip :text="tc.editar">
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" :aria-label="tc.editar" @click="maquete" />
              </UTooltip>
              <UTooltip :text="tc.excluir">
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" :aria-label="tc.excluir" @click="maquete" />
              </UTooltip>
            </div>
          </template>
          <template #remetente-cell="{ row }">
            <UBadge :label="row.original.remetentePorDominio ? tc.sim : tc.nao" :color="row.original.remetentePorDominio ? 'success' : 'neutral'" variant="subtle" size="sm" />
          </template>
        </UTable>
      </div>
    </template>

    <!-- ===== Caixas de E-mail ===== -->
    <template v-else-if="aba === 'caixas'">
      <div class="mb-3 flex flex-wrap items-center gap-3">
        <p class="text-sm text-muted">
          {{ tc.dicas.caixas }}
        </p>
        <UButton :label="tc.novaCaixa" icon="i-lucide-plus" size="sm" class="ml-auto" @click="maquete" />
      </div>
      <div class="overflow-hidden rounded-lg border border-default">
        <UTable :data="caixas" :columns="colunasDeCaixas" :ui="UI_DA_TABELA">
          <template #acoes-cell>
            <div class="flex items-center gap-0.5">
              <UTooltip :text="tc.editar">
                <UButton icon="i-lucide-pencil" color="neutral" variant="ghost" size="xs" :aria-label="tc.editar" @click="maquete" />
              </UTooltip>
              <UTooltip :text="tc.excluir">
                <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" :aria-label="tc.excluir" @click="maquete" />
              </UTooltip>
            </div>
          </template>
          <template #email-cell="{ row }">
            <span class="block truncate font-mono text-xs text-default" :title="row.original.email">{{ row.original.email }}</span>
          </template>
          <template #provedor-cell>
            <span class="font-mono text-xs text-muted">{{ DOMINIO_DAS_CAIXAS }}</span>
          </template>
        </UTable>
      </div>
    </template>

    <!-- ===== Enviados pelo sistema ===== -->
    <template v-else-if="aba === 'sistema'">
      <p class="mb-3 text-sm text-muted">
        {{ tc.dicas.sistema }}
      </p>
      <div class="overflow-x-auto rounded-lg border border-default">
        <UTable :data="envios" :columns="colunasDeEnvios" :ui="UI_DA_TABELA">
          <template #acoes-cell="{ row }">
            <div class="flex items-center gap-0.5">
              <UTooltip :text="tc.verEmail">
                <UButton icon="i-lucide-eye" color="neutral" variant="ghost" size="xs" :aria-label="tc.verEmail" @click="maquete" />
              </UTooltip>
              <UTooltip :text="tc.reenviar">
                <UButton icon="i-lucide-send" color="neutral" variant="ghost" size="xs" :aria-label="tc.reenviar" :disabled="row.original.status === 'processando'" @click="reenviar(row.original)" />
              </UTooltip>
            </div>
          </template>
          <template #criadoEm-cell="{ row }">
            <span class="whitespace-nowrap text-muted">{{ formato.format(row.original.criadoEm) }}</span>
          </template>
          <template #status-cell="{ row }">
            <UBadge :label="tc.status[row.original.status]" :color="COR_DO_STATUS[row.original.status]" variant="subtle" size="sm" />
          </template>
          <template #para-cell="{ row }">
            <span class="block truncate text-default" :title="row.original.para">{{ row.original.para }}</span>
          </template>
          <template #cc-cell="{ row }">
            <span v-if="row.original.cc.length" class="block truncate text-default">{{ row.original.cc.join(', ') }}</span>
            <span v-else class="text-dimmed">-</span>
          </template>
          <template #assunto-cell="{ row }">
            <span class="block truncate text-default" :title="row.original.assunto">{{ row.original.assunto }}</span>
          </template>
          <template #tarefa-cell="{ row }">
            <UBadge v-if="row.original.tarefa" :label="row.original.tarefa" icon="i-lucide-square-check-big" color="neutral" variant="subtle" size="sm" class="font-mono" />
            <span v-else class="text-dimmed">-</span>
          </template>
        </UTable>
      </div>
    </template>

    <!-- ===== Configurações ===== -->
    <div v-else class="mx-auto flex max-w-3xl flex-col gap-4">
      <p class="text-sm text-muted">
        {{ tc.dicas.configuracoes }}
      </p>

      <!-- Todo perfil: a conta de envio da pessoa -->
      <UCard>
        <template #header>
          <h2 class="flex items-center gap-2 font-semibold text-highlighted">
            <UIcon name="i-lucide-user-round" class="size-4 text-muted" />{{ tc.config.contaTitulo }}
          </h2>
          <p class="mt-1 text-sm text-muted">
            {{ tc.config.contaDescricao }}
          </p>
        </template>
        <div class="flex flex-wrap items-center gap-3">
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
            class="ml-auto"
            @click="integrar"
          />
        </div>
      </UCard>

      <template v-if="ehAdmin">
        <p class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-shield" class="size-3.5" />{{ tc.config.soAdmin }}
        </p>

        <!-- O contato do item -->
        <UCard>
          <template #header>
            <h2 class="flex items-center gap-2 font-semibold text-highlighted">
              <UIcon name="i-lucide-contact" class="size-4 text-muted" />{{ tc.config.contatoTitulo }}
            </h2>
          </template>
          <p class="text-sm text-default">
            {{ fase >= 2 ? tc.config.contatoNaCategoria : tc.config.contatoPelosCampos }}
          </p>
          <UButton
            v-if="fase >= 2"
            :label="tc.config.irParaCategorias"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="outline"
            size="sm"
            class="mt-3"
            @click="ir('categoria', { categoria: 'contratos', vista: 'atalhos' })"
          />
        </UCard>

        <!-- Fase 2: caixas no "De" -->
        <UCard v-if="fase >= 2">
          <template #header>
            <h2 class="flex items-center gap-2 font-semibold text-highlighted">
              <UIcon name="i-lucide-inbox" class="size-4 text-muted" />{{ tc.config.remetentesTitulo }}
            </h2>
            <p class="mt-1 text-sm text-muted">
              {{ tc.config.remetentesDescricao }}
            </p>
          </template>
          <div class="flex flex-col divide-y divide-default">
            <div v-for="c in caixas" :key="c.id" class="flex flex-wrap items-center gap-3 py-2.5 first:pt-0 last:pb-0">
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
          <template #footer>
            <div class="flex justify-end">
              <UButton :label="tc.config.salvar" :loading="salvando" @click="salvar" />
            </div>
          </template>
        </UCard>

        <!-- O domínio de envio (integração SendGrid de hoje) -->
        <UCard>
          <template #header>
            <h2 class="flex items-center gap-2 font-semibold text-highlighted">
              <UIcon name="i-lucide-globe" class="size-4 text-muted" />{{ tc.config.dominioTitulo }}
            </h2>
          </template>
          <div class="flex flex-wrap items-center gap-3">
            <p class="min-w-0 flex-1 text-sm text-default">
              {{ tc.config.dominioDescricao }}
            </p>
            <UButton :label="tc.config.abrirIntegracoes" icon="i-lucide-blocks" color="neutral" variant="outline" size="sm" @click="maquete" />
          </div>
        </UCard>
      </template>
    </div>
  </div>
</template>
