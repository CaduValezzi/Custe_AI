export interface LogoProps {
    /*    
    Tamanho do logo, caso seja small, o logo terá um height de 5rem e width de 6rem, caso seja medium, o logo terá um height de 10rem e width de 12rem, caso seja large, o logo terá um height de 15rem e width de 18rem
    */
    size?: 'small' | 'medium' | 'large';
    /*    
    Tamanho da altura do logo, caso seja definido, irá sobrescrever o tamanho definido pelo size, caso contrário, o tamanho do logo será definido pelo size
    */
    sizeHeight?: string ;
    /*    
    Tamanho da largura do logo, caso seja definido, irá sobrescrever o tamanho definido pelo size, caso contrário, o tamanho do logo será definido pelo size
    */
    sizeWidth?: string ;
    /*  
    Alt do logo
    */
    alt?: string;
    /*  
    Fonte do logo
    */
    src?: string;
}   