"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createEmployee(formData: FormData) {
  const nameStr = String(formData.get("name") ?? "").trim();
  const phoneNumberStr = String(formData.get("phoneNumber") ?? "").trim();

  if (!nameStr) {
    throw new Error("Employee name is required.");
  }

  if (!phoneNumberStr) {
    throw new Error("Phone number is required.");
  }

  await db.orm.public.Employee.create({
    name: nameStr,
    phoneNumber: phoneNumberStr,
  });

  revalidatePath("/employees");
}

export async function addFollowUp(formData: FormData) {
  const clientIdStr = String(formData.get("clientId") ?? "");
  const employeeIdStr = String(formData.get("employeeId") ?? "");
  const dateTimeStr = String(formData.get("DateTime") ?? "");
  const notesStr = String(formData.get("notes") ?? "");
  const purposeValue = formData.get("purpose");

  const clientId = Number(clientIdStr);
  const employeeId = Number(employeeIdStr);

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

  await db.orm.public.FollowUp.create({
    clientId,
    employeeId,
    dateTime: dateTimeStr,
    notes: notesStr || null,
    purpose: purpose as "GENERAL" | "MARKETING" | "BUYER" | "SELLER",
  });

  revalidatePath("/employees");
}

export async function toPend(formData: FormData) {
  const FollowUpIdStr = String(formData.get("FollowUpId") ?? "");
  const FollowUpId = Number(FollowUpIdStr);

  if (!FollowUpIdStr || isNaN(FollowUpId) || FollowUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  await db.orm.public.FollowUp.where({ id: FollowUpId }).update({
    status: "PENDING",
  });

  revalidatePath("/employees");
}

export async function toPost(formData: FormData) {
  const FollowUpIdStr = String(formData.get("FollowUpId") ?? "");
  const dateTimeStr = String(formData.get("DateTime") ?? "");
  const FollowUpId = Number(FollowUpIdStr);

  if (!FollowUpIdStr || isNaN(FollowUpId) || FollowUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  if (!dateTimeStr) {
    throw new Error("Date and time are required.");
  }

  await db.orm.public.FollowUp.where({ id: FollowUpId }).update({
    status: "POSTPONED",
    dateTime: dateTimeStr,
  });

  revalidatePath("/employees");
}

export async function toCan(formData: FormData) {
  const FollowUpIdStr = String(formData.get("FollowUpId") ?? "");
  const FollowUpId = Number(FollowUpIdStr);

  if (!FollowUpIdStr || isNaN(FollowUpId) || FollowUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  await db.orm.public.FollowUp.where({ id: FollowUpId }).update({
    status: "CANCELLED",
  });

  revalidatePath("/employees");
}

export async function toDone(formData: FormData) {
  const FollowUpIdStr = String(formData.get("FollowUpId") ?? "");
  const FollowUpId = Number(FollowUpIdStr);

  if (!FollowUpIdStr || isNaN(FollowUpId) || FollowUpId < 1) {
    throw new Error("Please provide a valid follow-up ID.");
  }

  await db.orm.public.FollowUp.where({ id: FollowUpId }).update({
    status: "DONE",
  });

  revalidatePath("/employees");
}

export async function deleteEmployee(formData: FormData) {
  const employeeIdStr = String(formData.get("employeeId") ?? "");
  const employeeId = Number(employeeIdStr);

  if (!employeeIdStr || isNaN(employeeId) || employeeId < 1) {
    throw new Error("Please provide a valid employee ID.");
  }

  const followUps = await db.orm.public.FollowUp.all();
  const marketing = await db.orm.public.Marketing.all();

  const hasFollowUps = followUps.some(
    (followUp) => followUp.employeeId === employeeId
  );

  const hasMarketing = marketing.some(
    (item) => item.employeeId === employeeId
  );

  if (hasFollowUps || hasMarketing) {
    throw new Error(
      "Employee cannot be deleted while they have assigned records."
    );
  }

  await db.orm.public.Employee.where({ id: employeeId }).delete();

  revalidatePath("/employees");
  revalidatePath("/follow-ups");
  revalidatePath("/marketing");
}