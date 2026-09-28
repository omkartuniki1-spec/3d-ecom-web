import CanvasSequence from "@/components/CanvasSequence";
import Storefront from "@/components/Storefront";

export default function Home() {
  return (
    <main className="bg-black min-h-screen w-full">
      <CanvasSequence />
      <Storefront />
    </main>
  );
}