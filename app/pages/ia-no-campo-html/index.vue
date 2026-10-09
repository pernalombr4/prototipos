<script setup lang="ts">
/**
 * IA no campo HTML: o BENI pelo "/" e pelo botão IA da barra do campo.
 *
 * Uma porta: a tela do item (Contratos), folder Visão Geral, com 2 campos
 * HTML: Parecer do jurídico (preenchido) e Observações internas (vazio).
 * O andaime troca o estado da IA no workspace: ligada, desligada, com erro.
 */
import { textos } from './textos'
import { campos, categoria, item, pastas, workspace } from './mocks'
import CascaDoItem from './_CascaDoItem.vue'
import PainelDoItem from './_PainelDoItem.vue'
import CampoHtml from './_CampoHtml.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaRodada1 from './PESQUISA.md?raw'
import pesquisaRodada2 from './PESQUISA-RODADA-2.md?raw'
import decisoesMd from './DECISOES.md?raw'

const pesquisaMd = `${pesquisaRodada2}

---

${pesquisaRodada1}`

definePageMeta({
  titulo: 'IA no campo HTML',
  descricao: 'O campo HTML redesenhado no padrão do Notion, com o BENI: barra da seleção, cor, link com busca, "/", agentes e modelo.',
  status: 'em-revisao',
  atualizado: '2026-10-09',
  tela: 'Tela do item, campo Editor de texto HTML',
})

const t = useTextos(textos)
const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ---------- andaime: o estado da IA vai para o endereço ---------- */
type EstadoIa = 'ligada' | 'desligada' | 'erro'
const estadoIa = computed<EstadoIa>({
  get: () => (['ligada', 'desligada', 'erro'].includes(String(route.query.ia)) ? route.query.ia : 'ligada') as EstadoIa,
  set: v => router.replace({ query: { ...route.query, ia: v } }),
})

/* ---------- tela ---------- */
const painelRecolhido = ref(false)
const pastaAtiva = ref('visao-geral')
const valores = reactive({ ...item.data } as Record<string, string>)

const abas = computed(() => pastas.map(p => ({ value: p.id, label: t.value.pastas[p.id], icon: p.icone })))
const trilha = computed(() => [workspace.name, t.value.casca.categorias, categoria.slug, item.reference])

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 450))
  salvando.value = false
  toast.add({ title: t.value.conteudo.salvo, icon: 'i-lucide-check', color: 'success', duration: 2500 })
}
</script>

<template>
  <div>
    <CascaDoItem :t="t" :trilha="trilha">
      <div class="flex h-[calc(100dvh-4rem)] min-h-0">
        <PainelDoItem v-model:recolhido="painelRecolhido" :t="t" />
        <section class="flex min-w-0 flex-1 flex-col bg-default">
          <!-- A barra de folders como é hoje (chips). Nada aqui é proposta. -->
          <UTabs
            v-model="pastaAtiva"
            :items="abas"
            variant="pill"
            color="primary"
            :content="false"
            :aria-label="t.pastas.rotulo"
            :ui="{
              root: 'gap-0',
              list: 'gap-1 rounded-none bg-muted px-1 py-1 overflow-x-auto',
              indicator: 'hidden',
              trigger: 'grow-0 h-7 rounded-md px-2 py-0 gap-1.5 text-xs shadow-xs ring ring-inset data-[state=inactive]:bg-default data-[state=inactive]:text-muted data-[state=inactive]:ring-0 hover:data-[state=inactive]:bg-accented data-[state=active]:bg-primary/10 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:ring-primary/25',
              leadingIcon: 'size-4',
            }"
          />

          <div class="min-h-0 flex-1 overflow-y-auto pb-96">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-75 ease-in"
              leave-to-class="opacity-0"
            >
              <div v-if="pastaAtiva === 'visao-geral'" key="visao-geral" class="flex max-w-4xl flex-col gap-5 px-5 py-6">
                <USeparator class="-mt-1 mb-1" />
                <template v-for="c in campos" :key="c.chave">
                  <!--
                    Só no navegador: o editor não renderiza no servidor (lá o Nuxt UI e as
                    extensões carregariam 2 cópias do ProseMirror).
                    A chave remonta o editor ao ligar ou desligar a IA: o placeholder só se lê na criação.
                  -->
                  <ClientOnly v-if="c.tipo === 'html'">
                    <CampoHtml
                      :key="`${c.chave}-${estadoIa === 'desligada'}`"
                      v-model="valores[c.chave]!"
                      :t="t"
                      :rotulo="c.rotulo"
                      :ia-ligada="estadoIa !== 'desligada'"
                      :falhar="estadoIa === 'erro'"
                    />
                    <template #fallback>
                      <UFormField :label="c.rotulo" :ui="{ label: 'font-semibold text-highlighted' }">
                        <USkeleton class="h-40 w-full rounded-lg" />
                      </UFormField>
                    </template>
                  </ClientOnly>
                  <UFormField v-else :label="c.rotulo" :ui="{ label: 'font-semibold text-highlighted' }">
                    <USelect
                      v-if="c.tipo === 'relacao'"
                      v-model="valores[c.chave]"
                      :items="[valores[c.chave]!]"
                      :placeholder="t.conteudo.porFavorSelecione"
                      class="w-full"
                    />
                    <div v-else-if="c.tipo === 'moeda'" class="flex gap-1.5">
                      <USelect v-model="valores.moeda" :items="['BRL', 'USD', 'EUR']" class="w-28" />
                      <UInput v-model="valores[c.chave]" class="flex-1" />
                    </div>
                    <UInput v-else v-model="valores[c.chave]" class="w-full" />
                  </UFormField>
                </template>
              </div>
              <UEmpty
                v-else
                :key="pastaAtiva"
                icon="i-lucide-folder-open"
                :title="t.conteudo.foraDaProposta"
                :description="t.conteudo.foraDaPropostaDica"
                variant="naked"
                class="py-16"
              />
            </Transition>
          </div>

          <footer class="flex justify-end border-t border-default px-5 py-3">
            <UButton icon="i-lucide-save" :label="t.conteudo.salvar" size="sm" :loading="salvando" @click="salvar" />
          </footer>
        </section>
      </div>
    </CascaDoItem>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.estadoDaIa }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="e in (['ligada', 'desligada', 'erro'] as const)"
            :key="e"
            :label="t.andaime.estados[e]"
            :color="estadoIa === e ? 'primary' : 'neutral'"
            :variant="estadoIa === e ? 'solid' : 'outline'"
            @click="estadoIa = e"
          />
        </UFieldGroup>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/ia-no-campo-html"
          />
        </span>
      </div>
    </div>
  </div>
</template>
