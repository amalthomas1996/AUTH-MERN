import Image from "next/image";
import Register from "./register/page";
import OtpVerification from "./otp-verification/page";
import { useRouter } from "next/navigation";
import Welcome from "./welcome/page";

export default function Home() {
  return (
    <>
      <Welcome />
    </>
  );
}
