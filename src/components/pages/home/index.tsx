import { Menu } from "@/components/molecules/menu";
import { Section } from "@/components/organisms/section";

export const HomeTemplate = () => {
  return (
    <>
    <Menu />
    <Section>
      <h1 className="mb-4">Welcome to Custe AI</h1>
      <p className=" ">Your personal assistant for managing your finances.</p>
    </Section>
    <Section isColored>
      <h1 className="mb-4">Welcome to Custe AI</h1>
      
    </Section>
    </>
  );
}
