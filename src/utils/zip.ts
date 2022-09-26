import type { AsyncZipOptions } from 'fflate';

import promisify from 'pify';
import { zip as _zip } from 'fflate';
import { saveAs } from 'file-saver';

const zip = promisify(_zip);

export async function outputZip(files: Record<string, Uint8Array>, name: string): Promise<void> {
  const entries: Record<string, [Uint8Array, AsyncZipOptions]> = {};
  const opt: AsyncZipOptions = { level: 9 };

  for (const key of Object.keys(files)) {
    entries[key] = [files[key], opt];
  }

  const dist = await zip(entries);
  saveAs(new Blob([dist], { type: 'application/zip' }), name);
}
