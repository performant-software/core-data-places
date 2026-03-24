import _ from 'underscore';

interface RoleInfo {
  role: string;
  userId: string | undefined;
  isAdmin: boolean;
}

/**
 * Detect the current user's role from Clerk org membership,
 * with a dev-mode override for local testing.
 */
export const getUserRole = (cms: any): RoleInfo => {
  // Dev-mode override for local testing without Clerk
  if (
    process.env.TINA_PUBLIC_IS_LOCAL === 'true' &&
    process.env.TINA_PUBLIC_DEV_ROLE
  ) {
    return {
      role: process.env.TINA_PUBLIC_DEV_ROLE,
      userId: process.env.TINA_PUBLIC_DEV_USER_ID || 'dev-user',
      isAdmin: process.env.TINA_PUBLIC_DEV_ROLE === 'org:admin',
    };
  }

  const user = cms?.api?.tina?.authProvider?.clerk?.user;

  // No Clerk user — site may not use Clerk. Default to admin (no restrictions).
  if (!user) {
    return { role: 'org:admin', userId: undefined, isAdmin: true };
  }

  const membership = _.find(
    user?.organizationMemberships,
    (org: any) => org.organization.id === process.env.TINA_PUBLIC_CLERK_ORG_ID
  );

  return {
    role: membership?.role || 'org:member',
    userId: user?.id,
    isAdmin: membership?.role === 'org:admin',
  };
};
