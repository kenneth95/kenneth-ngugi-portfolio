import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Golang } from "@/components/ui/svgs/golang";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Java } from "@/components/ui/svgs/java";
import { Csharp } from "@/components/ui/svgs/csharp";

export const SKILL_ICONS = {
  react: ReactLight,
  nextjs: NextjsIconDark,
  typescript: Typescript,
  nodejs: Nodejs,
  python: Python,
  golang: Golang,
  postgresql: Postgresql,
  docker: Docker,
  kubernetes: Kubernetes,
  java: Java,
  csharp: Csharp,
} as const;