"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function createPlot(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const areaId = Number(formData.get("areaId"));
  const location = String(formData.get("location") ?? "").trim();
  const length = Number(formData.get("length"));
  const width = Number(formData.get("width"));
  const salePricePerSqFtRaw = formData.get("salePricePerSqFt");
  const sellerId = Number(formData.get("sellerId"));
  const remarks = String(formData.get("remarks") ?? "").trim();

  if (!Number.isInteger(areaId) || areaId < 1) {
    throw new Error("Please select a valid area.");
  }

  if (!Number.isInteger(sellerId) || sellerId < 1) {
    throw new Error("Please select a valid seller.");
  }

  if (isNaN(length) || length <= 0) {
    throw new Error("Length must be a positive number.");
  }

  if (isNaN(width) || width <= 0) {
    throw new Error("Width must be a positive number.");
  }

  const totalArea = length * width;

  let salePricePerSqFt: number | null = null;
  let totalPrice: number | null = null;

  if (salePricePerSqFtRaw !== null && salePricePerSqFtRaw !== "") {
    const priceNum = Number(salePricePerSqFtRaw);
    if (isNaN(priceNum) || priceNum < 0) {
      throw new Error("Price per sq ft must be a non-negative number.");
    }
    salePricePerSqFt = priceNum;
    totalPrice = totalArea * salePricePerSqFt;
  }

  await db.orm.public.Plot.create({
    title: title || null,
    areaId,
    location: location || null,
    length,
    width,
    totalArea,
    salePricePerSqFt,
    totalPrice,
    sellerId,
    status: "AVAILABLE",
    remarks: remarks || null,
  });

  revalidatePath("/properties");
  revalidatePath("/buyers-sellers");
}

export async function updatePlotStatus(formData: FormData) {
  const plotId = Number(formData.get("plotId"));
  const status = String(formData.get("status") ?? "");

  const allowedStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"] as const;

  if (!Number.isInteger(plotId) || plotId < 1) {
    throw new Error("Please select a valid plot.");
  }

  if (!allowedStatuses.includes(status as any)) {
    throw new Error("Please select a valid plot status.");
  }

  const selectedStatus = status as (typeof allowedStatuses)[number];

  let soldByEmployeeId: number | null = null;
  let soldToClientId: number | null = null;

  if (selectedStatus === "SOLD") {
    const employeeValue = String(formData.get("soldByEmployeeId") ?? "");
    const clientValue = String(formData.get("soldToClientId") ?? "");

    soldByEmployeeId = Number(employeeValue);
    soldToClientId = Number(clientValue);

    if (!employeeValue || isNaN(soldByEmployeeId) || soldByEmployeeId < 1) {
      throw new Error("Please select the employee who sold the plot.");
    }

    if (!clientValue || isNaN(soldToClientId) || soldToClientId < 1) {
      throw new Error("Please select the buyer.");
    }
  }

  await db.orm.public.Plot.where({ id: plotId }).update({
    status: selectedStatus,
    soldByEmployeeId,
    soldToClientId,
  });

  revalidatePath("/properties");
  revalidatePath("/buyers-sellers");
}

export async function deletePlot(formData: FormData) {
  const plotId = Number(formData.get("plotId"));

  if (!Number.isInteger(plotId) || plotId < 1) {
    throw new Error("Please select a valid plot.");
  }

  await db.orm.public.Plot.where({ id: plotId }).delete();

  revalidatePath("/properties");
  revalidatePath("/buyers-sellers");
}