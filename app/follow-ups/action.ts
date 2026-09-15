"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function updateFollowUp(formData: FormData) {
  const followUpId = Number(formData.get("followUpId"));

  const clientId = Number(formData.get("clientId"));
  const employeeId = Number(formData.get("employeeId"));
  const dateTime = formData.get("DateTime");
  const notes = formData.get("notes");
  const purpose = formData.get("purpose");

  await db.orm.public.FollowUp
    .where({ id: followUpId })
    .update({
      clientId,
      employeeId,
      dateTime: String(dateTime),
      notes,
      purpose,
    });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}


export async function toPend(formData: FormData) {
  const followUpId = Number(formData.get("FollowUpId"));
  const dateTime = String(formData.get("DateTime"));

  const selectedDate = new Date(dateTime);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date and time.");
  }

  if (selectedDate <= new Date()) {
    throw new Error("Follow-up date must be in the future.");
  }

  await db.orm.public.FollowUp
    .where({ id: followUpId })
    .update({
      status: "PENDING",
      dateTime,
    });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}


export async function toPost(formData: FormData) {
  const followUpId = Number(formData.get("FollowUpId"));
  const dateTime = String(formData.get("DateTime"));

  const selectedDate = new Date(dateTime);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date and time.");
  }

  if (selectedDate <= new Date()) {
    throw new Error("Follow-up date must be in the future.");
  }

  await db.orm.public.FollowUp
    .where({ id: followUpId })
    .update({
      status: "POSTPONED",
      dateTime,
    });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}


export async function toCan(formData: FormData) {
  const followUpId = Number(formData.get("FollowUpId"));

  await db.orm.public.FollowUp
    .where({ id: followUpId })
    .update({
      status: "CANCELLED",
    });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}


export async function toDone(formData: FormData) {
  const followUpId = Number(formData.get("FollowUpId"));

  await db.orm.public.FollowUp
    .where({ id: followUpId })
    .update({
      status: "DONE",
    });

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}

export async function deleteFollowUp(formData: FormData) {
  const followUpId = Number(formData.get("FollowUpId"));

  await db.orm.public.FollowUp
    .where({ id: followUpId })
    .delete();

  revalidatePath("/follow-ups");
  revalidatePath("/employees");
}