<script setup lang="ts">
import { AREAS, casoDoMenuAtual, useCasosDoWorkspace, useJanelasDeCasos, type Complexidade } from './casos'
import { useMenuDoWorkspace } from './estado'
import { rotuloDoNo } from './rotulos'
import type { TextosDaTela } from './textos'

/**
 * CRIAR CASO DE USO (rodada 18): "o próprio user também pode criar um modelo
 * replicável". Parte do menu de hoje: a pessoa escolhe quais menus entram,
 * dá nome, área e complexidade, e o caso vai para "Do seu workspace", de
 * onde se usa, se exporta ou se leva para outro workspace.
 */
const props = defineProps<{ t: TextosDaTela }>()

const janelas = useJanelasDeCasos()
const casos = useCasosDoWorkspace()
const menu = useMenuDoWorkspace()
const toast = useToast()

const nome = ref('')
const area = ref<string>('Operações')
const complexidade = ref<Complexidade>('iniciante')
const descricao = ref('')
const escolhidos = ref<string[]>([])

/** Os menus com telas que existem agora; os do workspace já vêm marcados. */
const menusDisponiveis = computed(() => menu.secoes.value.filter(s => (s.filhos?.length ?? 0) > 0))

watch(() => janelas.criando.value, (v) => {
  if (!v) return
  nome.value = ''
  descricao.value = ''
  area.value = 'Operações'
  complexidade.value = 'iniciante'
  escolhidos.value = menusDisponiveis.value.filter(s => menu.origemDe(s) === 'workspace').map(s => s.id)
})

function alternar(id: string, v: boolean | 'indeterminate') {
  escolhidos.value = v === true ? [...escolhidos.value, id] : escolhidos.value.filter(x => x !== id)
}

function criar() {
  if (!nome.value.trim() || !escolhidos.value.length) return
  const menus = menusDisponiveis.value.filter(s => escolhidos.value.includes(s.id))
  const caso = casoDoMenuAtual(nome.value.trim(), menus, n => rotuloDoNo(n, props.t), {
    area: area.value,
    complexidade: complexidade.value,
    descricao: descricao.value.trim(),
    icone: menus[0]?.icone,
  })
  casos.value = [caso, ...casos.value]
  toast.add({ title: props.t.casoCriado(caso.nome), icon: 'i-lucide-package-plus', color: 'success' })
  janelas.criando.value = false
}
</script>

<template>
  <UModal v-model:open="janelas.criando.value" :title="props.t.criarCasoTitulo" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <form id="form-criar-caso" class="space-y-4" @submit.prevent="criar">
        <UFormField :label="props.t.nomeDoCaso" required>
          <UInput v-model="nome" class="w-full" autofocus />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField :label="props.t.areaDoCaso">
            <USelect v-model="area" :items="[...AREAS]" class="w-full" />
          </UFormField>
          <UFormField :label="props.t.complexidadeRotulo">
            <USelect
              v-model="complexidade"
              :items="(['iniciante', 'intermediario', 'avancado'] as const).map(c => ({ label: props.t.complexidades[c], value: c }))"
              class="w-full"
            />
          </UFormField>
        </div>
        <UFormField :label="props.t.descricaoCampo">
          <UTextarea v-model="descricao" :rows="2" autoresize class="w-full" />
        </UFormField>
        <UFormField :label="props.t.menusDoCaso" required>
          <p v-if="!menusDisponiveis.length" class="text-xs text-muted">{{ props.t.semMenusDoWorkspace }}</p>
          <ul v-else class="max-h-48 space-y-1.5 overflow-y-auto rounded-lg border border-default p-2.5">
            <li v-for="s in menusDisponiveis" :key="s.id">
              <UCheckbox
                :model-value="escolhidos.includes(s.id)"
                :description="props.t.nMenusTelas(1, s.filhos?.length ?? 0)"
                @update:model-value="v => alternar(s.id, v)"
              >
                <template #label>
                  <span class="inline-flex items-center gap-2">
                    <UIcon :name="s.icone" class="size-4 text-toned" />{{ rotuloDoNo(s, props.t) }}
                  </span>
                </template>
              </UCheckbox>
            </li>
          </ul>
        </UFormField>
      </form>
    </template>
    <template #footer>
      <UButton
        type="submit"
        form="form-criar-caso"
        block
        color="primary"
        :label="props.t.criarCaso"
        :disabled="!nome.trim() || !escolhidos.length"
      />
    </template>
  </UModal>
</template>
