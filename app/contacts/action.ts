"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  const nameStr = String(formData.get("name") ?? "").trim();
  const addressStr = String(formData.get("addr") ?? "").trim();
  const mobileNumberStr = String(formData.get("mobNo") ?? "").trim();
  const remarksStr = String(formData.get("remarks") ?? "");

  if (!nameStr) {
    throw new Error("Client name is required.");
  }

  if (!mobileNumberStr) {
    throw new Error("Mobile number is required.");
  }

  const client = await db.orm.public.Client.create({
    name: nameStr,
    address: addressStr,
    mobileNumber: mobileNumberStr,
    remarks: remarksStr || null,
  });

  revalidatePath("/contacts");
}

export async function deleteClient(formData: FormData) {
  const clientIdStr = String(formData.get("id") ?? "");
  const clientId = Number(clientIdStr);

  if (!clientIdStr || isNaN(clientId) || clientId < 1) {
    throw new Error("Please provide a valid client ID.");
  }

  await db.orm.public.Client.where({ id: clientId }).delete();
  revalidatePath("/contacts");
}