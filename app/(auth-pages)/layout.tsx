export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center max-w-5xl p-5">{children}</div>
  );
}
