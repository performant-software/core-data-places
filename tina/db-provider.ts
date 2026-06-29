/**
 Copyright 2022 Forestry.io Holdings, Inc.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import {
  AbstractDatabaseOptions,
  AbstractIterator,
  AbstractKeyIterator,
  AbstractLevel,
  AbstractOpenOptions,
  AbstractValueIterator,
} from 'abstract-level'
import {
  Collection,
  Db,
  Document,
  MongoClient,
  FindCursor,
  Filter,
} from 'mongodb'
import ModuleError from 'module-error'

declare interface MongodbLevelOptions<K, V>
    extends AbstractDatabaseOptions<K, V> {
  mongoUri: string
  dbName: string
  collectionName: string
}

declare interface MongodbLevelOpenOptions extends AbstractOpenOptions {
  /**
   * An {@link AbstractLevel} option that has no effect on {@link MongodbLevel}.
   */
  createIfMissing?: boolean

  /**
   * An {@link AbstractLevel} option that has no effect on {@link MongodbLevel}.
   */
  errorIfExists?: boolean
}

declare type BatchOperation = BatchPutOperation | BatchDelOperation

/**
 * A _put_ operation to be committed by a {@link MongodbLevel}.
 */
declare interface BatchPutOperation {
  /**
   * Type of operation.
   */
  type: 'put'

  /**
   * Key of the entry to be added to the database.
   */
  key: Buffer

  /**
   * Value of the entry to be added to the database.
   */
  value: Buffer
}

/**
 * A _del_ operation to be committed by a {@link MongodbLevel}.
 */
declare interface BatchDelOperation {
  /**
   * Type of operation.
   */
  type: 'del'

  /**
   * Key of the entry to be deleted from the database.
   */
  key: Buffer
}

// TODO implement Manifest to indicate supported features

declare interface FilterOptions<KDefault> {
  gt?: KDefault
  gte?: KDefault
  lt?: KDefault
  lte?: KDefault
  limit: number
  reverse: boolean
  keyEncoding: string
  valueEncoding: string
}

declare interface IteratorOptions<KDefault> extends FilterOptions<KDefault> {
  keys: boolean
  values: boolean
  collection: Collection
}

const buildFilter = <KDefault>(
    options: FilterOptions<KDefault>
) => {
  const filter: Filter<Document> = {}
  if (options.lte !== undefined) {
    filter.key = { $lte: options.lte }
  } else if (options.lt !== undefined) {
    filter.key = { $lt: options.lt }
  }
  if (options.gte !== undefined) {
    filter.key = { ...filter.key, $gte: options.gte }
  } else if (options.gt !== undefined) {
    filter.key = { ...filter.key, $gt: options.gt }
  }
  return filter
}

const buildCursor = <KDefault>(
    collection: Collection,
    projection: Document,
    options: IteratorOptions<KDefault>
) => {
  let cursor: FindCursor | undefined
  cursor = collection
      .find(buildFilter(options), projection)
      .sort({ key: options.reverse ? -1 : 1 })
  if (options.limit > 0) {
    cursor = cursor.limit(options.limit)
  }
  return cursor
}

class MongodbIterator<KDefault, VDefault> extends AbstractIterator<
    MongodbLevel<KDefault, VDefault>,
    KDefault,
    VDefault
> {
  private cursor: FindCursor
  constructor(db: MongodbLevel<KDefault, VDefault>, collection: Collection, options: IteratorOptions<KDefault>) {
    super(db, options)
    this.cursor = buildCursor<KDefault>(
        collection,
        { key: 1, value: 1 },
        options
    )
  }

  async _next(): Promise<[KDefault, VDefault] | undefined> {
    if (await this.cursor.hasNext()) {
      const result = await this.cursor.next()
      return [result!.key, result!.value]
    }
    // Returning undefined signals that the iterator is exhausted.
    return undefined
  }
}

class MongodbKeyIterator<KDefault, VDefault> extends AbstractKeyIterator<
    MongodbLevel<KDefault, VDefault>,
    KDefault
> {
  private cursor: FindCursor
  constructor(db: MongodbLevel<KDefault, VDefault>, collection: Collection, options: IteratorOptions<KDefault>) {
    super(db, options)

    this.cursor = buildCursor<KDefault>(collection, { key: 1 }, options)
  }

  async _next(): Promise<KDefault | undefined> {
    if (await this.cursor.hasNext()) {
      const result = await this.cursor.next()
      return result!.key
    }
    return undefined
  }
}

class MongodbValueIterator<KDefault, VDefault> extends AbstractValueIterator<
    MongodbLevel<KDefault, VDefault>,
    KDefault,
    VDefault
> {
  private cursor: FindCursor
  constructor(db: MongodbLevel<KDefault, VDefault>, collection: Collection, options: IteratorOptions<KDefault>) {
    super(db, options)

    this.cursor = buildCursor<KDefault>(collection, { value: 1 }, options)
  }

  async _next(): Promise<VDefault | undefined> {
    if (await this.cursor.hasNext()) {
      const result = await this.cursor.next()
      return result!.value
    }
    return undefined
  }
}

export class MongodbLevel<
    KDefault = string,
    VDefault = string
> extends AbstractLevel<Buffer | Uint8Array | string, KDefault, VDefault> {
  private readonly collectionName: string
  private readonly dbName: string
  private readonly mongoUri: string

  private client?: MongoClient
  private collection?: Collection
  private db?: Db

  constructor(options: MongodbLevelOptions<KDefault, VDefault>) {
    // Declare supported encodings
    const encodings = { utf8: true }
    super({ encodings }, options)

    this.mongoUri = options.mongoUri
    this.dbName = options.dbName
    this.collectionName = options.collectionName
  }

  get type () {
    return 'mongodb-level'
  }

  async _open(options: MongodbLevelOpenOptions): Promise<void> {
    if (!this.mongoUri) {
      throw new ModuleError('mongoUri is required', { code: 'MONGO_URI_REQUIRED' })
    }
    if (!this.dbName) {
      throw new ModuleError('dbName is required', { code: 'DB_NAME_REQUIRED' })
    }
    if (!this.collectionName) {
      throw new ModuleError('collectionName is required', { code: 'COLLECTION_NAME_REQUIRED' })
    }
    this.client = new MongoClient(this.mongoUri)
    await this.client.connect()
    this.db = this.client.db(this.dbName)
    this.collection = this.db.collection(this.collectionName)
    await this.collection.createIndex(
        {
          key: 1,
        },
        {
          unique: true,
        }
    )
  }

  async _close(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.collection = undefined
      this.db = undefined
    }
  }

  async _put(key: Buffer, value: Buffer, options: any): Promise<void> {
    await this.collection!.updateOne(
        { key },
        { $set: { value } },
        { upsert: true, hint: 'key_1' }
    ) // TODO do not hardcode index name
  }

  async _get(key: Buffer, options: any): Promise<Buffer | undefined> {
    const result = await this.collection!.findOne({ key })
    // abstract-level >= 2.0.0: return undefined for a missing key
    // instead of throwing a LEVEL_NOT_FOUND error.
    return result ? result.value : undefined
  }

  async _del(key: Buffer, options: any): Promise<void> {
    await this.collection!.deleteOne({ key })
  }

  async _batch(batch: BatchOperation[], options: any): Promise<void> {
    const bulk = this.collection!.initializeOrderedBulkOp()

    for (const op of batch) {
      if (op.type === 'put') {
        bulk
            .find({ key: op.key })
            .upsert()
            .updateOne({ $set: { value: op.value } })
      } else if (op.type === 'del') {
        bulk.find({ key: op.key }).deleteOne()
      }
    }

    await bulk.execute()
  }

  async _clear(options: FilterOptions<KDefault>): Promise<void> {
    await this.collection!.deleteMany(buildFilter(options))
  }

  _iterator(
      options: IteratorOptions<KDefault>
  ): MongodbIterator<KDefault, VDefault> {
    return new MongodbIterator<KDefault, VDefault>(
        this,
        this.collection!,
        options
    )
  }

  _keys(options: IteratorOptions<KDefault>): MongodbKeyIterator<KDefault, VDefault> {
    return new MongodbKeyIterator<KDefault, VDefault>(this, this.collection!, options)
  }

  _values(
      options: IteratorOptions<KDefault>
  ): MongodbValueIterator<KDefault, VDefault> {
    return new MongodbValueIterator<KDefault, VDefault>(
        this,
        this.collection!,
        options
    )
  }
}