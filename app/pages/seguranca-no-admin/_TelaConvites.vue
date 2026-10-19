<script setup lang="ts">
/**
 * Pedido 8 (parte 2): Identidade › Convites. Tela nova.
 *
 * Referências: monday ("Only admins can invite new users" ligado por padrão),
 * Atlassian (domínio aprovado por produto), Airtable (lista de domínios
 * confiáveis). Nenhum dos 5 concorrentes documenta lista de domínios para
 * convite; o teste de e-mail é proposta.
 */
import type { Textos } from './textos'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const toast = useToast()
const tc = computed(() => props.t.convites)

const salvo = useState('sa-convites', () => ({ quem: 'ws' as 'org' | 'ws' | 'todos', restringir: true, dominios: ['horizontebio.com.br', 'parceiro-auditoria.com.br'], externos: false }))
const c = reactive(structuredClone(toRaw(salvo.value)))
const alterada = computed(() => JSON.stringify(c) !== JSON.stringify(salvo.value))
const pendentes = useState('sa-convites-pendentes', () => 2)

function salvar() {
  salvo.value = structuredClone(toRaw(c))
  toast.add({ title: tc.value.salvo, icon: 'i-lucide-check', color: 'success' })
}

const teste = ref('ana.souza@gmail.com')
const resultado = computed(() => {
  const d = teste.value.split('@')[1]?.trim().toLowerCase()
  if (!d) return null
  if (!c.restringir || c.externos || c.dominios.some(x => d === x || d.endsWith(`.${x}`))) return { ok: true, texto: tc.value.pode }
  return { ok: false, texto: tc.value.naoPode(d) }
})
</script>

<template>
  <div>
    <Cabecalho :titulo="tc.titulo" :intro="tc.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        <UButton :label="t.comum.salvar" size="sm" :disabled="!alterada" @click="salvar" />
      </template>
    </Cabecalho>

    <div class="grid gap-4 p-6 xl:grid-cols-[1fr_22rem]">
      <div class="grid gap-4 md:grid-cols-2">
        <Regra :titulo="tc.quem" icone="i-lucide-user-plus" :alterada="c.quem !== salvo.quem">
          <USelect v-model="c.quem" :items="(['org', 'ws', 'todos'] as const).map(v => ({ label: tc.quemOpcoes[v], value: v }))" class="w-full" />
        </Regra>
        <Regra :titulo="tc.externos" icone="i-lucide-user-round-x" :descricao="tc.externosAjuda" :alterada="c.externos !== salvo.externos">
          <USwitch v-model="c.externos" />
        </Regra>
        <Regra :titulo="tc.restringir" icone="i-lucide-at-sign" :descricao="tc.restringirAjuda" :alterada="c.restringir !== salvo.restringir || JSON.stringify(c.dominios) !== JSON.stringify(salvo.dominios)" class="md:col-span-2">
          <template #selos><USwitch v-model="c.restringir" size="sm" /></template>
          <UInputTags v-model="c.dominios" :placeholder="tc.dominiosPh" :disabled="!c.restringir" class="w-full" />
        </Regra>
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-200" leave-to-class="opacity-0">
          <UAlert
            v-if="pendentes && c.restringir && !c.externos"
            class="md:col-span-2"
            icon="i-lucide-mail-warning"
            color="warning"
            variant="soft"
            :description="tc.pendentes(pendentes)"
            :actions="[{ label: tc.cancelarPendentes, color: 'warning', variant: 'outline', size: 'xs', onClick: () => { pendentes = 0; toast.add({ title: tc.cancelados, icon: 'i-lucide-mail-x', color: 'neutral' }) } }]"
          />
        </Transition>
      </div>

      <aside class="h-fit rounded-lg border border-default bg-default p-4">
        <h3 class="mb-2 text-sm font-semibold text-highlighted">{{ tc.testar }}</h3>
        <UInput v-model="teste" :placeholder="tc.testarPh" icon="i-lucide-mail" class="w-full" />
        <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0 translate-y-1">
          <UAlert v-if="resultado" :key="resultado.texto" class="mt-3" :color="resultado.ok ? 'success' : 'error'" :icon="resultado.ok ? 'i-lucide-circle-check' : 'i-lucide-ban'" variant="soft" :description="resultado.texto" />
        </Transition>
      </aside>
    </div>
  </div>
</template>
