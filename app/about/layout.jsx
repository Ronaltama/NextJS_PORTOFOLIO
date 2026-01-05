import Footer from "@/components/Footer";

export const metadata = {
  title: "Ronaltama | About"
};
export default function Layout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
