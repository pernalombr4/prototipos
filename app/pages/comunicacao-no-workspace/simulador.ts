/**
 * ANDAIME DE PROTÓTIPO: o app de fora que o botão abre.
 *
 * No produto, o atalho só abre um link (`mailto:`, `https://wa.me/...`,
 * `sms:`, a página pública do formulário, o login da Microsoft) e o resto
 * acontece fora do ENSPACE. Aqui a janela `_AppExterno.vue` simula esse app,
 * para o comportamento de cada botão ficar previsível. Não é proposta de tela.
 */
export type AppExterno =
  | { tipo: 'whatsapp' | 'sms', url: string, nome: string | null, telefone: string | null, texto: string }
  | { tipo: 'email', url: string, para: string[], cc: string[], assunto: string, corpo: string }
  | { tipo: 'formulario', url: string, formularioId: string }
  | { tipo: 'outlook', url: string }

export function useAppExterno() {
  const app = useState<AppExterno | null>('cnw-app-externo', () => null)

  function abrirApp(a: AppExterno) {
    app.value = structuredClone(a)
  }

  function fechar() {
    app.value = null
  }

  return { app, abrirApp, fechar }
}
