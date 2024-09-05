import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('../app/components/MapComponent'), {
  ssr: false
});

export default function Home() {
  return (
    <MapWithNoSSR />
  );
}