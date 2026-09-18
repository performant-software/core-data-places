import { describe, expect, test } from 'vitest';
import { withoutServerIslands } from '../integrations/static-islands.mjs';

describe('withoutServerIslands', () => {
  test('drops the directive whether it ends the tag or sits between props', () => {
    const src = '<RelatedPeople\n  uuid={record.uuid}\n  server:defer\n/>\n<Gallery server:defer uuid={uuid} />\n<Map server:defer>\n';

    expect(withoutServerIslands(src)).toBe('<RelatedPeople\n  uuid={record.uuid}\n/>\n<Gallery uuid={uuid} />\n<Map>\n');
  });

  test('leaves everything else alone', () => {
    const src = '<Layout title="x" server-defer={false}>\n<p>server:defer in text is not a directive</p>\n';

    expect(withoutServerIslands(src)).toBe(src);
  });
});
