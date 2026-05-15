import { type ReactNode } from 'react';

export interface SectionProps {
    /* 
    Conteudo da section 
    */
    children: ReactNode;
    /*
    Cor de fundo da section, caso seja true, a section terá um fundo colorido (azul), caso contrário, terá um fundo branco
    */
    isColored?: boolean;
    /*
    ID da section, utilizado para navegação interna (ex: href="#id")
    */
    id?: string;
}