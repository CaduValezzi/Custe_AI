export interface LogoProps {
    /*
    Tamanho do logo, caso seja 'small', o logo terá um tamanho menor, caso contrário, terá um tamanho padrão
    */
    size?: string | 'logo' ;
    /*  
    Fonte do logo, caso seja 'primary', o logo terá a fonte primária, caso contrário, terá a fonte secundária
    */
    alt: string;
    src?: string;
}   