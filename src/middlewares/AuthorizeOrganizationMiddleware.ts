export function authorizeOrganization(req, res, next) {
  const requiredOrganization = req.params.organization;

  if (!requiredOrganization) {
    throw Error("Missing organization param");
  }

  const userOrganizations = res.locals.organizations;

  if (!userOrganizations) {
    return res.sendStatus(403);
  }

  const hasOrganization = userOrganizations.includes(requiredOrganization);

  if (!hasOrganization) {
    return res.sendStatus(403);
  }

  next();
}
