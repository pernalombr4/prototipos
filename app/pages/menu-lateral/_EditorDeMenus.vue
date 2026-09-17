<script setup lang="ts">
import { menuDoEditor, tiposDeTela, podeMover, type NoDoMenu, type TipoDeNo } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O editor do menu, em `Configurações > Interface > Menus`.
 *
 * Responde a três coisas que ela pediu na rodada 3:
 * 1. quando o administrador põe uma tela no menu, ele escolhe O TIPO dela (os 13
 *    tipos que o produto já tem em Interface > Telas);
 * 2. dá para reordenar e reagrupar;
 * 3. "sem quebrar a lógica do enspace. por exemplo, nao da pra deixar o cara
 *    botar uma categoria dentro de tarefas".
 *
 * As regras de encaixe moram no `podeMover` do mocks.ts, e o destino inválido
 * aparece na lista de propósito: recusar com o motivo ensina a regra, esconder
 * o destino só deixa a pessoa sem entender por que não dá.
 */
const props = defineProps<{ t: TextosDaTela }>()
const aberto = defineModel<boolean>('open', { default: false })
const toast = useToast()

/** Cópia em memória. Recarregar a página volta ao começo. */
const arvore = ref<NoDoMenu[]>(JSON.parse(JSON.stringify(menuDoEditor)))
const recusa = ref<{ id: string, motivo: string } | null>(null)

watch(aberto, (v) => {
  if (v) {
    arvore.value = JSON.parse(JSON.stringify(menuDoEditor))
    recusa.value = null
  }
})

function rotuloDe(no: NoDoMenu) {
  if (no.rotulo) return no.rotulo
  const chave = no.chave ?? ''
  const mapa: Record<string, string> = {
    inicio: props.t.inicio,
    tarefas: props.t.tarefas,
    agenda: props.t.agenda,
    spaceflows: props.t.spaceflows,
    documentos: props.t.documentos,
    categorias: props.t.categorias,
  }
  return mapa[chave] ?? chave
}

/** Onde o nó está: a lista de irmãos e o pai. */
function localizar(id: string): { irmaos: NoDoMenu[], indice: number, pai: NoDoMenu | null } | null {
  const i = arvore.value.findIndex(n => n.id === id)
  if (i >= 0) return { irmaos: arvore.value, indice: i, pai: null }
  for (const pai of arvore.value) {
    if (!pai.filhos) continue
    const j = pai.filhos.findIndex(n => n.id === id)
    if (j >= 0) return { irmaos: pai.filhos, indice: j, pai }
  }
  return null
}

function reordenar(id: string, passo: -1 | 1) {
  const onde = localizar(id)
  if (!onde) return
  const alvo = onde.indice + passo
  if (alvo < 0 || alvo >= onde.irmaos.length) return
  const [no] = onde.irmaos.splice(onde.indice, 1)
  onde.irmaos.splice(alvo, 0, no!)
  recusa.value = null
}

/** Os destinos possíveis de um nó, inválidos incluídos. */
function destinosDe(no: NoDoMenu) {
  const lista: { id: string, rotulo: string, tipo: TipoDeNo }[] = [
    { id: 'raiz', rotulo: props.t.foraDeSecao, tipo: 'raiz' },
  ]
  for (const n of arvore.value) {
    if (n.id === no.id) continue
    if (n.tipo === 'secao' || n.tipo === 'secao-nativa' || n.tipo === 'destino') {
      lista.push({ id: n.id, rotulo: rotuloDe(n), tipo: n.tipo })
    }
  }
  return lista
}

function mover(no: NoDoMenu, destino: { id: string, tipo: TipoDeNo }) {
  const veredito = podeMover(no.tipo, destino.tipo)
  if (!veredito.pode) {
    const motivo = props.t.motivos[veredito.motivo ?? ''] ?? ''
    recusa.value = { id: no.id, motivo }
    toast.add({ title: motivo, icon: 'i-lucide-ban', color: 'error' })
    return
  }

  const onde = localizar(no.id)
  if (!onde) return
  onde.irmaos.splice(onde.indice, 1)

  if (destino.id === 'raiz') {
    arvore.value.push(no)
  }
  else {
    const pai = arvore.value.find(n => n.id === destino.id)
    if (!pai) return
    pai.filhos = pai.filhos ?? []
    pai.filhos.push(no)
  }
  recusa.value = null
  toast.add({ title: `${rotuloDe(no)} → ${destino.rotulo ?? ''}`, icon: 'i-lucide-check', color: 'neutral' })
}

const opcoesDeTipo = computed(() =>
  tiposDeTela.map(t => ({ label: props.t.tipos[t.id] ?? t.id, value: t.id })),
)

function exigeCategoria(tipoId?: string) {
  return tiposDeTela.find(t => t.id === tipoId)?.exigeCategoria ?? false
}

function acoesDe(no: NoDoMenu) {
  return [destinosDe(no).map(d => ({
    label: d.rotulo,
    icon: d.tipo === 'destino' ? 'i-lucide-file' : d.tipo === 'raiz' ? 'i-lucide-list' : 'i-lucide-folder',
    onSelect: () => mover(no, d),
  }))]
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="props.t.editorTitulo"
    :description="props.t.editorDescricao"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <div class="max-h-[60vh] space-y-1 overflow-y-auto pr-1">
        <template v-for="no in arvore" :key="no.id">
          <!-- nível 1 -->
          <div
            class="animate-[entrada_0.2s_ease-out_both] rounded-lg border p-2"
            :class="recusa?.id === no.id ? 'border-error' : 'border-default'"
          >
            <div class="flex items-center gap-2">
              <UIcon :name="no.icone" class="size-4 shrink-0 text-toned" />
              <span class="min-w-0 flex-1 truncate text-sm font-semibold text-highlighted">{{ rotuloDe(no) }}</span>

              <UBadge
                :label="no.tipo === 'secao' ? props.t.seloWorkspace : props.t.seloNativo"
                size="sm"
                color="neutral"
                variant="subtle"
                class="shrink-0"
              />

              <UButton
                icon="i-lucide-chevron-up"
                size="xs"
                color="neutral"
                variant="ghost"
                :aria-label="props.t.moverAcima"
                @click="reordenar(no.id, -1)"
              />
              <UButton
                icon="i-lucide-chevron-down"
                size="xs"
                color="neutral"
                variant="ghost"
                :aria-label="props.t.moverAbaixo"
                @click="reordenar(no.id, 1)"
              />
            </div>

            <!-- nível 2 -->
            <div v-if="no.filhos?.length" class="mt-2 space-y-1 border-l border-default pl-3">
              <div
                v-for="filho in no.filhos"
                :key="filho.id"
                class="rounded-md p-1.5"
                :class="recusa?.id === filho.id ? 'bg-error/10' : 'hover:bg-elevated'"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <UIcon :name="filho.icone" class="size-4 shrink-0 text-toned" />
                  <span class="min-w-0 flex-1 truncate text-sm text-default">{{ rotuloDe(filho) }}</span>

                  <!-- o TIPO da tela, que é o que ela pediu -->
                  <USelect
                    v-if="filho.tipo === 'tela'"
                    v-model="filho.tipoDeTela"
                    :items="opcoesDeTipo"
                    size="xs"
                    class="w-48 shrink-0"
                    :aria-label="props.t.tipoDeTela"
                  />
                  <UBadge
                    v-else
                    :label="props.t.categorias"
                    size="sm"
                    color="neutral"
                    variant="subtle"
                    class="shrink-0"
                  />

                  <UButton
                    icon="i-lucide-chevron-up"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    :aria-label="props.t.moverAcima"
                    @click="reordenar(filho.id, -1)"
                  />
                  <UButton
                    icon="i-lucide-chevron-down"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    :aria-label="props.t.moverAbaixo"
                    @click="reordenar(filho.id, 1)"
                  />
                  <UDropdownMenu :items="acoesDe(filho)" :content="{ align: 'end' }">
                    <UButton
                      icon="i-lucide-corner-up-right"
                      size="xs"
                      color="neutral"
                      variant="subtle"
                      :label="props.t.moverPara"
                    />
                  </UDropdownMenu>
                </div>

                <!-- o tipo que pede categoria e não tem -->
                <p
                  v-if="filho.tipo === 'tela' && exigeCategoria(filho.tipoDeTela) && !filho.categoriasLigadas"
                  class="mt-1 flex items-center gap-1.5 pl-6 text-xs text-warning"
                >
                  <UIcon name="i-lucide-triangle-alert" class="size-3.5 shrink-0" />
                  {{ props.t.exigeCategoria }}
                </p>
                <p
                  v-else-if="filho.categoriasLigadas"
                  class="mt-1 pl-6 text-xs text-muted"
                >
                  {{ props.t.categoriasLigadas(filho.categoriasLigadas) }}
                </p>

                <!-- a recusa, com o motivo -->
                <p
                  v-if="recusa?.id === filho.id"
                  class="mt-1 flex items-center gap-1.5 pl-6 text-xs font-medium text-error"
                >
                  <UIcon name="i-lucide-ban" class="size-3.5 shrink-0" />
                  {{ recusa.motivo }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </UModal>
</template>
