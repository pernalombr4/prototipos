<script setup lang="ts">
/**
 * PROPOSTA: "Conferir anonimato", antes de ativar as respostas anônimas, e o
 * aviso de anonimato ativo.
 *
 * Ligar a opção sozinha não garante anonimato: um fluxo que manda e-mail para
 * {{request_email}}, uma notificação para o criador, um modelo com {{user.name}}
 * ou um cargo amplo demais desfazem a proposta. A conferência olha a categoria
 * inteira, diz onde está cada ponto e corrige ali mesmo. O que "Impede ativar"
 * trava o botão; o que é "Atenção" não trava.
 *
 * Proteção do link e retorno só entram quando o formulário tem essas opções:
 * respostas anônimas não dependem de acesso sem login, nem de acompanhamento.
 */
import type { Textos } from './textos'
import { linkDoFormulario, pontosForaDoFormulario } from './mocks'
import { useFormularioAnonimo } from './estado'
import QrCode from './_QrCode.vue'

const props = defineProps<{ t: Textos }>()

const {
  revisaoAberta, ativadoAberto, formularioEmRevisao, problemasDoFormulario, resolvidos, bloqueiaAtivar,
  ativarAnonimato, modoTeste, passoPublico, ir,
} = useFormularioAnonimo()
const toast = useToast()

const f = formularioEmRevisao
const semLogin = computed(() => f.value.visibilidade === 'publico' && f.value.semLogin)

const grupos = ['fluxos', 'notificacoes', 'modelos', 'acesso'] as const
function pontosDo(grupo: typeof grupos[number]) {
  return pontosForaDoFormulario.filter(p => p.grupo === grupo)
}
function resolver(id: string) {
  resolvidos.value = [...resolvidos.value, id]
}

const bloqueios = computed(() =>
  problemasDoFormulario.value.filter(c => c.risco === 'email' || c.risco === 'membro_logado').length
  + pontosForaDoFormulario.filter(p => p.severidade === 'bloqueia' && !resolvidos.value.includes(p.id)).length)

const ativando = ref(false)
async function ativar() {
  if (bloqueiaAtivar.value) return
  ativando.value = true
  await new Promise(r => setTimeout(r, 900))
  ativando.value = false
  ativarAnonimato()
}

const link = computed(() => linkDoFormulario(f.value))
const qr = ref<InstanceType<typeof QrCode> | null>(null)

async function copiar() {
  try {
    await navigator.clipboard.writeText(link.value)
  }
  catch { /* sem permissão: o aviso sai igual */ }
  toast.add({ title: props.t.categoria.linkCopiado, icon: 'i-lucide-circle-check', color: 'success' })
}

function envioDeTeste() {
  ativadoAberto.value = false
  modoTeste.value = true
  passoPublico.value = 'formulario'
  ir('publico')
}
</script>

<template>
  <!-- Conferência -->
  <USlideover v-model:open="revisaoAberta" :title="`${t.revisao.titulo}: ${f.nome}`" :description="t.revisao.subtitulo" side="right" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <div class="flex flex-col gap-5">
        <!-- Formulário -->
        <section>
          <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-toned">{{ t.revisao.grupos.formulario }}</h3>
          <div v-if="!problemasDoFormulario.length" class="flex items-start gap-2 rounded-md border border-default p-3 text-sm text-highlighted">
            <UIcon name="i-lucide-circle-check" class="mt-0.5 size-4 shrink-0 text-success" />{{ t.construtor.verificacaoOk }}
          </div>
          <div v-for="c in problemasDoFormulario" :key="c.refId" class="flex flex-wrap items-start gap-3 rounded-md border border-error/40 bg-error/5 p-3">
            <UIcon name="i-lucide-octagon-x" class="mt-0.5 size-4 shrink-0 text-error" />
            <div class="min-w-0 flex-1">
              <p class="flex flex-wrap items-center gap-2 text-sm font-medium text-highlighted">
                {{ c.nome }}
                <UBadge :label="c.risco === 'email' || c.risco === 'membro_logado' ? t.revisao.bloqueia : t.revisao.atencao" :color="c.risco === 'email' || c.risco === 'membro_logado' ? 'error' : 'warning'" variant="subtle" size="sm" />
              </p>
              <p class="mt-1 text-xs text-toned">{{ t.construtor.riscos[c.risco]![0] }} {{ t.construtor.riscos[c.risco]![1] }}</p>
            </div>
            <UButton icon="i-lucide-blocks" :label="t.revisao.abrirConstrutor" color="neutral" variant="outline" size="xs" @click="revisaoAberta = false; ir('construtor')" />
          </div>
        </section>

        <!-- Fora do formulário -->
        <section v-for="g in grupos" :key="g">
          <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-toned">{{ t.revisao.grupos[g] }}</h3>
          <TransitionGroup tag="div" class="flex flex-col gap-2" enter-active-class="transition duration-200" enter-from-class="opacity-0">
            <div
              v-for="p in pontosDo(g)"
              :key="p.id + resolvidos.includes(p.id)"
              class="flex flex-wrap items-start gap-3 rounded-md border p-3 transition-colors"
              :class="resolvidos.includes(p.id) ? 'border-default' : p.severidade === 'bloqueia' ? 'border-error/40 bg-error/5' : 'border-warning/40 bg-warning/5'"
            >
              <UIcon
                :name="resolvidos.includes(p.id) ? 'i-lucide-circle-check' : p.severidade === 'bloqueia' ? 'i-lucide-octagon-x' : 'i-lucide-triangle-alert'"
                class="mt-0.5 size-4 shrink-0"
                :class="resolvidos.includes(p.id) ? 'text-success' : p.severidade === 'bloqueia' ? 'text-error' : 'text-warning'"
              />
              <div class="min-w-0 flex-1">
                <p class="flex flex-wrap items-center gap-2 text-sm font-medium text-highlighted">
                  {{ t.revisao.pontos[p.id]![0] }}
                  <UBadge
                    :label="resolvidos.includes(p.id) ? t.revisao.corrigido : p.severidade === 'bloqueia' ? t.revisao.bloqueia : t.revisao.atencao"
                    :color="resolvidos.includes(p.id) ? 'success' : p.severidade === 'bloqueia' ? 'error' : 'warning'"
                    variant="subtle"
                    size="sm"
                  />
                </p>
                <p class="mt-0.5 font-mono text-[11px] text-toned">{{ p.onde }}</p>
                <p v-if="!resolvidos.includes(p.id)" class="mt-1 text-xs text-toned">{{ t.revisao.pontos[p.id]![1] }}</p>
              </div>
              <UButton v-if="!resolvidos.includes(p.id)" :label="t.revisao.pontos[p.id]![2]" color="neutral" variant="outline" size="xs" @click="resolver(p.id)" />
            </div>
          </TransitionGroup>
        </section>

        <!-- O que já está configurado no formulário -->
        <section class="grid gap-2 sm:grid-cols-2">
          <div v-if="semLogin" class="rounded-md border border-default p-3">
            <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-toned"><UIcon name="i-lucide-circle-check" class="size-3.5 text-success" />{{ t.revisao.grupos.protecao }}</p>
            <p class="mt-1 text-xs text-highlighted">{{ t.revisao.protecaoOk(f.limitePorHora, f.limitePorDia) }}</p>
          </div>
          <div class="rounded-md border border-default p-3">
            <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-toned"><UIcon :name="f.acompanhamento ? 'i-lucide-circle-check' : 'i-lucide-circle-minus'" class="size-3.5" :class="f.acompanhamento ? 'text-success' : 'text-muted'" />{{ t.revisao.grupos.retorno }}</p>
            <p class="mt-1 text-xs text-highlighted">{{ !f.acompanhamento ? t.revisao.semAcompanhamento : f.retorno === 'automatico' ? t.revisao.retornoOk(f.prazoDeRetornoDias) : t.revisao.retornoFluxo(f.prazoDeRetornoDias) }}</p>
          </div>
        </section>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full flex-wrap items-center justify-between gap-3">
        <p class="flex items-center gap-2 text-sm text-highlighted">
          <UIcon :name="bloqueiaAtivar ? 'i-lucide-octagon-x' : 'i-lucide-shield-check'" class="size-4" :class="bloqueiaAtivar ? 'text-error' : 'text-success'" />
          {{ bloqueiaAtivar ? t.revisao.faltam(bloqueios) : t.revisao.prontos }}
        </p>
        <UButton icon="i-lucide-venetian-mask" :label="ativando ? t.revisao.ativando : t.revisao.ativar" :loading="ativando" :disabled="bloqueiaAtivar" @click="ativar" />
      </div>
    </template>
  </USlideover>

  <!-- Anonimato ativo -->
  <UModal v-model:open="ativadoAberto" :title="t.ativado.titulo" :description="t.ativado.texto" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <div class="flex flex-col items-center gap-4">
        <span class="flex size-12 items-center justify-center rounded-full bg-success/15 animate-[entrada_.4s_ease-out]"><UIcon name="i-lucide-shield-check" class="size-6 text-success" /></span>
        <!-- O link só entra aqui quando o formulário abre sem login. -->
        <template v-if="semLogin">
          <QrCode ref="qr" :texto="f.identification" :rotulo="t.formulario.link.qrCode" class="size-36" />
          <UInput :model-value="link" readonly class="w-full" :ui="{ base: 'font-mono text-xs' }" />
          <div class="flex flex-wrap justify-center gap-2">
            <UButton icon="i-lucide-copy" :label="t.formulario.link.copiar" color="neutral" variant="outline" size="sm" @click="copiar" />
            <UButton icon="i-lucide-download" :label="t.formulario.link.baixarQr" color="neutral" variant="outline" size="sm" @click="qr?.baixar()" />
          </div>
          <USeparator />
          <UButton icon="i-lucide-flask-conical" :label="t.ativado.teste" block @click="envioDeTeste" />
          <p class="text-center text-xs text-toned">{{ t.ativado.testeAjuda }}</p>
        </template>
        <UButton v-else :label="t.ativado.fechar" color="neutral" variant="outline" block @click="ativadoAberto = false" />
      </div>
    </template>
  </UModal>
</template>
