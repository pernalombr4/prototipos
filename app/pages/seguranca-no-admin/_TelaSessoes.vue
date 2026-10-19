<script setup lang="ts">
/**
 * Pedido 6 (parte 2): Identidade › Sessões. Tela nova.
 *
 * Hoje existe a configuração `session_timeout_minutes` em Configurações Gerais,
 * marcada "sem efeito" (develop, 2026-10-19), e nenhuma lista de sessões.
 * Referências: Notion (Managed users: deslogar 1 pessoa ou todas, duração da
 * sessão), Atlassian (duração máxima e tempo ocioso de 15 min a 30 dias).
 * É aqui que o "imediato" do cliente acontece.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import { sessoes as sessoesIniciais } from './mocks'
import type { Sessao } from './mocks'
import { relativo } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const idioma = useIdioma()
const toast = useToast()
const ts = computed(() => props.t.sessoes)

const sessoes = useState<Sessao[]>('sa-sessoes', () => structuredClone(sessoesIniciais))
const politica = useState('sa-sessoes-politica', () => ({ duracao: 720, ociosa: 60 }))
const rascunho = reactive({ ...politica.value })
const alterada = computed(() => rascunho.duracao !== politica.value.duracao || rascunho.ociosa !== politica.value.ociosa)
function salvar() {
  politica.value = { ...rascunho }
  toast.add({ title: ts.value.salvo, icon: 'i-lucide-check', color: 'success' })
}

const busca = ref('')
const filtradas = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return sessoes.value.filter(s => !q || `${s.pessoa.nome} ${s.pessoa.email}`.toLowerCase().includes(q))
})
const pessoasComSessao = computed(() => new Set(sessoes.value.map(s => s.pessoa.email)).size)
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'pessoa', label: ts.value.col.pessoa },
  { key: 'dispositivo', label: ts.value.col.dispositivo },
  { key: 'ip', label: ts.value.col.ip },
  { key: 'inicio', label: ts.value.col.inicio },
  { key: 'ultimaAtividade', label: ts.value.col.atividade },
])

const saindo = ref<string[]>([])
function encerrar(lista: Sessao[]) {
  const ids = lista.map(s => s.id)
  saindo.value.push(...ids)
  setTimeout(() => {
    sessoes.value = sessoes.value.filter(s => !ids.includes(s.id))
    saindo.value = saindo.value.filter(id => !ids.includes(id))
    toast.add({ title: ts.value.encerradas(ids.length), icon: 'i-lucide-log-out', color: 'success' })
  }, 500)
}
const confirmar = ref(false)
const encerrando = ref(false)
function encerrarTodas() {
  encerrando.value = true
  setTimeout(() => {
    const n = sessoes.value.length
    sessoes.value = []
    encerrando.value = false
    confirmar.value = false
    toast.add({ title: ts.value.encerradas(n), icon: 'i-lucide-log-out', color: 'success' })
  }, 900)
}
</script>

<template>
  <div>
    <Cabecalho :titulo="ts.titulo" :intro="ts.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        <UButton :label="t.comum.salvar" size="sm" :disabled="!alterada" @click="salvar" />
        <UButton :label="ts.encerrarTodas" icon="i-lucide-log-out" size="sm" color="error" variant="outline" :disabled="!sessoes.length" @click="confirmar = true" />
      </template>
    </Cabecalho>

    <div class="space-y-4 p-6">
      <div class="grid gap-4 lg:grid-cols-2">
        <Regra :titulo="ts.duracao" icone="i-lucide-clock" :descricao="ts.duracaoAjuda" :alterada="rascunho.duracao !== politica.duracao">
          <USelect v-model="rascunho.duracao" :items="Object.entries(ts.duracaoOpcoes).map(([v, l]) => ({ label: l, value: Number(v) }))" class="w-48" />
        </Regra>
        <Regra :titulo="ts.ociosa" icone="i-lucide-coffee" :descricao="ts.ociosaAjuda" :alterada="rascunho.ociosa !== politica.ociosa">
          <USelect v-model="rascunho.ociosa" :items="Object.entries(ts.ociosaOpcoes).map(([v, l]) => ({ label: l, value: Number(v) }))" class="w-48" />
        </Regra>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UInput v-model="busca" :placeholder="ts.buscar" icon="i-lucide-search" size="sm" class="w-64" />
        <span class="text-xs text-muted">{{ ts.resumo(sessoes.length, pessoasComSessao) }}</span>
      </div>

      <EnTable :columns="colunas" :rows="(filtradas as unknown as Record<string, unknown>[])" :locale="idioma" :empty-state="{ icon: 'i-lucide-monitor-off', title: ts.vazioTitulo, description: ts.vazio }">
        <template #cell-pessoa="{ row }">
          <span class="flex items-center gap-2 transition-opacity duration-300" :class="saindo.includes((row as any).id) ? 'opacity-30' : ''">
            <UAvatar :alt="(row as any).pessoa.nome" size="xs" />
            <span class="leading-tight">
              <span class="block text-sm text-highlighted">{{ (row as any).pessoa.nome }}</span>
              <span class="block text-xs text-muted">{{ (row as any).pessoa.email }}</span>
            </span>
          </span>
        </template>
        <template #cell-dispositivo="{ row }"><span class="text-sm text-toned">{{ (row as any).dispositivo }}</span></template>
        <template #cell-ip="{ row }"><span class="font-mono text-xs text-muted">{{ (row as any).ip }}</span></template>
        <template #cell-inicio="{ row }"><span class="whitespace-nowrap text-sm text-toned">{{ relativo((row as any).inicio, idioma) }}</span></template>
        <template #cell-ultimaAtividade="{ row }"><span class="whitespace-nowrap text-sm text-toned">{{ relativo((row as any).ultimaAtividade, idioma) }}</span></template>
        <template #actions="{ row }">
          <UDropdownMenu
            :items="[[
              { label: ts.encerrar, icon: 'i-lucide-log-out', onSelect: () => encerrar([row as any]) },
              { label: ts.encerrarDe((row as any).pessoa.nome), icon: 'i-lucide-user-x', color: 'error', onSelect: () => encerrar(sessoes.filter(s => s.pessoa.email === (row as any).pessoa.email)) },
            ]]"
          >
            <UButton icon="i-lucide-ellipsis-vertical" size="xs" color="neutral" variant="ghost" :aria-label="ts.encerrar" />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>

    <UModal v-model:open="confirmar" :title="ts.encerrarTodasTitulo(sessoes.length)" :description="ts.encerrarTodasTexto">
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="confirmar = false" />
          <UButton :label="ts.encerrarTodas" color="error" :loading="encerrando" @click="encerrarTodas" />
        </div>
      </template>
    </UModal>
  </div>
</template>
