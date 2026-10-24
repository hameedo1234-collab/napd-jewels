import CustomerAuthForm from "@/app/components/CustomerAuthForm";

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <CustomerAuthForm
      mode="login"
      initialError={error === "google-sign-in" ? "Google sign-in did not finish. Please try again." : ""}
    />
  );
}
