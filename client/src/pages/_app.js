import "@/styles/globals.css";
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin']
});

export default function App({ Component, pageProps }) {
  return (
    <main className={orbitron.className}>
      <Component {...pageProps} />
      <SelectScreen />
      {/* <HomeScreen /> */}
    </main>
  );
}
