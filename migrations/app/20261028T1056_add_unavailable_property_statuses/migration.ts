#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/b28d702d1ec86f052b9078c9adb92445970664566b573a21d59f97e57a5cde60/contract';
import endContract from '../../snapshots/b28d702d1ec86f052b9078c9adb92445970664566b573a21d59f97e57a5cde60/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f87f92961b58681b3ba290810146629710236689323db6d982790bed93915fca/contract';
import startContract from '../../snapshots/f87f92961b58681b3ba290810146629710236689323db6d982790bed93915fca/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropCheckConstraint({
        schema: 'public',
        table: 'flat',
        constraint: 'flat_status_check_2ae4bb86',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'seller',
        constraint: 'seller_status_check_1b62e46e',
      }),
      this.addColumn({
        schema: 'public',
        table: 'flat',
        column: col('soldByEmployeeId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'flat',
        column: col('soldToClientId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'floor',
        column: col('floorNumber', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-floor-floorNumber', {
        check: () => placeholder('backfill-floor-floorNumber:check'),
        run: () => placeholder('backfill-floor-floorNumber:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'floor', column: 'floorNumber' }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'flat',
        constraint: 'flat_status_check_b0a54f12',
        expression: "\"status\" IN ('AVAILABLE', 'UNAVAILABLE', 'SOLD')",
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'seller',
        constraint: 'seller_status_check_fb15d386',
        expression: "\"status\" IN ('UNSOLD', 'UNAVAILABLE', 'SOLD')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'flat',
        index: 'flat_soldByEmployeeId_idx_a6cbd2a2',
        columns: ['soldByEmployeeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'flat',
        index: 'flat_soldToClientId_idx_6da72b19',
        columns: ['soldToClientId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'flat',
        foreignKey: {
          name: 'flat_soldByEmployeeId_fkey',
          columns: ['soldByEmployeeId'],
          references: { schema: 'public', table: 'employee', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'flat',
        foreignKey: {
          name: 'flat_soldToClientId_fkey',
          columns: ['soldToClientId'],
          references: { schema: 'public', table: 'client', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
