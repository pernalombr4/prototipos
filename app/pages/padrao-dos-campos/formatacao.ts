/**
 * A saída formatada, em um lugar só.
 *
 * Esta é a peça que faz a proposta funcionar de verdade: célula, formulário e
 * cru usam a MESMA função para virar texto. Se o número aparece com duas casas
 * na tabela, ele aparece com duas casas na sidebar e duas casas no relatório,
 * porque o cálculo é um só.
 *
 * É o espelho, em front-end, do que o `cFormat` do campo faz no back-end. Onde
 * o `cFormat` do ENSPACE tem uma chave, aqui existe o comportamento dela.
 *
 * 100% local: nenhuma chamada de rede, nenhuma dependência além do Intl do
 * próprio navegador.
 */
import type { Campo } from './campos'
import type { Celula } from './relatorio'
import { matrizDeDados } from './mocks'

/** O idioma escolhido no andaime vira o locale do Intl. */
export function localeDe(idioma: string): string {
  return idioma === 'en' ? 'en-US' : idioma === 'es' ? 'es-ES' : 'pt-BR'
}

/** Vazio de verdade: null, undefined, string em branco, lista e objeto vazios. */
export function estaVazio(valor: unknown): boolean {
  if (valor === null || valor === undefined) return true
  if (typeof valor === 'string') return valor.trim() === ''
  if (Array.isArray(valor)) return valor.length === 0
  if (typeof valor === 'object') return Object.keys(valor as object).length === 0
  return false
}

/**
 * A máscara do documento, do jeito que o develop desenha: `999.999.999-99` no
 * CPF e `99.999.999/9999-99` no CNPJ. O que decide é o tamanho, porque é o que
 * o produto tem na mão quando o valor chega.
 */
export function mascararDocumento(documento: string): string {
  const d = (documento ?? '').replace(/\D/g, '')
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  return documento ?? ''
}

/** O rótulo de uma opção a partir do value gravado. */
export function rotuloDaOpcao(
  opcoes: readonly { value: string, label: string }[] | undefined,
  value: string,
): string {
  return opcoes?.find(o => o.value === value)?.label ?? value
}

/** A cor da opção, para o selo. */
export function corDaOpcao(
  opcoes: readonly { value: string, label: string, cor?: string }[] | undefined,
  value: string,
): string {
  return opcoes?.find(o => o.value === value)?.cor ?? 'neutral'
}

/** Bytes em texto curto, que é o `cFormat.type: "byte"`. */
export function formatarBytes(bytes: number, idioma: string): string {
  const unidades = ['B', 'kB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < unidades.length - 1) {
    n /= 1024
    i++
  }
  const casas = i === 0 ? 0 : 1
  return `${new Intl.NumberFormat(localeDe(idioma), { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(n)} ${unidades[i]}`
}

/** A data curta da célula. É o `cFormat.d_style: "short"`. */
export function formatarDataCurta(iso: string, idioma: string): string {
  return new Intl.DateTimeFormat(localeDe(idioma), { dateStyle: 'short' }).format(new Date(iso))
}

/** A data por extenso do cru. É o `cFormat.d_style: "medium"`. */
export function formatarDataMedia(iso: string, idioma: string): string {
  return new Intl.DateTimeFormat(localeDe(idioma), { dateStyle: 'medium' }).format(new Date(iso))
}

/** Data e hora, para o histórico da sidebar. */
export function formatarDataHora(valor: string | Date, idioma: string): string {
  const d = valor instanceof Date ? valor : new Date(valor)
  return new Intl.DateTimeFormat(localeDe(idioma), { dateStyle: 'short', timeStyle: 'medium' }).format(d)
}

/**
 * "em 3 dias", "há 2 meses". O relativo só entra quando ajuda, e a regra de
 * quando ele ajuda está no catálogo: os próximos sete dias.
 */
export function relativoEmDias(iso: string, idioma: string): string | null {
  const alvo = new Date(iso)
  const hoje = new Date('2026-09-22T12:00:00.000Z')
  const dias = Math.round((alvo.getTime() - hoje.getTime()) / 86400000)
  if (dias < 0 || dias > 7) return null
  return new Intl.RelativeTimeFormat(localeDe(idioma), { numeric: 'auto' }).format(dias, 'day')
}

/** Data no passado, que a célula marca em vermelho. */
export function estaVencida(iso: string): boolean {
  return new Date(iso).getTime() < new Date('2026-09-22T12:00:00.000Z').getTime()
}

/** O endereço em uma linha. É o `nestedConfig.displayString` resolvido. */
export function enderecoEmUmaLinha(e: Record<string, string> | null): string {
  if (!e) return ''
  const linha1 = [e.street, e.number].filter(Boolean).join(', ')
  const resto = [e.complement, e.neighborhood].filter(Boolean).join(' ')
  const cidade = [e.city, e.state].filter(Boolean).join('/')
  return [linha1, resto, e.zip, cidade].filter(Boolean).join(' ')
}

/**
 * O caminho de uma seleção em árvore, em rótulos.
 *
 * O valor gravado é o caminho técnico (`predial.eletrica`). O que a pessoa lê
 * é o rótulo de cada nível, e é o `options[].children[]` do campo que tem os
 * dois lados.
 */
export function caminhoDaArvore(
  valor: string,
  opcoes: readonly { value: string, label: string, children?: readonly { value: string, label: string }[] }[] | undefined,
): string {
  if (!opcoes?.length) return valor
  const partes: string[] = []
  let restantes: readonly { value: string, label: string, children?: readonly { value: string, label: string }[] }[] | undefined = opcoes
  for (const pedaco of valor.split('.')) {
    const alvo: string = partes.length
      ? `${valor.split('.').slice(0, partes.length).join('.')}.${pedaco}`
      : pedaco
    const no = restantes?.find(o => o.value === alvo)
    if (!no) break
    partes.push(no.label)
    restantes = no.children
  }
  return partes.length ? partes.join(' / ') : valor
}

/**
 * O valor monetário foi corrigido? É quando `value` e `originalValue`
 * divergem. O produto guarda os dois de propósito.
 */
export function foiCorrigido(valor: unknown): boolean {
  const v = valor as { value?: number, originalValue?: number } | null
  if (!v || typeof v !== 'object') return false
  return v.originalValue !== undefined && v.value !== undefined && v.originalValue !== v.value
}

/** O valor original de uma moeda corrigida, já formatado. */
export function moedaOriginalFormatada(valor: unknown, locale: string): string {
  const v = valor as { currency?: string, originalValue?: number } | null
  if (!v || typeof v !== 'object' || v.originalValue === undefined) return ''
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: v.currency ?? 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(v.originalValue)
}

/** O texto rico sem as tags, que é o que a célula mostra. */
export function semTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    /* A troca de tag por espaço deixa um branco antes da pontuação
       ("ressalva : o quadro"). Aqui ele sai. */
    .replace(/\s+([,.;:!?)])/g, '$1')
    .replace(/(\()\s+/g, '$1')
    .trim()
}

/**
 * A saída formatada de qualquer campo, em texto puro.
 *
 * É esta função que o relatório .xlsx usa, e é a mesma que as células e o
 * resumo usam para o tooltip. Quem renderiza selo, avatar e miniatura é o
 * componente; o texto por trás deles nasce aqui.
 */
export function saidaFormatada(
  campo: Campo,
  valor: unknown,
  idioma: string,
  opcoes?: Record<string, readonly { value: string, label: string, cor?: string }[]>,
  separador = ' | ',
): string {
  if (estaVazio(valor)) return ''

  const lista = opcoes?.[campo.refId]

  switch (campo.tipo) {
    case 'EnHtml':
      return semTags(valor as string)

    case 'EnlNumber':
      /*
       * A localidade é do CAMPO (`cFormat.locale`), não de quem lê. Trocar o
       * idioma da interface não muda o formato do número: isso é configuração
       * do campo, em "Interface e Formatação". Medido no develop.
       */
      return new Intl.NumberFormat(campo.localeDoCampo ?? localeDe(idioma), {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(valor as number)

    case 'EnCurrency': {
      /*
       * A MOEDA vem do VALOR, não da localidade. O produto guarda
       * `{ currency, value, originalValue }` e o seletor de moeda fica no
       * próprio campo, com 179 opções. `originalValue` é a âncora da correção
       * monetária: `value` é o corrigido.
       */
      const v = valor as { currency?: string, value?: number, originalValue?: number } | number
      if (typeof v === 'number') {
        /* dado antigo, gravado como número puro, sem moeda */
        return new Intl.NumberFormat(campo.localeDoCampo ?? localeDe(idioma), {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(v)
      }
      return new Intl.NumberFormat(campo.localeDoCampo ?? localeDe(idioma), {
        style: 'currency',
        currency: v.currency ?? 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(v.value ?? 0)
    }

    case 'EnlDropdown':
    case 'radioButton':
      return rotuloDaOpcao(lista, valor as string)

    case 'EnTreeSelect':
      /* O caminho gravado ("predial.eletrica") vira os rótulos da árvore, do
         pai até a folha. Derivar do value perderia o acento do rótulo. */
      return caminhoDaArvore(valor as string, lista as never)

    case 'multiSelect':
    case 'checkbox':
    case 'EnlCheckbox':
      return (valor as string[]).map(v => rotuloDaOpcao(lista, v)).join(separador)

    case 'EnlChips':
      return (valor as string[]).join(separador)

    case 'inputSwitch':
      return valor
        ? (idioma === 'en' ? 'Yes' : idioma === 'es' ? 'Sí' : 'Sim')
        : (idioma === 'en' ? 'No' : 'Não')

    case 'EnlCalendar':
      return formatarDataMedia(valor as string, idioma)

    case 'EnRel': {
      const v = valor as { display: string, reference: string }
      return v.display?.trim() ? v.display : v.reference
    }

    case 'EnRelMulti':
      return (valor as { display: string, reference: string }[])
        .map(v => (v.display?.trim() ? v.display : v.reference))
        .join(separador)

    case 'EnPerson': {
      /*
       * Pessoa/Empresa é bloco, não pessoa do workspace: o que sai é o nome de
       * exibição (nome fantasia na PJ, nome na PF, e a razão social quando não
       * há fantasia) com o documento mascarado ao lado. Medido na tela em
       * 23/09/2026, ver o catálogo.
       */
      const v = valor as {
        person_type?: string
        name?: string
        cpf?: string
        cnpj?: string
        razao_social?: string
        nome_fantasia?: string
      }
      const nome = v.nome_fantasia?.trim() || v.name?.trim() || v.razao_social?.trim() || ''
      const doc = mascararDocumento((v.person_type === 'PJ' ? v.cnpj : v.cpf) ?? '')
      return [nome, doc].filter(Boolean).join(' · ')
    }

    case 'EnAddress':
      return enderecoEmUmaLinha(valor as Record<string, string>)

    case 'uploadFile':
    case 'uploadImage':
    case 'EnPDF':
    case 'EnOnlyoffice': {
      /*
       * Anexo é LISTA: o campo aceita vários arquivos, na ordem que a pessoa
       * definir. Dado antigo, gravado como objeto único, entra como lista de
       * um e sai igual.
       */
      const itens = (Array.isArray(valor) ? valor : [valor]) as { filename: string, size?: number }[]
      return itens
        .map(a => (a.size ? `${a.filename} (${formatarBytes(a.size, idioma)})` : a.filename))
        .join(separador)
    }

    case 'EnESign': {
      const v = valor as { signer: string, signedAt: string }
      return `${v.signer}, ${formatarDataMedia(v.signedAt, idioma)}`
    }

    case 'EnRepeater': {
      const linhas = valor as Record<string, unknown>[]
      const primeira = linhas[0]
      const resumo = primeira ? String(Object.values(primeira)[0]) : ''
      return linhas.length > 1 ? `${resumo} (+${linhas.length - 1})` : resumo
    }

    case 'group': {
      const v = valor as Record<string, string>
      return Object.values(v).filter(Boolean).join(separador)
    }

    /*
     * A matriz formatada é `pergunta: resposta` por linha respondida, que é o
     * que o develop mostra no quadro "Perguntas" (medido em tela em
     * 23/09/2026). A ordem é a da configuração das linhas.
     *
     * O develop imprime o índice da coluna entre colchetes, `Conforme [1]`.
     * Não vai: o número é da configuração, não da resposta.
     */
    case 'matrizDeDados': {
      const respostas = (valor as Record<string, string>) ?? {}
      return matrizDeDados.linhas
        .filter(l => respostas[l.value])
        .map((l) => {
          const col = matrizDeDados.colunas.find(c => c.value === respostas[l.value])
          return `${l.label}: ${col?.label ?? respostas[l.value]}`
        })
        .join(separador)
    }

    /*
     * Anotações e Chat são conversa, e a saída formatada de uma conversa é a
     * ÚLTIMA mensagem com o autor: é o que cabe numa célula e é o que o
     * develop mostra na coluna.
     */
    case 'EnChats':
    case 'EnNotes': {
      const msgs = (Array.isArray(valor) ? valor : []) as { author: string, text: string }[]
      const ultima = msgs[msgs.length - 1]
      return ultima ? `${ultima.author}: ${ultima.text}` : ''
    }

    default:
      return String(valor)
  }
}

/**
 * O valor bruto, como a API devolve, em JSON legível. É o que a ficha mostra
 * na linha "Formato de saída" quando existe um item selecionado.
 */
export function saidaCrua(valor: unknown): string {
  if (valor === undefined) return 'undefined'
  return JSON.stringify(valor, null, 2)
}

/* -------------------------------------------------------------------------- *
 *                        A CÉLULA DO RELATÓRIO .XLSX                         *
 * -------------------------------------------------------------------------- */

/**
 * O tipo de célula que cada campo vira na exportação.
 *
 * A regra é a da seção "Padronização de Formatos de Exportação em Excel" do
 * `Melhoria dos campos.docx`, e ela está certa: número e moeda vão como
 * número, data vai como serial de data, arquivo vai como hyperlink, seleção
 * múltipla vai separada por vírgula e espaço, e comentário não vai.
 *
 * O texto continua saindo do `saidaFormatada`, então a coluna de texto do
 * .xlsx é a mesma string que a tela mostra.
 */
export function celulaDeExportacao(
  campo: Campo,
  valor: unknown,
  idioma: string,
  opcoes?: Record<string, readonly { value: string, label: string, cor?: string }[]>,
): Celula {
  if (estaVazio(valor)) return ''

  switch (campo.tipo) {
    case 'EnlNumber':
      return { tipo: 'numero', valor: Number(valor) }

    case 'EnCurrency': {
      /*
       * O documento do time de produtos tem razão: se a moeda varia por linha,
       * o jeito certo é número puro numa coluna e o código ISO em outra. A
       * máscara do arquivo é uma só, e forçá-la a uma moeda mentiria sobre as
       * outras. Aqui vai o número; o código sai na coluna ao lado.
       */
      const v = valor as { currency?: string, value?: number } | number
      return { tipo: 'moeda', valor: typeof v === 'number' ? v : (v.value ?? 0) }
    }

    case 'EnlCalendar':
      /* Serial de data, para ordenar e filtrar por mês e ano no Excel. */
      return { tipo: 'data', valor: valor as string }

    case 'uploadFile':
    case 'uploadImage':
    case 'EnPDF':
    case 'EnOnlyoffice': {
      /*
       * A lista inteira não caberia num hyperlink só: o link aponta para o
       * primeiro arquivo e o texto diz quantos vêm atrás. Uma coluna por
       * arquivo seria largura variável por linha, o que a planilha não tem.
       */
      const itens = (Array.isArray(valor) ? valor : [valor]) as { filename: string, url: string }[]
      const primeiro = itens[0]
      if (!primeiro) return ''
      return {
        tipo: 'link',
        texto: itens.length > 1 ? `${primeiro.filename} (+${itens.length - 1})` : primeiro.filename,
        url: primeiro.url,
      }
    }

    case 'EnChats':
      /* Histórico de conversa não vai para a planilha. Regra do documento. */
      return ''

    case 'EnNotes':
      /*
       * Anotação, ao contrário do chat, É conteúdo do registro: vai inteira,
       * uma mensagem por linha dentro da célula.
       */
      return (Array.isArray(valor) ? valor : [])
        .map(m => `${(m as { author: string }).author}: ${(m as { text: string }).text}`)
        .join('\n')

    default:
      /* Vírgula e espaço em lista, e não a barra que a tela usa no tooltip. */
      return saidaFormatada(campo, valor, idioma, opcoes, ', ')
  }
}
