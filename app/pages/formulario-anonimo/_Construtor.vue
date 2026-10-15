<script setup lang="ts">
/**
 * O construtor do formulário. Cópia do develop (ev-12): seta de voltar, nome,
 * selo de visibilidade e engrenagem; Respostas e Blocos; "Atualizado Em";
 * "Construtor de formulário" com Construtor e Preview; "Não Agrupado"; blocos
 * tracejados e "Adicionar Novo Bloco.", que abre "Adicionar campo" com a lista
 * "[tipo] - Nome" e "+ Novo".
 *
 * PROPOSTA (contorno do andaime):
 *  - a coluna "Verificação de anonimato", que confere cada bloco enquanto o
 *    configurador monta e diz como corrigir;
 *  - na lista "Adicionar campo", o selo "Identifica quem envia";
 *  - no topo, "Anonimato e proteção" e "Revisar e publicar canal".
 */
import type { Textos } from './textos'
import { type CampoComRisco, MODELO_DO_CANAL, campos, camposComRisco, categoria, tipoTecnico } from './mocks'
import { useFormularioAnonimo, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const { formularioDoCanal, blocos, canalPublicado, problemasDoFormulario, revisaoAberta, listaDoComite, ir } = useFormularioAnonimo()
const marca = useMarcaDeProposta()
const toast = useToast()
const idioma = useIdioma()

const aba = ref<'construtor' | 'preview'>('construtor')

/** Todos os campos da categoria que podem virar bloco. */
const todos = computed(() => [
  ...campos.map(c => ({ refId: c.refId, nome: c.nome, tipo: tipoTecnico[c.refId]!, risco: null as CampoComRisco | null })),
  ...camposComRisco.map(c => ({ refId: c.refId, nome: c.nome, tipo: c.tipoTecnico, risco: c })),
])
const campoPorId = (id: string) => todos.value.find(c => c.refId === id)!

const disponiveis = computed(() => todos.value
  .filter(c => !blocos.value.includes(c.refId))
  .map(c => ({ value: c.refId, label: `[${c.tipo}] - ${c.nome}`, risco: c.risco })))

const adicionando = ref(false)
const escolhido = ref<string | undefined>()
watch(escolhido, (id) => {
  if (!id) return
  blocos.value = [...blocos.value, id]
  const c = campoPorId(id)
  if (c.risco) toast.add({ title: props.t.construtor.avisoAoAdicionar(c.nome), icon: 'i-lucide-venetian-mask', color: 'warning' })
  escolhido.value = undefined
  adicionando.value = false
})

function remover(id: string) {
  blocos.value = blocos.value.filter(b => b !== id)
}

const respostas = computed(() => listaDoComite.value.filter(d => d.form === formularioDoCanal.value.id && !d.teste).length)
const formato = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))

function abrirAnonimato() {
  ir('formularios', { formulario: formularioDoCanal.value.id, abaDoFormulario: 'anonimato' })
}
</script>

<template>
  <div class="px-4 py-3">
    <div class="mb-3 flex items-center gap-3">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" :aria-label="t.casca.voltar" @click="ir('formularios')" />
      <h1 class="text-xl font-bold text-highlighted">{{ categoria.name }}</h1>
    </div>

    <!-- Cabeçalho do formulário (cópia + 2 botões da proposta) -->
    <section class="mb-4 rounded-lg border border-default bg-default p-4">
      <div class="flex flex-wrap items-center gap-2">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.voltar" @click="ir('formularios')" />
        <h2 class="text-lg font-semibold text-highlighted">{{ formularioDoCanal.nome }}</h2>
        <UBadge :label="t.categoria.visibilidades.anonimo" icon="i-lucide-venetian-mask" color="info" variant="subtle" size="sm" />
        <UBadge
          :label="canalPublicado ? t.construtor.publicado : t.construtor.naoPublicado"
          :color="canalPublicado ? 'success' : 'neutral'"
          variant="outline"
          size="sm"
          :class="marca"
        />
        <span class="ml-auto flex flex-wrap items-center gap-2" :class="marca">
          <UButton icon="i-lucide-shield-check" :label="t.construtor.anonimatoEProtecao" color="neutral" variant="outline" size="sm" @click="abrirAnonimato" />
          <UButton icon="i-lucide-list-checks" :label="t.construtor.revisarEPublicar" size="sm" @click="revisaoAberta = true" />
        </span>
        <UIcon name="i-lucide-settings" class="size-4 text-muted" />
      </div>
      <div class="mt-4 grid max-w-xl grid-cols-2 gap-4">
        <div><p class="text-sm text-toned">{{ t.construtor.respostas }}</p><p class="text-2xl text-highlighted">{{ respostas }}</p></div>
        <div><p class="text-sm text-toned">{{ t.construtor.blocos }}</p><p class="text-2xl text-highlighted">{{ blocos.length }}</p></div>
      </div>
      <p class="mt-3 text-xs text-toned">{{ t.construtor.atualizadoEm(formato.format(formularioDoCanal.criadoEm)) }}</p>
    </section>

    <div class="grid gap-4 xl:grid-cols-[1fr_20rem]">
      <!-- Construtor (cópia) -->
      <section class="rounded-lg border border-default bg-default p-4">
        <h2 class="text-lg font-semibold text-highlighted">{{ t.construtor.titulo }}</h2>
        <div class="mt-3 flex gap-6 border-b border-default text-sm">
          <button type="button" class="-mb-px border-b-2 pb-2 transition-colors" :class="aba === 'construtor' ? 'border-primary text-primary' : 'border-transparent text-toned hover:text-highlighted'" @click="aba = 'construtor'">{{ t.construtor.abaConstrutor }}</button>
          <button type="button" class="-mb-px border-b-2 pb-2 transition-colors" :class="aba === 'preview' ? 'border-primary text-primary' : 'border-transparent text-toned hover:text-highlighted'" @click="aba = 'preview'">{{ t.construtor.abaPreview }}</button>
        </div>

        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <div v-if="aba === 'construtor'" key="construtor" class="pt-4">
            <USwitch :model-value="false" :label="t.construtor.naoAgrupado" size="sm" disabled class="mb-4" />

            <div v-if="!blocos.length" class="mb-3 flex flex-wrap items-center gap-3 rounded-lg bg-elevated/60 p-3 text-sm text-toned">
              {{ t.construtor.vazio }}
              <UButton icon="i-lucide-layout-template" :label="t.construtor.usarModelo" color="neutral" variant="outline" size="xs" :class="marca" @click="blocos = [...MODELO_DO_CANAL]" />
            </div>

            <TransitionGroup tag="div" class="grid gap-3 md:grid-cols-2" move-class="transition duration-200" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" leave-active-class="transition duration-150 ease-in absolute" leave-to-class="opacity-0">
              <div
                v-for="id in blocos"
                :key="id"
                class="group relative flex min-h-24 flex-col justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-3 transition-colors"
                :class="campoPorId(id).risco ? 'border-error/70 bg-error/5' : 'border-accented hover:border-primary/50'"
              >
                <span class="text-sm font-medium text-highlighted">{{ campoPorId(id).nome }}</span>
                <span class="font-mono text-[11px] text-toned">[{{ campoPorId(id).tipo }}]</span>
                <UBadge v-if="campoPorId(id).risco" :label="t.construtor.identifica" icon="i-lucide-venetian-mask" color="error" variant="subtle" size="sm" class="mt-1 self-start" :class="marca" />
                <UDropdownMenu :items="[[{ label: t.construtor.removerBloco, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => remover(id) }]]" :content="{ align: 'end' }">
                  <UButton icon="i-lucide-settings-2" color="neutral" variant="ghost" size="xs" class="absolute right-2 top-2 opacity-60 transition-opacity group-hover:opacity-100" :aria-label="t.construtor.removerBloco" />
                </UDropdownMenu>
              </div>

              <!-- Adicionar Novo Bloco -->
              <div key="__novo" class="flex min-h-24 items-center justify-center rounded-xl border-2 border-dashed border-accented px-4 py-3">
                <USelectMenu
                  v-if="adicionando"
                  v-model="escolhido"
                  :items="disponiveis"
                  value-key="value"
                  :placeholder="t.construtor.adicionarCampo"
                  :default-open="true"
                  class="w-full max-w-72"
                  @update:open="(o: boolean) => { if (!o && !escolhido) adicionando = false }"
                >
                  <template #item-trailing="{ item }">
                    <UBadge v-if="(item as { risco: unknown }).risco" :label="t.construtor.identifica" color="error" variant="subtle" size="xs" :class="marca" />
                  </template>
                  <template #content-bottom>
                    <div class="border-t border-default p-1.5"><UBadge :label="t.construtor.novo" color="success" variant="solid" size="sm" /></div>
                  </template>
                </USelectMenu>
                <button v-else type="button" class="text-sm font-medium text-highlighted transition-transform hover:scale-[1.02]" @click="adicionando = true">{{ t.construtor.adicionarBloco }}</button>
              </div>
            </TransitionGroup>
          </div>

          <!-- Preview -->
          <div v-else key="preview" class="flex flex-col gap-3 pt-4">
            <p class="text-sm text-toned">{{ t.construtor.previewTexto }}</p>
            <div class="mx-auto flex w-full max-w-lg flex-col gap-3 rounded-lg border border-default p-4">
              <p class="text-center font-semibold text-highlighted">{{ formularioDoCanal.nome }}</p>
              <div v-for="id in blocos" :key="id" class="flex flex-col gap-1">
                <span class="text-xs text-toned">{{ campoPorId(id).nome }}</span>
                <span class="h-8 rounded-md border border-default bg-elevated/40" :class="campoPorId(id).tipo === 'EnTextArea' ? 'h-16' : ''" />
              </div>
            </div>
            <UButton icon="i-lucide-external-link" :label="t.construtor.abrirComoDenunciante" color="neutral" variant="outline" class="self-center" @click="ir('publico')" />
          </div>
        </Transition>
      </section>

      <!-- PROPOSTA: verificação de anonimato -->
      <aside class="h-fit rounded-lg border p-4 xl:sticky xl:top-3" :class="[problemasDoFormulario.length ? 'border-error/40 bg-error/5' : 'border-success/40 bg-success/5', marca]">
        <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted">
          <UIcon :name="problemasDoFormulario.length ? 'i-lucide-shield-alert' : 'i-lucide-shield-check'" class="size-4" :class="problemasDoFormulario.length ? 'text-error' : 'text-success'" />
          {{ t.construtor.verificacaoTitulo }}
        </h3>
        <p class="mt-1 text-xs text-toned">{{ t.construtor.verificacaoAjuda }}</p>
        <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" leave-active-class="transition duration-100" leave-to-class="opacity-0">
          <p v-if="!problemasDoFormulario.length" key="ok" class="mt-3 flex items-start gap-2 text-sm text-highlighted">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-success" />{{ t.construtor.verificacaoOk }}
          </p>
          <div v-else key="problemas" class="mt-3 flex flex-col gap-3">
            <p class="text-sm font-medium text-highlighted">{{ t.construtor.verificacaoProblemas(problemasDoFormulario.length) }}</p>
            <div v-for="c in problemasDoFormulario" :key="c.refId" class="rounded-md border border-default bg-default p-3">
              <p class="text-sm font-medium text-highlighted">{{ c.nome }}</p>
              <p class="mt-1 text-xs text-highlighted">{{ t.construtor.riscos[c.risco]![0] }}</p>
              <p class="mt-1 text-xs text-toned">{{ t.construtor.riscos[c.risco]![1] }}</p>
              <UButton icon="i-lucide-trash-2" :label="t.construtor.tirarDoFormulario" color="error" variant="soft" size="xs" class="mt-2" @click="remover(c.refId)" />
            </div>
          </div>
        </Transition>
      </aside>
    </div>
  </div>
</template>
