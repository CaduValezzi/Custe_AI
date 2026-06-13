import { type ReactNode } from "react";

export interface FeaturesProps{
    /** 
     * Conteúdo do titulo do item da lista
    */
    title?: string;
    /** 
     * Conteúdos da lista
    */
    children: ReactNode;
    /** 
     * Numero inicial da lista
    */
    start?: number;
}