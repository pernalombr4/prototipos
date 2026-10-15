<script setup lang="ts">
/**
 * Formulários › "Criar +". Cópia do painel de criação do develop (ev-11):
 * título "Formulário", abas Definição, Visual e Avançado, Nome, Descrição,
 * Tipo (padrão Geral, 6 opções) e Visibilidade (padrão Privado).
 *
 * PROPOSTA (contorno do andaime):
 *  - Visibilidade ganha "Anônimo";
 *  - com Anônimo, o Tipo vira Criação e o painel mostra o que muda e a escolha
 *    entre o modelo "Canal de denúncia" e em branco;
 *  - Salvar abre o construtor do formulário novo.
 */
import type { Textos } from './textos'
import { TIPOS_DE_FORMULARIO, type TipoDeFormulario, type Visibilidade } from './mocks'
import { useFormularioAnonimo, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const { novoFormularioAberto, criarCanal } = useFormularioAnonimo()
const marca = useMarcaDeProposta()

const nome = ref('')
const descricao = ref('')
const tipo = ref<TipoDeFormulario>('geral')
const visibilidade = ref<Visibilidade>('privado')
const comModelo = ref<'modelo' | 'branco'>('modelo')
const tentou = ref(false)
const salvando = ref(false)

watch(novoFormularioAberto, (a) => {
  if (!a) return
  nome.value = ''
  descricao.value = ''
  tipo.value = 'geral'
  visibilidade.value = 'privado'
  comModelo.value = 'modelo'
  tentou.value = false
})

const anonimo = computed(() => visibilidade.value === 'anonimo')
watch(anonimo, (a) => {
  if (a) {
    tipo.value = 'criacao'
    if (!nome.value) nome.value = props.t.publico.titulo
  }
})

const tipos = computed(() => TIPOS_DE_FORMULARIO.map(v => ({ value: v, label: props.t.formulario.tipos[v], disabled: anonimo.value && v !== 'criacao' })))
const visibilidades = computed(() => (['privado', 'publico', 'anonimo'] as const).map(v => ({ value: v, label: props.t.categoria.visibilidades[v] })))
const comeco = computed(() => [
  { value: 'modelo', label: props.t.novo.modelo[0], description: props.t.novo.modelo[1] },
  { value: 'branco', label: props.t.novo.branco[0], description: props.t.novo.branco[1] },
])

async function salvar() {
  tentou.value = true
  if (!nome.value.trim()) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  // Só o caminho anônimo é proposta; os outros fecham o painel como hoje.
  if (anonimo.value) criarCanal(nome.value.trim(), comModelo.value === 'modelo')
  else novoFormularioAberto.value = false
}
</script>

<template>
  <USlideover v-model:open="novoFormularioAberto" :title="t.novo.titulo" side="right" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex gap-6 border-b border-default pb-2 text-sm">
          <span class="border-b-2 border-primary pb-2 font-medium text-primary">{{ t.formulario.abas.definicao }}</span>
          <span class="pb-2 text-toned">{{ t.formulario.abas.visual }}</span>
          <span class="pb-2 text-toned">{{ t.formulario.abas.avancado }}</span>
        </div>

        <UFormField :label="t.formulario.nome" required :error="tentou && !nome.trim() ? t.novo.nomeObrigatorio : undefined">
          <UInput v-model="nome" :placeholder="t.formulario.porFavorDigite" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="t.formulario.descricao">
          <UInput v-model="descricao" :placeholder="t.formulario.porFavorDigite" :maxlength="300" class="w-full">
            <template #trailing><span class="text-xs text-dimmed">{{ descricao.length }} / 300</span></template>
          </UInput>
        </UFormField>
        <UFormField :label="t.formulario.tipo">
          <USelect v-model="tipo" :items="tipos" class="w-full" />
        </UFormField>
        <UFormField :label="t.formulario.visibilidade" :help="t.formulario.ajudaVisibilidade[visibilidade]" :class="marca">
          <USelect v-model="visibilidade" :items="visibilidades" :icon="anonimo ? 'i-lucide-venetian-mask' : undefined" class="w-full" />
        </UFormField>

        <!-- PROPOSTA: o que muda e por onde começar -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <div v-if="anonimo" class="flex flex-col gap-4" :class="marca">
            <section class="rounded-lg border border-info/30 bg-info/5 p-3">
              <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-venetian-mask" class="size-4 text-info" />{{ t.novo.oQueMuda }}</h3>
              <ul class="mt-2 flex flex-col gap-1.5">
                <li v-for="m in t.novo.muda" :key="m" class="flex items-start gap-2 text-xs text-toned">
                  <UIcon name="i-lucide-check" class="mt-0.5 size-3.5 shrink-0 text-info" />{{ m }}
                </li>
              </ul>
            </section>
            <UFormField :label="t.novo.comecarCom">
              <URadioGroup v-model="comModelo" :items="comeco" variant="card" :ui="{ description: 'text-toned' }" />
            </UFormField>
          </div>
        </Transition>

        <UButton :label="t.formulario.salvar" :loading="salvando" block color="success" @click="salvar" />
      </div>
    </template>
  </USlideover>
</template>
