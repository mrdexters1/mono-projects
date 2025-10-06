import { authOptions } from "@hardware/api/auth/[...nextauth]/route";
import HomePage from "@hardware/components/Home/HomePage";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <HomePage
      userId={session?.user?.id ?? ""}
      initialMessages={["Hi there! I'm here to help you build the perfect PC. What do you need?"]}
    />
  );
}
