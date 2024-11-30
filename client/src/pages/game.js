import dynamic from 'next/dynamic';

const Webcam = dynamic(() => import('../components/webcam.js'), { ssr: false });

export default function Game() {
  return (
    <>
      <Webcam/>
    </>
  );
}
