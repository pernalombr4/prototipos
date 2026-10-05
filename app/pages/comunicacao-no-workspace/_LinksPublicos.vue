<script setup lang="ts">
/**
 * PROPOSTA. Os links dos formulários públicos num menu: copiar ou mandar.
 * Mora na tela inicial (todos) e na lista de itens (só os da categoria).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Formulario, SlugDaCategoria } from './mocks'
import type { Textos } from './textos'
import { categoriaPorSlug, linkPublico } from './mocks'
import { ICONE_DO_CANAL, useAtalhos, useCopiar } from './atalhos'
import { useComunicacao, useMarcaDeProposta } from './estado'

const props = defineProps<{
  t: Textos
  /** Filtra pela categoria (lista de itens). Sem ela, todos. */
  categoria?: SlugDaCategoria
  /** Só o ícone no gatilho. */
  soIcone?: boolean
}>()

const { formularios, ir } = useComunicacao()
const { canaisEm, abrir, escreverNoEnspace, config } = useAtalhos()
const { copiar, copiado } = useCopiar()
const marca = useMarcaDeProposta()

const publicos = computed(() => formularios.value.filter(f =>
  f.visibilidade === 'publico' && (!props.categoria || f.categoria === props.categoria)))

function menuDeEnvio(f: Formulario): DropdownMenuItem[][] {
  const url = linkPublico(f)
  const mensagem = props.t.form.mensagemDoLink(f.nome, url)
  const assunto = props.t.form.assuntoDoLink(f.nome)
  const canais = canaisEm('formularios')
  const itens: DropdownMenuItem[] = []
  if (canais.includes('email') && config.value.emailDoEnspace) {
    itens.push({
      label: props.t.atalho.escreverNoEnspace,
      icon: 'i-lucide-send',
      onSelect: () => escreverNoEnspace(null, null, 'inicio', { assunto, corpo: `<p>${mensagem}</p>` }),
    })
  }
  for (const c of canais) {
    itens.push({
      label: c === 'email' ? props.t.atalho.abrirNoApp : props.t.atalho.canal[c],
      icon: ICONE_DO_CANAL[c],
      onSelect: () => abrir(c, null, { assunto, mensagem }),
    })
  }
  return [[{ type: 'label', label: props.t.form.enviarLinkPor }], itens]
}
</script>

<template>
  <UPopover :content="{ align: 'start' }">
    <UButton
      icon="i-lucide-link"
      :label="soIcone ? undefined : t.form.linkDeFormulario"
      :trailing-icon="soIcone ? undefined : 'i-lucide-chevron-down'"
      color="neutral"
      variant="outline"
      size="sm"
      :aria-label="t.form.linkDeFormulario"
      :class="marca"
    />

    <template #content>
      <div class="w-[22rem] p-2">
        <p class="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-muted">
          {{ t.form.copiarLinkPublico }}
        </p>

        <UEmpty
          variant="naked"
          v-if="!publicos.length"
          icon="i-lucide-link-2-off"
          :title="t.form.nenhumPublico"
          :description="t.form.nenhumPublicoDica"
          size="sm"
          :actions="[{ label: t.form.irParaFormularios, color: 'neutral', variant: 'outline', size: 'xs', onClick: () => ir('categoria', { vista: 'formularios' }) }]"
        />

        <ul v-else class="flex flex-col">
          <li
            v-for="f in publicos"
            :key="f.id"
            class="group flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-elevated"
          >
            <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-elevated text-muted group-hover:bg-accented">
              <UIcon name="i-lucide-link" class="size-4" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-highlighted">{{ f.nome }}</span>
              <span class="block truncate text-xs text-muted">
                {{ categoriaPorSlug(f.categoria).name }} · <span class="font-mono">{{ linkPublico(f).replace('https://', '') }}</span>
              </span>
            </span>
            <UTooltip :text="copiado === f.id ? t.form.copiado : t.form.copiarLink">
              <UButton
                :icon="copiado === f.id ? 'i-lucide-check' : 'i-lucide-copy'"
                :color="copiado === f.id ? 'success' : 'neutral'"
                variant="ghost"
                size="sm"
                :aria-label="`${t.form.copiarLink}: ${f.nome}`"
                @click="copiar(f.id, linkPublico(f), f.nome)"
              />
            </UTooltip>
            <UDropdownMenu v-if="canaisEm('formularios').length" :items="menuDeEnvio(f)" :content="{ align: 'end' }">
              <UButton icon="i-lucide-send" color="neutral" variant="ghost" size="sm" :aria-label="`${t.form.enviarLinkPor}: ${f.nome}`" />
            </UDropdownMenu>
          </li>
        </ul>

        <p class="mt-1 border-t border-default px-2 pt-2 text-xs text-muted">
          {{ t.form.soPublicos }}
        </p>
      </div>
    </template>
  </UPopover>
</template>
