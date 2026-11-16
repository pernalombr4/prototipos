<script setup lang="ts">
/**
 * PROPOSTA: quem usa o agente no chat e quem edita.
 *
 * Hoje todo agente ativo aparece para todo membro e qualquer um que entra nas
 * Configurações edita. O mercado separa os 2 níveis (PESQUISA: Notion, GPTs,
 * Copilot Studio, Glean). O agente age com as permissões de quem conversa.
 */
import type { Textos } from './textos'
import { cargos, gruposDeMembros, pessoas, pessoaPorId, type Acesso, type Agente } from './mocks'

const props = defineProps<{ t: Textos, a: Agente }>()
const c = computed(() => props.t.acesso)

const opcoes = computed(() => (['todos', 'cargos', 'grupos', 'pessoas'] as Acesso[]).map(k => ({ value: k, label: c.value.opcoes[k] })))
const alvos = computed(() => ({
  todos: [],
  cargos: cargos,
  grupos: gruposDeMembros,
  pessoas: pessoas.map(p => p.nome),
}[props.a.acesso]))

watch(() => props.a.acesso, () => { props.a.acessoAlvos = props.a.acessoAlvos.filter(x => (alvos.value as string[]).includes(x)) })

const novoEditor = ref<number | undefined>()
const candidatos = computed(() => pessoas.filter(p => p.id !== props.a.dono && !props.a.editores.includes(p.id)).map(p => ({ value: p.id, label: p.nome })))
watch(novoEditor, (id) => {
  if (id == null) return
  props.a.editores.push(id)
  nextTick(() => { novoEditor.value = undefined })
})
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <section class="space-y-4">
      <h3 class="text-base font-semibold text-highlighted">{{ c.usoTitulo }}</h3>
      <URadioGroup v-model="a.acesso" :items="opcoes" value-key="value" />
      <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
        <USelectMenu
          v-if="a.acesso !== 'todos'"
          v-model="a.acessoAlvos"
          :items="alvos"
          multiple
          :placeholder="c.alvosPlaceholder"
          class="w-full"
        />
      </Transition>
      <p class="flex items-start gap-2 rounded-lg bg-info/10 px-3 py-2 text-sm text-info">
        <UIcon name="i-lucide-shield-check" class="mt-0.5 size-4 shrink-0" />{{ c.identidade }}
      </p>
    </section>

    <section class="space-y-4">
      <h3 class="text-base font-semibold text-highlighted">{{ c.edicaoTitulo }}</h3>
      <ul class="divide-y divide-default rounded-lg border border-default">
        <li class="flex items-center gap-3 px-3 py-2.5">
          <UAvatar :text="pessoaPorId(a.dono).iniciais" size="sm" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-highlighted">{{ pessoaPorId(a.dono).nome }}</p>
            <p class="truncate text-xs text-muted">{{ pessoaPorId(a.dono).cargo }}</p>
          </div>
          <UBadge :label="c.dono" color="primary" variant="soft" size="sm" />
          <UButton :label="c.transferir" color="neutral" variant="ghost" size="xs" />
        </li>
        <li v-for="id in a.editores.filter(x => x !== a.dono)" :key="id" class="flex items-center gap-3 px-3 py-2.5">
          <UAvatar :text="pessoaPorId(id).iniciais" size="sm" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-highlighted">{{ pessoaPorId(id).nome }}</p>
            <p class="truncate text-xs text-muted">{{ pessoaPorId(id).cargo }}</p>
          </div>
          <UBadge :label="c.editores" color="neutral" variant="soft" size="sm" />
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="`${c.removerEditor} ${pessoaPorId(id).nome}`" @click="a.editores = a.editores.filter(x => x !== id)" />
        </li>
      </ul>
      <USelectMenu v-model="novoEditor" :items="candidatos" value-key="value" :placeholder="c.adicionarEditor" icon="i-lucide-user-plus" class="w-full sm:w-72" />
      <p class="text-xs text-muted">{{ c.editoresAjuda }}</p>
    </section>
  </div>
</template>
