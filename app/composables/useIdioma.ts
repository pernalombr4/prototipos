/**
 * Idioma do protótipo — estado compartilhado por toda a aplicação.
 *
 * O ENSPACE fala português, inglês e espanhol. Todo protótipo daqui tem que
 * mostrar os três, porque é isso que o dev vai precisar implementar — e é
 * onde aparece o texto que estourou o botão em alemão… ou em espanhol.
 *
 * O mesmo valor alimenta o `<EnApp locale>` do enspace-sdk-ui, então os
 * componentes `En*` e o Nuxt UI trocam de idioma junto com a tela.
 */
export const idiomas = [
  { id: 'pt-BR', rotulo: 'PT', nome: 'Português' },
  { id: 'en', rotulo: 'EN', nome: 'English' },
  { id: 'es', rotulo: 'ES', nome: 'Español' },
] as const

export type Idioma = typeof idiomas[number]['id']

export function useIdioma() {
  return useState<Idioma>('idioma-do-prototipo', () => 'pt-BR')
}

/**
 * Escolhe o dicionário do idioma corrente.
 *
 * Cada protótipo tem o seu `textos.ts` com as três traduções; esta função só
 * devolve a fatia certa, de forma reativa.
 */
export function useTextos<T>(dicionario: Record<Idioma, T>) {
  const idioma = useIdioma()
  return computed(() => dicionario[idioma.value])
}
