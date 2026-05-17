import { type ReactNode } from "react";

export interface TitleProps {
    /** 
     * Conteúdo do título
    */
    children: ReactNode;
    /** 
     * Classe do título, para customização de estilos
    */
    className?: string;
}