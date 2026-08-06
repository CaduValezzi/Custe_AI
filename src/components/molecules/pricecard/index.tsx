import { Button } from "@/components/atoms/button";
import S from "./styles.module.scss"

export const PriceCard = () => {
    return (
        <div className={S.price__card}>
        <div className={S.plan__name}>Starter</div>
        <div className={S.plan__price}>Grátis</div>
        <div className={S.plan__period}>Para sempre</div>
        <div className={S.plan__divider}></div>
        <ul className={S.plan__features}>
            <li><div className={S.check}>&#10003;</div>Ate 5 APIs monitoradas</li>
            <li><div className={S.check}>&#10003;</div>Upload manual de CSV</li>
            <li><div className={S.check}>&#10003;</div>Dashboard basico</li>
            <li><div className={S.check}>&#10003;</div>1 usuario</li>
        </ul>
        <Button variant="ghost">Comecar grátis</Button>
        </div>
    )
}