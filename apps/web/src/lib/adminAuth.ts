export function getAdminToken(): string | undefined {
  return process.env.ADMIN_TOKEN;
}

export function isAdminAuthorized(req: Request): boolean {
  const token = getAdminToken();
  if (!token) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${token}`;
}
