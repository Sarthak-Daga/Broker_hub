"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createClient(formData: FormData) {
  const name = formData.get("name");
  const address = formData.get("addr");
  const mobileNumber = formData.get("mobNo");
  const remarks = formData.get("remarks");

  const client = await db.orm.public.Client.create({
    name,
    address,
    mobileNumber,
    remarks,
  });

  revalidatePath('/contacts')
}

export async function deleteClient(formData: FormData) {
  const clientId = Number(formData.get("id"));
  
  const deleteClient = await db.orm.public.Client
    .where({id : clientId})
    .delete()
  revalidatePath('/contacts')
}