import { Footer } from "@/components/footer";
import { MainNav } from "@/components/main-nav";
import { Sidebar } from "@/components/sidebar/sidebar";
import Link from "next/link";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const session = true;

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="min-h-screen flex-1 flex flex-col">
        <MainNav session={session} />

        <main className="flex flex-col min-h-screen w-full py-32">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
