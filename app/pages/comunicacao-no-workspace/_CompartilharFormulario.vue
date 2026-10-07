<script setup lang="ts">
/**
 * PROPOSTA. O link do formulário público na tela em que o membro usa o
 * formulário. Só aparece quando o formulário é público e o administrador
 * deixou os atalhos ligados em "Formulários".
 */
import type { Formulario } from './mocks'
import type { Textos } from './textos'
import { linkPublico } from './mocks'
import { useCopiar } from './atalhos'
import { useMarcaDeProposta } from './estado'
import { useAppExterno } from './simulador'
import AcoesDeContato from './_AcoesDeContato.vue'

const props = withDefaults(defineProps<{
  t: Textos
  formulario: Formulario
  /** Compacto: dentro do painel da tarefa. */
  compacto?: boolean
}>(), { compacto: false })

const { copiar, copiado } = useCopiar()
const marca = useMarcaDeProposta()
const { abrirApp } = useAppExterno()

const url = computed(() => linkPublico(props.formulario))

/** No produto, abre a página pública numa aba nova. Aqui, a simulação dela. */
function abrirNovaAba() {
  abrirApp({ tipo: 'formulario', url: url.value, formularioId: props.formulario.id })
}
</script>

<template>
  <section
    class="rounded-lg border border-default bg-default"
    :class="[compacto ? 'p-3' : 'p-4', marca]"
    :aria-label="t.form.compartilharTitulo"
  >
    <div class="flex flex-wrap items-center gap-2">
      <p class="text-sm font-semibold text-highlighted">
        {{ t.form.compartilharTitulo }}
      </p>
      <UBadge :label="t.form.publico" color="success" variant="subtle" size="sm" />
      <p class="ml-auto text-xs text-muted">
        {{ t.form.qualquerPessoa }}
      </p>
    </div>

    <UFieldGroup class="mt-3 w-full">
      <UInput
        :model-value="url"
        readonly
        icon="i-lucide-link"
        class="min-w-0 flex-1"
        :ui="{ base: 'font-mono text-xs text-toned' }"
        :aria-label="t.form.linkDoFormulario"
        @focus="($event.target as HTMLInputElement).select()"
      />
      <UButton
        :icon="copiado === formulario.id ? 'i-lucide-check' : 'i-lucide-copy'"
        :label="copiado === formulario.id ? t.form.copiado : t.form.copiarLink"
        :color="copiado === formulario.id ? 'success' : 'primary'"
        class="transition-colors"
        @click="copiar(formulario.id, url, formulario.nome)"
      />
      <UTooltip :text="t.form.abrirNovaAba">
        <UButton icon="i-lucide-external-link" color="neutral" variant="outline" :aria-label="t.form.abrirNovaAba" @click="abrirNovaAba" />
      </UTooltip>
    </UFieldGroup>

    <div class="mt-3 flex flex-wrap items-center gap-2">
      <span class="text-xs text-muted">{{ t.form.enviarLinkPor }}</span>
      <AcoesDeContato
        :t="t"
        :destino="null"
        lugar="formularios"
        sem-destinatario
        tamanho="xs"
        origem="inicio"
        :assunto="t.form.assuntoDoLink(formulario.nome)"
        :mensagem="t.form.mensagemDoLink(formulario.nome, url)"
        :corpo-enspace="`<p>${t.form.mensagemDoLink(formulario.nome, url)}</p>`"
      />
    </div>
  </section>
</template>
