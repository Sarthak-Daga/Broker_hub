#!/usr/bin/env -S node

import type { Contract as End } from '../../snapshots/9c186b7928bb208937363457ed4c6d2a709d581ec80c9d360fa057941953108c/contract';
import endContract from '../../snapshots/9c186b7928bb208937363457ed4c6d2a709d581ec80c9d360fa057941953108c/contract.json' with { type: 'json' };

import type { Contract as Start } from '../../snapshots/f87f92961b58681b3ba290810146629710236689323db6d982790bed93915fca/contract';
import startContract from '../../snapshots/f87f92961b58681b3ba290810146629710236689323db6d982790bed93915fca/contract.json' with { type: 'json' };

import {
  Migration,
  MigrationCLI,
  col,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'floor',
        column: col('floorNumber', 'int4', {
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),

      this.setNotNull({
        schema: 'public',
        table: 'floor',
        column: 'floorNumber',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);