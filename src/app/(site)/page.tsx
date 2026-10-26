import { Nav, Hero } from "@/components/v-counter/opening";
import { FilmScene } from "@/components/v-counter/film-scene";
import { Promise, Never } from "@/components/v-counter/trust";
import { InTheBox } from "@/components/v-counter/in-the-box";
import { Clinics } from "@/components/v-counter/clinics";
import { Month } from "@/components/v-counter/month";
import { Estimate } from "@/components/v-counter/estimate";
import { Pricing } from "@/components/v-counter/pricing";
import { Faq } from "@/components/v-counter/faq";
import { Close } from "@/components/v-counter/close";
import { Reveal } from "@/components/v-counter/reveal";

// "The reception counter, filmed": the stand, the card and the phone on the counter are the
// hero, and the scroll films the tap.
export default function CounterPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FilmScene />
        <Promise />
        <Never />
        <InTheBox />
        <Clinics />
        <Month />
        <Estimate />
        <Pricing />
        <Faq />
      </main>
      <Close />
      <Reveal />
    </>
  );
}
