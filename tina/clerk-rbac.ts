// Admin-only collections that editors cannot mutate
const ADMIN_ONLY_COLLECTIONS = ['settings', 'branding', 'i18n', 'navbar', 'user'];

// Content collections that support ownership
const CONTENT_COLLECTIONS = ['post', 'pages', 'path'];

// Regex for collection-specific mutations: e.g. updatePost, createPages, deleteSettings
const COLLECTION_MUTATION_RE = /\b(create|update|delete)(Post|Pages|Path|Settings|Branding|I18n|Navbar|User)\b/i;

// Regex for generic mutations: updateDocument, deleteDocument, addPendingDocument
const GENERIC_MUTATION_RE = /\b(updateDocument|deleteDocument|addPendingDocument)\b/;

/**
 * Lookup owner_id for an existing document.
 */
async function getDocumentOwnerId(
  collection: string,
  relativePath: string,
  databaseClient: any
): Promise<string | null> {
  const queryName: Record<string, string> = { post: 'post', pages: 'pages', path: 'path' };
  const name = queryName[collection];
  if (!name) return null;

  try {
    const result = await databaseClient.request({
      query: `query { ${name}(relativePath: "${relativePath}") { owner_id } }`,
      variables: {}
    });
    return result?.data?.[name]?.owner_id || null;
  } catch {
    return null;
  }
}

/**
 * Enforce editor rules on GraphQL mutations.
 * Returns a rejection message string, or null if the operation is allowed.
 */
export async function enforceEditorRules(
  body: { query: string; variables?: any },
  userId: string,
  databaseClient: any
): Promise<string | null> {
  const { query, variables } = body;

  // Only check mutations
  if (!query.trimStart().startsWith('mutation')) return null;

  // Check collection-specific mutations
  const collectionMatch = query.match(COLLECTION_MUTATION_RE);
  if (collectionMatch) {
    const [, operation, collectionName] = collectionMatch;
    const normalized = collectionName.toLowerCase();

    if (ADMIN_ONLY_COLLECTIONS.includes(normalized)) {
      return `Editors cannot modify ${collectionName}`;
    }

    // Strip published from params for content collections
    if (variables?.params && 'published' in variables.params) {
      delete variables.params.published;
    }

    // Ownership checks for updates/deletes
    if ((operation === 'update' || operation === 'delete') && variables?.relativePath) {
      const ownerId = await getDocumentOwnerId(normalized, variables.relativePath, databaseClient);
      // Documents with no owner_id are admin-only (pre-migration content)
      if (!ownerId) return `This content has no owner and can only be edited by an admin`;
      if (ownerId !== userId) return `You can only ${operation} your own content`;
    }

    // Inject ownership on creates
    if (operation === 'create' && variables?.params) {
      variables.params.owner_id = userId;
    }

    return null;
  }

  // Check generic mutations (updateDocument, deleteDocument, addPendingDocument)
  const genericMatch = query.match(GENERIC_MUTATION_RE);
  if (genericMatch) {
    const collection = variables?.collection?.toLowerCase();
    if (!collection) return null;

    if (ADMIN_ONLY_COLLECTIONS.includes(collection)) {
      return `Editors cannot modify ${collection}`;
    }

    // Strip published from params
    if (variables?.params && 'published' in variables.params) {
      delete variables.params.published;
    }

    // Ownership checks
    const [, mutationType] = genericMatch;
    if ((mutationType === 'updateDocument' || mutationType === 'deleteDocument') && variables?.relativePath) {
      const ownerId = await getDocumentOwnerId(collection, variables.relativePath, databaseClient);
      if (!ownerId) return `This content has no owner and can only be edited by an admin`;
      if (ownerId !== userId) return `You can only modify your own content`;
    }

    // Inject ownership on addPendingDocument
    if (mutationType === 'addPendingDocument' && variables?.params) {
      variables.params.owner_id = userId;
    }

    return null;
  }

  return null;
}
