export interface PictureProps {
    /*    
    Tamanho da altura do imagem, caso seja definido, irá sobrescrever o tamanho definido pelo size, caso contrário, o tamanho do imagem será definido pelo size
    */
    sizeHeight?: string | number;
    /*    
    Tamanho da largura do imagem, caso seja definido, irá sobrescrever o tamanho definido pelo size, caso contrário, o tamanho do imagem será definido pelo size
    */
    sizeWidth?: string | number;
    /*  
    Alt do imagem
    */
    alt?: string;
    /*  
    Fonte do imagem
    */
    src?: string;
}