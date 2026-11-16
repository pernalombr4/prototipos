/**
 * A copy da Central de Agentes de IA nos 3 idiomas do ENSPACE.
 * O português (`textos-pt.ts`) é a fonte; inglês e espanhol têm a mesma forma.
 */
import type { Idioma } from '~/composables/useIdioma'
import { pt } from './textos-pt'
import { en } from './textos-en'
import { es } from './textos-es'

export type { Textos } from './textos-pt'

export const textos: Record<Idioma, typeof pt> = { 'pt-BR': pt, en, es }
