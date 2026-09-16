<script setup lang="ts">
import {
  workspaces,
  workspaceUnico,
  usuario,
  exemplosDoQueSeFazDentro,
  tempoRelativo,
  corDoPapel,
  type Workspace,
} from './mocks'

definePageMeta({
  titulo: 'Tela de entrada (Workspaces)',
  descricao: 'Fazer a pessoa entender que é uma tela de escolha, e não o lugar onde se abre chamado.',
  status: 'em-revisao',
  atualizado: '2026-09-16',
  tela: 'Proposta',
})

const toast = useToast()

/* ------------------------------------------------------------------
   Andaime de protótipo: o seletor de estados do rodapé NÃO é parte da
   proposta. Existe para revisar os cinco estados sem back-end.
------------------------------------------------------------------ */
type Estado = 'normal' | 'unico' | 'carregando' | 'vazio' | 'erro'
const estado = ref<Estado>('normal')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'normal', rotulo: 'Vários workspaces' },
  { valor: 'unico', rotulo: 'Só um (caso do chamado)' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'vazio', rotulo: 'Nenhum' },
  { valor: 'erro', rotulo: 'Erro' },
]

const base = computed<Workspace[]>(() => {
  if (estado.value === 'unico') return workspaceUnico
  if (estado.value === 'vazio') return []
  return workspaces
})

/* ---------------------------- estado da tela ---------------------------- */
const busca = ref('')
const aba = ref('todos')
/** Card é o padrão do produto hoje. Lista é alternativa, nunca substituição. */
const visual = ref<'cards' | 'lista'>('cards')
const convitesRecusados = ref<string[]>([])
const convitesAceitos = ref<string[]>([])
const favoritados = ref<string[]>([])

const visiveis = computed(() => base.value.filter(w => !convitesRecusados.value.includes(w.id)))

const pendentes = computed(() =>
  visiveis.value.filter(w => w.convitePendente && !convitesAceitos.value.includes(w.id)))

const disponiveis = computed(() =>
  visiveis.value.filter(w => !w.convitePendente || convitesAceitos.value.includes(w.id)))

function ehFavorito(w: Workspace) {
  return favoritados.value.includes(w.id) ? !w.favorito : w.favorito
}

const ultimo = computed(() =>
  [...disponiveis.value]
    .filter(w => w.ultimoAcessoMin !== null)
    .sort((a, b) => (a.ultimoAcessoMin ?? 0) - (b.ultimoAcessoMin ?? 0))[0])

const listados = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  let lista = disponiveis.value.filter(w => w.id !== ultimo.value?.id)

  if (aba.value === 'favoritos') lista = lista.filter(w => ehFavorito(w))
  if (aba.value === 'recentes') lista = lista.filter(w => w.ultimoAcessoMin !== null)
  if (termo) {
    lista = lista.filter(w =>
      w.nome.toLowerCase().includes(termo) || w.referencia.includes(termo))
  }
  return lista.sort((a, b) => (a.ultimoAcessoMin ?? 9e9) - (b.ultimoAcessoMin ?? 9e9))
})

const abas = computed(() => [
  { label: `Todos (${disponiveis.value.length})`, value: 'todos' },
  { label: `Favoritos (${disponiveis.value.filter(w => ehFavorito(w)).length})`, value: 'favoritos' },
  { label: `Recentes (${disponiveis.value.filter(w => w.ultimoAcessoMin !== null).length})`, value: 'recentes' },
])

/* ---------------------------- ações (maquete) ---------------------------- */
const entrando = ref<string | null>(null)

function entrar(w: Workspace) {
  entrando.value = w.id
  setTimeout(() => {
    entrando.value = null
    toast.add({
      title: `Entrando em ${w.nome}`,
      description: 'No produto, a pessoa já estaria dentro do workspace.',
      icon: 'i-lucide-log-in',
      color: 'primary',
    })
  }, 650)
}

function alternarFavorito(w: Workspace) {
  const i = favoritados.value.indexOf(w.id)
  if (i === -1) favoritados.value.push(w.id)
  else favoritados.value.splice(i, 1)
}

function aceitar(w: Workspace) {
  convitesAceitos.value.push(w.id)
  toast.add({ title: `Convite de ${w.nome} aceito`, icon: 'i-lucide-check', color: 'success' })
}

function recusar(w: Workspace) {
  convitesRecusados.value.push(w.id)
  toast.add({ title: `Convite de ${w.nome} recusado`, icon: 'i-lucide-x', color: 'neutral' })
}

function tentarDeNovo() {
  estado.value = 'carregando'
  setTimeout(() => (estado.value = 'normal'), 900)
}

/* ------------------- criação: mesma tela, em camada ------------------- */
const criando = ref(false)
type PassoCriar = 'intencao' | 'desviado' | 'formulario'
const passo = ref<PassoCriar>('intencao')
const form = reactive({ nome: '', referencia: '', descricao: '', icone: 'i-lucide-building-2' })
const icones = [
  'i-lucide-building-2', 'i-lucide-users', 'i-lucide-truck',
  'i-lucide-scale', 'i-lucide-calculator', 'i-lucide-database',
]

function abrirCriacao() {
  passo.value = 'intencao'
  Object.assign(form, { nome: '', referencia: '', descricao: '', icone: 'i-lucide-building-2' })
  criando.value = true
}

watch(() => form.nome, (nome) => {
  form.referencia = nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
})

const pareceChamado = computed(() => {
  const n = form.nome.toLowerCase()
  const pistas = [
    'preciso', 'solicito', 'solicitação', 'solicitacao', 'chamado', 'pedido',
    'favor', 'urgente', 'não consigo', 'nao consigo', 'erro', 'problema',
    'acesso', 'ajuda', 'reembolso', 'férias', 'ferias', 'atestado',
  ]
  return n.length > 12 && pistas.some(p => n.includes(p))
})

const referenciaJaExiste = computed(() =>
  workspaces.some(w => w.referencia === form.referencia && form.referencia.length > 2))

const podeCriar = computed(() => form.nome.trim().length >= 3 && !referenciaJaExiste.value)

function criar() {
  criando.value = false
  toast.add({
    title: `Workspace "${form.nome}" criado`,
    description: 'No produto, a pessoa entraria agora num espaço vazio, só com ela dentro.',
    icon: 'i-lucide-check',
    color: 'success',
  })
}
</script>

<template>
  <div class="min-h-screen bg-default pb-28">
    <header class="border-b border-default bg-elevated/50 backdrop-blur">
      <UContainer class="flex h-14 items-center justify-between">
        <span class="text-sm font-medium text-muted">ENSPACE</span>
        <div class="flex items-center gap-3">
          <UButton icon="i-lucide-life-buoy" label="Suporte" color="neutral" variant="ghost" size="sm" />
          <UAvatar :text="usuario.iniciais" size="sm" />
        </div>
      </UContainer>
    </header>

    <UContainer class="max-w-5xl py-10 sm:py-14">
      <!-- 1. A tela diz o que é — e o atalho de criar continua no topo ---- -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="animate-[entrada_0.4s_ease-out_both]">
          <p class="text-sm text-muted">
            Olá, {{ usuario.nome.split(' ')[0] }}
          </p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
            Escolha um workspace para entrar
          </h1>
          <p class="mt-2 max-w-2xl text-muted">
            Workspace é o espaço da sua empresa dentro do ENSPACE. Seu trabalho acontece
            <strong class="text-highlighted">dentro</strong> de um deles — esta tela só escolhe
            por qual porta entrar.
          </p>

          <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <li
              v-for="(exemplo, i) in exemplosDoQueSeFazDentro"
              :key="exemplo.texto"
              class="flex animate-[entrada_0.4s_ease-out_both] items-center gap-2 text-sm text-muted"
              :style="{ animationDelay: `${120 + i * 80}ms` }"
            >
              <UIcon :name="exemplo.icone" class="size-4 text-primary" />
              {{ exemplo.texto }}
            </li>
          </ul>
        </div>

        <!-- Atalho no topo, como sempre esteve. Secundário no peso, não no
             endereço: quem precisa, encontra onde já procurava. -->
        <UTooltip text="Abre um espaço vazio. Não é aqui que se abre chamado.">
          <UButton
            label="Criar workspace"
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            class="shrink-0 animate-[entrada_0.4s_ease-out_both] transition-transform hover:-translate-y-0.5"
            @click="abrirCriacao"
          />
        </UTooltip>
      </div>

      <!-- Erro -->
      <UAlert
        v-if="estado === 'erro'"
        class="animate-[entrada_0.3s_ease-out_both]"
        icon="i-lucide-triangle-alert"
        color="error"
        variant="subtle"
        title="Não foi possível carregar seus workspaces"
        description="A conexão falhou. Seus workspaces continuam lá — é só tentar de novo."
        :actions="[{ label: 'Tentar de novo', color: 'error', variant: 'solid', onClick: tentarDeNovo }]"
      />

      <!-- Carregando -->
      <div v-else-if="estado === 'carregando'" class="space-y-4">
        <USkeleton class="h-28 w-full rounded-xl" />
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <USkeleton v-for="i in 6" :key="i" class="h-36 rounded-xl" />
        </div>
      </div>

      <template v-else>
        <!-- 2. Convite pendente vira ação -->
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-200 ease-in absolute"
          leave-to-class="opacity-0 scale-95"
        >
          <UAlert
            v-for="convite in pendentes"
            :key="convite.id"
            class="mb-4"
            icon="i-lucide-mail-open"
            color="secondary"
            variant="subtle"
            :title="`${convite.convidadoPor} convidou você para ${convite.nome}`"
            description="Aceite para poder entrar neste workspace."
            :actions="[
              { label: 'Aceitar convite', color: 'secondary', variant: 'solid', onClick: () => aceitar(convite) },
              { label: 'Recusar', color: 'neutral', variant: 'ghost', onClick: () => recusar(convite) },
            ]"
          />
        </TransitionGroup>

        <!-- 3. Continue de onde parou -->
        <section
          v-if="ultimo"
          class="mb-8 animate-[entrada_0.45s_ease-out_both] rounded-xl border border-default bg-elevated/40 p-5 transition-shadow hover:shadow-md sm:p-6"
          style="animation-delay: 80ms"
        >
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-dimmed">
            {{ estado === 'unico' ? 'Seu workspace' : 'Continue de onde você parou' }}
          </p>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 items-center gap-4">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-105">
                <UIcon :name="ultimo.icone" class="size-6 text-primary" />
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-lg font-semibold text-highlighted">
                  {{ ultimo.nome }}
                </h2>
                <p class="truncate text-sm text-muted">
                  {{ ultimo.descricao || tempoRelativo(ultimo.ultimoAcessoMin) }}
                </p>
              </div>
            </div>
            <UButton
              :label="`Entrar em ${ultimo.nome}`"
              icon="i-lucide-log-in"
              size="lg"
              :loading="entrando === ultimo.id"
              class="shrink-0 justify-center transition-transform hover:scale-[1.02]"
              @click="entrar(ultimo)"
            />
          </div>
        </section>

        <!-- 4. Filtros, busca e o alternador card / lista -->
        <section v-if="listados.length || busca">
          <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <UTabs v-model="aba" :items="abas" :content="false" color="primary" variant="link" size="sm" />

            <div class="flex items-center gap-2">
              <UInput
                v-model="busca"
                icon="i-lucide-search"
                placeholder="Buscar workspace"
                size="sm"
                class="w-full sm:w-56"
              />
              <!-- Card é o padrão. Lista é opção — e a troca é visível. -->
              <div class="flex shrink-0 rounded-md border border-default p-0.5">
                <UButton
                  icon="i-lucide-layout-grid"
                  size="xs"
                  square
                  :color="visual === 'cards' ? 'primary' : 'neutral'"
                  :variant="visual === 'cards' ? 'soft' : 'ghost'"
                  aria-label="Ver em cards"
                  @click="visual = 'cards'"
                />
                <UButton
                  icon="i-lucide-list"
                  size="xs"
                  square
                  :color="visual === 'lista' ? 'primary' : 'neutral'"
                  :variant="visual === 'lista' ? 'soft' : 'ghost'"
                  aria-label="Ver em lista"
                  @click="visual = 'lista'"
                />
              </div>
            </div>
          </div>

          <!-- CARDS (padrão) -->
          <TransitionGroup
            v-if="visual === 'cards'"
            tag="div"
            class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-3"
            leave-active-class="transition duration-150 ease-in absolute"
            leave-to-class="opacity-0 scale-95"
            move-class="transition-transform duration-300"
          >
            <article
              v-for="(w, i) in listados"
              :key="w.id"
              class="group flex animate-[entrada_0.4s_ease-out_both] flex-col rounded-xl border border-default bg-elevated/20 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/5"
              :style="{ animationDelay: `${i * 55}ms` }"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex size-10 items-center justify-center rounded-lg bg-elevated transition-colors group-hover:bg-primary/10">
                  <UIcon :name="w.icone" class="size-5 text-muted transition-colors group-hover:text-primary" />
                </div>
                <UButton
                  :icon="ehFavorito(w) ? 'i-lucide-star' : 'i-lucide-star'"
                  size="xs"
                  square
                  variant="ghost"
                  :color="ehFavorito(w) ? 'warning' : 'neutral'"
                  :class="ehFavorito(w) ? 'opacity-100' : 'opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100'"
                  :aria-label="ehFavorito(w) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                  @click="alternarFavorito(w)"
                />
              </div>

              <h3 class="mt-3 line-clamp-2 font-medium text-highlighted">
                {{ w.nome }}
              </h3>
              <p class="mt-1 line-clamp-2 text-sm text-muted">
                {{ w.descricao || `${w.membros} pessoas` }}
              </p>
              <p class="mt-1 text-xs text-dimmed">
                {{ tempoRelativo(w.ultimoAcessoMin) }}
              </p>

              <div class="mt-4 flex items-center justify-between gap-2 pt-1">
                <UBadge :label="w.papel" :color="corDoPapel[w.papel]" variant="subtle" size="sm" />
                <UButton
                  label="Entrar"
                  icon="i-lucide-log-in"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  :loading="entrando === w.id"
                  class="transition-colors group-hover:bg-primary group-hover:text-inverted"
                  @click="entrar(w)"
                />
              </div>
            </article>
          </TransitionGroup>

          <!-- LISTA (alternativa) -->
          <TransitionGroup
            v-else
            tag="ul"
            class="divide-y divide-default overflow-hidden rounded-xl border border-default"
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-x-2"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="opacity-0"
            move-class="transition-transform duration-300"
          >
            <li
              v-for="(w, i) in listados"
              :key="w.id"
              class="group flex animate-[entrada_0.3s_ease-out_both] items-center gap-4 px-4 py-3 transition-colors hover:bg-elevated/60"
              :style="{ animationDelay: `${i * 35}ms` }"
            >
              <div class="flex size-9 shrink-0 items-center justify-center rounded-md bg-elevated transition-colors group-hover:bg-primary/10">
                <UIcon :name="w.icone" class="size-4.5 text-muted transition-colors group-hover:text-primary" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate font-medium text-highlighted">{{ w.nome }}</span>
                  <UIcon v-if="ehFavorito(w)" name="i-lucide-star" class="size-3.5 shrink-0 text-warning" />
                </div>
                <p class="truncate text-sm text-muted">
                  {{ w.descricao || `${w.membros} pessoas` }} · {{ tempoRelativo(w.ultimoAcessoMin) }}
                </p>
              </div>
              <UBadge
                :label="w.papel"
                :color="corDoPapel[w.papel]"
                variant="subtle"
                size="sm"
                class="hidden shrink-0 sm:inline-flex"
              />
              <UButton
                label="Entrar"
                size="sm"
                color="neutral"
                variant="subtle"
                :loading="entrando === w.id"
                class="shrink-0 transition-colors group-hover:bg-primary group-hover:text-inverted"
                @click="entrar(w)"
              />
            </li>
          </TransitionGroup>

          <UEmpty
            v-if="!listados.length && busca"
            class="animate-[entrada_0.3s_ease-out_both]"
            icon="i-lucide-search-x"
            :title="`Nenhum workspace com &quot;${busca}&quot;`"
            description="Confira o nome, ou peça acesso a quem administra o workspace na sua empresa."
          />
        </section>

        <!-- Nenhum workspace -->
        <UEmpty
          v-if="estado === 'vazio' && !pendentes.length"
          class="animate-[entrada_0.3s_ease-out_both]"
          icon="i-lucide-door-closed"
          title="Você ainda não faz parte de nenhum workspace"
          description="Quem administra o ENSPACE na sua empresa precisa convidar você. Se recebeu um convite por e-mail, abra o link de lá."
          :actions="[{ label: 'Criar um workspace', color: 'neutral', variant: 'outline', onClick: abrirCriacao }]"
        />
      </template>
    </UContainer>

    <!-- 5. Criação: mesma tela, em camada. A pergunta que intercepta o engano. -->
    <UModal v-model:open="criando" :title="passo === 'formulario' ? 'Criar um workspace' : 'O que você quer fazer?'">
      <template #body>
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-x-3"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 -translate-x-3"
        >
          <!-- Passo 1 — a pergunta que o produto não faz hoje -->
          <div v-if="passo === 'intencao'" key="intencao" class="space-y-3">
            <p class="text-muted">
              Criar um workspace é raro — quase ninguém precisa. Vamos confirmar antes.
            </p>
            <button
              type="button"
              class="w-full rounded-lg border border-default p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-elevated/50"
              @click="passo = 'desviado'"
            >
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-life-buoy" class="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <span class="block font-medium text-highlighted">
                    Abrir um chamado, pedir algo ou enviar um documento
                  </span>
                  <span class="mt-1 block text-sm text-muted">
                    Para o RH, o jurídico, o TI ou qualquer área da minha empresa.
                  </span>
                </div>
              </div>
            </button>
            <button
              type="button"
              class="w-full rounded-lg border border-default p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-elevated/50"
              @click="passo = 'formulario'"
            >
              <div class="flex items-start gap-3">
                <UIcon name="i-lucide-layout-grid" class="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <span class="block font-medium text-highlighted">
                    Criar um espaço novo, vazio, para a minha equipe
                  </span>
                  <span class="mt-1 block text-sm text-muted">
                    Com membros, processos e configuração próprios, separado dos outros.
                  </span>
                </div>
              </div>
            </button>
          </div>

          <!-- Passo 1b — quem errou o caminho é devolvido, não bloqueado -->
          <div v-else-if="passo === 'desviado'" key="desviado">
            <UAlert
              icon="i-lucide-map-pin"
              color="secondary"
              variant="subtle"
              title="Então o caminho é outro — e é mais curto"
              description="Chamados, pedidos e documentos acontecem dentro do workspace da sua empresa. Entre nele e procure por Chamados no menu lateral."
            />
            <div class="mt-5 flex flex-wrap gap-3">
              <UButton label="Escolher meu workspace" icon="i-lucide-log-in" @click="criando = false" />
              <UButton
                label="Não é isso, quero mesmo criar"
                color="neutral"
                variant="ghost"
                @click="passo = 'formulario'"
              />
            </div>
          </div>

          <!-- Passo 2 — o formulário, com a consequência escrita -->
          <div v-else key="formulario" class="space-y-5">
            <p class="text-muted">
              Ele nasce vazio e só com você dentro. Depois você convida as pessoas.
            </p>

            <UFormField
              label="Nome do espaço"
              description="Como a equipe vai reconhecer esse espaço na lista. Ex.: Jurídico Aurora, Vértice Log."
              required
            >
              <UInput v-model="form.nome" placeholder="Nome da empresa, área ou equipe" class="w-full" />
            </UFormField>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              leave-active-class="transition duration-150 ease-in"
              leave-to-class="opacity-0"
            >
              <UAlert
                v-if="pareceChamado"
                icon="i-lucide-triangle-alert"
                color="warning"
                variant="subtle"
                title="Isso parece o assunto de um chamado, não o nome de um espaço"
                description="Se a intenção é pedir alguma coisa, o caminho é entrar no workspace da sua empresa."
                :actions="[{ label: 'Me leva pra lá', color: 'warning', variant: 'solid', onClick: () => (passo = 'desviado') }]"
              />
            </Transition>

            <UFormField
              label="Referência"
              description="Identificador usado na URL. Preenchido a partir do nome — dá para mudar."
              :error="referenciaJaExiste ? 'Já existe um workspace com essa referência.' : undefined"
            >
              <UInput v-model="form.referencia" class="w-full font-mono text-sm" />
            </UFormField>

            <UFormField
              label="Descrição"
              description="Uma frase dizendo para que serve. É o que aparece no card — sem ela, ele fica mudo."
            >
              <UInput v-model="form.descricao" placeholder="Ex.: Chamados, RH e jurídico do Grupo Aurora" class="w-full" />
            </UFormField>

            <UFormField label="Ícone">
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="ic in icones"
                  :key="ic"
                  :icon="ic"
                  square
                  class="transition-transform hover:scale-110"
                  :color="form.icone === ic ? 'primary' : 'neutral'"
                  :variant="form.icone === ic ? 'solid' : 'subtle'"
                  @click="form.icone = ic"
                />
              </div>
            </UFormField>

            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-dimmed">
                Como vai aparecer na sua lista
              </p>
              <div class="rounded-xl border border-default bg-elevated/20 p-4 transition-all">
                <div class="flex size-10 items-center justify-center rounded-lg bg-elevated">
                  <UIcon :name="form.icone" class="size-5 text-muted" />
                </div>
                <h3 class="mt-3 font-medium text-highlighted">
                  {{ form.nome || 'Nome do workspace' }}
                </h3>
                <p class="mt-1 text-sm text-muted">
                  {{ form.descricao || 'Sem descrição' }}
                </p>
                <p class="mt-1 text-xs text-dimmed">
                  Você ainda não entrou aqui
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </template>

      <template v-if="passo === 'formulario'" #footer>
        <div class="flex w-full justify-end gap-3">
          <UButton label="Cancelar" color="neutral" variant="ghost" @click="criando = false" />
          <UButton label="Criar workspace" icon="i-lucide-check" :disabled="!podeCriar" @click="criar" />
        </div>
      </template>
    </UModal>

    <!-- ANDAIME DE PROTÓTIPO — não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <UContainer class="flex flex-wrap items-center gap-2 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-dimmed">
          Protótipo · estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />
      </UContainer>
    </div>
  </div>
</template>
