import { getWaitlistUser } from './helpers';
import WaitlistPage from './page';

export default async function WaitlistPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const users = await getWaitlistUser();

  return <WaitlistPage users={users} />;
}
