<script setup lang="ts">
/**
 * PROPOSTA (demanda 5): a minuta que o agente monta com um modelo de resposta.
 *
 * O texto do modelo vai sem mudança; só os campos variam. Cada campo
 * preenchido aparece destacado e abre um campo para corrigir. Campo sem valor
 * fica em vermelho e trava o "Copiar minuta" até ser preenchido.
 */
import type { Textos } from './textos'
import type { Parte } from './conversa'
import { useBlocos } from './estado'

type Minuta = Extract<Parte, { tipo: 'minuta' }>

const props = defineProps<{ t: Textos, parte: Minuta }>()
const blocos = useBlocos()
const toast = useToast()

const bloco = computed(() => blocos.value.find(b => b.id === props.parte.bloco)!)
const m = computed(() => props.t.minuta)

const pedacos = computed(() => {
  const out: { tipo: 'texto' | 'campo', valor: string }[] = []
  const re = /\{\{(\w+)\}\}/g
  let ultimo = 0
  let r: RegExpExecArray | null
  const s = bloco.value.texto
  while ((r = re.exec(s))) {
    if (r.index > ultimo) out.push({ tipo: 'texto', valor: s.slice(ultimo, r.index) })
    out.push({ tipo: 'campo', valor: r[1]! })
    ultimo = r.index + r[0].length
  }
  if (ultimo < s.length) out.push({ tipo: 'texto', valor: s.slice(ultimo) })
  return out
})

const marcador = (k: string) => `{{${k}}}`
const campo = (chave: string) => bloco.value.campos.find(c => c.chave === chave)
const faltando = computed(() => [...new Set(bloco.value.campos.filter(c => c.obrigatorio && !props.parte.valores[c.chave]?.trim()).map(c => c.chave))])

const editandoCampo = ref<string | null>(null)
const valorEditado = ref('')
function abrir(chave: string) {
  editandoCampo.value = chave
  valorEditado.value = props.parte.valores[chave] ?? ''
}
function salvar() {
  const k = editandoCampo.value
  if (!k) return
  if (valorEditado.value !== props.parte.valores[k]) {
    props.parte.valores[k] = valorEditado.value
    if (!props.parte.alterados.includes(k)) props.parte.alterados.push(k)
  }
  editandoCampo.value = null
}

const textoFinal = computed(() => bloco.value.texto.replace(/\{\{(\w+)\}\}/g, (_, k) => props.parte.valores[k] ?? ''))
const copiada = ref(false)
async function copiar() {
  try { await navigator.clipboard.writeText(textoFinal.value) }
  catch { /* sem permissão de área de transferência: segue a maquete */ }
  copiada.value = true
  toast.add({ title: m.value.copiada, icon: 'i-lucide-clipboard-check', color: 'success' })
  setTimeout(() => { copiada.value = false }, 1800)
}
</script>

<template>
  <div class="my-2 overflow-hidden rounded-lg ring ring-default">
    <div class="flex flex-wrap items-center gap-2 border-b border-default bg-elevated/50 px-3 py-2">
      <UIcon name="i-lucide-file-text" class="size-4 text-primary" />
      <span class="text-sm font-medium text-highlighted">{{ m.titulo }}</span>
      <UBadge :label="m.bloco(bloco.codigo, bloco.nome)" color="primary" variant="soft" size="sm" class="max-w-full truncate" />
    </div>

    <div class="max-h-80 overflow-y-auto px-4 py-3 font-serif text-[13px] leading-relaxed text-default">
      <p class="whitespace-pre-wrap">
        <template v-for="(p, i) in pedacos" :key="i">
          <template v-if="p.tipo === 'texto'">{{ p.valor }}</template>
          <UPopover
            v-else
            :open="editandoCampo === p.valor"
            :content="{ side: 'top', align: 'start' }"
            @update:open="(v: boolean) => v ? abrir(p.valor) : (editandoCampo = null)"
          >
            <button
              type="button"
              class="mx-px rounded px-1 py-px font-sans text-[12px] font-medium transition hover:ring-2 focus-visible:outline-2 focus-visible:outline-primary"
              :class="!parte.valores[p.valor]?.trim()
                ? 'bg-error/15 text-error ring-1 ring-error/50 hover:ring-error'
                : parte.alterados.includes(p.valor)
                  ? 'bg-success/15 text-success hover:ring-success/50'
                  : 'bg-primary/12 text-primary hover:ring-primary/40'"
              :aria-label="m.editarCampo(p.valor)"
            >{{ parte.valores[p.valor]?.trim() || marcador(p.valor) }}</button>
            <template #content>
              <form class="w-72 space-y-2 p-3" @submit.prevent="salvar">
                <p class="text-xs font-medium text-highlighted">{{ m.editarCampo(p.valor) }}</p>
                <p v-if="campo(p.valor)" class="text-xs text-muted">{{ m.origem[campo(p.valor)!.origem] }} · {{ t.biblioteca.tipos[campo(p.valor)!.tipo] }}</p>
                <UInput v-model="valorEditado" autofocus class="w-full" size="sm" :placeholder="campo(p.valor)?.exemplo" />
                <div class="flex justify-end gap-2">
                  <UButton :label="t.editor.cancelar" color="neutral" variant="ghost" size="xs" @click="editandoCampo = null" />
                  <UButton type="submit" :label="t.biblioteca.salvar" size="xs" />
                </div>
              </form>
            </template>
          </UPopover>
        </template>
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-default px-3 py-2">
      <p class="basis-full text-xs text-muted">
        <span class="mr-1.5 inline-block size-2 rounded-sm bg-primary/40 align-middle" />{{ m.legenda }}
        <template v-if="parte.alterados.length"> <span class="ml-1.5 mr-1 inline-block size-2 rounded-sm bg-success/50 align-middle" />{{ m.alterado }}</template>
      </p>
      <span class="flex-1" />
      <UBadge v-if="faltando.length" :label="m.faltando(faltando.length)" color="error" variant="soft" size="sm" icon="i-lucide-circle-alert" />
      <UTooltip :text="faltando.length ? m.copiarComFalta : ''" :disabled="!faltando.length">
        <UButton
          :label="copiada ? t.chat.copiado : m.copiar"
          :icon="copiada ? 'i-lucide-check' : 'i-lucide-copy'"
          size="xs"
          :disabled="!!faltando.length"
          @click="copiar"
        />
      </UTooltip>
    </div>
  </div>
</template>
