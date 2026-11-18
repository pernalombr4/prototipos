<script setup lang="ts">
/**
 * Configurações › Estrutura › Categorias. Cópia do develop: a lista de
 * categorias em cartões, o painel da categoria com os 12 cartões (Campos,
 * Formulários… Correção Monetária) e a lista de Formulários.
 *
 * PROPOSTA (a avaliar com os devs):
 *  - o 13º cartão, "Contato da categoria", ao lado de Correção Monetária;
 *  - a página dele: de quais campos vêm o nome e o e-mail de cada contato, e
 *    o assunto do e-mail, com a prévia do que o botão E-mail abre. É o que
 *    alimenta o "Contato do item" na lateral do item;
 *  - na lista de Formulários, o Copiar dá o mesmo aviso de toda tela.
 * Hoje a categoria guarda configuração em `c-item-types.modules` e `view`
 * (JSON); o contato caberia ali, mas é dado novo: por isso "a avaliar".
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { CAMPO_REQUISITANTE, type Formulario, type SlugDaCategoria, campos, categoriaPorSlug, categorias, enderecoDoItem, itens, linkPublico } from './mocks'
import { type ConfigDaCategoria, contatosDoItem, preencher, useComunicacao, useMarcaDeProposta } from './estado'
import { useCopiar } from './atalhos'

const props = defineProps<{ t: Textos }>()

const { categoriaAtual, config, formularios, fase } = useComunicacao()
const marca = useMarcaDeProposta()
const toast = useToast()
const idioma = useIdioma()
const { copiar } = useCopiar()

type Vista = 'lista' | 'painel' | 'atalhos' | 'formularios'
const vista = useState<Vista>('cnw-vista-categoria', () => 'painel')
const categoria = computed(() => categoriaPorSlug(categoriaAtual.value))

function entrar(slug: SlugDaCategoria) {
  categoriaAtual.value = slug
  vista.value = 'painel'
}

/* ---------- painel (12 cartões de hoje + 1 na Fase 2) ---------- */

const cartoes = computed(() => [
  { chave: 'campos', icone: 'i-lucide-text-cursor-input' },
  { chave: 'formularios', icone: 'i-lucide-file-spreadsheet', vista: 'formularios' as Vista },
  { chave: 'fluxos', icone: 'i-lucide-share-2' },
  { chave: 'pastas', icone: 'i-lucide-folder' },
  { chave: 'relatorios', icone: 'i-lucide-chart-line' },
  { chave: 'condicionais', icone: 'i-lucide-list-filter' },
  { chave: 'templates', icone: 'i-lucide-file-type' },
  { chave: 'notificacoes', icone: 'i-lucide-bell' },
  { chave: 'responsabilidade', icone: 'i-lucide-shield' },
  { chave: 'execucoes', icone: 'i-lucide-calendar-clock' },
  { chave: 'status', icone: 'i-lucide-tag' },
  { chave: 'correcao', icone: 'i-lucide-circle-dollar-sign' },
  // Fase 2: o contato por categoria é dado novo no back.
  ...(fase.value >= 2 ? [{ chave: 'atalhos', icone: 'i-lucide-contact', vista: 'atalhos' as Vista, proposta: true }] : []),
])

/* ---------- atalhos: rascunho da configuração da categoria ---------- */

const rascunho = ref<ConfigDaCategoria>(structuredClone(toRaw(config.value.porCategoria[categoriaAtual.value])))
watch([categoriaAtual, vista], () => {
  rascunho.value = structuredClone(toRaw(config.value.porCategoria[categoriaAtual.value]))
})

/** O Select do Reka UI não aceita valor vazio: "Nenhum" tem valor próprio. */
const NENHUM = '__nenhum'

const camposDaCategoria = computed(() => campos.filter(c => c.categoria === categoriaAtual.value))
/** Pessoa/Empresa (`EnPerson`) entra pelos subcampos de contato. */
function deContato(sub: 'contact_name' | 'contact_email') {
  const rotulo = { contact_name: props.t.categoria.subNome, contact_email: props.t.categoria.subEmail }[sub]
  return camposDaCategoria.value.filter(c => c.type === 'EnPerson').map(c => ({ value: `${c.refId}.${sub}`, label: `${c.name} › ${rotulo}`, description: props.t.categoria.tipoPessoa }))
}
const opcoesDeNome = computed(() => [{ value: NENHUM, label: props.t.categoria.nenhum }, ...camposDaCategoria.value.filter(c => c.type === 'inputText').map(c => ({ value: c.refId, label: c.name })), ...deContato('contact_name')])
const opcoesDeEmail = computed(() => [
  { value: NENHUM, label: props.t.categoria.nenhum },
  ...camposDaCategoria.value.filter(c => c.type === 'email').map(c => ({ value: c.refId, label: c.name, description: props.t.categoria.tipoEmail })),
  ...deContato('contact_email'),
  { value: CAMPO_REQUISITANTE, label: props.t.categoria.emailDoRequisitante, description: props.t.categoria.campoPadrao },
])
function adicionarContato() {
  rascunho.value.contatos.push({ id: `c${Date.now()}`, rotulo: props.t.categoria.novoContato, campoNome: null, campoEmail: null })
}

const variaveis = ['{referencia}', '{titulo}', '{nome}', '{categoria}']
function inserir(v: string) {
  const a = rascunho.value.assunto
  rascunho.value.assunto = `${a}${a.endsWith(' ') || !a ? '' : ' '}${v}`
}

/* Prévia: um item de exemplo, com a configuração em edição. */
const exemplos = computed(() => itens.filter(i => i.categoria === categoriaAtual.value && !i.semAcesso).slice(0, 4))
const exemplo = ref<number | undefined>()
watch(exemplos, v => (exemplo.value = v[0]?.id), { immediate: true })
const itemExemplo = computed(() => exemplos.value.find(i => i.id === exemplo.value) ?? null)
const previa = computed(() => {
  const i = itemExemplo.value
  if (!i) return []
  const cfg = { ...config.value, porCategoria: { ...config.value.porCategoria, [i.categoria]: rascunho.value } }
  return contatosDoItem(i, cfg).map(c => ({
    contato: c,
    assunto: preencher(rascunho.value.assunto, i, c.nome),
    cc: enderecoDoItem(i),
  }))
})

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  config.value.porCategoria[categoriaAtual.value] = structuredClone(toRaw(rascunho.value))
  toast.add({ title: props.t.categoria.salvo, description: categoria.value.name, icon: 'i-lucide-check', color: 'success' })
}

/* ---------- formulários (cópia) ---------- */

interface Linha extends Record<string, unknown> { id: string, f: Formulario }
const linhasDeFormularios = computed<Linha[]>(() => formularios.value.filter(f => f.categoria === categoriaAtual.value).map(f => ({ id: f.id, f })))
const colunasDeFormularios = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: props.t.categoria.nome },
  { key: 'tipo', label: props.t.categoria.tipo },
  { key: 'respostas', label: props.t.categoria.respostas },
  { key: 'visibilidade', label: props.t.categoria.visibilidade },
])

function alternarVisibilidade(f: Formulario) {
  formularios.value = formularios.value.map(x => x.id === f.id ? { ...x, visibilidade: x.visibilidade === 'publico' ? 'privado' : 'publico' } : x)
  toast.add({ title: props.t.categoria.visibilidadeMudou(f.nome, f.visibilidade === 'publico' ? props.t.form.privado : props.t.form.publico), icon: 'i-lucide-check', color: 'success' })
}

function menuDoFormulario(f: Formulario): DropdownMenuItem[][] {
  return [[
    { label: props.t.categoria.editar, icon: 'i-lucide-pencil' },
    { label: props.t.categoria.deletar, icon: 'i-lucide-trash-2' },
    { label: props.t.categoria.duplicar, icon: 'i-lucide-copy-plus' },
    { label: props.t.categoria.exportarModelo, icon: 'i-lucide-download' },
    {
      label: props.t.categoria.copiar,
      icon: 'i-lucide-link',
      disabled: f.visibilidade !== 'publico',
      description: f.visibilidade !== 'publico' ? props.t.categoria.soPublicoCopia : undefined,
      onSelect: () => copiar(f.id, linkPublico(f), f.nome),
    },
    { label: props.t.categoria.acessar, icon: 'i-lucide-arrow-right' },
  ], [
    { label: f.visibilidade === 'publico' ? props.t.categoria.tornarPrivado : props.t.categoria.tornarPublico, icon: f.visibilidade === 'publico' ? 'i-lucide-lock' : 'i-lucide-globe', onSelect: () => alternarVisibilidade(f) },
  ]]
}
</script>

<template>
  <div class="px-6 py-5">
    <!-- Cabeçalho com voltar (cópia) -->
    <div class="mb-5 flex items-center gap-3">
      <UButton
        v-if="vista !== 'lista'"
        icon="i-lucide-arrow-left"
        color="primary"
        variant="ghost"
        :aria-label="t.categoria.voltar"
        @click="vista = vista === 'painel' ? 'lista' : 'painel'"
      />
      <h1 class="text-2xl font-bold text-highlighted">
        {{ vista === 'lista' ? t.categoria.categorias : categoria.name }}
      </h1>
      <span v-if="vista === 'atalhos'" class="text-sm text-muted">· {{ t.categoria.cartoes.atalhos }}</span>
      <UBadge v-if="vista === 'atalhos'" :label="t.categoria.avaliarComDevs" icon="i-lucide-messages-square" color="warning" variant="subtle" size="sm" />
      <span v-if="vista === 'formularios'" class="text-sm text-muted">· {{ t.categoria.cartoes.formularios }}</span>
    </div>

    <!-- Lista de categorias (cópia) -->
    <div v-if="vista === 'lista'" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <UCard
        v-for="(c, i) in categorias"
        :key="c.slug"
        class="animate-[entrada_.3s_ease-out_both] transition hover:-translate-y-0.5 hover:shadow-md"
        :style="{ animationDelay: `${i * 50}ms` }"
        :ui="{ footer: 'flex gap-2' }"
      >
        <template #header>
          <span class="flex items-center gap-3">
            <span class="flex size-8 items-center justify-center rounded-full bg-elevated"><UIcon :name="c.icon!" class="size-4 text-muted" /></span>
            <span class="text-sm font-medium text-highlighted">{{ c.name }}</span>
          </span>
        </template>
        <p class="text-sm text-toned">
          {{ c.description }}
        </p>
        <template #footer>
          <UButton icon="i-lucide-pencil" color="neutral" variant="soft" size="sm" :aria-label="t.categoria.editar" />
          <UButton icon="i-lucide-trash-2" color="neutral" variant="soft" size="sm" :aria-label="t.categoria.deletar" />
          <UButton icon="i-lucide-arrow-right" color="neutral" variant="soft" size="sm" :aria-label="t.categoria.acessar" @click="entrar(c.slug)" />
        </template>
      </UCard>
    </div>

    <!-- Painel da categoria -->
    <div v-else-if="vista === 'painel'" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <UCard
        v-for="(c, i) in cartoes"
        :key="c.chave"
        class="animate-[entrada_.3s_ease-out_both]"
        :class="[c.vista ? 'transition hover:-translate-y-0.5 hover:shadow-md' : '', c.proposta ? marca : '']"
        :style="{ animationDelay: `${i * 30}ms` }"
        :ui="{ body: 'min-h-20' }"
      >
        <template #header>
          <span class="flex items-center gap-3">
            <span class="flex size-8 items-center justify-center rounded-full bg-elevated"><UIcon :name="c.icone" class="size-4 text-muted" /></span>
            <span class="text-sm font-medium text-highlighted">{{ t.categoria.cartoes[c.chave as keyof typeof t.categoria.cartoes] }}</span>
            <UBadge v-if="c.proposta && !config.atalhos" :label="t.categoria.moduloDesligado" color="neutral" variant="subtle" size="sm" class="ml-auto" />
          </span>
        </template>
        <p class="text-sm text-toned">
          {{ t.categoria.descricoes[c.chave as keyof typeof t.categoria.descricoes] }}
        </p>
        <template #footer>
          <UTooltip :text="t.categoria.acessar">
            <UButton icon="i-lucide-arrow-right" color="neutral" variant="soft" size="sm" :aria-label="`${t.categoria.acessar}: ${t.categoria.cartoes[c.chave as keyof typeof t.categoria.cartoes]}`" @click="c.vista && (vista = c.vista)" />
          </UTooltip>
        </template>
      </UCard>
    </div>

    <!-- PROPOSTA: Atalhos de comunicação da categoria -->
    <div v-else-if="vista === 'atalhos'" class="grid gap-6 xl:grid-cols-[1fr_24rem]" :class="marca">
      <div class="flex flex-col gap-6">
        <UAlert
          v-if="!config.atalhos"
          icon="i-lucide-power"
          color="warning"
          variant="subtle"
          :title="t.categoria.moduloDesligadoTitulo"
          :description="t.categoria.moduloDesligadoDica"
        />

        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">
              {{ t.categoria.quemEhContato }}
            </h2>
            <p class="mt-1 text-sm text-muted">
              {{ t.categoria.quemEhContatoDica }}
            </p>
          </template>

          <TransitionGroup tag="div" class="flex flex-col gap-3" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
            <div v-for="(c, i) in rascunho.contatos" :key="c.id" class="rounded-lg border border-default p-3">
              <div class="flex items-center gap-2">
                <UInput v-model="c.rotulo" :aria-label="t.categoria.rotulo" class="flex-1" :ui="{ base: 'font-medium' }" />
                <UButton
                  icon="i-lucide-trash-2"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  :disabled="rascunho.contatos.length === 1"
                  :aria-label="t.categoria.removerContato"
                  @click="rascunho.contatos.splice(i, 1)"
                />
              </div>
              <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <UFormField :label="t.categoria.campoNome">
                  <USelect :model-value="c.campoNome ?? NENHUM" :items="opcoesDeNome" class="w-full" @update:model-value="c.campoNome = $event === NENHUM ? null : ($event as string)" />
                </UFormField>
                <UFormField :label="t.categoria.campoEmail">
                  <USelect :model-value="c.campoEmail ?? NENHUM" :items="opcoesDeEmail" class="w-full" @update:model-value="c.campoEmail = $event === NENHUM ? null : ($event as string)" />
                </UFormField>
              </div>
            </div>
          </TransitionGroup>
          <UButton :label="t.categoria.adicionarContato" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" class="mt-3" @click="adicionarContato" />
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">
              {{ t.categoria.assuntoDoEmail }}
            </h2>
            <p class="mt-1 text-sm text-muted">
              {{ t.categoria.assuntoDica }}
            </p>
          </template>
          <UFormField :label="t.categoria.assuntoDoEmail">
            <UInput v-model="rascunho.assunto" class="w-full" />
            <template #help>
              <span class="flex flex-wrap items-center gap-1">
                {{ t.categoria.inserir }}
                <UButton v-for="v in variaveis" :key="v" :label="v" color="neutral" variant="soft" size="xs" class="font-mono" @click="inserir(v)" />
              </span>
            </template>
          </UFormField>
        </UCard>

        <div class="flex justify-end">
          <UButton :label="t.sistema.salvar" :loading="salvando" @click="salvar" />
        </div>
      </div>

      <!-- Prévia -->
      <aside class="xl:sticky xl:top-4 xl:self-start">
        <UCard>
          <template #header>
            <h2 class="font-semibold text-highlighted">
              {{ t.categoria.previa }}
            </h2>
            <USelect
              v-model="exemplo"
              :items="exemplos.map(i => ({ value: i.id, label: `${i.reference} · ${i.titulo}` }))"
              size="sm"
              class="mt-2 w-full"
            />
          </template>
          <div class="flex flex-col gap-4">
            <div v-for="p in previa" :key="p.contato.id">
              <p class="text-xs font-semibold uppercase tracking-wide text-muted">
                {{ p.contato.rotulo }}
              </p>
              <p class="text-sm text-highlighted">
                {{ p.contato.nome ?? t.categoria.semNome }}
              </p>
              <dl v-if="p.contato.email" class="mt-1.5 grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1 text-xs">
                <dt class="text-muted">
                  {{ t.compositor.para }}
                </dt>
                <dd class="break-all font-mono text-toned">
                  {{ p.contato.email }}
                </dd>
                <dt class="text-muted">
                  {{ t.compositor.assunto }}
                </dt>
                <dd class="text-toned">
                  {{ p.assunto || '-' }}
                </dd>
                <dt class="text-muted">
                  {{ t.compositor.cc }}
                </dt>
                <dd class="break-all font-mono text-toned">
                  {{ p.cc }}
                </dd>
              </dl>
              <p v-else class="mt-1 flex items-center gap-1 text-xs text-warning">
                <UIcon name="i-lucide-triangle-alert" class="size-3.5" />{{ t.atalho.semEmail }}
              </p>
            </div>
          </div>
        </UCard>
      </aside>
    </div>

    <!-- Formulários (cópia) -->
    <div v-else class="flex flex-col gap-3">
      <EnTable :columns="colunasDeFormularios" :rows="linhasDeFormularios" :locale="idioma">
        <template #cell-nome="{ row }">
          <span class="text-sm text-highlighted">{{ (row as Linha).f.nome }}</span>
        </template>
        <template #cell-tipo="{ row }">
          <span class="text-sm text-toned">{{ t.categoria.tipos[(row as Linha).f.tipo] }}</span>
        </template>
        <template #cell-respostas="{ row }">
          <span class="text-sm text-toned">{{ (row as Linha).f.respostas }}</span>
        </template>
        <template #cell-visibilidade="{ row }">
          <UBadge
            :label="(row as Linha).f.visibilidade === 'publico' ? t.form.publico : t.form.privado"
            :color="(row as Linha).f.visibilidade === 'publico' ? 'warning' : 'success'"
            variant="subtle"
            size="sm"
          />
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="menuDoFormulario((row as Linha).f)" :ui="{ content: 'w-60' }">
            <UButton icon="i-lucide-chevron-down" color="neutral" variant="soft" size="xs" :aria-label="t.itens.acoes" />
          </UDropdownMenu>
        </template>
      </EnTable>
      <p class="text-xs text-muted">
        {{ t.categoria.formulariosDica }}
      </p>
    </div>
  </div>
</template>
