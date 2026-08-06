import { type ReactNode } from 'react';

export interface SectionProps {
    /* 
    Conteudo da section 
    */
    children: ReactNode;
    /*
    ID da section, utilizado para navegação interna (ex: href="#id")
    */
    id?: string;
    /*
    Classe CSS adicional para customização de estilos
    */
    className?: string;
}