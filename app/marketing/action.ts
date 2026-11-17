"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

type MarketingStatus = "NONE" | "CALLED_NOT_VISITED" | "VISITED" | "NOT_INTERESTED";
type MarketingPriority =
  | "ONE_STAR"
  | "TWO_STAR"
  | "THREE_STAR"
  | "FOUR_STAR"
  | "FIVE_STAR";

const VALID_STATUSES: readonly MarketingStatus[] = [
  "NONE",
  "CALLED_NOT_VISITED",
  "VISITED",
  "NOT_INTERESTED",
];

const VALID_PRIORITIES: readonly MarketingPriority[] = [
  "ONE_STAR",
  "TWO_STAR",
  "THREE_STAR",
  "FOUR_STAR",
  "FIVE_STAR",
];

function positiveInt(value: string, label: string): number {
  const num = Number(value);

  if (isNaN(num) || !Number.isInteger(num) || num < 1) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return num;
}

export async function createLead(formData: FormData) {
  const clientId = positiveInt(
    String(formData.get("clientId") ?? ""),
    "Client ID",
  );
  const colonyId = positiveInt(
    String(formData.get("colonyId") ?? ""),
    "Colony ID",
  );

  const statusValue = String(formData.get("status") ?? "").trim() as MarketingStatus;

  if (!VALID_STATUSES.includes(statusValue)) {
    throw new Error("Please select a valid marketing status.");
  }

  const priorityValue = String(
    formData.get("priority") ?? "",
  ).trim() as MarketingPriority;

  if (!VALID_PRIORITIES.includes(priorityValue)) {
    throw new Error("Please select a valid priority.");
  }

  const employeeIdValue = String(formData.get("employeeId") ?? "").trim();
  const remarks = String(formData.get("remarks") ?? "").trim();

  const employeeId =
    employeeIdValue.length > 0 ? positiveInt(employeeIdValue, "Employee ID") : null;

  await db.orm.public.Marketing.create({
    clientId,
    colonyId,
    employeeId: employeeId ?? undefined,
    status: statusValue,
    priority: priorityValue,
    remarks: remarks || undefined,
  });

  revalidatePath("/marketing");
  revalidatePath("/dashboard");
}

export async function updateLeadStatus(formData: FormData) {
  const leadId = positiveInt(
    String(formData.get("leadId") ?? ""),
    "Lead ID",
  );

  const statusValue = String(formData.get("status") ?? "").trim() as MarketingStatus;

  if (!VALID_STATUSES.includes(statusValue)) {
    throw new Error("Please select a valid marketing status.");
  }

  await db.orm.public.Marketing.where({ id: leadId }).update({
    status: statusValue,
  });

  revalidatePath("/marketing");
  revalidatePath("/dashboard");
}

export async function deleteLead(formData: FormData) {
  const leadId = positiveInt(
    String(formData.get("leadId") ?? ""),
    "Lead ID",
  );

  await db.orm.public.Marketing.where({ id: leadId }).delete();

  revalidatePath("/marketing");
  revalidatePath("/dashboard");
}

export async function assignEmployee(formData: FormData) {
  const leadId = positiveInt(
    String(formData.get("leadId") ?? ""),
    "Lead ID",
  );

  const employeeId = positiveInt(
    String(formData.get("employeeId") ?? ""),
    "Employee ID",
  );

  await db.orm.public.Marketing.where({ id: leadId }).update({
    employeeId,
  });

  revalidatePath("/marketing");
  revalidatePath("/dashboard");
}