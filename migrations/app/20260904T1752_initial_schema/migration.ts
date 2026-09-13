#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/f6476841b38b63a24990558a0a0b2daf2afc8ae0185d672b05ebe282971725b4/contract';
import endContract from '../../snapshots/f6476841b38b63a24990558a0a0b2daf2afc8ae0185d672b05ebe282971725b4/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'area',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'buyer',
        columns: [
          col('areaId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('budget', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('clientId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('length', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('remarks', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('NOTPURCHASED'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('width', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'buyer_status_check_1f93115c',
            "\"status\" IN ('NOTPURCHASED', 'PURCHASED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'client',
        columns: [
          col('address', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('mobileNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('remarks', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'colony',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'employee',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phoneNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'flat',
        columns: [
          col('flatNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('floorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('AVAILABLE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('flat_status_check_2ae4bb86', "\"status\" IN ('AVAILABLE', 'SOLD')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'floor',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('numberOfFlats', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('wingId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'followUp',
        columns: [
          col('clientId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('dateTime', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('employeeId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('purpose', 'text', {
            notNull: true,
            default: lit('GENERAL'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'followUp_purpose_check_ecca10a7',
            "\"purpose\" IN ('GENERAL', 'MARKETING', 'BUYER', 'SELLER')",
          ),
          checkExpression(
            'followUp_status_check_e7e59b77',
            "\"status\" IN ('PENDING', 'DONE', 'POSTPONED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'marketing',
        columns: [
          col('clientId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('colonyId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('employeeId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('priority', 'text', {
            notNull: true,
            default: lit('ONE_STAR'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('remarks', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('NONE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'marketing_priority_check_c89dc4c3',
            "\"priority\" IN ('ONE_STAR', 'TWO_STAR', 'THREE_STAR', 'FOUR_STAR', 'FIVE_STAR')",
          ),
          checkExpression(
            'marketing_status_check_df585cdd',
            "\"status\" IN ('NONE', 'CALLED_NOT_VISITED', 'VISITED', 'NOT_INTERESTED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'seller',
        columns: [
          col('areaId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('clientId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('demand', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('length', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('remarks', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('UNSOLD'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('width', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('seller_status_check_1b62e46e', "\"status\" IN ('UNSOLD', 'SOLD')"),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'wing',
        columns: [
          col('colonyId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('numberOfFloors', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'buyer',
        index: 'buyer_areaId_idx_abf7188c',
        columns: ['areaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'buyer',
        index: 'buyer_clientId_idx_153a9a49',
        columns: ['clientId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'flat',
        index: 'flat_floorId_idx_f24b0a84',
        columns: ['floorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'floor',
        index: 'floor_wingId_idx_68467838',
        columns: ['wingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'followUp',
        index: 'followUp_clientId_idx_153a9a49',
        columns: ['clientId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'followUp',
        index: 'followUp_employeeId_idx_087dd4a6',
        columns: ['employeeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'marketing',
        index: 'marketing_clientId_idx_153a9a49',
        columns: ['clientId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'marketing',
        index: 'marketing_colonyId_idx_fe680993',
        columns: ['colonyId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'marketing',
        index: 'marketing_employeeId_idx_087dd4a6',
        columns: ['employeeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'seller',
        index: 'seller_areaId_idx_abf7188c',
        columns: ['areaId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'seller',
        index: 'seller_clientId_idx_153a9a49',
        columns: ['clientId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'wing',
        index: 'wing_colonyId_idx_fe680993',
        columns: ['colonyId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'buyer',
        foreignKey: {
          name: 'buyer_clientId_fkey',
          columns: ['clientId'],
          references: { schema: 'public', table: 'client', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'buyer',
        foreignKey: {
          name: 'buyer_areaId_fkey',
          columns: ['areaId'],
          references: { schema: 'public', table: 'area', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'flat',
        foreignKey: {
          name: 'flat_floorId_fkey',
          columns: ['floorId'],
          references: { schema: 'public', table: 'floor', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'floor',
        foreignKey: {
          name: 'floor_wingId_fkey',
          columns: ['wingId'],
          references: { schema: 'public', table: 'wing', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'followUp',
        foreignKey: {
          name: 'followUp_clientId_fkey',
          columns: ['clientId'],
          references: { schema: 'public', table: 'client', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'followUp',
        foreignKey: {
          name: 'followUp_employeeId_fkey',
          columns: ['employeeId'],
          references: { schema: 'public', table: 'employee', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'marketing',
        foreignKey: {
          name: 'marketing_clientId_fkey',
          columns: ['clientId'],
          references: { schema: 'public', table: 'client', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'marketing',
        foreignKey: {
          name: 'marketing_employeeId_fkey',
          columns: ['employeeId'],
          references: { schema: 'public', table: 'employee', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'marketing',
        foreignKey: {
          name: 'marketing_colonyId_fkey',
          columns: ['colonyId'],
          references: { schema: 'public', table: 'colony', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'seller',
        foreignKey: {
          name: 'seller_clientId_fkey',
          columns: ['clientId'],
          references: { schema: 'public', table: 'client', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'seller',
        foreignKey: {
          name: 'seller_areaId_fkey',
          columns: ['areaId'],
          references: { schema: 'public', table: 'area', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'wing',
        foreignKey: {
          name: 'wing_colonyId_fkey',
          columns: ['colonyId'],
          references: { schema: 'public', table: 'colony', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
