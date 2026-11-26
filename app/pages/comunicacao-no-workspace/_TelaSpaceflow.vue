<script setup lang="ts">
/**
 * Fase 4 (rodada 14). O editor do Spaceflow com os nós Enviar SMS e Enviar WhatsApp.
 *
 * A moldura do editor é cópia de `no-de-atraso/_EditorDoSpaceflow.vue`, que reproduz o develop
 * (`/settings/data/workflows/<id>`, visto em 14/10/2026): abas Editor, Execuções, Versões,
 * Comentários e Logs; o trilho da esquerda; a grade; os cartões com ícone, título, descrição e
 * rodapé de estado; o zoom; o minimapa e o botão redondo que abre a paleta de nós. Nada da moldura
 * é proposta.
 *
 * PROPOSTA:
 *  - os nós "Enviar SMS" e "Enviar WhatsApp", com o resumo da configuração no cartão e o erro de
 *    integração quando o workspace não tem a Twilio (andaime "Sem Twilio");
 *  - o grupo "Comunicação" na paleta, com os 2 nós novos. A paleta do develop não foi copiada
 *    item a item: aqui ela mostra só os grupos que a proposta toca;
 *  - o modal de cada nó (`_ModalDoNoDeMensagem.vue`).
 *
 * O canvas do produto é Vue Flow; aqui é desenho estático com zoom, porque arrastar nó não está
 * em discussão.
 */
import type { Textos } from './textos'
import { textosDeCanais } from './textosDeCanais'
import { modelosDeWhatsApp } from './mocks'
import { useComunicacao, useMarcaDeProposta } from './estado'
import { type NoDeMensagem, useSpaceflow, variavelPorChave } from './spaceflow'
import ModalDoNoDeMensagem from './_ModalDoNoDeMensagem.vue'

defineProps<{ t: Textos }>()

const tc = useTextos(textosDeCanais)
const ts = computed(() => tc.value.spaceflow)
const { twilioLigado } = useComunicacao()
const { sms, whatsapp, editando, salvos } = useSpaceflow()
const marca = useMarcaDeProposta()
const toast = useToast()

type Id = 'start' | 'email' | NoDeMensagem | 'end'
interface No { id: Id, icone: string, x: number, cheio?: boolean, proposta?: boolean }

const nos: No[] = [
  { id: 'start', icone: 'i-lucide-arrow-right-to-line', x: 40, cheio: true },
  { id: 'email', icone: 'i-lucide-mail', x: 380 },
  { id: 'sms', icone: 'i-lucide-message-square-text', x: 720, proposta: true },
  { id: 'whatsapp', icone: 'i-simple-icons-whatsapp', x: 1060, proposta: true },
  { id: 'end', icone: 'i-lucide-circle-dot', x: 1400 },
]
const LARGURA = 280
const ALTO = 124
const Y = 120

const zoom = ref(0.7)
function mudarZoom(passo: number) {
  zoom.value = Math.min(1.2, Math.max(0.4, Math.round((zoom.value + passo) * 100) / 100))
}

const arestas = computed(() => nos.slice(0, -1).map((n, i) => ({ de: n.x + LARGURA, para: nos[i + 1]!.x, y: Y + 54 })))

const ehMensagem = (id: Id): id is NoDeMensagem => id === 'sms' || id === 'whatsapp'

function estadoDe(id: Id): 'ok' | 'modificado' | 'erro' {
  if (ehMensagem(id)) {
    if (!twilioLigado.value) return 'erro'
    return salvos.value.includes(id) ? 'ok' : 'modificado'
  }
  return 'ok'
}

/** O nome que o cartão mostra: o nome do nó salvo no modal. */
function tituloDe(id: Id) {
  if (id === 'sms') return sms.value.nome || ts.value.nos.sms.titulo
  if (id === 'whatsapp') return whatsapp.value.nome || ts.value.nos.whatsapp.titulo
  return ts.value.nos[id].titulo
}

/** O resumo da configuração no cartão (proposta), no lugar da descrição genérica. */
function descricaoDe(id: Id) {
  const para = (c: string) => variavelPorChave(c)?.rotulo ?? c
  if (id === 'sms') return ts.value.resumoSms(para(sms.value.para))
  if (id === 'whatsapp') {
    const m = modelosDeWhatsApp.find(x => x.id === whatsapp.value.modelo)
    return m ? ts.value.resumoWhatsApp(m.nome, para(whatsapp.value.para)) : ts.value.nos.whatsapp.descricao
  }
  return ts.value.nos[id].descricao
}

function abrir(id: Id) {
  if (ehMensagem(id)) editando.value = id
}

/* ---------- paleta ---------- */

const paletaAberta = ref(false)
const buscaNaPaleta = ref('')
type ChaveDaPaleta = keyof typeof textosDeCanais['pt-BR']['spaceflow']['paleta']['nos']
const GRUPOS: { chave: 'comunicacao' | 'dados' | 'controle', nos: { chave: ChaveDaPaleta, icone: string, novo?: boolean }[] }[] = [
  { chave: 'comunicacao', nos: [
    { chave: 'email', icone: 'i-lucide-mail' },
    { chave: 'sms', icone: 'i-lucide-message-square-text', novo: true },
    { chave: 'whatsapp', icone: 'i-simple-icons-whatsapp', novo: true },
  ] },
  { chave: 'dados', nos: [
    { chave: 'criarItem', icone: 'i-lucide-file-plus' },
    { chave: 'atualizarItem', icone: 'i-lucide-file-pen' },
  ] },
  { chave: 'controle', nos: [
    { chave: 'condicao', icone: 'i-lucide-split' },
    { chave: 'atraso', icone: 'i-lucide-clock' },
  ] },
]
const gruposFiltrados = computed(() => {
  const q = buscaNaPaleta.value.trim().toLowerCase()
  return GRUPOS
    .map(g => ({ ...g, nos: g.nos.filter(n => !q || ts.value.paleta.nos[n.chave].toLowerCase().includes(q)) }))
    .filter(g => g.nos.length)
})
function adicionar(chave: ChaveDaPaleta) {
  paletaAberta.value = false
  toast.add({ title: ts.value.paleta.nos[chave], description: ts.value.paleta.adicionado, icon: 'i-lucide-info', color: 'neutral' })
}
</script>

<template>
  <div class="flex min-h-[calc(100dvh-7rem)] flex-col">
    <!-- Abas do editor (cópia do develop) -->
    <div class="flex h-11 shrink-0 items-center gap-1 border-b border-default px-3">
      <UButton icon="i-lucide-file" color="neutral" variant="outline" size="xs" class="mr-2 rounded-full" :aria-label="ts.detalhes" />
      <UButton icon="i-lucide-git-fork" :label="ts.abas.editor" color="primary" variant="ghost" size="xs" />
      <UButton icon="i-lucide-play" :label="ts.abas.execucoes" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-history" :label="ts.abas.versoes" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-message-circle" :label="ts.abas.comentarios" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-scroll-text" :label="ts.abas.logs" color="neutral" variant="ghost" size="xs" />
      <span class="ml-auto flex items-center gap-1 border-l border-default pl-3 text-xs text-muted">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xs" aria-label="1/3" />
        1/3
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" aria-label="1/3" />
      </span>
    </div>

    <div class="flex min-h-0 flex-1">
      <!-- Trilho da esquerda -->
      <div class="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-default pt-3">
        <UIcon name="i-lucide-tag" class="size-4 text-muted" />
        <UIcon name="i-lucide-zap" class="size-4 text-muted" />
        <UIcon name="i-lucide-calendar-plus" class="size-4 text-muted" />
      </div>

      <!-- Canvas -->
      <div
        class="relative min-h-[420px] min-w-0 flex-1 overflow-hidden bg-default bg-[linear-gradient(to_right,var(--ui-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--ui-border)_1px,transparent_1px)] bg-size-[40px_40px]"
      >
        <UButton icon="i-lucide-save" color="neutral" variant="ghost" size="sm" class="absolute right-3 top-3 z-10" :aria-label="ts.salvar">
          <template #trailing>
            <span v-if="salvos.length < 2" class="absolute right-1 top-1 size-1.5 rounded-full bg-error" />
          </template>
        </UButton>

        <div
          class="absolute left-0 top-0 origin-top-left transition-transform duration-300 ease-out"
          :style="{ transform: `scale(${zoom})`, width: '1740px', height: '420px' }"
        >
          <svg class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            <line v-for="(a, i) in arestas" :key="i" :x1="a.de" :x2="a.para" :y1="a.y" :y2="a.y" class="stroke-(--ui-border-accented)" stroke-width="2" />
          </svg>

          <component
            :is="ehMensagem(no.id) ? 'button' : 'div'"
            v-for="(no, i) in nos"
            :key="no.id"
            :type="ehMensagem(no.id) ? 'button' : undefined"
            class="absolute flex flex-col rounded-xl border bg-default px-4 pb-3 pt-4 text-left shadow-sm transition-[box-shadow,transform,border-color] duration-200"
            :class="[
              ehMensagem(no.id) ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary' : '',
              estadoDe(no.id) === 'erro' ? 'border-dashed border-error/50' : 'border-default',
              no.proposta ? marca : '',
            ]"
            :style="{ left: `${no.x}px`, top: `${Y}px`, width: `${LARGURA}px`, minHeight: `${ALTO}px`, animation: `entrada .36s ease-out ${i * 70}ms backwards` }"
            @click="abrir(no.id)"
          >
            <span v-if="no.id !== 'start'" class="absolute -left-2 top-[46px] size-4 rounded-full bg-primary/70" />
            <span v-if="no.id !== 'end'" class="absolute -right-2 top-[46px] size-4 rounded-full bg-primary/70" />

            <span class="flex items-start gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-lg" :class="no.cheio ? 'bg-primary text-inverted' : 'bg-elevated text-primary'">
                <UIcon :name="no.icone" class="size-5" />
              </span>
              <span class="min-w-0">
                <span class="block text-base font-semibold text-highlighted">{{ tituloDe(no.id) }}</span>
                <span class="mt-0.5 line-clamp-3 block text-sm leading-snug" :class="no.proposta ? 'text-default' : 'text-muted'">{{ descricaoDe(no.id) }}</span>
              </span>
            </span>

            <span class="mt-auto flex items-center gap-2 pt-3 text-xs font-medium tracking-wide">
              <template v-if="estadoDe(no.id) === 'erro'">
                <span class="size-2 rounded-full bg-error" />
                <span class="text-muted">{{ ts.erro }}</span>
                <UTooltip :text="ts.semIntegracao">
                  <UIcon name="i-lucide-circle-alert" class="ml-auto size-4 text-error" :aria-label="ts.semIntegracao" />
                </UTooltip>
              </template>
              <template v-else-if="estadoDe(no.id) === 'modificado'">
                <span class="size-2 rounded-full bg-warning" />
                <span class="text-muted">{{ ts.modificado }}</span>
              </template>
              <template v-else>
                <span class="size-2 rounded-full bg-success" />
                <span class="text-muted">{{ ts.ok }}</span>
              </template>
            </span>
          </component>
        </div>

        <!-- Zoom (cópia do develop) -->
        <div class="absolute bottom-4 left-3 flex flex-col overflow-hidden rounded-md border border-default bg-default shadow-sm">
          <UButton icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" :aria-label="ts.zoomMais" @click="mudarZoom(0.1)" />
          <UButton icon="i-lucide-minus" color="neutral" variant="ghost" size="xs" :aria-label="ts.zoomMenos" @click="mudarZoom(-0.1)" />
          <UButton icon="i-lucide-scan" color="neutral" variant="ghost" size="xs" :aria-label="ts.ajustar" @click="zoom = 0.7" />
          <UButton icon="i-lucide-network" color="neutral" variant="ghost" size="xs" :aria-label="ts.organizar" />
        </div>

        <!-- Minimapa -->
        <div class="absolute bottom-4 right-4 hidden h-24 w-40 rounded-md border border-default bg-elevated/70 p-3 md:block" aria-hidden="true">
          <div class="flex gap-1.5">
            <span v-for="n in 5" :key="n" class="h-3 flex-1 rounded-sm bg-accented" />
          </div>
        </div>

        <!-- Abre a paleta de nós -->
        <UTooltip :text="ts.adicionarNo">
          <UButton
            icon="i-lucide-blocks"
            color="primary"
            size="lg"
            class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
            :aria-label="ts.adicionarNo"
            @click="paletaAberta = true"
          />
        </UTooltip>
      </div>
    </div>

    <!-- PROPOSTA: o grupo Comunicação na paleta de nós -->
    <USlideover v-model:open="paletaAberta" :title="ts.paleta.titulo" :description="ts.paleta.descricao" :ui="{ content: 'sm:max-w-sm' }">
      <template #body>
        <UInput v-model="buscaNaPaleta" icon="i-lucide-search" :placeholder="ts.paleta.buscar" size="sm" class="mb-4 w-full" :aria-label="ts.paleta.buscar" />
        <section v-for="g in gruposFiltrados" :key="g.chave" class="mb-5" :class="g.chave === 'comunicacao' ? marca : ''">
          <p class="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            {{ ts.paleta.grupos[g.chave] }}
          </p>
          <ul class="flex flex-col gap-1.5">
            <li v-for="n in g.nos" :key="n.chave">
              <button
                type="button"
                draggable="true"
                class="flex w-full items-center gap-3 rounded-lg border border-default bg-default px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-accented hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary"
                @click="adicionar(n.chave)"
              >
                <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-elevated text-primary">
                  <UIcon :name="n.icone" class="size-4" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-center gap-2 text-sm font-medium text-highlighted">
                    {{ ts.paleta.nos[n.chave] }}
                    <UBadge v-if="n.novo" :label="ts.paleta.novo" color="primary" variant="subtle" size="sm" />
                  </span>
                  <span class="block text-xs text-muted">{{ ts.paleta.dicas[n.chave] }}</span>
                </span>
              </button>
            </li>
          </ul>
        </section>
      </template>
    </USlideover>

    <ModalDoNoDeMensagem :t="t" />
  </div>
</template>
