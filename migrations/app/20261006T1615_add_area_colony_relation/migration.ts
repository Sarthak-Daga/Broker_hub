#!/usr/bin/env -S node

import type { Contract as Start } from "../../snapshots/f6476841b38b63a24990558a0a0b2daf2afc8ae0185d672b05ebe282971725b4/contract";
import startContract from "../../snapshots/f6476841b38b63a24990558a0a0b2daf2afc8ae0185d672b05ebe282971725b4/contract.json" with { type: "json" };

import type { Contract as End } from "../../snapshots/f87f92961b58681b3ba290810146629710236689323db6d982790bed93915fca/contract";
import endContract from "../../snapshots/f87f92961b58681b3ba290810146629710236689323db6d982790bed93915fca/contract.json" with { type: "json" };

import { Migration, MigrationCLI, col } from "@prisma/orm-postgres/migration";

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: "public",
        table: "colony",
        column: col("areaId", "int4", {
          codecRef: { codecId: "pg/int4@1" },
        }),
      }),

      this.setNotNull({
        schema: "public",
        table: "colony",
        column: "areaId",
      }),

      this.createIndex({
        schema: "public",
        table: "colony",
        index: "colony_areaId_idx_abf7188c",
        columns: ["areaId"],
      }),

      this.addForeignKey({
        schema: "public",
        table: "colony",
        foreignKey: {
          name: "colony_areaId_fkey",
          columns: ["areaId"],
          references: {
            schema: "public",
            table: "area",
            columns: ["id"],
          },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
