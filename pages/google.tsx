import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Google: NextPage = () => {
  return (
    <main
      className={`min-h-screen flex items-center justify-center flex-col gap-16 ${inter.className}`}
    >
      <div className="flex flex-col gap-4">hello world</div>
    </main>
  );
};

export default Google;
