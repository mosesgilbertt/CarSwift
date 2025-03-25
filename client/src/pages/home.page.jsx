import { CarCard } from "../components/carCard";

export default function HomePage() {
  return (
    <section className="d-flex flex-wrap justify-content-center gap-3 pt-5">
      <CarCard />
      <CarCard />
      <CarCard />
      <CarCard />
      <CarCard />
    </section>
  );
}
