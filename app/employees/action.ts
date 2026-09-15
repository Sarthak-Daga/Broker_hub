"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createEmployee(formdata: FormData) {
  const name = formdata.get("name");
  const phNo = formdata.get("phoneNumber");

  await db.orm.public.Employee.create({
    name,
    phoneNumber: phNo,
  });

  revalidatePath("/employees");
}

export async function addFollowUP(formdata: FormData) {
  const clnId = formdata.get("clientId");
  const empId = formdata.get("employeeId");
  const dateTime = formdata.get("DateTime");
  const notes = formdata.get("notes");
  const purpose = formdata.get("purpose");

  await db.orm.public.FollowUp.create({
    clientId: Number(clnId),
    employeeId: Number(empId),
    dateTime: String(dateTime),
    notes,
    purpose,
  });

  revalidatePath("/employees");
}

export async function toPend(formdata: FormData) {
  const FollowUpId = formdata.get("FollowUpId");

  await db.orm.public.FollowUp
    .where({ id: Number(FollowUpId) })
    .update({ status: "PENDING" });

  revalidatePath("/employees");
}

export async function toPost(formdata: FormData) {
  const FollowUpId = formdata.get("FollowUpId");

  await db.orm.public.FollowUp
    .where({ id: Number(FollowUpId) })
    .update({ status: "POSTPONED" });

  revalidatePath("/employees");
}

export async function toCan(formdata: FormData) {
  const FollowUpId = formdata.get("FollowUpId");

  await db.orm.public.FollowUp
    .where({ id: Number(FollowUpId) })
    .update({ status: "CANCELLED" });

  revalidatePath("/employees");
}

export async function toDone(formdata: FormData) {
  const FollowUpId = formdata.get("FollowUpId");

  await db.orm.public.FollowUp
    .where({ id: Number(FollowUpId) })
    .update({ status: "DONE" });

  revalidatePath("/employees");
}

export async function deleteEmployee(formData: FormData) {
  const employeeId = Number(formData.get("employeeId"));

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

  await db.orm.public.Employee
    .where({ id: employeeId })
    .delete();

  revalidatePath("/employees");
  revalidatePath("/follow-ups");
  revalidatePath("/marketing");
}