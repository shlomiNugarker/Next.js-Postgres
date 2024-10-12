import Spinner from "../layouts/cmps/Spinner";

export default function Loading() {
  return (
    <main className="flex h-screen justify-center items-center bg-theme-light dark:bg-darkmode-theme-light">
      <Spinner />
    </main>
  );
}
