import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <AuthForm
      mode="login"
      title="Welcome back to your study dashboard."
      subtitle="Track your deadlines, manage weak topics, and keep your revision data persistent."
      buttonLabel="Login"
      footerLabel="Don't have an account?"
      footerLinkText="Create one"
      footerTo="/signup"
      onSubmit={login}
    />
  );
}
