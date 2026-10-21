<script setup lang="ts">
/**
 * TIPO DE MENU "PÁGINA EXTERNA".
 *
 * É o Conteúdo Embutido com front novo, e recebe o atalho que o tipo
 * Customizado prometia e não entregava (U4: nenhum dos 3 caminhos testados
 * renderiza). O Customizado deixa de existir.
 *
 * O que muda:
 *   - moldura com o nome do menu, o domínio de origem e "Abrir em nova aba":
 *     hoje a página entra sem título nem origem, e o LOGIN do site parece
 *     ser do ENSPACE (U7);
 *   - aviso quando o site recusa iframe, em vez da área em branco;
 *   - a opção de configuração "abrir em nova aba em vez de embutir".
 *
 * 🚫 Sem rede: o site "embutido" é uma maquete desenhada aqui, não um iframe
 * de verdade (regra 4). O andaime troca entre os 3 casos.
 */
import { useTiposDeTela } from './estado'
import CabecalhoDaTela from './_CabecalhoDaTela.vue'
import EstadoDaTela from './_EstadoDaTela.vue'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ tentarDeNovo: [] }>()

const { cenario, modoExterna } = useTiposDeTela()
const toast = useToast()

const DOMINIO = 'bi.aurora-servicos.example'
const recarregando = ref(false)
async function recarregar() {
  recarregando.value = true
  await new Promise(r => setTimeout(r, 800))
  recarregando.value = false
}
function novaAba() {
  toast.add({ title: props.t.externa.abriuNovaAba, description: `https://${DOMINIO}/indicadores`, icon: 'i-lucide-external-link', color: 'neutral' })
}

/* O conteúdo do site de fora: números inventados, no visual "de outro produto". */
const barras = [62, 48, 71, 55, 80, 67, 90, 74, 58, 85, 69, 77]
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <CabecalhoDaTela
      icone="i-lucide-globe"
      :titulo="t.externa.titulo"
      :descricao="`${t.externa.conteudoDe} ${DOMINIO}`"
      :substitui="['Conteúdo Embutido', 'Customizado (sai)']"
      onde="Tipo de menu, criado em Interface > Menus. Pede a URL e o modo: embutir ou abrir em nova aba."
    >
      <template #acoes>
        <UButton :label="t.externa.novaAba" icon="i-lucide-external-link" color="neutral" variant="outline" size="sm" @click="novaAba" />
      </template>
    </CabecalhoDaTela>

    <EstadoDaTela :t="t" :cenario="cenario" @tentar-de-novo="emit('tentarDeNovo')">
      <template #vazio>
        <UEmpty icon="i-lucide-globe" :title="t.externa.recusaTitulo" :description="t.externa.recusaTexto(DOMINIO)" />
      </template>

      <div class="flex min-h-0 flex-1 flex-col p-6 pb-24">
        <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-[0.99]" leave-active-class="transition duration-100" leave-to-class="opacity-0">
          <!-- Embutida: a moldura diz de onde vem o conteúdo -->
          <div v-if="modoExterna === 'embutida'" key="embutida" class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-default">
            <div class="flex items-center gap-2 border-b border-default bg-elevated/60 px-3 py-2">
              <UIcon name="i-lucide-lock" class="size-3.5 text-success" />
              <span class="truncate font-mono text-xs text-toned">{{ DOMINIO }}/indicadores</span>
              <span class="hidden text-xs text-muted md:inline">· {{ t.externa.aviso }}</span>
              <span class="ml-auto flex items-center gap-1">
                <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :loading="recarregando" :aria-label="t.externa.recarregar" @click="recarregar" />
                <UButton icon="i-lucide-external-link" color="neutral" variant="ghost" size="xs" :aria-label="t.externa.novaAba" @click="novaAba" />
              </span>
            </div>

            <!-- MAQUETE do site de fora. Não é proposta: é o que o cliente embute. -->
            <div class="relative min-h-0 flex-1 overflow-auto bg-muted p-6" :class="recarregando ? 'opacity-40 transition-opacity' : 'transition-opacity'">
              <div class="mb-6 flex items-center gap-3">
                <span class="size-7 rounded bg-inverted/80" />
                <span class="font-serif text-lg text-highlighted">Indicadores Aurora</span>
                <span class="ml-auto rounded border border-inverted/40 px-3 py-1 text-xs font-semibold tracking-widest text-highlighted">LOGIN</span>
              </div>
              <div class="grid gap-4 md:grid-cols-3">
                <div v-for="(n, i) in ['Receita do mês', 'Margem', 'Clientes ativos']" :key="n" class="rounded border border-default bg-default p-4">
                  <p class="font-serif text-xs text-muted">{{ n }}</p>
                  <p class="mt-1 font-serif text-2xl text-highlighted">{{ ['R$ 4,2 mi', '18,4%', '1.284'][i] }}</p>
                </div>
              </div>
              <div class="mt-4 flex h-40 items-end gap-1.5 rounded border border-default bg-default p-4">
                <span v-for="(b, i) in barras" :key="i" class="flex-1 rounded-sm bg-inverted/60" :style="{ height: `${b}%` }" />
              </div>
            </div>
          </div>

          <!-- O site recusa iframe: a tela diz e oferece a saída -->
          <div v-else-if="modoExterna === 'recusa'" key="recusa" class="flex flex-1 items-center justify-center rounded-lg border border-dashed border-accented p-10">
            <UEmpty
              icon="i-lucide-shield-x"
              :title="t.externa.recusaTitulo"
              :description="t.externa.recusaTexto(DOMINIO)"
              :actions="[{ label: t.externa.novaAba, icon: 'i-lucide-external-link', color: 'primary', onClick: novaAba }]"
            />
          </div>

          <!-- Configurada para abrir fora: o atalho do antigo Customizado -->
          <div v-else key="nova-aba" class="flex flex-1 items-center justify-center rounded-lg border border-dashed border-accented p-10">
            <UEmpty
              icon="i-lucide-external-link"
              :title="t.externa.novaAbaTitulo"
              :description="t.externa.novaAbaTexto(DOMINIO)"
              :actions="[{ label: t.externa.novaAba, icon: 'i-lucide-external-link', color: 'primary', onClick: novaAba }]"
            />
          </div>
        </Transition>
      </div>
    </EstadoDaTela>
  </div>
</template>
