<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a aba Automações do projeto, na interface da área Spaceflows do membro
 * (/workflows), lida no código em 2026-11-26 e copiada como está:
 *  - "Buscar workflows..." e "{n} workflows encontrados";
 *  - grade de cards: ícone, nome, `v{versão}`, selo Ativo (play) ou Inativo (pause), descrição ou
 *    "Nenhuma descrição informada", o gatilho cru (`c_items:<slug> -> create`) e a data de criação;
 *  - botões Abrir (a página de execuções) e Executar (só no gatilho Manual, desligado se inativo).
 *
 * O que o projeto acrescenta, marcado: a lista só traz os workflows cujo gatilho escuta uma categoria
 * do projeto (hoje nenhuma tela lista os workflows de uma categoria), e o
 * "Novo Workflow" com o gatilho já escolhido. A tabela de avisos de prazo da rodada 3 saiu: não é
 * interface do Spaceflow.
 */
import type { Textos } from './textos'
import { detalhesDoFluxo, type Fluxo, type Gatilho } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const rw = computed(() => r.value.workflows)
const { marca } = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const p = computed(() => prj.projetos.value.find(x => x.id === props.id)!)
const admin = computed(() => prj.podeAdministrar(p.value))
const categorias = computed(() => prj.categoriasDe(props.id))
const busca = ref('')
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const fluxos = computed(() => prj.fluxosDoProjeto(props.id).filter((f) => {
  const q = normalizar(busca.value.trim())
  return !q || normalizar(`${f.nome} ${detalhesDoFluxo[f.id]?.descricao ?? ''}`).includes(q)
}))

const ACAO: Record<Gatilho, string> = { criado: 'create', atualizado: 'update', excluido: 'delete', agendado: 'timer' }
function gatilhoCru(f: Fluxo) {
  const slug = prj.categorias.value.find(c => c.id === f.categoria)?.slug ?? ''
  return f.gatilho === 'agendado' ? 'timer' : `c_items:${slug} -> ${ACAO[f.gatilho]}`
}
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value)
</script>

<template>
  <div class="space-y-4" :class="marca">
    <!-- barra: a da área Spaceflows -->
    <div class="flex flex-wrap items-center gap-2">
      <UInput v-model="busca" :placeholder="rw.buscar" icon="i-lucide-search" size="sm" class="w-64" :aria-label="rw.buscar" />
      <span class="text-sm text-muted">{{ rw.encontrados(fluxos.length) }}</span>
      <UButton v-if="admin" :label="rw.novo" icon="i-lucide-plus" size="sm" class="ml-auto" @click="prj.janelas.novoFluxo.value = id" />
    </div>
    <p class="text-xs text-muted">{{ rw.dica }}</p>

    <!-- grade de cards -->
    <div v-if="fluxos.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="(f, i) in fluxos"
        :key="f.id"
        class="flex flex-col rounded-lg border border-default bg-default p-4 transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-md animate-[entrada_0.2s_ease-out_both]"
        :style="{ animationDelay: `${i * 30}ms` }"
      >
        <header class="flex items-start gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon :name="detalhesDoFluxo[f.id]?.icone ?? 'i-lucide-workflow'" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <h3 class="line-clamp-2 text-sm font-semibold text-highlighted">{{ f.nome }}</h3>
            <p class="mt-0.5 font-mono text-xs text-muted">v{{ detalhesDoFluxo[f.id]?.versao ?? '0.0.1' }}</p>
          </div>
          <UBadge
            :label="f.ativo ? rw.ativo : rw.inativo"
            :icon="f.ativo ? 'i-lucide-play-circle' : 'i-lucide-pause-circle'"
            :color="f.ativo ? 'success' : 'neutral'"
            variant="subtle"
            size="sm"
          />
        </header>
        <p class="mt-3 line-clamp-2 flex-1 text-sm" :class="detalhesDoFluxo[f.id]?.descricao ? 'text-default' : 'italic text-muted'">
          {{ detalhesDoFluxo[f.id]?.descricao || rw.semDescricao }}
        </p>
        <div class="mt-3 space-y-1 text-xs text-muted">
          <p class="flex items-center gap-1.5"><UIcon name="i-lucide-zap" class="size-3.5 shrink-0" /><span class="truncate font-mono">{{ gatilhoCru(f) }}</span></p>
          <p class="flex items-center gap-1.5"><UIcon name="i-lucide-calendar" class="size-3.5 shrink-0" />{{ formatarData(detalhesDoFluxo[f.id]?.criadoEm ?? '2026-11-26') }}</p>
        </div>
        <footer class="mt-4 flex gap-2">
          <UButton :label="rw.abrir" icon="i-lucide-external-link" size="sm" color="neutral" variant="outline" class="flex-1 justify-center" @click="toast.add({ title: rw.abreExecucoes(f.nome), icon: 'i-lucide-info', color: 'neutral' })" />
        </footer>
      </article>
    </div>

    <div v-else class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-default px-6 py-12 text-center">
      <UIcon name="i-lucide-workflow" class="size-7 text-muted" />
      <p class="text-sm font-semibold text-highlighted">{{ rw.vazio }}</p>
      <UButton v-if="admin && categorias.length" :label="rw.novo" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" class="mt-1" @click="prj.janelas.novoFluxo.value = id" />
    </div>
  </div>
</template>
