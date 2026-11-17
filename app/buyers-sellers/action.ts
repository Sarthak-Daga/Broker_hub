"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

type SellerStatus = "UNSOLD" | "UNAVAILABLE" | "SOLD";
type BuyerStatus = "NOTPURCHASED" | "PURCHASED" | "CANCELLED";

const VALID_SELLER_STATUSES: readonly SellerStatus[] = [
  "UNSOLD",
  "UNAVAILABLE",
  "SOLD",
];

const VALID_BUYER_STATUSES: readonly BuyerStatus[] = [
  "NOTPURCHASED",
  "PURCHASED",
  "CANCELLED",
];

function positiveInt(value: string, label: string): number {
  const num = Number(value);

  if (isNaN(num) || !Number.isInteger(num) || num < 1) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return num;
}

function nonNegativeNumber(value: string, label: string): number {
  const num = Number(value);

  if (isNaN(num) || num < 0) {
    throw new Error(`${label} must be a non-negative number.`);
  }

  return num;
}

export async function createSeller(formData: FormData) {
  const clientId = positiveInt(
    String(formData.get("clientId") ?? ""),
    "Client ID",
  );
  const areaId = positiveInt(
    String(formData.get("areaId") ?? ""),
    "Area ID",
  );
  const length = nonNegativeNumber(
    String(formData.get("length") ?? ""),
    "Length",
  );
  const width = nonNegativeNumber(
    String(formData.get("width") ?? ""),
    "Width",
  );
  const demand = nonNegativeNumber(
    String(formData.get("demand") ?? ""),
    "Demand",
  );

  const statusValue = String(formData.get("status") ?? "").trim() as SellerStatus;

  if (!VALID_SELLER_STATUSES.includes(statusValue)) {
    throw new Error("Please select a valid seller status.");
  }

  const remarks = String(formData.get("remarks") ?? "").trim();

  await db.orm.public.Seller.create({
    clientId,
    areaId,
    length,
    width,
    demand,
    status: statusValue,
    remarks: remarks || undefined,
  });

  revalidatePath("/buyers-sellers");
  revalidatePath("/dashboard");
}

export async function createBuyer(formData: FormData) {
  const clientId = positiveInt(
    String(formData.get("clientId") ?? ""),
    "Client ID",
  );
  const areaId = positiveInt(
    String(formData.get("areaId") ?? ""),
    "Area ID",
  );
  const length = nonNegativeNumber(
    String(formData.get("length") ?? ""),
    "Length",
  );
  const width = nonNegativeNumber(
    String(formData.get("width") ?? ""),
    "Width",
  );
  const budget = nonNegativeNumber(
    String(formData.get("budget") ?? ""),
    "Budget",
  );

  const statusValue = String(formData.get("status") ?? "").trim() as BuyerStatus;

  if (!VALID_BUYER_STATUSES.includes(statusValue)) {
    throw new Error("Please select a valid buyer status.");
  }

  const remarks = String(formData.get("remarks") ?? "").trim();

  await db.orm.public.Buyer.create({
    clientId,
    areaId,
    length,
    width,
    budget,
    status: statusValue,
    remarks: remarks || undefined,
  });

  revalidatePath("/buyers-sellers");
  revalidatePath("/dashboard");
}

export async function deleteSeller(formData: FormData) {
  const sellerId = positiveInt(
    String(formData.get("sellerId") ?? ""),
    "Seller ID",
  );

  await db.orm.public.Seller.where({ id: sellerId }).delete();

  revalidatePath("/buyers-sellers");
  revalidatePath("/dashboard");
}

export async function deleteBuyer(formData: FormData) {
  const buyerId = positiveInt(
    String(formData.get("buyerId") ?? ""),
    "Buyer ID",
  );

  await db.orm.public.Buyer.where({ id: buyerId }).delete();

  revalidatePath("/buyers-sellers");
  revalidatePath("/dashboard");
}

export async function updateSellerStatus(formData: FormData) {
  const sellerId = positiveInt(
    String(formData.get("sellerId") ?? ""),
    "Seller ID",
  );

  const statusValue = String(formData.get("status") ?? "").trim() as SellerStatus;

  if (!VALID_SELLER_STATUSES.includes(statusValue)) {
    throw new Error("Please select a valid seller status.");
  }

  await db.orm.public.Seller.where({ id: sellerId }).update({
    status: statusValue,
  });

  revalidatePath("/buyers-sellers");
  revalidatePath("/dashboard");
}

export async function updateBuyerStatus(formData: FormData) {
  const buyerId = positiveInt(
    String(formData.get("buyerId") ?? ""),
    "Buyer ID",
  );

  const statusValue = String(formData.get("status") ?? "").trim() as BuyerStatus;

  if (!VALID_BUYER_STATUSES.includes(statusValue)) {
    throw new Error("Please select a valid buyer status.");
  }

  await db.orm.public.Buyer.where({ id: buyerId }).update({
    status: statusValue,
  });

  revalidatePath("/buyers-sellers");
  revalidatePath("/dashboard");
}