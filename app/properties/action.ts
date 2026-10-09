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


type GenerateStructureInput = {
  colonyId: number;
  wings: {
    name: string;
    floors: {
      floorNumber: number;
      flats: {
        flatNumber: string;
        type: string;
      }[];
    }[];
  }[];
};

export async function generatePropertyStructure(
  input: GenerateStructureInput,
) {
  const { colonyId, wings } = input;

  if (!Number.isInteger(colonyId) || colonyId < 1) {
    throw new Error("Please select a valid colony.");
  }

  if (!Array.isArray(wings) || wings.length === 0) {
    throw new Error("At least one wing is required.");
  }

  if (wings.length > 100) {
    throw new Error("A maximum of 100 wings is allowed.");
  }

  const wingNames = wings.map((wing) => wing.name.trim());

  if (
    wingNames.some((name) => !name) ||
    new Set(wingNames.map((name) => name.toLowerCase())).size !==
      wingNames.length
  ) {
    throw new Error("Wing names must be non-empty and unique.");
  }

  let totalFlats = 0;
  let totalFloors = 0;

  for (const wing of wings) {
    if (
      !Array.isArray(wing.floors) ||
      wing.floors.length === 0 ||
      wing.floors.length > 200
    ) {
      throw new Error(
        `Wing ${wing.name} must have between 1 and 200 floors.`,
      );
    }

    const floorNumbers = wing.floors.map(
      (floor) => floor.floorNumber,
    );

    if (
      floorNumbers.some(
        (number) => !Number.isInteger(number) || number < 1,
      ) ||
      new Set(floorNumbers).size !== floorNumbers.length
    ) {
      throw new Error(
        `Wing ${wing.name} has invalid or duplicate floor numbers.`,
      );
    }

    for (const floor of wing.floors) {
      if (
        !Array.isArray(floor.flats) ||
        floor.flats.length === 0 ||
        floor.flats.length > 200
      ) {
        throw new Error(
          `Floor ${floor.floorNumber} in Wing ${wing.name} must have between 1 and 200 flats.`,
        );
      }

      const flatNumbers = floor.flats.map(
        (flat) => flat.flatNumber.trim(),
      );

      if (
        flatNumbers.some((number) => !number) ||
        new Set(flatNumbers.map((number) => number.toLowerCase()))
          .size !== flatNumbers.length
      ) {
        throw new Error(
          `Flat numbers must be non-empty and unique within Floor ${floor.floorNumber}.`,
        );
      }

      if (
        floor.flats.some(
          (flat) =>
            !flat.type.trim() || flat.type.trim().length > 50,
        )
      ) {
        throw new Error("Every flat must have a valid type.");
      }

      totalFlats += floor.flats.length;
      totalFloors++;
    }
  }

  if (totalFlats > 5000) {
    throw new Error("A maximum of 5,000 flats can be generated at once.");
  }

  // Prevent accidental regeneration of an already populated colony.
  const existingWings = await db.orm.public.Wing.all();

  if (existingWings.some((wing) => wing.colonyId === colonyId)) {
    throw new Error(
      "This colony already has a generated structure.",
    );
  }

  for (const wingConfig of wings) {
    const wing = await db.orm.public.Wing.create({
      name: wingConfig.name.trim(),
      colonyId,
      numberOfFloors: wingConfig.floors.length,
    });

    for (const floorConfig of wingConfig.floors) {
      const floor = await db.orm.public.Floor.create({
        floorNumber: floorConfig.floorNumber,
        numberOfFlats: floorConfig.flats.length,
        wingId: Number(wing.id),
      });

      for (const flatConfig of floorConfig.flats) {
        await db.orm.public.Flat.create({
          flatNumber: flatConfig.flatNumber.trim(),
          type: flatConfig.type.trim(),
          floorId: Number(floor.id),
        });
      }
    }
  }

  revalidatePath("/properties");

  return {
    success: true,
    totalWings: wings.length,
    totalFloors,
    totalFlats,
  };
}
