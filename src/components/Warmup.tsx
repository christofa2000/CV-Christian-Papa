// src/components/Warmup.tsx
"use client";
import localforage from "localforage";
import { useEffect } from "react";
export default function Warmup() {
  useEffect(() => {
    localforage.getItem("index");
  }, []);
  return null;
}
