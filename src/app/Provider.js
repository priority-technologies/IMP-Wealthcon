"use client";

import { usePathname } from "next/navigation";
import Layout from "../components/Layout";
import { useContext } from "react";
import { UserContext } from "./_context/User";
import InitialLoading from "../components/Loading/InitialLoading";

export default function Provider({ children }) {
  const { userDetails } = useContext(UserContext);
  const pathname = usePathname();

  const isPublicPath = ["/login", "/register", "/forgot-password"].includes(
    pathname
  );

  if (!isPublicPath && !userDetails) {
    return <InitialLoading />;
  }

  return <>{isPublicPath ? children : <Layout data={children} />}</>;
}
