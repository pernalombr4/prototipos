<script setup lang="ts">
import { useTrilha } from './trilha'
import { useJanelasDeCasos } from './casos'
import type { TextosDaTela } from './textos'

/**
 * O "+ ▾" DO INÍCIO (rodada 17).
 *
 *   "no botao de criar, ao clicar voce pode descrever o que quer criar e, se
 *    nao for encontrada no menu, sobra a opçao de usar a ia pra criar pra
 *    voce. esse é um ponto interessante." (Mikaela)
 *
 * É o do ClickUp: uma caixa "Descreva o que quer criar" em cima, as opções
 * embaixo, e a caixa filtra as opções. Quando o que foi digitado não casa
 * com nenhuma, a lista não fica vazia: aparece "Criar com IA", com o texto
 * digitado, e o BENI monta. No ENSPACE a IA é o BENI, e a regra da casa é a
 * de `ia-no-campo-html`: ele PROPÕE e mostra antes de gravar. Aqui o clique
 * é maquete e diz isso.
 *
 * As três entidades são as da rodada 16 (seção, menu, categoria), e
 * "Personalizar a barra lateral" fecha a lista.
 *
 * RODADA 18: no pé, os dois botões do ClickUp, "Importar" e "Modelos". No
 * ENSPACE, modelo é CASO DE USO, e a importação traz um caso de uso de outro
 * workspace. Os dois existem no produto (Configurações > Interface > Casos de
 * Uso); aqui ficam a um clique de quem está montando o menu.
 */
const props = defineProps<{
  t: TextosDaTela
  podeConfigurar: boolean
}>()

const trilha = useTrilha()
const casos = useJanelasDeCasos()
const toast = useToast()

const aberto = ref(false)
const termo = ref('')

watch(aberto, (v) => { if (!v) termo.value = '' })

function fechar(acao: () => void) {
  aberto.value = false
  acao()
}

function normaliza(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const opcoes = computed(() => {
  const travado = !props.podeConfigurar
  const dica = travado ? props.t.ctxSoQuemConfigura : undefined
  return [
    { label: props.t.criarSecaoRotulo, icon: 'i-lucide-rows-3', onSelect: () => fechar(() => { trilha.criandoSecao.value = 'nova' }) },
    { label: props.t.criarMenuRotulo, icon: 'i-lucide-list-tree', suffix: dica, disabled: travado, onSelect: () => fechar(() => { trilha.criandoMenu.value = 'inicio' }) },
    { label: props.t.criarCategoriaRotulo, icon: 'i-lucide-folder-plus', suffix: dica, disabled: travado, onSelect: () => fechar(() => { trilha.criandoCategoria.value = true }) },
  ]
})

/** Nada casou com o que foi digitado: é a vez da IA. */
const nadaCasou = computed(() => {
  const t = normaliza(termo.value.trim())
  if (!t) return false
  return !opcoes.value.some(o => normaliza(o.label).includes(t))
})

const grupos = computed(() => {
  const lista: Record<string, unknown>[] = [{ id: 'criar', label: props.t.grupoCriar, items: opcoes.value }]
  if (nadaCasou.value) {
    lista.unshift({
      id: 'ia',
      label: props.t.grupoCriar,
      // A IA não passa pelo filtro: ela é justamente o que sobra quando nada passou.
      ignoreFilter: true,
      items: [{
        label: props.t.criarComIa,
        suffix: termo.value.trim(),
        icon: 'i-lucide-sparkles',
        onSelect: () => {
          const texto = termo.value.trim()
          fechar(() => toast.add({ title: props.t.criarComIaToast(texto), description: props.t.criarComIaDica, icon: 'i-lucide-sparkles', color: 'neutral' }))
        },
      }],
    })
  }
  lista.push({
    id: 'menu',
    label: props.t.grupoAtalhosCriar,
    items: [{ label: props.t.inicioPersonalizar, icon: 'i-lucide-sliders-horizontal', onSelect: () => fechar(() => trilha.abrirPersonalizar('navegacao')) }],
  })
  return lista
})
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'end', sideOffset: 6 }">
    <UButton
      icon="i-lucide-plus"
      trailing-icon="i-lucide-chevron-down"
      size="xs"
      color="neutral"
      variant="outline"
      class="ml-0.5"
      :aria-label="props.t.criarAlgo"
    />
    <template #content>
      <UCommandPalette
        v-model:search-term="termo"
        :groups="grupos"
        :placeholder="props.t.descrevaParaCriar"
        icon="i-lucide-pencil-line"
        class="max-h-96 w-80"
      >
        <template #footer>
          <div class="grid grid-cols-2 gap-2">
            <UButton
              :label="props.t.importarRotulo"
              icon="i-lucide-download"
              size="sm"
              color="neutral"
              variant="outline"
              class="justify-center"
              @click="fechar(() => { casos.importando.value = true })"
            />
            <UButton
              :label="props.t.casosDeUso"
              icon="i-lucide-package"
              size="sm"
              color="neutral"
              variant="outline"
              class="justify-center"
              @click="fechar(() => { casos.central.value = true })"
            />
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UPopover>
</template>
