import { useJwtStore } from "@/store/jwt";

export const Home = () => {
  const { token } = useJwtStore();

  return <div className="bg-background text-4xl">HomePage</div>;
};
