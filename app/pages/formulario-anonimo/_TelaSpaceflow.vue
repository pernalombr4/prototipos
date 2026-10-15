<script setup lang="ts">
/**
 * Configurações › Estrutura › Spaceflow › editor do fluxo "Tratamento de
 * denúncia". Cópia do editor do develop (ev-09, ev-10): barra Editor,
 * Execuções, Versões, Comentários e Logs; trilho à esquerda; grade; nós com
 * status OK; zoom e minimapa; o nó abre num modal com Entrada e Saída.
 *
 * PROPOSTA (contorno do andaime):
 *  - Start em "Ações de Itens" ganha o campo Formulário e o quadro "Dados que
 *    o fluxo recebe": o item chega com user = anonymous e sem request_email;
 *  - o nó novo "Responder ao denunciante" escreve no acompanhamento e, se a
 *    pessoa pediu, manda um aviso por e-mail sem conteúdo.
 * O nó de Tarefa e o End ficam como hoje.
 */
import type { Textos } from './textos'
import { ANONYMOUS, EXEMPLO, categoria, formularios } from './mocks'
import { useFormularioAnonimo, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const { noAberto, formularioDoCanal, mensagemDoNo } = useFormularioAnonimo()
const idioma = useIdioma()
const marca = useMarcaDeProposta()
const toast = useToast()

interface No { id: string, icone: string, proposta?: boolean }
/** O nó "Responder ao denunciante" só existe quando o formulário escolheu o retorno pelo Spaceflow. */
const peloFluxo = computed(() => formularioDoCanal.value.retorno === 'spaceflow')
const nos = computed<No[]>(() => [
  { id: 'start', icone: 'i-lucide-arrow-right-to-line' },
  ...(peloFluxo.value ? [{ id: 'responder', icone: 'i-lucide-message-square-reply', proposta: true }] : []),
  { id: 'tarefa', icone: 'i-lucide-clipboard-check' },
  { id: 'end', icone: 'i-lucide-circle-dot' },
])

function usarRetornoPeloFluxo() {
  formularioDoCanal.value.retorno = 'spaceflow'
}

const aberto = computed({
  get: () => noAberto.value !== null && noAberto.value !== 'end' && nos.value.some(n => n.id === noAberto.value),
  set: (v) => { if (!v) noAberto.value = null },
})

/* ---------- nó Responder ao denunciante ---------- */

const config = reactive({
  nome: props.t.spaceflow.nos.responder![0],
  // A mensagem fica no estado: é ela que o denunciante recebe quando o retorno é pelo fluxo.
  mensagem: mensagemDoNo.value,
  avisar: true,
})
const variaveis = ['{{protocolo}}', '{{responder_ate}}', '{{data.tipo}}']
function inserir(v: string) {
  config.mensagem = `${config.mensagem}${config.mensagem.endsWith(' ') ? '' : ' '}${v}`
}
const modificado = ref(false)
watch(config, () => (modificado.value = true))

const previa = computed(() => config.mensagem
  .replaceAll('{{protocolo}}', EXEMPLO.data.protocolo)
  .replaceAll('{{responder_ate}}', new Date(`${EXEMPLO.data.retorno_ate}T12:00:00`).toLocaleDateString(idioma.value))
  .replaceAll('{{data.tipo}}', EXEMPLO.data.tipo))

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  mensagemDoNo.value = config.mensagem
  salvando.value = false
  modificado.value = false
  noAberto.value = null
  toast.add({ title: props.t.spaceflow.salvo, icon: 'i-lucide-circle-check', color: 'success' })
}

/* ---------- saída do gatilho: o que o fluxo recebe ---------- */

const saida = computed(() => [
  { chave: 'reference', valor: `"${EXEMPLO.reference.slice(0, 18)}…"` },
  { chave: 'data.protocolo', valor: `"${EXEMPLO.data.protocolo}"` },
  { chave: 'data.tipo', valor: `"${EXEMPLO.data.tipo}"` },
  { chave: 'data.relato', valor: `"${EXEMPLO.data.relato.slice(0, 28)}…"` },
  { chave: 'data.aviso_por_email', valor: String(EXEMPLO.data.aviso_por_email) },
  { chave: 'user', valor: `"${ANONYMOUS.nome}"`, destaque: true },
  { chave: 'request_email', valor: props.t.spaceflow.naoExiste, vazio: true, destaque: true },
  { chave: 'created_at', valor: `"2026-10-11T15:00:00" · ${props.t.spaceflow.horaCheia}`, destaque: true },
  { chave: 'item_link', valor: '"https://app.enspace.io/…"' },
])
</script>

<template>
  <div class="flex h-[calc(100vh-7.5rem)] min-h-[34rem] flex-col">
    <!-- Barra do editor (cópia) -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-1.5">
      <span class="mr-2 flex size-8 items-center justify-center rounded-full border border-default"><UIcon name="i-lucide-file" class="size-4 text-primary" /></span>
      <UButton icon="i-lucide-git-fork" :label="t.spaceflow.abas.editor" color="primary" variant="ghost" size="sm" />
      <UButton icon="i-lucide-play" :label="t.spaceflow.abas.execucoes" color="neutral" variant="ghost" size="sm" />
      <UButton icon="i-lucide-history" :label="t.spaceflow.abas.versoes" color="neutral" variant="ghost" size="sm" />
      <UButton icon="i-lucide-message-circle" :label="t.spaceflow.abas.comentarios" color="neutral" variant="ghost" size="sm" />
      <UButton icon="i-lucide-scroll-text" :label="t.spaceflow.abas.logs" color="neutral" variant="ghost" size="sm" />
      <span class="ml-auto flex items-center gap-2 text-xs text-muted">
        <UIcon name="i-lucide-chevron-left" class="size-4" />{{ t.spaceflow.pagina }}<UIcon name="i-lucide-chevron-right" class="size-4" />
      </span>
    </div>

    <div class="flex min-h-0 flex-1">
      <!-- Trilho (cópia) -->
      <div class="flex w-12 shrink-0 flex-col items-center gap-4 border-r border-default py-4 text-toned">
        <UIcon name="i-lucide-tag" class="size-4" />
        <UIcon name="i-lucide-zap" class="size-4" />
        <UIcon name="i-lucide-calendar-plus" class="size-4" />
      </div>

      <!-- Grade com os nós -->
      <div class="relative min-w-0 flex-1 overflow-auto bg-[linear-gradient(var(--ui-border)_1px,transparent_1px),linear-gradient(90deg,var(--ui-border)_1px,transparent_1px)] bg-[size:64px_64px]">
        <UButton icon="i-lucide-save" color="neutral" variant="ghost" size="sm" class="absolute right-3 top-3" :aria-label="t.spaceflow.salvarEFechar" />

        <!-- PROPOSTA: com retorno automático, o fluxo não confirma o recebimento -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <div v-if="!peloFluxo" class="absolute left-6 right-16 top-4 flex flex-wrap items-center gap-3 rounded-lg border border-info/30 bg-default px-3 py-2 shadow-sm" :class="marca">
            <UIcon name="i-lucide-zap" class="size-4 text-info" />
            <p class="min-w-0 flex-1 text-xs text-toned">{{ t.spaceflow.retornoAutomatico }}</p>
            <UButton icon="i-lucide-workflow" :label="t.spaceflow.usarRetornoPeloFluxo" color="neutral" variant="outline" size="xs" @click="usarRetornoPeloFluxo" />
          </div>
        </Transition>

        <div class="flex min-w-max items-center gap-0 px-10 py-24">
          <template v-for="(n, i) in nos" :key="n.id">
            <div v-if="i" class="flex items-center">
              <span class="size-3 rounded-full bg-primary/70" />
              <span class="h-px w-12 bg-accented" />
              <span class="size-3 rounded-full bg-primary/70" />
            </div>
            <button
              type="button"
              class="flex h-36 w-64 flex-col justify-between rounded-2xl border border-default bg-default p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md animate-[entrada_.35s_ease-out_both]"
              :class="[n.proposta ? marca : '', noAberto === n.id ? 'ring-2 ring-primary' : '']"
              :style="{ animationDelay: `${i * 70}ms` }"
              @click="noAberto = n.id"
            >
              <span class="flex items-start gap-3">
                <span class="flex size-11 shrink-0 items-center justify-center rounded-lg" :class="n.proposta ? 'bg-info/15' : 'bg-primary/10'">
                  <UIcon :name="n.icone" class="size-5" :class="n.proposta ? 'text-info' : 'text-primary'" />
                </span>
                <span class="min-w-0">
                  <span class="flex items-center gap-1.5 text-base font-semibold text-highlighted">
                    {{ t.spaceflow.nos[n.id]![0] }}
                    <UBadge v-if="n.proposta" :label="t.spaceflow.novo" color="info" variant="subtle" size="xs" />
                  </span>
                  <span class="mt-0.5 line-clamp-2 block text-xs text-muted">{{ t.spaceflow.nos[n.id]![1] }}</span>
                </span>
              </span>
              <span class="mt-3 flex items-center gap-1.5 text-xs text-toned"><span class="size-2 rounded-full bg-success" />{{ t.spaceflow.ok }}</span>
            </button>
          </template>
        </div>

        <!-- Zoom e minimapa (cópia) -->
        <div class="absolute bottom-3 left-3 flex flex-col gap-1 rounded-md border border-default bg-default p-1 text-toned">
          <UIcon name="i-lucide-plus" class="size-3.5" /><UIcon name="i-lucide-minus" class="size-3.5" /><UIcon name="i-lucide-maximize" class="size-3.5" />
        </div>
        <div class="absolute bottom-3 right-3 h-20 w-36 rounded-md border border-default bg-elevated/70" aria-hidden="true">
          <span v-for="k in nos.length" :key="k" class="absolute top-8 h-3 w-6 rounded-sm bg-accented" :style="{ left: `${8 + (k - 1) * 32}px` }" />
        </div>
      </div>
    </div>

    <!-- Modal do nó (cópia da moldura do develop) -->
    <UModal v-model:open="aberto" :ui="{ content: 'max-w-3xl' }">
      <template #content>
        <div class="flex max-h-[85vh] flex-col">
          <header class="flex items-center gap-2 border-b border-default px-5 py-3.5">
            <UIcon name="i-lucide-zap" class="size-4 text-muted" />
            <h2 class="text-base font-semibold text-highlighted">{{ noAberto ? t.spaceflow.nos[noAberto]![0] : '' }}</h2>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" class="ml-auto" :aria-label="t.spaceflow.fechar" @click="aberto = false" />
          </header>

          <div class="flex min-h-0 flex-1">
            <span class="flex w-8 shrink-0 items-center justify-center border-r border-default text-[10px] font-semibold uppercase tracking-[0.2em] text-primary [writing-mode:vertical-rl] rotate-180">{{ t.spaceflow.entrada }}</span>

            <div class="min-w-0 flex-1 overflow-y-auto p-5">
              <!-- Start -->
              <div v-if="noAberto === 'start'" class="flex flex-col gap-4">
                <UFormField :label="t.spaceflow.nomeDoNo"><UInput model-value="Start" class="w-full" /></UFormField>
                <UFormField :label="t.spaceflow.modoDeInicio"><USelect :model-value="'acoes'" :items="[{ value: 'acoes', label: t.spaceflow.modos.acoes }]" class="w-full" /></UFormField>
                <UFormField :label="t.spaceflow.categoriaDeReferencia"><USelect :model-value="'d'" :items="[{ value: 'd', label: `(Itens) ${categoria.name}` }]" class="w-full" /></UFormField>
                <UFormField :label="t.spaceflow.acaoDeGatilho"><USelect :model-value="'c'" :items="[{ value: 'c', label: t.spaceflow.criacao }]" class="w-full" /></UFormField>
                <UFormField :label="t.spaceflow.formulario">
                  <USelect :model-value="'f'" :items="[{ value: 'f', label: formularios[0]!.nome, icon: 'i-lucide-venetian-mask' }]" class="w-full" />
                </UFormField>
                <UFormField :label="t.spaceflow.vincularAoItem"><USwitch :model-value="true" /></UFormField>

                <section class="rounded-lg border border-info/30 bg-info/5 p-3" :class="marca">
                  <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-braces" class="size-4 text-info" />{{ t.spaceflow.dadosQueRecebe }}</h3>
                  <p class="mt-1 text-xs text-toned">{{ t.spaceflow.dadosAjuda }}</p>
                  <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md bg-default p-3 font-mono text-[11px]">
                    <template v-for="s in saida" :key="s.chave">
                      <dt :class="s.destaque ? 'font-semibold text-info' : 'text-muted'">{{ s.chave }}</dt>
                      <dd :class="s.vazio ? 'italic text-dimmed line-through decoration-dimmed' : s.destaque ? 'text-highlighted' : 'text-toned'">{{ s.valor }}</dd>
                    </template>
                  </dl>
                </section>
              </div>

              <!-- Responder ao denunciante (PROPOSTA) -->
              <div v-else-if="noAberto === 'responder'" class="flex flex-col gap-4" :class="marca">
                <UFormField :label="t.spaceflow.tipoDoNo">
                  <UInput :model-value="t.spaceflow.responderAoDenunciante" readonly icon="i-lucide-message-square-reply" class="w-full" />
                </UFormField>
                <p class="-mt-2 text-xs text-toned">{{ t.spaceflow.responderAjuda }}</p>
                <p class="flex items-start gap-1.5 rounded-md bg-info/5 p-2.5 text-xs text-toned"><UIcon name="i-lucide-link" class="mt-0.5 size-3.5 shrink-0 text-info" />{{ t.spaceflow.retornoPeloFluxo }}</p>
                <UFormField :label="t.spaceflow.nomeDoNo"><UInput v-model="config.nome" class="w-full" /></UFormField>
                <UFormField :label="t.spaceflow.mensagem">
                  <UTextarea v-model="config.mensagem" :rows="4" autoresize class="w-full" />
                </UFormField>
                <div class="-mt-2 flex flex-wrap items-center gap-1.5">
                  <span class="text-xs text-muted">{{ t.spaceflow.variaveis }}</span>
                  <UButton v-for="v in variaveis" :key="v" :label="v" color="neutral" variant="outline" size="xs" class="font-mono" @click="inserir(v)" />
                </div>
                <UFormField :label="t.spaceflow.avisarPorEmail" :help="t.spaceflow.avisarAjuda">
                  <USwitch v-model="config.avisar" />
                </UFormField>

                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="rounded-lg border border-default p-3">
                    <p class="mb-2 text-xs font-medium text-muted">{{ t.spaceflow.previa }}</p>
                    <div class="rounded-md bg-elevated px-3 py-2">
                      <p class="flex items-center gap-1.5 text-xs font-medium text-toned"><UIcon name="i-lucide-bot" class="size-3.5" />{{ t.acompanhar.autor.sistema }}</p>
                      <p class="mt-1 whitespace-pre-line text-sm text-highlighted">{{ previa }}</p>
                    </div>
                  </div>
                  <div class="rounded-lg border border-default p-3" :class="config.avisar ? '' : 'opacity-50'">
                    <p class="mb-2 text-xs font-medium text-muted">{{ t.spaceflow.previaEmail }}</p>
                    <p class="text-sm font-semibold text-highlighted">{{ t.spaceflow.emailAssunto }}</p>
                    <p class="mt-1 text-xs text-toned">{{ t.spaceflow.emailCorpo }}</p>
                    <p class="mt-2 flex items-center gap-1.5 text-[11px] text-muted"><UIcon name="i-lucide-lock-keyhole" class="size-3" />{{ t.item.emails.protegido }}</p>
                  </div>
                </div>
              </div>

              <!-- Tarefa (sem mudança) -->
              <div v-else-if="noAberto === 'tarefa'" class="flex flex-col gap-4">
                <p class="flex items-center gap-1.5 rounded-md bg-elevated/60 p-2.5 text-xs text-muted"><UIcon name="i-lucide-info" class="size-3.5" />{{ t.spaceflow.tarefaExistente }}</p>
                <UFormField :label="t.spaceflow.nomeDaTarefa"><UInput :model-value="t.spaceflow.nos.tarefa![0]" class="w-full" /></UFormField>
                <UFormField :label="t.spaceflow.responsaveis"><USelect :model-value="'g'" :items="[{ value: 'g', label: t.spaceflow.grupoComite }]" class="w-full" /></UFormField>
              </div>
            </div>

            <span class="flex w-8 shrink-0 items-center justify-center border-l border-default text-[10px] font-semibold uppercase tracking-[0.2em] text-success [writing-mode:vertical-rl]">{{ t.spaceflow.saida }}</span>
          </div>

          <footer class="flex items-center gap-2 border-t border-default px-5 py-3">
            <span v-if="noAberto === 'responder' && modificado" class="flex items-center gap-1.5 text-xs text-warning"><span class="size-1.5 rounded-full bg-warning" />{{ t.spaceflow.modificado }}</span>
            <span class="ml-auto flex gap-2">
              <template v-if="noAberto === 'responder'">
                <UButton :label="t.spaceflow.cancelar" color="neutral" variant="outline" @click="aberto = false" />
                <UButton icon="i-lucide-check" :label="t.spaceflow.salvarEFechar" :loading="salvando" @click="salvar" />
              </template>
              <UButton v-else :label="t.spaceflow.fechar" @click="aberto = false" />
            </span>
          </footer>
        </div>
      </template>
    </UModal>
  </div>
</template>
