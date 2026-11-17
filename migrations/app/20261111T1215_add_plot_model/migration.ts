#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/74f7f0a227aa53abdfc72d8fdab639af2ce1273c3366e5f9b7e4cbe6a32fd92d/contract';
import endContract from '../../snapshots/74f7f0a227aa53abdfc72d8fdab639af2ce1273c3366e5f9b7e4cbe6a32fd92d/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b28d702d1ec86f052b9078c9adb92445970664566b573a21d59f97e57a5cde60/contract';
import startContract from '../../snapshots/b28d702d1ec86f052b9078c9adb92445970664566b573a21d59f97e57a5cde60/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'plot',
        columns: [
          col('areaId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('length', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('location', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('remarks', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('salePricePerSqFt', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('sellerId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('soldByEmployeeId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('soldToClientId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('AVAILABLE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('totalArea', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('totalPrice', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('width', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'plot_status_check_b0a54f12',
            "\"status\" IN ('AVAILABLE', 'UNAVAILABLE', 'SOLD')",
          ),
        ],
      }),
      this.createIndex({
        schema: 'public',
        table: 'plot',
        index: 'plot_areaId_idx_abf7188c',
        columns: ['areaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'plot',
        index: 'plot_sellerId_idx_d71255f2',
        columns: ['sellerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'plot',
        index: 'plot_soldByEmployeeId_idx_a6cbd2a2',
        columns: ['soldByEmployeeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'plot',
        index: 'plot_soldToClientId_idx_6da72b19',
        columns: ['soldToClientId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'plot',
        foreignKey: {
          name: 'plot_areaId_fkey',
          columns: ['areaId'],
          references: { schema: 'public', table: 'area', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'plot',
        foreignKey: {
          name: 'plot_sellerId_fkey',
          columns: ['sellerId'],
          references: { schema: 'public', table: 'seller', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'plot',
        foreignKey: {
          name: 'plot_soldToClientId_fkey',
          columns: ['soldToClientId'],
          references: { schema: 'public', table: 'client', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'plot',
        foreignKey: {
          name: 'plot_soldByEmployeeId_fkey',
          columns: ['soldByEmployeeId'],
          references: { schema: 'public', table: 'employee', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
