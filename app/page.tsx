import FullScreenCarousel from "@/components/login-carousol/CarousolPage";
import { LoginForm } from "../components/auth/login-form";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10 relative ">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
      <div className="w-full h-full overflow-hidden absolute top-0 left-0 opacity-75 py-8  flex items-center justify-center -z-10">
        <FullScreenCarousel />
      </div>
    </div>
  );
}
