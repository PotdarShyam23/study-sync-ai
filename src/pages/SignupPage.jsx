import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();

  return (
    <AuthForm
      mode="signup"
      title="Build your study system before exams build pressure."
      subtitle="Create your account to unlock planning, progress tracking, and subject mastery."
      buttonLabel="Create Account"
      footerLabel="Already have an account?"
      footerLinkText="Login"
      footerTo="/login"
      onSubmit={signup}
    />
  );
}
