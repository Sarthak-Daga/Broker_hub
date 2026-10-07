"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createArea(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Area name is required.");
  }

  const area = await db.orm.public.Area.create({
    name,
  });

  revalidatePath("/properties");

  return {
    id: Number(area.id),
    name: String(area.name),
  };
}

export async function createColony(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const areaId = Number(formData.get("areaId"));

  if (!name) {
    throw new Error("Colony name is required.");
  }

  if (!areaId) {
    throw new Error("Area is required.");
  }

  const colony = await db.orm.public.Colony.create({
    name,
    areaId,
  });

  revalidatePath("/properties");

  return {
    id: Number(colony.id),
    name: String(colony.name),
    areaId: Number(colony.areaId),
  };
}
