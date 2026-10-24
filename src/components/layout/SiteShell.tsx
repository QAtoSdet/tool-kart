import { Header } from "./Header";
import { Footer } from "./Footer";

/** Wraps page content with the shared header and footer. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
