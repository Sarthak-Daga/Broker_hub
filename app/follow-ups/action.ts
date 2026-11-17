"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function updateFollowUp(formData: FormData) {
  const followUpIdStr = String(formData.get("followUpId") ?? "");
  const clientIdStr = String(formData.get("clientId") ?? "");
  const employeeIdStr = String(formData.get("employeeId") ?? "");
  const dateTimeStr = String(formData.get("DateTime") ?? "");
  const notesStr = String(formData.get("notes") ?? "");
  const purposeValue = formData.get("purpose");

  const followUpId = Number(followUpIdStr);
  const clientId = Number(clientIdStr);
  const employeeId = Number(employeeIdStr);

  if (!followUpIdStr || isNaN(followUpId) || followUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  if (!clientIdStr || isNaN(clientId) || clientId < 1) {
    throw new Error("Please provide a valid client ID.");
  }

  if (!employeeIdStr || isNaN(employeeId) || employeeId < 1) {
    throw new Error("Please provide a valid employee ID.");
  }

  if (!dateTimeStr) {
    throw new Error("Date and time are required.");
  }

  const purpose =
    purposeValue !== null && purposeValue !== undefined
      ? String(purposeValue)
      : "GENERAL";

  await db.orm.public.FollowUp.where({ id: followUpId }).update({
    clientId,
    employeeId,
    dateTime: dateTimeStr,
    notes: notesStr || null,
    purpose: purpose as "GENERAL" | "MARKETING" | "BUYER" | "SELLER",
  });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}

export async function toPend(formData: FormData) {
  const followUpIdStr = String(formData.get("FollowUpId") ?? "");
  const dateTimeStr = String(formData.get("DateTime") ?? "");
  const followUpId = Number(followUpIdStr);

  if (!followUpIdStr || isNaN(followUpId) || followUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  if (!dateTimeStr) {
    throw new Error("Date and time are required.");
  }

  const selectedDate = new Date(dateTimeStr);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date and time format.");
  }

  if (selectedDate <= new Date()) {
    throw new Error("Follow-up date must be in the future.");
  }

  await db.orm.public.FollowUp.where({ id: followUpId }).update({
    status: "PENDING",
    dateTime: dateTimeStr,
  });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}

export async function toPost(formData: FormData) {
  const followUpIdStr = String(formData.get("FollowUpId") ?? "");
  const dateTimeStr = String(formData.get("DateTime") ?? "");
  const followUpId = Number(followUpIdStr);

  if (!followUpIdStr || isNaN(followUpId) || followUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  if (!dateTimeStr) {
    throw new Error("Date and time are required.");
  }

  const selectedDate = new Date(dateTimeStr);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date and time format.");
  }

  if (selectedDate <= new Date()) {
    throw new Error("Follow-up date must be in the future.");
  }

  await db.orm.public.FollowUp.where({ id: followUpId }).update({
    status: "POSTPONED",
    dateTime: dateTimeStr,
  });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}

export async function toCan(formData: FormData) {
  const followUpIdStr = String(formData.get("FollowUpId") ?? "");
  const followUpId = Number(followUpIdStr);

  if (!followUpIdStr || isNaN(followUpId) || followUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  await db.orm.public.FollowUp.where({ id: followUpId }).update({
    status: "CANCELLED",
  });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}

export async function toDone(formData: FormData) {
  const followUpIdStr = String(formData.get("FollowUpId") ?? "");
  const followUpId = Number(followUpIdStr);

  if (!followUpIdStr || isNaN(followUpId) || followUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  await db.orm.public.FollowUp.where({ id: followUpId }).update({
    status: "DONE",
  });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}

export async function deleteFollowUp(formData: FormData) {
  const followUpIdStr = String(formData.get("FollowUpId") ?? "");
  const followUpId = Number(followUpIdStr);

  if (!followUpIdStr || isNaN(followUpId) || followUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  await db.orm.public.FollowUp.where({ id: followUpId }).delete();

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}