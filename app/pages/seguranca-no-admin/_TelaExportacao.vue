<script setup lang="ts">
/**
 * Pedido 8 (parte 1): Proteção de dados › Exportação e download. Tela nova.
 *
 * Referências: Atlassian Guard (regras separadas para exportar, baixar anexo e
 * link público, com exceção por espaço), Airtable (mensagem para quem é
 * bloqueado), Box Shield (modo monitorar). Notion e monday têm 1 interruptor só;
 * ClickUp e Pipefy não recortam por papel. Aqui cada regra tem os 3 modos, cargo
 * e exceção por workspace, e a prévia mostra o que a pessoa vê.
 */
import type { Textos } from './textos'
import type { Tela } from './_CascaDoAdmin.vue'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import Modo from './_Modo.vue'
import type { Modo as TipoModo } from './_Modo.vue'
import { cargos, eventos, workspaces } from './mocks'
import type { Cargo } from './mocks'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const emit = defineEmits<{ navegar: [tela: Tela] }>()
const toast = useToast()
const te = computed(() => props.t.exportacao)

type Chave = 'exportar' | 'anexos' | 'link'
interface RegraDeSaida { modo: TipoModo, quem: 'todos' | 'cargos' | 'ninguem', cargos: Cargo[], excecoes: string[] }
const salvo = useState<Record<Chave, RegraDeSaida>>('sa-exportacao', () => ({
  exportar: { modo: 'registrar', quem: 'cargos', cargos: ['Administrador do workspace', 'Membro completo'], excecoes: [] },
  anexos: { modo: 'desligado', quem: 'todos', cargos: [], excecoes: [] },
  link: { modo: 'bloquear', quem: 'ninguem', cargos: [], excecoes: ['comercial-etanol'] },
}))
const r = reactive<Record<Chave, RegraDeSaida>>(structuredClone(toRaw(salvo.value)))
const alterada = computed(() => JSON.stringify(r) !== JSON.stringify(salvo.value))
function salvar() {
  salvo.value = structuredClone(toRaw(r))
  toast.add({ title: te.value.salvo, icon: 'i-lucide-check', color: 'success' })
}
const chaves: { chave: Chave, icone: string }[] = [
  { chave: 'exportar', icone: 'i-lucide-file-spreadsheet' },
  { chave: 'anexos', icone: 'i-lucide-paperclip' },
  { chave: 'link', icone: 'i-lucide-link' },
]
const itensWs = workspaces.map(w => ({ label: w.name, value: w.reference }))

/* ---------- prévia ---------- */
const verComo = ref<Cargo>('Membro padrão')
function situacao(k: Chave, cargo: Cargo): 'livre' | 'registra' | 'bloqueia' {
  const g = r[k]
  if (g.modo === 'desligado') return 'livre'
  const pode = g.quem === 'todos' || (g.quem === 'cargos' && g.cargos.includes(cargo))
  if (pode) return 'livre'
  return g.modo === 'registrar' ? 'registra' : 'bloqueia'
}
const previa = computed(() => situacao('exportar', verComo.value))

/* Estimativa: exportações do registro feitas por quem a regra barraria. Cargo das pessoas: mock. */
const cargoDe: Record<string, Cargo> = {
  'Ana Ribeiro': 'Administrador do workspace', 'Helena Duarte': 'Administrador do workspace', 'Elisa Prado': 'Membro completo',
  'Larissa Couto': 'Leitor', 'Murilo Vieira': 'Convidado externo',
}
const estimativa = computed(() => eventos.filter(e => (e.codigo === 'export.started') && situacao('exportar', cargoDe[e.ator.nome] ?? 'Membro padrão') !== 'livre').length)
</script>

<template>
  <div>
    <Cabecalho :titulo="te.titulo" :intro="te.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        <UButton :label="t.comum.descartar" size="sm" color="neutral" variant="ghost" :disabled="!alterada" @click="Object.assign(r, structuredClone(toRaw(salvo)))" />
        <UButton :label="t.comum.salvar" size="sm" :disabled="!alterada" @click="salvar" />
      </template>
    </Cabecalho>

    <div class="grid gap-4 p-6 2xl:grid-cols-[1fr_22rem]">
      <div class="space-y-4">
        <Regra
          v-for="(k, i) in chaves"
          :key="k.chave"
          :titulo="te.regras[k.chave].titulo"
          :icone="k.icone"
          :descricao="te.regras[k.chave].ajuda"
          :alterada="JSON.stringify(r[k.chave]) !== JSON.stringify(salvo[k.chave])"
          class="animate-[entrada_.3s_ease-out_both]"
          :style="{ animationDelay: `${i * 70}ms` }"
        >
          <div class="grid gap-4 lg:grid-cols-[auto_1fr_1fr]">
            <Modo v-model="r[k.chave].modo" :t="t" :rotulo="te.modo" />
            <div class="space-y-1.5" :class="r[k.chave].modo === 'desligado' ? 'opacity-50' : ''">
              <p class="text-xs font-medium text-toned">{{ te.quem }}</p>
              <USelect v-model="r[k.chave].quem" :items="(['todos', 'cargos', 'ninguem'] as const).map(v => ({ label: te.quemOpcoes[v], value: v }))" size="sm" class="w-full" :disabled="r[k.chave].modo === 'desligado'" />
              <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
                <div v-if="r[k.chave].quem === 'cargos'">
                  <USelectMenu v-model="r[k.chave].cargos" :items="[...cargos]" multiple :placeholder="te.cargosPh" size="sm" class="w-full" :disabled="r[k.chave].modo === 'desligado'" />
                </div>
              </Transition>
            </div>
            <div class="space-y-1.5" :class="r[k.chave].modo === 'desligado' ? 'opacity-50' : ''">
              <p class="text-xs font-medium text-toned">{{ te.excecoes }}</p>
              <USelectMenu v-model="r[k.chave].excecoes" :items="itensWs" value-key="value" multiple :placeholder="te.excecoesPh" size="sm" class="w-full" :disabled="r[k.chave].modo === 'desligado'" />
              <p class="text-[11px] text-muted">{{ te.excecoesAjuda }}</p>
            </div>
          </div>
        </Regra>

        <UAlert
          icon="i-lucide-mail-plus"
          color="neutral"
          variant="subtle"
          :title="te.convitesLink"
          :actions="[{ label: te.irConvites, variant: 'outline', size: 'xs', trailingIcon: 'i-lucide-arrow-right', onClick: () => emit('navegar', 'convites') }]"
        />
      </div>

      <!-- Prévia -->
      <aside class="h-fit space-y-3 rounded-lg border border-dashed border-accented bg-elevated/50 p-4">
        <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ te.previa }}</p>
        <UFormField :label="te.verComo">
          <USelect v-model="verComo" :items="[...cargos]" size="sm" class="w-full" />
        </UFormField>
        <div class="rounded-lg border border-default bg-default p-3 shadow-sm">
          <div class="flex items-center gap-2 border-b border-default pb-2">
            <UIcon name="i-lucide-table-2" class="size-4 text-muted" />
            <span class="text-sm font-medium text-highlighted">Contratos de frete</span>
            <UTooltip :text="previa === 'bloqueia' ? te.bloqueadoTexto : ''" :disabled="previa !== 'bloqueia'">
              <UButton :label="te.botaoExportar" icon="i-lucide-download" size="xs" color="neutral" variant="outline" class="ml-auto" :disabled="previa === 'bloqueia'" />
            </UTooltip>
          </div>
          <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0 translate-y-1">
            <p :key="previa" class="mt-2 flex items-start gap-1.5 text-xs" :class="previa === 'bloqueia' ? 'text-error' : previa === 'registra' ? 'text-warning' : 'text-success'">
              <UIcon :name="previa === 'bloqueia' ? 'i-lucide-ban' : previa === 'registra' ? 'i-lucide-scroll-text' : 'i-lucide-circle-check'" class="mt-0.5 size-3.5 shrink-0" />
              {{ previa === 'bloqueia' ? te.bloqueadoTexto : previa === 'registra' ? te.registrando : te.liberado }}
            </p>
          </Transition>
        </div>
        <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0">
          <p :key="estimativa" class="text-xs text-toned">{{ te.estimativa(estimativa) }}</p>
        </Transition>
      </aside>
    </div>
  </div>
</template>
