<script setup lang="ts">
/**
 * Pedido 5: Proteção de dados › IA e BENI. Tela nova.
 *
 * Hoje o admin tem só o log "AI Usage" (modelo, custo, tokens). Referências:
 * Notion (busca na web e confirmação antes de requisição externa, criados
 * depois do vazamento por PDF de 2025-09), Azure AI Foundry ("Document attack"
 * com bloquear ou anotar), GitHub (firewall do agente com allowlist) e o caso
 * Rovo (desligar a busca na web não fechou a ferramenta que abre URL). Por isso
 * a IA segue a mesma lista de Destinos de saída do nó HTTP.
 *
 * "Tentativas detectadas" só faz sentido com um detector de verdade por trás.
 * É proposta e depende de engenharia: está no DECISOES.md.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { Tela } from './_CascaDoAdmin.vue'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import Modo from './_Modo.vue'
import type { Modo as TipoModo } from './_Modo.vue'
import { cargos, nomeDoWorkspace, tentativas } from './mocks'
import { relativo } from './apoio'
import { useDestinos } from './estado'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const emit = defineEmits<{ navegar: [tela: Tela] }>()
const idioma = useIdioma()
const toast = useToast()
const ti = computed(() => props.t.ia)
const destinos = useDestinos()

interface ConfigIA { ativo: boolean, quem: string[], busca: boolean, confirmar: boolean, anexos: boolean, detectar: TipoModo, acoes: string[] }
const salvo = useState<ConfigIA>('sa-ia', () => ({ ativo: true, quem: [...cargos.slice(0, 3)], busca: true, confirmar: true, anexos: true, detectar: 'bloquear', acoes: ['enviar', 'api'] }))
const c = reactive<ConfigIA>(structuredClone(toRaw(salvo.value)))
const alterada = computed(() => JSON.stringify(c) !== JSON.stringify(salvo.value))
function salvar() {
  salvo.value = structuredClone(toRaw(c))
  toast.add({ title: ti.value.salvo, icon: 'i-lucide-check', color: 'success' })
}

const itensAcoes = computed(() => (['enviar', 'editar', 'api', 'tarefa'] as const).map(v => ({ label: ti.value.acoes[v], value: v })))
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'quando', label: ti.value.col.quando },
  { key: 'fonte', label: ti.value.col.fonte },
  { key: 'trecho', label: ti.value.col.trecho },
  { key: 'resultado', label: ti.value.col.resultado },
  { key: 'pediuPor', label: ti.value.col.pedido },
])
/* Com "Só registrar", o que seria barrado aparece como registrado. */
const linhas = computed(() => salvo.value.detectar === 'desligado'
  ? []
  : tentativas.map(x => ({ ...x, resultado: salvo.value.detectar === 'registrar' ? 'registrada' : x.resultado })) as unknown as Record<string, unknown>[])
</script>

<template>
  <div>
    <Cabecalho :titulo="ti.titulo" :intro="ti.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0">
          <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        </Transition>
        <UButton :label="t.comum.descartar" size="sm" color="neutral" variant="ghost" :disabled="!alterada" @click="Object.assign(c, structuredClone(toRaw(salvo)))" />
        <UButton :label="t.comum.salvar" size="sm" :disabled="!alterada" @click="salvar" />
      </template>
    </Cabecalho>

    <div class="space-y-6 p-6">
      <!-- Uso -->
      <section class="space-y-3">
        <h2 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-sparkles" class="size-4 text-primary" />{{ ti.secaoUso }}</h2>
        <div class="grid gap-4 lg:grid-cols-2">
          <Regra :titulo="ti.ativar" icone="i-lucide-power" :descricao="ti.ativarAjuda" :alterada="c.ativo !== salvo.ativo">
            <USwitch :aria-label="ti.ativar" v-model="c.ativo" />
          </Regra>
          <Regra :titulo="ti.quem" icone="i-lucide-users" :alterada="JSON.stringify(c.quem) !== JSON.stringify(salvo.quem)">
            <USelectMenu v-model="c.quem" :items="[...cargos]" multiple :disabled="!c.ativo" class="w-full" />
          </Regra>
        </div>
      </section>

      <div class="space-y-6 transition-opacity" :class="c.ativo ? '' : 'pointer-events-none opacity-50'">
        <!-- Saída para fora -->
        <section class="space-y-3">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-door-open" class="size-4 text-primary" />{{ ti.secaoSaida }}</h2>
          <div class="grid gap-4 lg:grid-cols-3">
            <Regra :titulo="ti.busca" icone="i-lucide-search" :descricao="ti.buscaAjuda" :alterada="c.busca !== salvo.busca">
              <USwitch :aria-label="ti.busca" v-model="c.busca" />
            </Regra>
            <Regra :titulo="ti.confirmar" icone="i-lucide-hand" :descricao="ti.confirmarAjuda" :alterada="c.confirmar !== salvo.confirmar">
              <USwitch :aria-label="ti.confirmar" v-model="c.confirmar" />
            </Regra>
            <Regra :titulo="ti.destinos" icone="i-lucide-route" :descricao="ti.destinosAjuda">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge :label="t.destinos.modos[destinos.modo]" :color="destinos.modo === 'todos' ? 'warning' : 'success'" variant="soft" size="sm" />
                <UButton :label="ti.irDestinos" trailing-icon="i-lucide-arrow-right" size="xs" variant="outline" @click="emit('navegar', 'destinos')" />
              </div>
            </Regra>
          </div>
        </section>

        <!-- Conteúdo lido -->
        <section class="space-y-3">
          <h2 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-file-search" class="size-4 text-primary" />{{ ti.secaoConteudo }}</h2>
          <div class="grid gap-4 lg:grid-cols-[1fr_2fr]">
            <Regra :titulo="ti.anexos" icone="i-lucide-paperclip" :descricao="ti.anexosAjuda" :alterada="c.anexos !== salvo.anexos">
              <USwitch :aria-label="ti.anexos" v-model="c.anexos" />
            </Regra>
            <Regra :titulo="ti.detectar" icone="i-lucide-scan-eye" :descricao="ti.detectarAjuda" :alterada="c.detectar !== salvo.detectar">
              <template #selos><UBadge v-if="marcarNovo" :label="t.casca.novo" size="sm" variant="soft" /></template>
              <Modo v-model="c.detectar" :t="t" />
            </Regra>
          </div>
        </section>

        <!-- Ações que pedem confirmação -->
        <Regra :titulo="ti.secaoAcoes" icone="i-lucide-shield-check" :descricao="ti.acoesAjuda" :alterada="JSON.stringify(c.acoes) !== JSON.stringify(salvo.acoes)">
          <UCheckboxGroup v-model="c.acoes" :items="itensAcoes" orientation="horizontal" :ui="{ fieldset: 'flex-wrap gap-x-6 gap-y-2' }" />
        </Regra>

        <!-- Fixas -->
        <section class="rounded-lg border border-default bg-elevated/40 p-4">
          <h3 class="mb-2 text-sm font-semibold text-highlighted">{{ ti.fixasTitulo }}</h3>
          <ul class="space-y-1.5">
            <li v-for="f in ti.fixas" :key="f" class="flex items-start gap-2 text-sm text-toned">
              <UIcon name="i-lucide-lock" class="mt-0.5 size-4 shrink-0 text-success" />{{ f }}
            </li>
          </ul>
        </section>

        <!-- Tentativas -->
        <section class="space-y-2">
          <div>
            <h2 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-siren" class="size-4 text-primary" />{{ ti.tentativas }}</h2>
            <p class="text-xs text-muted">{{ ti.tentativasAjuda }}</p>
          </div>
          <EnTable :columns="colunas" :rows="linhas" :locale="idioma" :empty-state="{ icon: 'i-lucide-scan-eye', title: ti.desligadoTitulo, description: ti.desligado }">
            <template #cell-quando="{ row }">
              <span class="whitespace-nowrap text-sm text-toned">{{ relativo((row as any).quando, idioma) }}</span>
              <span class="block text-xs text-muted">{{ nomeDoWorkspace((row as any).workspace) }}</span>
            </template>
            <template #cell-fonte="{ row }">
              <span class="text-sm text-highlighted">{{ (row as any).fonte }}</span>
            </template>
            <template #cell-trecho="{ row }">
              <code class="block max-w-80 truncate rounded bg-elevated px-1.5 py-0.5 font-mono text-[11px] text-toned">{{ (row as any).trecho }}</code>
            </template>
            <template #cell-resultado="{ row }">
              <UBadge :label="ti.resultados[(row as any).resultado as 'bloqueada' | 'registrada']" :color="(row as any).resultado === 'bloqueada' ? 'error' : 'warning'" variant="soft" size="sm" />
            </template>
            <template #cell-pediuPor="{ row }">
              <span class="text-sm text-toned">{{ (row as any).pediuPor }}</span>
            </template>
          </EnTable>
        </section>
      </div>
    </div>
  </div>
</template>
